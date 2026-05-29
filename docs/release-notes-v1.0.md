# Release Notes - SkinWise VN MVP v1.0

Release date: 2026-05-29

Release status: **Portfolio/submission ready**

## Summary

SkinWise VN v1.0 is the MVP portfolio release of an educational skincare tracking web application for Vietnamese users. The release includes authentication, user-owned skincare tracking, product and ingredient education, routine building, routine safety analysis, daily routine logging, skin journaling, dashboard summaries, settings/data control, CI validation, E2E validation, and production deployment verification.

This is an MVP demo/portfolio release, not a full commercial product release.

## Completed Features

### Authentication and Access Control

- Google OAuth authentication.
- Auth.js / NextAuth integration.
- Protected app routes.
- User-owned data boundaries.
- Unauthenticated redirect behavior.

### Skin Profile

- Skin profile onboarding.
- Skin profile viewing.
- Skin profile editing.
- Authenticated API validation and persistence.

### Product Catalogue

- Product listing.
- Product search/filter behavior.
- Product detail pages.
- Safe educational product presentation.

### Saved Products

- Save product.
- View saved products.
- Remove saved product.
- User-owned saved product persistence.

### Ingredient Library

- Ingredient listing.
- Ingredient search.
- Ingredient detail pages.
- Ingredient explanation API through the validated provider flow.

### Routine Management

- Routine builder.
- Product-backed routine steps.
- Routine update/delete support.
- Routine safety analysis.
- Mock/fallback AI-provider behavior for MVP.

### Today Routine Checklist and Routine Logs

- Daily routine completion tracking.
- Local-date based routine log behavior.
- Routine log create/update/delete flows.

### Skin Journal

- Create journal entry.
- Edit journal entry.
- Delete journal entry.
- User-owned journal timeline.

### Dashboard

- Authenticated dashboard.
- User-owned profile/routine/log/journal/analysis summaries.
- Next action guidance.

### Settings and Data Control

- Settings/Data Control page.
- Account information display.
- Account deletion request marker flow.

### CI and Validation

- GitHub Actions CI workflow.
- MongoDB service for E2E testing in CI.
- Database index validation.
- Playwright E2E tests aligned with Vietnamese UI copy.
- Strict-mode-safe E2E selectors.

## Validation Evidence

Runtime baseline:

```txt
Node.js: v24.14.0
npm: 11.14.1
```

Final validation:

```txt
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 72 files / 719 tests
npm run build: PASS
npm run db:indexes: PASS - 32 indexes ensured
npm run test:e2e: PASS - 24/24 tests
npm audit --omit=dev --audit-level=moderate: PASS - 0 recorded production vulnerabilities
```

## Production Verification

Production URL:

```txt
https://skinwise-vn.vercel.app
```

Verified areas:

- Vercel production deployment.
- Google OAuth login.
- MongoDB Atlas-backed authenticated read/write flows.
- Protected route redirects.
- Dashboard after login.
- Skin Profile flow.
- Product catalogue/detail flow.
- Saved Products flow.
- Ingredient library/detail flow.
- Routine Builder and Routine Analysis flow.
- Today Routine Log flow.
- Skin Journal flow.
- Settings/Data Control flow.
- Sign out behavior.

## Known MVP Limitations

The following items are intentionally out of scope for MVP v1.0:

- Real AI provider integration.
- Image upload.
- AI face analysis.
- Skin score or appearance scoring.
- Marketplace/cart/payment.
- Admin product/ingredient CRUD.
- Notifications.
- Full commercial monitoring and analytics.

## Final Release Decision

```txt
SkinWise VN MVP v1.0 — READY FOR PORTFOLIO / SUBMISSION
```
