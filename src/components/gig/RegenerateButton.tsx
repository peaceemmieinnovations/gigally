import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, Loader2 } from "lucide-react";

interface RegenerateButtonProps {
  section: "title" | "shortDescription" | "description" | "tags" | "faqs";
  currentValue: any;
  serviceName: string;
  marketplace: string;
  tone?: string;
  keywords?: string[];
  onRegenerated: (newValue: any) => void;
}

export const RegenerateButton = ({
  section,
  currentValue,
  serviceName,
  marketplace,
  tone = "professional",
  keywords = [],
  onRegenerated,
}: RegenerateButtonProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleRegenerate = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("regenerate-section", {
        body: {
          section,
          currentValue: typeof currentValue === "object" ? JSON.stringify(currentValue) : currentValue,
          serviceName,
          marketplace,
          tone,
          keywords,
        },
      });

      if (error) throw error;

      // Extract the regenerated value based on section
      const newValue = data[section];
      onRegenerated(newValue);

      toast({
        title: "Section regenerated!",
        description: `New ${section} has been generated`,
      });
    } catch (error: any) {
      console.error("Regeneration error:", error);
      toast({
        title: "Regeneration failed",
        description: error.message || "Failed to regenerate section",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleRegenerate}
      disabled={loading}
      className="h-8 gap-1.5"
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <RefreshCw className="h-3.5 w-3.5" />
      )}
      <span className="hidden sm:inline">Regenerate</span>
    </Button>
  );
};
