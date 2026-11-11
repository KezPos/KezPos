import { AuthPage, Field, Notice, Success, Working } from "@/components/site/auth";
import { pageHead } from "@/components/site/config";
import { SiteShell } from "@/components/site/shell";
import { btn } from "@/components/site/ui";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";

export const Route = createFileRoute("/reset-password")({
  validateSearch: (s: Record<string, unknown>) => ({
    token_hash: typeof s.token_hash === "string" ? s.token_hash : undefined,
  }),
  head: () => {
    const { meta } = pageHead(
      "Reset your password | KezPos",
      "Choose a new password for your KezPos account.",
    );
    return { meta: [...meta, { name: "robots", content: "noindex, nofollow" }] };
  },
  component: ResetPassword,
});

type Phase = "checking" | "form" | "saving" | "done" | "invalid";

function linkProblem(message: string) {
  const m = message.toLowerCase();
  if (m.includes("expired") || m.includes("invalid") || m.includes("used")) {
    return "This reset link has already been used or has expired. Each link works once and only for a short time.";
  }
  if (m.includes("rate limit") || m.includes("too many")) {
    return "Too many attempts. Wait a minute, then open the link again.";
  }
  return "We could not verify this reset link. Ask for a fresh one from the KezPos sign-in screen.";
}

function ResetPassword() {
  const { token_hash } = Route.useSearch();
  const [phase, setPhase] = useState<Phase>(token_hash ? "checking" : "invalid");
  const [problem, setProblem] = useState(
    token_hash ? "" : "This link is missing its token. Open the button in the email again, or request a new link.",
  );
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  // The token in the email is single-use, so verify exactly once.
  useEffect(() => {
    if (!token_hash || started.current) return;
    started.current = true;

    supabase.auth
      .verifyOtp({ type: "recovery", token_hash })
      .then(({ error: verifyError }) => {
        if (verifyError) {
          setProblem(linkProblem(verifyError.message));
          setPhase("invalid");
        } else {
          setPhase("form");
        }
      })
      .catch(() => {
        setProblem("We could not reach the server. Check your connection and open the link again.");
        setPhase("invalid");
      });
  }, [token_hash]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Your password needs at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Both passwords must match.");
      return;
    }

    setPhase("saving");
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setPhase("form");
      setError(
        /weak|6 characters/i.test(updateError.message)
          ? "Your password needs at least 6 characters."
          : "We could not save your new password. Please try again.",
      );
      return;
    }

    // Don't leave a live KezPos session in this browser.
    await supabase.auth.signOut({ scope: "local" }).catch(() => {});
    setPhase("done");
  }

  return (
    <SiteShell>
      <AuthPage eyebrow="Account recovery" title="Choose a new password">
        {phase === "checking" && <Working label="Checking your reset link…" />}

        {phase === "invalid" && (
          <div className="space-y-6">
            <Notice tone="warn">{problem}</Notice>
            <p className="text-sm leading-7 text-muted-foreground">
              Open KezPos, tap <span className="text-foreground">Forgot password?</span> on the sign-in
              screen, and we&apos;ll email you a fresh link.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/install" className={btn.primary}>
                Get KezPos <ArrowRight className="size-4" />
              </Link>
              <Link to="/" className={btn.ghost}>
                Back to home
              </Link>
            </div>
          </div>
        )}

        {(phase === "form" || phase === "saving") && (
          <form onSubmit={submit} className="space-y-5" noValidate>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.15em] text-muted-foreground uppercase hover:text-primary"
              >
                {show ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                {show ? "Hide" : "Show"}
              </button>
            </div>

            <Field
              label="New password"
              id="new-password"
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              autoComplete="new-password"
              disabled={phase === "saving"}
              autoFocus
            />
            <Field
              label="Confirm new password"
              id="confirm-password"
              type={show ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Type it again"
              autoComplete="new-password"
              disabled={phase === "saving"}
            />

            {error && <Notice>{error}</Notice>}

            <button
              type="submit"
              disabled={phase === "saving"}
              className={cn(btn.primary, "w-full disabled:opacity-60 disabled:hover:translate-y-0")}
            >
              {phase === "saving" ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Saving…
                </>
              ) : (
                <>
                  Update password <ArrowRight className="size-4" />
                </>
              )}
            </button>

            <p className="text-xs leading-6 text-muted-foreground">
              Signing in on another device? Use the same email and your new password.
            </p>
          </form>
        )}

{phase === "done" && (
  <div className="space-y-6">
    <Success title="Password updated">You can now sign in to KezPos with your new password.</Success>
    <p className="text-sm leading-7 text-muted-foreground">
      For safety, this browser session has been closed, so you&apos;ll be asked to sign in again on
      every device.
    </p>
    <div className="flex flex-wrap gap-3">
      <a href="kezpos://auth/login" className={btn.primary}>
        Open KezPos <ArrowRight className="size-4" />
      </a>
      <Link to="/" className={btn.ghost}>
        Back to home
      </Link>
    </div>
    <p className="text-xs leading-6 text-muted-foreground">
      Button not opening the app? Make sure KezPos is installed on this phone, or open it yourself and sign in.
    </p>
  </div>
)}
      </AuthPage>
    </SiteShell>
  );
}
