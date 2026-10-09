type OriginConfig = {
  appUrl?: string;
  deploymentUrl?: string;
  branchUrl?: string;
  productionUrl?: string;
  production?: boolean;
};

function originOf(value: string | undefined, production: boolean) {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.username || url.password || !["http:", "https:"].includes(url.protocol)) return null;
    if (production && url.protocol !== "https:") return null;
    return url.origin;
  } catch { return null; }
}

export function isAllowedRequestOrigin(requestUrl: string, origin: string | null, config: OriginConfig = {}) {
  if (!origin || origin === "null") return false;
  const production = config.production ?? false;
  const normalized = originOf(origin, production);
  if (!normalized || normalized !== origin) return false;
  const candidates = [requestUrl, config.appUrl, ...[config.deploymentUrl, config.branchUrl, config.productionUrl].filter(Boolean).map(host => `https://${host}`)];
  return candidates.some(candidate => originOf(candidate, production) === normalized);
}
