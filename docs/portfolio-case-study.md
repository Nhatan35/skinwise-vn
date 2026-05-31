# SkinWise VN - Portfolio Case Study

## 1. Project Overview

SkinWise VN is an educational skincare tracking MVP for Vietnamese users. It helps users organize their skincare context, review rule-based product matches, discover products and ingredients, build routines, track daily routine completion, write skin journal entries, and review dashboard/insights summaries.

The project was built as a portfolio-ready full-stack MVP and BA practice project. It demonstrates product thinking, requirement scoping, safe domain boundaries, modular implementation, test coverage, CI/E2E validation, and production verification.

Production demo:

```txt
https://skinwise-vn.vercel.app
```

Screenshots are intentionally omitted for this submission. The project is documented through live demo access, feature walkthrough, validation evidence, release notes, and implementation documentation.

## 2. Problem

Skincare beginners often struggle with:

- Remembering their skin profile and concerns.
- Understanding what products and ingredients are for.
- Building a safe and consistent routine.
- Tracking whether they completed their routine.
- Recording skin observations over time.
- Distinguishing educational guidance from medical advice.

SkinWise VN addresses these needs with a safe MVP that focuses on organization, education, and tracking rather than diagnosis or appearance scoring.

## 3. Target Users

Primary users:

- Vietnamese skincare beginners.
- Users who want to organize their skincare routine.
- Users who want lightweight product/ingredient education.
- Users who want a personal skincare journal and dashboard.

This MVP does not target medical diagnosis, prescription treatment, or clinical decision-making.

## 4. Product Scope

### In Scope

- Google OAuth authentication.
- Skin Profile.
- Product Catalogue and Product Detail.
- Personalized Product Match.
- Saved Products.
- Ingredient Library and Ingredient Detail.
- Ingredient Explanation API.
- Routine Builder.
- Routine Safety Analysis.
- Today Routine Checklist.
- Routine Logs.
- Skin Journal.
- Skin Progress Insights and Calendar.
- Dashboard summary.
- Settings and Data Control.
- CI/E2E validation.
- Vercel production deployment verification.

### Out of Scope

- Real AI provider integration.
- Image upload.
- AI face analysis.
- Skin score or appearance score.
- Marketplace/cart/payment.
- Admin product/ingredient CRUD.
- Notifications.
- Full commercial monitoring/analytics.

## 5. Key User Flows

### Flow 1 - New User Onboarding

```txt
Landing page -> Google login -> Dashboard -> Skin Profile -> Save profile -> Dashboard summary updates
```

### Flow 2 - Product Discovery

```txt
Products -> Search/filter -> Product detail -> Save product -> Saved Products -> Remove saved product
```

### Flow 3 - Personalized Product Match

```txt
Skin Profile -> Product Match -> Review match score, level, reasons, and cautions -> Save matched product -> Product detail
```

### Flow 4 - Ingredient Education

```txt
Ingredients -> Search -> Ingredient detail -> Explanation request -> Safe educational response/fallback
```

### Flow 5 - Routine Management

```txt
Routines -> Create routine -> Add product-backed steps -> Save routine -> Run routine analysis
```

### Flow 6 - Daily Tracking

```txt
Today Routine Checklist -> Mark routine complete -> Review log -> Delete log if needed
```

### Flow 7 - Skin Journal and Insights

```txt
Journal -> Create entry -> Edit entry -> Delete entry -> Insights -> Review routine consistency, calendar, symptoms, and product usage
```

## 6. Architecture

The project uses a modular monolith structure with clear boundaries:

- `src/app` for Next.js App Router pages and API routes.
- `src/modules` for feature modules, use cases, schemas, repositories, DTO mappers, and UI components.
- `src/domain` for domain logic such as routine safety rules.
- `src/infrastructure` for database, AI provider abstraction, and platform concerns.
- `tests/unit` for unit and contract tests.
- `tests/e2e` for Playwright E2E coverage.
- `docs` for product, architecture, validation, release, and demo documentation.

The implementation separates route handling, validation, business logic, persistence, and UI composition to keep the MVP testable and maintainable.

## 7. Tech Stack

- Next.js App Router.
- TypeScript.
- Tailwind CSS.
- MongoDB.
- Auth.js / NextAuth.
- Zod.
- Vitest.
- Playwright.
- GitHub Actions.
- Vercel.

## 8. Quality and Validation

Final validation baseline:

```txt
Node.js: v24.14.0
npm: 11.14.1
```

Validation evidence:

```txt
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 84 files / 777 tests
npm run build: PASS
npm run db:indexes: PASS - 32 indexes ensured
npm run test:e2e: PASS - 28/28 tests
npm audit --omit=dev --audit-level=moderate: PASS - 0 recorded production vulnerabilities
```

The Playwright E2E suite covers public landing behavior, protected route redirects, authenticated dashboard access, profile creation/update, product browsing/detail, Product Match review/save/detail flow, saved products, ingredient library/detail/explanation, routine builder, routine analysis, today routine checklist, routine log deletion, skin journal, Insights, settings/data control, account deletion request, and dashboard summary reflection.

## 9. Production Verification

Production verification was completed for the MVP demo scope.

Verified areas:

- Vercel production deployment.
- Google OAuth login.
- MongoDB Atlas-backed authenticated read/write flows.
- Protected route behavior.
- Dashboard after login.
- Skin Profile.
- Product Match.
- Product Catalogue and Product Detail.
- Saved Products.
- Ingredient Library and Ingredient Detail.
- Routine Builder and Routine Analysis.
- Today Routine Log.
- Skin Journal.
- Insights.
- Settings/Data Control.
- Sign out.

## 10. BA / Product Thinking Demonstrated

This project demonstrates:

- MVP scoping.
- Requirement breakdown.
- User story thinking.
- Functional and non-functional requirement separation.
- API contract thinking.
- Data model design.
- Safe product boundary definition.
- Traceability from business needs to implementation and tests.
- Release readiness and validation evidence.

## 11. Engineering Practices Demonstrated

- Modular feature-based structure.
- Zod validation at API boundaries.
- DTO mapping to avoid leaking internal database fields.
- Repository/use-case separation.
- Deterministic routine safety rules before AI-style explanation.
- Deterministic Product Match scoring with match score, match level, reasons, cautions, saved-product integration, and product detail navigation.
- Routine-slot based Insights aggregation for routine consistency, journal activity, product usage, calendar days, and safe next actions.
- Mock/fallback provider behavior for MVP reliability.
- Unit and contract testing.
- Playwright E2E testing.
- GitHub Actions CI with MongoDB service.
- Production deployment verification.

## 12. Final Outcome

SkinWise VN is ready as an MVP portfolio/submission project.

Final release status:

```txt
SkinWise VN MVP v1.3 - READY FOR GITHUB RELEASE / PORTFOLIO / SUBMISSION
```

## 13. Future Improvements

Recommended post-MVP roadmap:

1. Real AI provider integration with monitoring and cost controls.
2. Admin Product/Ingredient CRUD.
3. Data export and hard-delete account flow.
4. Image upload for journal entries.
5. Error monitoring and production analytics.
6. Notification reminders.
7. Expanded ingredient/product dataset.
