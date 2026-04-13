import { Hono } from "hono";
import { ConvexHttpClient } from "convex/browser";
// import { api } from "@convex/_generated/api";
// ^ Uncomment after running `npx convex dev` to generate types

type Bindings = {
  CONVEX_URL: string;
  TWILIO_AUTH_TOKEN: string;
};

const webhook = new Hono<{ Bindings: Bindings }>();

webhook.post("/twilio", async (c) => {
  const body = await c.req.parseBody();
  const from = body.From as string; // whatsapp:+573001234567
  const message = body.Body as string;
  const convex = new ConvexHttpClient(c.env.CONVEX_URL);

  // TODO: Uncomment after Convex schema + functions are set up
  // await convex.mutation(api.bot.chat.handleIncoming, {
  //   channel: "whatsapp",
  //   channelId: from.replace("whatsapp:", ""),
  //   content: message,
  // });

  return c.text("OK", 200);
});

export { webhook as webhookRoute };
