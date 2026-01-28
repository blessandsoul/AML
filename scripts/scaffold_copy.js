
const fs = require('fs');
const path = require('path');

// --- CONFIGURATION ---
const ROOT_DIR = path.resolve(__dirname, '..');
const DEST_DIR = path.join(ROOT_DIR, 'scaffold');

const IGNORE_DIRS = [
    '.git',
    'node_modules',
    'dist',
    'build',
    'scaffold',
    '.agent',
    '.windsurf',
    '.claude',
    'coverage',
    '.ds_store'
];

const SERVER_MODULES_TO_REMOVE = [
    'tours',
    'guides',
    'drivers',
    'inquiries',
    'reviews',
    'search'
];

const CLIENT_FEATURES_TO_REMOVE = [
    'tours',
    'guides',
    'drivers',
    'inquiries',
    'reviews',
    'search'
];

// --- TEMPLATES ---
const CLEAN_SCHEMA_PRISMA = `// ==========================================
// CORE PROJECT SCAFFOLD - PRISMA SCHEMA
// ==========================================

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

// ==========================================
// ENUMS
// ==========================================

enum UserRole {
  USER
  COMPANY
  ADMIN
}

enum ChatType {
  DIRECT
  GROUP
}

enum NotificationType {
  CHAT_MESSAGE
  CHAT_MENTION
  SYSTEM
}

// ==========================================
// USER & AUTHENTICATION
// ==========================================

model User {
  id           String    @id @default(uuid())
  email        String    @unique
  passwordHash String    @map("password_hash")
  firstName    String    @map("first_name")
  lastName     String    @map("last_name")
  isActive     Boolean   @default(true) @map("is_active")
  tokenVersion Int       @default(0) @map("token_version")
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")
  deletedAt    DateTime? @map("deleted_at")

  roles UserRoleAssignment[]

  parentCompanyId String? @map("parent_company_id")
  parentCompany   User?   @relation("CompanyAgents", fields: [parentCompanyId], references: [id], onDelete: SetNull)
  tourAgents      User[]  @relation("CompanyAgents")

  emailVerified              Boolean   @default(false) @map("email_verified")
  verificationToken          String?   @map("verification_token") @db.VarChar(64)
  verificationTokenExpiresAt DateTime? @map("verification_token_expires_at")

  resetPasswordToken          String?   @map("reset_password_token") @db.VarChar(64)
  resetPasswordTokenExpiresAt DateTime? @map("reset_password_token_expires_at")

  failedLoginAttempts Int       @default(0) @map("failed_login_attempts")
  lockedUntil         DateTime? @map("locked_until")

  companyProfile Company?
  
  sessions UserSession[]

  createdChats     Chat[]               @relation("CreatedChats")
  chatParticipants ChatParticipant[]    @relation("ChatParticipants")
  sentMessages     ChatMessage[]        @relation("SentMessages")
  readReceipts     MessageReadReceipt[] @relation("ReadReceipts")

  notifications Notification[] @relation("UserNotifications")

  @@index([email])
  @@index([isActive])
  @@map("users")
}

model UserRoleAssignment {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  role      UserRole
  createdAt DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, role])
  @@index([role])
  @@map("user_roles")
}

model UserSession {
  id               String    @id @default(uuid())
  userId           String    @map("user_id")
  refreshTokenHash String    @map("refresh_token_hash")
  expiresAt        DateTime  @map("expires_at")
  revokedAt        DateTime? @map("revoked_at")
  userAgent        String?   @map("user_agent") @db.VarChar(512)
  ipAddress        String?   @map("ip_address") @db.VarChar(45)
  createdAt        DateTime  @default(now()) @map("created_at")
  lastUsedAt       DateTime  @default(now()) @map("last_used_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("user_sessions")
}

// ==========================================
// COMPANY PROFILE
// ==========================================

model Company {
  id                 String   @id @default(uuid())
  userId             String   @unique @map("user_id")
  companyName        String   @map("company_name") @db.VarChar(255)
  description        String?  @db.Text
  registrationNumber String?  @unique @map("registration_number") @db.VarChar(100)
  logoUrl            String?  @map("logo_url") @db.VarChar(512)
  websiteUrl         String?  @map("website_url") @db.VarChar(512)
  phoneNumber        String?  @map("phone_number") @db.VarChar(20)
  isVerified         Boolean  @default(false) @map("is_verified")
  
  // Custom Metadata
  metadata           Json?    @map("metadata")
  
  createdAt          DateTime @default(now()) @map("created_at")
  updatedAt          DateTime @updatedAt @map("updated_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([isVerified])
  @@index([companyName])
  @@map("companies")
}

// ==========================================
// GENERIC LOCATION
// ==========================================

model Location {
  id        String   @id @default(uuid())
  name      String   @db.VarChar(255)
  region    String?  @db.VarChar(255)
  country   String   @default("Georgia") @db.VarChar(100)
  latitude  Decimal? @db.Decimal(10, 8)
  longitude Decimal? @db.Decimal(11, 8)
  isActive  Boolean  @default(true) @map("is_active")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@unique([name, country], name: "name_country")
  @@map("locations")
}

// ==========================================
// CHAT SYSTEM
// ==========================================

model Chat {
  id        String   @id @default(uuid())
  type      ChatType
  name      String?  @db.VarChar(100)
  creatorId String   @map("creator_id")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  creator      User              @relation("CreatedChats", fields: [creatorId], references: [id])
  participants ChatParticipant[]
  messages     ChatMessage[]

  @@index([creatorId])
  @@index([type])
  @@map("chats")
}

model ChatParticipant {
  id         String   @id @default(uuid())
  chatId     String   @map("chat_id")
  userId     String   @map("user_id")
  joinedAt   DateTime @default(now()) @map("joined_at")
  lastReadAt DateTime @default(now()) @map("last_read_at")

  chat Chat @relation(fields: [chatId], references: [id], onDelete: Cascade)
  user User @relation("ChatParticipants", fields: [userId], references: [id], onDelete: Cascade)

  @@unique([chatId, userId])
  @@index([userId])
  @@map("chat_participants")
}

model ChatMessage {
  id             String   @id @default(uuid())
  chatId         String   @map("chat_id")
  senderId       String   @map("sender_id")
  content        String   @db.Text
  mentionedUsers Json     @default("[]") @map("mentioned_users")
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")

  chat         Chat                 @relation(fields: [chatId], references: [id], onDelete: Cascade)
  sender       User                 @relation("SentMessages", fields: [senderId], references: [id])
  readReceipts MessageReadReceipt[]

  @@index([chatId, createdAt])
  @@map("chat_messages")
}

model MessageReadReceipt {
  id        String   @id @default(uuid())
  messageId String   @map("message_id")
  userId    String   @map("user_id")
  readAt    DateTime @default(now()) @map("read_at")

  message ChatMessage @relation(fields: [messageId], references: [id], onDelete: Cascade)
  user    User        @relation("ReadReceipts", fields: [userId], references: [id])

  @@unique([messageId, userId])
  @@map("message_read_receipts")
}

// ==========================================
// NOTIFICATION SYSTEM
// ==========================================

model Notification {
  id        String           @id @default(uuid())
  userId    String           @map("user_id")
  type      NotificationType
  title     String           @db.VarChar(255)
  message   String           @db.Text
  data      String?          @db.Text
  isRead    Boolean          @default(false) @map("is_read")
  createdAt DateTime         @default(now()) @map("created_at")

  user User @relation("UserNotifications", fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, isRead, createdAt])
  @@map("notifications")
}

// ==========================================
// MEDIA / FILE UPLOADS
// ==========================================

model Media {
  id           String   @id @default(uuid())
  filename     String   @db.VarChar(255)
  originalName String   @map("original_name") @db.VarChar(255)
  mimeType     String   @map("mime_type") @db.VarChar(100)
  size         Int
  url          String   @db.VarChar(512)
  entityType   String   @map("entity_type") @db.VarChar(50)
  entityId     String   @map("entity_id") @db.VarChar(255)
  uploadedBy   String   @map("uploaded_by")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  @@index([entityType, entityId])
  @@map("media")
}
`;

