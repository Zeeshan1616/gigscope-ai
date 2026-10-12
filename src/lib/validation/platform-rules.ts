import { ContentType, ValidationItem } from "@/types";

const PROHIBITED_CONTACT_PATTERNS = [
  { pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/i, name: "Email address detected (Violates Fiverr TOS off-platform communication)" },
  { pattern: /\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/, name: "Phone number detected (Violates Fiverr TOS off-platform communication)" },
  { pattern: /\b(skype|telegram|whatsapp|wechat|discord)\b/i, name: "External messaging service mentioned (Risk of account warning)" },
  { pattern: /\b(paypal|venmo|cashapp|zelle|bank\s*transfer|wire)\b/i, name: "Direct off-platform payment method mentioned (Strict Fiverr TOS violation)" },
];

export function validatePlatformRules(contentType: ContentType, text: string): ValidationItem[] {
  const checks: ValidationItem[] = [];

  // Check 1: Off-platform contact info (applies to all content types)
  let contactViolation = false;
  for (const { pattern, name } of PROHIBITED_CONTACT_PATTERNS) {
    if (pattern.test(text)) {
      contactViolation = true;
      checks.push({
        id: "check-contact-tos",
        category: "platform_compliance",
        ruleName: "No Off-Platform Contact Information",
        passed: false,
        severity: "critical",
        message: name,
        details: "Fiverr strictly prohibits sharing personal contact details or off-platform payment options.",
      });
      break;
    }
  }
  if (!contactViolation) {
    checks.push({
      id: "check-contact-tos",
      category: "platform_compliance",
      ruleName: "No Off-Platform Contact Information",
      passed: true,
      severity: "passed",
      message: "No email, phone number, or external payment methods detected.",
    });
  }

  // Check 2: Content-specific limits
  if (contentType === "title") {
    const charLen = text.length;
    const isUnder80 = charLen <= 80;
    checks.push({
      id: "check-title-len",
      category: "platform_compliance",
      ruleName: "80-Character Title Ceiling",
      passed: isUnder80,
      severity: isUnder80 ? "passed" : "critical",
      message: isUnder80
        ? `Title length is ${charLen}/80 characters (Fiverr compliant).`
        : `Title is ${charLen} characters, exceeding Fiverr's 80-character maximum.`,
      details: "Titles over 80 characters cannot be saved in the Fiverr gig editor.",
    });

    const startsIWill = /^i will/i.test(text.trim());
    checks.push({
      id: "check-title-i-will",
      category: "platform_compliance",
      ruleName: "Standard 'I will' Convention",
      passed: startsIWill,
      severity: startsIWill ? "passed" : "warning",
      message: startsIWill
        ? "Title begins with standard 'I will' phrasing."
        : "Title does not begin with 'I will' (Fiverr pre-fixes this in the editor).",
    });

    const hasExcessivePunctuation = /[!?;]{2,}/.test(text) || text.includes("...");
    checks.push({
      id: "check-title-punctuation",
      category: "platform_compliance",
      ruleName: "Clean Title Punctuation",
      passed: !hasExcessivePunctuation,
      severity: !hasExcessivePunctuation ? "passed" : "warning",
      message: !hasExcessivePunctuation
        ? "No excessive punctuation or disallowed symbols."
        : "Avoid repeated punctuation (!!, ??, ...) in titles.",
    });
  } else if (contentType === "description") {
    const charLen = text.length;
    const isUnder1200 = charLen <= 1200;
    checks.push({
      id: "check-desc-len",
      category: "platform_compliance",
      ruleName: "1,200-Character Description Ceiling",
      passed: isUnder1200,
      severity: isUnder1200 ? "passed" : "critical",
      message: isUnder1200
        ? `Description length is ${charLen}/1,200 characters.`
        : `Description length is ${charLen} characters, exceeding Fiverr's strict 1,200 character cap.`,
      details: "Fiverr will reject Gig descriptions exceeding 1,200 characters.",
    });
  }

  return checks;
}
