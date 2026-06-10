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
    const { prompt, gigTitle, width = 1280, height = 769, referenceImages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    console.log("Generating gig image for:", gigTitle, "Dimensions:", width, "x", height);

    // Enhanced prompt for gig images
    let enhancedPrompt = `Design a STUNNING, PHOTOREALISTIC, professional gig thumbnail for a freelance marketplace (Fiverr / Upwork style) that would stop a buyer from scrolling.

SUBJECT / SERVICE: ${prompt}

ART DIRECTION (follow strictly):
- Crisp, modern, premium look — like a top-rated seller's hero image.
- Strong focal point with clear visual hierarchy and balanced composition (rule of thirds).
- Tasteful blue-to-orange accent palette (#0B7DF2 → #FF7A00) used as accents, NOT a flat gradient wash.
- Realistic lighting, soft shadows, depth and texture — avoid flat clipart or generic stock vibes.
- If you include any text, keep it SHORT (max 3-4 words), perfectly spelled, large and legible with high contrast.
- Clean negative space, no clutter, no watermarks, no logos, no lorem-ipsum gibberish.
- Aspect ratio target ${width}x${height}px, sharp and high resolution.
- Marketplace-ready, trustworthy and conversion-focused.`;

    // If reference images provided, add instruction to be inspired but not copy
    if (referenceImages && referenceImages.length > 0) {
      enhancedPrompt += `

INSPIRATION NOTES:
Reference images have been provided for style inspiration. Create an ORIGINAL design that:
- Takes the BEST elements from the references (color schemes, layouts, typography styles)
- Does NOT directly copy any reference
- Creates something UNIQUE and BETTER than the references
- Maintains the professional marketplace aesthetic`;
    }

    // Build message content
    const messageContent: any[] = [{ type: "text", text: enhancedPrompt }];
    
    // Add reference images if provided (for edit/inspiration mode)
    if (referenceImages && referenceImages.length > 0) {
      referenceImages.slice(0, 2).forEach((img: string) => {
        messageContent.push({
          type: "image_url",
          image_url: { url: img }
        });
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-pro-image-preview",
        messages: [
          {
            role: "user",
            content: messageContent,
          },
        ],
        modalities: ["image", "text"],
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
    console.log("Image generated successfully");

    // Extract the base64 image from the response
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!imageUrl) {
      throw new Error("No image in AI response");
    }

    return new Response(JSON.stringify({ image: imageUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in generate-gig-image:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
