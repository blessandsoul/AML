# AutoImport Project Scaffold

This scaffold was generated from the generic core of the "AtlasCaucasus" project. It contains the essential infrastructure for a modern web application without the tourism-specific domain logic.

## Included Features (Core)

### Server (`/server`)
*   **Infrastructure**: Fastify, TypeScript, Prisma (MySQL), Redis
*   **Authentication**: Complete JWT auth system (Login, Register, Email Verify, Password Reset)
*   **User Management**: Roles (USER, COMPANY, ADMIN), Profiles
*   **Companies**: Base structure for Dealers/Companies
*   **Real-time**: WebSocket foundation, Chat system, Notifications
*   **Media**: File upload system
*   **Locations**: Generic location storage

### Client (`/client`)
*   **Stack**: React, Vite, TypeScript, TailwindCSS, shadcn/ui
*   **Auth UI**: Login, Register, Profile, Protected Routes
*   **Dashboard**: Admin & Company dashboard layouts
*   **Chat**: Real-time chat UI
*   **Notifications**: Notification drawer

## Getting Started

1.  **Move this folder**: Move the contents of this `scaffold` folder to your new project location (e.g., `C:\Projects\AutoImport`).
2.  **Install Dependencies**:
    *   `cd server && npm install`
    *   `cd client && npm install`
3.  **Database Setup**:
    *   Create a new MySQL database for the project.
    *   Update `.env` in `/server` with the new DB credentials.
    *   Run `cd server && npx prisma migrate dev --name init` to create the schema.
4.  **Start Development**:
    *   Server: `npm run dev`
    *   Client: `npm run dev`

## What was removed?
*   Tours, Guides, Drivers, Reviews, Inquiries modules.
*   Tourism-specific pages and routes.
*   Tourism-specific database tables.

## Customization Next Steps
1.  Rename "Companies" to "Dealers" if desired.
2.  Create new modules for "Cars", "Auctions", "Shipping".
3.  Update the header navigation in `client/src/components/layout/Header.tsx`.
