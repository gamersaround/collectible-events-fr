import { defineField, defineType } from "sanity";

export const departmentSchema = defineType({
  name: "department",
  title: "Département",
  type: "document",
  fields: [
    defineField({
      name: "code",
      title: "Code",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "name",
      title: "Nom",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "region",
      title: "Région",
      type: "string",
    }),
    defineField({
      name: "latitude",
      title: "Latitude",
      type: "number",
    }),
    defineField({
      name: "longitude",
      title: "Longitude",
      type: "number",
    }),
  ],
  preview: {
    select: {
      code: "code",
      name: "name",
      region: "region",
    },
    prepare({ code, name, region }) {
      return {
        title: `[${code}] ${name}`,
        subtitle: region,
      };
    },
  },
});
