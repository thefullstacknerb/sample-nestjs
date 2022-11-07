export default () => ({
  throttler: {
    ttl: parseInt(process.env.THROTTLER_TTL),
    limit: parseInt(process.env.THROTTLER_LIMIT),
  },
  cache: {
    ttl: parseInt(process.env.CACHE_TTL),
  },
});
