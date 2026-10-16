import { describe, it, expect } from "vitest";
import { validatePlatformRules } from "@/lib/validation/platform-rules";

describe("Fiverr Platform Rules Compliance", () => {
  it("should flag off-platform email addresses", () => {
    const text = "Please email me directly at seller@example.com to discuss pricing.";
    const checks = validatePlatformRules("description", text);
    const contactCheck = checks.find((c) => c.id === "check-contact-tos");

    expect(contactCheck?.passed).toBe(false);
    expect(contactCheck?.severity).toBe("critical");
  });

  it("should flag off-platform payment methods", () => {
    const text = "We accept payments via PayPal or direct bank transfer.";
    const checks = validatePlatformRules("description", text);
    const contactCheck = checks.find((c) => c.id === "check-contact-tos");

    expect(contactCheck?.passed).toBe(false);
  });

  it("should enforce the 80-character title ceiling", () => {
    const validTitle = "I will design minimalist modern logo for your business";
    const validChecks = validatePlatformRules("title", validTitle);
    expect(validChecks.find((c) => c.id === "check-title-len")?.passed).toBe(true);

    const longTitle = "I will provide complete modern website development and design services with all responsive features and fast delivery";
    const longChecks = validatePlatformRules("title", longTitle);
    expect(longChecks.find((c) => c.id === "check-title-len")?.passed).toBe(false);
  });

  it("should enforce the 1,200-character description ceiling", () => {
    const longDesc = "a".repeat(1250);
    const checks = validatePlatformRules("description", longDesc);
    const lenCheck = checks.find((c) => c.id === "check-desc-len");

    expect(lenCheck?.passed).toBe(false);
    expect(lenCheck?.severity).toBe("critical");
  });

  it("should enforce the 300-character FAQ answer ceiling", () => {
    const validFaq = "Q: What is included?\nA: Complete responsive source files and assets.";
    const validChecks = validatePlatformRules("faqs", validFaq);
    expect(validChecks.find((c) => c.id === "check-faq-answer-len")?.passed).toBe(true);

    const longFaq = `Q: What is included?\nA: ${"x".repeat(320)}`;
    const longChecks = validatePlatformRules("faqs", longFaq);
    const answerCheck = longChecks.find((c) => c.id === "check-faq-answer-len");
    expect(answerCheck?.passed).toBe(false);
    expect(answerCheck?.severity).toBe("critical");
  });

  it("should enforce the 10 FAQ quantity limit", () => {
    const elevenFaqs = Array.from({ length: 11 }, (_, i) => `Q: Question ${i + 1}?\nA: Answer ${i + 1}`).join("\n\n");
    const checks = validatePlatformRules("faqs", elevenFaqs);
    const countCheck = checks.find((c) => c.id === "check-faq-count");
    expect(countCheck?.passed).toBe(false);
    expect(countCheck?.severity).toBe("warning");
  });
});

