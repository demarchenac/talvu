import { Hono } from "hono";
import { healthRoute } from "./routes/health";
import { webhookRoute } from "./routes/webhook";

type Bindings = {
  CONVEX_URL: string;
  TWILIO_AUTH_TOKEN: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.route("/health", healthRoute);
app.route("/webhook", webhookRoute);

export default app;
