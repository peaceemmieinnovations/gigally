import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, LogOut, Settings, TrendingUp, Loader2, Image as ImageIcon, BarChart3, Sparkles, Trash2, Send, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GigImageDesigner } from "@/components/gig/GigImageDesigner";
import { GigComparison } from "@/components/gig/GigComparison";
import type { User } from "@supabase/supabase-js";
import logo from "@/assets/gigally-logo.png";

interface TrendingNiche {
  keyword: string;
  trend: string;
  reason: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [gigs, setGigs] = useState<any[]>([]);
  const [trendingNiches, setTrendingNiches] = useState<TrendingNiche[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [showImageDesigner, setShowImageDesigner] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const gigsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { navigate("/auth"); }
      else { setUser(session.user); loadGigs(session.user.id); checkAdmin(session.user.id); }
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate("/auth");
      else setUser(session.user);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAdmin = async (uid: string) => {
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid);
    setIsAdmin((data || []).some((r: any) => r.role === "admin"));
  };

  const loadGigs = async (userId: string) => {
    const { data, error } = await supabase.from("gig_drafts").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    if (!error) setGigs(data || []);
  };

  const fetchTrendingNiches = async () => {
    setLoadingInsights(true);
    try {
      const { data, error } = await supabase.functions.invoke('research-keywords', { body: { serviceName: 'freelance services', marketplace: 'fiverr' } });
      if (error) throw error;
      if (data?.trendingKeywords) setTrendingNiches(data.trendingKeywords.slice(0, 5));
    } catch (err: any) {
      toast({ title: "Error", description: "Failed to fetch insights", variant: "destructive" });
    } finally { setLoadingInsights(false); }
  };

  const deleteGig = async (gigId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const { error } = await supabase.from("gig_drafts").delete().eq("id", gigId);
    if (error) { toast({ title: "Error", description: "Failed to delete gig", variant: "destructive" }); }
    else { setGigs(prev => prev.filter(g => g.id !== gigId)); toast({ title: "Deleted", description: "Gig removed" }); }
  };

