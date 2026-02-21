import { useDocumentOperation } from "sanity"
import { useToast } from "@sanity/ui"
import { PublishIcon } from "@sanity/icons"

export function PromoteToEventAction(props: any) {
  const { patch, publish } = useDocumentOperation(props.id, props.type)
  const toast = useToast()

  const isPending =
    props.draft?.status === "en_attente" || props.published?.status === "en_attente"
  const alreadyPromoted = !!(
    props.draft?.promotedToEventId || props.published?.promotedToEventId
  )

  if (!isPending || alreadyPromoted) return null

  return {
    label: "Valider et publier",
    icon: PublishIcon,
    onHandle: async () => {
      const res = await fetch("/api/promote-submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId: props.id }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.push({
          status: "success",
          title: `Événement créé : ${data.eventId}`,
        })
        props.onComplete()
      } else {
        toast.push({
          status: "error",
          title: data.error ?? "Erreur lors de la promotion",
        })
        props.onComplete()
      }
    },
  }
}
