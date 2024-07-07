import { ProductsCollection, UsersCollection } from "../constants";
import { Access, CollectionConfig } from "payload/types";

const yourOwnOrders: Access = ({ req: { user } }) => {
  if (user.role === "admin") return true;

  return {
    user: {
      equals: user?.id,
    },
  };
};

export const Orders: CollectionConfig = {
  slug: "orders",
  admin: {
    useAsTitle: "Your Orders",
    description: "A summary of all your orders on Next Marketplace.",
  },
  access: {
    read: yourOwnOrders,
    update: ({ req }) => req.user.role === "admin",
    delete: ({ req }) => req.user.role === "admin",
    create: ({ req }) => req.user.role === "admin",
  },
  fields: [
    {
      name: "_isPaid",
      type: "checkbox",
      access: {
        read: ({ req }) => req.user.role === "admin", // no user shpould change orders to Paid
        create: () => false, // can only create through code
        update: () => false, // can only update through code
      },
      admin: {
        hidden: true,
      },
      required: true,
    },
    {
      name: "user",
      type: "relationship",
      admin: {
        hidden: true, // should not see who created the order
      },
      relationTo: UsersCollection,
      required: true,
    },
    {
      name: "products",
      type: "relationship",
      relationTo: ProductsCollection,
      required: true,
      hasMany: true,
    },
  ],
};
