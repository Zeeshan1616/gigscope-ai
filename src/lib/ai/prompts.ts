import { ContentType, ExtractedSellerOffer, ServiceClassification, SourceRecord } from "@/types";

export function buildSystemPrompt(contentType: ContentType): string {
  return `You are GigScope AI, an expert Fiverr marketplace content intelligence and pre-publication optimization engine.

Your role is to analyze a seller's draft, integrate real market research evidence, and produce a polished, authentic, high-converting optimized draft.

STRICT EDITORIAL AND TRUTH RULES:
1. NEVER invent certifications, years of experience, client numbers, revenue metrics, or fake guarantees.
2. PRESERVE the seller's genuine offer, tools, and stated scope. If an important detail is missing, provide a placeholder or mark it for seller confirmation.
3. BAN GENERIC FILLER: Eliminate "Welcome to my gig", "Look no further", "Your satisfaction is my top priority", "100% satisfaction guarantee", "I will take your business to the next level".
4. WRITE AS A REAL PROFESSIONAL: Use crisp, human, specific language focused on buyer deliverables and tangible outcomes.
5. RESPECT FIVERR PLATFORM LIMITS:
   - Mode A (Title): Maximum 80 characters total! Must begin with "I will". Ideal display length is 50-70 characters.
   - Mode B (Description): Maximum 1,200 characters total hard ceiling! First 110 characters should deliver a punchy summary hook. Use scannable bullet points. Absolutely NO personal email, phone, or off-platform payment info.
   - Mode C (FAQs): 3 to 7 relevant questions. Each answer MUST be 300 characters or fewer! Answers must be direct and helpful.
6. OUTPUT STRICT VALID JSON MATCHING THE REQUESTED SCHEMA. DO NOT include markdown code fences or conversational greetings.`;
}

export function buildUserPrompt(
  contentType: ContentType,
  draft: string,
  classification: ServiceClassification,
  sellerOffer: ExtractedSellerOffer,
  sources: SourceRecord[],
  optionalContext?: string
): string {
  const sourcesSummary = sources
    .slice(0, 5)
    .map((s, i) => `[Source ${i + 1}] Title: "${s.title}" | Domain: ${s.domain} | Snippet: "${s.snippet}"`)
    .join("\n");

  return `=== SELLER'S ORIGINAL DRAFT ===
"${draft}"

${optionalContext ? `=== SELLER'S OPTIONAL NOTES ===\n"${optionalContext}"\n` : ""}
=== DETECTED NICHE & CLASSIFICATION ===
- Category: ${classification.category}
- Specific Niche: ${classification.niche} (${classification.subNiche})
- Core Service: ${classification.coreService}
- Primary Deliverable: ${classification.primaryDeliverable}
- Target Buyer: ${classification.targetBuyer}
- Buyer Problem: ${classification.buyerProblem}

=== SELLER'S STATED FACTS (DO NOT INVENT CLAIMS BEYOND THIS) ===
- Tools/Tech: ${sellerOffer.statedToolsOrTech.join(", ") || "None explicitly stated"}
- Deliverables: ${sellerOffer.explicitDeliverables.join(", ") || "General service deliverables"}
- Process: ${sellerOffer.statedProcess.join(", ") || "Standard workflow"}
- Flags: ${sellerOffer.unsupportedClaimsDetected.join(", ") || "None"}

=== REAL MARKET RESEARCH EVIDENCE OBSERVED ===
${sourcesSummary || "No external listings indexed; optimize based on detected niche standards."}

TASK:
Optimize this content for mode: ${contentType.toUpperCase()}.
Ensure your recommended content is strictly within platform character limits (${contentType === "title" ? "80 chars max" : contentType === "description" ? "1,200 chars max" : "300 chars max per FAQ answer"}).
Return the output as pure JSON according to the schema.`;
}
