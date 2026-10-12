import { ContentType, ServiceClassification } from "@/types";

interface NicheRule {
  category: string;
  niche: string;
  subNiche: string;
  coreService: string;
  primaryDeliverable: string;
  targetBuyer: string;
  buyerProblem: string;
  keywords: string[];
}

const KNOWN_NICHES: NicheRule[] = [
  {
    category: "Programming & Tech",
    niche: "Web Development",
    subNiche: "Frontend / Fullstack Applications",
    coreService: "Custom Web Application & Dashboard Development",
    primaryDeliverable: "Responsive web application with clean component code and API integration",
    targetBuyer: "Startup founders, businesses, and developers needing custom web interfaces",
    buyerProblem: "Need modern, performant, and responsive web applications without bugs",
    keywords: ["react", "next.js", "nextjs", "vue", "frontend", "fullstack", "web app", "website", "javascript", "typescript", "tailwind", "api"],
  },
  {
    category: "Programming & Tech",
    niche: "WordPress & CMS",
    subNiche: "WordPress Site Design & Speed Optimization",
    coreService: "WordPress Website Building and Customization",
    primaryDeliverable: "Fully functional WordPress website with responsive layout and fast loading speed",
    targetBuyer: "Small business owners, bloggers, and local companies",
    buyerProblem: "Slow, broken, or outdated WordPress websites lacking modern mobile responsiveness",
    keywords: ["wordpress", "elementor", "woocommerce", "divi", "speed optimization", "wp", "blog design"],
  },
  {
    category: "Graphics & Design",
    niche: "Logo & Brand Identity",
    subNiche: "Minimalist / Modern Brand Identity",
    coreService: "Custom Logo Design and Brand Guidelines",
    primaryDeliverable: "Vector logo files (AI, SVG, EPS), brand color palette, and high-resolution PNGs",
    targetBuyer: "New startups, e-commerce stores, and businesses undergoing rebranding",
    buyerProblem: "Lacking a memorable, professional visual identity that builds buyer trust",
    keywords: ["logo", "branding", "brand identity", "minimalist logo", "vector", "mascot", "typography", "graphic design"],
  },
  {
    category: "Digital Marketing",
    niche: "Search Engine Optimization (SEO)",
    subNiche: "On-Page & Technical SEO Optimization",
    coreService: "Website SEO Audit and On-Page Keyword Optimization",
    primaryDeliverable: "On-page meta tags, header optimization, technical audit report, and indexation fixes",
    targetBuyer: "Website owners and e-commerce stores seeking organic Google traffic",
    buyerProblem: "Low search visibility, declining organic rankings, and technical crawl errors",
    keywords: ["seo", "backlinks", "keyword research", "on-page", "technical seo", "meta tags", "google ranking", "audit"],
  },
  {
    category: "Writing & Translation",
    niche: "Content Writing & Copywriting",
    subNiche: "Sales Copy & Website Content",
    coreService: "High-Converting Website Copywriting and Blog Articles",
    primaryDeliverable: "Engaging, SEO-optimized copy tailored to target buyer personas",
    targetBuyer: "Marketers, business owners, and agency clients needing persuasive written copy",
    buyerProblem: "Boring, generic text that fails to convert visitors into paying customers",
    keywords: ["copywriting", "blog post", "article writing", "website copy", "content writer", "sales copy", "proofreading", "seo article"],
  },
  {
    category: "Video & Animation",
    niche: "Video Editing",
    subNiche: "Short-Form Social Media & YouTube Editing",
    coreService: "Professional Video Editing and Motion Graphics",
    primaryDeliverable: "Polished MP4 video with pacing, subtitles, color grading, and royalty-free audio",
    targetBuyer: "Content creators, YouTubers, TikTok/Reels brands, and podcasters",
    buyerProblem: "Raw footage that is unengaging, poorly paced, or lacks eye-catching captions",
    keywords: ["video editing", "youtube video", "reels", "tiktok", "shorts", "premiere pro", "davinci", "motion graphics", "captions"],
  },
  {
    category: "AI Services",
    niche: "AI Development & Automation",
    subNiche: "AI Chatbots & Workflow Automation",
    coreService: "Custom AI Assistant & Automated Workflow Integration",
    primaryDeliverable: "Configured AI chatbot or automation pipeline connected to business tools",
    targetBuyer: "Businesses aiming to automate support, lead generation, or internal workflows",
    buyerProblem: "Manual repetitive tasks and delayed customer response times",
    keywords: ["ai", "chatbot", "chatgpt", "automation", "langchain", "n8n", "make.com", "zapier", "agent", "llm"],
  },
];

export function classifyDraftHeuristically(
  draft: string,
  contentType: ContentType,
  optionalContext?: string
): ServiceClassification {
  const combinedText = `${draft} ${optionalContext || ""}`.toLowerCase();
  const words = combinedText.split(/\s+/).filter(Boolean);

  let bestMatch: NicheRule | null = null;
  let maxScore = 0;

  for (const rule of KNOWN_NICHES) {
    let score = 0;
    for (const kw of rule.keywords) {
      if (combinedText.includes(kw)) {
        score += 2;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = rule;
    }
  }

  // Check if draft is too ambiguous / short
  const isAmbiguous = words.length < 8 && maxScore < 2;

  if (bestMatch && maxScore >= 2) {
    return {
      category: bestMatch.category,
      niche: bestMatch.niche,
      subNiche: bestMatch.subNiche,
      coreService: bestMatch.coreService,
      primaryDeliverable: bestMatch.primaryDeliverable,
      targetBuyer: bestMatch.targetBuyer,
      buyerIntent: `Seeking a skilled specialist for ${bestMatch.coreService}`,
      buyerProblem: bestMatch.buyerProblem,
      confidence: maxScore >= 6 ? "high" : "medium",
      classificationNotes: `Identified service patterns matching ${bestMatch.niche} based on draft terminology.`,
      requiresClarification: false,
    };
  }

  // Generic fallback if not matched to preset rules
  const firstSentence = draft.trim().split(/[.!?\n]/)[0] || "Custom freelance service";
  const inferredService = firstSentence.replace(/^i will/i, "").trim().slice(0, 60);

  return {
    category: "Professional Freelance Services",
    niche: "Custom Service Offering",
    subNiche: inferredService || "Bespoke Freelance Deliverable",
    coreService: inferredService || "Specialized Professional Service",
    primaryDeliverable: "Standardized high-quality project deliverables according to buyer specifications",
    targetBuyer: "Clients and business owners seeking reliable freelance expertise",
    buyerIntent: "Finding an experienced professional who understands specific project goals",
    buyerProblem: "Need clear deliverables completed on schedule with consistent communication",
    confidence: isAmbiguous ? "low" : "medium",
    classificationNotes: isAmbiguous
      ? "Draft provides limited context; classification is inferred from initial phrases."
      : "Inferred service structure directly from draft wording.",
    requiresClarification: isAmbiguous,
    clarificationQuestion: isAmbiguous
      ? "What specific software, deliverables, or target platform does your service focus on?"
      : undefined,
  };
}
