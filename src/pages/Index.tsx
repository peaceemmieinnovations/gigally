import { Button } from "@/components/ui/button";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Check,
  FileDown,
  ImageIcon,
  Search,
  Sparkles,
  Star,
  Target,
  WandSparkles,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/gigally-logo.png";
import freelancerStudio from "@/assets/freelancer-studio.jpg";

const ease = [0.22, 1, 0.36, 1] as const;

const Index = () => {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const reveal = {
    initial: reduceMotion ? {} : { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.7, ease },
  };

  return (
    <div className="dark min-h-screen overflow-hidden bg-background font-body text-foreground">
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/75 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between px-4 md:h-20">
          <a href="#top" className="flex items-center gap-2.5" aria-label="GigAlly home">
            <img src={logo} alt="" className="h-9 w-9" width={36} height={36} />
            <div className="leading-none">
              <span className="block font-heading text-lg font-bold">GigAlly</span>
              <span className="mt-1 hidden text-[10px] text-muted-foreground sm:block">POWERED BY PEACE EMMIE INNOVATIONS</span>
            </div>
          </a>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#platform" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Platform</a>
            <a href="#workflow" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">How it works</a>
            <a href="#proof" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Results</a>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>Sign in</Button>
            <Button size="sm" onClick={() => navigate("/auth")} className="shadow-glow">
              Get started <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      <main id="top">
        <section className="relative min-h-[760px] overflow-hidden border-b border-border pt-16 md:min-h-[820px] md:pt-20">
          <img
            src={freelancerStudio}
            alt="Freelancer creating marketplace gigs with GigAlly"
            className="absolute inset-0 h-full w-full object-cover object-[66%_center]"
            width={1600}
            height={1000}
          />
          <div className="absolute inset-0 bg-hero-overlay" />
          <div className="absolute inset-0 landing-grid opacity-30" />

          <div className="container relative z-10 flex min-h-[700px] items-center px-4 py-16 md:min-h-[740px] md:py-20">
            <motion.div
              initial={reduceMotion ? {} : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease }}
              className="max-w-3xl"
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/35 bg-background/60 px-3.5 py-2 text-xs font-bold uppercase text-primary backdrop-blur-xl">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                AI gig intelligence is live
              </div>
              <h1 className="max-w-3xl font-heading text-5xl font-bold leading-[0.98] md:text-7xl lg:text-8xl">
                Build gigs that get <span className="gradient-text">found and hired.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-xl">
                Research profitable niches, write marketplace-ready copy, score your SEO, and create standout gig images in one focused workspace.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" onClick={() => navigate("/auth")} className="h-13 px-7 text-base shadow-glow group">
                  Create my first gig
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => document.querySelector("#platform")?.scrollIntoView({ behavior: "smooth" })} className="h-13 border-border/80 bg-background/35 px-7 text-base backdrop-blur-xl hover:bg-muted/70">
                  See how it works
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
                {["Fiverr & Upwork ready", "No credit card", "Export anytime"].map((item) => (
                  <span key={item} className="flex items-center gap-2"><Check className="h-4 w-4 text-success" />{item}</span>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={reduceMotion ? {} : { opacity: 0, y: 35, rotate: 1 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ delay: 0.35, duration: 0.9, ease }}
            className="absolute bottom-6 right-4 z-20 hidden w-[460px] border border-border/80 bg-card/80 p-4 shadow-elevated backdrop-blur-2xl lg:block"
          >
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div>
                <p className="text-xs font-bold uppercase text-primary">Live gig score</p>
                <p className="mt-1 font-heading text-lg font-semibold">I will design a modern brand identity</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-success/30 text-sm font-bold text-success">92</div>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-4">
              {[["SEO", "Excellent"], ["Demand", "High"], ["Competition", "Low"]].map(([label, value]) => (
                <div key={label} className="bg-muted/60 p-3">
                  <p className="text-[10px] uppercase text-muted-foreground">{label}</p>
                  <p className="mt-1 text-sm font-semibold">{value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="border-b border-border bg-card/35 py-6">
          <div className="container flex flex-col items-center justify-between gap-5 px-4 md:flex-row">
            <p className="text-xs font-bold uppercase text-muted-foreground">Built for where freelancers sell</p>
            <div className="flex flex-wrap items-center justify-center gap-7 font-heading text-sm font-semibold text-muted-foreground md:gap-12">
              <span>fiverr.</span><span>upwork</span><span>Freelancer</span><span>Contra</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm"><Star className="h-4 w-4 fill-secondary text-secondary" /><strong>4.9</strong><span className="text-muted-foreground">creator rating</span></div>
          </div>
        </section>

        <section id="platform" className="py-20 md:py-32">
          <div className="container px-4">
            <motion.div {...reveal} className="mx-auto max-w-3xl text-center">
              <p className="mb-4 text-xs font-bold uppercase text-primary">One intelligent workspace</p>
              <h2 className="font-heading text-4xl font-bold leading-tight md:text-6xl">From market signal to ready-to-publish gig.</h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">Every tool follows the same goal: help your service appear in search and earn the buyer’s click.</p>
            </motion.div>

            <div className="mt-14 grid gap-4 lg:grid-cols-12">
              <motion.article {...reveal} className="group relative min-h-[430px] overflow-hidden border border-border bg-card p-6 shadow-card lg:col-span-7 md:p-8">
                <div className="relative z-10 max-w-md">
                  <div className="mb-5 inline-flex h-11 w-11 items-center justify-center bg-primary/15 text-primary"><Search className="h-5 w-5" /></div>
                  <h3 className="font-heading text-3xl font-bold">Research before you write</h3>
                  <p className="mt-3 text-muted-foreground">Discover buyer keywords, rising niches, competition levels, and long-tail opportunities for each marketplace.</p>
                </div>
                <div className="absolute inset-x-6 bottom-6 border border-border bg-background/80 p-4 backdrop-blur-xl md:left-auto md:w-[58%]">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <span className="text-sm font-semibold">Keyword opportunities</span><span className="flex items-center gap-1 text-xs text-success"><span className="h-1.5 w-1.5 rounded-full bg-success" />Live</span>
                  </div>
                  {["minimalist logo design", "saas brand identity", "startup style guide"].map((keyword, index) => (
                    <div key={keyword} className="flex items-center justify-between border-b border-border/60 py-3 last:border-0">
                      <span className="text-sm">{keyword}</span><span className={index === 0 ? "text-xs font-bold text-success" : "text-xs text-muted-foreground"}>{["+42%", "+28%", "+19%"][index]}</span>
                    </div>
                  ))}
                </div>
              </motion.article>

              <motion.article {...reveal} transition={{ ...reveal.transition, delay: 0.08 }} className="relative min-h-[430px] overflow-hidden border border-border bg-card p-6 shadow-card lg:col-span-5 md:p-8">
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center bg-secondary/15 text-secondary"><ImageIcon className="h-5 w-5" /></div>
                <h3 className="font-heading text-3xl font-bold">Design the click</h3>
                <p className="mt-3 text-muted-foreground">Generate marketplace-sized gig images using your draft, style, and visual references.</p>
                <div className="absolute bottom-0 left-8 right-8 top-52 overflow-hidden border border-border bg-muted">
                  <img src={freelancerStudio} alt="Example professional gig image" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" width={1600} height={1000} />
                  <div className="absolute inset-x-3 bottom-3 flex items-center justify-between bg-background/85 p-3 backdrop-blur-lg">
                    <span className="text-xs font-semibold">Fiverr • 1280 × 769</span><WandSparkles className="h-4 w-4 text-secondary" />
                  </div>
                </div>
              </motion.article>

              {[
                [Target, "Score every detail", "See exactly how your title, keywords, description, and tags can perform before publishing."],
                [Sparkles, "Generate with control", "Regenerate only the title, description, pricing, tags, FAQs, or any section you want."],
                [FileDown, "Preview and export", "Check realistic Fiverr and Upwork layouts, then export clean marketplace-ready files."],
              ].map(([Icon, title, description], index) => {
                const FeatureIcon = Icon as typeof Target;
                return (
                  <motion.article key={title as string} {...reveal} transition={{ ...reveal.transition, delay: index * 0.06 }} className="border border-border bg-card p-6 shadow-card lg:col-span-4 md:p-8">
                    <FeatureIcon className="h-7 w-7 text-primary" />
                    <h3 className="mt-7 font-heading text-xl font-bold">{title as string}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description as string}</p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="workflow" className="border-y border-border bg-card/30 py-20 md:py-28">
          <div className="container grid gap-14 px-4 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <motion.div {...reveal}>
              <p className="mb-4 text-xs font-bold uppercase text-secondary">A clear path to publish</p>
              <h2 className="font-heading text-4xl font-bold leading-tight md:text-5xl">Move from idea to optimized listing in minutes.</h2>
              <p className="mt-5 max-w-lg text-muted-foreground">GigAlly keeps research, writing, imagery, scoring, and export in one connected flow.</p>
              <Button size="lg" className="mt-8" onClick={() => navigate("/auth")}>Start building <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </motion.div>
            <div className="space-y-3">
              {[
                ["01", "Describe your service", "Choose Fiverr or Upwork and tell GigAlly what you offer."],
                ["02", "Research and generate", "AI finds relevant keywords and writes a complete, compliant draft."],
                ["03", "Improve and publish", "Score, refine, preview, create your image, and export."],
              ].map(([number, title, description], index) => (
                <motion.div key={number} {...reveal} transition={{ ...reveal.transition, delay: index * 0.08 }} className="grid grid-cols-[auto_1fr] gap-5 border border-border bg-background/70 p-5 md:p-6">
                  <span className="font-heading text-2xl font-bold text-primary">{number}</span>
                  <div><h3 className="font-heading text-lg font-bold">{title}</h3><p className="mt-1 text-sm text-muted-foreground">{description}</p></div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="proof" className="py-20 md:py-28">
          <div className="container px-4">
            <motion.div {...reveal} className="grid overflow-hidden border border-border bg-card shadow-elevated lg:grid-cols-[1fr_1.15fr]">
              <div className="p-7 md:p-12">
                <div className="flex gap-1 text-secondary">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div>
                <blockquote className="mt-7 font-heading text-2xl font-semibold leading-snug md:text-4xl">“GigAlly turned a rough service idea into a clear, searchable offer I could actually publish.”</blockquote>
                <p className="mt-7 text-sm font-semibold">Maria L. <span className="font-normal text-muted-foreground">• Content writer</span></p>
              </div>
              <div className="grid grid-cols-2 border-t border-border lg:border-l lg:border-t-0">
                {[["10,000+", "gigs created"], ["500+", "active freelancers"], ["92/100", "top SEO score"], ["60 sec", "average first draft"]].map(([value, label]) => (
                  <div key={label} className="flex min-h-36 flex-col justify-center border-b border-r border-border p-6 last:border-b-0">
                    <strong className="font-heading text-3xl text-primary md:text-4xl">{value}</strong><span className="mt-2 text-sm text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="border-y border-border bg-primary py-16 text-primary-foreground md:py-20">
          <motion.div {...reveal} className="container flex flex-col items-start justify-between gap-8 px-4 md:flex-row md:items-center">
            <div><p className="text-sm font-bold uppercase opacity-75">Your next best gig starts here</p><h2 className="mt-3 max-w-3xl font-heading text-4xl font-bold md:text-5xl">Turn what you do well into an offer buyers can find.</h2></div>
            <Button size="lg" variant="secondary" className="shrink-0" onClick={() => navigate("/auth")}>Create free <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </motion.div>
        </section>
      </main>

      <footer className="py-8">
        <div className="container flex flex-col items-center justify-between gap-5 px-4 text-center md:flex-row md:text-left">
          <div className="flex items-center gap-2"><img src={logo} alt="" className="h-7 w-7" loading="lazy" width={28} height={28} /><span className="font-heading font-bold">GigAlly</span></div>
          <p className="text-xs text-muted-foreground">Powered by <a href="https://peaceemmieinnovations.lovable.app" target="_blank" rel="noreferrer" className="font-semibold text-foreground hover:text-primary">Peace Emmie Innovations</a></p>
          <p className="text-xs text-muted-foreground">Designed to support marketplace best practices.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;