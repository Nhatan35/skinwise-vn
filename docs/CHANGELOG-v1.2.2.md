# CHANGELOG-v1.2.2.md

# SDD v1.2.2 — Documentation Consistency Hotfix

## Summary

This version is a documentation consistency hotfix. It does not change product positioning and does not add major features beyond MVP.

SkinWise VN remains an AI skincare education and routine safety assistant, not a medical diagnosis app.

## Changes

### API Contract

- Fixed `GET /api/ingredients` section that accidentally contained product visibility rules.
- Added Ingredient API visibility rules:
  - `GET /api/ingredients` requires authentication in MVP.
  - `GET /api/ingredients/:id` requires authentication in MVP.
  - `POST /api/ingredients/explain` requires authentication and rate limit.
  - Ingredient records do not use product `verificationStatus`.
  - User-submitted ingredient creation is out of MVP scope.
  - Admin ingredient management is out of MVP UI scope.
- Clarified `GET /api/products` authentication:
  - MVP requires authentication.
  - Default returns only verified/reviewed products.
  - `includeMine=true` returns only current user's own unverified submissions.
  - `includeMine=true` must never return other users' unverified products.
- Added visibility rules for `GET /api/products/:id`.

### README

- Standardized Auth.js / NextAuth v5-style environment variables:
  - `AUTH_SECRET`
  - `AUTH_URL`
  - `AUTH_GOOGLE_ID`
  - `AUTH_GOOGLE_SECRET`
- Added warning not to use `NEXTAUTH_*` unless the SDD is deliberately changed to NextAuth v4.

### Data Model

- Clarified SkinJournal MVP decision:
  - one journal entry per user per `localDate`.
  - duplicate entries for the same `localDate` are not allowed.
  - editing the same day should use `PATCH /api/skin-journal/:id`.
- Added unique index:
  - `compound unique index: userId, localDate`
- Fixed index wording from `unique compound index: userId` to `unique index: userId`.
- Removed duplicated Product `brand` index entry where present.

### Security and Privacy

- Added MVP API authentication policy:
  - app APIs require authentication unless explicitly documented public.
  - product and ingredient APIs require authentication in MVP.
  - AI explanation endpoints require authentication and rate limits.

### Test Plan

- Added Ingredient API auth tests.
- Added Product API auth and visibility tests.
- Added SkinJournal one-entry-per-day tests.
- Added validation expectations for `localDate` and `timezone`.

### Project Rules

- Updated `AGENTS.md` with v1.2.2 API consistency rules.
- Added SDD freeze note in release plan.

## No changes

- No code implementation.
- No medical diagnosis feature.
- No treatment guarantee.
- No face scoring.
- No marketplace or affiliate scope.
- No new major MVP feature.
