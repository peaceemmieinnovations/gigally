import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BarChart3, Check, X, Trophy, TrendingUp, ArrowRight, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GigDraft {
  id: string;
  title: string;
  short_description: string;
  description: string;
  tags: string[];
  marketplace: string;
  created_at: string;
  service_name: string;
}

interface SEOMetrics {
  titleLength: number;
  titleScore: number;
  descriptionLength: number;
  descriptionScore: number;
  tagCount: number;
  tagScore: number;
  keywordDensity: number;
  keywordScore: number;
  overallScore: number;
}

export const GigComparison = () => {
  const { toast } = useToast();
  const [gigs, setGigs] = useState<GigDraft[]>([]);
  const [selectedGigs, setSelectedGigs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [comparing, setComparing] = useState(false);

  useEffect(() => {
    loadGigs();
  }, []);

  const loadGigs = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from("gig_drafts")
      .select("id, title, short_description, description, tags, marketplace, created_at, service_name")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading gigs:", error);
    } else {
      setGigs(data || []);
    }
    setLoading(false);
  };

  const toggleGigSelection = (gigId: string) => {
    setSelectedGigs(prev => {
      if (prev.includes(gigId)) {
        return prev.filter(id => id !== gigId);
      }
      if (prev.length >= 3) {
        toast({
          title: "Maximum 3 gigs",
          description: "You can compare up to 3 gigs at a time",
          variant: "destructive",
        });
        return prev;
      }
      return [...prev, gigId];
    });
  };

  const calculateSEOMetrics = (gig: GigDraft): SEOMetrics => {
    // Title score (optimal: 50-80 chars)
    const titleLength = gig.title?.length || 0;
    const titleScore = titleLength >= 50 && titleLength <= 80 ? 100 :
      titleLength < 50 ? (titleLength / 50) * 100 :
      Math.max(0, 100 - ((titleLength - 80) * 2));

    // Description score (optimal: 1000-1200 chars)
    const descriptionLength = gig.description?.length || 0;
    const descriptionScore = descriptionLength >= 1000 && descriptionLength <= 1200 ? 100 :
      descriptionLength < 1000 ? (descriptionLength / 1000) * 100 :
      Math.max(0, 100 - ((descriptionLength - 1200) * 0.5));

    // Tag score (optimal: 14 tags)
    const tagCount = gig.tags?.length || 0;
    const tagScore = Math.min(100, (tagCount / 14) * 100);

    // Keyword density (estimate based on service name occurrences)
    const serviceName = gig.service_name?.toLowerCase() || "";
    const description = gig.description?.toLowerCase() || "";
    const title = gig.title?.toLowerCase() || "";
    const keywordOccurrences = 
      (description.split(serviceName).length - 1) +
      (title.split(serviceName).length - 1);
    const keywordDensity = Math.min(5, keywordOccurrences);
    const keywordScore = Math.min(100, keywordDensity * 25);

    // Overall score (weighted average)
    const overallScore = Math.round(
      (titleScore * 0.25) +
      (descriptionScore * 0.35) +
      (tagScore * 0.25) +
      (keywordScore * 0.15)
    );

    return {
      titleLength,
      titleScore: Math.round(titleScore),
      descriptionLength,
      descriptionScore: Math.round(descriptionScore),
      tagCount,
      tagScore: Math.round(tagScore),
      keywordDensity,
      keywordScore: Math.round(keywordScore),
      overallScore
    };
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  const selectedGigData = gigs.filter(g => selectedGigs.includes(g.id));
  const metrics = selectedGigData.map(g => ({ gig: g, metrics: calculateSEOMetrics(g) }));
  const winner = metrics.length > 1 ? 
    metrics.reduce((a, b) => a.metrics.overallScore > b.metrics.overallScore ? a : b) : 
    null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Selection Panel */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-xl font-semibold">Compare Gigs</h2>
            <p className="text-sm text-muted-foreground">Select up to 3 gigs to compare side-by-side</p>
          </div>
        </div>

        {gigs.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No gigs to compare. Create some gigs first!</p>
        ) : (
          <ScrollArea className="h-48">
            <div className="space-y-2">
              {gigs.map(gig => (
                <div
                  key={gig.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedGigs.includes(gig.id) 
                      ? "border-primary bg-primary/5" 
                      : "hover:border-muted-foreground/30"
                  }`}
                  onClick={() => toggleGigSelection(gig.id)}
                >
                  <Checkbox checked={selectedGigs.includes(gig.id)} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{gig.title || gig.service_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {gig.marketplace} • {new Date(gig.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline">{gig.tags?.length || 0} tags</Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </Card>

      {/* Comparison Results */}
      {selectedGigs.length >= 2 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">SEO Comparison Results</h3>
            {winner && (
              <div className="flex items-center gap-2 text-green-600">
                <Trophy className="h-5 w-5" />
                <span className="font-medium">Winner: {winner.gig.title?.slice(0, 30)}...</span>
              </div>
            )}
          </div>

          {/* Comparison Grid */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Metric</th>
                  {selectedGigData.map(gig => (
                    <th key={gig.id} className="text-left py-3 px-4 font-medium">
                      <div className="max-w-[200px] truncate">{gig.title || gig.service_name}</div>
                      <Badge variant="outline" className="mt-1">{gig.marketplace}</Badge>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Overall Score */}
                <tr className="border-b bg-muted/30">
                  <td className="py-3 px-4 font-semibold">Overall SEO Score</td>
                  {metrics.map(({ gig, metrics: m }) => (
                    <td key={gig.id} className="py-3 px-4">
                      <div className={`text-2xl font-bold ${getScoreColor(m.overallScore)}`}>
                        {m.overallScore}%
                        {winner?.gig.id === gig.id && (
                          <Trophy className="inline ml-2 h-5 w-5 text-yellow-500" />
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Title Length */}
                <tr className="border-b">
                  <td className="py-3 px-4">
                    <div>Title Length</div>
                    <div className="text-xs text-muted-foreground">Optimal: 50-80 chars</div>
                  </td>
                  {metrics.map(({ gig, metrics: m }) => (
                    <td key={gig.id} className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span>{m.titleLength} chars</span>
                        <Badge className={getScoreBg(m.titleScore)} variant="outline">
                          {m.titleScore}%
                        </Badge>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Description Length */}
                <tr className="border-b">
                  <td className="py-3 px-4">
                    <div>Description Length</div>
                    <div className="text-xs text-muted-foreground">Optimal: 1000-1200 chars</div>
                  </td>
                  {metrics.map(({ gig, metrics: m }) => (
                    <td key={gig.id} className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span>{m.descriptionLength} chars</span>
                        <Badge className={getScoreBg(m.descriptionScore)} variant="outline">
                          {m.descriptionScore}%
                        </Badge>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Tag Count */}
                <tr className="border-b">
                  <td className="py-3 px-4">
                    <div>Tags</div>
                    <div className="text-xs text-muted-foreground">Optimal: 14 tags</div>
                  </td>
                  {metrics.map(({ gig, metrics: m }) => (
                    <td key={gig.id} className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span>{m.tagCount}/14</span>
                        <Badge className={getScoreBg(m.tagScore)} variant="outline">
                          {m.tagScore}%
                        </Badge>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Keyword Density */}
                <tr className="border-b">
                  <td className="py-3 px-4">
                    <div>Keyword Usage</div>
                    <div className="text-xs text-muted-foreground">Service name mentions</div>
                  </td>
                  {metrics.map(({ gig, metrics: m }) => (
                    <td key={gig.id} className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span>{m.keywordDensity}x</span>
                        <Badge className={getScoreBg(m.keywordScore)} variant="outline">
                          {m.keywordScore}%
                        </Badge>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Recommendations */}
          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Improvement Suggestions
            </h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {metrics.some(m => m.metrics.titleScore < 80) && (
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-3 w-3" />
                  Optimize titles to be between 50-80 characters for better visibility
                </li>
              )}
              {metrics.some(m => m.metrics.descriptionScore < 80) && (
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-3 w-3" />
                  Expand descriptions to 1000-1200 characters for optimal SEO
                </li>
              )}
              {metrics.some(m => m.metrics.tagScore < 100) && (
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-3 w-3" />
                  Add more relevant tags (aim for 14) to improve discoverability
                </li>
              )}
              {metrics.some(m => m.metrics.keywordScore < 75) && (
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-3 w-3" />
                  Include your main service keyword more frequently in title and description
                </li>
              )}
            </ul>
          </div>
        </Card>
      )}
    </div>
  );
};
