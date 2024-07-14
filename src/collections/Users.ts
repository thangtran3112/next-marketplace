import { PrimaryActionEmailHtml } from "../components/emails/PrimaryActionEmail";
import { ProductFilesCollection, ProductsCollection } from "../constants";
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
        return PrimaryActionEmailHtml({
          actionLabel: "verify your account",
          buttonText: "Verify Account",
          href: `${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token}`,
        });
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
