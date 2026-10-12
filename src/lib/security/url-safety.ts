import dns from "dns/promises";
import net from "net";

/**
 * Server-Side Request Forgery (SSRF) Protection & URL Safety Checker
 */

// Private & Reserved IPv4 Ranges
const PRIVATE_IPV4_PATTERNS = [
  /^0\./,                         // 0.0.0.0/8
  /^10\./,                        // 10.0.0.0/8
  /^127\./,                       // 127.0.0.0/8 (Loopback)
  /^169\.254\./,                  // 169.254.0.0/16 (Link Local / Cloud Metadata)
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // 172.16.0.0/12
  /^192\.168\./,                  // 192.168.0.0/16
  /^192\.0\.0\./,                 // 192.0.0.0/24
  /^192\.0\.2\./,                 // 192.0.2.0/24 (TEST-NET-1)
  /^198\.51\.100\./,              // 198.51.100.0/24 (TEST-NET-2)
  /^203\.0\.113\./,               // 203.0.113.0/24 (TEST-NET-3)
  /^224\./,                       // Multicast
  /^240\./,                       // Reserved
  /^255\.255\.255\.255$/,         // Broadcast
];

// Blocked Hostnames / Metadata Targets
const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "localhost.localdomain",
  "broadcasthost",
  "metadata.google.internal",
  "instance-data",
  "169.254.169.254",
  "100.100.100.200",
]);

/**
 * Checks if an IP address string is a private, loopback, or cloud metadata address
 */
export function isPrivateIp(ip: string): boolean {
  if (ip === "::1" || ip === "0:0:0:0:0:0:0:1" || ip === "::") {
    return true; // IPv6 loopback
  }

  // Check IPv6 unique local addresses (fc00::/7) or link-local (fe80::/10)
  if (ip.toLowerCase().startsWith("fc") || ip.toLowerCase().startsWith("fd") || ip.toLowerCase().startsWith("fe80")) {
    return true;
  }

  // IPv4 mapped IPv6 (e.g. ::ffff:127.0.0.1)
  if (ip.startsWith("::ffff:")) {
    const v4 = ip.replace("::ffff:", "");
    return isPrivateIp(v4);
  }

  return PRIVATE_IPV4_PATTERNS.some((pattern) => pattern.test(ip));
}

/**
 * Validates whether a target URL is safe to retrieve externally.
 * Performs protocol check, hostname validation, and DNS resolution check.
 */
export async function isSafeUrl(rawUrl: string): Promise<{ isSafe: boolean; reason?: string; urlObj?: URL }> {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return { isSafe: false, reason: "Malformed or invalid URL format." };
  }

  // Only permit HTTP and HTTPS
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { isSafe: false, reason: `Disallowed protocol: ${parsed.protocol}. Only http and https are permitted.` };
  }

  const hostname = parsed.hostname.toLowerCase().trim();

  // Check for blocked hostnames
  if (BLOCKED_HOSTNAMES.has(hostname) || hostname.endsWith(".local") || hostname.endsWith(".internal")) {
    return { isSafe: false, reason: `Prohibited hostname: ${hostname}` };
  }

  // If hostname is directly an IP literal
  if (net.isIP(hostname)) {
    if (isPrivateIp(hostname)) {
      return { isSafe: false, reason: `Private or loopback IP address is blocked: ${hostname}` };
    }
    return { isSafe: true, urlObj: parsed };
  }

  // Resolve hostname via DNS to prevent DNS rebinding attacks
  try {
    const lookupResult = await dns.lookup(hostname, { all: true });
    for (const record of lookupResult) {
      if (isPrivateIp(record.address)) {
        return {
          isSafe: false,
          reason: `DNS resolution for ${hostname} resolved to private/restricted IP: ${record.address}`,
        };
      }
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { isSafe: false, reason: `DNS lookup failed for hostname: ${hostname} (${message})` };
  }

  return { isSafe: true, urlObj: parsed };
}
