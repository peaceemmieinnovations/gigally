import { Badge } from "@/components/ui/badge";
import { Star, Heart, MapPin, Clock, CheckCircle2 } from "lucide-react";

interface UpworkPreviewProps {
  gig: {
    title: string;
    short_description: string;
    description: string;
    tags: string[];
    pricing_basic: any;
    pricing_standard: any;
    pricing_premium: any;
  };
  generatedImage?: string | null;
}

export const UpworkPreview = ({ gig, generatedImage }: UpworkPreviewProps) => {
  return (
    <div className="space-y-6">
      {/* Project Catalog Card Preview */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">Project Catalog Card</h3>
        <div className="max-w-md rounded-lg border bg-white p-0 shadow-sm dark:bg-zinc-900">
          {/* Project Image */}
          <div className="relative aspect-[16/9] overflow-hidden rounded-t-lg bg-gradient-to-br from-green-500/20 to-emerald-600/20">
            {generatedImage ? (
              <img src={generatedImage} alt="Project" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <span className="text-sm">Project Image</span>
              </div>
            )}
            <button className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow-sm">
              <Heart className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          <div className="p-4">
            {/* Title */}
            <h3 className="mb-2 text-base font-medium text-foreground hover:text-green-600 cursor-pointer line-clamp-2">
              {gig.title || "Professional Service for Your Business"}
            </h3>

            {/* Freelancer Info */}
            <div className="mb-3 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-foreground">Your Name</span>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Star className="h-3 w-3 fill-green-500 text-green-500" />
                  <span>5.0</span>
                  <span className="text-muted-foreground/50">|</span>
                  <span>$50K+ earned</span>
                </div>
              </div>
            </div>

            {/* Price and delivery */}
            <div className="flex items-center justify-between border-t pt-3">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>Delivers in {gig.pricing_basic?.delivery || "7"} days</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-muted-foreground">Starting at</span>
                <div className="text-lg font-bold text-foreground">
                  ${gig.pricing_basic?.price || "100"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Project Page Preview */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">Full Project Page</h3>
        <div className="rounded-lg border bg-white dark:bg-zinc-900 overflow-hidden">
          {/* Top Navigation Bar */}
          <div className="border-b bg-[#14a800]/5 px-6 py-3">
            <div className="flex items-center gap-4 text-sm">
              <span className="font-medium text-green-600">Project Catalog</span>
              <span className="text-muted-foreground">›</span>
              <span className="text-muted-foreground">Development & IT</span>
              <span className="text-muted-foreground">›</span>
              <span className="text-foreground">Web Development</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-0">
            {/* Main Content */}
            <div className="col-span-2 border-r p-6">
              {/* Title */}
              <h1 className="mb-4 text-2xl font-semibold text-foreground">
                {gig.title || "Professional Service for Your Business"}
              </h1>

              {/* Freelancer Card */}
              <div className="mb-6 flex items-start gap-4 rounded-lg border p-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-medium text-foreground">Your Name</span>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Top Rated Plus</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Expert Web Developer & Designer</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-green-500 text-green-500" />
                      <span className="font-medium">5.0</span>
                      <span className="text-muted-foreground">(98 jobs)</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>United States</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gallery */}
              <div className="mb-6 aspect-video rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-600/10 flex items-center justify-center">
                {generatedImage ? (
                  <img src={generatedImage} alt="Project" className="h-full w-full object-contain rounded-lg" />
                ) : (
                  <span className="text-muted-foreground">Project Gallery</span>
                )}
              </div>

              {/* Description Preview */}
              <div className="prose prose-sm max-w-none">
                <h3 className="text-lg font-semibold mb-2">About This Project</h3>
                <p className="text-muted-foreground line-clamp-4">
                  {gig.description || "This is where your full project description will appear. It should be detailed, keyword-rich, and compelling to potential clients."}
                </p>
              </div>

              {/* Skills */}
              <div className="mt-6">
                <h4 className="font-medium mb-2">Skills & Expertise</h4>
                <div className="flex flex-wrap gap-2">
                  {gig.tags?.slice(0, 8).map((tag: string, i: number) => (
                    <Badge key={i} variant="secondary" className="rounded-full">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Pricing Sidebar */}
            <div className="p-6">
              <div className="sticky top-6 space-y-4">
                {/* Package Tabs */}
                <div className="flex rounded-lg border overflow-hidden">
                  <button className="flex-1 py-2 text-sm font-medium bg-green-50 text-green-700 border-b-2 border-green-600">
                    Basic
                  </button>
                  <button className="flex-1 py-2 text-sm text-muted-foreground hover:bg-gray-50">
                    Standard
                  </button>
                  <button className="flex-1 py-2 text-sm text-muted-foreground hover:bg-gray-50">
                    Premium
                  </button>
                </div>

                {/* Package Details */}
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold">${gig.pricing_basic?.price || "100"}</span>
                    <span className="text-sm text-muted-foreground">
                      {gig.pricing_basic?.delivery || "7"} day delivery
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    {gig.short_description || "Basic package includes essential features to get you started."}
                  </p>

                  <div className="space-y-2 mb-4">
                    {gig.pricing_basic?.features?.slice(0, 4).map((f: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>

                  <button className="w-full rounded-lg bg-green-600 py-3 font-medium text-white hover:bg-green-700">
                    Continue (${gig.pricing_basic?.price || "100"})
                  </button>
                </div>

                <button className="w-full rounded-lg border py-3 text-sm font-medium text-foreground hover:bg-gray-50">
                  Contact Freelancer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
