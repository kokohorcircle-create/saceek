"use client";

import { useState } from "react";
import { CheckCircle2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { COMPANY } from "@/lib/site-data";

const ENQUIRY_TYPES = [
  "Product Enquiry",
  "Wholesale / Distribution",
  "Retail Supply",
  "Partnership",
  "General Enquiry",
];

type Fields = {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  enquiryType: string;
  message: string;
};

const EMPTY: Fields = {
  fullName: "",
  email: "",
  phone: "",
  subject: "",
  enquiryType: "",
  message: "",
};

function validate(values: Fields) {
  const errors: Partial<Record<keyof Fields, string>> = {};
  if (values.fullName.trim().length < 2)
    errors.fullName = "Please enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()))
    errors.email = "Please enter a valid email address.";
  if (values.phone.replace(/\D/g, "").length < 7)
    errors.phone = "Please enter a valid phone number.";
  if (values.subject.trim().length < 3)
    errors.subject = "Please enter a subject.";
  if (!values.enquiryType)
    errors.enquiryType = "Please select an enquiry type.";
  if (values.message.trim().length < 10)
    errors.message = "Please tell us a little more (at least 10 characters).";
  return errors;
}

export function ContactForm() {
  const [values, setValues] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>(
    {}
  );
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const set = (key: keyof Fields) => (value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    setSendError(null);

    if (Object.keys(found).length > 0) {
      setSent(false);
      return;
    }

    setSending(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.fullName.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          subject: values.subject.trim(),
          inquiryType: values.enquiryType,
          message: values.message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to submit");
      }

      setSent(true);
      setValues(EMPTY);
    } catch (err) {
      console.error(err);
      setSendError("We could not send your message just now.");
      setSent(false);
    } finally {
      setSending(false);
    }
  }

  const fieldError = (key: keyof Fields) =>
    errors[key] ? (
      <p
        id={`${key}-error`}
        role="alert"
        className="mt-1.5 text-xs font-medium text-destructive"
      >
        {errors[key]}
      </p>
    ) : null;

  const inputProps = (key: keyof Fields) => ({
    id: key,
    value: values[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      set(key)(e.target.value),
    "aria-invalid": Boolean(errors[key]),
    "aria-describedby": errors[key] ? `${key}-error` : undefined,
  });

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-card md:p-8">
      <h2 className="text-2xl font-bold">Send an Enquiry</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Fill in the form and our team will receive your enquiry straight away.
        You can also email us directly at{" "}
        <a
          href={`mailto:${COMPANY.email}`}
          className="font-medium text-primary hover:underline"
        >
          {COMPANY.email}
        </a>{" "}
        .
      </p>

      <form
        onSubmit={onSubmit}
        noValidate
        className="mt-6 grid gap-5 sm:grid-cols-2"
      >
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            className="mt-1.5 h-11"
            autoComplete="name"
            {...inputProps("fullName")}
          />
          {fieldError("fullName")}
        </div>
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            className="mt-1.5 h-11"
            type="email"
            autoComplete="email"
            {...inputProps("email")}
          />
          {fieldError("email")}
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            className="mt-1.5 h-11"
            type="tel"
            autoComplete="tel"
            {...inputProps("phone")}
          />
          {fieldError("phone")}
        </div>
        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input className="mt-1.5 h-11" {...inputProps("subject")} />
          {fieldError("subject")}
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="enquiryType">Enquiry Type</Label>
          <select
            id="enquiryType"
            value={values.enquiryType}
            onChange={(e) => set("enquiryType")(e.target.value)}
            aria-invalid={Boolean(errors.enquiryType)}
            aria-describedby={
              errors.enquiryType ? "enquiryType-error" : undefined
            }
            className="mt-1.5 h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
          >
            <option value="">Select an option…</option>
            {ENQUIRY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {fieldError("enquiryType")}
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="message">Message</Label>
          <Textarea rows={5} className="mt-1.5" {...inputProps("message")} />
          {fieldError("message")}
        </div>
        <div className="sm:col-span-2">
          <Button
            type="submit"
            size="lg"
            disabled={sending}
            className="h-12 w-full rounded-full text-base sm:w-auto"
          >
            <Mail className="mr-1 h-4 w-4" aria-hidden="true" />
            {sending ? "Sending…" : "Send Message"}
          </Button>
        </div>
      </form>

      <div aria-live="polite">
        {Object.keys(errors).length > 0 ? (
          <p className="mt-4 rounded-lg bg-accent-soft px-4 py-3 text-sm text-destructive">
            Please correct the highlighted fields and try again.
          </p>
        ) : null}
        {sendError ? (
          <p className="mt-4 rounded-lg bg-accent-soft px-4 py-3 text-sm text-destructive">
            {sendError} You can call{" "}
            <a
              href={`tel:${COMPANY.salesPhone}`}
              className="font-semibold underline"
            >
              {COMPANY.salesPhone}
            </a>{" "}
            .
          </p>
        ) : null}
        {sent ? (
          <div className="mt-4 flex items-start gap-2.5 rounded-lg bg-primary-soft px-4 py-3 text-sm text-primary">
            <CheckCircle2
              className="mt-0.5 h-4 w-4 shrink-0"
              aria-hidden="true"
            />
            <span>
              Thank you — your message has reached our team and we will get back
              to you. For anything urgent, call{" "}
              <a
                href={`tel:${COMPANY.salesPhone}`}
                className="font-semibold underline"
              >
                {COMPANY.salesPhone}
              </a>{" "}
              .
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
