# AML - Auto Logistics Platform

This project is built on the generic core infrastructure scaffold. It contains the essential foundation for a modern auto logistics and vehicle import/export management system.

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

## What was removed from the original scaffold?
*   Generic placeholder modules that don't apply to auto logistics.
*   Template-specific pages and routes.
*   Placeholder database tables not relevant to vehicle management.

## Next Steps for AML Development
1.  Configure "Companies" as Dealers/Importers/Brokers.
2.  Create domain modules: "Vehicles", "Auctions", "Logistics", "Shipping".
3.  Set up vehicle catalog and auction management features.
4.  Update navigation in `client/src/components/layout/Header.tsx`.
