import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

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

    // 2. Serve static assets
    try {
      // By default, this will serve index.html for the root '/'
      return await getAssetFromKV(
        {
          request,
          waitUntil: ctx.waitUntil.bind(ctx),
        },
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: __STATIC_CONTENT_MANIFEST,
        }
      );
    } catch (e) {
      return new Response("Not Found", { status: 404 });
    }
  }
};
