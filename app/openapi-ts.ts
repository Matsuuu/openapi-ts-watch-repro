import { createClient } from "@hey-api/openapi-ts";

createClient({
  input: "http://localhost:3000/openapi",
  output: "src/api",
  plugins: ["@hey-api/client-fetch"],
  watch: true,
});
