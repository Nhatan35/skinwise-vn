# Current Sprint Plan - SkinWise VN MVP v1.2.6

Last updated: 2026-05-23

## 1. Current sprint

```txt
TASK LOCAL-AUTH-DB-001 - Stabilize Local MongoDB/Auth Runtime
```

## 2. Sprint goal

Make local development reliable for MongoDB Atlas and Auth.js Google OAuth by fixing Node.js SRV DNS resolution, verifying the MongoDB index script, documenting the required local runtime workflow, and aligning Auth.js to JWT session strategy while keeping the MongoDB Adapter for identity/account persistence.

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
TASK SJ-003 - Add SkinJournal Product Linking / Product Name Resolution completed
TASK PRODUCT-UI-001 - Implement Product Catalogue UI completed
```

## 4. Completed this sprint

```txt
[x] `npm run db:indexes` loads `.env.local` through Node `--env-file`.
[x] MongoDB Atlas connection verified through index creation: `db:indexes created: 30 indexes ensured`.
[x] `scripts/configure-node-dns.cjs` added as a process-level local DNS preload.
[x] `npm run dev` now starts Next.js through Node `--require ./scripts/configure-node-dns.cjs`.
[x] Shared MongoDB helper configures DNS before creating `MongoClient`.
[x] Auth.js server runtime configures DNS before loading shared MongoDB client provider.
[x] Auth.js keeps MongoDB Adapter but uses `session.strategy = "jwt"`.
[x] Local `JWTSessionError` / `Invalid Compact JWE` browser-cookie cleanup path documented.
[x] Docs updated to reflect the local runtime fix and troubleshooting process.
```

## 5. Not allowed this sprint

```txt
No new product feature.
No Product CRUD.
No admin review workflow.
No saved products.
No image upload.
No AI face analysis.
No skin score.
No diagnosis.
No marketplace.
No payment/subscription.
No database-session migration unless a new ADR approves it.
```

## 6. Acceptance criteria

```txt
[ ] `npm run db:indexes` succeeds locally.
[ ] `npm run dev` prints `[node-dns] DNS servers: [ '8.8.8.8', '1.1.1.1' ]` before or during Next.js startup.
[ ] Google sign-in does not produce `AdapterError` with `querySrv ECONNREFUSED`.
[ ] After clearing localhost site data, Google sign-in does not produce `JWTSessionError` / `Invalid Compact JWE`.
[ ] Authenticated user can reach `/dashboard` after Google sign-in.
[ ] MongoDB Atlas contains Auth.js identity/account records after successful sign-in.
```

## 7. Next task candidate

```txt
TASK AUTH-VERIFY-001 - Verify Google OAuth happy path and dashboard redirect after cookie cleanup
```

Suggested verification steps:

```txt
1. Stop `npm run dev`.
2. Remove `.next`.
3. Start `npm run dev`.
4. Clear site data for `localhost`, `127.0.0.1`, and the LAN URL if used.
5. Log in with Google.
6. Confirm redirect to `/dashboard`.
7. Confirm no Auth.js AdapterError or JWTSessionError appears in terminal.
```
