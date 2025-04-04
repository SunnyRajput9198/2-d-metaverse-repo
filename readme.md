### 2.1 designing the api
 # This is a well-structured **API reference** for a 2D metaverse app. Here's a detailed breakdown of the endpoints:
## 🔐 **Auth Page**
These endpoints are used for user authentication and account creation.

## 1. **Signup**
- **Endpoint:** `POST /api/v1/signup`
- **Request:**
.json
{
  "username": "harkirat",
  "password": "123random",
  "type": "admin" // or "user"
}
- **Response:**  
✅ 200 → Successful signup → `{ "userId": "1" }`  
❌ 400 → Invalid input  

**Purpose:**  
- Creates a new user account (either `admin` or `user`).  
- If successful, returns a `userId`.

### 2. **Signin**
- **Endpoint:** `POST /api/v1/signin`
- **Request:**
.json
{
  "username": "harkirat",
  "password": "123random"
}
- **Response:**  
✅ 200 → Successful login → `{ "token": "123mkadsfjaidsj90120j0dj0jkq0dwj" }`  
❌ 403 → Unauthorized (wrong credentials)  

**Purpose:**  
- Logs in the user and provides a `JWT token` for authorization.  
- The token should be used in the `Authorization` header for other protected endpoints.

---

## 👤 **User Information Page**
Endpoints to update and retrieve user details generally designed for the user.

### 3. **Update Metadata**
- **Endpoint:** `POST /api/v1/user/metadata`
- **Request:**
.json
{
  "avatarId": "123"
}
- **Response:**  
✅ 200 → Success  
❌ 400 → Invalid input  
❌ 403 → Unauthorized  

**Purpose:**  
- Allows the user to update their avatar or other metadata.

---

### 4. **Get Available Avatars**
- **Endpoint:** `GET /api/v1/avatars`
- **Response:**
```json
{
  "avatars": [{
     "id": 1,
     "imageUrl": "https://image.com/avatar1.png",
     "name": "Timmy"
  }]
}
```
**Purpose:**  
- Returns a list of available avatars with their `id`, `imageUrl`, and `name`.

---

### 5. **Get Other Users' Metadata**
- **Endpoint:** `GET /api/v1/user/metadata/bulk?ids=[1,3,55]`
- **Response:**
```json
{
  {
  "avatars": [{
    "userId": 1,
    "imageUrl": "https://image.com/cat.png"
  }, {
    "userId": 3,
    "imageUrl": "https://image.com/cat2.png"
  }, {
    "userId": 55,
    "imageUrl": "https://image.com/cat3.png"
  }]
}
}
```
**Purpose:**  
- Fetches metadata (like avatars) of other users by their `userId`.

---

## 🏠 **Space Dashboard**
Endpoints for managing virtual spaces.

### 6. **Create a Space**
- **Endpoint:** `POST /api/v1/space`
- **Request:**
```json
{
  "name": "Test",
  "dimensions": "100x200",
  "mapId": "map1"
}
```
- **Response:**  
✅ 200 → `{ "spaceId": "xlapwep1" }`  
❌ 400 → Invalid input  

**Purpose:**  
- Creates a new space with defined dimensions and map ID and returns the space ID.

---

### 7. **Delete a Space**
- **Endpoint:** `DELETE /api/v1/space/:spaceId`
- **Response:**  
✅ 200 → Success  
❌ 400 → Invalid input  

**Purpose:**  
- Deletes a specific space using its `spaceId`.

---

### 8. **Get My Existing Spaces**
- **Endpoint:** `GET /api/v1/space/all`
- **Response:**
```json
{
 {
  "spaces": [{
     "id": 1,
		 "name": "Test",
	   "dimensions": "100x200",
	   "thumbnail": "https://google.com/cat.png"
	}, {
	   "id": 2,
		 "name": "Test",
	   "dimensions": "100x200",
	   "thumbnail": "https://google.com/cat.png"
	}]
}
}
```
**Purpose:**  
- Retrieves all spaces created by the user.

---

## 🏟️ **Arena**
Endpoints to manage elements within a space.

### 9. **Get a Space**
- **Endpoint:** `GET /api/v1/space/:spaceId`
- **Response:**
```json
{
  "dimensions": "100x200",
  "elements": [{
    "id": 1,
    "element": {
      "id": "chair1",
      "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
      "static": false,
      "height": 1,
      "width": 1
    },
    "x": 20,
    "y": 20
  }]
}
```
**Purpose:**  
- Returns details about a specific space, including elements and their positions.

