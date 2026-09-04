import {
  lookup,
} from "node:dns/promises";

import {
  isIP,
} from "node:net";

const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "localhost.localdomain",
]);

const BLOCKED_HOSTNAME_SUFFIXES = [
  ".localhost",
  ".local",
  ".internal",
  ".home",
  ".lan",
];

export class UnsafeUrlError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnsafeUrlError";
  }
}

function normalizeHostname(
  hostname: string
): string {
  return hostname
    .toLowerCase()
    .replace(/^\[/, "")
    .replace(/\]$/, "")
    .replace(/\.$/, "");
}

function isBlockedHostname(
  hostname: string
): boolean {
  if (BLOCKED_HOSTNAMES.has(hostname)) {
    return true;
  }

  return BLOCKED_HOSTNAME_SUFFIXES.some(
    (suffix) => hostname.endsWith(suffix)
  );
}

function isBlockedIPv4(
  address: string
): boolean {
  const parts = address
    .split(".")
    .map(Number);

  if (
    parts.length !== 4 ||
    parts.some(
      (part) =>
        !Number.isInteger(part) ||
        part < 0 ||
        part > 255
    )
  ) {
    return true;
  }

  const [first, second, third] = parts;

  return (
    first === 0 ||
    first === 10 ||
    first === 127 ||

    /*
     * 100.64.0.0/10 :
     * Carrier-grade NAT.
     */
    (first === 100 &&
      second >= 64 &&
      second <= 127) ||

    /*
     * 169.254.0.0/16 :
     * Link-local.
     */
    (first === 169 &&
      second === 254) ||

    /*
     * 172.16.0.0/12 :
     * Réseau privé.
     */
    (first === 172 &&
      second >= 16 &&
      second <= 31) ||

    /*
     * Plages réservées et documentation.
     */
    (first === 192 &&
      second === 0 &&
      third === 0) ||

    (first === 192 &&
      second === 0 &&
      third === 2) ||

    /*
     * 192.168.0.0/16 :
     * Réseau privé.
     */
    (first === 192 &&
      second === 168) ||

    /*
     * 198.18.0.0/15 :
     * Tests réseau.
     */
    (first === 198 &&
      (second === 18 ||
        second === 19)) ||

    /*
     * 198.51.100.0/24 :
     * Documentation.
     */
    (first === 198 &&
      second === 51 &&
      third === 100) ||

    /*
     * 203.0.113.0/24 :
     * Documentation.
     */
    (first === 203 &&
      second === 0 &&
      third === 113) ||

    /*
     * Multicast et plages réservées.
     */
    first >= 224
  );
}

function isBlockedIPv6(
  address: string
): boolean {
  const normalized = address
    .toLowerCase()
    .split("%")[0];

  /*
   * Adresses non spécifiées,
   * loopback et IPv4 mappées.
   */
  if (
    normalized === "::" ||
    normalized === "::1" ||
    normalized.startsWith("::ffff:") ||
    normalized.startsWith("::")
  ) {
    return true;
  }

  const firstSegment = Number.parseInt(
    normalized.split(":")[0],
    16
  );

  if (Number.isNaN(firstSegment)) {
    return true;
  }

  /*
   * fc00::/7 :
   * Réseau privé IPv6.
   */
  if (
    (firstSegment & 0xfe00) === 0xfc00
  ) {
    return true;
  }

  /*
   * fe80::/10 :
   * Link-local IPv6.
   */
  if (
    (firstSegment & 0xffc0) === 0xfe80
  ) {
    return true;
  }

  /*
   * ff00::/8 :
   * Multicast IPv6.
   */
  if (
    (firstSegment & 0xff00) === 0xff00
  ) {
    return true;
  }

  /*
   * 2001:db8::/32 :
   * Documentation IPv6.
   */
  if (
    normalized.startsWith("2001:db8:")
  ) {
    return true;
  }

  return false;
}

function isBlockedAddress(
  address: string
): boolean {
  const version = isIP(address);

  if (version === 4) {
    return isBlockedIPv4(address);
  }

  if (version === 6) {
    return isBlockedIPv6(address);
  }

  return true;
}

export async function assertSafePublicUrl(
  value: string
): Promise<URL> {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(value);
  } catch {
    throw new UnsafeUrlError(
      "The supplied URL is invalid."
    );
  }

  /*
   * Seules les URLs Web classiques
   * sont autorisées.
   */
  if (
    parsedUrl.protocol !== "http:" &&
    parsedUrl.protocol !== "https:"
  ) {
    throw new UnsafeUrlError(
      "Only HTTP and HTTPS URLs are supported."
    );
  }

  /*
   * Refuse les URLs du type :
   * https://username:password@example.com
   */
  if (
    parsedUrl.username ||
    parsedUrl.password
  ) {
    throw new UnsafeUrlError(
      "URLs containing credentials are not allowed."
    );
  }

  const hostname = normalizeHostname(
    parsedUrl.hostname
  );

  if (
    !hostname ||
    isBlockedHostname(hostname)
  ) {
    throw new UnsafeUrlError(
      "Local or private hostnames are not allowed."
    );
  }

  /*
   * Si l’hôte est déjà une adresse IP,
   * elle est contrôlée directement.
   */
  const hostnameIpVersion = isIP(hostname);

  if (hostnameIpVersion !== 0) {
    if (isBlockedAddress(hostname)) {
      throw new UnsafeUrlError(
        "Private or reserved IP addresses are not allowed."
      );
    }

    return parsedUrl;
  }

  /*
   * Si l’hôte est un domaine, toutes les
   * adresses retournées par le DNS sont
   * inspectées.
   */
  let addresses: Array<{
    address: string;
    family: number;
  }>;

  try {
    addresses = await lookup(hostname, {
      all: true,
      verbatim: true,
    });
  } catch {
    throw new UnsafeUrlError(
      "The hostname could not be resolved."
    );
  }

  if (addresses.length === 0) {
    throw new UnsafeUrlError(
      "The hostname did not resolve to an IP address."
    );
  }

  /*
   * Le domaine est refusé dès qu’une de ses
   * adresses DNS pointe vers une plage privée
   * ou réservée.
   */
  for (const result of addresses) {
    if (isBlockedAddress(result.address)) {
      throw new UnsafeUrlError(
        "The hostname resolves to a private or reserved IP address."
      );
    }
  }

  return parsedUrl;
}