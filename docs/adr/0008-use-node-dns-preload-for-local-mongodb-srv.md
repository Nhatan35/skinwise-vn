# ADR 0008: Use Node DNS Preload for Local MongoDB Atlas SRV Lookup

Date: 2026-05-23

## Status

Accepted for local development

## Context

Local MongoDB Atlas connection failed in Node.js with:

```txt
querySrv ECONNREFUSED _mongodb._tcp.cluster0.ix5tn.mongodb.net
```

Diagnostics showed:

```txt
nslookup SRV lookup succeeded.
TCP port 27017 checks succeeded.
Node.js `dns.resolveSrv(...)` failed with default DNS.
Node.js `dns.setServers(["8.8.8.8", "1.1.1.1"])` fixed SRV resolution.
```

The failure occurred in both the MongoDB helper path and the Auth.js MongoDB Adapter callback path unless DNS was configured before the runtime attempted SRV lookup.

## Decision

Use a local preload script:

```txt
scripts/configure-node-dns.cjs
```

and start local development with:

```txt
node --require ./scripts/configure-node-dns.cjs ./node_modules/next/dist/bin/next dev
```

The shared MongoDB helper also configures the same DNS servers before creating `MongoClient`.

## Consequences

Positive:

- `npm run dev` applies the DNS configuration before Next.js/Auth.js starts.
- The fix covers Auth.js callback runtime, not only standalone database scripts.
- MongoDB Atlas `mongodb+srv://` can remain the canonical local connection string.

Trade-offs:

- The local dev command is more explicit than `next dev`.
- The workaround is environment-specific and should be revalidated if the machine/network/DNS setup changes.
- Production deployment should use the hosting platform's DNS/network behavior and should not blindly require this workaround unless the same Node SRV failure is observed.

## Verification

```txt
npm run db:indexes
# db:indexes created: 30 indexes ensured

npm run dev
# [node-dns] DNS servers: [ '8.8.8.8', '1.1.1.1' ]
```

## Rollback criteria

This workaround may be removed only when the following command succeeds without explicitly calling `dns.setServers(...)` on the target development environment:

```txt
node -e "require('dns').resolveSrv('_mongodb._tcp.<cluster-host>', console.log)"
```
