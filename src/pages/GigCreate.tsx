import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";

const GigCreate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    serviceName: "",
    marketplace: "fiverr",
    targetAudience: "",
    tone: "professional",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.serviceName) {
      toast({
        title: "Service name required",
        description: "Please enter a service name to continue",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      // Call edge function to generate gig
      const { data, error } = await supabase.functions.invoke("generate-gig", {
        body: formData,
      });

      if (error) throw error;

      // Save to database
      const { data: gigData, error: saveError } = await supabase
        .from("gig_drafts")
        .insert({
          user_id: user.id,
          service_name: formData.serviceName,
          marketplace: formData.marketplace,
          target_audience: formData.targetAudience,
          tone: formData.tone,
          title: data.title,
          tags: data.tags,
          description: data.description,
          short_description: data.shortDescription,
          pricing_basic: data.pricing.basic,
          pricing_standard: data.pricing.standard,
          pricing_premium: data.pricing.premium,
          faqs: data.faqs,
          requirements: data.requirements,
        })
        .select()
        .single();

      if (saveError) throw saveError;

      toast({
        title: "Gig generated!",
        description: "Your AI-powered gig has been created successfully",
      });

      navigate(`/gigs/${gigData.id}`);
    } catch (error: any) {
      console.error("Error generating gig:", error);
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate gig. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-2 text-xl font-bold">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              GigAlly
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <h1 className="mb-2 text-4xl font-bold">Create Your Gig</h1>
            <p className="text-lg text-muted-foreground">
              Tell us about your service and we'll generate an optimized gig with AI
            </p>
          </div>

          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Service Name */}
              <div>
                <Label htmlFor="serviceName">
                  Service Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="serviceName"
                  placeholder="e.g., Email marketing automation for SaaS"
                  value={formData.serviceName}
                  onChange={(e) =>
                    setFormData({ ...formData, serviceName: e.target.value })
                  }
                  className="mt-2"
                  required
                />
              </div>

              {/* Marketplace */}
              <div>
                <Label htmlFor="marketplace">Target Marketplace</Label>
                <Select
                  value={formData.marketplace}
                  onValueChange={(value) =>
                    setFormData({ ...formData, marketplace: value })
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fiverr">Fiverr</SelectItem>
                    <SelectItem value="upwork">Upwork</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Target Audience */}
              <div>
                <Label htmlFor="targetAudience">
                  Target Audience (Optional)
                </Label>
                <Input
                  id="targetAudience"
                  placeholder="e.g., SaaS startups, small businesses"
                  value={formData.targetAudience}
                  onChange={(e) =>
                    setFormData({ ...formData, targetAudience: e.target.value })
                  }
                  className="mt-2"
                />
              </div>

              {/* Tone */}
              <div>
                <Label htmlFor="tone">Writing Tone</Label>
                <Select
                  value={formData.tone}
                  onValueChange={(value) =>
                    setFormData({ ...formData, tone: value })
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                    <SelectItem value="expert">Expert/Technical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-secondary text-lg"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate Gig with AI
                  </>
                )}
              </Button>
            </form>
          </Card>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Generation typically takes 30-60 seconds
          </p>
        </div>
      </main>
    </div>
  );
};

export default GigCreate;