---

### 10. **Add an Element**
- **Endpoint:** `POST /api/v1/space/element`
- **Request:**
```json
{
  "elementId": "chair1",
  "spaceId": "123",
  "x": 50,
  "y": 20
}
```
- **Response:**  
✅ 200 → Success  
❌ 400 → Invalid input  

**Purpose:**  
- Adds an element (like a chair or table) to a space.

---

### 11. **Delete an Element**
- **Endpoint:** `DELETE /api/v1/space/element`
- **Request:**
```json
{
  "id": "1"
}
```
- **Response:**  
✅ 200 → Success  
❌ 400 → Invalid input  

**Purpose:**  
- Removes an element from a space.

---

### 12. **See All Available Elements**
- **Endpoint:** `GET /api/v1/elements`
- **Response:**
```json
{
  "elements": [{
     "id": "chair1",
     "imageUrl": "https://image.com/chair.png",
     "width": 20,
     "height": 20,
     "static": true
  }]
}
```
**Purpose:**  
- Returns all available elements (chairs, tables, etc.).

---

## 🛠️ **Admin/Map Creator Endpoints**
For admin-level modifications.

### 13. **Create an Element**
- **Endpoint:** `POST /api/v1/admin/element`
- **Request:**
```json
{
  "imageUrl": "https://image.com/chair.png",
  "width": 1,
  "height": 1,
  "static": true// weather or not the user can sit on top of this element (is it considered as a collission or not)
}
```
- **Response:**  
✅ `{ "id": "elementId" }`  

**Purpose:**  
- Creates a new interactive element (like furniture).

---

### 14. **Update an Element**
- **Endpoint:** `PUT /api/v1/admin/element/:elementId`
- **Request:**
```json
{
  "imageUrl": "https://image.com/chair.png"
}
```
**Purpose:**  
- Updates an element’s properties.

---

### 15. **Create an Avatar**
- **Endpoint:** `POST /api/v1/admin/avatar`
- **Request:**
```json
{
  "imageUrl": "https://image.com/avatar.png",
  "name": "Timmy"
}
```
- **Response:**  
✅ `{ "avatarId": "123" }`  

**Purpose:**  
- Creates a new avatar.

---

### 16. **Create a Map**
- **Endpoint:** `POST /api/v1/admin/map`
- **Request:**
```json
{
  "thumbnail": "https://thumbnail.com/a.png",
  "dimensions": "100x200",
  "name": "Test Room",
  "defaultElements": [{ "elementId": "chair1", "x": 20, "y": 20 }]
}
```
- **Response:**  
✅ `{ "id": "mapId" }`  

**Purpose:**  
- Creates a new map with predefined elements.

---

## ✅ **Authorization**
All authenticated requests need:  
```json
{
  "authorization": "Bearer token_received_after_login"
}
```


### 2.2 websocket schema
This section outlines **real-time communication** between the **client** (your metaverse app) and the **server** using **WebSocket**-style messages. This is essential for managing live interactions like user movement, joining/leaving spaces, and handling collisions.

## 🚀 **Client Sent Events**  
These are messages sent **from the client (frontend)** to the **server** to trigger actions.

### 1. **Join a Space**  
**Purpose:**  
- Allows a user to join a specific space in the metaverse.

**Message:**
```json
{
    "type": "join",
    "payload": {
        "spaceId": "123", // ID of the space to join
        "token": "token_received_during_login" // Authorization token
    }
}
```
### ✅ How It Works:
1. Client sends this message after the user logs in and wants to join a space.
2. The server validates the token and spaceId:
   - If valid → Server sends back a `space-joined` event.
   - If invalid → Server rejects the request.

---

### 2. **Movement**  
**Purpose:**  
- Sent when a user wants to move within the space.

**Message:**
```json
{
    "type": "move",
    "payload": {
        "x": 2,
        "y": 3
    }
}
```
### ✅ How It Works:
1. Client sends this when the user tries to move to `(x = 2, y = 3)`.
2. The server checks:
   - Is the new position within boundaries?  
   - Is the new position free or occupied by another element/user?  
3. Server responds:
   - If successful → Sends back a `movement` event.  
   - If failed → Sends back a `movement-rejected` event.  

---

## 🌐 **Server Sent Events**  
These are messages sent **from the server** to the **client** in response to client actions or state changes in the space.

---

### 3. **Space Joined**  
**Purpose:**  
- Notifies the client that the user has successfully joined a space.  

