const axios2 = require('axios');
const { get } = require('mongoose');
const { use } = require('random');
const { map } = require('zod');

const BACKEND_URL = "http://localhost:3000";
const WS_URL = "ws://localhost:3001";

const axios={
  post:async(...args)=>{
    try{
      const res=await axios2.post(...args)
      return res
    }catch(e){
      return e.response
    }
  },
  get:async(...args)=>{
    try{
      const res=await axios2.get(...args)
      return res
    }catch(e){
      return e.response
    }
  },
  put:async(...args)=>{
    try{
      const res=await axios2.put(...args)
      return res
    }catch(e){
      return e.response
    }
  },
  delete:async(...args)=>{
    try{
      const res=await axios2.delete(...args)
      return res
    }catch(e){
      return e.response
    }
  }
}
describe("Authentication", () => {
  //   1. User Authentication Tests
  // ✅ Test: User can only sign up once
  // The test creates a new user with a random username and attempts to sign up again with the same username.
  // Expected Outcome:
  // The first signup should succeed.
  // The second signup should return a 400 status (duplicate username).

  test("user is able to signed up only once ", async () => {
    const username = "harkirat" + Math.random() * 10;
    const password = "1233455";

    const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      role: "Admin",
    });
    // from here onwards, we are using axios2 because axios is not working with status 400
    const updatedresponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      role: "Admin",
    });
    // return response.status of 400 BECAUSE WE ARE Given the same username
    expect(updatedresponse.status).toBe(400);// Ensure status is 400
  });

  test("signup request fails if username is empty", async () => {
    const username = "harkirat" + Math.random() * 10;
    const password = "1233455";
    const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      password,
    });
    expect(response.status).toBe(400);
  });

  test('Signin succeeds if the username and password are correct', async() => {
    const username = `kirat-${Math.random()}`
    const password = "123456"

    await axios.post(`${BACKEND_URL}/api/v1/signup`, {
        username,
        password,
        role: "Admin"
    });

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
        username,
        password
    });

    expect(response.status).toBe(200)
    expect(response.data.token).toBeDefined()
    
})

  test("signin fails if username and password are incorrect", async () => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username: "wrongusername",
      password: "123",
    });
  
    console.log("Invalid Signin Response:", response?.status, response?.data);
    
    expect([400, 403]).toContain(response.status); // Accept either 400 or 403
  });
  
});


describe("User metadata endpoints", () => {
  let token = "";
  let avatarId = "";
  //    beforeAll is used to create a user and log them in before running these tests.The token and avatarId are stored globally and reused in the tests.

  beforeAll(async () => {
    const username = "harkirat" + Math.random() * 10;
    const password = "1233455";
    await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      role: "Admin",
    });
    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });

    token = response.data.token;
    // console.log(`token: ${token}`);
