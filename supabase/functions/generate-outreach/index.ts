import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { baseMessage, recipients, niche, platform, tone } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");
    if (!Array.isArray(recipients) || recipients.length === 0) throw new Error("No recipients provided");

    const prompt = `You write personalized, authentic, NON-spammy outreach DMs for freelancers.

NICHE: ${niche || "general freelance services"}
PLATFORM: ${platform || "fiverr"}
TONE: ${tone || "friendly professional"}

BASE MESSAGE (the core value-pitch to keep consistent across all recipients):
"""
${baseMessage}
"""

RECIPIENTS (each has name + optional context like business, niche, pain-point, source):
${JSON.stringify(recipients, null, 2)}

For EACH recipient generate a UNIQUE personalized message that:
- Opens with a SPECIFIC personalized hook tied to their name/business/context (not generic "Hi there")
- Naturally weaves the base pitch — same core offer, different wording per recipient
- Sounds human, conversational, 80-140 words
- Ends with a soft CTA (question or low-friction next step)
- NO emojis spam, NO "I hope this finds you well", NO copy-paste vibes
- Each message MUST be meaningfully different in wording, structure, and hook`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You craft personalized cold outreach for freelancers. Every message must feel hand-written." },
          { role: "user", content: prompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "generate_messages",
            description: "Return a personalized message per recipient",
            parameters: {
              type: "object",
              properties: {
                messages: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      recipientName: { type: "string" },
                      recipientEmail: { type: "string" },
                      message: { type: "string" },
                      subjectLine: { type: "string" },
                    },
                    required: ["recipientName", "message"],
                  },
                },
              },
              required: ["messages"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "generate_messages" } },
      }),
    });

    if (response.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limited. Please wait and try again." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (response.status === 402) {
      return new Response(JSON.stringify({ error: "AI credits exhausted. Add funds in workspace settings." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (!response.ok) {
      const t = await response.text();
      console.error("AI gateway error", response.status, t);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in AI response");
    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error: any) {
    console.error("Error in generate-outreach:", error);
    return new Response(JSON.stringify({ error: error.message || "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});