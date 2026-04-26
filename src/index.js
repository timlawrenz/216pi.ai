export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. Analytics Tracking for specific files
    if (url.pathname.endsWith('.md') || url.pathname.endsWith('.txt')) {
      try {
        // Core Identity
        const userAgent = request.headers.get('User-Agent') || 'Unknown';
        const country = request.cf?.country || 'Unknown';
        const asn = request.cf?.asn?.toString() || 'Unknown';
        
        // Intent & Routing
        const path = url.pathname;
        const acceptHeader = request.headers.get('Accept') || 'Unknown';
        const referer = request.headers.get('Referer') || 'Direct';
        
        // Write comprehensive data to Analytics Engine
        if (env.AGENT_TRACKER) {
          env.AGENT_TRACKER.writeDataPoint({
            blobs: [
              path,           // blob1
              userAgent,      // blob2
              country,        // blob3
              asn,            // blob4
              acceptHeader,   // blob5
              referer         // blob6
            ]
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
