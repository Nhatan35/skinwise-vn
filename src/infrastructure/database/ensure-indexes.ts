export async function ensureIndexes() {
  return {
    status: "skipped",
    reason: "Database indexes are not created during Week 1 Task 1.",
  } as const;
}

async function main() {
  const result = await ensureIndexes();
  console.info(
    `db:indexes ${result.status}: ${result.reason}`,
  );
}

main().catch((error: unknown) => {
  console.error("db:indexes failed", error);
  process.exitCode = 1;
});
