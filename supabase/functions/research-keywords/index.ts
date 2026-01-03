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
    const { serviceName, marketplace } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    console.log("Researching keywords for:", serviceName, marketplace);

    const prompt = `You are a TOP keyword research expert specializing in ${marketplace} marketplace optimization.

ANALYZE keyword opportunities for: "${serviceName}"

Provide a comprehensive keyword research analysis:

1. **PRIMARY KEYWORDS** (5 highest-volume search terms buyers use)
   - Exact match terms buyers type into search
   - Include search volume estimate (High/Medium/Low)
   - Competition level

2. **LONG-TAIL KEYWORDS** (8 specific, lower-competition phrases)
   - 3-5 word phrases
   - Buyer-intent focused
   - Easier to rank for

3. **TRENDING KEYWORDS** (5 emerging/rising keywords in this niche)
   - New terms gaining popularity
   - Seasonal trends
   - Industry-specific buzzwords

4. **LSI KEYWORDS** (10 semantically related terms)
   - Variations and synonyms
   - Related services
   - Industry terminology

5. **BUYER-INTENT PHRASES** (5 phrases showing purchase readiness)
   - "Need", "looking for", "hire", "urgent" phrases
   - Problem-solution keywords

6. **COMPETITOR ANALYSIS**
   - Top 3 keywords competitors rank for
   - Gaps/opportunities they're missing
   - Suggested differentiation angles

7. **KEYWORD TIPS**
   - Best placement strategies for ${marketplace}
   - Which keywords to put in title vs description
   - Tag optimization advice`;

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
            content: `You are a freelance marketplace SEO expert who has helped 1000+ sellers rank on page 1. You understand:
- How ${marketplace} search algorithm works
- What buyers actually search for
- Keyword density and placement best practices
- Competition analysis techniques
- Trending terms in freelance services`,
          },
          { role: "user", content: prompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "keyword_research_results",
              description: "Return comprehensive keyword research data",
              parameters: {
                type: "object",
                properties: {
                  primaryKeywords: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        keyword: { type: "string" },
                        volume: { type: "string", enum: ["High", "Medium", "Low"] },
                        competition: { type: "string", enum: ["High", "Medium", "Low"] },
                        difficulty: { type: "string", enum: ["Easy", "Medium", "Hard"] },
                      },
                    },
                  },
                  longTailKeywords: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        keyword: { type: "string" },
                        volume: { type: "string" },
                        opportunity: { type: "string" },
                      },
                    },
                  },
                  trendingKeywords: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        keyword: { type: "string" },
                        trend: { type: "string", enum: ["Rising", "Hot", "Emerging"] },
                        reason: { type: "string" },
                      },
                    },
                  },
                  lsiKeywords: {
                    type: "array",
                    items: { type: "string" },
                  },
                  buyerIntentPhrases: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        phrase: { type: "string" },
                        intent: { type: "string" },
                      },
                    },
                  },
                  competitorInsights: {
                    type: "object",
                    properties: {
                      topCompetitorKeywords: { type: "array", items: { type: "string" } },
                      gaps: { type: "array", items: { type: "string" } },
                      differentiationAngles: { type: "array", items: { type: "string" } },
                    },
                  },
                  tips: {
                    type: "object",
                    properties: {
                      titleKeywords: { type: "array", items: { type: "string" } },
                      descriptionKeywords: { type: "array", items: { type: "string" } },
                      tagSuggestions: { type: "array", items: { type: "string" } },
                      placementAdvice: { type: "string" },
                    },
                  },
                },
                required: ["primaryKeywords", "longTailKeywords", "trendingKeywords", "lsiKeywords", "buyerIntentPhrases", "tips"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "keyword_research_results" } },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Keyword research completed");

    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error("No tool call in AI response");
    }

    const keywordData = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(keywordData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in research-keywords:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
