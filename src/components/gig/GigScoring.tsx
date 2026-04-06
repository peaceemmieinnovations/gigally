import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Lightbulb,
  RefreshCw,
  Wand2,
  Loader2
} from "lucide-react";

interface GigData {
  title: string;
  short_description: string;
  description: string;
  tags: string[];
  faqs: { question: string; answer: string }[];
  requirements: string[];
  service_name: string;
  marketplace: string;
}

interface ScoreCategory {
  name: string;
  score: number;
  maxScore: number;
  status: "excellent" | "good" | "needs-work" | "poor";
  issues: string[];
  suggestions: string[];
}

interface GigScoringProps {
  gig: GigData;
  onApplySuggestion?: (suggestion: string) => void;
  onFixAll?: (updates: Partial<GigData>) => Promise<void>;
}

export const GigScoring = ({ gig, onApplySuggestion, onFixAll }: GigScoringProps) => {
  const [scores, setScores] = useState<ScoreCategory[]>([]);
  const [overallScore, setOverallScore] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [fixing, setFixing] = useState(false);
  const [fixProgress, setFixProgress] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    analyzeGig();
  }, [gig]);

  const analyzeGig = () => {
    setAnalyzing(true);
    
    // Simulate analysis delay for UX
    setTimeout(() => {
      const categories: ScoreCategory[] = [];
      
      // 1. Title SEO Analysis
      const titleScore = analyzeTitleSEO();
      categories.push(titleScore);
      
      // 2. Description Analysis
      const descScore = analyzeDescription();
      categories.push(descScore);
      
      // 3. Tag Analysis
      const tagScore = analyzeTags();
      categories.push(tagScore);
      
      // 4. FAQ Analysis
      const faqScore = analyzeFAQs();
      categories.push(faqScore);
      
      // 5. Keyword Density
      const keywordScore = analyzeKeywordDensity();
      categories.push(keywordScore);
      
      // 6. Conversion Potential
      const conversionScore = analyzeConversionPotential();
      categories.push(conversionScore);
      
      setScores(categories);
      
      // Calculate overall score
      const total = categories.reduce((sum, cat) => sum + cat.score, 0);
      const maxTotal = categories.reduce((sum, cat) => sum + cat.maxScore, 0);
      setOverallScore(Math.round((total / maxTotal) * 100));
      
      setAnalyzing(false);
    }, 500);
  };

  const analyzeTitleSEO = (): ScoreCategory => {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 0;
    const maxScore = 20;
    
    const title = gig.title || "";
    const serviceName = gig.service_name?.toLowerCase() || "";
    
    // Length check (50-80 chars optimal)
    if (title.length >= 50 && title.length <= 80) {
      score += 5;
    } else if (title.length < 50) {
      issues.push(`Title is too short (${title.length} chars)`);
      suggestions.push("Expand your title to 50-80 characters for better visibility");
    } else {
      issues.push(`Title is too long (${title.length} chars)`);
      suggestions.push("Shorten your title to under 80 characters");
    }
    
    // Starts with "I will" for Fiverr
    if (gig.marketplace?.toLowerCase() === "fiverr") {
      if (title.toLowerCase().startsWith("i will")) {
        score += 5;
      } else {
        issues.push('Fiverr titles should start with "I will"');
        suggestions.push('Start your title with "I will" to match Fiverr\'s format');
      }
    } else {
      score += 5; // Not applicable for non-Fiverr
    }
    
    // Contains main keyword
    if (title.toLowerCase().includes(serviceName)) {
      score += 5;
    } else {
      issues.push("Main service keyword not in title");
      suggestions.push(`Include "${gig.service_name}" in your title for better search ranking`);
    }
    
    // Has power words
    const powerWords = ["professional", "expert", "fast", "quality", "premium", "custom", "unique"];
    if (powerWords.some(word => title.toLowerCase().includes(word))) {
      score += 5;
    } else {
      suggestions.push("Add power words like 'professional', 'expert', or 'premium' to your title");
    }
    
    return {
      name: "Title SEO",
      score,
      maxScore,
      status: score >= 15 ? "excellent" : score >= 10 ? "good" : score >= 5 ? "needs-work" : "poor",
      issues,
      suggestions
    };
  };

  const analyzeDescription = (): ScoreCategory => {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 0;
    const maxScore = 25;
    
    const desc = gig.description || "";
    
    // Length check (1000-1200 chars)
    if (desc.length >= 1000 && desc.length <= 1200) {
      score += 8;
    } else if (desc.length < 1000) {
      issues.push(`Description is too short (${desc.length}/1000 chars)`);
      suggestions.push("Expand your description to at least 1000 characters");
    } else {
      issues.push(`Description exceeds optimal length (${desc.length}/1200 chars)`);
      suggestions.push("Trim your description to under 1200 characters");
    }
    
    // Has bullet points or formatting
    if (desc.includes("•") || desc.includes("-") || desc.includes("✓")) {
      score += 5;
    } else {
      suggestions.push("Add bullet points to make your description scannable");
    }
    
    // Has call-to-action
    const ctaWords = ["order now", "contact", "message me", "get started", "let's work"];
    if (ctaWords.some(cta => desc.toLowerCase().includes(cta))) {
      score += 5;
    } else {
      issues.push("No clear call-to-action found");
      suggestions.push('Add a call-to-action like "Order now" or "Message me to get started"');
    }
    
    // Has benefits, not just features
    const benefitWords = ["save time", "increase", "boost", "grow", "improve", "achieve", "results"];
    if (benefitWords.some(word => desc.toLowerCase().includes(word))) {
      score += 7;
    } else {
      suggestions.push("Focus on benefits (what clients will gain) not just features");
    }
    
    return {
      name: "Description Quality",
      score,
      maxScore,
      status: score >= 20 ? "excellent" : score >= 15 ? "good" : score >= 8 ? "needs-work" : "poor",
      issues,
      suggestions
    };
  };

  const analyzeTags = (): ScoreCategory => {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 0;
    const maxScore = 15;
    
    const tags = gig.tags || [];
    
    // Tag count (14 is optimal)
    if (tags.length === 14) {
      score += 10;
    } else if (tags.length >= 10) {
      score += 7;
      suggestions.push(`Add ${14 - tags.length} more tags to maximize discoverability`);
    } else {
      issues.push(`Only ${tags.length}/14 tags used`);
      suggestions.push("Add more relevant tags - you can use up to 14");
      score += Math.round((tags.length / 14) * 7);
    }
    
    // Tag variety (not too similar)
    const uniqueWords = new Set(tags.flatMap(t => t.toLowerCase().split(" ")));
    if (uniqueWords.size >= tags.length) {
      score += 5;
    } else {
      suggestions.push("Use more varied tags to cover different search terms");
    }
    
    return {
      name: "Tag Optimization",
      score,
      maxScore,
      status: score >= 12 ? "excellent" : score >= 8 ? "good" : score >= 5 ? "needs-work" : "poor",
      issues,
      suggestions
    };
  };

  const analyzeFAQs = (): ScoreCategory => {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 0;
    const maxScore = 15;
    
    const faqs = gig.faqs || [];
    
    // FAQ count (10 is optimal)
    if (faqs.length >= 10) {
      score += 8;
    } else if (faqs.length >= 5) {
      score += 5;
      suggestions.push(`Add ${10 - faqs.length} more FAQs to address common concerns`);
    } else {
      issues.push(`Only ${faqs.length}/10 FAQs`);
      suggestions.push("Add more FAQs - they help with SEO and buyer confidence");
      score += faqs.length;
    }
    
    // FAQ quality (answer length)
    const avgAnswerLength = faqs.length > 0 
      ? faqs.reduce((sum, faq) => sum + (faq.answer?.length || 0), 0) / faqs.length 
      : 0;
    
    if (avgAnswerLength >= 100) {
      score += 7;
    } else if (avgAnswerLength >= 50) {
      score += 4;
      suggestions.push("Expand your FAQ answers to be more detailed (100+ chars each)");
    } else if (faqs.length > 0) {
      issues.push("FAQ answers are too short");
      suggestions.push("Write more comprehensive FAQ answers");
    }
    
    return {
      name: "FAQ Coverage",
      score,
      maxScore,
      status: score >= 12 ? "excellent" : score >= 8 ? "good" : score >= 4 ? "needs-work" : "poor",
      issues,
      suggestions
    };
  };

  const analyzeKeywordDensity = (): ScoreCategory => {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 0;
    const maxScore = 10;
    
    const serviceName = gig.service_name?.toLowerCase() || "";
    const allText = `${gig.title} ${gig.description} ${gig.tags?.join(" ")}`.toLowerCase();
    const wordCount = allText.split(/\s+/).length;
    
    // Count keyword occurrences
    const keywordCount = (allText.match(new RegExp(serviceName, "gi")) || []).length;
    const density = wordCount > 0 ? (keywordCount / wordCount) * 100 : 0;
    
    // Optimal density: 1-3%
    if (density >= 1 && density <= 3) {
      score += 10;
    } else if (density > 3) {
      issues.push("Keyword density too high (keyword stuffing)");
      suggestions.push("Reduce keyword repetition to avoid appearing spammy");
      score += 5;
    } else {
      issues.push(`Low keyword density (${density.toFixed(1)}%)`);
      suggestions.push(`Use your main keyword "${gig.service_name}" more naturally throughout your content`);
      score += Math.round(density * 5);
    }
    
    return {
      name: "Keyword Density",
      score,
      maxScore,
      status: score >= 8 ? "excellent" : score >= 5 ? "good" : score >= 3 ? "needs-work" : "poor",
      issues,
      suggestions
    };
  };

  const analyzeConversionPotential = (): ScoreCategory => {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 0;
    const maxScore = 15;
    
    const desc = gig.description || "";
    const title = gig.title || "";
    const allText = `${title} ${desc}`.toLowerCase();
    
    // Trust signals
    const trustWords = ["guarantee", "refund", "revision", "support", "100%", "satisfaction"];
    const trustCount = trustWords.filter(w => allText.includes(w)).length;
    if (trustCount >= 2) {
      score += 5;
    } else {
      suggestions.push("Add trust signals like 'satisfaction guarantee' or 'unlimited revisions'");
    }
    
    // Urgency/scarcity (optional)
    const urgencyWords = ["limited", "fast", "quick", "24 hours", "same day"];
    if (urgencyWords.some(w => allText.includes(w))) {
      score += 3;
    }
    
    // Social proof indicators
    const proofWords = ["clients", "projects", "delivered", "completed", "experience", "years"];
    if (proofWords.some(w => allText.includes(w))) {
      score += 4;
    } else {
      suggestions.push("Mention your experience or number of completed projects");
    }
    
    // Clear value proposition
    if (gig.short_description && gig.short_description.length >= 50) {
      score += 3;
    } else {
      suggestions.push("Write a compelling short description that clearly states your value");
    }
    
    return {
      name: "Conversion Potential",
      score,
      maxScore,
      status: score >= 12 ? "excellent" : score >= 8 ? "good" : score >= 4 ? "needs-work" : "poor",
      issues,
      suggestions
    };
  };

  const getStatusIcon = (status: ScoreCategory["status"]) => {
    switch (status) {
      case "excellent": return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "good": return <CheckCircle className="h-5 w-5 text-blue-600" />;
      case "needs-work": return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "poor": return <XCircle className="h-5 w-5 text-red-600" />;
    }
  };

  const getStatusColor = (status: ScoreCategory["status"]) => {
    switch (status) {
      case "excellent": return "bg-green-100 text-green-800";
      case "good": return "bg-blue-100 text-blue-800";
      case "needs-work": return "bg-yellow-100 text-yellow-800";
      case "poor": return "bg-red-100 text-red-800";
    }
  };

  const getOverallGrade = () => {
    if (overallScore >= 90) return { grade: "A+", color: "text-green-600", label: "Excellent" };
    if (overallScore >= 80) return { grade: "A", color: "text-green-600", label: "Great" };
    if (overallScore >= 70) return { grade: "B", color: "text-blue-600", label: "Good" };
    if (overallScore >= 60) return { grade: "C", color: "text-yellow-600", label: "Needs Work" };
    return { grade: "D", color: "text-red-600", label: "Poor" };
  };

  const grade = getOverallGrade();
  const allSuggestions = scores.flatMap(s => s.suggestions);

  const getSectionsToFix = () => {
    const weakSections: string[] = [];
    for (const cat of scores) {
      const pct = (cat.score / cat.maxScore) * 100;
      if (pct < 70) {
        if (cat.name === "Title SEO") weakSections.push("title");
        if (cat.name === "Description Quality") weakSections.push("description");
        if (cat.name === "Tag Optimization") weakSections.push("tags");
        if (cat.name === "FAQ Coverage") weakSections.push("faqs");
        if (cat.name === "Keyword Density") {
          if (!weakSections.includes("description")) weakSections.push("description");
        }
        if (cat.name === "Conversion Potential") {
          if (!weakSections.includes("description")) weakSections.push("description");
          weakSections.push("shortDescription");
        }
      }
    }
    return [...new Set(weakSections)];
  };

  const handleFixAll = async () => {
    if (!onFixAll) return;
    const sectionsToFix = getSectionsToFix();
    if (sectionsToFix.length === 0) {
      toast({ title: "All good!", description: "Your gig is already well-optimized." });
      return;
    }

    setFixing(true);
    const updates: Partial<GigData> = {};
    const sectionLabels: Record<string, string> = {
      title: "Title", description: "Description", tags: "Tags", faqs: "FAQs", shortDescription: "Short Description"
    };

    try {
      for (const section of sectionsToFix) {
        setFixProgress(`Optimizing ${sectionLabels[section] || section}...`);
        
        const currentValue = section === "shortDescription" ? gig.short_description
          : section === "faqs" ? JSON.stringify(gig.faqs)
          : section === "tags" ? gig.tags?.join(", ")
          : (gig as any)[section] || "";

        const { data, error } = await supabase.functions.invoke("regenerate-section", {
          body: {
            section,
            currentValue,
            serviceName: gig.service_name,
            marketplace: gig.marketplace,
            keywords: gig.tags?.slice(0, 5) || [],
            tone: "professional",
          },
        });

        if (error) {
          console.error(`Failed to fix ${section}:`, error);
          continue;
        }

        if (data.title) updates.title = data.title;
        if (data.description) updates.description = data.description;
        if (data.shortDescription) updates.short_description = data.shortDescription;
        if (data.tags) updates.tags = data.tags;
        if (data.faqs) updates.faqs = data.faqs;
      }

      if (Object.keys(updates).length > 0) {
        await onFixAll(updates);
        toast({ title: "SEO Fixed! 🚀", description: `Optimized ${Object.keys(updates).length} sections for better ranking.` });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to fix issues", variant: "destructive" });
    } finally {
      setFixing(false);
      setFixProgress("");
    }
  };

  const hasIssues = scores.some(s => (s.score / s.maxScore) * 100 < 70);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-xl font-semibold">Gig SEO Score</h2>
            <p className="text-sm text-muted-foreground">Comprehensive analysis of your gig's optimization</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={analyzeGig} disabled={analyzing || fixing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${analyzing ? "animate-spin" : ""}`} />
            Re-analyze
          </Button>
          {hasIssues && onFixAll && (
            <Button size="sm" onClick={handleFixAll} disabled={fixing || analyzing} className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
              {fixing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Wand2 className="h-4 w-4 mr-2" />
              )}
              {fixing ? "Fixing..." : "Fix All Issues"}
            </Button>
          )}
        </div>
      </div>

      {fixing && fixProgress && (
        <div className="mb-6 p-4 bg-primary/10 rounded-lg flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-sm font-medium">{fixProgress}</span>
        </div>
      )}

      {/* Overall Score */}
      <div className="mb-8 p-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Overall SEO Score</p>
            <div className="flex items-baseline gap-2">
              <span className={`text-5xl font-bold ${grade.color}`}>{overallScore}</span>
              <span className="text-2xl text-muted-foreground">/100</span>
            </div>
          </div>
          <div className="text-center">
            <div className={`text-5xl font-bold ${grade.color}`}>{grade.grade}</div>
            <Badge className={getStatusColor(overallScore >= 70 ? "good" : "needs-work")}>
              {grade.label}
            </Badge>
          </div>
        </div>
        <Progress value={overallScore} className="mt-4 h-3" />
      </div>

      {/* Category Scores */}
      <div className="space-y-4 mb-8">
        {scores.map((category, index) => (
          <div key={index} className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(category.status)}
                <span className="font-medium">{category.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{category.score}/{category.maxScore}</span>
                <Badge className={getStatusColor(category.status)}>
                  {Math.round((category.score / category.maxScore) * 100)}%
                </Badge>
              </div>
            </div>
            <Progress 
              value={(category.score / category.maxScore) * 100} 
              className="h-2 mb-2" 
            />
            
            {category.issues.length > 0 && (
              <div className="mt-2">
                {category.issues.map((issue, i) => (
                  <p key={i} className="text-sm text-red-600 flex items-center gap-1">
                    <XCircle className="h-3 w-3" /> {issue}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Improvement Suggestions */}
      {allSuggestions.length > 0 && (
        <div className="p-4 bg-muted/30 rounded-lg">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            Improvement Suggestions
          </h3>
          <ul className="space-y-2">
            {allSuggestions.slice(0, 5).map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};
