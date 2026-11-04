import type { Spec } from "./schema";
import { requirementsMd, designMd, tasksMd } from "./markdown";

/** Demote every markdown heading in a block by one level (add one #). */
function demoteHeadings(md: string): string {
  return md.replace(/^(#{1,5})\s/gm, "#$1 ");
}

/** Generate a GitHub-style anchor slug from heading text. */
function anchor(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");
}

/**
 * Combine a spec into a single markdown document with a table of contents.
 * Each per-document renderer's headings are demoted by one level so the bundle
 * has exactly one level-1 heading (the project name).
 */
export function bundleMd(spec: Spec): string {
  const tocItems = [
    "Requirements Document",
    `Design Document: ${spec.projectName}`,
    "Implementation Plan",
    "Product",
    "Tech",
    "Structure",
  ];

  const toc = tocItems.map((t) => `- [${t}](#${anchor(t)})`).join("\n");

  return [
    `# ${spec.projectName}`,
    "",
    `> ⚰️ ${spec.epitaph}`,
    "",
    "## Table of Contents",
    "",
    toc,
    "",
    demoteHeadings(requirementsMd(spec)),
    "",
    demoteHeadings(designMd(spec)),
    "",
    demoteHeadings(tasksMd(spec)),
    "",
    "## Product",
    "",
    spec.steering.product,
    "",
    "## Tech",
    "",
    spec.steering.tech,
    "",
    "## Structure",
    "",
    spec.steering.structure,
    "",
  ].join("\n");
}
