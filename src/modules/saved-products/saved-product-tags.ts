export const SAVED_PRODUCT_TAG_MAX_LENGTH = 30;
export const SAVED_PRODUCT_TAGS_MAX_COUNT = 8;

const savedProductTagPattern = /^[\p{L}\p{N} _-]+$/u;

export type SavedProductTagsValidationResult =
  | {
      ok: true;
      tags: string[];
    }
  | {
      error: string;
      ok: false;
    };

export function normalizeSavedProductTag(value: string) {
  return value.trim();
}

export function getSavedProductTagKey(value: string) {
  return normalizeSavedProductTag(value).toLocaleLowerCase("vi-VN");
}

export function validateSavedProductTags(
  rawTags: readonly string[],
): SavedProductTagsValidationResult {
  if (rawTags.length > SAVED_PRODUCT_TAGS_MAX_COUNT) {
    return {
      error: `Use ${SAVED_PRODUCT_TAGS_MAX_COUNT} tags or fewer per saved product.`,
      ok: false,
    };
  }

  const tags: string[] = [];
  const seenTags = new Set<string>();

  for (const rawTag of rawTags) {
    const tag = normalizeSavedProductTag(rawTag);

    if (!tag) {
      return {
        error: "Tags cannot be empty.",
        ok: false,
      };
    }

    if (tag.length > SAVED_PRODUCT_TAG_MAX_LENGTH) {
      return {
        error: `Each tag must be ${SAVED_PRODUCT_TAG_MAX_LENGTH} characters or fewer.`,
        ok: false,
      };
    }

    if (!savedProductTagPattern.test(tag)) {
      return {
        error:
          "Tags can use letters, numbers, spaces, hyphen, and underscore only.",
        ok: false,
      };
    }

    const tagKey = getSavedProductTagKey(tag);

    if (seenTags.has(tagKey)) {
      return {
        error: "Duplicate tags are not allowed.",
        ok: false,
      };
    }

    seenTags.add(tagKey);
    tags.push(tag);
  }

  return {
    ok: true,
    tags,
  };
}

export function parseSavedProductTagsInput(
  value: string,
): SavedProductTagsValidationResult {
  if (value.trim() === "") {
    return {
      ok: true,
      tags: [],
    };
  }

  return validateSavedProductTags(value.split(","));
}