**Message:**
```json
{
    "type": "space-joined",
    "payload": {
        "spawn": {
            "x": 2,
            "y": 3 // User's initial spawn point
        },
        "users": [{
            "id": 1 // ID of other users currently in the space
        }]
    }
}
```
### ✅ How It Works:
1. Server confirms the user has successfully joined.
2. Sends the starting position (`x = 2, y = 3`) where the user will appear.
3. Provides a list of other users currently in the same space.  
4. Client updates the UI to reflect the user's position and other active users.

---

### 4. **Movement Rejected**  
**Purpose:**  
- Sent when the user’s movement is blocked by a wall or other object.

**Message:**
```json
{
   "type": "movement-rejected",
   "payload": {
       "x": 2,
       "y": 3 // The last valid position to which the user will be reset
   }
}
```
### ✅ How It Works:
1. Server rejects movement if:
   - User tries to walk through a wall.  
   - User collides with another user.  
   - User tries to sit on a static element.  
2. Server sends this event to push the user back to their last valid position.

---

### 5. **Movement**  
**Purpose:**  
- Broadcasts the user's movement to other connected clients.

**Message:**
```json
{
    "type": "movement",
    "payload": {
      "x": 1,
      "y": 2,
      "userId": "123" // ID of the user who moved
    }
}
```
### ✅ How It Works:
1. When a user successfully moves:
   - Server broadcasts the new position to all connected users.
2. Client updates the UI to reflect the new position.

---

### 6. **Leave**  
**Purpose:**  
- Informs the client that a user has left the space.

**Message:**
```json
{
    "type": "user-left",
    "payload": {
        "userId": 1
    }
}
```
### ✅ How It Works:
1. Server detects that a user has left the space.
2. Broadcasts this event to remove the user from the UI.

---

### 7. **Join Event**  
**Purpose:**  
- Notifies when a new user joins the space.

**Message:**
```json
{
    "type": "user-join",
    "payload": {
        "userId": 1,
        "x": 1,
        "y": 2 // Initial position of the new user
    }
}
```
### ✅ How It Works:
1. When a new user joins the space:
   - Server sends this to all connected users.
2. Client updates the UI to reflect the new user's position.

---

## ✅ **Summary**
| Type | Direction | Purpose |
|-------|-----------|---------|
| `join` | Client → Server | Join a space |
| `move` | Client → Server | Request to move within the space |
| `space-joined` | Server → Client | Confirms user joined space |
| `movement-rejected` | Server → Client | Movement blocked due to collision |
| `movement` | Server → Client | Broadcasts new position of a user |
| `user-left` | Server → Client | Notifies when a user leaves |
| `user-join` | Server → Client | Notifies when a user joins |

---

## 🔥 **How It Works (Flow):**  
1. **User joins** → Client sends `join` event → Server confirms with `space-joined`  
2. **User moves** → Client sends `move` event →  
   - If valid → Server sends `movement`  
   - If invalid → Server sends `movement-rejected`  
3. **Other users** → Receive `movement`, `user-join`, or `user-left` events in real time  

---

This is a typical **WebSocket-based event flow** — perfect for real-time interaction in a 2D metaverse! 🌟

### 2.3 DB schema
# Database Models Overview

This document explains the database models used in the project in simple terms.

---

## **User**
This model represents a user in the system.

| Field      | Type   | Description                                   |
|------------|--------|-----------------------------------------------|
| `id`       | String | Unique ID for the user (automatically generated). |
| `username` | String | User’s unique name.                           |
| `password` | String | User’s unique password.                       |
| `avatarId` | String | ID of the user's avatar (optional).            |
| `role`     | Role   | User's role (`Admin` or `User`).               |

---

## **Space**
This model represents a virtual space.

| Field        | Type   | Description                                      |
|--------------|--------|--------------------------------------------------|
| `id`         | String | Unique ID for the space (automatically generated). |
| `name`       | String | Name of the space.                               |
| `width`      | Int    | Width of the space.                              |
| `height`     | Int    | Height of the space (optional).                   |
| `thumbnail`  | String | Link to the space's thumbnail image (optional).   |

---

## **spaceElements**
This model links elements to a specific space.

| Field        | Type   | Description                                      |
|--------------|--------|--------------------------------------------------|
| `id`         | String | Unique ID for the space element (automatically generated). |
| `elementId`  | String | ID of the linked element.                        |
| `spaceId`    | String | ID of the linked space.                          |
| `x`          | Int    | X-coordinate position of the element in the space. |
| `y`          | Int    | Y-coordinate position of the element in the space. |

