# SkinWise VN Demo Script

Last updated: 2026-06-02

## 1. Demo Objective

Show SkinWise VN as a complete educational skincare tracking MVP. The demo should communicate the user problem, MVP scope, main workflows, safety boundaries, and technical implementation clearly in 3-5 minutes.

Do not present the app as a medical diagnosis tool, dermatologist replacement, skin scoring tool, image analysis product, marketplace, or real external AI product.

## 2. Demo Account Preparation Note

Use a real authenticated demo account through Google login.

Before the demo:

- confirm the production app opens;
- confirm Google sign-in works;
- confirm the account has a demo Skin Profile, Product Match candidates, saved product example, routines, routine logs, and journal entries;
- confirm no private secrets or personal data are visible on screen.

## 3. Demo Data Preparation Note

Public/shared demo products and ingredients are seeded through `scripts/seed.ts`.

User-owned demo data should be created through the authenticated UI:

- Skin Profile;
- Product Match review;
- Ingredient Library review;
- Morning Routine;
- Evening Routine;
- saved product example;
- optional caution routine;
- routine logs;
- skin journal entries;
- Insights review;
- routine analysis records.

Do not create fake Auth.js users or hardcode fake user ids for the demo.

Supporting setup guide:

- `docs/ai-coding/07-demo-data-and-demo-script.md`

## 4. 3-5 Minute Demo Flow

| Step | Screen / Route | Action | Talking Points | BA Value | Technical Value |
|---:|---|---|---|---|---|
| 1 | Landing page `/` | Open the app | "SkinWise VN is an educational skincare tracking MVP for users who want to organize routines and track progress safely." | Product positioning and scope boundary | Public route and app shell |
| 2 | Login `/api/auth/signin` | Start Google login if needed | "The app uses authenticated flows because skin profile, routines, and journal entries are personal data." | Privacy and user ownership | Auth.js / NextAuth foundation |
| 3 | Dashboard `/dashboard` | Show authenticated dashboard | "The dashboard summarizes user-owned profile, routines, today logs, latest journal, and analysis." | Summary of user journey | Server/API-driven dashboard |
| 4 | Skin Profile `/skin-profile` | Show or update profile | "The profile captures skin type, concerns, sensitivity, budget, and experience level." | Persona and requirements thinking | Zod validation and user-scoped persistence |
| 5 | Product Match `/product-match` | Review matched products | "Product Match uses deterministic rules from the user's Skin Profile. It shows score, level, reasons, and cautions as educational guidance, not medical advice." | Personalized value without unsafe claims | Rule-based scoring, visible product filtering, saved-product state |
| 6 | Product Match `/product-match` | Save a matched product and open details | "A recommendation card can be saved and opened in Product Detail for ingredient and suitability review." | Clear next action from a match | Saved-products integration and product detail navigation |
| 7 | Product Detail `/products/[id]` | Review the saved match | "The detail page shows ingredients, key actives, warnings, and suitability fields." | Informed decision support | DTO-safe product detail route |
| 8 | Saved Products `/saved-products` | Open saved products | "Saved Products lets users bookmark products they want to revisit without adding marketplace, cart, or public sharing." | Retention and routine planning support | User-owned saved_products module, API, and UI |
| 9 | Ingredient Library `/ingredients` | Search for Niacinamide | "The ingredient library explains common skincare ingredients in beginner-friendly language." | Education without diagnosis | Authenticated ingredient API and client UI |
| 10 | Ingredient Detail `/ingredients/[id]` | Open ingredient detail and request explanation | "The detail page shows uses, suitability, cautions, and an educational explanation that may use a safe fallback." | Safety copy and scope control | Detail route, explanation API, provider abstraction |
| 11 | Routine Builder `/routines` | Show Morning/Evening routines and ordered steps | "The user can turn product choices into a simple morning or evening routine, with compact context for selected products." | Core workflow design and usability | Routine API, product snapshot behavior, and saved/catalogue product picker |
| 12 | Routine Safety Analysis `/routines` | Run or show analysis result | "The analysis separates overview, positive findings, caution points, suggestions, and safety notes using deterministic rules first." | Safety requirement and scope control | Rule engine, provider abstraction, fallback |
| 13 | Today Routine Log `/routine-logs/today` | Use the Routine Builder CTA or mark routine status | "After building a routine, the user can open Checklist hôm nay to track completion." | Clear demo continuity from planning to tracking | Upsert by user/routine/localDate |
| 14 | Skin Journal `/journal` | Show/create/edit entry | "The journal captures observations, symptoms, products, sleep, stress, and notes." | Progress tracking and privacy | User-owned journal API and DTO mapping |
| 15 | Insights `/insights` | Review progress insights | "Insights tells a progress story from routine logs and journal entries: consistency, recent activity, self-reported symptoms, product mentions, and safe next actions." | Reflective progress review without diagnosis or causality claims | Aggregation use case, protected API route, DTO-preserving v1.8 usability refinement |
| 16 | Settings `/settings` | Show data control | "Settings makes account and data control visible without overpromising full commercial privacy tooling." | Trust and privacy scope | `/api/me` and account deletion request flow |
| 17 | Closing | Summarize | "The project demonstrates MVP thinking, safe scope, requirements traceability, testing, and deployment readiness." | BA portfolio narrative | Full-stack implementation narrative |

