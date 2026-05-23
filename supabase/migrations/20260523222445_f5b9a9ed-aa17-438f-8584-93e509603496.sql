
-- Outreach campaigns: per-user personalized DM batches
CREATE TABLE public.outreach_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  niche TEXT,
  platform TEXT NOT NULL DEFAULT 'fiverr',
  base_message TEXT NOT NULL,
  recipients JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.outreach_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own campaigns" ON public.outreach_campaigns
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own campaigns" ON public.outreach_campaigns
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own campaigns" ON public.outreach_campaigns
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own campaigns" ON public.outreach_campaigns
  FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins view all campaigns" ON public.outreach_campaigns
  FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER outreach_campaigns_updated
  BEFORE UPDATE ON public.outreach_campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Prompt bank: admin-managed AI prompts
CREATE TABLE public.prompt_bank (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.prompt_bank ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authed reads active prompts" ON public.prompt_bank
  FOR SELECT TO authenticated USING (active = true OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage prompts insert" ON public.prompt_bank
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage prompts update" ON public.prompt_bank
  FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage prompts delete" ON public.prompt_bank
  FOR DELETE USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER prompt_bank_updated
  BEFORE UPDATE ON public.prompt_bank
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Message bank: admin-managed outreach templates
CREATE TABLE public.message_bank (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  niche TEXT,
  platform TEXT NOT NULL DEFAULT 'fiverr',
  template TEXT NOT NULL,
  tone TEXT NOT NULL DEFAULT 'professional',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.message_bank ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authed reads active messages" ON public.message_bank
  FOR SELECT TO authenticated USING (active = true OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage messages insert" ON public.message_bank
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage messages update" ON public.message_bank
  FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage messages delete" ON public.message_bank
  FOR DELETE USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER message_bank_updated
  BEFORE UPDATE ON public.message_bank
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
