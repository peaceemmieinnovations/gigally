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
    const { section, currentValue, serviceName, marketplace, keywords, tone } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    console.log("Regenerating section:", section, "for service:", serviceName);

    const keywordList = keywords?.join(", ") || "";
    
    const sectionPrompts: Record<string, { prompt: string; schema: any }> = {
      title: {
        prompt: `Create a NEW, DIFFERENT ${marketplace} gig title for "${serviceName}".
Current title: "${currentValue}"
Keywords to include: ${keywordList}
Tone: ${tone}

${marketplace === "fiverr" ? 'MUST start with "I will"' : "Use benefit-focused headline"}
Max 80 characters. Make it compelling and keyword-rich. DIFFERENT from the current one.`,
        schema: {
          type: "object",
          properties: { title: { type: "string" } },
          required: ["title"],
        },
      },
      shortDescription: {
        prompt: `Create a NEW short description for "${serviceName}".
Current: "${currentValue}"
Keywords: ${keywordList}
Tone: ${tone}

Exactly 150-160 characters. Include main keyword. Create urgency. DIFFERENT from current.`,
        schema: {
          type: "object",
          properties: { shortDescription: { type: "string" } },
          required: ["shortDescription"],
        },
      },
      description: {
        prompt: `Create a NEW, DIFFERENT full gig description for "${serviceName}" on ${marketplace}.
Current description: "${currentValue}"
Keywords to weave in: ${keywordList}
Tone: ${tone}

REQUIREMENTS:
- 1000-1200 characters (including spaces)
- Hook in first 2 lines (pain point or benefit)
- 3 clear sections with headers using markdown
- Bullet points for features/benefits
- Keywords naturally woven in (5+ occurrences)
- Strong CTA at the end
- COMPLETELY DIFFERENT approach from current description`,
        schema: {
          type: "object",
          properties: { description: { type: "string" } },
          required: ["description"],
        },
      },
      tags: {
        prompt: `Generate 14 NEW, DIFFERENT tags for "${serviceName}" on ${marketplace}.
Current tags: ${currentValue}
Keywords to include: ${keywordList}

Mix of:
- 5 high-volume keywords
- 5 medium-competition keywords
- 4 niche-specific long-tail keywords

Make them DIFFERENT from current tags while maintaining relevance.`,
        schema: {
          type: "object",
          properties: { tags: { type: "array", items: { type: "string" }, minItems: 14, maxItems: 14 } },
          required: ["tags"],
        },
      },
      faqs: {
        prompt: `Generate 10 NEW, DIFFERENT FAQs for "${serviceName}" on ${marketplace}.
Keywords to include in answers: ${keywordList}
Tone: ${tone}

Each FAQ should:
- Address real buyer concerns
- Include 1-2 keywords naturally in the answer
- Be helpful and conversion-focused
- Build trust and credibility

Topics to cover:
1. Turnaround time / delivery
2. Revisions policy
3. What's included / not included
4. File formats / deliverables
5. Communication during project
6. Experience / qualifications
7. Rush orders / urgent delivery
8. Bulk orders / discounts
9. Guarantees / satisfaction
10. Technical requirements / setup`,
        schema: {
          type: "object",
          properties: {
            faqs: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  question: { type: "string" },
                  answer: { type: "string" },
                },
              },
              minItems: 10,
              maxItems: 10,
            },
          },
          required: ["faqs"],
        },
      },
    };

    const sectionConfig = sectionPrompts[section];
    if (!sectionConfig) {
      throw new Error(`Unknown section: ${section}`);
    }

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
            content: `You are a TOP-RATED ${marketplace} gig optimization expert. You specialize in creating compelling, SEO-optimized content that converts.`,
          },
          { role: "user", content: sectionConfig.prompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "regenerate_section",
              description: `Regenerate the ${section} section`,
              parameters: sectionConfig.schema,
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "regenerate_section" } },
      }),
    });

    if (response.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limited. Please wait and try again." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (response.status === 402) {
      return new Response(JSON.stringify({ error: "AI credits exhausted. Add funds in workspace settings." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error("No tool call in AI response");
    }

    const result = JSON.parse(toolCall.function.arguments);
    console.log("Section regenerated successfully");

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in regenerate-section:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
