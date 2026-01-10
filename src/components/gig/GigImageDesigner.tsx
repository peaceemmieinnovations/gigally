import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Loader2, Image as ImageIcon, Upload, X, Download, Wand2, Palette, Layers } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const IMAGE_DIMENSIONS = {
  fiverr_main: { width: 1280, height: 769, label: "Fiverr Main (1280×769)" },
  fiverr_square: { width: 550, height: 370, label: "Fiverr Thumbnail (550×370)" },
  upwork_catalog: { width: 1200, height: 630, label: "Upwork Catalog (1200×630)" },
  upwork_square: { width: 800, height: 800, label: "Upwork Square (800×800)" },
  social_og: { width: 1200, height: 630, label: "Social OG Image (1200×630)" },
  custom: { width: 1280, height: 720, label: "Custom Size" },
};

interface GigDraft {
  id: string;
  title: string | null;
  service_name: string;
  marketplace: string;
  description: string | null;
  short_description: string | null;
  tags: string[] | null;
}

interface GigImageDesignerProps {
  gigs: GigDraft[];
  onClose?: () => void;
}

export const GigImageDesigner = ({ gigs, onClose }: GigImageDesignerProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedGigId, setSelectedGigId] = useState<string>("");
  const [generatingImage, setGeneratingImage] = useState(false);
  const [imagePrompt, setImagePrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedDimension, setSelectedDimension] = useState<keyof typeof IMAGE_DIMENSIONS>("fiverr_main");
  const [customWidth, setCustomWidth] = useState(1280);
  const [customHeight, setCustomHeight] = useState(720);
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [designNotes, setDesignNotes] = useState("");
  const [style, setStyle] = useState<string>("modern");

  const selectedGig = gigs.find(g => g.id === selectedGigId);

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
        setReferenceImages((prev) => [...prev.slice(0, 1), reader.result as string]);
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

  const generateSmartPrompt = () => {
    if (!selectedGig) return;
    
    const title = selectedGig.title || selectedGig.service_name;
    const tags = selectedGig.tags?.slice(0, 3).join(", ") || "";
    
    const stylePrompts: Record<string, string> = {
      modern: "Clean, minimalist design with bold typography and gradient accents",
      corporate: "Professional business aesthetic with clean lines and corporate colors",
      creative: "Artistic and creative design with unique visual elements and vibrant colors",
      tech: "Futuristic tech-inspired design with digital elements and modern fonts",
      friendly: "Warm and approachable design with soft colors and friendly imagery",
    };

    const prompt = `Professional gig image for "${title}". ${stylePrompts[style]}. ${tags ? `Related to: ${tags}.` : ""} Include visual elements that represent the service. Make it eye-catching and marketplace-ready.`;
    
    setImagePrompt(prompt);
    toast({ title: "Smart prompt generated!", description: "Feel free to customize it" });
  };

  const generateGigImage = async () => {
    if (!selectedGig) {
      toast({
        title: "Select a gig",
        description: "Please select a gig draft first",
        variant: "destructive",
      });
      return;
    }

    if (!imagePrompt.trim()) {
      toast({
        title: "Enter a prompt",
        description: "Please enter or generate a prompt for the image",
        variant: "destructive",
      });
      return;
    }

    setGeneratingImage(true);
    try {
      const dimensions = getDimensions();
      
      let enhancedPrompt = imagePrompt;
      if (designNotes) {
        enhancedPrompt += `\n\nDesign notes: ${designNotes}`;
      }
      if (referenceImages.length > 0) {
        enhancedPrompt += `\n\nIMPORTANT: Create an ORIGINAL design that is INSPIRED BY but DOES NOT COPY the reference images.`;
      }

      const { data, error } = await supabase.functions.invoke("generate-gig-image", {
        body: { 
          prompt: enhancedPrompt, 
          gigTitle: selectedGig.title || selectedGig.service_name,
          width: dimensions.width,
          height: dimensions.height,
          referenceImages: referenceImages.length > 0 ? referenceImages : undefined,
        },
      });

      if (error) throw error;

      setGeneratedImage(data.image);
      toast({
        title: "Image Generated! 🎨",
        description: `Perfect ${dimensions.width}×${dimensions.height} gig image ready`,
      });
    } catch (error: any) {
      console.error("Error generating image:", error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate image",
        variant: "destructive",
      });
    } finally {
      setGeneratingImage(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `gig-image-${selectedGig?.service_name?.replace(/\s+/g, "-") || "design"}.png`;
    link.click();
    toast({ title: "Downloaded!", description: "Image saved to your device" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 px-4 py-2">
          <Wand2 className="h-5 w-5 text-primary" />
          <span className="font-medium">AI Gig Image Designer</span>
        </div>
        <p className="text-muted-foreground">
          Create perfect, marketplace-ready gig images with AI
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Settings */}
        <div className="space-y-4">
          {/* Gig Selection */}
          <Card className="p-4">
            <Label className="mb-2 flex items-center gap-2 text-base font-semibold">
              <Layers className="h-4 w-4" />
              Select Your Gig Draft
            </Label>
            <Select value={selectedGigId} onValueChange={setSelectedGigId}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Choose a gig draft..." />
              </SelectTrigger>
              <SelectContent>
                {gigs.map((gig) => (
                  <SelectItem key={gig.id} value={gig.id}>
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-primary/10 px-2 py-0.5 text-xs text-primary">
                        {gig.marketplace}
                      </span>
                      <span className="truncate">{gig.title || gig.service_name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedGig && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 rounded-lg bg-muted/50 p-3 text-sm"
              >
                <p className="font-medium">{selectedGig.title || selectedGig.service_name}</p>
                <p className="text-muted-foreground line-clamp-2">
                  {selectedGig.short_description || selectedGig.description}
                </p>
              </motion.div>
            )}
          </Card>

          {/* Dimension & Style */}
          <Card className="p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="mb-2 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Dimensions
                </Label>
                <Select 
                  value={selectedDimension} 
                  onValueChange={(v) => setSelectedDimension(v as keyof typeof IMAGE_DIMENSIONS)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(IMAGE_DIMENSIONS).map(([key, dim]) => (
                      <SelectItem key={key} value={key}>{dim.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="mb-2 flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Style
                </Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">Modern & Clean</SelectItem>
                    <SelectItem value="corporate">Corporate & Professional</SelectItem>
                    <SelectItem value="creative">Creative & Artistic</SelectItem>
                    <SelectItem value="tech">Tech & Futuristic</SelectItem>
                    <SelectItem value="friendly">Friendly & Warm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedDimension === "custom" && (
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Width (px)</Label>
                  <Input 
                    type="number" 
                    value={customWidth} 
                    onChange={(e) => setCustomWidth(Number(e.target.value))}
                    min={512} max={1920}
                  />
                </div>
                <div>
                  <Label className="text-xs">Height (px)</Label>
                  <Input 
                    type="number" 
                    value={customHeight} 
                    onChange={(e) => setCustomHeight(Number(e.target.value))}
                    min={512} max={1920}
                  />
                </div>
              </div>
            )}
          </Card>

          {/* Prompt */}
          <Card className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Image Prompt
              </Label>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={generateSmartPrompt}
                disabled={!selectedGig}
              >
                <Wand2 className="mr-1 h-3 w-3" />
                Auto-Generate
              </Button>
            </div>
            <Textarea
              placeholder="Describe your ideal gig image, or click Auto-Generate..."
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </Card>

          {/* Reference Images */}
          <Card className="p-4">
            <Label className="mb-2 flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Reference Images (Optional)
            </Label>
            <p className="mb-3 text-xs text-muted-foreground">
              Upload images for style inspiration - AI will create something unique
            </p>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleReferenceUpload}
              accept="image/*"
              multiple
              className="hidden"
            />
            
            <div className="flex flex-wrap gap-2">
              {referenceImages.map((img, i) => (
                <div key={i} className="group relative h-20 w-20 overflow-hidden rounded-lg border">
                  <img src={img} alt="Reference" className="h-full w-full object-cover" />
                  <button
                    onClick={() => removeReference(i)}
                    className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              
              {referenceImages.length < 2 && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 transition-colors hover:border-primary"
                >
                  <Upload className="h-5 w-5 text-muted-foreground" />
                </button>
              )}
            </div>
          </Card>

          {/* Design Notes */}
          <Card className="p-4">
            <Label className="mb-2 block">Additional Design Notes</Label>
            <Textarea
              placeholder="E.g., Use specific colors, include certain elements..."
              value={designNotes}
              onChange={(e) => setDesignNotes(e.target.value)}
              rows={2}
              className="resize-none"
            />
          </Card>

          {/* Generate Button */}
          <Button
            onClick={generateGigImage}
            disabled={generatingImage || !selectedGig}
            className="w-full bg-gradient-to-r from-primary to-secondary py-6 text-lg"
          >
            {generatingImage ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating Your Perfect Image...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Generate Gig Image
              </>
            )}
          </Button>
        </div>

        {/* Right Column - Preview */}
        <div>
          <Card className="sticky top-4 overflow-hidden">
            <div className="border-b bg-muted/30 p-3">
              <h3 className="font-semibold">Preview</h3>
            </div>
            
            <div className="p-4">
              <AnimatePresence mode="wait">
                {generatedImage ? (
                  <motion.div
                    key="generated"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-4"
                  >
                    <div className="overflow-hidden rounded-lg border shadow-lg">
                      <img 
                        src={generatedImage} 
                        alt="Generated gig image" 
                        className="w-full"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={downloadImage} className="flex-1">
                        <Download className="mr-2 h-4 w-4" />
                        Download Image
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={generateGigImage}
                        disabled={generatingImage}
                      >
                        Regenerate
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex aspect-video flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/20"
                  >
                    <ImageIcon className="mb-3 h-16 w-16 text-muted-foreground/30" />
                    <p className="text-center text-muted-foreground">
                      {selectedGig 
                        ? "Click Generate to create your image" 
                        : "Select a gig to get started"
                      }
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
