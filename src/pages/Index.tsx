import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles, Target, TrendingUp, Zap, Star, Users, Award, ArrowRight, Check, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-lg blur-sm opacity-75" />
              <div className="relative flex items-center gap-2 bg-background px-3 py-1.5 rounded-lg">
                <Sparkles className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  GigAlly
                </span>
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
            <Button 
              className="bg-gradient-to-r from-primary to-secondary shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              onClick={() => navigate("/auth")}
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 md:py-32 lg:py-40">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl text-center">
            {/* Floating Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2 text-sm font-medium text-primary mb-8 backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Gig Optimization</span>
              <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            </div>
            
            <h1 className="mb-6 text-5xl font-bold leading-tight md:text-6xl lg:text-7xl">
              Create{" "}
              <span className="relative">
                <span className="bg-gradient-to-r from-primary via-purple-500 to-secondary bg-clip-text text-transparent">
                  High-Ranking
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M2 10C50 2 150 2 298 10" stroke="url(#gradient)" strokeWidth="4" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="300" y2="0">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="hsl(var(--secondary))" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
              <br />
              Fiverr & Upwork Gigs
            </h1>
            
            <p className="mb-10 text-xl text-muted-foreground md:text-2xl max-w-3xl mx-auto leading-relaxed">
              The only AI tool that researches markets, finds <strong className="text-foreground">low-competition niches</strong>, 
              and generates <strong className="text-foreground">SEO-optimized content</strong> that converts browsers into buyers.
            </p>
            
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center mb-12">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-secondary text-lg px-8 py-6 shadow-2xl shadow-primary/25 transition-all hover:scale-105 hover:shadow-primary/40 group"
                onClick={() => navigate("/auth")}
              >
                Start Creating Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-6 border-2"
                onClick={() => navigate("/auth")}
              >
                Watch Demo
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/50 to-secondary/50 border-2 border-background flex items-center justify-center text-xs font-bold text-primary-foreground">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <span className="text-sm"><strong className="text-foreground">500+</strong> freelancers</span>
              </div>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                ))}
                <span className="ml-1 text-sm"><strong className="text-foreground">4.9</strong> rating</span>
              </div>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-green-500" />
                <span className="text-sm"><strong className="text-foreground">10,000+</strong> gigs created</span>
              </div>
            </div>
          </div>
        </div>

        {/* Marketplace Logos */}
        <div className="mt-20 border-y bg-muted/30 py-8 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <p className="text-center text-sm text-muted-foreground mb-6">Optimized for the world's largest freelance platforms</p>
            <div className="flex items-center justify-center gap-12 flex-wrap">
              {/* Fiverr Logo */}
              <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                <svg className="h-8" viewBox="0 0 89 27" fill="currentColor">
                  <g fillRule="evenodd">
                    <path d="M81.6 16.7c0-1.3-.9-2.1-2.3-2.1-.7 0-1.3.2-1.7.5s-.7.8-.7 1.3c0 .6.4 1 1 1.2.5.1 1 .2 1.5.2 1.5.1 2.2-.5 2.2-1.1zm-2.1-4.7c-3.2 0-5.3 1.8-5.3 4.5 0 2.3 1.6 4 4.6 4.3 1.6.2 2.2.5 2.2 1.1 0 .7-.8 1.1-2.2 1.1-1.6 0-3-.5-4-1.5l-.5.5c1.1 1.5 2.7 2.3 4.5 2.3 3.2 0 5.2-1.5 5.2-4.1 0-2.4-1.7-3.6-4.5-4-1.6-.2-2.3-.6-2.3-1.3 0-.7.7-1.2 2.1-1.2 1.4 0 2.4.5 3.2 1.4l.5-.6c-1-1.5-2.4-2.5-3.5-2.5z"/>
                    <path d="M68.3 12H65v8.2c0 2.5 1.2 3.7 3.5 3.7h1.8v-1.4h-1.4c-1.5 0-2.1-.7-2.1-2.4V12h3.5v-1.4h-3.5V7h-1.5v3.6h-3.3v1.4h3.3v8.2c0 2.5 1.2 3.7 3.5 3.7h1.8v-1.4h-1.4c-1.5 0-2.1-.7-2.1-2.4V12h3.5v-1.4h-2z"/>
                    <path d="M47.2 6.3h-1.5v7.4c-1-1.3-2.5-2-4.2-2-3.5 0-6 2.7-6 6.4s2.5 6.4 6 6.4c1.8 0 3.3-.8 4.3-2.1v1.8h1.4V6.3zm-5.5 16.5c-2.7 0-4.6-2.1-4.6-4.8 0-2.8 1.9-4.8 4.6-4.8s4.6 2.1 4.6 4.8c0 2.7-1.9 4.8-4.6 4.8zM26.1 10.5h1.5V24h-1.5zM26.8 6c-.6 0-1.1.5-1.1 1.1s.5 1.1 1.1 1.1 1.1-.5 1.1-1.1-.5-1.1-1.1-1.1zM23 10.5h-1.4v1.8c-1-1.3-2.5-2-4.3-2-3.5 0-6 2.7-6 6.4s2.5 6.4 6 6.4c1.8 0 3.3-.8 4.3-2.1v1.8H23V10.5zm-5.5 11.2c-2.7 0-4.6-2.1-4.6-4.8 0-2.8 1.9-4.8 4.6-4.8s4.6 2.1 4.6 4.8c0 2.7-1.9 4.8-4.6 4.8zM0 10.5h1.5v6.8c0 4.4 2.1 6.7 6 6.7h1.5v-1.4H7.5c-3 0-4.5-1.8-4.5-5.3v-6.8h5.5v-1.4H3V5.5H1.5v3.6H0v1.4z"/>
                  </g>
                </svg>
              </div>
              
              {/* Upwork Logo */}
              <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                <svg className="h-7" viewBox="0 0 102 30" fill="currentColor">
                  <path d="M30.8 18.3c-.6-3.4-2.2-5.8-4.5-7.4-2.3-1.5-5.2-2.3-8.5-2.3h-3v2.7h3c2.6 0 4.7.5 6.4 1.6 1.6 1.1 2.7 2.7 3.2 4.8.5 2.1.3 4.3-.6 6.5-.9 2.2-2.4 3.9-4.5 5.2-2.1 1.3-4.5 1.9-7.3 1.9h-3V0h-3v30h6c3.5 0 6.6-.8 9.3-2.5 2.7-1.7 4.7-4 6-6.9 1.3-2.9 1.6-5.9 1-9-.1-.4-.2-.8-.3-1.2l-.2-.1zM64.6 8.6c-3.3 0-6 1.2-8.1 3.5V9.1h-2.7v20.7h2.7V18.3c0-3 .8-5.3 2.3-6.9 1.6-1.6 3.6-2.4 6.2-2.4h.8V8.6h-1.2zM75.9 29.8l-8.7-20.7h3l6.9 16.5 6.9-16.5h2.9l-8.7 20.7h-2.3zM101.3 20.5l-6.4-11.4H92l8.3 14.7v6h2.7v-6l8.3-14.7h-2.9l-6.4 11.4h-.7z"/>
                </svg>
              </div>

              {/* Freelancer Logo */}
              <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-1">
                  <div className="w-6 h-6 rounded bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">F</span>
                  </div>
                  <span className="font-semibold">Freelancer</span>
                </div>
              </div>

              {/* Toptal Logo */}
              <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center">
                    <span className="text-white font-bold text-xs">T</span>
                  </div>
                  <span className="font-semibold">Toptal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-4 py-1.5 text-sm font-medium text-secondary mb-4">
              <Zap className="h-4 w-4" />
              Powerful Features
            </div>
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">Why Freelancers Choose GigAlly</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Everything you need to dominate freelance marketplaces and win more clients
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<Target className="h-7 w-7" />}
              title="Market Research"
              description="Real-time analysis of Fiverr & Upwork to find trending services and untapped niches"
              gradient="from-blue-500 to-cyan-500"
            />
            <FeatureCard
              icon={<Sparkles className="h-7 w-7" />}
              title="AI Copywriting"
              description="SEO-optimized titles, descriptions, tags, and 10 keyword-rich FAQs that rank"
              gradient="from-purple-500 to-pink-500"
            />
            <FeatureCard
              icon={<TrendingUp className="h-7 w-7" />}
              title="Niche Scoring"
              description="Get competition and demand scores to identify the most profitable opportunities"
              gradient="from-orange-500 to-red-500"
            />
            <FeatureCard
              icon={<Zap className="h-7 w-7" />}
              title="Fast Generation"
              description="Complete gig drafts in under 60 seconds, ready to publish on any marketplace"
              gradient="from-green-500 to-emerald-500"
            />
          </div>

          {/* Additional Features Grid */}
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="p-6 rounded-2xl bg-card border hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Gig Scoring</h3>
              <p className="text-muted-foreground">Analyze SEO strength, keyword density, and conversion potential with actionable improvements</p>
            </div>
            
            <div className="p-6 rounded-2xl bg-card border hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Side-by-Side Compare</h3>
              <p className="text-muted-foreground">Compare multiple gig drafts and analyze which performs better based on SEO metrics</p>
            </div>
            
            <div className="p-6 rounded-2xl bg-card border hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/10 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Marketplace Export</h3>
              <p className="text-muted-foreground">Download formatted files ready to paste directly into Fiverr and Upwork</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">Create Your Perfect Gig in 3 Steps</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              From idea to published gig in under 5 minutes
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            <StepCard
              number="01"
              title="Describe Your Service"
              description="Enter your service name, target audience, and preferred tone. Our AI understands your unique offering."
            />
            <StepCard
              number="02"
              title="AI Research & Generate"
              description="We analyze top-ranking gigs, find high-volume keywords, and generate optimized content tailored to your niche."
            />
            <StepCard
              number="03"
              title="Review & Publish"
              description="Preview exactly how your gig looks on Fiverr/Upwork, make edits, and export ready-to-publish content."
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">Loved by Freelancers</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Join hundreds of successful freelancers already using GigAlly
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            <TestimonialCard
              quote="My gig impressions increased by 300% after optimizing with GigAlly. The keyword research is incredible!"
              author="Sarah M."
              role="Web Developer"
              rating={5}
            />
            <TestimonialCard
              quote="I was stuck on page 10 for months. After using GigAlly, I'm now on the first page for my main keyword."
              author="James K."
              role="Graphic Designer"
              rating={5}
            />
            <TestimonialCard
              quote="The AI writes better gig descriptions than I ever could. It understands exactly what buyers are searching for."
              author="Maria L."
              role="Content Writer"
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-purple-600 to-secondary p-12 md:p-16 text-center text-white shadow-2xl">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            
            <div className="relative z-10">
              <h2 className="mb-4 text-4xl font-bold md:text-5xl">
                Ready to Win More Clients?
              </h2>
              <p className="mb-8 text-xl opacity-90 max-w-2xl mx-auto">
                Join 500+ freelancers who have increased their visibility and earnings with AI-optimized gigs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 shadow-xl"
                  onClick={() => navigate("/auth")}
                >
                  Start Creating Now - It's Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              
              <div className="mt-8 flex items-center justify-center gap-6 text-sm opacity-80">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Free tier available
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Cancel anytime
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                GigAlly
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground text-center">
              © 2025 GigAlly by{" "}
              <a 
                href="https://peaceemmieinnovations.lovable.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline"
              >
                Peace Emmie Innovations
              </a>
              {" "}— Building the future of freelance success
            </p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
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

