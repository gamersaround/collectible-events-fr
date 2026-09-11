import { defineField, defineType } from "sanity";

export const sponsorInquirySchema = defineType({
  name: "sponsorInquiry",
  title: "Demande sponsoring",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nom",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "organization",
      title: "Organisation / société",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "message",
      title: "Message",
      type: "text",
      rows: 6,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "locale",
      title: "Locale",
      type: "string",
    }),
    defineField({
      name: "submitterIp",
      title: "IP",
      type: "string",
      hidden: true,
    }),
    defineField({
      name: "digestedAt",
      title: "Inclus dans le digest",
      type: "datetime",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "email",
    },
  },
});
