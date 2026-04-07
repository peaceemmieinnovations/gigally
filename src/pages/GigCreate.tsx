import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";

const GigCreate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ serviceName: "", marketplace: "fiverr", targetAudience: "", tone: "professional" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.serviceName) { toast({ title: "Service name required", variant: "destructive" }); return; }
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }
      const { data, error } = await supabase.functions.invoke("generate-gig", { body: formData });
      if (error) throw error;
      const { data: gigData, error: saveError } = await supabase.from("gig_drafts").insert({
        user_id: user.id, service_name: formData.serviceName, marketplace: formData.marketplace,
        target_audience: formData.targetAudience, tone: formData.tone, title: data.title, tags: data.tags,
        description: data.description, short_description: data.shortDescription,
        pricing_basic: data.pricing.basic, pricing_standard: data.pricing.standard, pricing_premium: data.pricing.premium,
        faqs: data.faqs, requirements: data.requirements,
      }).select().single();
      if (saveError) throw saveError;
      toast({ title: "Gig generated!" });
      navigate(`/gigs/${gigData.id}`);
    } catch (error: any) {
      toast({ title: "Generation failed", description: error.message || "Please try again.", variant: "destructive" });
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b glass">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
          </Button>
          <div className="flex items-center gap-1.5">
            <div className="rounded-lg bg-gradient-to-r from-primary to-secondary p-1.5">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold gradient-text">GigAlly</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-10">
        <div className="mx-auto max-w-xl">
          <div className="mb-6">
            <h1 className="mb-1 text-2xl md:text-3xl font-bold">Create Your Gig</h1>
            <p className="text-sm text-muted-foreground">Describe your service — AI handles the rest</p>
          </div>

          <Card className="p-5 md:p-8 shadow-card">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="serviceName" className="text-sm">Service Name <span className="text-destructive">*</span></Label>
                <Input id="serviceName" placeholder="e.g., Email marketing automation for SaaS" value={formData.serviceName} onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })} className="mt-1.5" required />
              </div>

              <div>
                <Label className="text-sm">Target Marketplace</Label>
                <Select value={formData.marketplace} onValueChange={(v) => setFormData({ ...formData, marketplace: v })}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fiverr">Fiverr</SelectItem>
                    <SelectItem value="upwork">Upwork</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="targetAudience" className="text-sm">Target Audience (Optional)</Label>
                <Input id="targetAudience" placeholder="e.g., SaaS startups, small businesses" value={formData.targetAudience} onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })} className="mt-1.5" />
              </div>

              <div>
                <Label className="text-sm">Writing Tone</Label>
                <Select value={formData.tone} onValueChange={(v) => setFormData({ ...formData, tone: v })}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                    <SelectItem value="expert">Expert / Technical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full gradient-btn text-primary-foreground text-base" size="lg" disabled={loading}>
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : <><Sparkles className="mr-2 h-4 w-4" /> Generate Gig with AI</>}
              </Button>
            </form>
          </Card>
          <p className="mt-4 text-center text-xs text-muted-foreground">Generation takes 30–60 seconds</p>
        </div>
      </main>
    </div>
  );
};

export default GigCreate;
