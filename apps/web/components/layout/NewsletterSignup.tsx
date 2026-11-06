"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";

type Status = "idle" | "loading" | "ok" | "err";

export function NewsletterSignup({
  variant = "default",
}: {
  variant?: "default" | "compact";
}) {
  const t = useTranslations("newsletter");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    try {
      const form = e.currentTarget;
      const hp = (
        form.elements.namedItem("honeypot_field") as HTMLInputElement | null
      )?.value;
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, honeypot_field: hp ?? "" }),
      });
      if (!res.ok) throw new Error("subscribe failed");
      setStatus("ok");
      setEmail("");
    } catch {
      setStatus("err");
    }
  }

  const form = (
    <form onSubmit={onSubmit} className="flex gap-2 flex-1 min-w-0">
      <label className="sr-only" htmlFor={`newsletter-email-${variant}`}>
        {t("placeholder")}
      </label>
      <input
        id={`newsletter-email-${variant}`}
        type="email"
        name="email"
        required
        autoComplete="email"
        value={email}
        onChange={(ev) => setEmail(ev.target.value)}
        placeholder={t("placeholder")}
        className={
          variant === "compact"
            ? "flex-1 min-w-0 h-10 px-3 bg-white text-black border-2 border-black text-sm font-medium outline-none focus:outline focus:outline-2 focus:outline-[#FFDE03]"
            : "flex-1 min-h-12 px-3 bg-white text-black border-2 border-black text-sm font-medium outline-none focus:outline focus:outline-2 focus:outline-[#FFDE03]"
        }
      />
      <div className="sr-only" aria-hidden="true">
        <input type="text" name="honeypot_field" tabIndex={-1} autoComplete="off" />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className={
          variant === "compact"
            ? "h-10 px-4 shrink-0 bg-[#FFDE03] text-black font-display font-black uppercase text-xs border-2 border-black hover:translate-x-[1px] hover:translate-y-[1px] transition-all disabled:opacity-60"
            : "min-h-12 px-5 bg-[#FFDE03] text-black font-display font-black uppercase text-sm border-2 border-black shadow-[3px_3px_0_#fff] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-60"
        }
      >
        {status === "loading" ? t("sending") : t("cta")}
      </button>
    </form>
  );

  if (variant === "compact") {
    return (
      <div className="border-b-4 border-black bg-black">
        <div className="container py-2.5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <p className="font-display font-black uppercase text-[#FFDE03] text-[11px] tracking-wide shrink-0">
            {t("compactLabel")}
          </p>
          {status === "ok" ? (
            <p className="text-sm font-bold text-[#FFDE03]">{t("success")}</p>
          ) : (
            form
          )}
          {status === "err" ? (
            <p className="text-xs font-medium text-red-300 sm:ml-0">{t("error")}</p>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="border-2 border-white/20 bg-black p-4 md:p-5">
      <p className="font-display font-black uppercase text-[#FFDE03] text-sm tracking-wide mb-1">
        {t("title")}
      </p>
      <p className="text-sm text-white/60 font-medium mb-3">{t("blurb")}</p>
      {status === "ok" ? (
        <p className="text-sm font-bold text-[#FFDE03]">{t("success")}</p>
      ) : (
        <div className="flex flex-col sm:flex-row gap-2">{form}</div>
      )}
      {status === "err" ? (
        <p className="mt-2 text-sm font-medium text-red-300">{t("error")}</p>
      ) : null}
    </div>
  );
}
