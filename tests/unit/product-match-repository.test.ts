import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const productRepositorySource = readFileSync(
  join(process.cwd(), "src/modules/products/product.repository.ts"),
  "utf8",
);

function getFunctionSource(functionName: string) {
  const start = productRepositorySource.indexOf(`export async function ${functionName}`);
  const nextFunction = productRepositorySource.indexOf(
    "\nexport async function",
    start + 1,
  );

  return productRepositorySource.slice(
    start,
    nextFunction === -1 ? productRepositorySource.length : nextFunction,
  );
}

describe("Product Match product repository helper", () => {
  it("loads visible product candidates for matching without applying a user-facing limit", () => {
    const functionSource = getFunctionSource("listVisibleProductsForMatching");

    expect(functionSource).toContain("visibleProductFilter()");
    expect(productRepositorySource).toContain(
      "VISIBLE_PRODUCT_VERIFICATION_STATUSES",
    );
    expect(functionSource).not.toContain(".limit(");
  });
});
