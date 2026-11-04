import { describe, expect, it } from "vitest";
import { bundleMd } from "@/lib/bundle";
import { demoSpec } from "@/lib/demo";
import { InputSchema } from "@/lib/schema";

const input = InputSchema.parse({ text: "plant swap app for neighbours, never finished" });
const spec = demoSpec(input);

describe("bundleMd", () => {
  it("contains exactly one level-1 heading", () => {
    const h1 = bundleMd(spec).match(/^# .+$/gm);
    expect(h1).toHaveLength(1);
    expect(h1![0]).toBe(`# ${spec.projectName}`);
  });

  it("contains a table of contents", () => {
    const md = bundleMd(spec);
    expect(md).toMatch(/## Table of Contents/);
    expect(md).toMatch(/\[Requirements Document\]/);
    expect(md).toMatch(/\[Design Document:/);
    expect(md).toMatch(/\[Implementation Plan\]/);
  });

  it("includes all four content sections", () => {
    const md = bundleMd(spec);
    expect(md).toMatch(/## Requirements Document/);
    expect(md).toMatch(/## Design Document/);
    expect(md).toMatch(/## Implementation Plan/);
    expect(md).toMatch(/## Product/);
    expect(md).toMatch(/## Tech/);
    expect(md).toMatch(/## Structure/);
  });

  it("demotes source document headings by one level", () => {
    const md = bundleMd(spec);
    // requirementsMd starts with "# Requirements Document" → demoted to "## Requirements Document"
    expect(md).toMatch(/^## Requirements Document$/m);
    // designMd starts with "# Design Document:" → demoted to "## Design Document:"
    expect(md).toMatch(/^## Design Document:/m);
    // tasksMd starts with "# Implementation Plan" → demoted to "## Implementation Plan"
    expect(md).toMatch(/^## Implementation Plan$/m);
  });

  it("does not contain any original H1 from the source documents", () => {
    const md = bundleMd(spec);
    // The only H1 should be the project name; source doc H1s must be demoted to H2
    const h1s = md.match(/^# .+$/gm);
    expect(h1s).toHaveLength(1);
    expect(h1s![0]).toBe(`# ${spec.projectName}`);
  });

  it("is pure: same input produces identical output", () => {
    const a = bundleMd(spec);
    const b = bundleMd(spec);
    expect(a).toBe(b);
  });

  it("includes the epitaph after the title", () => {
    const md = bundleMd(spec);
    expect(md).toContain(`> ⚰️ ${spec.epitaph}`);
  });
});
