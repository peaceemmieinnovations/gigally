import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Copy, Download, Sparkles, Loader2, Image as ImageIcon, Upload, X, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Image dimension presets for Fiverr and Upwork
const IMAGE_DIMENSIONS = {
  fiverr_main: { width: 1280, height: 769, label: "Fiverr Main (1280×769)" },
  fiverr_square: { width: 550, height: 370, label: "Fiverr Thumbnail (550×370)" },
  upwork_catalog: { width: 1200, height: 630, label: "Upwork Catalog (1200×630)" },
  upwork_square: { width: 800, height: 800, label: "Upwork Square (800×800)" },
  social_og: { width: 1200, height: 630, label: "Social OG Image (1200×630)" },
  custom: { width: 1280, height: 720, label: "Custom Size" },
};

const GigView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [gig, setGig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [imagePrompt, setImagePrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedDimension, setSelectedDimension] = useState<keyof typeof IMAGE_DIMENSIONS>("fiverr_main");
  const [customWidth, setCustomWidth] = useState(1280);
  const [customHeight, setCustomHeight] = useState(720);
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [designNotes, setDesignNotes] = useState("");

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

  const handleReferenceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Reference images must be under 5MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeReference = (index: number) => {
    setReferenceImages((prev) => prev.filter((_, i) => i !== index));
  };

  const getDimensions = () => {
    if (selectedDimension === "custom") {
      return { width: customWidth, height: customHeight };
    }
    return IMAGE_DIMENSIONS[selectedDimension];
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
      const dimensions = getDimensions();
      
      // Build enhanced prompt with references context
      let enhancedPrompt = imagePrompt;
      if (designNotes) {
        enhancedPrompt += `\n\nDesign notes: ${designNotes}`;
      }
      if (referenceImages.length > 0) {
        enhancedPrompt += `\n\nIMPORTANT: Create an ORIGINAL design that is INSPIRED BY but DOES NOT COPY the reference images. Take the best elements (color schemes, layouts, typography styles) and create something UNIQUE and BETTER. Do not replicate the references directly.`;
      }

      const { data, error } = await supabase.functions.invoke("generate-gig-image", {
        body: { 
          prompt: enhancedPrompt, 
          gigTitle: gig.title,
          width: dimensions.width,
          height: dimensions.height,
          referenceImages: referenceImages.length > 0 ? referenceImages : undefined,
        },
      });

      if (error) throw error;

      setGeneratedImage(data.image);
      toast({
        title: "Success!",
        description: `Gig image generated (${dimensions.width}×${dimensions.height})`,
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
                  Generate a professional gig image using AI. Upload references for inspiration (we'll create something original and better).
                </p>

                <div className="space-y-6">
                  {/* Dimension Selector */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>Image Dimensions</Label>
                      <Select value={selectedDimension} onValueChange={(v) => setSelectedDimension(v as keyof typeof IMAGE_DIMENSIONS)}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(IMAGE_DIMENSIONS).map(([key, dim]) => (
                            <SelectItem key={key} value={key}>
                              {dim.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {selectedDimension === "custom" && (
                      <div className="flex gap-2 items-end">
                        <div className="flex-1">
                          <Label>Width (px)</Label>
                          <Input
                            type="number"
                            min={512}
                            max={1920}
                            value={customWidth}
                            onChange={(e) => setCustomWidth(Math.min(1920, Math.max(512, parseInt(e.target.value) || 512)))}
                            className="mt-2"
                          />
                        </div>
                        <span className="pb-2 text-muted-foreground">×</span>
                        <div className="flex-1">
                          <Label>Height (px)</Label>
                          <Input
                            type="number"
                            min={512}
                            max={1920}
                            value={customHeight}
                            onChange={(e) => setCustomHeight(Math.min(1920, Math.max(512, parseInt(e.target.value) || 512)))}
                            className="mt-2"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Current Dimension Preview */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Info className="h-4 w-4" />
                    <span>
                      Output size: {getDimensions().width} × {getDimensions().height} pixels
                    </span>
                  </div>

                  {/* Reference Images Upload */}
                  <div>
                    <Label>Reference Images (Optional)</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload samples for inspiration. AI will create an ORIGINAL design inspired by these, not a copy.
                    </p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      multiple
                      onChange={handleReferenceUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-dashed"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Reference Images
                    </Button>

                    {referenceImages.length > 0 && (
                      <div className="mt-4 grid grid-cols-3 gap-3">
                        {referenceImages.map((img, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={img}
                              alt={`Reference ${index + 1}`}
                              className="h-24 w-full rounded-lg object-cover border"
                            />
                            <button
                              onClick={() => removeReference(index)}
                              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Image Prompt */}
                  <div>
                    <Label htmlFor="imagePrompt">Image Description</Label>
                    <Textarea
                      id="imagePrompt"
                      placeholder={`e.g., "Professional ${gig.service_name} service banner with modern typography, showing laptop with code, blue and orange gradient background, clean minimal design"`}
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      className="mt-2 min-h-[100px]"
                    />
                  </div>

                  {/* Design Notes */}
                  <div>
                    <Label htmlFor="designNotes">Additional Design Notes (Optional)</Label>
                    <Textarea
                      id="designNotes"
                      placeholder="e.g., Include my service name prominently, add a badge showing '100% Satisfaction', use dark theme..."
                      value={designNotes}
                      onChange={(e) => setDesignNotes(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <Button
                    onClick={generateGigImage}
                    disabled={generatingImage}
                    className="w-full"
                    size="lg"
                  >
                    {generatingImage ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Image...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Gig Image ({getDimensions().width}×{getDimensions().height})
                      </>
                    )}
                  </Button>

                  {generatedImage && (
                    <div className="mt-6 space-y-4">
                      <h3 className="text-lg font-semibold">Generated Image</h3>
                      <div className="overflow-hidden rounded-lg border bg-muted/20">
                        <img
                          src={generatedImage}
                          alt="Generated gig image"
                          className="h-auto w-full"
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
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
                          Download PNG
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setGeneratedImage(null);
                          }}
                        >
                          Generate New
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