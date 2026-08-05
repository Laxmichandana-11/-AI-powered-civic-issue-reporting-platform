Postman / Thunder Client Quick Run Instructions
---------------------------------------------

This document explains how to import and run the provided API collection to test authentication and the protected profile endpoint.

Files:
- `server/postman/CiviQ-API.postman_collection.json` — Postman collection containing `Register`, `Login`, and `Get Profile` requests.

Steps (Postman)
1. Start backend server:
```bash
cd server
npm install
npm run dev
```
2. Open Postman -> Import -> select `server/postman/CiviQ-API.postman_collection.json`.
3. Create an environment (optional) and ensure the `baseUrl` environment variable is `http://localhost:5000`.
4. Run `Register` (creates a test user). If the user already exists, you can skip this step.
5. Run `Login`. The collection has a test script that will store the returned token into the active environment variable named `token`.
6. Run `Get Profile (protected)` — it uses the `Authorization: Bearer {{token}}` header and should return the user profile if the token is valid.

Steps (Thunder Client in VS Code)
1. Start backend server (see step 1 above).
2. In VS Code, open Thunder Client extension and click Import -> Postman Collection, choose `CiviQ-API.postman_collection.json`.
3. Run `Register`, then `Login`.
4. Manually copy the `token` value from the `Login` response and set a global/collection variable named `token` in Thunder Client (Thunder Client doesn't run Postman tests automatically).
5. Run `Get Profile (protected)` — it should return the user profile.

Notes
- If your backend runs on a different port or host, update `baseUrl` accordingly before running.
- If you still get CORS or network errors in the browser, confirm the server is running and that you can reach `http://localhost:5000/` in the browser.
- For automated test flows, use Postman (collection environment variables and test scripts are supported).