const FeatureCard = ({ 
  icon, 
  title, 
  description,
  gradient
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  gradient: string;
}) => (
  <div className="group relative rounded-2xl border bg-card p-6 transition-all hover:shadow-xl hover:-translate-y-1">
    <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${gradient} p-3 text-white shadow-lg transition-all group-hover:scale-110 group-hover:shadow-xl`}>
      {icon}
    </div>
    <h3 className="mb-2 text-xl font-semibold">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

const StepCard = ({
  number,
  title,
  description
}: {
  number: string;
  title: string;
  description: string;
}) => (
  <div className="relative p-6 rounded-2xl bg-card border">
    <div className="absolute -top-4 left-6 px-3 py-1 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-sm font-bold">
      Step {number}
    </div>
    <h3 className="mt-4 text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

const TestimonialCard = ({
  quote,
  author,
  role,
  rating
}: {
  quote: string;
  author: string;
  role: string;
  rating: number;
}) => (
  <div className="p-6 rounded-2xl bg-card border hover:shadow-lg transition-all">
    <div className="flex gap-1 mb-4">
      {Array.from({ length: rating }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
      ))}
    </div>
    <p className="text-muted-foreground mb-4 italic">"{quote}"</p>
    <div>
      <p className="font-semibold">{author}</p>
      <p className="text-sm text-muted-foreground">{role}</p>
    </div>
  </div>
);

export default Index;
