# SkinWise VN Release Notes v1.3

Last updated: 2026-05-31

## Summary

SkinWise VN v1.3 is the final release documentation sync for the portfolio-ready MVP. It records the completed Personalized Product Match feature, the completed Skin Progress Insights feature, current validation evidence, and the final release/demo documentation package.

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
- Deployment checklist updated with current validation evidence and Product Match/Insights smoke-test coverage.
- Final release checklist updated for v1.3 release readiness.
- Current validation evidence updated across release/status documentation.

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

This readiness statement is based on the latest known validation evidence above and the completed documentation sync. Production deployment remains an MVP portfolio/demo deployment, not a full commercial production hardening claim.
