<div align="center">

# Civix

### A civic issue reporting and community engagement platform

Citizens can report local problems, discuss issues, and help communities turn visibility into action.

</div>

## Overview

Civix is a full-stack web application for reporting and coordinating around local civic issues such as damaged roads, overflowing waste bins, water problems, electricity outages, and public safety concerns.

The platform combines a social feed with structured issue management. Users can publish issues with descriptions, locations, and images, then support them through likes, dislikes, and comments. Administrators can review activity, moderate reports, update issue statuses, and manage blocked users from a dedicated dashboard.

## Core Features

- JWT-based registration and login
- User profiles with editable personal information and avatars
- Recent issue feed with likes, dislikes, comments, and post ownership controls
- Issue categories: Road, Garbage, Water, Electricity, and Other
- Image uploads through Multer and Cloudinary
- Real-time issue updates using Socket.IO
- Community spaces with discussions, polls, stories, questions, members, and spotlights
- Compare views for civic issues and areas
- Admin dashboard with status charts, search, filtering, pagination, and moderation controls
- User blocking and unblocking for administrators

## Technology Stack

### Frontend

- React 19 with Vite
- React Router
- Tailwind CSS
- Axios
- Framer Motion
- Lucide React
- Socket.IO Client
- React Hot Toast

### Backend

- Node.js
- Express 5
- MongoDB with Mongoose
- JSON Web Tokens
- bcryptjs
- Multer
- Cloudinary
- Socket.IO

## Architecture

```text
React + Vite frontend
        |
        | Axios REST requests and Socket.IO events
        v
Express API server
        |
        | Mongoose data access
        v
MongoDB
```

The backend follows a route-controller-model structure:

```text
backend/
  config/          Database and Cloudinary configuration
  controllers/     Request and business logic
  middleware/      Authentication and upload middleware
  models/          Mongoose schemas
  routes/          Express API routes
  scripts/         Development data utilities
  server.js        Application entry point

frontend/src/
  api/             API clients
  components/      Reusable UI components
  context/         Shared user state
  pages/           Application screens
  App.jsx          Route definitions
```

## Authentication and Authorization

Passwords are hashed with bcrypt before storage. After registration or login, the backend returns a JWT that the frontend stores locally and sends with protected requests using the `Authorization: Bearer <token>` header.

Protected routes require a valid token. Admin routes also require the authenticated user's role to be `admin`. Authorization is checked in both the frontend route guard and backend middleware.

## Issue Lifecycle

1. An authenticated user submits a title, description, category, location, and optional image.
2. Multer receives the upload and Cloudinary stores the image.
3. The issue is saved in MongoDB with its author and initial `pending` status.
4. Other users can like, dislike, and comment on the issue.
5. An administrator can change the status to `reviewed`, `action_taken`, or `dismissed`.
6. Socket.IO can notify connected clients when issue data changes.

## API Areas

| Area | Base path | Purpose |
| --- | --- | --- |
| Authentication | `/api/auth` | Registration, login, and profiles |
| Issues | `/api/issues` | Create, list, vote, comment, and delete issues |
| Communities | `/api/community` | Community management |
| Discussions | `/api/discussions` | Community discussions |
| Polls | `/api/polls` | Poll creation and voting |
| Comparisons | `/api/compare` | Civic comparison workflows |
| Reports | `/api/reports` | User reports and moderation data |
| Administration | `/api/admin` | Dashboard summaries and moderation |

## Local Development

### Prerequisites

- Node.js 18 or newer
- MongoDB, or a MongoDB Atlas connection string
- Cloudinary account for hosted image uploads

### Installation

From the repository root:

```bash
npm install
npm run install-all
```

Create an environment file from the example:

```bash
copy backend\.env.example backend\.env
```

On macOS or Linux, use:

```bash
cp backend/.env.example backend/.env
```

Set the values in `backend/.env`, then start both applications:

```bash
npm run dev
```

The frontend runs at `http://localhost:5173` and the backend runs at `http://localhost:4000`.

To run them separately:

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

## Environment Variables

Configure these values in `backend/.env`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PORT=4000
```

Never commit real credentials. The example file contains placeholders only.

## Demo Data

The repository includes a repeatable development seed script that creates five demo users, one issue for each category, and sample likes:

```bash
cd backend
node scripts/seedDemoData.js
```

The demo accounts use the password `CivixDemo2026!`. These accounts are intended only for local development and demonstrations.

## Production Considerations

Before deploying Civix, configure a permanent MongoDB database, rotate all secrets, restrict CORS to trusted frontend origins, validate uploaded file types and sizes, and disable development fallback credentials. Production deployments should also use server-side pagination, automated tests, monitoring, and refresh-token or secure cookie-based authentication.

## License

This project is intended for educational and portfolio use. Add a project-specific license before distributing it as an open-source package.
