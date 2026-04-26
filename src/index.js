export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. Analytics Tracking for specific files
    if (url.pathname.endsWith('.md') || url.pathname.endsWith('.txt')) {
      try {
        const userAgent = request.headers.get('User-Agent') || 'Unknown';
        const country = request.cf?.country || 'Unknown';
        const path = url.pathname;
        
        // Write data to Analytics Engine
        if (env.AGENT_TRACKER) {
          env.AGENT_TRACKER.writeDataPoint({
            blobs: [path, userAgent, country]
          });
        }
      } catch (e) {
        console.error("Analytics Error:", e);
      }
    }

    // 2. Fetch the requested asset using the new native assets binding
    return env.ASSETS.fetch(request);
  }
};
