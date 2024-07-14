import {
  ProductFilesCollection,
  ProductsCollection,
  QueryParamKeys,
} from "../constants";
import { Access, CollectionConfig } from "payload/types";

const adminsAndUser: Access = ({ req: { user } }) => {
  if (user.role === "admin") return true;

  return {
    id: {
      equals: user.id,
    },
  };
};

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
    read: adminsAndUser,
    create: () => true,
    update: ({ req }) => req.user.role === "admin",
    delete: ({ req }) => req.user.role === "admin",
  },
  fields: [
    {
      name: "products",
      label: "Products",
      admin: {
        condition: () => false,
      },
      type: "relationship",
      relationTo: ProductsCollection,
      hasMany: true,
    },
    {
      name: "product_files",
      label: "Product files",
      admin: {
        condition: () => false,
      },
      type: "relationship",
      relationTo: ProductFilesCollection,
      hasMany: true,
    },
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
