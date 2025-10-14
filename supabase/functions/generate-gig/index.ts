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

    // Build the prompt
    const prompt = `You are an expert freelance marketplace gig creator. Create a complete, SEO-optimized gig for ${marketplace.toUpperCase()} with the following details:

Service: ${serviceName}
Target Audience: ${targetAudience || "General"}
Tone: ${tone}

Generate a complete gig package including:
1. A compelling title (max 80 characters, keyword-rich)
2. A short description (max 160 characters for SEO preview)
3. A full description (600-1200 words, SEO-optimized, with clear sections)
4. Exactly 14 ranking tags (single words or short phrases, highly relevant)
5. Three pricing tiers (Basic, Standard, Premium) with realistic prices and features
6. 3-5 FAQs with answers
7. 5-7 buyer requirements

Make it professional, conversion-focused, and optimized for marketplace search algorithms.`;

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
            content: "You are an expert at creating high-converting freelance marketplace gigs. You understand SEO, marketplace algorithms, and what buyers want to see.",
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
                    description: "Full gig description (600-1200 words, well-structured)",
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
                    minItems: 3,
                    maxItems: 5,
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