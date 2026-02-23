"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { TCG_CONFIG, TCGType, EVENT_FORMAT_LABELS, EventFormat } from "@agenda-cartes/shared";

interface FormState {
  status: "idle" | "submitting" | "success" | "error";
  errorMessage?: string;
}

export function SubmissionForm() {
  const router = useRouter();
  const [state, setState] = useState<FormState>({ status: "idle" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUploading, setImageUploading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState({ status: "submitting" });

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Upload image first if provided
    let imageAssetId: string | null = null;
    if (imageFile) {
      setImageUploading(true);
      const fd = new FormData();
      fd.append("file", imageFile);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
      const uploadData = await uploadRes.json();
      setImageUploading(false);
      if (!uploadRes.ok) {
        setState({ status: "error", errorMessage: uploadData.error ?? "Erreur lors de l'upload de l'image" });
        return;
      }
      imageAssetId = uploadData.assetId ?? null;
    }

    // Collect TCG types (multiple checkboxes)
    const tcgTypes = formData.getAll("tcg_types") as TCGType[];

    const payload = {
      title: formData.get("title") as string,
      description: formData.get("description") as string || null,
      tcg_types: tcgTypes,
      format: formData.get("format") as EventFormat,
      venue_name: formData.get("venue_name") as string || null,
      address: formData.get("address") as string || null,
      city: formData.get("city") as string,
      country: formData.get("country") as string || "FR",
      department_code: formData.get("department_code") as string || null,
      postal_code: formData.get("postal_code") as string || null,
      starts_at: formData.get("starts_at") as string,
      ends_at: formData.get("ends_at") as string || null,
      entry_fee: formData.get("entry_fee") ? parseFloat(formData.get("entry_fee") as string) : null,
      max_participants: formData.get("max_participants") ? parseInt(formData.get("max_participants") as string) : null,
      registration_url: formData.get("registration_url") as string || null,
      organizer_name: formData.get("organizer_name") as string || null,
      organizer_contact: formData.get("organizer_contact") as string || null,
      website_url: formData.get("website_url") as string || null,
      // Honeypot — must be empty
      honeypot_field: formData.get("website") as string || "",
      image_asset_id: imageAssetId,
    };

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Erreur lors de la soumission");
      }

      setState({ status: "success" });
      form.reset();
    } catch (err) {
      setState({
        status: "error",
        errorMessage: err instanceof Error ? err.message : "Une erreur est survenue",
      });
    }
  }

  if (state.status === "success") {
    return (
      <div className="text-center py-12">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Soumission reçue !</h2>
        <p className="text-gray-600 mb-6">
          Votre événement a été soumis et sera examiné par notre équipe. Il
          apparaîtra sur le site après modération (généralement sous 24h).
        </p>
        <button
          onClick={() => setState({ status: "idle" })}
          className="text-blue-600 hover:underline"
        >
          Soumettre un autre événement
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {state.status === "error" && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm">{state.errorMessage}</p>
        </div>
      )}

      {/* Honeypot — hidden from real users */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor="website">Ne pas remplir ce champ</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Section 1: Event info */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
          Informations de l'événement
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Titre de l'événement <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              maxLength={200}
              placeholder="Ex: Tournoi Pokémon TCG — Circuit Régional Paris"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              maxLength={2000}
              placeholder="Format, règles, informations supplémentaires..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* TCG Types */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type(s) de jeu <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(TCG_CONFIG).map(([key, config]) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 border border-gray-200">
                  <input
                    type="checkbox"
                    name="tcg_types"
                    value={key}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600"
                  />
                  <span className="text-sm">
                    {config.emoji} {config.labelShort}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Format */}
          <div>
            <label htmlFor="format" className="block text-sm font-medium text-gray-700 mb-1">
              Format <span className="text-red-500">*</span>
            </label>
            <select
              id="format"
              name="format"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionnez un format</option>
              {Object.entries(EVENT_FORMAT_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Section 2: Location */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
          Lieu
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
              Pays <span className="text-red-500">*</span>
            </label>
            <select
              id="country"
              name="country"
              required
              defaultValue="FR"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <optgroup label="Europe de l'Ouest">
                <option value="FR">🇫🇷 France</option>
                <option value="BE">🇧🇪 Belgique</option>
                <option value="CH">🇨🇭 Suisse</option>
                <option value="LU">🇱🇺 Luxembourg</option>
                <option value="DE">🇩🇪 Allemagne</option>
                <option value="GB">🇬🇧 Royaume-Uni</option>
                <option value="IE">🇮🇪 Irlande</option>
                <option value="NL">🇳🇱 Pays-Bas</option>
                <option value="ES">🇪🇸 Espagne</option>
                <option value="PT">🇵🇹 Portugal</option>
                <option value="IT">🇮🇹 Italie</option>
                <option value="AT">🇦🇹 Autriche</option>
              </optgroup>
              <optgroup label="Europe du Nord">
                <option value="SE">🇸🇪 Suède</option>
                <option value="NO">🇳🇴 Norvège</option>
                <option value="DK">🇩🇰 Danemark</option>
                <option value="FI">🇫🇮 Finlande</option>
                <option value="IS">🇮🇸 Islande</option>
              </optgroup>
              <optgroup label="Europe centrale &amp; de l'Est">
                <option value="PL">🇵🇱 Pologne</option>
                <option value="CZ">🇨🇿 République tchèque</option>
                <option value="SK">🇸🇰 Slovaquie</option>
                <option value="HU">🇭🇺 Hongrie</option>
                <option value="RO">🇷🇴 Roumanie</option>
                <option value="BG">🇧🇬 Bulgarie</option>
                <option value="GR">🇬🇷 Grèce</option>
                <option value="SI">🇸🇮 Slovénie</option>
                <option value="HR">🇭🇷 Croatie</option>
                <option value="RS">🇷🇸 Serbie</option>
                <option value="LT">🇱🇹 Lituanie</option>
                <option value="LV">🇱🇻 Lettonie</option>
                <option value="EE">🇪🇪 Estonie</option>
                <option value="MT">🇲🇹 Malte</option>
                <option value="CY">🇨🇾 Chypre</option>
              </optgroup>
              <optgroup label="Amérique du Nord">
                <option value="US">🇺🇸 États-Unis</option>
                <option value="CA">🇨🇦 Canada</option>
                <option value="MX">🇲🇽 Mexique</option>
              </optgroup>
              <optgroup label="Amérique du Sud">
                <option value="BR">🇧🇷 Brésil</option>
                <option value="AR">🇦🇷 Argentine</option>
              </optgroup>
              <optgroup label="Asie-Pacifique">
                <option value="JP">🇯🇵 Japon</option>
                <option value="KR">🇰🇷 Corée du Sud</option>
                <option value="AU">🇦🇺 Australie</option>
                <option value="NZ">🇳🇿 Nouvelle-Zélande</option>
              </optgroup>
              <optgroup label="Autre">
                <option value="OTHER">🌍 Autre</option>
              </optgroup>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                Ville <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="city"
                name="city"
                required
                placeholder="Ex: Paris, Bruxelles, Genève..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-1">
                Code postal
              </label>
              <input
                type="text"
                id="postal_code"
                name="postal_code"
                placeholder="75001, 1000, 1200..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="venue_name" className="block text-sm font-medium text-gray-700 mb-1">
              Nom du lieu
            </label>
            <input
              type="text"
              id="venue_name"
              name="venue_name"
              placeholder="Ex: Salle des fêtes, Game Shop..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Adresse
            </label>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Ex: 10 Rue de la Paix"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Section 3: Dates */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
          Dates et horaires
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="starts_at" className="block text-sm font-medium text-gray-700 mb-1">
              Début <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              id="starts_at"
              name="starts_at"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="ends_at" className="block text-sm font-medium text-gray-700 mb-1">
              Fin
            </label>
            <input
              type="datetime-local"
              id="ends_at"
              name="ends_at"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Section 4: Photo */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
          Photo de l'événement
        </h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image <span className="text-gray-400 font-normal">(optionnelle, max 5 Mo — JPG, PNG, WebP)</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm border border-gray-300 rounded-lg px-3 py-2 cursor-pointer bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {imageFile && (
            <p className="text-xs mt-1 text-gray-500">{imageFile.name} ({(imageFile.size / 1024).toFixed(0)} Ko)</p>
          )}
        </div>
      </section>

      {/* Section 5: Practical info */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
          Informations pratiques
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="entry_fee" className="block text-sm font-medium text-gray-700 mb-1">
                Frais d'inscription (€)
              </label>
              <input
                type="number"
                id="entry_fee"
                name="entry_fee"
                min="0"
                step="0.50"
                placeholder="0 = gratuit"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="max_participants" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de places
              </label>
              <input
                type="number"
                id="max_participants"
                name="max_participants"
                min="1"
                placeholder="Ex: 32"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="registration_url" className="block text-sm font-medium text-gray-700 mb-1">
              Lien d'inscription
            </label>
            <input
              type="url"
              id="registration_url"
              name="registration_url"
              placeholder="https://..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Section 5: Organizer */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
          Organisateur
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="organizer_name" className="block text-sm font-medium text-gray-700 mb-1">
              Nom de l'organisateur / association
            </label>
            <input
              type="text"
              id="organizer_name"
              name="organizer_name"
              placeholder="Ex: Club Pokémon Paris"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="organizer_contact" className="block text-sm font-medium text-gray-700 mb-1">
                Email de contact
              </label>
              <input
                type="email"
                id="organizer_contact"
                name="organizer_contact"
                placeholder="contact@..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="website_url" className="block text-sm font-medium text-gray-700 mb-1">
                Site web
              </label>
              <input
                type="url"
                id="website_url"
                name="website_url"
                placeholder="https://..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Submit */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={state.status === "submitting"}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {state.status === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {imageUploading ? "Upload de l'image…" : "Envoi en cours…"}
            </>
          ) : (
            "Soumettre l'événement"
          )}
        </button>
        <p className="mt-2 text-xs text-gray-500">
          Votre soumission sera examinée par notre équipe avant publication.
        </p>
      </div>
    </form>
  );
}
