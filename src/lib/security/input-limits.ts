import { ContentType } from "@/types";

export const INPUT_LIMITS = {
  MIN_DRAFT_LENGTH: 3,
  MAX_DRAFT_LENGTH: 15000,
  MAX_OPTIONAL_CONTEXT_LENGTH: 3000,
  ALLOWED_CONTENT_TYPES: ["title", "description", "faqs"] as const,
};

export interface InputValidationResult {
  isValid: boolean;
  error?: string;
  field?: string;
}

export function validateInputPayload(
  contentType: unknown,
  draft: unknown,
  optionalContext?: unknown
): InputValidationResult {
  // Validate content type
  if (
    typeof contentType !== "string" ||
    !INPUT_LIMITS.ALLOWED_CONTENT_TYPES.includes(contentType as ContentType)
  ) {
    return {
      isValid: false,
      field: "contentType",
      error: `Invalid content type. Must be one of: ${INPUT_LIMITS.ALLOWED_CONTENT_TYPES.join(", ")}`,
    };
  }

  // Validate draft presence and type
  if (typeof draft !== "string") {
    return {
      isValid: false,
      field: "draft",
      error: "Draft content must be a valid text string.",
    };
  }

  const trimmedDraft = draft.trim();
  if (trimmedDraft.length < INPUT_LIMITS.MIN_DRAFT_LENGTH) {
    return {
      isValid: false,
      field: "draft",
      error: `Your draft is too short (minimum ${INPUT_LIMITS.MIN_DRAFT_LENGTH} characters). Please enter your proposed content.`,
    };
  }

  if (trimmedDraft.length > INPUT_LIMITS.MAX_DRAFT_LENGTH) {
    return {
      isValid: false,
      field: "draft",
      error: `Draft exceeds the maximum allowed limit of ${INPUT_LIMITS.MAX_DRAFT_LENGTH.toLocaleString()} characters.`,
    };
  }

  // Validate optional context if provided
  if (optionalContext !== undefined && optionalContext !== null) {
    if (typeof optionalContext !== "string") {
      return {
        isValid: false,
        field: "optionalContext",
        error: "Optional context must be a text string.",
      };
    }
    if (optionalContext.trim().length > INPUT_LIMITS.MAX_OPTIONAL_CONTEXT_LENGTH) {
      return {
        isValid: false,
        field: "optionalContext",
        error: `Optional context exceeds the maximum allowed limit of ${INPUT_LIMITS.MAX_OPTIONAL_CONTEXT_LENGTH.toLocaleString()} characters.`,
      };
    }
  }

  return { isValid: true };
}
