# Handover: libref fork rebase onto upstream

## State

- Branch: main
- Base: upstream/main 72a61da, plus the fork rename commit 39d43e7.
- HEAD: libref fork features re-applied on top (see commits below).
- Origin: ready to push. main descends from origin/main, so the push is a fast-forward (no force).
- Build, test, and lint pass.

## What was done

1. Reset fork to upstream/main (72a61da), renamed packages/context -> packages/libref, and set package name @wernerbisschoff/libref.
2. Fixed the registry build: scripts/generate-ingestion-revision.mjs paths, registry tsconfig/imports, and lockedDependency skip for missing snapshots.
3. Re-applied these fork features by cherry-pick or hand-port:
   - better-sqlite3 compatibility (database.ts initDatabase probe).
   - fuzzy package resolution (resolve-package.ts, wired into query and get_docs).
   - sitemap.xml fallback for websites without llms.txt (sitemap.ts).
   - add help/guidance text.
   - libref naming in config dir (config.ts, auth.ts, download.ts, cli.ts).
4. Updated package identity: bin "libref", mcpName, description, repository, server.json, README.
5. Upstream already has the fork's hex registry, tag-skip publish, and OOM fix, so those commits were not re-applied.

## Key files

- FORK_CHANGES.md: full diff of the original fork vs merge-base (2777 lines).
- HANDOVER.md: this file.
- packages/libref/src/resolve-package.ts, sitemap.ts: ported features.
- packages/libref/src/database.ts: better-sqlite3 probe.
- scripts/generate-ingestion-revision.mjs: libref paths.

## Next steps

1. Run `pnpm install`, `pnpm build`, `pnpm test`, `pnpm lint` (all green before handover).
2. Push main to origin (fast-forward).
3. Decide whether to version-bump. Versions stay at upstream 1.3.7 / registry 0.0.32; the fork rebrand was a major bump in the old fork (2.x). Add a changeset if a release is needed.
