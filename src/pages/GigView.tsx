import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Copy, Download, Sparkles, Loader2, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const GigView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [gig, setGig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [imagePrompt, setImagePrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  useEffect(() => {
    loadGig();
  }, [id]);

  const loadGig = async () => {
    if (!id) return;

    const { data, error } = await supabase
      .from("gig_drafts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error loading gig:", error);
      toast({
        title: "Error loading gig",
        description: "Could not find this gig",
        variant: "destructive",
      });
      navigate("/dashboard");
    } else {
      setGig(data);
    }
    setLoading(false);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const generateGigImage = async () => {
    if (!imagePrompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt for the image",
        variant: "destructive",
      });
      return;
    }

    setGeneratingImage(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-gig-image", {
        body: { prompt: imagePrompt, gigTitle: gig.title },
      });

      if (error) throw error;

      setGeneratedImage(data.image);
      toast({
        title: "Success!",
        description: "Gig image generated successfully",
      });
    } catch (error: any) {
      console.error("Error generating image:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate image",
        variant: "destructive",
      });
    } finally {
      setGeneratingImage(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!gig) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <div className="mb-4 flex items-center gap-3">
              <Badge className="bg-gradient-to-r from-primary to-secondary text-white">
                {gig.marketplace}
              </Badge>
              <Badge variant="outline">{gig.status}</Badge>
            </div>
            <h1 className="mb-2 text-4xl font-bold">{gig.title}</h1>
            <p className="text-muted-foreground">
              Created {new Date(gig.created_at).toLocaleDateString()}
            </p>
          </div>

          {/* Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="faqs">FAQs</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
              <TabsTrigger value="image">Gig Image</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">Title</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(gig.title, "Title")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-lg">{gig.title}</p>
              </Card>

              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">Short Description</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(gig.short_description, "Short description")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-muted-foreground">{gig.short_description}</p>
              </Card>

              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">Full Description</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(gig.description, "Description")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="prose max-w-none whitespace-pre-wrap">
                  {gig.description}
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="mb-4 text-2xl font-semibold">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {gig.tags?.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Pricing Tab */}
            <TabsContent value="pricing" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <PricingCard tier="Basic" data={gig.pricing_basic} />
                <PricingCard tier="Standard" data={gig.pricing_standard} />
                <PricingCard tier="Premium" data={gig.pricing_premium} />
              </div>
            </TabsContent>

            {/* FAQs Tab */}
            <TabsContent value="faqs" className="space-y-4">
              {gig.faqs?.map((faq: any, index: number) => (
                <Card key={index} className="p-6">
                  <h3 className="mb-2 text-lg font-semibold">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </Card>
              ))}
            </TabsContent>

            {/* Requirements Tab */}
            <TabsContent value="requirements">
              <Card className="p-6">
                <h2 className="mb-4 text-2xl font-semibold">Buyer Requirements</h2>
                <ul className="space-y-2">
                  {gig.requirements?.map((req: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </TabsContent>

            {/* Gig Image Designer Tab */}
            <TabsContent value="image" className="space-y-6">
              <Card className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <ImageIcon className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold">Gig Image Designer</h2>
                </div>
                <p className="mb-6 text-muted-foreground">
                  Generate a professional gig image using AI. Describe what you want to see in your image.
                </p>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="imagePrompt">Image Prompt</Label>
                    <Input
                      id="imagePrompt"
                      placeholder={`e.g., "Professional ${gig.service_name} service banner with blue and orange gradient, modern design"`}
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <Button
                    onClick={generateGigImage}
                    disabled={generatingImage}
                    className="w-full"
                  >
                    {generatingImage ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Image...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Gig Image
                      </>
                    )}
                  </Button>

                  {generatedImage && (
                    <div className="mt-6 space-y-4">
                      <h3 className="text-lg font-semibold">Generated Image</h3>
                      <div className="overflow-hidden rounded-lg border">
                        <img
                          src={generatedImage}
                          alt="Generated gig image"
                          className="h-auto w-full"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            const link = document.createElement("a");
                            link.href = generatedImage;
                            link.download = `${gig.title.replace(/\s+/g, "-")}-gig-image.png`;
                            link.click();
                          }}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download Image
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

const PricingCard = ({ tier, data }: { tier: string; data: any }) => (
  <Card className="p-6">
    <h3 className="mb-4 text-xl font-semibold">{tier}</h3>
    <div className="mb-4 text-3xl font-bold text-primary">
      ${data?.price || "TBD"}
    </div>
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Delivery:</span>
        <span className="font-medium">{data?.delivery || "TBD"} days</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Revisions:</span>
        <span className="font-medium">{data?.revisions || "TBD"}</span>
      </div>
    </div>
    {data?.features && (
      <ul className="mt-4 space-y-2 text-sm">
        {data.features.map((feature: string, index: number) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    )}
  </Card>
);

export default GigView;