  const scrollToGigs = () => gigsRef.current?.scrollIntoView({ behavior: 'smooth' });
  const handleSignOut = async () => { await supabase.auth.signOut(); navigate("/"); };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
          <p className="mt-3 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b glass">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <img src={logo} alt="GigAlly" className="h-8 w-8" loading="lazy" width={32} height={32} />
            <span className="text-lg font-bold gradient-text">GigAlly</span>
          </div>
          <div className="flex items-center gap-1">
            {isAdmin && <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => navigate("/admin")} title="Admin"><Shield className="h-4 w-4" /></Button>}
            <Button variant="ghost" size="icon" className="h-9 w-9" title="Settings"><Settings className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleSignOut}><LogOut className="h-4 w-4" /></Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-10">
        {/* Welcome */}
        <div className="mb-8 md:mb-10">
          <h1 className="mb-1 text-2xl md:text-3xl font-bold">Welcome back, {user?.email?.split("@")[0]}</h1>
          <p className="text-sm md:text-base text-muted-foreground">Create and manage your marketplace gigs</p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 md:mb-10 grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-6">
          <Card className="group cursor-pointer border-2 border-primary/20 p-4 md:p-5 transition-all hover:border-primary hover:shadow-elevated" onClick={() => navigate("/gigs/create")}>
            <div className="mb-3 inline-flex rounded-xl gradient-btn p-2.5 text-primary-foreground transition-transform group-hover:scale-110">
              <Plus className="h-5 w-5" />
            </div>
            <h3 className="mb-1 text-sm md:text-base font-semibold">Create Gig</h3>
            <p className="text-xs text-muted-foreground hidden md:block">Generate with AI</p>
          </Card>

          <Card className="cursor-pointer p-4 md:p-5 transition-all hover:shadow-elevated shadow-card" onClick={scrollToGigs}>
            <div className="mb-3 inline-flex rounded-xl bg-muted p-2.5">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <h3 className="mb-1 text-sm md:text-base font-semibold">Drafts</h3>
            <p className="text-xs text-muted-foreground">{gigs.length} saved</p>
          </Card>

          <Card className="group cursor-pointer border-2 border-secondary/20 p-4 md:p-5 transition-all hover:border-secondary hover:shadow-elevated" onClick={() => gigs.length > 0 ? setShowImageDesigner(true) : toast({ title: "No gigs yet", description: "Create a gig first" })}>
            <div className="mb-3 inline-flex rounded-xl bg-gradient-to-br from-secondary to-primary p-2.5 text-primary-foreground transition-transform group-hover:scale-110">
              <ImageIcon className="h-5 w-5" />
            </div>
            <h3 className="mb-1 text-sm md:text-base font-semibold">Image Designer</h3>
            <p className="text-xs text-muted-foreground hidden md:block">Create images</p>
          </Card>

          <Card className="cursor-pointer p-4 md:p-5 transition-all hover:shadow-elevated shadow-card" onClick={() => gigs.length >= 2 ? setShowCompare(true) : toast({ title: "Need 2+ gigs", description: "Create more gigs to compare" })}>
            <div className="mb-3 inline-flex rounded-xl bg-muted p-2.5">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <h3 className="mb-1 text-sm md:text-base font-semibold">Compare</h3>
            <p className="text-xs text-muted-foreground hidden md:block">SEO analysis</p>
          </Card>

          <Card className="group cursor-pointer border-2 border-secondary/20 p-4 md:p-5 transition-all hover:border-secondary hover:shadow-elevated" onClick={() => navigate("/outreach")}>
            <div className="mb-3 inline-flex rounded-xl bg-gradient-to-br from-primary to-secondary p-2.5 text-primary-foreground transition-transform group-hover:scale-110">
              <Send className="h-5 w-5" />
            </div>
            <h3 className="mb-1 text-sm md:text-base font-semibold">Outreach AI</h3>
            <p className="text-xs text-muted-foreground hidden md:block">Personalized DMs</p>
          </Card>

          <Card className="cursor-pointer col-span-2 lg:col-span-1 p-4 md:p-5 transition-all hover:shadow-elevated shadow-card" onClick={fetchTrendingNiches}>
            <div className="mb-3 inline-flex rounded-xl bg-muted p-2.5">
              {loadingInsights ? <Loader2 className="h-5 w-5 text-secondary animate-spin" /> : <TrendingUp className="h-5 w-5 text-secondary" />}
            </div>
            <h3 className="mb-1 text-sm md:text-base font-semibold">AI Insights</h3>
            {trendingNiches.length > 0 ? (
              <div className="space-y-0.5">
                {trendingNiches.map((niche, i) => (
                  <p key={i} className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                    <Badge variant="outline" className="text-[9px] px-1 py-0 shrink-0">{niche.trend || "Hot"}</Badge>
                    <span className="truncate">{niche.keyword || String(niche)}</span>
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">{loadingInsights ? "Fetching..." : "Discover trends"}</p>
            )}
          </Card>
        </div>

        {/* Gigs List */}
        <div ref={gigsRef}>
          <h2 className="mb-4 text-lg md:text-xl font-bold">Recent Gigs</h2>
          {gigs.length === 0 ? (
            <Card className="p-8 md:p-12 text-center shadow-card">
              <FileText className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
              <h3 className="mb-1.5 text-lg font-semibold">No gigs yet</h3>
              <p className="mb-5 text-sm text-muted-foreground">Create your first AI-powered gig to get started</p>
              <Button className="gradient-btn text-primary-foreground" onClick={() => navigate("/gigs/create")}>
                <Plus className="mr-2 h-4 w-4" /> Create Your First Gig
              </Button>
            </Card>
          ) : (
            <div className="grid gap-3">
              {gigs.map((gig) => (
                <Card key={gig.id} className="cursor-pointer p-4 md:p-5 transition-all hover:shadow-elevated shadow-card" onClick={() => navigate(`/gigs/${gig.id}`)}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="mb-1 flex flex-wrap items-center gap-1.5">
                        <Badge className="bg-primary/10 text-primary border-0 text-xs">{gig.marketplace}</Badge>
                        <span className="text-xs text-muted-foreground">{new Date(gig.created_at).toLocaleDateString()}</span>
                        {gig.tags?.length > 0 && <Badge variant="outline" className="text-[10px]">{gig.tags.length} tags</Badge>}
                      </div>
                      <h3 className="mb-1 text-base md:text-lg font-semibold truncate">{gig.title || gig.service_name}</h3>
                      <p className="line-clamp-2 text-xs md:text-sm text-muted-foreground">{gig.short_description || gig.description}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0" onClick={(e) => deleteGig(gig.id, e)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Dialogs */}
      <Dialog open={showImageDesigner} onOpenChange={setShowImageDesigner}>
        <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
          <DialogHeader><DialogTitle className="sr-only">Gig Image Designer</DialogTitle></DialogHeader>
          <GigImageDesigner gigs={gigs} onClose={() => setShowImageDesigner(false)} />
        </DialogContent>
      </Dialog>
      <Dialog open={showCompare} onOpenChange={setShowCompare}>
        <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
          <DialogHeader><DialogTitle className="sr-only">Compare Gigs</DialogTitle></DialogHeader>
          <GigComparison />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
