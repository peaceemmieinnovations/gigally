import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Loader2, Plus, Trash2, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [prompts, setPrompts] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newPrompt, setNewPrompt] = useState({ name: "", category: "gig", content: "" });
  const [newMessage, setNewMessage] = useState({ name: "", niche: "", platform: "fiverr", template: "", tone: "professional" });

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth"); return; }
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id);
      const admin = (roles || []).some((r: any) => r.role === "admin");
      setIsAdmin(admin);
      if (admin) await loadAll();
      setLoading(false);
    })();
  }, [navigate]);

  const loadAll = async () => {
    const [p, m] = await Promise.all([
      supabase.from("prompt_bank").select("*").order("created_at", { ascending: false }),
      supabase.from("message_bank").select("*").order("created_at", { ascending: false }),
    ]);
    setPrompts(p.data || []);
    setMessages(m.data || []);
  };

  const addPrompt = async () => {
    if (!newPrompt.name || !newPrompt.content) return;
    const { error } = await supabase.from("prompt_bank").insert(newPrompt);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { setNewPrompt({ name: "", category: "gig", content: "" }); loadAll(); toast({ title: "Prompt added" }); }
  };
  const delPrompt = async (id: string) => { await supabase.from("prompt_bank").delete().eq("id", id); loadAll(); };

  const addMessage = async () => {
    if (!newMessage.name || !newMessage.template) return;
    const { error } = await supabase.from("message_bank").insert(newMessage);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { setNewMessage({ name: "", niche: "", platform: "fiverr", template: "", tone: "professional" }); loadAll(); toast({ title: "Message added" }); }
  };
  const delMessage = async (id: string) => { await supabase.from("message_bank").delete().eq("id", id); loadAll(); };

  if (loading) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md shadow-elevated">
          <ShieldAlert className="h-12 w-12 text-destructive mx-auto mb-3" />
          <h2 className="text-xl font-bold mb-2">Admin Access Required</h2>
          <p className="text-sm text-muted-foreground mb-4">Your account doesn't have admin privileges.</p>
          <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b glass">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}><ArrowLeft className="mr-1.5 h-4 w-4" /> Back</Button>
          <span className="font-bold gradient-text">Admin Panel</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-10 max-w-5xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">System Management</h1>

        <Tabs defaultValue="prompts">
          <TabsList>
            <TabsTrigger value="prompts">Prompt Bank ({prompts.length})</TabsTrigger>
            <TabsTrigger value="messages">Message Bank ({messages.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="prompts" className="space-y-4">
            <Card className="p-5 shadow-card space-y-3">
              <h3 className="font-semibold">Add New Prompt</h3>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs">Name</Label><Input value={newPrompt.name} onChange={(e) => setNewPrompt({ ...newPrompt, name: e.target.value })} className="mt-1.5" /></div>
                <div><Label className="text-xs">Category</Label><Input value={newPrompt.category} onChange={(e) => setNewPrompt({ ...newPrompt, category: e.target.value })} className="mt-1.5" /></div>
              </div>
              <div><Label className="text-xs">Content</Label><Textarea value={newPrompt.content} onChange={(e) => setNewPrompt({ ...newPrompt, content: e.target.value })} className="mt-1.5 min-h-[100px]" /></div>
              <Button onClick={addPrompt} className="gradient-btn text-primary-foreground"><Plus className="h-4 w-4 mr-1.5" /> Add Prompt</Button>
            </Card>
            {prompts.map((p) => (
              <Card key={p.id} className="p-4 shadow-card">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{p.name} <span className="text-xs text-muted-foreground">· {p.category}</span></div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-3">{p.content}</p>
                  </div>
                  <Button size="icon" variant="ghost" className="text-destructive h-8 w-8" onClick={() => delPrompt(p.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <Card className="p-5 shadow-card space-y-3">
              <h3 className="font-semibold">Add New Message Template</h3>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs">Name</Label><Input value={newMessage.name} onChange={(e) => setNewMessage({ ...newMessage, name: e.target.value })} className="mt-1.5" /></div>
                <div><Label className="text-xs">Niche</Label><Input value={newMessage.niche} onChange={(e) => setNewMessage({ ...newMessage, niche: e.target.value })} className="mt-1.5" /></div>
                <div><Label className="text-xs">Platform</Label><Input value={newMessage.platform} onChange={(e) => setNewMessage({ ...newMessage, platform: e.target.value })} className="mt-1.5" /></div>
                <div><Label className="text-xs">Tone</Label><Input value={newMessage.tone} onChange={(e) => setNewMessage({ ...newMessage, tone: e.target.value })} className="mt-1.5" /></div>
              </div>
              <div><Label className="text-xs">Template</Label><Textarea value={newMessage.template} onChange={(e) => setNewMessage({ ...newMessage, template: e.target.value })} className="mt-1.5 min-h-[100px]" /></div>
              <Button onClick={addMessage} className="gradient-btn text-primary-foreground"><Plus className="h-4 w-4 mr-1.5" /> Add Template</Button>
            </Card>
            {messages.map((m) => (
              <Card key={m.id} className="p-4 shadow-card">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{m.name} <span className="text-xs text-muted-foreground">· {m.platform} · {m.niche || "any"}</span></div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-3">{m.template}</p>
                  </div>
                  <Button size="icon" variant="ghost" className="text-destructive h-8 w-8" onClick={() => delMessage(m.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;