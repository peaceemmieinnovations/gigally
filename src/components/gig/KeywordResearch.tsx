import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Search, Loader2, TrendingUp, Target, Lightbulb, BarChart3, ArrowRight } from "lucide-react";

interface KeywordResearchProps {
  serviceName: string;
  marketplace: string;
  onApplyKeywords?: (keywords: string[]) => void;
}

interface KeywordData {
  primaryKeywords: Array<{ keyword: string; volume: string; competition: string; difficulty: string }>;
  longTailKeywords: Array<{ keyword: string; volume: string; opportunity: string }>;
  trendingKeywords: Array<{ keyword: string; trend: string; reason: string }>;
  lsiKeywords: string[];
  buyerIntentPhrases: Array<{ phrase: string; intent: string }>;
  competitorInsights?: {
    topCompetitorKeywords: string[];
    gaps: string[];
    differentiationAngles: string[];
  };
  tips?: {
    titleKeywords: string[];
    descriptionKeywords: string[];
    tagSuggestions: string[];
    placementAdvice: string;
  };
}

export const KeywordResearch = ({ serviceName, marketplace, onApplyKeywords }: KeywordResearchProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<KeywordData | null>(null);

  const runResearch = async () => {
    setLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke("research-keywords", {
        body: { serviceName, marketplace },
      });

      if (error) throw error;
      setData(result);
      toast({ title: "Success!", description: "Keyword research completed" });
    } catch (error: any) {
      console.error("Keyword research error:", error);
      toast({
        title: "Research failed",
        description: error.message || "Failed to research keywords",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getAllKeywords = () => {
    if (!data) return [];
    const all = [
      ...data.primaryKeywords.map((k) => k.keyword),
      ...data.longTailKeywords.map((k) => k.keyword),
      ...data.trendingKeywords.map((k) => k.keyword),
      ...data.lsiKeywords.slice(0, 5),
    ];
    return [...new Set(all)];
  };

  if (!data) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Keyword Research Tool</h3>
          <p className="text-muted-foreground mb-6">
            Analyze top-ranking gigs and discover high-volume, low-competition keywords for "{serviceName}"
          </p>
          <Button onClick={runResearch} disabled={loading} size="lg">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Researching Keywords...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Run Keyword Research
              </>
            )}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Primary Keywords */}
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Primary Keywords</h3>
          <Badge variant="secondary">High Volume</Badge>
        </div>
        <div className="grid gap-3">
          {data.primaryKeywords.map((kw, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border p-3">
              <span className="font-medium">{kw.keyword}</span>
              <div className="flex items-center gap-2">
                <Badge variant={kw.volume === "High" ? "default" : "secondary"} className="text-xs">
                  {kw.volume} Volume
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${kw.competition === "Low" ? "border-green-500 text-green-600" : kw.competition === "High" ? "border-red-500 text-red-600" : ""}`}
                >
                  {kw.competition} Competition
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Trending Keywords */}
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          <h3 className="text-lg font-semibold">Trending Keywords</h3>
          <Badge variant="secondary" className="bg-green-100 text-green-700">Rising</Badge>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {data.trendingKeywords.map((kw, i) => (
            <div key={i} className="rounded-lg border p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{kw.keyword}</span>
                <Badge variant={kw.trend === "Hot" ? "destructive" : "secondary"} className="text-xs">
                  {kw.trend}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{kw.reason}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Long-tail Keywords */}
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Long-tail Keywords</h3>
          <Badge variant="secondary">Low Competition</Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.longTailKeywords.map((kw, i) => (
            <Badge key={i} variant="outline" className="py-1.5 px-3">
              {kw.keyword}
            </Badge>
          ))}
        </div>
      </Card>

      {/* Buyer Intent Phrases */}
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          <h3 className="text-lg font-semibold">Buyer Intent Phrases</h3>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {data.buyerIntentPhrases.map((phrase, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <ArrowRight className="h-3 w-3 text-primary" />
              <span>"{phrase.phrase}"</span>
              <span className="text-muted-foreground">- {phrase.intent}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* LSI Keywords */}
      <Card className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">LSI & Related Keywords</h3>
          <p className="text-sm text-muted-foreground">Semantically related terms to weave into your content</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.lsiKeywords.map((kw, i) => (
            <Badge key={i} variant="secondary">
              {kw}
            </Badge>
          ))}
        </div>
      </Card>

      {/* Tips */}
      {data.tips && (
        <Card className="p-6 bg-primary/5">
          <h3 className="text-lg font-semibold mb-4">💡 Optimization Tips</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm mb-2">Put these in your TITLE:</h4>
              <div className="flex flex-wrap gap-2">
                {data.tips.titleKeywords?.map((kw, i) => (
                  <Badge key={i} variant="default">{kw}</Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-2">Use these as TAGS:</h4>
              <div className="flex flex-wrap gap-2">
                {data.tips.tagSuggestions?.map((kw, i) => (
                  <Badge key={i} variant="outline">{kw}</Badge>
                ))}
              </div>
            </div>
            {data.tips.placementAdvice && (
              <p className="text-sm text-muted-foreground">{data.tips.placementAdvice}</p>
            )}
          </div>
        </Card>
      )}

      {/* Apply Keywords Button */}
      {onApplyKeywords && (
        <Button onClick={() => onApplyKeywords(getAllKeywords())} className="w-full" size="lg">
          Apply Keywords to Gig Regeneration
        </Button>
      )}

      {/* Re-run Button */}
      <Button variant="outline" onClick={runResearch} disabled={loading} className="w-full">
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
        Run New Research
      </Button>
    </div>
  );
};
