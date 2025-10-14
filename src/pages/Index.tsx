import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles, Target, TrendingUp, Zap } from "lucide-react";
import heroImage from "@/assets/hero-gradient.jpg";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        
        <div className="container relative mx-auto px-4 py-24 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Powered by AI & Market Intelligence
            </div>
            
            <h1 className="mb-6 text-5xl font-bold leading-tight md:text-7xl">
              Create{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                High-Ranking
              </span>{" "}
              Fiverr & Upwork Gigs
            </h1>
            
            <p className="mb-8 text-xl text-muted-foreground md:text-2xl">
              AI-powered gig builder that researches markets, finds low-competition niches,
              and generates SEO-optimized content that converts.
            </p>
            
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-secondary text-lg shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                onClick={() => navigate("/auth")}
              >
                Get Started Free
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg"
                onClick={() => navigate("/auth")}
              >
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold">Why GigAlly?</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Everything you need to dominate freelance marketplaces
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<Target className="h-8 w-8 text-primary" />}
              title="Market Research"
              description="Real-time analysis of Fiverr & Upwork to find trending services and low-competition niches"
            />
            <FeatureCard
              icon={<Sparkles className="h-8 w-8 text-secondary" />}
              title="AI Copywriting"
              description="Generate SEO-optimized titles, descriptions, tags, and FAQs that rank and convert"
            />
            <FeatureCard
              icon={<TrendingUp className="h-8 w-8 text-primary" />}
              title="Niche Scoring"
              description="Get competition and demand scores to identify the most profitable opportunities"
            />
            <FeatureCard
              icon={<Zap className="h-8 w-8 text-secondary" />}
              title="Fast Generation"
              description="Complete gig drafts in under 60 seconds, ready to publish on any marketplace"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-secondary p-12 text-center text-white shadow-2xl">
            <div className="relative z-10">
              <h2 className="mb-4 text-4xl font-bold md:text-5xl">
                Ready to Win More Clients?
              </h2>
              <p className="mb-8 text-xl opacity-90">
                Join hundreds of freelancers creating better gigs with AI
              </p>
              <Button 
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90"
                onClick={() => navigate("/auth")}
              >
                Start Creating Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="mb-2 text-sm">
            © 2025 GigAlly by{" "}
            <a 
              href="https://peaceemmieinnovations.lovable.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:underline"
            >
              Peace Emmie Innovations
            </a>
          </p>
          <p className="text-xs">
            Building the future of freelance success
          </p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) => (
  <div className="group rounded-2xl border bg-card p-6 transition-all hover:shadow-lg">
    <div className="mb-4 inline-flex rounded-xl bg-muted p-3 transition-all group-hover:scale-110">
      {icon}
    </div>
    <h3 className="mb-2 text-xl font-semibold">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export default Index;