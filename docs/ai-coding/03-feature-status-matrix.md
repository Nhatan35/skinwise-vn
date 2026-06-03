# Feature Status Matrix - SkinWise VN MVP

Last updated: 2026-06-03

## 1. Status Categories

```txt
Completed
Partially completed
Not started
Out of scope
```

## 2. Feature Status Matrix

| Feature | Status | API | UI | DB | Tests | Notes |
|---|---|---|---|---|---|---|
| Authentication | Completed | Auth.js `/api/auth/*`; `GET /api/me` | Auth.js sign-in flow; protected routes | Auth.js MongoDB Adapter plus AppUserProfile | Unit/source checks; E2E auth helpers | Google OAuth is the main auth flow. Test-only Credentials provider remains gated by test environment flags. |
| Skin Profile | Completed | `/api/skin-profile` GET/POST/PATCH/DELETE | `/onboarding/skin-profile`; `/skin-profile` | `skin_profiles`; AppUserProfile onboarding marker | Unit/API/E2E | User-scoped skin profile create, view, edit, and delete are implemented. |
| Product Catalogue | Completed | `GET /api/products` | `/products` | `products` collection and indexes | Unit/API/client/E2E; seed validation | Read-only visible product catalogue with search/filter support. MVP v1.6 expands curated seed data to 38 products across cleanser, toner, serum, moisturizer, sunscreen, treatment, mask, and other. Full personalized explanations are not expanded on catalogue/list pages. |
| Product Detail | Completed | `GET /api/products/[id]`; `GET /api/products/[id]/match` | `/products/[id]` | `products`; `skin_profiles`; `saved_products` | Unit/API/client/UI/E2E | Product Detail shows product data and a non-blocking personalized match explanation for the requested product. |
| Product Match Explanation | Completed | `GET /api/product-match`; `GET /api/products/[id]/match` | `/product-match`; `/products/[id]` | Reuses existing collections; no new recommendation collection | Unit/API/client/UI/E2E | Deterministic, rule-based explanation with summary, positive reasons, cautions, ingredient highlights, usage note, and limited-data notes. MVP v1.6 improves explanation usefulness through richer product skin type, concern, warning, active, suitableFor, and notRecommendedFor metadata. No AI provider, diagnosis, medical treatment claim, marketplace, checkout, or new matching algorithm. |
| Saved Products | Completed | `GET`/`POST /api/saved-products`; `DELETE /api/saved-products/[productId]` | `/saved-products`; save actions in product surfaces | `saved_products` unique `userId + productId` index | Unit/API/client/E2E | User-owned product bookmarks with idempotent save/remove behavior. |
| Ingredient Library | Completed | `GET /api/ingredients`; `GET /api/ingredients/[id]` | `/ingredients`; `/ingredients/[id]` | `ingredients` collection and indexes | Unit/API/client/E2E; seed validation | Authenticated read-only ingredient library with educational detail view. MVP v1.6 expands curated ingredient seed data to 40 records covering barrier, hydration, oiliness/acne-support, exfoliation, retinoids, tone support, soothing, UV filters, potential irritants, and emollient/occlusive support. |
| Ingredient Explanation | Completed | `POST /api/ingredients/explain` | Explanation panel in ingredient detail | No persistence | Unit/API/client/E2E | Uses provider abstraction and validated mock/fallback behavior. No external AI provider is required for MVP. |
| Routine Builder | Completed | `/api/routines`; `/api/routines/[id]` | `/routines` | `routines` collection and indexes | Unit/API/E2E | Authenticated routine creation and management are implemented. MVP v1.7 refines empty state copy, morning/evening guidance, step-order guidance, selected-product context, and the CTA to Today Checklist without changing schema or APIs. |
| Routine Analysis | Completed | `POST /api/routines/[id]/analyze`; `GET /api/routines/[id]/analyses` | Analysis panel in routines | `routine_analyses`; `rate_limits` | Unit/API/E2E | Deterministic safety rules run before mock/fallback AI explanation. MVP v1.7 improves result readability and safety wording without changing routine safety rules. |
| Routine Logs | Completed | `GET /api/routine-logs`; `PUT /api/routine-logs`; `DELETE /api/routine-logs/[id]` | `/routines`; `/routine-logs/today` | `routine_logs` with user/date indexes | Unit/API/client/E2E | Daily routine status update and delete flow are implemented. Routine Builder links to the existing Today Checklist route for clearer demo continuity. |
| Skin Journal | Completed | `GET`/`POST /api/skin-journal`; `PATCH`/`DELETE /api/skin-journal/[id]` | `/journal` | `skin_journals` with user/localDate unique index | Unit/API/client/E2E | User-scoped journal create, edit, and delete are implemented. |
| Insights | Completed | `GET /api/insights?from=YYYY-MM-DD&to=YYYY-MM-DD` | `/insights` | Reuses user-scoped collections | Unit/API/client/UI/E2E | Routine consistency, journal activity, product usage, calendar summaries, and safe next actions are implemented. MVP v1.8 improves progress-story framing, overview helper text, calendar readability, self-reported journal trend copy, product usage safety wording, and route-connected next actions without changing the API response shape or adding causality logic. |
| Dashboard | Completed | `GET /api/dashboard?localDate=YYYY-MM-DD` | `/dashboard` | Reuses user-scoped collections | Unit/API/E2E | Dashboard uses authenticated user data for profile, saved products, routines, journal, and next actions. |
| Settings / Data Control | Completed | `GET /api/account/export`; `DELETE /api/account/app-data`; `POST /api/account/deletion-request` | `/settings` | User-owned skincare collections plus AppUserProfile marker | Unit/API/E2E | Data export and skincare app data deletion are implemented without Auth.js hard-delete. |
| Runtime Baseline | Completed | N/A | N/A | N/A | Validation commands | Node 24.x and npm 11.x are the expected runtime baseline. |
| Real AI Provider Integration | Not started | N/A | N/A | N/A | Unsupported-state tests where present | MVP uses mock/fallback provider behavior. Real OpenAI/Gemini integration is future scope. |
| Admin Product/Ingredient CRUD | Not started | N/A | N/A | Existing catalogue only | N/A | Future/admin workflow only. |
| Marketplace / Cart / Checkout / Payment | Out of scope | N/A | N/A | N/A | N/A | Not part of the MVP. |
| Image Upload / AI Face Analysis / Skin Score | Out of scope | N/A | N/A | N/A | N/A | Avoided for privacy, safety, and appearance-pressure boundaries. |
| Medical Diagnosis / Treatment Advice | Out of scope | N/A | N/A | N/A | N/A | SkinWise VN is educational only and does not replace professional medical advice. |

