import type { BuildResult } from "@wernerbisschoff/libref";

/** Include skipped files so malformed documents are visible to operators. */
export function formatBuilt(result: BuildResult): string {
  const skipped =
    result.skippedFiles > 0 ? `, ${result.skippedFiles} files skipped` : "";
  return `${result.sectionCount} sections, ${result.totalTokens} tokens${skipped}`;
}
