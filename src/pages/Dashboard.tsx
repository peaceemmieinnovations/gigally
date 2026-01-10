import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, FileText, LogOut, Settings, Sparkles, TrendingUp, Loader2, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GigImageDesigner } from "@/components/gig/GigImageDesigner";
import type { User } from "@supabase/supabase-js";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [gigs, setGigs] = useState<any[]>([]);
  const [trendingNiches, setTrendingNiches] = useState<string[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [showImageDesigner, setShowImageDesigner] = useState(false);
  const gigsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check auth status
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        loadGigs(session.user.id);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadGigs = async (userId: string) => {
    const { data, error } = await supabase
      .from("gig_drafts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading gigs:", error);
    } else {
      setGigs(data || []);
    }
  };

  const fetchTrendingNiches = async () => {
    setLoadingInsights(true);
    try {
      const { data, error } = await supabase.functions.invoke('research-keywords', {
        body: { serviceName: 'freelance services', marketplace: 'fiverr' }
      });
      if (data?.trendingKeywords) {
        setTrendingNiches(data.trendingKeywords.slice(0, 5));
      }
    } catch (err) {
      console.error("Error fetching insights:", err);
    } finally {
      setLoadingInsights(false);
    }
  };

  const scrollToGigs = () => {
    gigsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Sparkles className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2 text-2xl font-bold">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              GigAlly
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="mb-2 text-4xl font-bold">
            Welcome back, {user?.email?.split("@")[0]}!
          </h1>
          <p className="text-lg text-muted-foreground">
            Create and manage your marketplace gigs
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card
            className="group cursor-pointer border-2 border-primary/20 p-6 transition-all hover:border-primary hover:shadow-lg"
            onClick={() => navigate("/gigs/create")}
          >
            <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-primary to-secondary p-3 text-white transition-transform group-hover:scale-110">
              <Plus className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Create New Gig</h3>
            <p className="text-muted-foreground">
              Generate an optimized gig with AI in under a minute
            </p>
          </Card>

          <Card 
            className="cursor-pointer p-6 transition-all hover:shadow-lg hover:border-primary/50"
            onClick={scrollToGigs}
          >
            <div className="mb-4 inline-flex rounded-xl bg-muted p-3">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">View Drafts</h3>
            <p className="text-muted-foreground">
              {gigs.length} gig{gigs.length !== 1 ? "s" : ""} saved
            </p>
          </Card>

          <Card 
            className="group cursor-pointer border-2 border-secondary/20 p-6 transition-all hover:border-secondary hover:shadow-lg"
            onClick={() => gigs.length > 0 ? setShowImageDesigner(true) : toast({ title: "No gigs yet", description: "Create a gig first to use the image designer" })}
          >
            <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-secondary to-primary p-3 text-white transition-transform group-hover:scale-110">
              <ImageIcon className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Gig Image Designer</h3>
            <p className="text-muted-foreground">
              Create perfect marketplace images with AI
            </p>
          </Card>

          <Card 
            className="cursor-pointer p-6 transition-all hover:shadow-lg hover:border-secondary/50"
            onClick={fetchTrendingNiches}
          >
            <div className="mb-4 inline-flex rounded-xl bg-muted p-3">
              {loadingInsights ? (
                <Loader2 className="h-6 w-6 text-secondary animate-spin" />
              ) : (
                <TrendingUp className="h-6 w-6 text-secondary" />
              )}
            </div>
            <h3 className="mb-2 text-xl font-semibold">AI Insights</h3>
            {trendingNiches.length > 0 ? (
              <div className="space-y-1">
                {trendingNiches.map((niche, i) => (
                  <p key={i} className="text-sm text-muted-foreground flex items-center gap-1">
                    <span className="text-secondary">•</span> {niche}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                {loadingInsights ? "Fetching trends..." : "Click to discover trending niches"}
              </p>
            )}
          </Card>
        </div>

        {/* Recent Gigs */}
        <div ref={gigsRef}>
          <h2 className="mb-6 text-2xl font-bold">Recent Gigs</h2>
          
          {gigs.length === 0 ? (
            <Card className="p-12 text-center">
              <FileText className="mx-auto mb-4 h-16 w-16 text-muted-foreground/50" />
              <h3 className="mb-2 text-xl font-semibold">No gigs yet</h3>
              <p className="mb-6 text-muted-foreground">
                Create your first AI-powered gig to get started
              </p>
              <Button
                className="bg-gradient-to-r from-primary to-secondary"
                onClick={() => navigate("/gigs/create")}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Gig
              </Button>
            </Card>
          ) : (
            <div className="grid gap-4">
              {gigs.map((gig) => (
                <Card
                  key={gig.id}
                  className="cursor-pointer p-6 transition-all hover:shadow-lg"
                  onClick={() => navigate(`/gigs/${gig.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="mb-1 inline-flex items-center gap-2">
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                          {gig.marketplace}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(gig.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="mb-2 text-xl font-semibold">
                        {gig.title || gig.service_name}
                      </h3>
                      <p className="line-clamp-2 text-muted-foreground">
                        {gig.short_description || gig.description}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <FileText className="h-5 w-5" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Gig Image Designer Dialog */}
      <Dialog open={showImageDesigner} onOpenChange={setShowImageDesigner}>
        <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="sr-only">Gig Image Designer</DialogTitle>
          </DialogHeader>
          <GigImageDesigner gigs={gigs} onClose={() => setShowImageDesigner(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;