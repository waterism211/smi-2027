// Checks the built site: every internal link and anchor resolves and every image has alt
// text. With --external, it also requests each external https link.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, posix } from "node:path";

const SITE_DIR = "_site";
const prefix = (process.env.PATH_PREFIX || "/").replace(/\/?$/, "/");
const checkExternal = process.argv.includes("--external");

if (!existsSync(SITE_DIR)) {
  console.error(`${SITE_DIR} does not exist. Run the build first.`);
  process.exit(1);
}

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

const htmlFiles = walk(SITE_DIR).filter((file) => file.endsWith(".html"));
const idsFor = (file) =>
  new Set([...readFileSync(file, "utf8").matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));

const errors = [];
const external = new Map();
// These statuses usually mean a site blocks scripts, so a person must check the link.
const BLOCKS_BOTS = [401, 403, 429];
const unverified = [];

function resolveFile(path) {
  const relative = path.replace(/^\/+/, "");
  const candidate = join(SITE_DIR, relative);
  if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  const index = join(candidate, "index.html");
  return existsSync(index) ? index : null;
}

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  const where = file.slice(SITE_DIR.length + 1);
  const currentUrl = `/${where.replace(/index\.html$/, "")}`;

  for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt="/.test(tag)) errors.push(`${where}: image without alt text: ${tag}`);
  }

  for (const [, raw] of html.matchAll(/\s(?:href|src)="([^"]*)"/g)) {
    const url = raw.replaceAll("&amp;", "&");
    if (url === "" || url === "#") {
      errors.push(`${where}: empty link "${raw}"`);
    } else if (/^https?:\/\//.test(url)) {
      if (!url.startsWith("https://")) errors.push(`${where}: insecure link ${url}`);
      external.set(url, where);
    } else if (!url.startsWith("mailto:")) {
      const [pathPart, anchor] = url.split("#");
      let target = currentUrl;
      if (pathPart.startsWith("/")) {
        if (!pathPart.startsWith(prefix)) {
          errors.push(`${where}: link ${url} is missing path prefix ${prefix}`);
          continue;
        }
        target = `/${pathPart.slice(prefix.length)}`;
      } else if (pathPart) {
        target = posix.join(currentUrl, pathPart);
      }
      const targetFile = resolveFile(target);
      if (!targetFile) {
        errors.push(`${where}: broken link ${url}`);
      } else if (anchor && !idsFor(targetFile).has(anchor)) {
        errors.push(`${where}: missing anchor ${url}`);
      }
    }
  }
}

if (checkExternal) {
  const results = await Promise.all(
    [...external].map(async ([url, where]) => {
      try {
        const response = await fetch(url, {
          redirect: "follow",
          signal: AbortSignal.timeout(20000),
          headers: { "User-Agent": "Mozilla/5.0 (compatible; smi-2027-link-check)" },
        });
        if (BLOCKS_BOTS.includes(response.status)) {
          unverified.push(`${url} returned HTTP ${response.status}`);
          return null;
        }
        return response.ok ? null : `${where}: ${url} returned HTTP ${response.status}`;
      } catch (error) {
        return `${where}: ${url} failed: ${error.cause?.code ?? error.message}`;
      }
    }),
  );
  errors.push(...results.filter(Boolean));
}

if (unverified.length) {
  console.warn(`Check these ${unverified.length} link(s) in a browser, because the sites blocked the script:`);
  unverified.forEach((message) => console.warn(`  - ${message}`));
}

if (errors.length) {
  console.error(`Link check failed with ${errors.length} problem(s):`);
  errors.forEach((error) => console.error(`  - ${error}`));
  process.exit(1);
}
console.log(
  `Link check passed: ${htmlFiles.length} pages, ${external.size} external links ` +
    (checkExternal ? "requested." : "not requested."),
);
