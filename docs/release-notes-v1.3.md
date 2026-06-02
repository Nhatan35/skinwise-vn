# SkinWise VN Release Notes v1.3

Last updated: 2026-05-31

Historical note: this document records the MVP v1.3 release milestone. The current project state is MVP v1.6 with MVP v1.6.1 validation evidence and documentation truth sync. See `docs/final-release-checklist.md` for current status.

## Summary

SkinWise VN v1.3 was the release documentation sync for an earlier portfolio-ready MVP milestone. It records the completed Personalized Product Match feature, the completed Skin Progress Insights feature, then-current validation evidence, and the final release/demo documentation package for that milestone.

This release is intended for GitHub release notes, portfolio review, interview walkthroughs, demo presentation, and final project submission.

## Added

- Personalized Product Match.
- Protected `/product-match` route.
- Authenticated `GET /api/product-match` endpoint.
- Rule-based product scoring based on Skin Profile, visible product catalogue data, budget, sensitivity, avoided ingredients, and saved-product state.
- Match score and match level.
- Match reasons and cautions.
- Save/Saved product state on matched product cards.
- Product detail navigation from Product Match results.
- Dashboard navigation and dashboard next-action integration for Product Match.
- Skin Progress Insights and Calendar.
- Protected `/insights` route and authenticated `GET /api/insights` endpoint.

## Changed

- Final release documentation synchronized for v1.3.
- Portfolio case study updated to include Product Match and Insights.
- Demo script updated to include Product Match, saving a matched product, product detail navigation, and Insights.
- Demo data guide updated to support Product Match and Insights walkthroughs.
- Deployment checklist updated with then-current validation evidence and Product Match/Insights smoke-test coverage.
- Final release checklist updated for v1.3 release readiness.
- Then-current validation evidence updated across release/status documentation.

## Testing and Validation

Latest known validated release evidence:

```txt
Node: v24.14.0
npm: 11.14.1
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 84 files / 777 tests
npm run build: PASS
npm run db:indexes: PASS - 32 indexes ensured
npm run test:e2e: PASS - 28/28 tests
```

Coverage includes unit, API contract, client, repository, UI/source checks, authenticated Playwright E2E flows, and protected-route behavior.

## Safety Boundaries

- Product Match is educational guidance only.
- Product Match uses deterministic rules and does not call a real AI provider.
- No diagnosis.
- No medical claims.
- No treatment or guarantee claims.
- No skin score.
- No image upload or face analysis.
- No marketplace, checkout, order, payment, subscription, rating, or review flow.

## Known Limitations

- Real OpenAI/Gemini provider integration is not enabled for the MVP.
- Product matching is rule-based and deterministic rather than AI-generated.
- Product and ingredient data are curated/demo-oriented catalogue data.
- Full Auth.js hard-delete account automation is not implemented; the MVP includes an account deletion request marker.
- Production monitoring/error tracking is outside the current MVP.

## Demo Flow

```txt
Landing page
-> Login
-> Dashboard
-> Skin Profile
-> Product Match
-> Save recommended product
-> Product Detail
-> Saved Products
-> Ingredients
-> Routine Builder
-> Routine Analysis
-> Today Routine Log
-> Journal
-> Insights
-> Settings
```

## Release Readiness

```txt
GitHub release: READY
Portfolio review: READY
Interview demo: READY
Final submission: READY
```

This historical readiness statement is based on the v1.3 validation evidence above and the completed v1.3 documentation sync. Production deployment remains an MVP portfolio/demo deployment, not a full commercial production hardening claim.
