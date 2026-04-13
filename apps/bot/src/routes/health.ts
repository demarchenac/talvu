import { Hono } from "hono";

const health = new Hono();

health.get("/", (c) => {
  return c.json({ status: "ok", service: "axia-bot" });
});

export { health as healthRoute };
