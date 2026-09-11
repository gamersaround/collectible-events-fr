"use client";

import { useState } from "react";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

interface FormState {
  status: "idle" | "submitting" | "success" | "error";
  errorMessage?: string;
}

export function SponsorForm() {
  const t = useTranslations("sponsor");
  const locale = useLocale();
  const [state, setState] = useState<FormState>({ status: "idle" });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState({ status: "submitting" });

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      organization: formData.get("organization") as string,
      message: formData.get("message") as string,
      locale,
      honeypot_field: (formData.get("website") as string) || "",
    };

    try {
      const res = await fetch("/api/sponsor-inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? t("submissionError"));
      }

      setState({ status: "success" });
      form.reset();
    } catch (err) {
      setState({
        status: "error",
        errorMessage: err instanceof Error ? err.message : t("errorOccurred"),
      });
    }
  }

  if (state.status === "success") {
    return (
      <div className="text-center py-12">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("successTitle")}</h2>
        <p className="text-gray-600 mb-6">{t("successDescription")}</p>
        <button
          onClick={() => setState({ status: "idle" })}
          className="text-blue-600 hover:underline"
        >
          {t("submitAnother")}
        </button>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {state.status === "error" && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm">{state.errorMessage}</p>
        </div>
      )}

      <div aria-hidden="true" className="hidden">
        <label htmlFor="website">{t("honeypot")}</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          {t("nameLabel")} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          maxLength={200}
          placeholder={t("namePlaceholder")}
          autoComplete="name"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          {t("emailLabel")} <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          maxLength={200}
          autoComplete="email"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
          {t("organizationLabel")} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="organization"
          name="organization"
          required
          maxLength={200}
          placeholder={t("organizationPlaceholder")}
          autoComplete="organization"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          {t("messageLabel")} <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          maxLength={5000}
          placeholder={t("messagePlaceholder")}
          className={inputClass}
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={state.status === "submitting"}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {state.status === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("submittingButton")}
            </>
          ) : (
            t("submitButton")
          )}
        </button>
        <p className="mt-2 text-xs text-gray-500">{t("reviewNote")}</p>
      </div>
    </form>
  );
}
