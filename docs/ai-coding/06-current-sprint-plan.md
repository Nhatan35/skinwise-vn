# Current Sprint Plan - SkinWise VN MVP v1.2.6

Last updated: 2026-05-23

## 1. Current sprint

```txt
TASK SJ-003 - Add SkinJournal Product Linking / Product Name Resolution
```

## 2. Sprint goal

Add SkinJournal product selection and product name resolution in the UI by consuming the existing visible Product catalogue, without changing the SJ-001 backend API contract and without Product CRUD, saved products, image upload, AI journal analysis, calendar heatmap, or analytics/insight views.

## 3. Completed before this sprint

```txt
Week 1 Foundation completed
Week 2 Skin Profile, Product, and Ingredient Foundation completed
Week 3 Routine Builder and Routine Logs completed
Week 4 Routine Safety Engine and Routine Analysis completed
Week 5 AI Explanation and Ingredient Explainer completed
TASK AI-007 - Ingredient Explanation API with Validated AI Provider Fallback completed
TASK SJ-001 - Implement SkinJournal Backend API Foundation completed
TASK SJ-002 - Implement SkinJournal Timeline UI completed
```

## 4. Completed this sprint

```txt
[x] TASK SJ-003 - Add SkinJournal Product Linking / Product Name Resolution completed.
[x] SkinJournal form now selects products from the existing visible Product catalogue.
[x] Product catalogue is fetched from `GET /api/products?limit=50`.
[x] Product list response is parsed from `data.items`.
[x] Journal entry cards resolve product IDs to readable labels.
[x] Missing, deleted, or unresolved products display as `Unknown product`.
[x] SkinJournal backend contract was not changed.
[x] `productsUsed` still stores product ID strings.
[x] No product objects, product names, brand names, snapshots, `userId`, `_id`, image fields, or photo URLs are sent in SkinJournal create/update payloads.
[x] No Product CRUD UI, saved product library, or backend product ownership system was added.
```

## 5. Not allowed this sprint

```txt
Backend SkinJournal API contract changes
Photo upload
Image preview
Image storage
Image analysis
AI journal analysis
Calendar heatmap
Analytics or insight view
Backend product validation for `productsUsed`
Product objects or snapshots in SkinJournal responses
Product CRUD UI
Saved product library
OpenAI changes
Gemini changes
Routine Analysis changes
Ingredient Explanation changes
Skin score
Medical diagnosis or medical recommendation features
```

## 6. Known follow-up

```txt
productsUsed remains a string list of product IDs and is not backend product-validated or snapshotted.
SkinJournal product name resolution is UI-only and depends on the first visible Product API page with `limit=50`.
Future private image fields remain reserved and are not exposed by the MVP UI/API.
SkinJournal calendar/analytics views are not implemented.
SkinJournal AI analysis is not implemented.
Private journal image upload is not implemented.
```

## 7. Recommended next task

```txt
Choose the next task from product priorities:
- TASK SJ-004 - Implement SkinJournal Calendar/Insight View
- TASK SJ-004 - Implement Private Journal Image Upload
- TASK SJ-004 - Add SkinJournal Trends and Basic Analytics
- TASK PRODUCT-UI-001 - Implement Product Catalogue UI
```