// we're using avatarid  from the admin/avatar  endpoint in the  block for this particular flow because you're ensuring a valid avatar is created by an admin and reused across your tests. Here's why this approach is useful:
/*why we are passing imageurl and name in the admin/avatar endpoint?
Even though the avatar is created by an admin, you are required to pass `imageUrl` and `name` because these parameters define the specific features or characteristics of the avatar being created. Let’s break it down step by step:
### 1. **Role of the Admin**
The admin has the authority to create avatars, but their role is about enabling controlled creation rather than defining default values for every avatar. The system is designed to allow the admin to provide specific details (like `imageUrl` and `name`) dynamically, instead of relying on pre-configured or static attributes.

### 2. **Why `imageUrl`?**
- **Visual Representation:** The `imageUrl` parameter determines the avatar's appearance in the application, providing a link to the image associated with the avatar.
- **Customizability:** If the admin creates avatars for different purposes, each one can have its own unique `imageUrl`, which ensures variety in visual representation.
- **User Experience:** The application might display this avatar to end users or in administrative tools, and the `imageUrl` ensures that it looks meaningful and relatable.

Without the `imageUrl`, the avatar would lack a distinctive visual identity, and the system wouldn’t know how to display it properly.

### 3. **Why `name`?**
- **Unique Identification:** The `name` helps identify or label the avatar uniquely within the system. This can be important when managing multiple avatars or interacting with specific ones.
- **Organizational Needs:** The admin might need avatars for different roles or categories, and `name` helps differentiate them. For example, an avatar for "Timmy" might represent one set of characteristics, while another for "Lucy" might represent something else.
- **Integration in Metadata:** The `name` could be linked to additional metadata or used for logging, debugging, or analytics purposes. Giving each avatar a meaningful `name` simplifies these processes.

### 4. **Dynamic Creation**
The admin/avatar endpoint doesn’t impose static or default values for these fields because:
- The admin might need to create avatars dynamically for specific purposes or contexts in the app.
- Hardcoding attributes like `imageUrl` and `name` would reduce flexibility, making the system less adaptable to changing requirements.

### 5. **Design Principle: Separation of Concerns**
The creation process respects the design principle of separation of concerns:
- The **admin role** controls access and authorization for avatar creation.
- The **avatar attributes** (like `imageUrl` and `name`) are input parameters, allowing the system to stay modular and adaptable. This way, the admin creates avatars while still defining their specific features.

Passing `imageUrl` and `name` ensures that every avatar created is tailored, usable, and meaningful, even though the admin is the one initiating the creation. It’s part of building a flexible and scalable system. Let me know if you'd like to dive deeper into any aspect!
*/
  const avatarresponse = await axios.post(
    `${BACKEND_URL}/api/v1/admin/avatar`,
    {
      imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
      name: "Timmy",
    },{
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  );
  console.log("Avatar Response:", avatarresponse.data); // Debugging
  avatarId = avatarresponse.data.avatarId||avatarresponse.data.id;
  console.log(`avatarId: ${avatarId}`);

  });
  // this is an authorization end point it should be hit with an authorization header
  // /✅ Test: User can't update metadata with wrong avatar ID
  // The test attempts to update user metadata with an invalid avatar ID.
  // Expected Outcome:
  // The response should have a 400 status.

  test("user can't update their metadata with a wrong avatar id", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/user/metadata`,
      {
        avatarId: "1231332",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    expect(response.status).toBe(400);
  });
  // this is an authorization end point it should be hit with an authorization header
  // ✅ Test: Metadata request fails if avatarId is missing
  // The test sends a metadata update request without an avatar ID.
  // Expected Outcome:
  // The response should have a 400 status.

  test("user metadata fails if avatarId is not provided", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/user/metadata`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    expect(response.status).toBe(400);
  });
  // this is an authorization end point it should be hit with an authorization header

  test("user metadata fails if avatarId is not a number", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/user/metadata`,
      {
        avatarId: "abc",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    expect(response.status).toBe(400);
  });
  // this is an authorization end point it should be hit with an authorization header

  test("user metadata fails if avatarId is a negative number", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/user/metadata`,
      {
        avatarId: -1,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    expect(response.status).toBe(400);
  });
  // if auth header is not provided
  test("user can't be able to update the metadata if auth header is not provided", async () => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
      avatarId,
    });
    expect(response.status).toBe(403);
  });
  // this is an authorization end point it should be hit with an authorization header// authientication end point kyuki user signin ho chuka hai
  test("user can update their metadata if with the right avatarId", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/user/metadata`,
      {
        avatarId: avatarId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    expect(response.status).toBe(200);
  });
});

describe("user avatar information", () => {
  let token;
  let avatarId;
  let userId;

  beforeAll(async () => {
    const username = "harkirat" + Math.random() * 10;
    const password = "1233455";
    const signupresponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      role: "Admin",
    });
    userId = signupresponse.data.userId;
    // console.log(`userId: ${userId}`);
    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });
    token = response.data.token;

    const avatarresponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/avatar`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
        name: "Timmy",
      },{
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    );
    avatarId = avatarresponse.data.avatarId||avatarresponse.data.id;
    // console.log(`avatarId: ${avatarId}`);
  });

  test("get back avatar infromation for a user", async () => {
    const response = await axios.get(
      `${BACKEND_URL}/api/v1/user/metadata/bulk?ids=[${userId}]`
    );
    expect(response.data.avatars[0].userId).toBe(userId);
  });

  test("available avtars lists the recently created avatar", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/avatars`);
    expect(response.data.avatars.length).not.toBe(0);
    const currentAvatar = response.data.avatars.find((x) => x.id == avatarId);//  find method searches through the  array and returns the first element that satisfies the condition provided in the callback function. In this case, the condition is x=>x.id==avatarId
    expect(currentAvatar).toBeDefined();
  });
});


describe("space information", () => {
  let mapId;
  let element1Id;
  let element2Id;
  let userId;
  let adminToken;
  let adminId;
  let userToken;
  beforeAll(async () => {
    console.log("Starting beforeAll setup...");
    const username = "harkirat" + Math.random() * 10;
    const password = "1233455";
    console.log("Signing up admin...");
    const signupresponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      role: "Admin",
    });
    console.log("Admin signed up", signupresponse.data);
    adminId = signupresponse.data.userId;
    console.log("Signing in admin...");
    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });
    console.log("Admin signed in", response.data);
    adminToken = response.data.token;
    console.log("Signing up user...");
    const usersignupresponse = await axios.post(
      `${BACKEND_URL}/api/v1/signup`,
      {
        username: username + "user",
        password,
        role: "User",
      }
    );
    console.log("User signed up", usersignupresponse.data);
    userId = usersignupresponse.data.userId;
    console.log("Signing in user...");
    const usersigninresponse = await axios.post(
      `${BACKEND_URL}/api/v1/signin`,
      {
        username: username + "user",
        password,
      }
    );
    console.log("User signed in", usersigninresponse.data);
    userToken = usersigninresponse.data.token;
    console.log("userToken", userToken);

    //create an element
    console.log("Creating elements...");
    const element1Response = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true, // weather or not the user can sit on top of this element (is it considered as a collission or not)
      },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );
    console.log("Element 1 created", element1Response.data);
    element1Id = element1Response.data.id;
    const element2Response = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
        "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true, // weather or not the user can sit on top of this element (is it considered as a collission or not)
      },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );
    
    console.log("Element 2 created", element2Response.data);
    element2Id = element2Response.data.id;
    console.log("element2Id",typeof element2Id)
//create a map
    const mapResponse =await  axios.post(
      `${BACKEND_URL}/api/v1/admin/map`,
      {
        thumbnail: "https://ml4h.cc/2022/static/images/gathertown_layout.png",
        dimensions: "100x200",
        name: "100 person interview room",
        defaultElements: [
          {
            elementId: element1Id,
            x: 20,
            y: 20,
          },
          {
            elementId: element2Id,
            x: 18,
            y: 20,
          },
          {
            elementId: element1Id,
            x: 19,
            y: 19,
          },
          {
            elementId: element2Id,
            x: 19,
            y: 20,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );

    mapId = mapResponse.data.id;
    console.log("Map created", mapResponse.data);
    console.log("mapId", mapId);
  },30000);

  test("user is able to create a space",async()=>{
    const response=await axios.post(`${BACKEND_URL}/api/v1/space`,{
      name:"test",
      dimensions:"100x200",
      mapId:mapId
    },{
      headers:{
        Authorization:`Bearer ${userToken}`
      }
    })
    expect(response.status).toBe(200)
    expect(response.data.spaceId).toBeDefined()
  },30000)
  test("user is able to create a space without giving mapId", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "test",
        dimensions: "100x200",
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(response.data.spaceId).toBeDefined();
  });

  test("user is not able to create a space without giving mapId and dimenesions", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "test",
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(response.status).toBe(400);
  });

  test("user is not able to delete a space that doesn't exist", async () => {
    const response = await axios.delete(
      `${BACKEND_URL}/api/v1/space/randomIddoesntExist`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(response.status).toBe(400);
  });
  test("user is able to delete a space that exists", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "test",
        dimensions: "100x200",
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    const deleteresponse = await axios.delete(
      `${BACKEND_URL}/api/v1/space/${response.data.spaceId}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(deleteresponse.status).toBe(200);
  });

  test("user is not able to delete a space that was created by another user", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "test",
        dimensions: "100x200",
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    const deleteresponse = await axios.delete(
      `${BACKEND_URL}/api/v1/space/${response.data.spaceId}`,
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );
    expect(deleteresponse.status).toBe(403);
  });

  test("admin has no spaces initially", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
    console.log("Space List Response:", response.data); // Debugging log
   expect(response.data).toBeDefined();
   expect(response.data.spaces.length).toBe(0);
   expect(response.data.spaces).toBeDefined();
    
  });

  test("admin has no space initially so create a new space", async () => {
    // A POST request is made to the backend API () to create a new space.
    const spaceCreatedresponse = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100x200",
      },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );
    console.log("Create Space Response:", spaceCreatedresponse.data);
    // Another get request is made to the same endpoint () to fetch all spaces associated with the admin.
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
    console.log("Fetch Spaces Response:", response.data);
    const filteredspace = response.data.spaces.find(
      (x) => x.id == spaceCreatedresponse.data.spaceId
    );
  
  
    expect(filteredspace).toBeDefined();
    expect(response.data.spaces.length).toBeGreaterThan(0);
  });
});

