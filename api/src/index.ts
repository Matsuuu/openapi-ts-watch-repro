import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { describeRoute, openAPISpecs } from "hono-openapi";
import { resolver, validator as zValidator } from "hono-openapi/zod";
import * as z from "zod";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

const querySchema = z.object({
  name: z.optional(z.string()).default("World"),
});

const responseSchema = z.string();

app.get(
  "/hello",
  describeRoute({
    describeRoute: "Example route for demo",
    responses: {
      200: {
        description: "Everything went ok I guess",
        content: {
          "text/plain": { schema: resolver(responseSchema) },
        },
      },
    },
  }),
  zValidator("query", querySchema),
  (c) => {
    const query = c.req.valid("query");
    return c.text("Hello " + query.name);
  },
);

app.get(
  "/openapi",
  openAPISpecs(app, {
    documentation: {
      info: {
        title: "Hono API",
        version: "1.0.0",
        description: "Greeting API",
      },
      servers: [{ url: "http://localhost:3000", description: "Local Server" }],
    },
  }),
);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
