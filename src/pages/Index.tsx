import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles, Target, TrendingUp, Zap, Star, Users, Award, ArrowRight, Check, BarChart3 } from "lucide-react";
import logo from "@/assets/gigally-logo.png";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="absolute top-0 left-1/4 w-72 h-72 md:w-96 md:h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 md:w-96 md:h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b glass">
        <div className="container mx-auto flex items-center justify-between px-4 py-3 md:py-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="GigAlly logo" className="h-9 w-9" width={36} height={36} />
            <span className="text-lg md:text-xl font-bold gradient-text">GigAlly</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
            <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>Sign In</Button>
            <Button
              size="sm"
              className="gradient-btn text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              onClick={() => navigate("/auth")}
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-16 md:py-28 lg:py-36">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6 md:mb-8">
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI-Powered Gig Optimization</span>
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            </div>

            <h1 className="mb-5 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl lg:text-6xl text-balance">
              Create{" "}
              <span className="gradient-text">High-Ranking</span>
              <br className="hidden sm:block" />
              {" "}Fiverr & Upwork Gigs
            </h1>

            <p className="mb-8 md:mb-10 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              The only AI tool that researches markets, finds <strong className="text-foreground">low-competition niches</strong>,
              and generates <strong className="text-foreground">SEO-optimized content</strong> that converts browsers into buyers.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center mb-10">
              <Button
                size="lg"
                className="gradient-btn text-primary-foreground text-base px-8 py-6 shadow-elevated transition-all hover:scale-105 group"
                onClick={() => navigate("/auth")}
              >
                Start Creating Free
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 py-6 border-2"
                onClick={() => navigate("/auth")}
              >
                Watch Demo
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-primary/60 to-secondary/60 border-2 border-background flex items-center justify-center text-xs font-bold text-primary-foreground">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <span className="text-sm"><strong className="text-foreground">500+</strong> freelancers</span>
              </div>
              <div className="hidden sm:block h-6 w-px bg-border" />
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                ))}
                <span className="ml-1 text-sm"><strong className="text-foreground">4.9</strong> rating</span>
              </div>
              <div className="hidden sm:block h-6 w-px bg-border" />
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-green-500" />
                <span className="text-sm"><strong className="text-foreground">10,000+</strong> gigs created</span>
              </div>
            </div>
          </div>
        </div>

        {/* Marketplace Logos */}
        <div className="mt-16 md:mt-20 border-y bg-muted/30 py-6 md:py-8">
          <div className="container mx-auto px-4">
            <p className="text-center text-xs md:text-sm text-muted-foreground mb-5">Optimized for the world's largest freelance platforms</p>
            <div className="flex items-center justify-center gap-6 md:gap-12 flex-wrap">
              {["Fiverr", "Upwork", "Freelancer", "Toptal"].map((name) => (
                <div key={name} className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-foreground">{name[0]}</span>
                  </div>
                  <span className="font-semibold text-sm text-foreground">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/5 px-4 py-1.5 text-sm font-medium text-secondary mb-4">
              <Zap className="h-3.5 w-3.5" />
              Powerful Features
            </div>
            <h2 className="mb-3 text-3xl md:text-4xl lg:text-5xl font-bold text-balance">Why Freelancers Choose GigAlly</h2>
            <p className="mx-auto max-w-2xl text-base md:text-lg text-muted-foreground">
              Everything you need to dominate freelance marketplaces and win more clients
            </p>
          </div>

          <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard icon={<Target className="h-6 w-6" />} title="Market Research" description="Real-time analysis of Fiverr & Upwork to find trending services and untapped niches" gradient="from-primary to-primary/70" />
            <FeatureCard icon={<Sparkles className="h-6 w-6" />} title="AI Copywriting" description="SEO-optimized titles, descriptions, tags, and 10 keyword-rich FAQs that rank" gradient="from-secondary to-secondary/70" />
            <FeatureCard icon={<TrendingUp className="h-6 w-6" />} title="Niche Scoring" description="Get competition and demand scores to identify the most profitable opportunities" gradient="from-primary to-secondary" />
            <FeatureCard icon={<Zap className="h-6 w-6" />} title="Fast Generation" description="Complete gig drafts in under 60 seconds, ready to publish on any marketplace" gradient="from-secondary to-primary" />
          </div>

          {/* Additional Features */}
          <div className="mt-10 md:mt-16 grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3">
            <div className="p-5 md:p-6 rounded-2xl bg-card border shadow-card hover:shadow-elevated transition-all">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-1.5">Gig Scoring</h3>
              <p className="text-sm text-muted-foreground">Analyze SEO strength, keyword density, and conversion potential with actionable improvements</p>
            </div>
            <div className="p-5 md:p-6 rounded-2xl bg-card border shadow-card hover:shadow-elevated transition-all">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center mb-3">
                <Users className="h-5 w-5 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-1.5">Side-by-Side Compare</h3>
              <p className="text-sm text-muted-foreground">Compare multiple gig drafts and analyze which performs better based on SEO metrics</p>
            </div>
            <div className="p-5 md:p-6 rounded-2xl bg-card border shadow-card hover:shadow-elevated transition-all">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-1.5">Marketplace Export</h3>
              <p className="text-sm text-muted-foreground">Download formatted files ready to paste directly into Fiverr and Upwork</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="mb-3 text-3xl md:text-4xl lg:text-5xl font-bold text-balance">Create Your Perfect Gig in 3 Steps</h2>
            <p className="mx-auto max-w-2xl text-base md:text-lg text-muted-foreground">
              From idea to published gig in under 5 minutes
            </p>
          </div>

          <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-3 max-w-5xl mx-auto">
            <StepCard number="01" title="Describe Your Service" description="Enter your service name, target audience, and preferred tone. Our AI understands your unique offering." />
            <StepCard number="02" title="AI Research & Generate" description="We analyze top-ranking gigs, find high-volume keywords, and generate optimized content tailored to your niche." />
            <StepCard number="03" title="Review & Publish" description="Preview exactly how your gig looks on Fiverr/Upwork, make edits, and export ready-to-publish content." />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="mb-3 text-3xl md:text-4xl lg:text-5xl font-bold">Loved by Freelancers</h2>
            <p className="mx-auto max-w-2xl text-base md:text-lg text-muted-foreground">
              Join hundreds of successful freelancers already using GigAlly
            </p>
          </div>

          <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3 max-w-5xl mx-auto">
            <TestimonialCard quote="My gig impressions increased by 300% after optimizing with GigAlly. The keyword research is incredible!" author="Sarah M." role="Web Developer" rating={5} />
            <TestimonialCard quote="I was stuck on page 10 for months. After using GigAlly, I'm now on the first page for my main keyword." author="James K." role="Graphic Designer" rating={5} />
            <TestimonialCard quote="The AI writes better gig descriptions than I ever could. It understands exactly what buyers are searching for." author="Maria L." role="Content Writer" rating={5} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-2xl md:rounded-3xl gradient-btn p-8 md:p-16 text-center text-primary-foreground shadow-elevated">
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

            <div className="relative z-10">
              <h2 className="mb-4 text-3xl md:text-4xl lg:text-5xl font-bold">
                Ready to Win More Clients?
              </h2>
              <p className="mb-8 text-base md:text-xl opacity-90 max-w-2xl mx-auto">
                Join 500+ freelancers who have increased their visibility and earnings with AI-optimized gigs
              </p>
              <Button
                size="lg"
                className="bg-background text-foreground hover:bg-background/90 text-base md:text-lg px-8 py-6 shadow-xl"
                onClick={() => navigate("/auth")}
              >
                Start Creating Now — It's Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <div className="mt-6 md:mt-8 flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm opacity-80">
                <div className="flex items-center gap-2"><Check className="h-4 w-4" /> No credit card required</div>
                <div className="flex items-center gap-2"><Check className="h-4 w-4" /> Free tier available</div>
                <div className="flex items-center gap-2"><Check className="h-4 w-4" /> Cancel anytime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 md:py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
            <div className="flex items-center gap-2">
              <img src={logo} alt="GigAlly" className="h-5 w-5" loading="lazy" width={20} height={20} />
              <span className="font-bold gradient-text">GigAlly</span>
            </div>

            <p className="text-xs md:text-sm text-muted-foreground text-center">
              © 2025 GigAlly by{" "}
              <a href="https://peaceemmieinnovations.lovable.app" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">
                Peace Emmie Innovations
              </a>
              {" "}— Building the future of freelance success
            </p>

            <div className="flex items-center gap-4 text-xs md:text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, gradient }: { icon: React.ReactNode; title: string; description: string; gradient: string }) => (
  <div className="group relative rounded-2xl border bg-card p-5 md:p-6 transition-all hover:shadow-elevated hover:-translate-y-1 shadow-card">
    <div className={`mb-3 inline-flex rounded-xl bg-gradient-to-br ${gradient} p-2.5 text-primary-foreground shadow-lg transition-all group-hover:scale-110`}>
      {icon}
    </div>
    <h3 className="mb-1.5 text-lg font-semibold">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

const StepCard = ({ number, title, description }: { number: string; title: string; description: string }) => (
  <div className="relative p-5 md:p-6 rounded-2xl bg-card border shadow-card">
    <div className="absolute -top-3 left-5 px-3 py-0.5 rounded-full gradient-btn text-primary-foreground text-xs font-bold">
      Step {number}
    </div>
    <h3 className="mt-3 text-lg font-semibold mb-1.5">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

const TestimonialCard = ({ quote, author, role, rating }: { quote: string; author: string; role: string; rating: number }) => (
  <div className="p-5 md:p-6 rounded-2xl bg-card border shadow-card hover:shadow-elevated transition-all">
    <div className="flex gap-0.5 mb-3">
      {Array.from({ length: rating }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
      ))}
    </div>
    <p className="text-sm text-muted-foreground mb-4 italic">"{quote}"</p>
    <div>
      <p className="font-semibold text-sm">{author}</p>
      <p className="text-xs text-muted-foreground">{role}</p>
    </div>
  </div>
);

export default Index;
