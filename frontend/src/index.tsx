import { serve } from "bun";
import index from "./index.html";

const server = serve({
  routes: {
    "/*": index,
  },
  port: 5173,

  development: process.env.NODE_ENV !== "production",
});

console.log(`🚀 Server running at ${server.url}`);