describe("Arena endpoints", () => {
  let mapId;
  let element1Id;
  let element2Id;
  let userId;
  let adminToken;
  let adminId;
  let userToken;
  let spaceId;
  beforeAll(async () => {
    const username = "harkirat" + Math.random() * 10;
    const password = "1233455";
    const signupresponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      role: "admin",
    });
    adminId = signupresponse.data.userId;
    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });
    adminToken = response.data.token;
    const usersignupresponse = await axios.post(
      `${BACKEND_URL}/api/v1/signup`,
      {
        username: username + "user",
        password,
        role: "user",
      }
    );
    userId = usersignupresponse.data.userId;
    const usersigninresponse = await axios.post(
      `${BACKEND_URL}/api/v1/signin`,
      {
        username: username + "user",
        password,
      }
    );
    userToken = usersigninresponse.data.token;

    //create an element
    const element1Response = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true, // weather or not the user can sit on top of this element (is it considered as a collission or not)
      },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );
    const element2Response = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true, // weather or not the user can sit on top of this element (is it considered as a collission or not)
      },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );

    element1Id = element1Response.data.id;
    element2Id = element2Response.data.id;

    const mapResponse = axios.post(
      `${BACKEND_URL}/api/v1/admin/map`,
      {
        thumbnail: "https://thumbnail.com/a.png",
        dimensions: "100x200",
        name: "100 person interview room",
        defaultElements: [
          {
            elementId: "element1Id",
            x: 20,
            y: 20,
          },
          {
            elementId: "element2Id",
            x: 18,
            y: 20,
          },
          {
            elementId: "element1Id",
            x: 19,
            y: 20,
          },
          {
            elementId: "element2Id",
            x: 18,
            y: 20,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );
    mapId = mapResponse.data.id;
    //create a space 
    const spaceResponse = axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "test",
        dimensions: "100x200",
        mapId: mapId,
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    )
    spaceId = spaceResponse.spaceId;
  })

  test("incorrect spaceId returns 400", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/13245`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    expect(response.statusCode).toBe(400);
  });

  test("correct spaceId returns all the elements", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    expect(response.data.dimensions).toBe("100x200");
    expect(response.data.elements.length).toBe(4)
  });
  test("delete endpoint is able to delete an element", async () => {
    //The server returns information about the space, including dimensions (e.g., "100x200") and an array of elements inside the space (elememts).
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    // This endpoint deletes a specific element from a space
     await axios.delete(`${BACKEND_URL}/api/v1/space/element`, {
      spaceId: spaceId,
      elementId: response.data.elements[0].id,
      headers: {
        Authorization: `Bearer ${userToken}`,
      }
    });
    //You should observe a change in the  array (one less element, since one has been deleted).
    const newresponse = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    expect(newresponse.data.dimensions).toBe("100x200");
    expect(newresponse.data.elements.length).toBe(3)// since we have deleetedd one element
  });
  test("adding an element fails if the element lies outside the dimensions", async () => {

     await axios.post(`${BACKEND_URL}/api/v1/space/element`, {
      spaceId: spaceId,
      elementId: element1Id,
      x:"50000",
      y:"20000",
    },{
      headers: {
        Authorization: `Bearer ${userToken}`,
      }
    }
  );
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    expect(response.statusCode).toBe(400);
  });
  test("adding an element works as expected", async () => {

     await axios.post(`${BACKEND_URL}/api/v1/space/element`, {
      spaceId: spaceId,
      elementId: element1Id,
      x:"50",
      y:"20",
    },{
      headers: {
        Authorization: `Bearer ${userToken}`,
      }
    }
  );
   //The server returns information about the space, including dimensions (e.g., "100x200") and an array of elements inside the space (elememts).
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    expect(response.data.elements.length).toBe(4)//hmne ek delete kr diya tha TO 3 bache the ab add kiya hai so  vpas se 4 ho gye
  });
});

describe("Admin endpoints", () => {
  let userId;
  let adminToken;
  let adminId;
  let userToken; 

  beforeAll(async () => {
    const username = "harkirat" + Math.random() * 10;
    const password = "1233455";
    const signupresponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      role: "Admin",
    });
    adminId = signupresponse.data.userId;
    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });
    adminToken = response.data.token;
    const usersignupresponse = await axios.post(
      `${BACKEND_URL}/api/v1/signup`,
      {
        username: username + "user",
        password,
        role: "User",
      }
    );
    userId = usersignupresponse.data.userId;
    const usersigninresponse = await axios.post(
      `${BACKEND_URL}/api/v1/signin`,
      {
        username: username + "user",
        password,
      }
    );
    userToken = usersigninresponse.data.token;
  })

  test("user is not able to hit admin endpoints",async ()=>{
    //create an element
    const elementResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
      "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
      "width": 1,
      "height": 1,
      "static": true // weather or not the user can sit on top of this element (is it considered as a collission or not)
    },{
      headers:{
        Authorization:`Bearer ${userToken}`
      }
    })
 /// update a element
    const updateElementResponse = await axios.put(`${BACKEND_URL}/api/v1/admin/element/123`,{
      "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE"	
    },{
      headers:{
        Authorization:`Bearer ${userToken}`
      }
    })
  // update an avatar
    const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`,{
      "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE"	,
      "name": "Timmy"
    },{
      headers:{
        Authorization:`Bearer ${userToken}`
      }
    })
  //create a map
    const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`,{
      "thumbnail": "https://thumbnail.com/a.png",
      "dimensions": "100x200",
      "defaultElements": []
    },{
      headers:{
        Authorization:`Bearer ${userToken}`
      }
    })
    expect(updateElementResponse.statusCode).toBe(403);
    expect(elementResponse.statusCode).toBe(403);
    expect(avatarResponse.statusCode).toBe(403);
    expect(mapResponse.statusCode).toBe(403);
  })

  test("Admin is able to hit admin endpoints",async ()=>{
    //create an element
    const elementResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
      "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
      "width": 1,
      "height": 1,
      "static": true // weather or not the user can sit on top of this element (is it considered as a collission or not)
    },{
      headers:{
        Authorization:`Bearer ${adminToken}`
      }
    })
 
  // update an avatar
    const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`,{
      "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE"	,
      "name": "Timmy"
    },{
      headers:{
        Authorization:`Bearer ${adminToken}`
      }
    })
  //create a map
    const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`,{
      "thumbnail": "https://thumbnail.com/a.png",
      "dimensions": "100x200",
      "defaultElements": []
    },{
      headers:{
        Authorization:`Bearer ${adminTokenToken}`
      }
    })

    expect(elementResponse.statusCode).toBe(200);
    expect(avatarResponse.statusCode).toBe(200);
    expect(mapResponse.statusCode).toBe(200);
  })

  test("admin is able to update the imageUrl of an avatar",async ()=>{
    const elementResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
      "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
      "width": 1,
      "height": 1,
      "static": true // weather or not the user can sit on top of this element (is it considered as a collission or not)
    },{
      headers:{
        Authorization:`Bearer ${adminToken}`
      }
    })

    const updateElementResponse = await axios.put(`${BACKEND_URL}/api/v1/admin/element/${elementResponse.data.id}`,{
      "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE"	
    },{
      headers:{
        Authorization:`Bearer ${adminTokenToken}`
      }
    })
    expect(updateElementResponse.statusCode).toBe(200);
  })

})

describe("websocket tests",()=>{
  
  let adminToken;
  let adminId;
  let userToken;  
  let userId;
  let mapId;
  let spaceId;
  let element1Id;
  let element2Id;
  let ws1;
  let ws2;
  let ws1message=[];
  let ws2message=[];
  let userx;
  let usery;
  let adminx;
  let adminy;

  // wait for and poplatest message menas wait first for a message to be received and then poplatest message
  function waitForandpoplatestmeassge(message){
    return new Promise((resolve,reject)=>{
      if(message.length>0){
        resolve(message.shift())
        return
      }else{
        let interval =setInterval(()=>{
          if(message.length>0){
            resolve(message.shift())//resolve the promise with the latest message//shift()-removes the first element
            clearInterval(interval)
          }
        },100)
      }
    })
  }
  async function SetupHTTTP(){
    const username=`kirat-${Math.random()}`;
    const password="123456";
    const adminSignupResponse=await axios.post(`${BACKEND_URL}/api/v1/signup`,{
      username,
      password,
      role:"Admin"
    })
    const adminSigninResponse=await axios.post(`${BACKEND_URL}/api/v1/signin`,{
      username,
      password
    })
    adminToken=adminSigninResponse.data.token;
    adminId=adminSignupResponse.data.userId;
    const userSignupResponse=await axios.post(`${BACKEND_URL}/api/v1/signup`,{
      username:`${username}-user`,
      password,
      role:"User"
    })
    const userSigninResponse=await axios.post(`${BACKEND_URL}/api/v1/signin`,{
      username:`${username}-user`,
      password
    })
    userId=userSignupResponse.data.userId;
    userToken=userSigninResponse.data.token;
    const element1Response = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true, // weather or not the user can sit on top of this element (is it considered as a collission or not)
      },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );
    const element2Response = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true, // weather or not the user can sit on top of this element (is it considered as a collission or not)
      },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );

    element1Id = element1Response.data.id;
    element2Id = element2Response.data.id;

    const mapResponse = axios.post(
      `${BACKEND_URL}/api/v1/admin/map`,
      {
        thumbnail: "https://thumbnail.com/a.png",
        dimensions: "100x200",
        name: "100 person interview room",
        defaultElements: [
          {
            elementId: "element1Id",
            x: 20,
            y: 20,
          },
          {
            elementId: "element2Id",
            x: 18,
            y: 20,
          },
          {
            elementId: "element1Id",
            x: 19,
            y: 20,
          },
          {
            elementId: "element2Id",
            x: 18,
            y: 20,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );
    mapId = mapResponse.data.id;
    //create a space
    const spaceResponse = axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "test",
        dimensions: "100x200",
        mapId: mapId,
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    )
    spaceId = spaceResponse.spaceId;
  }

 async function SetupWs(){
    ws1 = new WebSocket(WS_URL);
    
    await new promise(r=>{
      ws1.onopen = r;
    })

    ws1.onmessage=(e)=>{
      ws1message.push(JSON.parse(e.data))
    }

    ws2 = new WebSocket(WS_URL);

    await new promise(r=>{
      ws2.onopen = r;
      })
      ws2.onmessage=(e)=>{
        ws2message.push(JSON.parse(e.data))
      }
   
    }
  beforeAll(async ()=>{
    SetupHTTTP()
    SetupWs()
  })

  test("get back ack for joining the space",async ()=>{
      //CLIENT SEND EVENT--join a space
      ws1.send(JSON.stringify({
        "type": "join",
        "payload": {
          "spaceId": spaceId,
          "token":adminToken
        }
    }))
    let message1=await waitForandpoplatestmeassge(ws1message)

      ws2.send(JSON.stringify({
        "type": "join",
        "payload": {
          "spaceId": spaceId,
          "token":userToken
        }
    }))

    let message2=await waitForandpoplatestmeassge(ws2message)
    let message3=await waitForandpoplatestmeassge(ws1message)

    expect(message1.type).toBe("space-joined")
    expect(message2.type).toBe("space-joined")
    expect(message1.payload.users.length).toBe(0)
    expect(message1.payload.users.length).toBe(1)
    expect(message3.type).toBe("user-join")
    expext(message3.payload.x).toBe(messsage2.payload.spawn.x)
    expect(message3.payload.y).toBe(messsage2.payload.spawn.y)
    expect(message3.payload.userId).toBe(userId)

    let adminx=message1.payload.spawn.x
    let adminy=message1.payload.spawn.y

    let userx=message2.payload.spawn.x
    let usery=message2.payload.spawn.y
  })

  test("user should not be able to move across the boundary of the wall",async ()=>{
        ws1.send(JSON.stringify({
                "type": "movement",
                "payload": {
                  "x":10000000,
                  "y":100000
                }
            }))

      const message=await waitForandpoplatestmeassge(ws1message)
      expect(message.type).toBe("movement-denied")
      expect(message.payload.x).toBe(adminx)
      expect(message.payload.y).toBe(adminy)
  })

  test("user should not be able to move two blocks at the same time",async ()=>{
        ws1.send(JSON.stringify({
                "type": "movement",
                "payload": {
                  "x":adminx +2,
                  "y":adminy
                }
            }))

      const message=await waitForandpoplatestmeassge(ws1message)
      expect(message.type).toBe("movement-denied")
      expect(message.payload.x).toBe(adminx)
      expect(message.payload.y).toBe(adminy)
  })

  test("current movement should be broadcasted to the other sockets in the room",async ()=>{
        ws1.send(JSON.stringify({
                "type": "movement",
                "payload": {
                  "x":adminx +1,
                  "y":adminy,
                "userId":adminId
                }
            }))

      const message=await waitForandpoplatestmeassge(ws2message)
      expect(message.type).toBe("movement")
      expect(message.payload.x).toBe(adminx+1)
      expect(message.payload.y).toBe(adminy)
  })

  test("if a user leaves the other user receives a  leave event",async ()=>{
        ws1.close()

      const message=await waitForandpoplatestmeassge(ws2message)
      expect(message.type).toBe("user-left")
      expect(message.payload.userId).toBe(adminId)
    
  })

})