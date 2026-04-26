export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // 1. Only track requests to markdown and text files
  if (url.pathname.endsWith('.md') || url.pathname.endsWith('.txt')) {
    try {
      // 2. Extract data to track
      const userAgent = request.headers.get('User-Agent') || 'Unknown';
      const country = request.cf?.country || 'Unknown';
      const path = url.pathname;
      
      // 3. Write data to Analytics Engine
      // blob1: Path, blob2: User Agent, blob3: Country
      if (env.AGENT_TRACKER) {
        env.AGENT_TRACKER.writeDataPoint({
          blobs: [path, userAgent, country]
        });
      } else {
        console.warn("AGENT_TRACKER binding is missing.");
      }
    } catch (e) {
      // Fail silently so we don't break the file delivery
      console.error("Failed to write to Analytics Engine:", e);
    }
  }

  // 4. Continue serving the requested file
  return await context.next();
}
