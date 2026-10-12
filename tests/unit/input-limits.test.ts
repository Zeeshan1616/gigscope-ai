import { describe, it, expect } from "vitest";
import { validateInputPayload, INPUT_LIMITS } from "@/lib/security/input-limits";

describe("Input Validation & Limits", () => {
  it("should accept valid title, description, and faqs payloads", () => {
    expect(validateInputPayload("title", "I will do React web development").isValid).toBe(true);
    expect(validateInputPayload("description", "A complete description draft").isValid).toBe(true);
    expect(validateInputPayload("faqs", "Q: What is included? A: Source code.").isValid).toBe(true);
  });

  it("should reject invalid content types", () => {
    const result = validateInputPayload("portfolio", "Some draft");
    expect(result.isValid).toBe(false);
    expect(result.field).toBe("contentType");
  });

  it("should reject drafts shorter than minimum character limit", () => {
    const result = validateInputPayload("title", "ab");
    expect(result.isValid).toBe(false);
    expect(result.field).toBe("draft");
  });

  it("should reject drafts exceeding maximum character limit", () => {
    const longDraft = "a".repeat(INPUT_LIMITS.MAX_DRAFT_LENGTH + 10);
    const result = validateInputPayload("description", longDraft);
    expect(result.isValid).toBe(false);
    expect(result.field).toBe("draft");
  });

  it("should accept valid optional context and reject excessively long context", () => {
    expect(validateInputPayload("title", "I will design a logo", "Targeting tech startups").isValid).toBe(true);

    const longContext = "c".repeat(INPUT_LIMITS.MAX_OPTIONAL_CONTEXT_LENGTH + 10);
    const result = validateInputPayload("title", "I will design a logo", longContext);
    expect(result.isValid).toBe(false);
    expect(result.field).toBe("optionalContext");
  });
});
