import { MediaCollection } from "../constants";
import { User } from "../payload-types";
import { Access, CollectionConfig } from "payload/types";

const isAdminOrHasAccessToImages =
  (): Access =>
  //return a function as result of access control
  async ({ req }) => {
    //this is the user property, which we attached in the beforeChange hook
    const user = req.user as User | undefined;

    if (!user) return false;
    if (user.role === "admin") return true;

    //if user is not admin, check if they are the owner of the image
    return {
      //this is the field 'user' of the Media model, that we defined in fields array belows
      user: {
        equals: req.user.id,
      },
    };
  };

export const Media: CollectionConfig = {
  slug: MediaCollection,
  hooks: {
    beforeChange: [
      ({ req, data }) => {
        return { ...data, user: req.user.id }; //each media belongs to only one created user
      },
    ],
  },
  //On the Dashboard, only created user can see images. On the app, all users can see images
  access: {
    read: async ({ req }) => {
      //referer is the url of the page that triggered the request
      const referer = req.headers.referer;

      //on the app, where 'sell' is not in pathname, users can see all images
      if (!req.user || !referer?.includes("sell")) {
        return true;
      }

      //on the Payload Dashboard, only admin and created users with access to images can see images
      return await isAdminOrHasAccessToImages()({ req });
    },
    delete: isAdminOrHasAccessToImages(), // shorthand for ({ req }) => isAdminOrHasAccessToImages()({ req })
    update: isAdminOrHasAccessToImages(), // shorthand for ({ req }) => isAdminOrHasAccessToImages()({ req })
  },
  admin: {
    //since we upload images through Product category, we want to hide the Media as a displayed category
    hidden: ({ user }) => user.role !== "admin",
  },
  upload: {
    staticURL: "/media",
    staticDir: "media",
    imageSizes: [
      {
        name: "thumbnail",
        width: 400,
        height: 300,
        position: "centre",
      },
      {
        name: "card",
        width: 768,
        height: 1024,
        position: "centre",
      },
      {
        name: "tablet",
        width: 1024,
        height: undefined, //calculate the height based on the width, retains the aspect ratio
        position: "centre",
      },
    ],
    mimeTypes: ["image/*"], //alows only images
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      hasMany: false,
      admin: {
        condition: () => false,
      },
    },
  ],
};