## 3. v1.6 Data Quality Status

```txt
Ingredient seed expansion to 40 records: DONE
Product seed expansion to 38 records: DONE
Category, skin type, concern, warning, and active coverage: DONE
Seed validation assertions for counts, duplicates, coverage, and demo signals: DONE
Seed data documentation sync: DONE
```

## 4. Product Match Explanation Boundary

```txt
Full personalized explanations are available on Product Match result cards and Product Detail.
Product Detail uses GET /api/products/[id]/match for one requested visible product.
Catalogue/list pages do not compute full personalized explanations for every product.
The explanation system is deterministic and rule-based.
No real AI provider, LLM integration, diagnosis, treatment claim, skin score, marketplace, checkout, or new recommendation engine is introduced.
```

## 5. Current / Recommended MVP Task

```txt
Current: MVP v1.8 - Insights Usability & Progress Story Refinement
Completed documentation cleanup patch: MVP v1.8.1 - Documentation Truth Sync & Release Evidence Cleanup
Latest documentation consistency hotfix: MVP v1.8.2 - Final Documentation Consistency Hotfix
Next main task: MVP v1.9 - Production Monitoring & Demo Evidence Stabilization
MVP core scope: Completed and portfolio/demo/interview ready at MVP level
Production smoke test evidence: NOT RUN until manually verified
Production monitoring evidence: PENDING until manually verified
```
