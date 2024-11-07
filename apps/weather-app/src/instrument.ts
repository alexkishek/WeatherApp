import * as Sentry from "@sentry/nestjs"
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: "https://68cada9ec102c90435cceea9efa62f21@o4508254673108992.ingest.us.sentry.io/4508254677696512",
  integrations: [
    nodeProfilingIntegration(),
  ],
  tracesSampleRate: 1.0,
});

Sentry.profiler.startProfiler()

Sentry.profiler.stopProfiler()
