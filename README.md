# Digital marketplace Techstacks:

- Next14, Tailwind
- [Shadcn UI](https://ui.shadcn.com/)
- [Lucide for icons](https://lucide.dev/icons/): `npm i lucide-react --save`
- TRPC, and Payload CMS

## Getting Started

- Install Shadcn UI with `npx shadcn-ui@latest init`
- Choose the [color theme](https://ui.shadcn.com/themes) that you want to use, and copy the theme to `src/app/globals.css`

## Express Middleware for NextJs

- We are using [Express as a middleware](https://medium.com/@obulareddyveera/next-js-invite-express-js-as-middleware-ea5e7bb494f0) for interacting with Payload.
- Using `cross-env` and `nodemon` in `dev` mode will automatically restart the express server on file changes.
- We also need to add a few custom decorators in `tsconfig.server.json` to make Express works:

```tsconfig.server.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "module": "CommonJS",
    "outDir": "dist",
    "noEmit": false,
    "jsx": "react"
  },
  "include": ["src/server.ts", "src/payload.config.ts"]
}
```

## Payload Configuration (MongoDB, alternative: Postgres)

- Create `payload.config.ts` and export a default config.
- For `editor` in payload config, we can choose SlateJs[https://www.slatejs.org/] or Lexical[https://lexical.dev/].
- Install payload adapters for MongoDb (alternative: Postgres), and webpack bundler for our Express server:

```bash
npm i @payloadcms/richtext-slate @payloadcms/bundler-webpack @payloadcms
/db-mongodb --save
```

- For viewing payload Admin dashboard, please see `http://localhost:3000/sell`
- Important note: You should not have any `users` document in your database, in order to be redirected to `http://localhost:3000/sell/create-first-user`. [See more here](https://payloadcms.com/community-help/discord/i-cant-sign-up-as-admin)

![Payload Collections on MongoDB](./images/MongoPayloadCollections.png)
