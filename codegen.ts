import { Constants } from "@/utils/constants";
import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: Constants.NEXT_PUBLIC_GRAPHQL_URL,
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