import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

// Pin auth redirects to the published domain so password reset emails
// never route back to a gated preview URL.
const APP_ORIGIN = "https://gigally.lovable.app";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/dashboard");
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) navigate("/dashboard");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-secondary/8 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="mb-3 inline-flex items-center gap-2">
            <div className="rounded-lg bg-gradient-to-r from-primary to-secondary p-2">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold gradient-text">GigAlly</span>
          </div>
          <p className="text-sm text-muted-foreground">Sign in to start creating winning gigs</p>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-card">
          <SupabaseAuth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: { default: { colors: { brand: "hsl(210 98% 50%)", brandAccent: "hsl(29 100% 50%)" } } },
              className: { button: "!bg-gradient-to-r !from-primary !to-secondary hover:opacity-90" },
            }}
            providers={["google"]}
            redirectTo={`${APP_ORIGIN}/reset-password`}
          />
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">By signing in, you agree to our Terms of Service</p>
      </div>
    </div>
  );
};

export default Auth;
