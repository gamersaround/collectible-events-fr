import { crawlAll } from "./orchestrator";

crawlAll().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
