import { QueryParamKeys } from "../constants";
import { CollectionConfig } from "payload/types";

export const Users: CollectionConfig = {
  slug: "users", //usually the same as the collection name
  auth: {
    verify: {
      generateEmailHTML: ({ token }) => {
        return `<a href='${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?${QueryParamKeys.Token}=${token}'>Verify your account</a>`;
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
