/**
 * Agenda Cartes FR — Crawler Service
 *
 * Runs:
 * - Cron: every 6 hours for full crawls
 * - Cron: every 30 minutes for status refresh
 * - HTTP: POST /trigger (auth via Bearer CRAWLER_SECRET) for manual crawls
 */

import * as cron from "node-cron";
import * as http from "http";
import { crawlAll, crawlSource, refreshEventStatuses } from "./orchestrator";

const PORT = parseInt(process.env.CRAWLER_PORT ?? "3001", 10);
const SECRET = process.env.CRAWLER_SECRET;

if (!SECRET) {
  console.error("⚠️  CRAWLER_SECRET is not set — HTTP trigger endpoint is disabled");
}

// ============================================================
// Scheduled jobs
// ============================================================

// Full crawl every 6 hours: 0 */6 * * *
cron.schedule("0 */6 * * *", async () => {
  console.log("\n[CRON] Starting scheduled crawl run");
  try {
    await crawlAll();
  } catch (err) {
    console.error("[CRON] Crawl failed:", err);
  }
});

// Status refresh every 30 minutes: */30 * * * *
cron.schedule("*/30 * * * *", async () => {
  console.log("\n[CRON] Refreshing event statuses");
  try {
    await refreshEventStatuses();
  } catch (err) {
    console.error("[CRON] Status refresh failed:", err);
  }
});

// ============================================================
// HTTP Server — manual trigger endpoint
// ============================================================

const server = http.createServer(async (req, res) => {
  // Health check
  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", uptime: process.uptime() }));
    return;
  }

  // Trigger endpoint
  if (req.method === "POST" && req.url === "/trigger") {
    // Verify auth
    const authHeader = req.headers.authorization;
    if (!SECRET || authHeader !== `Bearer ${SECRET}`) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Unauthorized" }));
      return;
    }

    // Parse body
    let body = "";
    req.on("data", (chunk: Buffer) => (body += chunk.toString()));
    req.on("end", async () => {
      let sourceId: string | undefined;

      try {
        const parsed = JSON.parse(body || "{}");
        sourceId = parsed.sourceId;
      } catch {
        // Empty or invalid body — crawl all
      }

      res.writeHead(202, { "Content-Type": "application/json" });
      const runId = `manual-${Date.now()}`;
      res.end(JSON.stringify({ accepted: true, runId }));

      // Run async (don't block response)
      try {
        if (sourceId) {
          console.log(`\n[HTTP] Manual trigger for source: ${sourceId}`);
          await crawlSource(sourceId);
        } else {
          console.log("\n[HTTP] Manual trigger for all sources");
          await crawlAll();
        }
      } catch (err) {
        console.error("[HTTP] Manual crawl failed:", err);
      }
    });

    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(PORT, () => {
  console.log(`\n🕷️  Agenda Cartes FR — Crawler Service`);
  console.log(`   HTTP server: http://localhost:${PORT}`);
  console.log(`   Trigger endpoint: POST /trigger (Bearer auth)`);
  console.log(`   Scheduled crawl: every 6 hours`);
  console.log(`   Status refresh: every 30 minutes`);
  console.log(`\n   Starting initial status refresh...`);
  refreshEventStatuses().catch(console.error);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("\n[SIGTERM] Shutting down crawler gracefully...");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("\n[SIGINT] Shutting down crawler gracefully...");
  server.close(() => process.exit(0));
});
