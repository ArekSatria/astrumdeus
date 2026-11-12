"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { mockGlobalSettings } from "@/lib/api/mock-data";
import { CheckCircle2 } from "lucide-react";

type GlobalSettingsData = typeof mockGlobalSettings;
type InquiryCategory = "SPONSORSHIP" | "TOURNAMENT" | "GENERAL";

interface ContactViewProps {
  contactEmail?: string;
  settings?: GlobalSettingsData;
  data?: GlobalSettingsData;
}

interface FormState {
  fullName: string;
  companyName: string;
  email: string;
  inquiryType: InquiryCategory;
  message: string;
}

interface FormErrors {
  fullName?: string;
  companyName?: string;
  email?: string;
  message?: string;
}

export function ContactView({
  contactEmail,
  settings,
  data,
}: ContactViewProps) {
  const { t } = useLanguage();

  const activeSettings = settings ?? data ?? mockGlobalSettings;
  const resolvedEmail =
    contactEmail ??
    activeSettings.contactQuick.partnershipEmail ??
    activeSettings.contactQuick.businessEmail;

  const [formData, setFormData] = useState<FormState>({
    fullName: "",
    companyName: "",
    email: "",
    inquiryType: "SPONSORSHIP",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = (): boolean => {
    const nextErrors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (formData.fullName.trim().length < 3) {
      nextErrors.fullName = t.contactPage.validationErrors.fullName;
    }
    if (formData.companyName.trim().length < 2) {
      nextErrors.companyName = t.contactPage.validationErrors.companyName;
    }
    if (!emailRegex.test(formData.email.trim())) {
      nextErrors.email = t.contactPage.validationErrors.email;
    }
    if (formData.message.trim().length < 20) {
      nextErrors.message = t.contactPage.validationErrors.message;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    // Simulasi pengiriman form / pengalihan ke penampung email
    window.setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 600);
  };

  const handleReset = () => {
    setFormData({
      fullName: "",
      companyName: "",
      email: "",
      inquiryType: "SPONSORSHIP",
      message: "",
    });
    setErrors({});
    setIsSuccess(false);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
      {/* Header Halaman */}
      <div className="border-b border-white/10 pb-8 text-center sm:text-left">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground uppercase sm:text-5xl">
          {t.contactPage.title}
        </h1>
        <p className="mt-3 font-mono text-sm tracking-widest text-brand uppercase">
          {resolvedEmail}
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-surface/70 p-6 sm:p-10">
        <div className="mb-8 border-b border-white/10 pb-6">
          <h2 className="font-display text-xl font-bold tracking-wide text-foreground uppercase sm:text-2xl">
            {t.contactPage.formHeading}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            {t.contactPage.responseSla}
          </p>
        </div>

        {/* Pesan Sukses (Inline, tanpa Pop-Up) */}
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center space-y-6 py-10 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand/10 text-brand">
              <CheckCircle2 size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="font-display text-2xl font-bold text-foreground uppercase">
                {t.contactPage.successTitle}
              </h3>
              <p className="max-w-md text-sm leading-relaxed text-slate-400">
                {t.contactPage.successDesc}
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="mt-4 inline-flex items-center justify-center rounded-lg bg-brand px-6 py-3 text-xs font-bold tracking-wider text-background uppercase transition-opacity hover:opacity-90"
            >
              {t.contactPage.sendAnotherBtn}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="fullName"
                  className="block text-xs font-bold tracking-wider text-slate-300 uppercase"
                >
                  {t.contactPage.fullNameLabel}
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  placeholder={t.contactPage.fullNamePlaceholder}
                  className="w-full rounded-lg border border-white/10 bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-slate-500 focus:border-brand focus:outline-none"
                />
                {errors.fullName && (
                  <p className="text-xs font-medium text-rose-400">
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="companyName"
                  className="block text-xs font-bold tracking-wider text-slate-300 uppercase"
                >
                  {t.contactPage.companyLabel}
                </label>
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      companyName: e.target.value,
                    })
                  }
                  placeholder={t.contactPage.companyPlaceholder}
                  className="w-full rounded-lg border border-white/10 bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-slate-500 focus:border-brand focus:outline-none"
                />
                {errors.companyName && (
                  <p className="text-xs font-medium text-rose-400">
                    {errors.companyName}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-xs font-bold tracking-wider text-slate-300 uppercase"
                >
                  {t.contactPage.emailInputLabel}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder={t.contactPage.emailPlaceholder}
                  className="w-full rounded-lg border border-white/10 bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-slate-500 focus:border-brand focus:outline-none"
                />
                {errors.email && (
                  <p className="text-xs font-medium text-rose-400">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="inquiryType"
                  className="block text-xs font-bold tracking-wider text-slate-300 uppercase"
                >
                  {t.contactPage.inquiryTypeLabel}
                </label>
                <select
                  id="inquiryType"
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      inquiryType: e.target.value as InquiryCategory,
                    })
                  }
                  className="w-full rounded-lg border border-white/10 bg-background/50 px-4 py-3 text-sm text-foreground focus:border-brand focus:outline-none"
                >
                  <option value="SPONSORSHIP">
                    {t.contactPage.inquiryOptions.SPONSORSHIP}
                  </option>
                  <option value="TOURNAMENT">
                    {t.contactPage.inquiryOptions.TOURNAMENT}
                  </option>
                  <option value="GENERAL">
                    {t.contactPage.inquiryOptions.GENERAL}
                  </option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="message"
                className="block text-xs font-bold tracking-wider text-slate-300 uppercase"
              >
                {t.contactPage.messageLabel}
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder={t.contactPage.messagePlaceholder}
                className="w-full rounded-lg border border-white/10 bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-slate-500 focus:border-brand focus:outline-none"
              />
              {errors.message && (
                <p className="text-xs font-medium text-rose-400">
                  {errors.message}
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center rounded-lg bg-brand px-8 py-3.5 text-xs font-bold tracking-wider text-background uppercase transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {isSubmitting
                  ? t.contactPage.submittingButton
                  : t.contactPage.submitButton}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
