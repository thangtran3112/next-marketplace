import {
  ProductFilesCollection,
  ProductsCollection,
  UsersCollection,
} from "../constants";
import { User } from "../payload-types";
import { BeforeChangeHook } from "payload/dist/collections/config/types";
import { Access, CollectionConfig } from "payload/types";

const addUser: BeforeChangeHook = ({ req, data }) => {
  const user = req.user as User | null;
  return { ...data, user: user?.id }; //attach user propertyto product_file
};

const yourOwnAndPurchased: Access = async ({ req }) => {
  const user = req.user as User | null;

  if (user?.role === "admin") return true;
  if (!user) return false;

  //Get all products created by this user
  const { docs: products } = await req.payload.find({
    collection: ProductsCollection,
    //do not include entire user attached to product (if depth is 1)
    depth: 0,
    where: {
      user: {
        equals: user.id,
      },
    },
  });

  const ownProductFileIds = products.map((prod) => prod.product_files).flat();

  return true;
};

export const ProductFiles: CollectionConfig = {
  slug: ProductFilesCollection,
  admin: {
    //Product files will not be a separate category, users will add files directly in Products category
    hidden: ({ user }) => user.role !== "admin",
  },
  hooks: {
    beforeChange: [addUser],
  },
  access: {
    read: yourOwnAndPurchased,
    update: ({ req }) => req.user.role === "admin",
    delete: ({ req }) => req.user.role === "admin",
  },
  upload: {
    staticURL: "/product_files",
    staticDir: "product_files",
    mimeTypes: ["image/*", "font/*", "application/postscript"],
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: UsersCollection,
      admin: {
        condition: () => false,
      },
      hasMany: false,
      required: true,
    },
  ],
};
