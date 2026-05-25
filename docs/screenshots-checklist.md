# SkinWise VN Screenshots Checklist

Last updated: 2026-05-24

Use this checklist when capturing portfolio screenshots. Screenshots should show realistic demo data, avoid secret values, and avoid personal/private information that should not appear in a public portfolio.

## Screenshot Checklist

| Screenshot Name | Route | What It Should Show | Portfolio Purpose | Notes Before Taking Screenshot |
|---|---|---|---|---|
| `01-landing-page.png` | `/` | Landing page with current MVP positioning | Shows product overview and safe educational boundary | Confirm no outdated Week 1-only copy appears |
| `02-sign-in.png` | `/api/auth/signin` | Auth.js sign-in with Google option | Shows authentication entry point | Do not reveal private account details beyond normal UI |
| `03-dashboard-authenticated.png` | `/dashboard` | Dashboard cards with profile/routine/log/journal/analysis summary | Shows the complete MVP value loop | Use demo account with prepared data |
| `04-skin-profile.png` | `/skin-profile` | Oily or combination-oily demo profile with concerns | Shows persona and onboarding data | Avoid showing real private personal data |
| `05-product-catalogue.png` | `/products` | Product cards, search/filter state, demo products | Shows public/shared catalogue data | Use search/filter that looks intentional |
| `06-product-detail.png` | `/products/[id]` | Product detail fields, key actives, warnings, suitability | Shows product inspection workflow | Pick a polished demo product such as sunscreen, niacinamide, or BHA |
| `07-routine-builder.png` | `/routines` | Morning and Evening Routine cards/steps | Shows core routine creation workflow | Confirm routine names and step order are readable |
| `08-routine-analysis.png` | `/routines` | Routine analysis result with educational safety wording | Shows rule engine and mock provider flow | Do not imply medical diagnosis or real dermatologist AI |
| `09-routine-logs.png` | `/routines` | Routine log status controls or completed/partial/skipped state | Shows daily consistency tracking | Use a completed or mixed status example |
| `10-skin-journal.png` | `/journal` | Journal timeline with realistic observations | Shows privacy-first progress tracking | Avoid raw sensitive notes if too personal |
| `11-dashboard-summary.png` | `/dashboard` | Dashboard after demo data setup | Shows end-to-end summary after user actions | Capture after routines, logs, and journal entries exist |
| `12-readme-demo-section.png` | `README.md` rendered view | README overview, demo, and portfolio links | Shows project documentation quality | Optional; useful for GitHub portfolio presentation |

## Quality Checklist

- Use the deployed MVP demo or a local environment with the same demo data.
- Use consistent browser zoom, preferably 100%.
- Hide browser bookmarks or unrelated tabs.
- Do not show `.env.local`, terminal secrets, OAuth secrets, database URI, API keys, or private tokens.
- Do not show personal email if the screenshot will be public, unless using a dedicated demo account.
- Prefer screenshots with meaningful data instead of empty states.
- Keep safety wording visible where relevant.
- Do not crop out route context if the route is useful for explanation.

## Suggested Portfolio Order

1. Landing page.
2. Dashboard summary.
3. Skin Profile.
4. Product Catalogue.
5. Product Detail.
6. Routine Builder.
7. Routine Safety Analysis.
8. Routine Logs.
9. Skin Journal.
10. README/demo documentation.

## Next Step

Screenshots are optional release polish after `TASK FINAL-RELEASE-001`. Capture them through `OPTIONAL-SCREENSHOTS-001` only when the app is running safely and no private credentials, tokens, or personal account data are visible.
