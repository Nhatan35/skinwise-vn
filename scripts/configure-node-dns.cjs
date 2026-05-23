/* eslint-disable @typescript-eslint/no-require-imports */
const dns = require("node:dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

console.log("[node-dns] DNS servers:", dns.getServers());