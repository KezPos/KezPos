import { AuthPage, Notice, Success, Working } from "@/components/site/auth";
import { pageHead } from "@/components/site/config";
import { SiteShell } from "@/components/site/shell";
import { btn } from "@/components/site/ui";
import { supabase } from "@/lib/supabase";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const OTP_TYPES = ["signup", "invite", "magiclink", "email_change", "email"] as const;
type OtpType = (typeof OTP_TYPES)[number];
const isOtpType = (value?: string): value is OtpType =>
  !!value && (OTP_TYPES as readonly string[]).includes(value);

const COPY: Record<OtpType, { eyebrow: string; title: string; done: string; body: string }> = {
  signup: {
    eyebrow: "Email confirmation",
    title: "Confirm your email address",
    done: "Email confirmed",
    body: "Your KezPos account is ready. Open the app and sign in with the email and password you chose.",
  },
  invite: {
    eyebrow: "Invitation",
    title: "Accept your invitation",
    done: "Invitation accepted",
    body: "Open KezPos and sign in to finish setting up your access.",
  },
  magiclink: {
    eyebrow: "Sign-in link",
    title: "Confirming your sign-in",
    done: "You're verified",
    body: "Open KezPos and sign in to continue.",
  },
  email_change: {
    eyebrow: "Email update",
    title: "Confirm your new email",
    done: "Email updated",
    body: "Sign in to KezPos with your new email address from now on.",
  },
  email: {
    eyebrow: "Email confirmation",
    title: "Confirm your email address",
    done: "Email confirmed",
    body: "Open KezPos and sign in to continue.",
  },
};

export const Route = createFileRoute("/verify")({
  validateSearch: (s: Record<string, unknown>) => ({
    token_hash: typeof s.token_hash === "string" ? s.token_hash : undefined,
    type: typeof s.type === "string" ? s.type : undefined,
  }),
  // A password-reset link that lands here belongs on the reset page.
  beforeLoad: ({ search }) => {
    if (search.type === "recovery" && search.token_hash) {
      throw redirect({ to: "/reset-password", search: { token_hash: search.token_hash }, replace: true });
    }
  },
  head: () => {
    const { meta } = pageHead("Confirm your email | KezPos", "Confirm the email address on your KezPos account.");
    return { meta: [...meta, { name: "robots", content: "noindex, nofollow" }] };
  },
  component: VerifyEmail,
});

type Phase = "checking" | "done" | "invalid";

function problemText(message: string) {
  const m = message.toLowerCase();
  if (m.includes("expired") || m.includes("invalid") || m.includes("used")) {
    return "This confirmation link has already been used or has expired. Each link works once and only for a short time.";
  }
  if (m.includes("rate limit") || m.includes("too many")) {
    return "Too many attempts. Wait a minute, then open the link again.";
  }
  return "We could not confirm this link. Open KezPos and tap “Resend confirmation email” on the sign-in screen.";
}

function VerifyEmail() {
  const { token_hash, type } = Route.useSearch();
  const otpType: OtpType = isOtpType(type) ? type : "signup";
  const copy = COPY[otpType];
  const [phase, setPhase] = useState<Phase>(token_hash ? "checking" : "invalid");
  const [problem, setProblem] = useState(
    token_hash ? "" : "This link is missing its token. Open the button in the email again, or resend the email from the app.",
  );
  const started = useRef(false);

  useEffect(() => {
    if (!token_hash || started.current) return;
    started.current = true;

    supabase.auth
      .verifyOtp({ type: otpType, token_hash })
      .then(async ({ error }) => {
        if (error) {
          setProblem(problemText(error.message));
          setPhase("invalid");
          return;
        }
        // Confirmation is done — don't keep a signed-in session in the browser.
        await supabase.auth.signOut({ scope: "local" }).catch(() => {});
        setPhase("done");
      })
      .catch(() => {
        setProblem("We could not reach the server. Check your connection and open the link again.");
        setPhase("invalid");
      });
  }, [token_hash, otpType]);

  return (
    <SiteShell>
      <AuthPage eyebrow={copy.eyebrow} title={copy.title}>
        {phase === "checking" && <Working label="Confirming your link…" />}

{phase === "done" && (
  <div className="space-y-6">
    <Success title={copy.done}>{copy.body}</Success>
    <div className="flex flex-wrap gap-3">
      <a href="kezpos://auth/verified" className={btn.primary}>
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

        {phase === "invalid" && (
          <div className="space-y-6">
            <Notice tone="warn">{problem}</Notice>
            <p className="text-sm leading-7 text-muted-foreground">
              Open KezPos and sign in. If it still asks you to confirm, tap{" "}
              <span className="text-foreground">Resend confirmation email</span> and use the newest link.
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
      </AuthPage>
    </SiteShell>
  );
}
