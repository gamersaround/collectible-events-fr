import type { Metadata } from "next";
import { SubmissionForm } from "@/components/forms/SubmissionForm";

export const metadata: Metadata = {
  title: "Soumettre un événement",
  description:
    "Soumettez votre tournoi, bourse ou convention TCG pour le faire apparaître sur Agenda Cartes FR.",
};

export default function SubmitPage() {
  return (
    <div className="container py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Soumettre un événement
        </h1>
        <p className="text-gray-600">
          Vous organisez un tournoi, une bourse ou une convention ? Soumettez-le
          ici et il sera publié après validation par notre équipe (généralement
          sous 24h).
        </p>
      </div>

      <SubmissionForm />
    </div>
  );
}
