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
});
