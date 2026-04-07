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
import { ArrowLeft, Copy, Download, Sparkles, Loader2, Image as ImageIcon, Upload, X, Info, Eye, Search, BarChart3, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FiverrPreview } from "@/components/gig/FiverrPreview";
import { UpworkPreview } from "@/components/gig/UpworkPreview";
import { KeywordResearch } from "@/components/gig/KeywordResearch";
import { RegenerateButton } from "@/components/gig/RegenerateButton";
import { GigScoring } from "@/components/gig/GigScoring";
import { GigExport } from "@/components/gig/GigExport";
import { cleanMarkdown } from "@/lib/format";

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
  const [previewMarketplace, setPreviewMarketplace] = useState<"fiverr" | "upwork">("fiverr");
  const [researchKeywords, setResearchKeywords] = useState<string[]>([]);

  useEffect(() => { loadGig(); }, [id]);

  const loadGig = async () => {
    if (!id) return;
    const { data, error } = await supabase.from("gig_drafts").select("*").eq("id", id).single();
    if (error) { toast({ title: "Error loading gig", variant: "destructive" }); navigate("/dashboard"); }
    else setGig(data);
    setLoading(false);
  };

  const updateGigField = async (field: string, value: any) => {
    if (!id) return;
    const { error } = await supabase.from("gig_drafts").update({ [field]: value }).eq("id", id);
    if (error) toast({ title: "Error", description: "Failed to save", variant: "destructive" });
    else { setGig((prev: any) => ({ ...prev, [field]: value })); toast({ title: "Saved!" }); }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(cleanMarkdown(text));
    toast({ title: "Copied!", description: `${label} copied` });
  };

  const handleReferenceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) { toast({ title: "File too large", variant: "destructive" }); return; }
      const reader = new FileReader();
      reader.onloadend = () => setReferenceImages((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removeReference = (index: number) => setReferenceImages((prev) => prev.filter((_, i) => i !== index));

  const getDimensions = () => selectedDimension === "custom" ? { width: customWidth, height: customHeight } : IMAGE_DIMENSIONS[selectedDimension];

  const generateGigImage = async () => {
    if (!imagePrompt.trim()) { toast({ title: "Enter a prompt", variant: "destructive" }); return; }
    setGeneratingImage(true);
    try {
      const dimensions = getDimensions();
      let enhancedPrompt = imagePrompt;
      if (designNotes) enhancedPrompt += `\n\nDesign notes: ${designNotes}`;
      if (referenceImages.length > 0) enhancedPrompt += `\n\nIMPORTANT: Create an ORIGINAL design INSPIRED BY but NOT copying the references.`;
      const { data, error } = await supabase.functions.invoke("generate-gig-image", {
        body: { prompt: enhancedPrompt, gigTitle: gig.title, width: dimensions.width, height: dimensions.height, referenceImages: referenceImages.length > 0 ? referenceImages : undefined },
      });
      if (error) throw error;
      setGeneratedImage(data.image);
      toast({ title: "Image generated!", description: `${dimensions.width}×${dimensions.height}` });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to generate image", variant: "destructive" });
    } finally { setGeneratingImage(false); }
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
  if (!gig) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b glass">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
          </Button>
          <Button variant="outline" size="sm" onClick={() => document.getElementById("export-tab")?.click()}>
            <Download className="mr-1.5 h-4 w-4" /> Export
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-10">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge className="gradient-btn text-primary-foreground text-xs">{gig.marketplace}</Badge>
              <Badge variant="outline" className="text-xs">{gig.status}</Badge>
              <span className="text-xs text-muted-foreground">{new Date(gig.created_at).toLocaleDateString()}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">{cleanMarkdown(gig.title)}</h1>
          </div>

          <Tabs defaultValue="overview" className="space-y-4 md:space-y-6">
            <TabsList className="w-full flex-wrap h-auto gap-1 p-1">
              <TabsTrigger value="overview" className="text-xs md:text-sm">Overview</TabsTrigger>
              <TabsTrigger value="pricing" className="text-xs md:text-sm">Pricing</TabsTrigger>
              <TabsTrigger value="faqs" className="text-xs md:text-sm">FAQs</TabsTrigger>
              <TabsTrigger value="requirements" className="text-xs md:text-sm">Requirements</TabsTrigger>
              <TabsTrigger value="keywords" className="text-xs md:text-sm">Keywords</TabsTrigger>
              <TabsTrigger value="preview" className="text-xs md:text-sm">Preview</TabsTrigger>
              <TabsTrigger value="image" className="text-xs md:text-sm">Image</TabsTrigger>
              <TabsTrigger value="score" className="text-xs md:text-sm">SEO Score</TabsTrigger>
              <TabsTrigger value="export" id="export-tab" className="text-xs md:text-sm">Export</TabsTrigger>
            </TabsList>

            {/* Overview */}
            <TabsContent value="overview" className="space-y-4">
              <SectionCard title="Title" onCopy={() => copyToClipboard(gig.title, "Title")}
                regenerate={<RegenerateButton section="title" currentValue={gig.title} serviceName={gig.service_name} marketplace={gig.marketplace} tone={gig.tone} keywords={researchKeywords} onRegenerated={(v) => updateGigField("title", v)} />}>
                <p className="text-base md:text-lg font-medium">{cleanMarkdown(gig.title)}</p>
              </SectionCard>

              <SectionCard title="Short Description" onCopy={() => copyToClipboard(gig.short_description, "Short description")}
                regenerate={<RegenerateButton section="shortDescription" currentValue={gig.short_description} serviceName={gig.service_name} marketplace={gig.marketplace} tone={gig.tone} keywords={researchKeywords} onRegenerated={(v) => updateGigField("short_description", v)} />}>
                <p className="text-sm text-muted-foreground">{cleanMarkdown(gig.short_description)}</p>
              </SectionCard>

              <SectionCard title="Full Description" onCopy={() => copyToClipboard(gig.description, "Description")}
                regenerate={<RegenerateButton section="description" currentValue={gig.description} serviceName={gig.service_name} marketplace={gig.marketplace} tone={gig.tone} keywords={researchKeywords} onRegenerated={(v) => updateGigField("description", v)} />}>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{cleanMarkdown(gig.description)}</p>
                <div className="mt-3 text-xs text-muted-foreground">
                  {gig.description?.length || 0} / 1200 characters
                </div>
              </SectionCard>

              <SectionCard title={`Tags (${gig.tags?.length || 0}/14)`}
                regenerate={<RegenerateButton section="tags" currentValue={gig.tags?.join(", ")} serviceName={gig.service_name} marketplace={gig.marketplace} tone={gig.tone} keywords={researchKeywords} onRegenerated={(v) => updateGigField("tags", v)} />}>
                <div className="flex flex-wrap gap-1.5">
                  {gig.tags?.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">{cleanMarkdown(tag)}</Badge>
                  ))}
                </div>
              </SectionCard>
            </TabsContent>

            {/* Pricing */}
            <TabsContent value="pricing">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                <PricingCard tier="Basic" data={gig.pricing_basic} />
                <PricingCard tier="Standard" data={gig.pricing_standard} />
                <PricingCard tier="Premium" data={gig.pricing_premium} />
              </div>
            </TabsContent>

            {/* FAQs */}
            <TabsContent value="faqs" className="space-y-3">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">FAQs ({gig.faqs?.length || 0}/10)</h2>
                <RegenerateButton section="faqs" currentValue={gig.faqs} serviceName={gig.service_name} marketplace={gig.marketplace} tone={gig.tone} keywords={researchKeywords} onRegenerated={(v) => updateGigField("faqs", v)} />
              </div>
              {gig.faqs?.map((faq: any, index: number) => (
                <Card key={index} className="p-4 shadow-card">
                  <h3 className="mb-1.5 text-sm font-semibold">{cleanMarkdown(faq.question)}</h3>
                  <p className="text-sm text-muted-foreground">{cleanMarkdown(faq.answer)}</p>
                </Card>
              ))}
            </TabsContent>

            {/* Requirements */}
            <TabsContent value="requirements">
              <Card className="p-4 md:p-6 shadow-card">
                <h2 className="mb-3 text-lg font-semibold">Buyer Requirements</h2>
                <ul className="space-y-2">
                  {gig.requirements?.map((req: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-0.5">•</span>
                      <span>{cleanMarkdown(req)}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </TabsContent>

            {/* Keywords */}
            <TabsContent value="keywords">
              <KeywordResearch serviceName={gig.service_name} marketplace={gig.marketplace}
                onApplyKeywords={(keywords) => { setResearchKeywords(keywords); toast({ title: "Keywords Applied!", description: `${keywords.length} keywords applied` }); }} />
            </TabsContent>

            {/* Preview */}
            <TabsContent value="preview" className="space-y-4">
              <Card className="p-4 md:p-6 shadow-card">
                <div className="mb-4 flex items-center gap-3">
                  <Eye className="h-5 w-5 text-primary" />
                  <div>
                    <h2 className="text-lg font-semibold">Marketplace Preview</h2>
                    <p className="text-xs text-muted-foreground">See how your gig appears on each platform</p>
                  </div>
                </div>
                <div className="mb-4 flex gap-2">
                  <Button size="sm" variant={previewMarketplace === "fiverr" ? "default" : "outline"} onClick={() => setPreviewMarketplace("fiverr")}>Fiverr</Button>
                  <Button size="sm" variant={previewMarketplace === "upwork" ? "default" : "outline"} onClick={() => setPreviewMarketplace("upwork")}>Upwork</Button>
                </div>
                {previewMarketplace === "fiverr" ? <FiverrPreview gig={gig} generatedImage={generatedImage} /> : <UpworkPreview gig={gig} generatedImage={generatedImage} />}
              </Card>
            </TabsContent>

            {/* Image */}
            <TabsContent value="image" className="space-y-4">
              <Card className="p-4 md:p-6 shadow-card">
                <div className="mb-4 flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Gig Image Designer</h2>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">Generate a professional gig image. Upload references for inspiration.</p>
                <div className="space-y-4">
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                    <div>
                      <Label className="text-xs">Image Dimensions</Label>
                      <Select value={selectedDimension} onValueChange={(v) => setSelectedDimension(v as keyof typeof IMAGE_DIMENSIONS)}>
                        <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {Object.entries(IMAGE_DIMENSIONS).map(([key, dim]) => (
                            <SelectItem key={key} value={key}>{dim.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {selectedDimension === "custom" && (
                      <div className="flex gap-2 items-end">
                        <div className="flex-1">
                          <Label className="text-xs">Width</Label>
                          <Input type="number" min={512} max={1920} value={customWidth} onChange={(e) => setCustomWidth(Math.min(1920, Math.max(512, parseInt(e.target.value) || 512)))} className="mt-1.5" />
                        </div>
                        <span className="pb-2 text-muted-foreground text-sm">×</span>
                        <div className="flex-1">
                          <Label className="text-xs">Height</Label>
                          <Input type="number" min={512} max={1920} value={customHeight} onChange={(e) => setCustomHeight(Math.min(1920, Math.max(512, parseInt(e.target.value) || 512)))} className="mt-1.5" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Info className="h-3.5 w-3.5" />
                    <span>Output: {getDimensions().width} × {getDimensions().height}px</span>
                  </div>

                  <div>
                    <Label className="text-xs">Reference Images (Optional)</Label>
                    <p className="text-xs text-muted-foreground mb-1.5">Upload samples — AI creates an ORIGINAL design.</p>
                    <input type="file" ref={fileInputRef} accept="image/*" multiple onChange={handleReferenceUpload} className="hidden" />
                    <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="w-full border-dashed">
                      <Upload className="mr-1.5 h-3.5 w-3.5" /> Upload References
                    </Button>
                    {referenceImages.length > 0 && (
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        {referenceImages.map((img, index) => (
                          <div key={index} className="relative group">
                            <img src={img} alt={`Ref ${index + 1}`} className="h-20 w-full rounded-lg object-cover border" />
                            <button onClick={() => removeReference(index)} className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-xs">Image Description</Label>
                    <Textarea placeholder={`e.g., "Professional ${gig.service_name} service banner..."`} value={imagePrompt} onChange={(e) => setImagePrompt(e.target.value)} className="mt-1.5 min-h-[80px]" />
                  </div>

                  <div>
                    <Label className="text-xs">Design Notes (Optional)</Label>
                    <Textarea placeholder="e.g., Include service name prominently..." value={designNotes} onChange={(e) => setDesignNotes(e.target.value)} className="mt-1.5" />
                  </div>

                  <Button onClick={generateGigImage} disabled={generatingImage} className="w-full gradient-btn text-primary-foreground" size="lg">
                    {generatingImage ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : <><Sparkles className="mr-2 h-4 w-4" /> Generate ({getDimensions().width}×{getDimensions().height})</>}
                  </Button>

                  {generatedImage && (
                    <div className="mt-4 space-y-3">
                      <h3 className="text-sm font-semibold">Generated Image</h3>
                      <div className="overflow-hidden rounded-lg border">
                        <img src={generatedImage} alt="Generated gig image" className="h-auto w-full" />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => {
                          const link = document.createElement("a");
                          link.href = generatedImage;
                          link.download = `${gig.title?.replace(/\s+/g, "-") || "gig"}-image.png`;
                          link.click();
                        }}>
                          <Download className="mr-1.5 h-3.5 w-3.5" /> Download
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setGeneratedImage(null)}>Generate New</Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>

            {/* SEO Score */}
            <TabsContent value="score">
              <GigScoring gig={gig} onFixAll={async (updates) => {
                for (const [field, value] of Object.entries(updates)) await updateGigField(field, value);
                await loadGig();
              }} />
            </TabsContent>

            {/* Export */}
            <TabsContent value="export">
              <GigExport gig={gig} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

const SectionCard = ({ title, children, onCopy, regenerate }: { title: string; children: React.ReactNode; onCopy?: () => void; regenerate?: React.ReactNode }) => (
  <Card className="p-4 md:p-5 shadow-card">
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-base md:text-lg font-semibold">{title}</h2>
      <div className="flex gap-1.5">
        {regenerate}
        {onCopy && <Button variant="outline" size="icon" className="h-8 w-8" onClick={onCopy}><Copy className="h-3.5 w-3.5" /></Button>}
      </div>
    </div>
    {children}
  </Card>
);

const PricingCard = ({ tier, data }: { tier: string; data: any }) => (
  <Card className="p-4 md:p-6 shadow-card">
    <h3 className="mb-3 text-lg font-semibold">{tier}</h3>
    <div className="mb-3 text-2xl font-bold text-primary">${data?.price || "TBD"}</div>
    <div className="space-y-1.5 text-sm">
      <div className="flex justify-between"><span className="text-muted-foreground">Delivery:</span><span className="font-medium">{data?.delivery || "TBD"} days</span></div>
      <div className="flex justify-between"><span className="text-muted-foreground">Revisions:</span><span className="font-medium">{data?.revisions || "TBD"}</span></div>
    </div>
    {data?.features && (
      <ul className="mt-3 space-y-1.5 text-sm">
        {data.features.map((feature: string, index: number) => (
          <li key={index} className="flex items-start gap-1.5">
            <span className="text-primary">✓</span>
            <span>{cleanMarkdown(feature)}</span>
          </li>
        ))}
      </ul>
    )}
  </Card>
);

export default GigView;
