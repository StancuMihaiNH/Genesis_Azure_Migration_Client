import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.APP_API_SERVICE_URL,
  documents: ["src/**/*.{gql,graphql}"],
  generates: {
    "./src/graphql/__generated__/schema.tsx": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo"
      ],
    },
  },
  ignoreNoDocuments: true
};

export default config;