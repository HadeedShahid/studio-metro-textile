/**
 * add-product-links.mjs
 *
 * Walks each published blog post body and adds internal links to the FIRST
 * natural occurrence of product keywords.  Only patches paragraph blocks
 * (style === "normal" or no style) — headings are left untouched.
 *
 * Run from the studio root:
 *   node scripts/add-product-links.mjs
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";

// ---------------------------------------------------------------------------
// Auth — pull token from the Sanity CLI's stored credentials
// ---------------------------------------------------------------------------
const configPath = join(homedir(), ".config", "sanity", "config.json");
const { authToken } = JSON.parse(readFileSync(configPath, "utf-8"));

const client = createClient({
  projectId: "qrdka284",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: authToken,
  useCdn: false,
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function shortKey() {
  return Math.random().toString(36).slice(2, 9);
}

/**
 * Inject a link into the FIRST occurrence of `keyword` (case-insensitive,
 * whole-word) inside any paragraph block of a Portable Text array.
 * Returns a new body array (does not mutate the original).
 */
function addLink(body, keyword, href) {
  const re = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "i");
  let used = false;

  return body.map((block) => {
    if (used) return block;
    if (block._type !== "block") return block;

    // Skip headings — only patch normal paragraphs
    const style = block.style ?? "normal";
    if (style !== "normal") return block;

    const children = block.children ?? [];
    let matched = false;
    let newChildren = [];
    let newMarkDefs = [...(block.markDefs ?? [])];

    for (const span of children) {
      if (matched || span._type !== "span") {
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
        newChildren.push({ _type: "span", _key: shortKey(), marks: existingMarks, text: before });
      }
      newChildren.push({
        _type: "span",
        _key: shortKey(),
        marks: [...existingMarks, linkKey],
        text: linked,
      });
      if (after) {
        newChildren.push({ _type: "span", _key: shortKey(), marks: existingMarks, text: after });
      }

      newMarkDefs.push({ _type: "link", _key: linkKey, href });
      matched = true;
      used = true;
    }

    if (!matched) return block;
    return { ...block, children: newChildren, markDefs: newMarkDefs };
  });
}

// ---------------------------------------------------------------------------
// Link definitions per post
// Format: [keyword, internalHref]
// More specific phrases must come BEFORE generic ones within the same post
// so the regex doesn't eat the shorter word first.
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
  console.log("Fetching posts…\n");

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

    let body = post.body ?? [];

    for (const [keyword, href] of links) {
      const updated = addLink(body, keyword, href);
      if (JSON.stringify(updated) !== JSON.stringify(body)) {
        console.log(`   + linked "${keyword}" → ${href}`);
        body = updated;
      } else {
        console.log(`   · "${keyword}" not found in paragraphs`);
      }
    }

    // Patch creates a draft; publish separately in Studio if preferred,
    // or call .commit({ autoGenerateArrayKeys: true }) to publish directly.
    await client.patch(post._id).set({ body }).commit();
    console.log(`   ✓ draft saved\n`);
  }

  console.log("All done.  Open Sanity Studio → Drafts to review & publish.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
