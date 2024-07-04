import { CollectionConfig } from "payload/types";

export const Users: CollectionConfig = {
  slug: "users", //usually the same as the collection name
  auth: {
    verify: {
      generateEmailHTML: ({ token }) => {
        return `<p>Hello. Please verify your email.</p>`;
      },
    },
  },
  access: {
    read: () => true,
    create: () => true,
  },
  fields: [
    {
      name: "role",
      required: true,
      defaultValue: "user",
      type: "select",
      options: [
        {
          value: "admin",
          label: "Admin",
        },
        {
          value: "user",
          label: "User",
        },
      ],
    },
  ],
};
