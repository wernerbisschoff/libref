# Handover: libref fork rebase onto upstream

## State

- Branch: main
- HEAD: local rename commit on top of upstream/main (72a61da)
- Origin: pushed (force) to 39d43e7
- Working tree: clean except HANDOVER.md (untracked)

## What was done

1. Reset fork to upstream/main (72a61da "Version Packages #209").
2. Renamed packages/context -> packages/libref.
3. Updated package name to @wernerbisschoff/libref.
4. Updated registry imports/package.json/tsconfig/Dockerfile from @neuledge/context to @wernerbisschoff/libref.
5. Updated scripts/generate-ingestion-revision.mjs path packages/context -> packages/libref.
6. Made lockedDependency skip missing snapshots (workspace link).
7. Built @wernerbisschoff/libref (dist present).

## What still breaks

- Registry build fails: @wernerbisschoff/libref types not found; RegistryBuildResult shape changed in upstream (missing path/sectionCount/totalTokens).
- Need to adapt registry code to upstream's new BuildResult API.
- Fork features (sitemap, fuzzy query, OOM fix, better-sqlite3 compat, help/guidance) not yet re-applied.

## Key files

- FORK_CHANGES.md: full diff of original fork vs merge-base (2777 lines).
- HANDOVER.md: this file.

## Next steps for next agent

1. Fix registry build: update tsconfig paths and adapt to new RegistryBuildResult.
2. Re-apply fork features from reflog commit 873f6ae.
3. Run pnpm install, build, test.
4. Commit and push to origin.
