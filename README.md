# Civix

Civix is a project I built to make it easier for people to report local civic problems and see what is happening in their area. A user can post an issue such as a pothole, an overflowing bin, a water problem, or a broken streetlight. Other users can then support the post, comment on it, and follow its progress.

The project has two sides:

- a social feed for citizens
- an admin area for reviewing issues and managing the platform

## What I built

- Registration and login using JWT authentication
- User profiles and profile picture support
- Issue posts with a title, description, category, location, and optional image
- Likes, dislikes, comments, and post deletion for the post owner
- A recent-post feed on the home page
- Categories for Road, Garbage, Water, Electricity, and Other
- Community pages for discussions, polls, stories, questions, members, and spotlights
- Compare pages for viewing civic information together
- An admin dashboard with issue and report charts
- Admin search, filtering, pagination, status changes, and user blocking
- Socket.IO updates for changes to the issue feed

## Tech stack

### Frontend

- React and Vite
- React Router
- Tailwind CSS
- Axios
- Framer Motion
- Lucide React
- Socket.IO Client

### Backend

- Node.js and Express
- MongoDB with Mongoose
- JWT and bcryptjs
- Multer for upload handling
- Cloudinary for storing images
- Socket.IO

## How the application works

The frontend is a React application in `frontend/`. It calls the Express API in `backend/` using Axios. The backend validates requests, checks authentication when necessary, and reads or writes data through Mongoose.

When a user logs in, the backend returns a JWT. The frontend stores it and sends it with protected requests. The backend middleware verifies the token and adds the current user to the request before allowing the controller to run.

An issue starts with a `pending` status. An admin can later change it to `reviewed`, `action_taken`, or `dismissed`. The admin dashboard shows the status totals as charts and gives the admin access to the issue and report details.

## Project structure

```text
backend/
  config/          MongoDB and Cloudinary configuration
  controllers/     API logic
  middleware/      Authentication and file upload middleware
  models/          Mongoose schemas
  routes/          Express routes
  scripts/         Development seed script
  server.js        Backend entry point

frontend/src/
  api/             API helpers
  components/      Shared React components
  context/         User context
  pages/           Application pages
  App.jsx          Frontend routes
```

## Run the project locally

### Requirements

- Node.js 18 or newer
- MongoDB or a MongoDB Atlas database
- A Cloudinary account if image uploads are needed

Install the root, backend, and frontend dependencies:

```bash
npm install
npm run install-all
```

Create the backend environment file.

On Windows:

```bash
copy backend\.env.example backend\.env
```

On macOS or Linux:

```bash
cp backend/.env.example backend/.env
```

Add the required values to `backend/.env`, then start both applications from the root:

```bash
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend runs on `http://localhost:4000`.

To start them separately:

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

## Environment variables

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PORT=4000
```

I have kept the values out of the repository. The example file only contains placeholders, and real credentials should be stored in `backend/.env`.

## Demo data

For local testing, the project includes a seed script. It creates five demo users, one issue in each category, and sample likes on the posts.

```bash
cd backend
node scripts/seedDemoData.js
```

All demo users use the password `CivixDemo2026!`. These accounts are only for local development and demonstrations.

## Things I would improve next

- Add automated frontend and backend tests
- Add server-side pagination for the main issue feed
- Move authentication to secure cookies or add refresh tokens
- Add stronger file type and file size validation
- Add notifications when an issue status changes
- Add a proper production deployment configuration

## Note

This is a learning and portfolio project. It is functional for local development, but the environment secrets, admin setup, and deployment configuration should be reviewed before using it with real civic data.
