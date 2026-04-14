/**
 * Early-access allowlist — only these emails can sign in and access the dashboard.
 * Everyone else gets redirected to /waitlist.
 *
 * To disable the gate, empty this set.
 */
export const ALLOWED_EMAILS: Set<string> = new Set([
  "modisathvik20.ms@gmail.com",
]);
