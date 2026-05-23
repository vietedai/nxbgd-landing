import server from "../dist/server/server.bundle.js";

export default async function handler(req, res) {
  try {
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const host =
      req.headers["x-forwarded-host"] || req.headers["host"] || "localhost";
    const url = `${protocol}://${host}${req.url}`;

    const chunks = [];
    if (!["GET", "HEAD"].includes(req.method)) {
      for await (const chunk of req) chunks.push(chunk);
    }

    const request = new Request(url, {
      method: req.method,
      headers: req.headers,
      body: chunks.length > 0 ? Buffer.concat(chunks) : undefined,
    });

    const response = await server.fetch(request);

    res.statusCode = response.status;
    for (const [key, value] of response.headers.entries()) {
      res.setHeader(key, value);
    }
    res.end(Buffer.from(await response.arrayBuffer()));
  } catch (err) {
    console.error("[server] handler error:", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain");
    res.end(
      `Server error: ${err?.message || String(err)}\n\n${err?.stack || ""}`,
    );
  }
}

export const config = { api: { bodyParser: false } };
