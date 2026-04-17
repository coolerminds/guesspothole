import type { IncomingMessage } from "http";

const DEFAULT_SITE_URL = "https://www.artifactmotion.com";

function readHeaderValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0]?.split(",")[0]?.trim();
  }

  return value?.split(",")[0]?.trim();
}

function normalizeSiteUrl(value: string | undefined) {
  const trimmed = value?.trim().replace(/\/+$/, "");

  if (!trimmed) {
    return "";
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function isLocalHost(host: string) {
  return (
    host.startsWith("localhost") ||
    host.startsWith("127.0.0.1") ||
    host.startsWith("0.0.0.0") ||
    host.startsWith("[::1]")
  );
}

export function resolveSiteUrl(req?: IncomingMessage) {
  const configuredUrl = normalizeSiteUrl(
    process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL
  );

  if (configuredUrl) {
    return configuredUrl;
  }

  if (!req) {
    return DEFAULT_SITE_URL;
  }

  const forwardedProto = readHeaderValue(req.headers["x-forwarded-proto"]);
  const forwardedHost = readHeaderValue(req.headers["x-forwarded-host"]);
  const host = forwardedHost || readHeaderValue(req.headers.host);
  const protocol = forwardedProto || (req.socket.encrypted ? "https" : "http");

  if (!host) {
    return DEFAULT_SITE_URL;
  }

  if (isLocalHost(host)) {
    return `${protocol}://${host}`;
  }

  // Default to the canonical production host unless explicitly overridden.
  return DEFAULT_SITE_URL;
}
