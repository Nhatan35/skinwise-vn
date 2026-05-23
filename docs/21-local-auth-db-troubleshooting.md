# 21-local-auth-db-troubleshooting.md

# Local MongoDB and Auth.js Troubleshooting — SkinWise VN MVP v1.2.6

Last updated: 2026-05-23

## 1. Purpose

This document records the local runtime fixes for MongoDB Atlas and Auth.js Google OAuth.

It is implementation documentation only. It does not change MVP product scope, API contracts, data model, AI behavior, or safety positioning.

## 2. Known local issue: `MONGODB_URI` missing in scripts

Symptom:

```txt
db:indexes failed
MONGODB_URI is required before using MongoDB infrastructure.
```

Cause:

```txt
The standalone Node index script did not load `.env.local`.
```

Required package script:

```json
"db:indexes": "node --env-file=.env.local --conditions=react-server --import tsx src/infrastructure/database/ensure-indexes.ts"
```

Success signal:

```txt
db:indexes created: 30 indexes ensured
```

## 3. Known local issue: MongoDB Atlas SRV DNS failure in Node.js

Symptom:

```txt
querySrv ECONNREFUSED _mongodb._tcp.cluster0.ix5tn.mongodb.net
```

Important diagnostic result:

```txt
nslookup -type=SRV _mongodb._tcp.<cluster-host>
# succeeds

node -e "require('dns').resolveSrv('_mongodb._tcp.<cluster-host>', console.log)"
# fails

node -e "const dns=require('dns'); dns.setServers(['8.8.8.8','1.1.1.1']); dns.resolveSrv('_mongodb._tcp.<cluster-host>', console.log)"
# succeeds
```

Decision:

```txt
Preload Node DNS configuration before Next.js/Auth.js starts.
```

Required file:

```txt
scripts/configure-node-dns.cjs
```

Required content:

```js
const dns = require("node:dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

console.log("[node-dns] DNS servers:", dns.getServers());
```

Required development script:

```json
"dev": "node --require ./scripts/configure-node-dns.cjs ./node_modules/next/dist/bin/next dev"
```

Success signal:

```txt
[node-dns] DNS servers: [ '8.8.8.8', '1.1.1.1' ]
```

## 4. Auth.js session strategy

Current decision:

```txt
Use MongoDB Adapter for identity/account persistence.
Use JWT session strategy for runtime sessions.
```

Required Auth.js config behavior:

```ts
session: {
  strategy: "jwt",
}
```

Rationale:

```txt
The proxy/middleware path must stay edge-safe and should not depend on MongoDB Adapter runtime state.
JWT sessions avoid database-session/proxy mismatch during App Router route protection.
```

## 5. Known local issue: `JWTSessionError` / `Invalid Compact JWE`

Symptom:

```txt
[auth][error] JWTSessionError
[auth][cause]: JWEInvalid: Invalid Compact JWE
```

Common causes:

```txt
AUTH_SECRET changed.
Session strategy changed between database and jwt.
Browser still has old Auth.js/NextAuth cookies.
```

Fix:

```txt
1. Stop the dev server.
2. Delete `.next`.
3. Clear browser site data for localhost.
4. Clear data for 127.0.0.1 and the LAN development URL if used.
5. Restart `npm run dev`.
6. Sign in again.
```

PowerShell cache cleanup:

```powershell
Remove-Item -Recurse -Force .next
```

Chrome quick path:

```txt
chrome://settings/siteData
Search: localhost
Delete all matching site data
```

DevTools path:

```txt
F12 → Application → Storage → Clear site data
```

Cookie names that may need clearing:

```txt
authjs.session-token
authjs.callback-url
authjs.csrf-token
next-auth.session-token
next-auth.callback-url
next-auth.csrf-token
```

## 6. Local environment expectations

Required `.env.local` keys for local Google OAuth + MongoDB:

```txt
APP_ENV=development
APP_BASE_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://...
AUTH_SECRET=...
AUTH_URL=http://localhost:3000
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
```

Security rules:

```txt
Never commit `.env.local`.
Rotate MongoDB password, Google OAuth client secret, and AUTH_SECRET if they were pasted into chat, logs, screenshots, or shared documents.
Keep AUTH_SECRET stable for a local environment unless you intentionally want to invalidate existing auth cookies.
```

## 7. Verification checklist

```txt
[ ] npm run db:indexes succeeds.
[ ] npm run dev prints the node DNS preload message.
[ ] Google OAuth callback no longer logs querySrv ECONNREFUSED.
[ ] After clearing browser site data, Google OAuth no longer logs Invalid Compact JWE.
[ ] Authenticated user reaches /dashboard.
[ ] MongoDB Atlas contains Auth.js users/accounts records after successful sign-in.
```

## 8. Do not do

```txt
Do not create separate MongoClient instances inside route handlers.
Do not move MongoDB Adapter imports into edge-safe authConfig/proxy files.
Do not switch to database sessions without a new ADR and proxy/middleware review.
Do not commit real secrets to Git.
Do not document real credentials in docs.
```
