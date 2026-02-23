import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFDE03]">
      <div className="text-center border-4 border-black shadow-brutal-xl p-12 bg-white max-w-md">
        <div className="text-6xl mb-4">🃏</div>
        <h1 className="text-4xl font-display font-black text-black mb-2">{t("title")}</h1>
        <p className="text-black/70 mb-8 font-medium">{t("description")}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-black text-[#FFDE03] px-6 py-3 font-display font-black uppercase border-2 border-black shadow-brutal hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
        >
          {t("backHome")}
        </Link>
      </div>
    </div>
  );
}
