---
trigger: glob: server/**
---

> **SCOPE**: These rules apply specifically to the **server** directory.

# Database & Migrations Rules

## 🎯 Core Principles

- **Primary Database**: MySQL 8.0+
- **ORM**: Prisma (version 6.x - DO NOT upgrade to 7.x without testing)
- **Migration Philosophy**: 
  - Development: Fast iteration with resets
  - Production: Safe, forward-only migrations
- **Schema Source of Truth**: `prisma/schema.prisma`

---

## 🚫 CRITICAL RULES - NEVER BREAK THESE

### Rule 1: NO Manual Schema Changes
❌ **NEVER** run raw SQL to change schema (CREATE TABLE, ALTER TABLE, etc.)  
✅ **ALWAYS** use Prisma migrations for schema changes  
✅ **EXCEPTION**: Data changes (INSERT, UPDATE, DELETE) can be raw SQL

### Rule 2: Development vs Production Workflows
**Development** (when iterating on schema):
```bash
npm run prisma:reset        # Drops everything, reruns migrations
npm run prisma:seed         # Repopulate test data
```

**Production** (deployed servers):
```bash
npm run prisma:migrate deploy   # Only applies new migrations, NEVER resets
```

### Rule 3: Migration Conflicts = Reset
When you get migration errors in **development**:
- ❌ DON'T try to fix migration files manually
- ❌ DON'T delete migration folders
- ✅ DO run `npm run prisma:reset` to start clean

### Rule 4: Never Use `prisma db push` in Production
- `prisma db push` = Quick prototyping, no migration history
- `prisma migrate dev` = Proper migrations with history
- Use `db push` ONLY when rapidly prototyping new features

---

## 📁 Naming Conventions

### Tables
- Format: `snake_case` plural
- Examples: `users`, `orders`, `order_items`

### Columns
- Format: `snake_case`
- Timestamps: `created_at`, `updated_at`, `deleted_at`
- Foreign keys: `<table_singular>_id`
  - Example: `user_id`, `order_id`, `category_id`

### Prisma Models
- Format: `PascalCase` singular
- Example: `User`, `Order`, `OrderItem`

---

## 🗄️ Required Fields for Every Table

Every main entity table MUST have:
```prisma
model EntityName {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Optional but recommended:
```prisma
  deletedAt DateTime?  // For soft deletes
  isActive  Boolean @default(true)  // For disabling without deleting
```

---

## 🔗 Relationship Guidelines

### General Rules
- Define relationships in `prisma/schema.prisma` — it is the single source of truth
- Use proper foreign keys for core entity relationships
- For many-to-many relationships, use explicit junction tables (not implicit)
- Normalize shared lookup data (e.g., locations, categories) into their own tables instead of duplicating strings

### Polymorphic Attachments
For data attached to multiple entity types (e.g., media, comments):
```prisma
model Media {
  id         String @id @default(uuid())
  entityType String // The related entity type
  entityId   String // ID of the related entity
  url        String
  type       String // 'image', 'video', 'document'
  order      Int    // For sorting

  @@index([entityType, entityId])
}
```

---

## ⚡ Indexing Strategy

### Always Index These:
1. **Foreign Keys** - Prisma auto-indexes, but verify:
```prisma
   @@index([userId])
   @@index([categoryId])
```

2. **Filter Columns** - Fields used in WHERE clauses:
```prisma
   @@index([isActive])
   @@index([status])
```

3. **Composite Indexes** - Multiple columns filtered together:
```prisma
   @@index([categoryId, isActive])
   @@index([startDate, endDate])
   @@index([price, currency])
```

4. **Unique Constraints** - Business logic requirements:
```prisma
   @@unique([email])
   @@unique([slug])
   @@unique([parentId, childId])  // Junction tables
```

### When NOT to Index:
- Low-cardinality boolean fields used alone (e.g., `isActive` by itself)
- Text/blob columns
- Fields never used in WHERE/ORDER BY

---

## 🔄 Migration Workflow

### When Making Schema Changes:

#### Step 1: Edit `prisma/schema.prisma`
```prisma
model Product {
  id          String   @id @default(uuid())
  title       String
  description String?  @db.Text  // NEW FIELD
  // ... rest of fields
}
```

#### Step 2: Create Migration (Development)
```bash
# Option A: With descriptive name
npm run prisma:migrate dev --name add_product_description

# Option B: If migration conflicts occur
npm run prisma:reset  # Nuclear option - drops everything
npm run prisma:seed   # Repopulate test data
```

#### Step 3: Verify Migration
```bash
# Check generated SQL
cat prisma/migrations/<timestamp>_add_product_description/migration.sql

# Open Prisma Studio to verify
npm run prisma:studio
```

---

## 🚀 Production Deployment Workflow

### Pre-Deployment Checklist:
1. ✅ All migrations tested locally
2. ✅ Seed data runs successfully
3. ✅ No pending schema changes in `schema.prisma`
4. ✅ Migration files committed to git

### Deployment Commands:
```bash
# On production server:
npm run prisma:migrate deploy  # Applies pending migrations only
npm run prisma:generate        # Regenerates client with new schema
npm start                      # Restart application
```

### 🚨 Production Rules:
- ❌ NEVER use `prisma:reset` in production
- ❌ NEVER use `prisma db push` in production
- ❌ NEVER manually edit database schema
- ✅ Always test migrations in staging first
- ✅ Keep database backups before migrations
- ✅ Have rollback plan ready

---

## 🔧 Common Scenarios

### Scenario 1: Adding New Table
```bash
# 1. Add model to schema.prisma
# 2. Create migration
npm run prisma:migrate dev --name add_reviews_table
```

### Scenario 2: Adding Column to Existing Table
```bash
# 1. Add field to model in schema.prisma
# 2. If NOT NULL without default, Prisma will error
#    Solution: Add default value or make optional
# 3. Create migration
npm run prisma:migrate dev --name add_rating_to_products
```

### Scenario 3: Renaming Column (Data Preservation)
```prisma
// ❌ BAD: Just renaming loses data
model Product {
  // price String  // old
  priceAmount Decimal  // new - WILL DROP OLD COLUMN!
}

// ✅ GOOD: Two-step migration
// Step 1: Add new column
model Product {
  price       String?  // Keep old, make optional
  priceAmount Decimal? // Add new, optional
}
// Run migration, write data migration script to copy data
// Step 2: Remove old column in next migration
```

### Scenario 4: Migration Conflict (Development)
```bash
# Error: Migration conflict or corrupt migration history
# Solution:
npm run prisma:reset        # Drops all, reruns migrations
npm run prisma:seed         # Restore test data
npm run dev                 # Continue working
```

### Scenario 5: Need to Modify Data, Not Schema
```typescript
// Use Prisma client for data changes
import { prisma } from './libs/prisma';

// Safe data manipulation
await prisma.product.updateMany({
  where: { price: null },
  data: { price: 0 }
});
```

---

## 📊 Data Integrity Rules

### Foreign Keys
- ✅ **USE** foreign keys for core entity relationships
- ✅ **USE** `onDelete: Cascade` for dependent data
```prisma
  parent Parent @relation(fields: [parentId], references: [id], onDelete: Cascade)
```
- ⚠️ **AVOID** foreign keys for:
  - Polymorphic relations (media table)
  - Cross-database references (if using multiple databases)
  - High-write tables with many relations (performance)

### Soft Deletes
Prefer soft deletes for user-generated content:
```prisma
model EntityName {
  deletedAt DateTime?
  // Query helper: where: { deletedAt: null }
}
```

Hard delete appropriate for:
- System-generated data (logs, sessions)
- GDPR compliance (user data deletion requests)
- Orphaned junction table records

---

## 🛠️ Troubleshooting Guide

### Issue: "Environment variable not found: DATABASE_URL"
**Solution:**
```bash
# Verify .env exists and has:
DATABASE_URL="mysql://user:pass@localhost:3306/dbname"

# Prisma 7 issue - downgrade to v6:
npm uninstall prisma @prisma/client
npm install prisma@6 @prisma/client@6
```

### Issue: Migration fails with "Table already exists"
**Solution (Development only):**
```bash
npm run prisma:reset  # Clean slate
```

### Issue: "Prisma Client is not generated"
**Solution:**
```bash
npm run prisma:generate
```

### Issue: Slow Queries
**Solution:**
1. Check indexes: Use `EXPLAIN` in phpMyAdmin
2. Add missing indexes to schema.prisma
3. Create migration with new indexes
4. Consider query optimization (use `select` to limit fields)

---

## 🎯 Best Practices Summary

### ✅ DO:
- Use Prisma migrations for ALL schema changes
- Reset database freely in development
- Test migrations in staging before production
- Add indexes for frequently queried fields
- Use soft deletes for user content
- Commit migration files to git
- Document complex migrations with comments
- Use transactions for multi-table operations

### ❌ DON'T:
- Manually edit database schema
- Use `prisma:reset` in production
- Skip migrations and use `db push` in production
- Delete migration files
- Change migration files after they're committed
- Use SELECT * in production code (specify fields)
- Create indexes on every column (hurts write performance)

---

## 🔍 Quick Reference
```bash
# Development
npm run prisma:studio      # Visual DB browser
npm run prisma:migrate dev # Create migration
npm run prisma:reset       # Nuclear option - clean slate
npm run prisma:seed        # Repopulate data
npm run prisma:generate    # Regenerate client

# Production
npm run prisma:migrate deploy  # Apply migrations (safe)
npm run prisma:generate        # Regenerate client

# Database Access
# Prisma Studio: http://localhost:5555
```

---

## 📚 When to Ask for Help

Ask your AI assistant to help when:
1. Creating complex many-to-many relationships
2. Writing data migration scripts
3. Optimizing slow queries
4. Designing indexes for specific use cases
5. Planning breaking schema changes for production

Provide context:
- Current schema (copy relevant parts from schema.prisma)
- What you're trying to achieve
- Any error messages
- Whether this is development or production