---

## **Element**
This model represents individual elements that can be added to spaces or maps.

| Field        | Type   | Description                                      |
|--------------|--------|--------------------------------------------------|
| `id`         |String | Unique ID for the element (automatically generated). |
| `width`      | Int    | Width of the element.                            |
| `height`     | Int    | Height of the element.                           |
| `imageUrl`   | String | Link to the element’s image.                     |

---

## **Map**
This model represents a virtual map.

| Field        | Type   | Description                                      |
|--------------|--------|--------------------------------------------------|
| `id`         | String | Unique ID for the map (automatically generated). |
| `width`      | Int    | Width of the map.                                |
| `height`     | Int    | Height of the map.                               |
| `name`       | String | Name of the map.                                 |

---

## **mapElements**
This model links elements to a specific map.

| Field        | Type   | Description                                      |
|--------------|--------|--------------------------------------------------|
| `id`         | String | Unique ID for the map element (automatically generated). |
| `mapId`      | String | ID of the linked map.                            |
| `elementId`  | String | ID of the linked element (optional).               |
| `x`          | Int    | X-coordinate position of the element in the map (optional). |
| `y`          | Int    | Y-coordinate position of the element in the map (optional). |

---

## **Avatar**
This model represents a user avatar.

| Field        | Type   | Description                                         |
|--------------|--------|--------------------------------------------------   |
| `id`         | String | Unique ID for the avatar (automatically generated). |
| `imageUrl`   | String | Link to the avatar’s image (optional).              |
| `name`       | String | Name of the avatar (optional).                      |

---

## **Role (Enum)**
Defines the type of user roles:

- **Admin** – Full access to the system.  
- **User** – Limited access to the system.  

---

This setup allows the system to manage users, spaces, maps, and elements efficiently.


### 3.TDD-test-driven-development
# TDD-test-driven-development
TDD is a software development process that emphasizes writing tests before writing the actual code.
## Describe blocks-:
-  describe blocks are used to group related tests together
-  this describe is used to check authentication whether the user signin and signup endpoints works
-  Organizes tests into logical groups.
-  Makes it easier to understand and debug test failures.
-  Improves the structure of test reports.
-  Allows you to apply beforeAll, afterAll, beforeEach, and afterEach hooks to a specific group of tests.

## test-block-:
-  test blocks are used to define individual test cases.
-  Each test block is a separate test case.
-  Each test block can contain multiple assertions.
The `test` block in JavaScript test libraries like **Jest**, **Mocha**, and **Vitest** is used to **define a single test case**.

---

## **Syntax:**
test('Description of the test', () => {
  // Test logic
});

## **Purpose:**
1. It defines an **individual test case**.  
2. The test case includes:  
   - **Description** → What the test is doing.  
   - **Test Logic** → Code to execute the test.  
   - **Assertions** → Expected outcome of the test (e.g., `expect`).  
3. Helps check if the code behaves as expected.  
4. Reports whether the test **passes** or **fails**.  

---

## **Example 2: Test with API Response**
Test if an API call returns the expected response:
```javascript
const axios = require('axios');

test('should fetch user data', async () => {
  const response = await axios.get('https://jsonplaceholder.typicode.com/users/1');
  expect(response.data.id).toBe(1);
});
```

✅ If the user ID matches `1`, the test **passes**.  
❌ If it doesn't match, the test **fails**.  

---

## **Assertions in Test Block**
You use `expect()` to define the expected outcome:

| Method             |              Description            | Example |
|--------------------|-------------------------------------|---------|
| `toBe(value)`      | Checks if values are equal          | `expect(2 + 2).toBe(4)` |
| `toEqual(object)`  | Checks if objects/arrays are equal  | `expect({a: 1}).toEqual({a: 1})` |
| `toContain(value)` | Checks if an array contains a value | `expect([1, 2, 3]).toContain(2)` |
| `toBeTruthy()`     | Checks if a value is truthy         | `expect(true).toBeTruthy()` |
| `toBeFalsy()`      | Checks if a value is falsy          | `expect(false).toBeFalsy()` |
| `toThrow()`        | Checks if a function throws an error| `expect(() => throw new Error()).toThrow()` |

## ✅ **Key Points:**
✔️ `test()` defines a single test case.  
✔️ Use `expect()` to define expected outcomes.  
✔️ Keep tests **short** and **focused**.  
✔️ Combine multiple `test()` blocks inside a `describe()` block for grouping.