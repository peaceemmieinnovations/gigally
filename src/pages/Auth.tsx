import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 text-3xl font-bold">
            <Sparkles className="h-8 w-8 text-primary" />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              GigAlly
            </span>
          </div>
          <p className="text-muted-foreground">
            Sign in to start creating winning gigs
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-8 shadow-xl">
          <SupabaseAuth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: "hsl(210 98% 50%)",
                    brandAccent: "hsl(29 100% 50%)",
                  },
                },
              },
              className: {
                button: "!bg-gradient-to-r !from-primary !to-secondary hover:opacity-90",
              },
            }}
            providers={["google"]}
            redirectTo={`${window.location.origin}/dashboard`}
          />
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          By signing in, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
};

export default Auth;