import { Redis } from "@upstash/redis";
import { env } from "../../env/server.mjs";

declare global {
  // eslint-disable-next-line no-var
  var redis: Redis | undefined;
}

export const redis =
  global.redis ||
  new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  });

if (env.NODE_ENV !== "production") {
  global.redis = redis;
}