// --- HELPERS ---

function copyRecursiveSync(src, dest, isRoot = false) {
    const stats = fs.statSync(src);
    if (stats.isDirectory()) {
        const dirName = path.basename(src);
        if (!isRoot && IGNORE_DIRS.includes(dirName)) return;

        if (src.includes('server\\\\src\\\\modules') || src.includes('server/src/modules')) {
            if (SERVER_MODULES_TO_REMOVE.includes(dirName)) {
                console.log(`Skipping server module: ${dirName}`);
                return;
            }
        }
        if (src.includes('client\\\\src\\\\features') || src.includes('client/src/features')) {
            if (CLIENT_FEATURES_TO_REMOVE.includes(dirName)) {
                console.log(`Skipping client feature: ${dirName}`);
                return;
            }
        }

        if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

        const entries = fs.readdirSync(src);
        for (const entry of entries) {
            if (IGNORE_DIRS.includes(entry)) continue;
            copyRecursiveSync(path.join(src, entry), path.join(dest, entry));
        }
    } else {
        fs.copyFileSync(src, dest);
    }
}

function processServerAppTs() {
    const appTsPath = path.join(DEST_DIR, 'server', 'src', 'app.ts');
    if (!fs.existsSync(appTsPath)) return;

    let content = fs.readFileSync(appTsPath, 'utf-8');

    // Remove imports
    content = content.replace(/import { .*Routes } from ".\/modules\/(tours|guides|drivers|inquiries|reviews|search)\/.*";\r?\n?/g, '');

    // Remove registrations
    content = content.replace(/app.register\((tour|guide|driver|inquiry|review|search)Routes, { prefix: "\/api\/v1" }\);\r?\n?/g, '');

    fs.writeFileSync(appTsPath, content);
}

