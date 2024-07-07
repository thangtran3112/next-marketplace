import {
  OrdersCollection,
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
    depth: 0, // with depth = 0, this would return only the Product ID
    where: {
      user: {
        equals: user.id,
      },
    },
  });

  //With depth = 0, we know the query only return the Product ID, but TypeScript doesn't know that
  //By using flat() we convert the array of Product IDs into an array of Product objects
  const ownProductFileIds = products.map((prod) => prod.product_files).flat();

  const { docs: orders } = await req.payload.find({
    collection: OrdersCollection,
    depth: 2, // with depth = 2, this order should have the entire Product objects
    where: {
      user: {
        equals: user.id,
      },
    },
  });

  //list of products purchased by this user
  const purchasedProductFileIds = orders
    .map((order) => {
      return order.products.map((product) => {
        if (typeof product === "string")
          //we do not get the whole Product object, but productId only
          return req.payload.logger.error(
            "Search depth not sufficient to find purchased file IDs"
          ); // with this search depth, we only get the Product ID, not the ProductFiles in it

        // if we get here, we actually get the ProductFile Id, which is inside Product Object
        return typeof product.product_files === "string"
          ? product.product_files
          : product.product_files.id;
      });
    })
    .filter(Boolean) //take out all falsy values out of array
    .flat();

  return {
    id: {
      in: [...ownProductFileIds, ...purchasedProductFileIds],
    },
  };
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
