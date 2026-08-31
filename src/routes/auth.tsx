"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AuthPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[AuthPage] handleSendOtp: Submitting email for OTP:", email);
    setBusy(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      console.log(
        "[AuthPage] handleSendOtp: Response status:",
        response.status
      );

      const data = await response.json();
      console.log("[AuthPage] handleSendOtp: Response data:", data);

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Admin not found or failed to send OTP");
      }

      toast.success("OTP sent to your email.");
      console.log(
        "[AuthPage] handleSendOtp: OTP sent successfully, changing step to 'otp'"
      );
      setStep("otp");
    } catch (error) {
      console.error("[AuthPage] handleSendOtp: Error caught:", error);
      const msg = error instanceof Error ? error.message : "Admin not found";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[AuthPage] handleVerifyOtp: Verifying OTP for email:", email);
    setBusy(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      console.log(
        "[AuthPage] handleVerifyOtp: Response status:",
        response.status
      );

      const data = await response.json();
      console.log("[AuthPage] handleVerifyOtp: Response data:", data);

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Invalid or expired OTP");
      }

      // Save the session data to localStorage
      if (data.session) {
        console.log(
          "[AuthPage] handleVerifyOtp: Saving session data to localStorage:",
          data.session
        );
        localStorage.setItem("admin_session", JSON.stringify(data.session));
      } else {
        console.warn(
          "[AuthPage] handleVerifyOtp: Warning - success was true, but no session data returned from API."
        );
      }

      toast.success("Signed in successfully.");
      console.log("[AuthPage] handleVerifyOtp: Redirecting to /admin...");
      router.push("/admin");
      router.refresh();
    } catch (error) {
      console.error("[AuthPage] handleVerifyOtp: Error caught:", error);
      const msg =
        error instanceof Error ? error.message : "Verification failed";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  console.log(
    "[AuthPage] Render state: Current step is:",
    step,
    "| Busy:",
    busy
  );

  return (
    <section className="section-y">
      <div className="container-page flex justify-center">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-card">
          <h1 className="font-display text-2xl font-bold">Staff Login</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {step === "email"
              ? "Enter your authorized admin email to receive a secure login code."
              : `Enter the 6-digit code sent to ${email}`}
          </p>

          {errorMessage && (
            <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs font-medium text-destructive">
              {errorMessage}
            </div>
          )}

          {step === "email" ? (
            <form onSubmit={handleSendOtp} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  autoComplete="email"
                />
              </div>
              <Button
                type="submit"
                className="h-11 w-full rounded-full"
                disabled={busy}
              >
                {busy ? "Checking & Sending..." : "Send Login Code"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  type="text"
                  maxLength={6}
                  required
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                className="h-11 w-full rounded-full"
                disabled={busy}
              >
                {busy ? "Verifying..." : "Verify & Sign In"}
              </Button>
              <button
                type="button"
                className="w-full text-center text-sm text-muted-foreground underline hover:text-foreground"
                onClick={() => {
                  console.log("[AuthPage] Switching back to email step.");
                  setStep("email");
                  setErrorMessage(null);
                }}
              >
                Use a different email
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