function processClientRouter() {
    const routerPath = path.join(DEST_DIR, 'client', 'src', 'app', 'router.tsx');
    if (!fs.existsSync(routerPath)) return;

    // Minimal router replacement
    const minimalRouter = `import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { HomePage } from '@/pages/HomePage';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { CompanyRegisterPage } from '@/features/auth/pages/CompanyRegisterPage';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { ProfilePage } from '@/features/users/pages/ProfilePage';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { CompanyManagementPage } from '@/features/company/pages/CompanyManagementPage';
import { CreateAgentPage } from '@/features/company/pages/CreateAgentPage';
import { CompanyAgentsPage } from '@/features/company/pages/operations/CompanyAgentsPage';
import { OperationsLayout } from '@/features/company/pages/operations/OperationsLayout';
import { ChatsPage } from '@/features/chat/pages/ChatsPage';
import { AdminLayout } from '@/features/admin/pages/AdminLayout';
import { AdminUsersPage } from '@/features/admin/pages/AdminUsersPage';
import { AdminLocationsPage } from '@/features/admin/pages/AdminLocationsPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        errorElement: <ErrorBoundary><div className="min-h-screen flex items-center justify-center"><h1>404</h1></div></ErrorBoundary>,
        children: [
            { index: true, element: <HomePage /> },
            {
                path: 'dashboard',
                element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
                children: [
                    { index: true, element: <DashboardPage /> },
                    { path: 'profile', element: <ProfilePage /> },
                    { 
                        path: 'company', 
                        element: <ProtectedRoute allowedRoles={['COMPANY']}><CompanyManagementPage /></ProtectedRoute> 
                    },
                    {
                        path: 'operations',
                        element: <ProtectedRoute allowedRoles={['COMPANY']}><OperationsLayout /></ProtectedRoute>,
                        children: [
                            { index: true, element: <Navigate to="agents" replace /> },
                            { path: 'agents', element: <CompanyAgentsPage /> },
                        ]
                    },
                    { 
                        path: 'create-agent', 
                        element: <ProtectedRoute allowedRoles={['COMPANY']}><CreateAgentPage /></ProtectedRoute> 
                    },
                    {
                        path: 'admin',
                        element: <ProtectedRoute allowedRoles={['ADMIN']}><AdminLayout /></ProtectedRoute>,
                        children: [
                            { index: true, element: <Navigate to="locations" replace /> },
                            { path: 'locations', element: <AdminLocationsPage /> },
                            { path: 'users', element: <AdminUsersPage /> },
                        ]
                    },
                    { path: 'chats', element: <ChatsPage /> },
                    { path: 'chats/:chatId', element: <ChatsPage /> },
                ],
            },
        ],
    },
    { path: '/login', element: <LoginPage /> },
    { path: '/register', element: <RegisterPage /> },
    { path: '/register-company', element: <CompanyRegisterPage /> },
]);
`;
    fs.writeFileSync(routerPath, minimalRouter);
}

// --- MAIN ---

console.log(`Starting scaffold generation (JS Mode)...`);
console.log(`Source: ${ROOT_DIR}`);
console.log(`Dest:   ${DEST_DIR}`);

// 1. Copy Files
try {
    if (fs.existsSync(DEST_DIR)) {
        console.log('Cleaning existing scaffold directory...');
        fs.rmSync(DEST_DIR, { recursive: true, force: true });
    }
    fs.mkdirSync(DEST_DIR);

    copyRecursiveSync(ROOT_DIR, DEST_DIR, true);
    console.log('Files copied successfully.');
} catch (e) {
    console.error('Error copying files:', e);
    process.exit(1);
}

// 2. Overwrite Schema
try {
    const schemaPath = path.join(DEST_DIR, 'server', 'prisma', 'schema.prisma');
    fs.writeFileSync(schemaPath, CLEAN_SCHEMA_PRISMA);
    console.log('Schema cleaned.');
} catch (e) {
    console.error('Error writing schema:', e);
}

// 3. Process Server App
try {
    processServerAppTs();
    console.log('Server app.ts cleaned.');
} catch (e) {
    console.error('Error processing app.ts:', e);
}

// 4. Process Client Router
try {
    processClientRouter();
    console.log('Client router.tsx cleaned.');
    // Note: Header.tsx and other components might still have broken links/imports.
    // This script does the heavy lifting, but manual cleanup might be needed for perfect build.
} catch (e) {
    console.error('Error processing router.tsx:', e);
}

console.log('Scaffold generation complete!');
console.log('Location: ' + DEST_DIR);
