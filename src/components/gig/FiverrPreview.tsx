import { Badge } from "@/components/ui/badge";
import { Star, Heart, Clock, RefreshCw, Check } from "lucide-react";

interface FiverrPreviewProps {
  gig: {
    title: string;
    short_description: string;
    tags: string[];
    pricing_basic: any;
    pricing_standard: any;
    pricing_premium: any;
  };
  generatedImage?: string | null;
}

export const FiverrPreview = ({ gig, generatedImage }: FiverrPreviewProps) => {
  return (
    <div className="space-y-6">
      {/* Search Result Card Preview */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">Search Result Preview</h3>
        <div className="max-w-sm rounded-lg border bg-white p-0 shadow-sm dark:bg-zinc-900">
          {/* Gig Image */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg bg-gradient-to-br from-primary/20 to-secondary/20">
            {generatedImage ? (
              <img src={generatedImage} alt="Gig" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <span className="text-sm">Gig Image</span>
              </div>
            )}
            <button className="absolute right-2 top-2 rounded-full bg-white/90 p-2 shadow-sm">
              <Heart className="h-4 w-4 text-gray-600" />
            </button>
          </div>
          
          {/* Seller Info */}
          <div className="border-b p-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary" />
              <div>
                <span className="text-sm font-medium text-foreground">your_username</span>
                <div className="flex items-center gap-1">
                  <Badge variant="secondary" className="h-4 px-1 text-[10px]">Level 2</Badge>
                </div>
              </div>
            </div>
          </div>
          
          {/* Gig Title */}
          <div className="p-3">
            <p className="line-clamp-2 text-sm font-medium leading-snug text-foreground hover:text-primary hover:underline cursor-pointer">
              {gig.title || "I will create your amazing service"}
            </p>
          </div>
          
          {/* Rating & Reviews */}
          <div className="flex items-center gap-1 px-3 pb-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-bold text-foreground">5.0</span>
            <span className="text-sm text-muted-foreground">(127)</span>
          </div>
          
          {/* Price */}
          <div className="border-t px-3 py-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Starting at</span>
              <span className="text-lg font-bold text-foreground">
                ${gig.pricing_basic?.price || "25"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Full Gig Page Preview */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">Full Gig Page Preview</h3>
        <div className="rounded-lg border bg-white dark:bg-zinc-900 overflow-hidden">
          {/* Header with breadcrumb */}
          <div className="border-b bg-gray-50 dark:bg-zinc-800 px-4 py-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Graphics & Design</span>
              <span>›</span>
              <span>Logo Design</span>
              <span>›</span>
              <span className="text-foreground">Minimalist Logo</span>
            </div>
          </div>

          <div className="p-6">
            {/* Title */}
            <h1 className="mb-4 text-xl font-bold text-foreground">
              {gig.title || "I will create your amazing service"}
            </h1>

            {/* Seller bar */}
            <div className="mb-4 flex items-center gap-3 border-b pb-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">your_username</span>
                  <Badge variant="secondary" className="text-xs">Top Rated Seller</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    <span>5.0</span>
                    <span>(127 reviews)</span>
                  </div>
                  <span>•</span>
                  <span>2 Orders in Queue</span>
                </div>
              </div>
            </div>

            {/* Gallery placeholder */}
            <div className="mb-6 aspect-video rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
              {generatedImage ? (
                <img src={generatedImage} alt="Gig" className="h-full w-full object-contain rounded-lg" />
              ) : (
                <span className="text-muted-foreground">Gig Gallery Images</span>
              )}
            </div>

            {/* Pricing packages */}
            <div className="grid grid-cols-3 gap-0 rounded-lg border overflow-hidden mb-6">
              {[
                { name: "Basic", data: gig.pricing_basic },
                { name: "Standard", data: gig.pricing_standard, featured: true },
                { name: "Premium", data: gig.pricing_premium },
              ].map((tier) => (
                <div key={tier.name} className={`p-4 ${tier.featured ? "bg-primary/5 border-x" : ""}`}>
                  <div className="text-center border-b pb-3 mb-3">
                    <span className="font-semibold text-foreground">{tier.name}</span>
                    <div className="text-2xl font-bold text-foreground mt-1">
                      ${tier.data?.price || "XX"}
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{tier.data?.delivery || "X"} Days Delivery</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <RefreshCw className="h-4 w-4" />
                      <span>{tier.data?.revisions || "X"} Revisions</span>
                    </div>
                    {tier.data?.features?.slice(0, 3).map((f: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-foreground">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-xs">{f}</span>
                      </div>
                    ))}
                  </div>
                  <button className={`mt-4 w-full rounded py-2 text-sm font-medium ${tier.featured ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                    Continue (${tier.data?.price || "XX"})
                  </button>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {gig.tags?.slice(0, 5).map((tag: string, i: number) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
