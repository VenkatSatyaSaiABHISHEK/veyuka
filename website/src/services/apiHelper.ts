/**
 * VEYUKA Mock API Helper
 * Standardizes async simulated network delay (~400ms)
 * to replicate production REST/GraphQL latency.
 */

export const delay = (ms = 400): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
