# Current Sprint Plan - SkinWise VN MVP v1.2.6

Last updated: 2026-05-16

## 1. Current sprint

```txt
Product + Ingredient API Foundation - TASK PI-001
```

## 2. Sprint goal

Implement authenticated read-only Product and Ingredient API foundations so later Product Picker and Ingredient education work can use canonical backend contracts without adding UI, submissions, admin workflows, seed scripts, or AI features.

## 3. Allowed tasks this sprint

```txt
Create Product module types/schema/dto/mapper/repository/use-case
Create Ingredient module types/schema/dto/mapper/repository/use-case
Create GET /api/products
Create GET /api/products/[id]
Create GET /api/ingredients
Create GET /api/ingredients/[id]
Use existing Product/Ingredient collection helpers
Use existing repeatable database index definitions
Add mapper/use-case/API/index unit tests
Update AI coding context docs
```

## 4. Not allowed this sprint

```txt
Product UI
Product Picker integration
Routine product snapshot population
POST /api/products
Product submission workflow
includeMine visibility
Admin product management
Ingredient explanation AI API
AI provider integration
External product APIs
Scraping or crawling
Marketplace or affiliate links
Image upload
Barcode scanner
Seed script
Medical diagnosis
RoutineLog implementation
SkinJournal implementation
Dashboard data integration
Skin score
Community feed
Notifications
Subscription/payment
```

## 5. Sprint Definition of Done

```txt
[x] src/modules/products foundation files exist.
[x] src/modules/ingredients foundation files exist.
[x] Product DTO maps _id to id and omits createdByUserId/source/raw ObjectId values.
[x] Ingredient DTO maps _id to id and omits raw ObjectId values.
[x] Product list query validates q/category/priceRange/skinType/concern/limit only.
[x] Ingredient list query validates q/function/limit only.
[x] Product repository returns only reviewed/verified products.
[x] Ingredient repository does not use Product visibility logic.
[x] Invalid ObjectId detail lookups return null from repositories.
[x] GET /api/products requires authentication.
[x] GET /api/products/[id] requires authentication.
[x] GET /api/ingredients requires authentication.
[x] GET /api/ingredients/[id] requires authentication.
[x] API responses use { data, error } envelopes.
[x] API responses do not expose _id, ObjectId, or createdByUserId.
[x] Canonical Product and Ingredient indexes are covered by unit tests.
[x] No Product UI, Product Picker, Product snapshots, POST products, admin, Ingredient explanation AI, seed script, external API, image upload, or medical diagnosis was implemented.
```

## 6. Recommended next task

```txt
Product Picker integration into Routine form
or
RoutineLog foundation
```
