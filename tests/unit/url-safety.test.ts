import { describe, it, expect } from "vitest";
import { isPrivateIp, isSafeUrl } from "@/lib/security/url-safety";

describe("SSRF Prevention & URL Safety", () => {
  it("should identify private and loopback IPv4/IPv6 addresses", () => {
    expect(isPrivateIp("127.0.0.1")).toBe(true);
    expect(isPrivateIp("10.0.0.5")).toBe(true);
    expect(isPrivateIp("192.168.1.1")).toBe(true);
    expect(isPrivateIp("172.16.0.1")).toBe(true);
    expect(isPrivateIp("169.254.169.254")).toBe(true);
    expect(isPrivateIp("::1")).toBe(true);

    // Public IPs should not be blocked
    expect(isPrivateIp("8.8.8.8")).toBe(false);
    expect(isPrivateIp("1.1.1.1")).toBe(false);
    expect(isPrivateIp("142.250.190.46")).toBe(false);
  });

  it("should reject disallowed protocols", async () => {
    const fileResult = await isSafeUrl("file:///etc/passwd");
    expect(fileResult.isSafe).toBe(false);

    const ftpResult = await isSafeUrl("ftp://example.com/test");
    expect(ftpResult.isSafe).toBe(false);
  });

  it("should block loopback and cloud metadata hostnames", async () => {
    const localhostResult = await isSafeUrl("http://localhost:3000/api");
    expect(localhostResult.isSafe).toBe(false);

    const metadataResult = await isSafeUrl("http://169.254.169.254/latest/meta-data");
    expect(metadataResult.isSafe).toBe(false);
  });

  it("should accept valid public HTTPS destinations", async () => {
    const googleResult = await isSafeUrl("https://www.google.com");
    expect(googleResult.isSafe).toBe(true);
  });
});
