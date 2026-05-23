import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Sparkles, Loader2, Copy, Plus, Trash2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Recipient { name: string; email?: string; context?: string; }
interface GeneratedMsg { recipientName: string; recipientEmail?: string; message: string; subjectLine?: string; }

const Outreach = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [niche, setNiche] = useState("");
  const [platform, setPlatform] = useState("fiverr");
  const [tone, setTone] = useState("friendly professional");
  const [baseMessage, setBaseMessage] = useState("");
  const [recipients, setRecipients] = useState<Recipient[]>([{ name: "", email: "", context: "" }]);
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState<GeneratedMsg[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/auth");
      else loadCampaigns();
    });
  }, [navigate]);

  const loadCampaigns = async () => {
    const { data } = await supabase.from("outreach_campaigns").select("*").order("created_at", { ascending: false }).limit(10);
    setCampaigns(data || []);
  };

  const addRecipient = () => setRecipients((r) => [...r, { name: "", email: "", context: "" }]);
  const removeRecipient = (i: number) => setRecipients((r) => r.filter((_, idx) => idx !== i));
  const updateRecipient = (i: number, field: keyof Recipient, value: string) =>
    setRecipients((r) => r.map((x, idx) => (idx === i ? { ...x, [field]: value } : x)));

  const generate = async () => {
    const valid = recipients.filter((r) => r.name.trim());
    if (!baseMessage.trim() || valid.length === 0) {
      toast({ title: "Missing info", description: "Add a base message and at least one named recipient", variant: "destructive" });
      return;
    }
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-outreach", {
        body: { baseMessage, recipients: valid, niche, platform, tone },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      setResults(data.messages || []);
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user && name.trim()) {
        await supabase.from("outreach_campaigns").insert({
          user_id: session.user.id, name: name.trim(), niche, platform, base_message: baseMessage,
          recipients: data.messages,
        });
        loadCampaigns();
      }
      toast({ title: "Generated!", description: `${data.messages?.length || 0} personalized messages` });
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Failed", variant: "destructive" });
    } finally { setGenerating(false); }
  };

  const copyMsg = (m: string) => { navigator.clipboard.writeText(m); toast({ title: "Copied!" }); };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b glass">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
          </Button>
          <span className="font-bold gradient-text">Outreach AI</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Personalized DM Generator</h1>
            <p className="text-sm text-muted-foreground">Same pitch, unique message per recipient. Built to convert.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Inputs */}
            <Card className="p-5 shadow-card space-y-4">
              <div>
                <Label className="text-xs">Campaign Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="E.g. Bakery cold outreach" className="mt-1.5" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Niche</Label>
                  <Input value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="e.g. local bakeries" className="mt-1.5" />
                </div>
                <div>
                  <Label className="text-xs">Platform</Label>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fiverr">Fiverr</SelectItem>
                      <SelectItem value="upwork">Upwork</SelectItem>
                      <SelectItem value="email">Cold Email</SelectItem>
                      <SelectItem value="instagram">Instagram DM</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-xs">Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="friendly professional">Friendly Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Your Pitch / Base Message</Label>
                <Textarea value={baseMessage} onChange={(e) => setBaseMessage(e.target.value)}
                  placeholder="The core offer & value prop. AI will rewrite uniquely per recipient." className="mt-1.5 min-h-[120px]" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs">Recipients ({recipients.length})</Label>
                  <Button size="sm" variant="outline" onClick={addRecipient}><Plus className="h-3.5 w-3.5 mr-1" /> Add</Button>
                </div>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {recipients.map((r, i) => (
                    <div key={i} className="border rounded-lg p-3 space-y-2 bg-muted/30">
                      <div className="flex gap-2">
                        <Input value={r.name} onChange={(e) => updateRecipient(i, "name", e.target.value)} placeholder="Name" className="h-8 text-sm" />
                        <Input value={r.email || ""} onChange={(e) => updateRecipient(i, "email", e.target.value)} placeholder="Email (optional)" className="h-8 text-sm" />
                        <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0 text-destructive" onClick={() => removeRecipient(i)}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                      <Input value={r.context || ""} onChange={(e) => updateRecipient(i, "context", e.target.value)} placeholder="Personal hook: business, niche, pain point..." className="h-8 text-sm" />
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={generate} disabled={generating} className="w-full gradient-btn text-primary-foreground" size="lg">
                {generating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : <><Sparkles className="mr-2 h-4 w-4" /> Generate Personalized DMs</>}
              </Button>
            </Card>

            {/* Results */}
            <Card className="p-5 shadow-card">
              <h2 className="font-semibold mb-3 flex items-center gap-2"><Send className="h-4 w-4 text-primary" /> Generated Messages</h2>
              {results.length === 0 ? (
                <div className="text-sm text-muted-foreground py-12 text-center">
                  Generated messages appear here — each unique, tied to that recipient's context.
                </div>
              ) : (
                <div className="space-y-3 max-h-[700px] overflow-y-auto">
                  {results.map((m, i) => (
                    <div key={i} className="border rounded-lg p-3 bg-muted/20">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="text-sm font-semibold">{m.recipientName}</div>
                          {m.recipientEmail && <div className="text-xs text-muted-foreground">{m.recipientEmail}</div>}
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => copyMsg(m.message)}><Copy className="h-3.5 w-3.5" /></Button>
                      </div>
                      {m.subjectLine && <div className="text-xs font-medium mb-1.5">Subject: {m.subjectLine}</div>}
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{m.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {campaigns.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-bold mb-3">Recent Campaigns</h2>
              <div className="grid gap-2">
                {campaigns.map((c) => (
                  <Card key={c.id} className="p-3 cursor-pointer hover:shadow-elevated transition-shadow shadow-card" onClick={() => setResults(c.recipients || [])}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-sm">{c.name}</div>
                        <div className="text-xs text-muted-foreground">{c.platform} · {c.niche || "—"} · {(c.recipients || []).length} messages</div>
                      </div>
                      <span className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Outreach;