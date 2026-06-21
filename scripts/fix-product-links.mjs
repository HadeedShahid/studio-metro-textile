/**
 * fix-product-links.mjs
 *
 * Two-pass fix:
 *   1. Strip every "link" mark from the current published body (removing bad
 *      nested-anchor data introduced by the first run).
 *   2. Re-apply internal product links using a guard that skips any span that
 *      already carries a link mark — prevents the <a> inside <a> bug.
 *
 * Run from the studio root:
 *   node scripts/fix-product-links.mjs
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";

const configPath = join(homedir(), ".config", "sanity", "config.json");
const { authToken } = JSON.parse(readFileSync(configPath, "utf-8"));

const client = createClient({
  projectId: "qrdka284",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: authToken,
  useCdn: false,
});

function shortKey() {
  return Math.random().toString(36).slice(2, 9);
}

// ---------------------------------------------------------------------------
// Pass 1: strip all link markDefs and their marks from every block
// ---------------------------------------------------------------------------
function stripAllLinks(body) {
  return body.map((block) => {
    if (block._type !== "block") return block;

    const linkKeys = new Set(
      (block.markDefs ?? [])
        .filter((md) => md._type === "link")
        .map((md) => md._key)
    );
    if (linkKeys.size === 0) return block;

    const children = (block.children ?? []).map((span) => {
      if (span._type !== "span") return span;
      const marks = (span.marks ?? []).filter((m) => !linkKeys.has(m));
      return { ...span, marks };
    });

    const markDefs = (block.markDefs ?? []).filter((md) => md._type !== "link");

    return { ...block, children, markDefs };
  });
}

// ---------------------------------------------------------------------------
// Pass 2: add a link to the FIRST occurrence of `keyword` in a paragraph block,
// but SKIP spans that already carry any link mark (prevents nesting).
// ---------------------------------------------------------------------------
function addLink(body, keyword, href) {
  const re = new RegExp(
    `(${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "i"
  );
  let used = false;

  return body.map((block) => {
    if (used) return block;
    if (block._type !== "block") return block;
    if ((block.style ?? "normal") !== "normal") return block;

    const children = block.children ?? [];
    const newMarkDefs = [...(block.markDefs ?? [])];

    // Collect all link mark keys already on this block so we can guard spans
    const existingLinkKeys = new Set(
      newMarkDefs.filter((md) => md._type === "link").map((md) => md._key)
    );

    let matched = false;
    const newChildren = [];

    for (const span of children) {
      if (matched || span._type !== "span") {
        newChildren.push(span);
        continue;
      }

      // Skip spans that already have a link — prevents nested <a>
      const spanHasLink = (span.marks ?? []).some((m) =>
        existingLinkKeys.has(m)
      );
      if (spanHasLink) {
        newChildren.push(span);
        continue;
      }

      const text = span.text ?? "";
      const m = re.exec(text);

      if (!m) {
        newChildren.push(span);
        continue;
      }

      const linkKey = shortKey();
      const before = text.slice(0, m.index);
      const linked = m[1];
      const after = text.slice(m.index + linked.length);
      const existingMarks = span.marks ?? [];

      if (before) {
        newChildren.push({
          _type: "span",
          _key: shortKey(),
          marks: existingMarks,
          text: before,
        });
      }
      newChildren.push({
        _type: "span",
        _key: shortKey(),
        marks: [...existingMarks, linkKey],
        text: linked,
      });
      if (after) {
        newChildren.push({
          _type: "span",
          _key: shortKey(),
          marks: existingMarks,
          text: after,
        });
      }

      newMarkDefs.push({ _type: "link", _key: linkKey, href });
      existingLinkKeys.add(linkKey); // guard subsequent spans in same block
      matched = true;
      used = true;
    }

    if (!matched) return block;
    return { ...block, children: newChildren, markDefs: newMarkDefs };
  });
}

// ---------------------------------------------------------------------------
// Link definitions per post (specific phrases before generic ones)
// ---------------------------------------------------------------------------
const POSTS = {
  "choosing-zippers-metal-coil-molded": [
    ["metal zippers",          "/products/zippers/metal-zippers"],
    ["molded plastic zippers", "/products/zippers"],
    ["coil zipper",            "/products/zippers"],
    ["zipper",                 "/products/zippers"],
  ],
  "denim-hardware-guide-buttons-rivets": [
    ["shank button",           "/products/buttons/shank-buttons"],
    ["tack button",            "/products/buttons/shank-buttons"],
    ["button",                 "/products/buttons"],
  ],
  "leather-pu-woven-patches-for-denim-branding": [
    ["leather patches",        "/products/patches/leather-patches"],
    ["PU patches",             "/products/patches/pu-patches"],
    ["woven patches",          "/products/patches"],
    ["leather patch",          "/products/patches/leather-patches"],
    ["PU patch",               "/products/patches/pu-patches"],
    ["patch",                  "/products/patches"],
  ],
  "garment-trims-guide-for-apparel-brands": [
    ["metal plates",           "/products/plates"],
    ["zippers",                "/products/zippers"],
    ["buttons",                "/products/buttons"],
    ["buckles",                "/products/buckles"],
    ["patches",                "/products/patches"],
    ["plates",                 "/products/plates"],
  ],
  "compliant-apparel-trims-oeko-tex-reach-nickel": [
    ["buttons",                "/products/buttons"],
    ["zippers",                "/products/zippers"],
    ["buckles",                "/products/buckles"],
    ["patches",                "/products/patches"],
  ],
  "sourcing-apparel-trims-from-asia": [
    ["buttons",                "/products/buttons"],
    ["zippers",                "/products/zippers"],
    ["patches",                "/products/patches"],
    ["buckles",                "/products/buckles"],
  ],
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function run() {
  console.log("Fixing product links (strip → re-apply with guard)…\n");

  for (const [slug, links] of Object.entries(POSTS)) {
    console.log(`── ${slug}`);

    const post = await client.fetch(
      `*[_type == "post" && slug.current == $slug][0]{ _id, title, body }`,
      { slug }
    );

    if (!post) {
      console.log("   ✗ not found — skipping\n");
      continue;
    }

    console.log(`   ${post.title}`);

    // Pass 1: remove any existing link marks
    let body = stripAllLinks(post.body ?? []);
    console.log("   ✓ stripped existing links");

    // Pass 2: re-apply with nesting guard
    for (const [keyword, href] of links) {
      const updated = addLink(body, keyword, href);
      if (JSON.stringify(updated) !== JSON.stringify(body)) {
        console.log(`   + linked "${keyword}" → ${href}`);
        body = updated;
      } else {
        console.log(`   · "${keyword}" not found in paragraphs`);
      }
    }

    await client.patch(post._id).set({ body }).commit();
    console.log(`   ✓ draft saved\n`);
  }

  console.log("Drafts saved. Publishing…\n");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
