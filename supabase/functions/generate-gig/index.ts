import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { serviceName, marketplace, targetAudience, tone } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    console.log("Generating gig for:", serviceName, marketplace);

    // Build marketplace-specific guidance
    const marketplaceGuidance = marketplace.toLowerCase() === "fiverr" 
      ? `FIVERR-SPECIFIC OPTIMIZATION:
- Title MUST start with "I will" (Fiverr requirement)
- Use power words: professional, expert, custom, unlimited, fast, quality
- Include 3-5 high-volume keywords naturally in description
- Tags should include both broad and niche-specific terms
- Pricing: Basic ($5-25), Standard ($25-75), Premium ($75-200+)
- Add urgency and social proof language`
      : `UPWORK PROJECT CATALOG OPTIMIZATION:
- Title should be benefit-focused, NOT "I will" format
- Focus on deliverables and outcomes
- Use industry-specific terminology
- Tags should match Upwork's job posting keywords
- Pricing: Basic ($50-150), Standard ($150-400), Premium ($400-1000+)
- Emphasize expertise and portfolio-quality work`;

    // Build the prompt with advanced SEO strategies
    const prompt = `You are a TOP-RATED freelance marketplace expert who has generated 500+ gigs that rank on page 1. Create a HIGHLY OPTIMIZED gig for ${marketplace.toUpperCase()}.

SERVICE: ${serviceName}
TARGET AUDIENCE: ${targetAudience || "Small businesses and entrepreneurs"}
TONE: ${tone}

${marketplaceGuidance}

CRITICAL SEO REQUIREMENTS:
1. Research and use the TOP 5 most-searched keywords for "${serviceName}" naturally throughout
2. Front-load the main keyword in title (first 3-4 words)
3. Include LSI (Latent Semantic Indexing) keywords in description
4. Use buyer-intent phrases: "get", "need", "looking for", "hire"
5. Include quantifiable results: numbers, percentages, timeframes
6. Integrate TRENDING keywords in the niche

KEYWORD TREND ANALYSIS:
- Research current trending keywords for "${serviceName}"
- Include emerging industry buzzwords
- Use seasonal/timely terms if applicable
- Add technology-specific keywords (tools, platforms, methods)

GENERATE:
1. TITLE: Max 80 chars, keyword-rich, compelling (${marketplace === "fiverr" ? 'MUST start with "I will"' : 'benefit-focused headline'})
2. SHORT DESCRIPTION: Exactly 150-160 chars, includes main keyword, creates urgency
3. FULL DESCRIPTION: 1000-1200 characters with:
   - Hook (first 2 lines grab attention with pain point or benefit)
   - 3 clear sections with headers using markdown
   - Bullet points for features/benefits
   - Keywords naturally woven in (5+ occurrences)
   - Strong CTA at the end
4. TAGS: Exactly 14 tags - mix of:
   - 5 high-volume keywords
   - 5 medium-competition keywords  
   - 4 niche-specific long-tail keywords
5. PRICING: Realistic tiers based on market research
6. FAQs: EXACTLY 10 keyword-rich FAQs covering:
   - Turnaround time
   - Revisions policy
   - What's included/excluded
   - Deliverable formats
   - Communication
   - Experience/qualifications
   - Rush orders
   - Bulk discounts
   - Guarantees
   - Technical requirements
   Each answer must naturally include 1-2 relevant keywords.
7. REQUIREMENTS: 6 clear, specific buyer requirements

Make it IRRESISTIBLE to click and BUY.`;

    // Call Lovable AI
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a MASTER freelance marketplace consultant who has helped 1000+ sellers reach Top Rated status. You deeply understand:
- Fiverr & Upwork search algorithms and ranking factors
- Buyer psychology and conversion optimization  
- SEO keyword research and strategic placement
- Competitive pricing strategies
- What makes buyers click "Order Now" vs scroll past

Your gigs consistently outrank competitors because you:
1. Research actual high-volume keywords buyers search for
2. Write descriptions that solve problems, not just list features
3. Price competitively based on market analysis
4. Create urgency without being pushy
5. Include social proof and credibility markers`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "create_gig",
              description: "Create a complete gig with all necessary fields",
              parameters: {
                type: "object",
                properties: {
                  title: {
                    type: "string",
                    description: "Compelling, SEO-optimized title (max 80 chars)",
                  },
                  shortDescription: {
                    type: "string",
                    description: "Brief description for preview (max 160 chars)",
                  },
                  description: {
                    type: "string",
                    description: "Full gig description (1000-1200 characters, well-structured with proper spacing)",
                  },
                  tags: {
                    type: "array",
                    items: { type: "string" },
                    description: "Exactly 14 relevant tags",
                    minItems: 14,
                    maxItems: 14,
                  },
                  pricing: {
                    type: "object",
                    properties: {
                      basic: {
                        type: "object",
                        properties: {
                          price: { type: "number" },
                          delivery: { type: "number", description: "Days" },
                          revisions: { type: "number" },
                          features: { type: "array", items: { type: "string" } },
                        },
                      },
                      standard: {
                        type: "object",
                        properties: {
                          price: { type: "number" },
                          delivery: { type: "number" },
                          revisions: { type: "number" },
                          features: { type: "array", items: { type: "string" } },
                        },
                      },
                      premium: {
                        type: "object",
                        properties: {
                          price: { type: "number" },
                          delivery: { type: "number" },
                          revisions: { type: "number" },
                          features: { type: "array", items: { type: "string" } },
                        },
                      },
                    },
                  },
                  faqs: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        question: { type: "string" },
                        answer: { type: "string" },
                      },
                    },
                    description: "Exactly 10 keyword-rich FAQs",
                    minItems: 10,
                    maxItems: 10,
                  },
                  requirements: {
                    type: "array",
                    items: { type: "string" },
                    description: "What you need from the buyer",
                    minItems: 5,
                    maxItems: 7,
                  },
                },
                required: [
                  "title",
                  "shortDescription",
                  "description",
                  "tags",
                  "pricing",
                  "faqs",
                  "requirements",
                ],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "create_gig" } },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response received");

    // Extract the tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error("No tool call in AI response");
    }

    const gigData = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(gigData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in generate-gig:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});