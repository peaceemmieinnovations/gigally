import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Sparkles, CheckCircle2, AlertTriangle, Loader2, XCircle } from "lucide-react";

type Status = "verifying" | "ready" | "invalid" | "success" | "error";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>("verifying");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Detect link errors passed in the URL hash (e.g. otp_expired, access_denied)
    const hash = window.location.hash.startsWith("#")
      ? window.location.hash.slice(1)
      : window.location.hash;
    const hashParams = new URLSearchParams(hash);
    const search = new URLSearchParams(window.location.search);

    const linkError =
      hashParams.get("error_description") ||
      hashParams.get("error") ||
      search.get("error_description") ||
      search.get("error");

    if (linkError) {
      setStatus("invalid");
      setErrorMsg(decodeURIComponent(linkError).replace(/\+/g, " "));
      return;
    }

    // Supabase fires PASSWORD_RECOVERY when landing from a valid recovery link
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setStatus("ready");
    });

    if (hashParams.get("type") === "recovery") {
      setStatus("ready");
    } else {
      // No recovery hash — check if user is just already signed in
      supabase.auth.getSession().then(({ data: { session } }) => {
        setTimeout(() => {
          setStatus((cur) => {
            if (cur === "verifying") {
              if (session) {
                navigate("/dashboard");
                return cur;
              }
              return "invalid";
            }
            return cur;
          });
        }, 600);
      });
    }

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    if (password !== confirm) return toast.error("Passwords do not match");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
      toast.error(error.message);
      return;
    }
    setStatus("success");
    toast.success("Password updated");
  };

  const isReady = status === "ready" || status === "error";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="mb-3 inline-flex items-center gap-2">
            <div className="rounded-lg bg-gradient-to-r from-primary to-secondary p-2">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold gradient-text">GigAlly</span>
          </div>
          <h1 className="text-xl font-semibold">
            {status === "success" ? "Password updated" : "Set a new password"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {status === "verifying" && "Verifying your reset link..."}
            {status === "ready" && "Choose a strong new password below."}
            {status === "error" && "We couldn't update your password. Try again below."}
            {status === "invalid" && "This reset link isn't valid anymore."}
            {status === "success" && "You can now sign in with your new password."}
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-card space-y-4">
          {status === "verifying" && (
            <div className="flex items-center gap-3 text-sm text-muted-foreground py-6 justify-center">
              <Loader2 className="h-4 w-4 animate-spin" />
              Checking your reset link...
            </div>
          )}

          {status === "invalid" && (
            <>
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Link invalid or expired</AlertTitle>
                <AlertDescription>
                  {errorMsg ||
                    "Password reset links expire after a short time and can only be used once. Please request a new one."}
                </AlertDescription>
              </Alert>
              <Button asChild className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                <Link to="/auth">Request a new reset link</Link>
              </Button>
            </>
          )}

          {status === "success" && (
            <>
              <Alert className="border-green-500/40 bg-green-500/10 text-foreground">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle>Password updated</AlertTitle>
                <AlertDescription>
                  Your password has been changed. You can head to your dashboard or sign in again with your
                  new password.
                </AlertDescription>
              </Alert>
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => navigate("/dashboard")}
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                >
                  Go to dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    navigate("/auth");
                  }}
                  className="w-full"
                >
                  Sign out and log in again
                </Button>
              </div>
            </>
          )}

          {isReady && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {status === "error" && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertTitle>Update failed</AlertTitle>
                  <AlertDescription>{errorMsg}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="password">New password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm password</Label>
                <Input
                  id="confirm"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  disabled={loading}
                  required
                  minLength={6}
                  placeholder="Re-enter your new password"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update password"
                )}
              </Button>
            </form>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          <Link to="/auth" className="underline hover:text-foreground">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;