## 5. What To Say At Each Screen

Landing page:

- "This project focuses on skincare routine tracking and education, not diagnosis."
- "The MVP scope is intentionally controlled: profile, products, routines, logs, journal, dashboard, and safe explanations."

Login:

- "Authentication is important because journal and routine data are private."
- "Auth.js owns authentication routes, while SkinWise owns app-specific user profile data."

Dashboard:

- "This screen connects the main user journey into one summary."
- "It helps the user know what to do next without creating a skin score."

Skin Profile:

- "This is where the user describes their skin context."
- "The app stores this as user-owned data and does not make medical conclusions."

Product Catalogue:

- "The products are demo/seed-style catalogue data."
- "The catalogue supports filtering and browsing, but product purchase and marketplace flows are out of scope."

Product Detail:

- "The product detail page gives more context before the user builds a routine."
- "The data shown is public product DTO data, not private user data."

Product Match:

- "Product Match answers which visible catalogue products may fit the user's Skin Profile."
- "It is deterministic and rule-based. It does not use a real AI provider, diagnose skin, or guarantee results."
- "Each card shows a match score, match level, reasons, cautions, Save/Saved state, and a View Details path."

Saved Products:

- "The user can save a product from catalogue or detail, revisit it under Saved Products, and remove it later."
- "Saved Products is user-owned bookmarking only; it is not a cart, marketplace, or public sharing feature."

Ingredient Library:

- "The ingredient library lets users browse and search common skincare ingredients."
- "The copy is educational and cautious; it does not diagnose, prescribe, or guarantee suitability."

Ingredient Detail:

- "The detail page shows aliases, functions, common uses, suitability, cautions, avoid-with notes, and references."
- "The explanation panel calls the existing explanation API and labels fallback responses when the AI-style service is unavailable or disabled."

Routine Builder:

- "The routine builder supports morning and evening routines with ordered steps."
- "Morning copy explains lighter cleansing, hydration, barrier support, and sunscreen; evening copy frames recovery or active steps without encouraging too many strong actives."
- "The selected product context shows source, brand, category, key actives, and caution cues from already-loaded product metadata."
- "The CTA to Checklist hôm nay connects planning to daily tracking without adding a new route."

Routine Safety Analysis:

- "The safety engine runs deterministic rules before AI-style explanation."
- "The result is easier to scan: overview, positive findings, caution points, suggestions, safety note, and history."
- "The current provider is mock/validated for demo use; real OpenAI/Gemini is not implemented."

Routine Logs:

- "RoutineLog tracks whether the user completed, partially completed, or skipped a routine."
- "It is separate from SkinJournal because behavior and observations are different data types."

Skin Journal:

- "Journal entries help users record observations safely and privately."
- "The wording stays observational and educational, not diagnostic."

Insights:

- "Insights summarizes self-tracked routine logs and journal entries in one progress dashboard."
- "The calendar explains logged, partial, completed, and no-log days without shaming the user."
- "Journal and product sections are reflective only: they do not diagnose symptoms or claim that a product caused or fixed anything."
- "Next actions point back to existing flows such as Checklist hôm nay, Routine Builder, and Skin Journal."

Dashboard summary:

- "This is the payoff of the MVP workflow: the dashboard uses profile, routines, logs, journal, and analysis data."
- "It shows product thinking, requirements traceability, and working full-stack implementation."

## 6. Common Questions and Suggested Answers

| Question | Suggested Answer |
|---|---|
| Is this a medical app? | No. It is an educational skincare tracking MVP and does not diagnose, prescribe, or guarantee results. |
| Does it use real AI? | The architecture includes an AI provider abstraction and validated mock provider. Ingredient and routine explanations may use safe mock/fallback behavior. Real OpenAI/Gemini providers are not implemented in the current MVP. |
| Why not include image upload? | Image upload adds privacy, storage, consent, and safety risks. It is intentionally out of MVP scope. |
| Why use routine safety rules before AI? | Deterministic rules are more auditable and safer for core risk signals. AI-style output can explain, but not replace, the rules. |
| Why separate RoutineLog and SkinJournal? | RoutineLog tracks behavior. SkinJournal tracks observations. Keeping them separate makes analytics cleaner and protects journal semantics. |
| Why is Product CRUD not implemented? | The MVP focuses on user routine tracking and a curated demo catalogue. Admin/product submission is future scope. |
| What BA skills does this show? | Problem framing, user journey, scope control, user stories, acceptance criteria, requirements traceability, and demo storytelling. |
| What technical skills does this show? | Next.js App Router, TypeScript, MongoDB, Auth.js, Zod, modular code organization, API routes, DTO mapping, testing, and Vercel deployment readiness. |
| What would you improve next? | After MVP v1.8, the next focused product-quality task can be MVP v1.9 - Production Monitoring & Demo Evidence Stabilization. Later work can include admin product management and real provider integration with strict safety controls. |

## 7. Closing Explanation

Close the demo with:

```txt
SkinWise VN is valuable as a portfolio project because it shows both BA thinking and full-stack execution. I defined the problem, scoped the MVP, documented requirements, implemented the core user journey, validated it with tests and deployment checks, and prepared a realistic demo without expanding into unsafe or unsupported features.
```
