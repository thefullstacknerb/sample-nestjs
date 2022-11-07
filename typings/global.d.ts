export declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // url of Sqlite database
      DATABASE_URL: string;

      // throttler time-to-live
      THROTTLER_TTL: string;
      // throttler limit within ttl period
      THROTTLER_LIMIT: string;

      // cache time-to-live
      CACHE_TTL: string;
    }
  }
}
