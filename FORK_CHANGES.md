# Fork Changes Handover

Merge-base: 6a1ff8fcdfc2c99fcb135c3a72ef8a930f008d77
Upstream HEAD: 72a61da83a521dacccf5d5ec6e0250e089627e24
Fork HEAD (before reset): 873f6aef1e0bb81c81bc746f753a1e503f6a71c5

## Commits on fork not in upstream

95005dc feat(registry): add hex registry support for elixir, phoenix, and liveview
115a552 chore(pr-review): apply feedback from PR #95
e668421 fix(registry): skip publish when git tag not pushed yet (#96)
09c7b27 Version Packages (#97)
e68fc6a feat!: rebrand to libref
d23738b feat(libref): add sitemap.xml fallback for websites without llms.txt
2907599 chore(libref): rename remaining user-facing strings from context to libref
1f111b9 fix(libref): verify better-sqlite3 binary compatibility before use
b7a43b2 Version Packages
ccd8e4f fix(libref): prevent OOM crash on large llms-full.txt files
f7891b4 Version Packages
c28d1a8 chore: add changeset and release tasks to mise
06c98b0 feat(libref): accept fuzzy package names in query
c413d04 chore: version packages
3fc907e feat(libref): surface add sources in help and guidance
873f6ae chore(libref)!: rename npm scope from @wbisschoff13 to @wernerbisschoff

## Files changed

 .changeset/config.json                             |   5 +-
 .changeset/improve-add-help-and-list-guidance.md   |   6 +
 ...rename-scope-wbisschoff13-to-wernerbisschoff.md |   5 +
 .gitignore                                         |   1 +
 .mise.toml                                         |  24 +++
 README.md                                          |   2 +-
 packages/{context => libref}/CHANGELOG.md          |   6 +
 packages/{context => libref}/Dockerfile            |   4 +-
 packages/{context => libref}/README.md             | 217 ++++++++++----------
 .../{context => libref}/assets/ai-sdk-demo.gif     |   0
 packages/{context => libref}/package.json          |  18 +-
 packages/{context => libref}/src/auth.test.ts      |   0
 packages/{context => libref}/src/auth.ts           |   6 +-
 packages/{context => libref}/src/build.test.ts     |   0
 packages/{context => libref}/src/build.ts          |   0
 packages/{context => libref}/src/cli.test.ts       | 222 +++++++++++++++++++++
 packages/{context => libref}/src/cli.ts            | 201 +++++++++++++------
 packages/{context => libref}/src/config.ts         |   6 +-
 packages/{context => libref}/src/database.ts       |   4 +-
 packages/{context => libref}/src/db.ts             |   0
 packages/{context => libref}/src/download.ts       |   2 +-
 packages/{context => libref}/src/extract-html.ts   |   0
 packages/{context => libref}/src/fetch.ts          |   0
 packages/{context => libref}/src/git.test.ts       |  22 ++
 packages/{context => libref}/src/git.ts            |  19 ++
 packages/{context => libref}/src/guidance.ts       |   4 +-
 packages/{context => libref}/src/html.ts           |   0
 packages/{context => libref}/src/index.ts          |   1 +
 packages/{context => libref}/src/llms-txt.test.ts  |   0
 packages/{context => libref}/src/llms-txt.ts       |   0
 .../src/package-builder.test.ts                    | 120 ++++++++++-
 .../{context => libref}/src/package-builder.ts     |  44 +++-
 packages/libref/src/resolve-package.ts             | 131 ++++++++++++
 packages/{context => libref}/src/search.test.ts    |   0
 packages/{context => libref}/src/search.ts         |   0
 packages/{context => libref}/src/server.test.ts    |   2 +-
 packages/{context => libref}/src/server.ts         |   3 +-
 .../src/server.workflow.test.ts                    |   0
 packages/libref/src/sitemap.test.ts                | 207 +++++++++++++++++++
 packages/libref/src/sitemap.ts                     | 170 ++++++++++++++++
 packages/{context => libref}/src/sql.js.d.ts       |   0
 packages/{context => libref}/src/store.test.ts     |   0
 packages/{context => libref}/src/store.ts          |   0
 packages/{context => libref}/src/test-utils.ts     |   0
 packages/{context => libref}/tsconfig.build.json   |   0
 packages/{context => libref}/tsconfig.json         |   4 +-
 packages/{context => libref}/vitest.config.ts      |   0
 packages/registry/CHANGELOG.md                     |   7 +
 packages/registry/package.json                     |   4 +-
 packages/registry/src/build.ts                     |   4 +-
 packages/registry/src/cli.ts                       |   8 +
 packages/registry/src/version-check.test.ts        |  27 +++
 packages/registry/src/version-check.ts             |  26 ++-
 pnpm-lock.yaml                                     |   6 +-
 registry/hex/elixir.yaml                           |   8 +
 registry/hex/phoenix.yaml                          |  11 +
 registry/hex/phoenix_live_view.yaml                |  11 +
 server.json                                        |   6 +-
 58 files changed, 1362 insertions(+), 212 deletions(-)

## Full diff

diff --git a/.changeset/config.json b/.changeset/config.json
index 2373aa7..148bf98 100644
--- a/.changeset/config.json
+++ b/.changeset/config.json
@@ -1,9 +1,6 @@
 {
   "$schema": "https://unpkg.com/@changesets/config@3.1.2/schema.json",
-  "changelog": [
-    "@changesets/changelog-github",
-    { "repo": "neuledge/context" }
-  ],
+  "changelog": false,
   "commit": false,
   "fixed": [],
   "linked": [],
diff --git a/.changeset/improve-add-help-and-list-guidance.md b/.changeset/improve-add-help-and-list-guidance.md
new file mode 100644
index 0000000..6d0edf1
--- /dev/null
+++ b/.changeset/improve-add-help-and-list-guidance.md
@@ -0,0 +1,6 @@
+---
+"@wernerbisschoff/libref": patch
+---
+
+- `libref list` now directs users to `libref add <source>` (URL, GitHub repo, website, or local .db file) instead of only mentioning a local .db file.
+- `libref add --help` (and the `add` row in `libref --help`) now makes the website fallback chain explicit: any website URL works — libref auto-fetches `llms.txt`, then falls back to `sitemap.xml`. The MCP tool descriptions shown to agents (`search_packages`, `MISSING_PACKAGE_GUIDANCE`) say the same.
diff --git a/.changeset/rename-scope-wbisschoff13-to-wernerbisschoff.md b/.changeset/rename-scope-wbisschoff13-to-wernerbisschoff.md
new file mode 100644
index 0000000..dfe40b0
--- /dev/null
+++ b/.changeset/rename-scope-wbisschoff13-to-wernerbisschoff.md
@@ -0,0 +1,5 @@
+---
+"@wernerbisschoff/libref": major
+---
+
+- Renamed the npm scope from `@wbisschoff13` to `@wernerbisschoff`. Install with `npm install -g @wernerbisschoff/libref`. The `@wbisschoff13/libref` package is no longer updated — pin to `@wernerbisschoff/libref` for new releases.
diff --git a/.gitignore b/.gitignore
index 0082e76..f4fe360 100644
--- a/.gitignore
+++ b/.gitignore
@@ -11,3 +11,4 @@ node_modules
 # sensitive stuff
 .env
 .mcpregistry_*
+.opencode/index
diff --git a/.mise.toml b/.mise.toml
new file mode 100644
index 0000000..894af43
--- /dev/null
+++ b/.mise.toml
@@ -0,0 +1,24 @@
+[tools]
+node = "22"
+pnpm = "10.27.0"
+
+[tasks.setup]
+description = "Full dev setup: install tools, deps, build, link libref CLI"
+run = """
+mise install
+pnpm install
+pnpm --filter @wernerbisschoff/libref build
+(cd packages/libref && pnpm link --global)
+"""
+
+[tasks.changeset]
+description = "Create a new changeset for the next release"
+run = "pnpm changeset"
+
+[tasks.release]
+description = "Build, publish libref to npm, and create git tags"
+run = """
+pnpm --filter @wernerbisschoff/libref build
+pnpm --filter @wernerbisschoff/libref publish
+pnpm tags
+"""
diff --git a/README.md b/README.md
index 7d32893..1052ec0 120000
--- a/README.md
+++ b/README.md
@@ -1 +1 @@
-packages/context/README.md
\ No newline at end of file
+packages/libref/README.md
\ No newline at end of file
diff --git a/packages/context/CHANGELOG.md b/packages/libref/CHANGELOG.md
similarity index 96%
rename from packages/context/CHANGELOG.md
rename to packages/libref/CHANGELOG.md
index 7e8746b..04d2255 100644
--- a/packages/context/CHANGELOG.md
+++ b/packages/libref/CHANGELOG.md
@@ -1,5 +1,11 @@
 # @neuledge/context
 
+## 1.2.0
+
+### Minor Changes
+
+- [#96](https://github.com/neuledge/context/pull/96) [`45319fc`](https://github.com/neuledge/context/commit/45319fc6bbf0cb4695c26a221d0fac5dea745682) Thanks [@moshest](https://github.com/moshest)! - Add `isMissingRefError` helper to detect git "ref not found" errors (e.g. when a registry publishes a version before its git tag is pushed)
+
 ## 1.1.2
 
 ### Patch Changes
diff --git a/packages/context/Dockerfile b/packages/libref/Dockerfile
similarity index 83%
rename from packages/context/Dockerfile
rename to packages/libref/Dockerfile
index 008acab..c61f9ae 100644
--- a/packages/context/Dockerfile
+++ b/packages/libref/Dockerfile
@@ -9,8 +9,8 @@ COPY . .
 # (and the --ignore-scripts trap that left the .node file missing).
 RUN corepack enable \
   && pnpm install --frozen-lockfile \
-  && pnpm --filter @neuledge/context build \
-  && pnpm --filter @neuledge/context deploy --prod --legacy /deploy
+  && pnpm --filter @wernerbisschoff/libref build \
+  && pnpm --filter @wernerbisschoff/libref deploy --prod --legacy /deploy
 
 
 FROM node:22-bookworm-slim AS runtime
diff --git a/packages/context/README.md b/packages/libref/README.md
similarity index 63%
rename from packages/context/README.md
rename to packages/libref/README.md
index c2d3e55..1395544 100644
--- a/packages/context/README.md
+++ b/packages/libref/README.md
@@ -1,13 +1,13 @@
 <p align="center">
-  <h1 align="center">Context</h1>
+  <h1 align="center">Libref</h1>
   <p align="center">
     <strong>Up-to-date docs for AI agents — local, instant, plug and play.</strong>
   </p>
 </p>
 
 <p align="center">
-  <a href="https://www.npmjs.com/package/@neuledge/context"><img src="https://img.shields.io/npm/v/@neuledge/context.svg" alt="npm version"></a>
-  <a href="https://github.com/neuledge/context/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-Apache--2.0-blue.svg" alt="License"></a>
+<a href="https://www.npmjs.com/package/@wernerbisschoff/libref"><img src="https://img.shields.io/npm/v/@wernerbisschoff/libref.svg" alt="npm version"></a>
+<a href="https://github.com/wernerbisschoff/libref/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-Apache--2.0-blue.svg" alt="License"></a>
   <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.0-blue.svg" alt="TypeScript"></a>
 </p>
 
@@ -27,12 +27,12 @@ The fix isn't better prompting. It's giving your AI the right docs.
 
 ## How It Works
 
-Context is an MCP server backed by a [community-driven package registry](registry/) with **100+ popular libraries** already built and ready to use. When your AI agent needs documentation, it searches the registry, downloads the right package, and queries it locally — all automatically.
+Libref is an MCP server backed by a [community-driven package registry](registry/) with **100+ popular libraries** already built and ready to use. When your AI agent needs documentation, it searches the registry, downloads the right package, and queries it locally — all automatically.
 
 **Install once. Configure once. Then just ask your AI.**
 
 <p align="center">
-  <img src="https://media.githubusercontent.com/media/neuledge/context/main/packages/context/assets/ai-sdk-demo.gif" alt="Context demo" width="800">
+<img src="https://media.githubusercontent.com/media/wernerbisschoff/libref/main/packages/libref/assets/ai-sdk-demo.gif" alt="Libref demo" width="800">
 </p>
 
 ---
@@ -42,18 +42,18 @@ Context is an MCP server backed by a [community-driven package registry](registr
 ### 1. Install
 
 ```bash
-npm install -g @neuledge/context
+npm install -g @wernerbisschoff/libref
 ```
 
 ### 2. Connect to your AI agent
 
-Context works with any MCP-compatible agent. Pick yours:
+Libref works with any MCP-compatible agent. Pick yours:
 
 <details>
 <summary><strong>Claude Code</strong></summary>
 
 ```bash
-claude mcp add context -- context serve
+claude mcp add libref -- libref serve
 ```
 
 </details>
@@ -69,8 +69,8 @@ Add to your config file:
 ```json
 {
   "mcpServers": {
-    "context": {
-      "command": "context",
+    "libref": {
+      "command": "libref",
       "args": ["serve"]
     }
   }
@@ -89,8 +89,8 @@ Add to `~/.cursor/mcp.json` (global) or `.cursor/mcp.json` (project-specific):
 ```json
 {
   "mcpServers": {
-    "context": {
-      "command": "context",
+    "libref": {
+      "command": "libref",
       "args": ["serve"]
     }
   }
@@ -107,14 +107,14 @@ Or use **Settings > Developer > Edit Config** to add the server through the UI.
 Either use the CLI
 
 ```bash
-codex mcp add context -- context serve
+codex mcp add libref -- libref serve
 ```
 
 Or add to `~/.codex/config.toml` (global) or `.codex/config.toml` (project-specific):
 
 ```toml
-[mcp_servers.context]
-command = "context"
+[mcp_servers.libref]
+command = "libref"
 args = ["serve"]
 ```
 
@@ -132,9 +132,9 @@ Add to `.vscode/mcp.json` in your workspace:
 ```json
 {
   "servers": {
-    "context": {
+    "libref": {
       "type": "stdio",
-      "command": "context",
+      "command": "libref",
       "args": ["serve"]
     }
   }
@@ -154,8 +154,8 @@ Add to `~/.codeium/windsurf/mcp_config.json`:
 ```json
 {
   "mcpServers": {
-    "context": {
-      "command": "context",
+    "libref": {
+      "command": "libref",
       "args": ["serve"]
     }
   }
@@ -174,9 +174,9 @@ Add to your Zed `settings.json` (press `cmd+,` or `ctrl+,` twice):
 ```json
 {
   "context_servers": {
-    "context": {
+    "libref": {
       "command": {
-        "path": "context",
+        "path": "libref",
         "args": ["serve"]
       }
     }
@@ -195,9 +195,9 @@ Run `goose configure` and select **Command-line Extension**, or add directly to
 
 ```yaml
 extensions:
-  context:
+  libref:
     type: stdio
-    command: context
+    command: libref
     args:
       - serve
     timeout: 300
@@ -214,8 +214,8 @@ Add to `~/.config/opencode/opencode.json`:
 ```json
 {
   "mcp": {
-    "context": {
-      "command": ["context", "serve"],
+    "libref": {
+      "command": ["libref", "serve"],
       "enabled": true,
       "type": "local"
     }
@@ -231,13 +231,13 @@ That's it. Just ask:
 
 > "How do I create middleware in Next.js?"
 
-Your agent searches the [community registry](registry/), downloads the docs, and answers with accurate, version-specific information. Everything happens automatically — no manual `context install` needed for registry packages.
+Your agent searches the [community registry](registry/), downloads the docs, and answers with accurate, version-specific information. Everything happens automatically — no manual `libref install` needed for registry packages.
 
 ---
 
 ## The Community Registry
 
-The registry is what makes Context plug and play. It's a growing collection of **100+ pre-built documentation packages** maintained by the community. Think of it like a package manager, but for AI-ready docs.
+The registry is what makes Libref plug and play. It's a growing collection of **100+ pre-built documentation packages** maintained by the community. Think of it like a package manager, but for AI-ready docs.
 
 **Popular packages available today:**
 
@@ -253,13 +253,13 @@ The registry is what makes Context plug and play. It's a growing collection of *
 
 [Browse the full registry →](registry/)
 
-**Anyone can contribute.** If a library you use isn't listed, [submit a PR](registry/) to add it — your contribution helps every Context user.
+**Anyone can contribute.** If a library you use isn't listed, [submit a PR](registry/) to add it — your contribution helps every Libref user.
 
 ---
 
 ## Why Local?
 
-Context runs entirely on your machine. Docs are downloaded once and stored as compact SQLite databases in `~/.context/packages/`. After that, everything is local.
+Libref runs entirely on your machine. Docs are downloaded once and stored as compact SQLite databases in `~/.libref/packages/`. After that, everything is local.
 
 - **Fast** — Local SQLite queries return in under 10ms
 - **Offline** — Works on flights, in coffee shops, anywhere
@@ -271,85 +271,85 @@ Context runs entirely on your machine. Docs are downloaded once and stored as co
 
 ## Beyond the Registry
 
-The registry covers popular open-source libraries, but Context also works with any documentation source. Use `context add` to build packages from private repos, internal libraries, websites with [llms.txt](https://llmstxt.org/), or anything not yet in the registry.
+The registry covers popular open-source libraries, but Libref also works with any documentation source. Use `libref add` to build packages from private repos, internal libraries, websites with [llms.txt](https://llmstxt.org/), or anything not yet in the registry.
 
 ```bash
 # Build from a git repository
-context add https://github.com/your-company/design-system
+libref add https://github.com/your-company/design-system
 
 # Build from a local directory
-context add ./my-project
+libref add ./my-project
 
 # Specific version tag
-context add https://github.com/vercel/next.js/tree/v16.0.0
+libref add https://github.com/vercel/next.js/tree/v16.0.0
 
 # Build from a website's llms.txt
-context add https://svelte.dev
+libref add https://svelte.dev
 ```
 
 Once built, share packages with your team — they're portable `.db` files that install instantly:
 
 ```bash
 # Export a package
-context add ./my-project --name my-lib --pkg-version 2.0 --save ./packages/
+libref add ./my-project --name my-lib --pkg-version 2.0 --save ./packages/
 
 # Teammate installs it (no build step needed)
-context add ./packages/my-lib@2.0.db
+libref add ./packages/my-lib@2.0.db
 ```
 
 ---
 
 ## :whale: Docker
 
-Run Context as a containerized HTTP server for multi-client or Kubernetes deployments:
+Run Libref as a containerized HTTP server for multi-client or Kubernetes deployments:
 
 ```bash
 # Run from the repository root (required for the monorepo lockfile)
-docker build -t context:local -f packages/context/Dockerfile .
-docker run --rm -p 8080:8080 context:local
+docker build -t libref:local -f packages/libref/Dockerfile .
+docker run --rm -p 8080:8080 libref:local
 ```
 
-The container starts Context with HTTP transport on port 8080, accessible at `http://localhost:8080/mcp`. The image uses a multi-stage build with `node:22-bookworm-slim` for native module compatibility.
+The container starts Libref with HTTP transport on port 8080, accessible at `http://localhost:8080/mcp`. The image uses a multi-stage build with `node:22-bookworm-slim` for native module compatibility.
 
 ---
 
 ## :books: CLI Reference
 
-### `context browse <package>`
+### `libref browse <package>`
 
 Search for packages available on the registry server.
 
 ```bash
 # Browse by registry/name
-context browse npm/next
+libref browse npm/next
 
 # Output:
 #   npm/next@15.1.3           3.4 MB  The React Framework for the Web
 #   npm/next@15.0.4           3.2 MB  The React Framework for the Web
 #   ...
 #
-#   Found 12 versions. Install with: context install npm/next
+#   Found 12 versions. Install with: libref install npm/next
 
 # Browse with just a name (defaults to npm)
-context browse react
+libref browse react
 ```
 
-### `context install <registry/name> [version]`
+### `libref install <registry/name> [version]`
 
 Download and install a pre-built package from the registry server.
 
 ```bash
 # Install latest version
-context install npm/next
+libref install npm/next
 
 # Install a specific version
-context install npm/next 15.0.4
+libref install npm/next 15.0.4
 
 # Install from other registries
-context install pip/django
+libref install pip/django
 ```
 
-### `context add <source>`
+### `libref add <source>`
 
 Build and install a documentation package from source. Use this for libraries not in the registry, or for private/internal docs. The source type is auto-detected.
 
@@ -359,19 +359,19 @@ Works with GitHub, GitLab, Bitbucket, Codeberg, or any git URL:
 
 ```bash
 # HTTPS URLs
-context add https://github.com/vercel/next.js
-context add https://gitlab.com/org/repo
-context add https://bitbucket.org/org/repo
+libref add https://github.com/vercel/next.js
+libref add https://gitlab.com/org/repo
+libref add https://bitbucket.org/org/repo
 
 # Specific tag or branch
-context add https://github.com/vercel/next.js/tree/v16.0.0
+libref add https://github.com/vercel/next.js/tree/v16.0.0
 
 # SSH URLs
-context add git@github.com:user/repo.git
-context add ssh://git@github.com/user/repo.git
+libref add git@github.com:user/repo.git
+libref add ssh://git@github.com/user/repo.git
 
 # Custom options
-context add https://github.com/vercel/next.js --path packages/docs --name nextjs
+libref add https://github.com/vercel/next.js --path packages/docs --name nextjs
 ```
 
 **From local directory:**
@@ -380,13 +380,13 @@ Build a package from documentation in a local folder:
 
 ```bash
 # Auto-detects docs folder (docs/, documentation/, doc/)
-context add ./my-project
+libref add ./my-project
 
 # Specify docs path explicitly
-context add /path/to/repo --path docs
+libref add /path/to/repo --path docs
 
 # Custom package name and version
-context add ./my-lib --name my-library --pkg-version 1.0.0
+libref add ./my-lib --name my-library --pkg-version 1.0.0
 ```
 
 | Option | Description |
@@ -400,52 +400,52 @@ context add ./my-lib --name my-library --pkg-version 1.0.0
 
 ```bash
 # Save to a directory (auto-names as name@version.db)
-context add https://github.com/vercel/next.js --save ./packages/
+libref add https://github.com/vercel/next.js --save ./packages/
 
 # Save to a specific file
-context add ./my-docs --save ./my-package.db
+libref add ./my-docs --save ./my-package.db
 ```
 
 **From website ([llms.txt](https://llmstxt.org/)):**
 
-Many websites publish an `llms.txt` file with AI-ready documentation. Context auto-detects and fetches it. When the site only provides `llms.txt` (an index of links rather than the inlined `llms-full.txt`), Context follows each link and fetches the linked document:
+Many websites publish an `llms.txt` file with AI-ready documentation. Libref auto-detects and fetches it. When the site only provides `llms.txt` (an index of links rather than the inlined `llms-full.txt`), Libref follows each link and fetches the linked document:
 
 ```bash
 # Auto-fetches llms-full.txt or llms.txt from the site
-context add https://svelte.dev
-context add https://mui.com/material-ui
+libref add https://svelte.dev
+libref add https://mui.com/material-ui
 
 # Direct URL to a specific llms.txt file
-context add https://svelte.dev/docs/svelte/llms.txt
+libref add https://svelte.dev/docs/svelte/llms.txt
 
 # Custom package name
-context add https://react-aria.adobe.com --name react-aria
+libref add https://react-aria.adobe.com --name react-aria
 ```
 
 **From an arbitrary URL (blog posts, articles, raw Markdown):**
 
-If no `llms.txt` is found, Context falls back to fetching the page directly. HTML pages are run through a readability extractor (defuddle) so subscribe CTAs, navigation, and comment widgets don't end up in the package:
+If no `llms.txt` is found, Libref falls back to fetching the page directly. HTML pages are run through a readability extractor (defuddle) so subscribe CTAs, navigation, and comment widgets don't end up in the package:
 
 ```bash
 # A blog post
-context add https://overreacted.io/things-i-dont-know-as-of-2018/
+libref add https://overreacted.io/things-i-dont-know-as-of-2018/
 
 # Raw Markdown from GitHub
-context add https://raw.githubusercontent.com/neuledge/context/main/README.md --name context-readme
+libref add https://raw.githubusercontent.com/wernerbisschoff/libref/main/README.md --name libref-readme
 ```
 
-For subscriber-only content on platforms you have a paid account for, see [`context auth`](#context-auth) below.
+For subscriber-only content on platforms you have a paid account for, see [`libref auth`](#libref-auth) below.
 
 **From URL:**
 
 ```bash
-context add https://cdn.example.com/react@18.db
+libref add https://cdn.example.com/react@18.db
 ```
 
 **From local file:**
 
 ```bash
-context add ./nextjs@15.0.db
+libref add ./nextjs@15.0.db
 ```
 
 **Finding the right documentation repository:**
@@ -454,12 +454,12 @@ Many popular projects keep their documentation in a separate repository from the
 
 ```bash
 # Example: React's docs are in a separate repo
-context add https://github.com/facebook/react
+libref add https://github.com/facebook/react
 # ⚠️  Warning: Only 45 sections found...
 # The warning includes a Google search link to help find the docs repo
 
 # The actual React docs repository:
-context add https://github.com/reactjs/react.dev
+libref add https://github.com/reactjs/react.dev
 ```
 
 Common patterns for documentation repositories:
@@ -469,12 +469,12 @@ Common patterns for documentation repositories:
 
 When the CLI detects few documentation sections, it will show a Google search link to help you find the correct repository.
 
-### `context list`
+### `libref list`
 
 Show installed packages.
 
 ```bash
-$ context list
+$ libref list
 
 Installed packages:
 
@@ -484,47 +484,47 @@ Installed packages:
 Total: 2 packages (6.3 MB)
 ```
 
-### `context remove <name>`
+### `libref remove <name>`
 
 Remove a package.
 
 ```bash
-context remove nextjs
+libref remove nextjs
 ```
 
-### `context auth`
+### `libref auth`
 
-Store per-platform cookies or headers so `context add <url>` can fetch subscriber-only content you have a legitimate account for (e.g., a paid Substack or Medium subscription). Credentials are stored in `~/.context/auth.json` with `0600` permissions, and matched by domain (with one level of parent-domain fallback for subdomains).
+Store per-platform cookies or headers so `libref add <url>` can fetch subscriber-only content you have a legitimate account for (e.g., a paid Substack or Medium subscription). Credentials are stored in `~/.libref/auth.json` with `0600` permissions, and matched by domain (with one level of parent-domain fallback for subdomains).
 
 ```bash
 # Store cookies for a domain
-context auth add substack.com --cookies "substack.sid=YOUR_SID"
+libref auth add substack.com --cookies "substack.sid=YOUR_SID"
 
 # Add a custom header too
-context auth add medium.com --cookies "sid=..." --header "x-frontend: web"
+libref auth add medium.com --cookies "sid=..." --header "x-frontend: web"
 
 # List configured auth
-context auth list
+libref auth list
 
 # Remove auth
-context auth remove substack.com
+libref auth remove substack.com
 ```
 
-### `context serve`
+### `libref serve`
 
 Start the MCP server (used by AI agents).
 
 ```bash
 # Stdio transport (default, for single-client MCP integrations)
-context serve
+libref serve
 
 # HTTP transport (for multi-client access over the network)
-context serve --http
-context serve --http 3000
-context serve --http 3000 --host 0.0.0.0
+libref serve --http
+libref serve --http 3000
+libref serve --http 3000 --host 0.0.0.0
 
 # Restrict the session to a subset of installed packages
-context serve --libs react next@15.0.4
+libref serve --libs react next@15.0.4
 ```
 
 | Option | Description |
@@ -533,15 +533,26 @@ context serve --libs react next@15.0.4
 | `--host <host>` | Host to bind to (default: 127.0.0.1) |
 | `--libs <names...>` | Restrict the session to a fixed set of installed libraries. Each entry is a name (`react`) or `name@version` (`react@18.3.1`). When set, `search_packages` and `download_package` are hidden so the session is locked to that list. Useful for per-project scoping when you have many packages installed globally. |
 
-The HTTP transport uses the [MCP Streamable HTTP](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports#streamable-http) protocol, enabling multiple clients on the local network to connect to a single server instance. The endpoint is available at `http://<host>:<port>/mcp`.
+The HTTP transport uses the [MCP Streamable HTTP](https://modellibrefprotocol.io/specification/2025-03-26/basic/transports#streamable-http) protocol, enabling multiple clients on the local network to connect to a single server instance. The endpoint is available at `http://<host>:<port>/mcp`.
 
-### `context query <library> <topic>`
+### `libref query <library> <topic>`
 
 Query documentation directly from the command line. Useful for testing and debugging.
 
+The `<library>` argument accepts the same identifier shapes as the rest of the CLI: `name@version` (as printed by `libref list`), a bare `name` (matches whatever version is installed), or a `registry/name[@version]` spec. For docs sites, you can also pass the second-level domain or the full main domain — e.g. `cloudflare` or `cloudflare.com` — and it will match an installed package like `developers.cloudflare.com` (only when no `cloudflare` package exists).
+
 ```bash
-# Query a package (use name@version format from 'context list')
-context query 'nextjs@16.0' 'middleware authentication'
+# Exact name@version from 'libref list'
+libref query 'nextjs@16.0' 'middleware authentication'
+
+# Bare name — matches the installed version
+libref query 'nextjs' 'middleware authentication'
+
+# A registry prefix is also accepted (and ignored for installed packages)
+libref query 'npm/nextjs@16.0' 'middleware authentication'
+
+# For docs sites: a brand or full main domain matches the site package
+libref query 'cloudflare' 'cloudflare_record'
 
 # Returns the same JSON format as the MCP get_docs tool
 ```
@@ -555,7 +566,7 @@ context query 'nextjs@16.0' 'middleware authentication'
 │                     Your Machine                        │
 │                                                         │
 │  ┌──────────┐    ┌──────────────────┐    ┌────────────┐ │
-│  │    AI    │    │   Context MCP    │    │ ~/.context │ │
+│  │    AI    │    │   Libref MCP    │    │ ~/.libref │ │
 │  │  Agent   │───▶│     Server       │───▶│  /packages │ │
 │  │          │    │                  │    └────────────┘ │
 │  └──────────┘    └────────┬─────────┘         │         │
@@ -575,7 +586,7 @@ context query 'nextjs@16.0' 'middleware authentication'
 **First time you ask about a library:**
 1. The MCP server searches the community registry
 2. Downloads the pre-built documentation package (a SQLite `.db` file)
-3. Stores it locally in `~/.context/packages/`
+3. Stores it locally in `~/.libref/packages/`
 
 **Every time after:**
 1. FTS5 full-text search finds relevant sections locally
@@ -586,25 +597,25 @@ context query 'nextjs@16.0' 'middleware authentication'
 
 ## :question: FAQ
 
-### Can I use Context with non-JavaScript frameworks like Spring Boot, Django, or Rails?
+### Can I use Libref with non-JavaScript frameworks like Spring Boot, Django, or Rails?
 
-**Yes!** Context is language-agnostic. It natively supports Markdown (`.md`, `.mdx`), AsciiDoc (`.adoc`), reStructuredText (`.rst`), and HTML — no conversion needed.
+**Yes!** Libref is language-agnostic. It natively supports Markdown (`.md`, `.mdx`), AsciiDoc (`.adoc`), reStructuredText (`.rst`), and HTML — no conversion needed.
 
 ```bash
 # Python - FastAPI (Markdown)
-context add https://github.com/fastapi/fastapi --path docs/en/docs
+libref add https://github.com/fastapi/fastapi --path docs/en/docs
 
 # Python - Django (reStructuredText)
-context add https://github.com/django/django --path docs
+libref add https://github.com/django/django --path docs
 
 # Java - Spring Boot (AsciiDoc)
-context add https://github.com/spring-projects/spring-boot --path spring-boot-project/spring-boot-docs/src/docs
+libref add https://github.com/spring-projects/spring-boot --path spring-boot-project/spring-boot-docs/src/docs
 
 # Rust - The Rust Book
-context add https://github.com/rust-lang/book --path src
+libref add https://github.com/rust-lang/book --path src
 ```
 
-Point Context at the docs folder with `--path` and it handles the rest.
+Point Libref at the docs folder with `--path` and it handles the rest.
 
 ### Can I contribute package definitions for new ecosystems?
 
diff --git a/packages/context/assets/ai-sdk-demo.gif b/packages/libref/assets/ai-sdk-demo.gif
similarity index 100%
rename from packages/context/assets/ai-sdk-demo.gif
rename to packages/libref/assets/ai-sdk-demo.gif
diff --git a/packages/context/package.json b/packages/libref/package.json
similarity index 78%
rename from packages/context/package.json
rename to packages/libref/package.json
index 52d4f83..8d68a05 100644
--- a/packages/context/package.json
+++ b/packages/libref/package.json
@@ -1,22 +1,22 @@
 {
-  "name": "@neuledge/context",
-  "version": "1.1.2",
-  "mcpName": "io.github.neuledge/context",
-  "description": "Context management for Neuledge packages",
+  "name": "@wernerbisschoff/libref",
+  "version": "2.1.3",
+  "mcpName": "io.github.wernerbisschoff/libref",
+  "description": "Local library reference for AI agents. Always current.",
   "keywords": [],
-  "homepage": "https://neuledge.com",
+  "homepage": "https://github.com/wernerbisschoff/libref",
   "repository": {
     "type": "git",
-    "url": "git+https://github.com/neuledge/context.git"
+    "url": "git+https://github.com/wernerbisschoff/libref.git"
   },
   "bugs": {
-    "url": "https://github.com/neuledge/context/issues"
+    "url": "https://github.com/wernerbisschoff/libref/issues"
   },
   "main": "dist/index.js",
   "types": "dist/index.d.ts",
   "type": "module",
   "bin": {
-    "context": "./dist/cli.js"
+    "libref": "./dist/cli.js"
   },
   "exports": {
     ".": "./dist/index.js"
@@ -39,7 +39,7 @@
   "publishConfig": {
     "access": "public"
   },
-  "author": "Neuledge",
+  "author": "wernerbisschoff",
   "license": "Apache-2.0",
   "dependencies": {
     "@inquirer/prompts": "^8.2.0",
diff --git a/packages/context/src/auth.test.ts b/packages/libref/src/auth.test.ts
similarity index 100%
rename from packages/context/src/auth.test.ts
rename to packages/libref/src/auth.test.ts
diff --git a/packages/context/src/auth.ts b/packages/libref/src/auth.ts
similarity index 94%
rename from packages/context/src/auth.ts
rename to packages/libref/src/auth.ts
index fdcca20..d5c1be2 100644
--- a/packages/context/src/auth.ts
+++ b/packages/libref/src/auth.ts
@@ -3,7 +3,7 @@
  *
  * Many content platforms (Medium, Substack, etc.) gate content behind
  * login. Users with legitimate subscriptions can store cookies/auth
- * tokens per domain so that `context add <url>` can fetch authenticated
+ * tokens per domain so that `libref add <url>` can fetch authenticated
  * content automatically.
  */
 
@@ -26,7 +26,7 @@ export interface PlatformAuth {
 
 export type AuthConfig = Record<string, PlatformAuth>;
 
-const AUTH_PATH = join(homedir(), ".context", "auth.json");
+const AUTH_PATH = join(homedir(), ".libref", "auth.json");
 
 let authCache: AuthConfig | undefined;
 
@@ -53,7 +53,7 @@ export function loadAuth(): AuthConfig {
 
 /** Save auth config to disk. */
 export function saveAuth(auth: AuthConfig): void {
-  const dir = join(homedir(), ".context");
+  const dir = join(homedir(), ".libref");
   mkdirSync(dir, { recursive: true });
   chmodSync(dir, 0o700);
   writeFileSync(AUTH_PATH, JSON.stringify(auth, null, 2), { mode: 0o600 });
diff --git a/packages/context/src/build.test.ts b/packages/libref/src/build.test.ts
similarity index 100%
rename from packages/context/src/build.test.ts
rename to packages/libref/src/build.test.ts
diff --git a/packages/context/src/build.ts b/packages/libref/src/build.ts
similarity index 100%
rename from packages/context/src/build.ts
rename to packages/libref/src/build.ts
diff --git a/packages/context/src/cli.test.ts b/packages/libref/src/cli.test.ts
similarity index 71%
rename from packages/context/src/cli.test.ts
rename to packages/libref/src/cli.test.ts
index 8255c0b..c6a84ab 100644
--- a/packages/context/src/cli.test.ts
+++ b/packages/libref/src/cli.test.ts
@@ -1,13 +1,16 @@
 import { describe, expect, it, vi } from "vitest";
 import {
   detectSourceType,
+  docPathFromUrl,
   fetchWebPage,
   packageNameFromUrl,
   parseLibSpec,
   parseRegistryPackage,
   resolveAllowedLibraries,
   resolveLlmsTxtUrls,
+  resolveQueryPackage,
   suggestPackageNameFromUrl,
+  urlMatchesPathPrefix,
 } from "./cli.js";
 import type { PackageInfo } from "./store.js";
 
@@ -505,3 +508,222 @@ describe("resolveAllowedLibraries", () => {
     }
   });
 });
+
+describe("resolveQueryPackage", () => {
+  const installed: PackageInfo[] = [
+    {
+      name: "opentofu",
+      version: "1.12",
+      path: "/opentofu.db",
+      sizeBytes: 0,
+      sectionCount: 0,
+    },
+    {
+      name: "developers.cloudflare.com",
+      version: "latest",
+      path: "/cf.db",
+      sizeBytes: 0,
+      sectionCount: 0,
+    },
+    {
+      name: "@trpc/server",
+      version: "10.0.0",
+      path: "/trpc.db",
+      sizeBytes: 0,
+      sectionCount: 0,
+    },
+  ];
+
+  it("matches name@version exactly", () => {
+    expect(resolveQueryPackage("opentofu@1.12", installed)?.name).toBe(
+      "opentofu",
+    );
+    expect(
+      resolveQueryPackage("developers.cloudflare.com@latest", installed)
+        ?.version,
+    ).toBe("latest");
+  });
+
+  it("matches by name only when no version is given", () => {
+    expect(resolveQueryPackage("opentofu", installed)?.name).toBe("opentofu");
+    expect(
+      resolveQueryPackage("developers.cloudflare.com", installed)?.name,
+    ).toBe("developers.cloudflare.com");
+  });
+
+  it("returns null when the requested version is not installed", () => {
+    expect(resolveQueryPackage("opentofu@1.13", installed)).toBeNull();
+  });
+
+  it("strips an optional registry/ prefix", () => {
+    expect(resolveQueryPackage("npm/opentofu@1.12", installed)?.name).toBe(
+      "opentofu",
+    );
+    expect(resolveQueryPackage("pip/opentofu", installed)?.name).toBe(
+      "opentofu",
+    );
+    expect(
+      resolveQueryPackage("npm/developers.cloudflare.com@latest", installed)
+        ?.name,
+    ).toBe("developers.cloudflare.com");
+  });
+
+  it("treats a trailing @ as no version", () => {
+    expect(resolveQueryPackage("opentofu@", installed)?.name).toBe("opentofu");
+  });
+
+  it("preserves scoped package names", () => {
+    expect(resolveQueryPackage("@trpc/server@10.0.0", installed)?.name).toBe(
+      "@trpc/server",
+    );
+    expect(resolveQueryPackage("@trpc/server", installed)?.name).toBe(
+      "@trpc/server",
+    );
+    expect(
+      resolveQueryPackage("npm/@trpc/server@10.0.0", installed)?.name,
+    ).toBe("@trpc/server");
+  });
+
+  it("trims surrounding whitespace", () => {
+    expect(resolveQueryPackage("  opentofu  ", installed)?.name).toBe(
+      "opentofu",
+    );
+  });
+
+  it("returns null for empty or unknown input", () => {
+    expect(resolveQueryPackage("", installed)).toBeNull();
+    expect(resolveQueryPackage("   ", installed)).toBeNull();
+    expect(resolveQueryPackage("unknown-lib", installed)).toBeNull();
+  });
+
+  it("falls back to main-domain match when no exact name exists", () => {
+    const withDomains: PackageInfo[] = [
+      {
+        name: "developers.cloudflare.com",
+        version: "latest",
+        path: "/cf-dev.db",
+        sizeBytes: 0,
+        sectionCount: 0,
+      },
+      {
+        name: "mui.com",
+        version: "latest",
+        path: "/mui.db",
+        sizeBytes: 0,
+        sectionCount: 0,
+      },
+    ];
+    expect(resolveQueryPackage("cloudflare", withDomains)?.name).toBe(
+      "developers.cloudflare.com",
+    );
+    expect(resolveQueryPackage("mui", withDomains)?.name).toBe("mui.com");
+    expect(resolveQueryPackage("cloudflare.com", withDomains)?.name).toBe(
+      "developers.cloudflare.com",
+    );
+  });
+
+  it("prefers an exact name match over the domain fallback", () => {
+    const conflict: PackageInfo[] = [
+      {
+        name: "cloudflare",
+        version: "1.0.0",
+        path: "/cf-npm.db",
+        sizeBytes: 0,
+        sectionCount: 0,
+      },
+      {
+        name: "developers.cloudflare.com",
+        version: "latest",
+        path: "/cf-dev.db",
+        sizeBytes: 0,
+        sectionCount: 0,
+      },
+    ];
+    expect(resolveQueryPackage("cloudflare", conflict)?.name).toBe(
+      "cloudflare",
+    );
+  });
+
+  it("does not fall back to domain match when a version is pinned", () => {
+    const withDomains: PackageInfo[] = [
+      {
+        name: "developers.cloudflare.com",
+        version: "latest",
+        path: "/cf-dev.db",
+        sizeBytes: 0,
+        sectionCount: 0,
+      },
+    ];
+    expect(resolveQueryPackage("cloudflare@1.0.0", withDomains)).toBeNull();
+  });
+});
+
+describe("urlMatchesPathPrefix", () => {
+  it("matches an exact path with and without trailing slash", () => {
+    expect(urlMatchesPathPrefix("https://example.com/docs", "/docs")).toBe(
+      true,
+    );
+    expect(urlMatchesPathPrefix("https://example.com/docs/", "/docs/")).toBe(
+      true,
+    );
+    expect(urlMatchesPathPrefix("https://example.com/docs", "/docs/")).toBe(
+      true,
+    );
+    expect(urlMatchesPathPrefix("https://example.com/docs/", "/docs")).toBe(
+      true,
+    );
+  });
+
+  it("matches URLs whose path is under the prefix", () => {
+    expect(urlMatchesPathPrefix("https://example.com/docs/foo", "/docs")).toBe(
+      true,
+    );
+    expect(
+      urlMatchesPathPrefix("https://example.com/docs/foo/bar", "/docs/"),
+    ).toBe(true);
+  });
+
+  it("rejects siblings with a similar but distinct prefix", () => {
+    expect(
+      urlMatchesPathPrefix("https://example.com/docs-other", "/docs"),
+    ).toBe(false);
+    expect(urlMatchesPathPrefix("https://example.com/blog", "/docs")).toBe(
+      false,
+    );
+  });
+
+  it("treats root prefix as match-all", () => {
+    expect(urlMatchesPathPrefix("https://example.com/anything", "/")).toBe(
+      true,
+    );
+    expect(urlMatchesPathPrefix("https://example.com/x/y", "/")).toBe(true);
+  });
+
+  it("returns false for malformed URLs", () => {
+    expect(urlMatchesPathPrefix("not a url", "/docs")).toBe(false);
+  });
+});
+
+describe("docPathFromUrl", () => {
+  it("appends .md to extensionless paths", () => {
+    expect(docPathFromUrl("https://example.com/docs/foo")).toBe(
+      "example.com/docs/foo.md",
+    );
+  });
+
+  it("strips trailing slash and defaults to /index for empty path", () => {
+    expect(docPathFromUrl("https://example.com/docs/")).toBe(
+      "example.com/docs.md",
+    );
+    expect(docPathFromUrl("https://example.com")).toBe("example.com/index.md");
+  });
+
+  it("preserves markdown-family extensions", () => {
+    expect(docPathFromUrl("https://example.com/api.md")).toBe(
+      "example.com/api.md",
+    );
+    expect(docPathFromUrl("https://example.com/api.mdx")).toBe(
+      "example.com/api.mdx",
+    );
+  });
+});
diff --git a/packages/context/src/cli.ts b/packages/libref/src/cli.ts
similarity index 89%
rename from packages/context/src/cli.ts
rename to packages/libref/src/cli.ts
index e107568..5c34ad2 100644
--- a/packages/context/src/cli.ts
+++ b/packages/libref/src/cli.ts
@@ -51,8 +51,14 @@ import {
 } from "./guidance.js";
 import { fetchLinkedDocs } from "./llms-txt.js";
 import { buildPackage, type MarkdownFile } from "./package-builder.js";
+import {
+  parseLibSpec,
+  parseRegistryPackage,
+  resolveQueryPackage,
+} from "./resolve-package.js";
 import { type SearchResult, search } from "./search.js";
 import { ContextServer } from "./server.js";
+import { fetchSitemapUrls } from "./sitemap.js";
 import {
   getPackageFileName,
   type PackageInfo,
@@ -60,6 +66,9 @@ import {
   readPackageInfo,
 } from "./store.js";
 
+// Re-export parsing helpers for existing test and downstream imports.
+export { parseLibSpec, parseRegistryPackage, resolveQueryPackage };
+
 type SourceType = "file" | "url" | "git" | "local-dir" | "website";
 
 /** Detect the type of source based on the input string. */
@@ -126,7 +135,7 @@ async function downloadFile(url: string, destPath: string): Promise<void> {
   await pipeline(nodeStream, fileStream);
 }
 
-const DATA_DIR = join(homedir(), ".context", "packages");
+const DATA_DIR = join(homedir(), ".libref", "packages");
 
 function formatBytes(bytes: number): string {
   if (bytes < 1024) return `${bytes} B`;
@@ -288,6 +297,66 @@ export function resolveLlmsTxtUrls(source: string): string[] {
   return LLMS_TXT_PATHS.map((path) => `${base}${path}`);
 }
 
+/** Derive a stable package-internal path for a documentation URL. */
+export function docPathFromUrl(url: string): string {
+  const parsed = new URL(url);
+  let path = parsed.pathname.replace(/\/$/, "") || "/index";
+  if (!/\.(md|mdx|adoc|rst|txt)$/i.test(path)) {
+    path += ".md";
+  }
+  return parsed.host + path;
+}
+
+/** Whether a URL's pathname matches (or sits under) a source path prefix. */
+export function urlMatchesPathPrefix(url: string, sourcePath: string): boolean {
+  try {
+    const u = new URL(url);
+    const norm = (p: string): string =>
+      p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p;
+    const uPath = norm(u.pathname);
+    const sPath = norm(sourcePath);
+    if (sPath === "/" || sPath === "") return true;
+    return uPath === sPath || uPath.startsWith(`${sPath}/`);
+  } catch {
+    return false;
+  }
+}
+
+/**
+ * Fallback for sites without llms.txt: discover pages via sitemap.xml,
+ * filter to URLs under the source's path prefix, fetch each as markdown.
+ * Returns an empty array when no sitemap is found or no URLs match.
+ */
+async function fetchSitemapPages(source: string): Promise<MarkdownFile[]> {
+  const sourcePath = new URL(source).pathname;
+  const allUrls = await fetchSitemapUrls(source, {
+    log: (msg) => console.log(msg),
+  });
+  const urls = allUrls.filter((u) => urlMatchesPathPrefix(u, sourcePath));
+  if (urls.length === 0) return [];
+
+  console.log(
+    `Fetching ${urls.length} page${urls.length === 1 ? "" : "s"} from sitemap...`,
+  );
+
+  const files: MarkdownFile[] = [];
+  let next = 0;
+  async function worker(): Promise<void> {
+    while (next < urls.length) {
+      const i = next++;
+      const url = urls[i];
+      if (!url) return;
+      const page = await fetchWebPage(url);
+      if (!page.ok) continue;
+      files.push({ path: docPathFromUrl(url), content: page.content });
+    }
+  }
+
+  const workerCount = Math.min(5, urls.length);
+  await Promise.all(Array.from({ length: workerCount }, () => worker()));
+  return files;
+}
+
 /** Install a package from a website's llms.txt file. */
 async function addFromWebsite(
   source: string,
@@ -318,26 +387,62 @@ async function addFromWebsite(
   }
 
   if (!content || !resolvedUrl) {
-    // Fallback: fetch the original URL as a single page
-    console.log(`No llms.txt found. Fetching page content directly...`);
+    // Fallback 1: try the site's sitemap.xml to fetch the whole docs section.
+    console.log(`No llms.txt found. Trying sitemap.xml...`);
+    const sitemapFiles = await fetchSitemapPages(source);
+    if (sitemapFiles.length > 0) {
+      const packageName = options.name ?? suggestPackageNameFromUrl(source);
+      const versionLabel = options.version ?? "latest";
+
+      ensureDataDir();
+      const outputPath = join(
+        DATA_DIR,
+        getPackageFileName(packageName, versionLabel),
+      );
+
+      console.log(`Building package...`);
+      const result = buildPackage(outputPath, sitemapFiles, {
+        name: packageName,
+        version: versionLabel,
+        sourceUrl: source,
+      });
+
+      if (result.sectionCount === 0) {
+        throw new Error(
+          `No documentation sections could be extracted from ${source}. Sitemap URLs may not contain readable content.`,
+        );
+      }
+
+      console.log(`✓ Built package: ${packageName}@${versionLabel}`);
+      console.log(`✓ Saved to ${outputPath}`);
+
+      if (options.save) {
+        savePackageCopy(outputPath, options.save, packageName, versionLabel);
+      }
+
+      const sizeBytes = statSync(outputPath).size;
+
+      console.log(
+        `\nInstalled: ${packageName}@${versionLabel} (${formatBytes(sizeBytes)}, ${result.sectionCount} sections)`,
+      );
+      return;
+    }
+
+    // Fallback 2: fetch the source URL as a single page.
+    console.log(`No sitemap found. Fetching page content directly...`);
     const page = await fetchWebPage(source);
     if (!page.ok) {
       throw new Error(
-        `No llms.txt found at ${source}. Tried:\n${urls.map((u) => `  - ${u}`).join("\n")}\n\nDirect fetch also failed: ${page.reason}.`,
+        `No llms.txt or sitemap found at ${source}. Direct fetch also failed: ${page.reason}.`,
       );
     }
 
     const packageName = options.name ?? suggestPackageNameFromUrl(source);
     const versionLabel = options.version ?? "latest";
 
-    const parsedUrl = new URL(source);
-    let path = parsedUrl.pathname.replace(/\/$/, "") || "/index";
-    if (!/\.(md|mdx|adoc|rst|txt)$/i.test(path)) {
-      path += ".md";
-    }
-    const docPath = parsedUrl.host + path;
-
-    const files: MarkdownFile[] = [{ path: docPath, content: page.content }];
+    const files: MarkdownFile[] = [
+      { path: docPathFromUrl(source), content: page.content },
+    ];
 
     ensureDataDir();
     const outputPath = join(
@@ -511,15 +616,6 @@ function loadPackages(store: PackageStore): void {
   }
 }
 
-/** Parse a `--libs` spec into name (optionally with @version). */
-// Uses lastIndexOf so scoped names like `@trpc/server@1.0.0` split correctly,
-// while a bare scoped name `@trpc/server` (leading `@` only) keeps its name.
-export function parseLibSpec(spec: string): { name: string; version?: string } {
-  const at = spec.lastIndexOf("@");
-  if (at <= 0) return { name: spec };
-  return { name: spec.slice(0, at), version: spec.slice(at + 1) };
-}
-
 /**
  * Resolve `--libs` specs against installed packages. Exits the process with a
  * descriptive error if any spec doesn't match an installed package.
@@ -551,7 +647,7 @@ export function resolveAllowedLibraries(
   if (errors.length > 0) {
     console.error("Cannot start --libs session:");
     for (const e of errors) console.error(e);
-    console.error("Run `context list` to see installed packages.");
+    console.error("Run `libref list` to see installed packages.");
     process.exit(1);
   }
 
@@ -559,7 +655,7 @@ export function resolveAllowedLibraries(
 }
 
 const program = new Command()
-  .name("context")
+  .name("libref")
   .description("Local-first documentation for AI agents")
   .version(version);
 
@@ -956,11 +1052,11 @@ async function addFromLocalDir(
 program
   .command("add")
   .description(
-    "Install a documentation package from file, URL, GitHub, git repo, website (llms.txt), or local directory",
+    "Install a documentation package from file, URL, GitHub, git repo, website (auto-fetches llms.txt or falls back to sitemap.xml), or local directory",
   )
   .argument(
     "<source>",
-    "Package source: local .db file, URL (.db), GitHub URL, git URL, website URL (auto-fetches llms.txt), or local directory",
+    "Package source: local .db file, URL (.db), GitHub URL, git URL, website URL (auto-fetches llms.txt or falls back to sitemap.xml), or local directory",
   )
   .option("--tag <tag>", "Git tag to checkout (for git repos)")
   .option("--pkg-version <version>", "Custom version label")
@@ -1026,7 +1122,9 @@ program
 
     if (packages.length === 0) {
       console.log("No packages installed.");
-      console.log("Run: context add <package.db>");
+      console.log(
+        "Run: libref add <source>  (local .db file, URL, GitHub repo, or website)",
+      );
       return;
     }
 
@@ -1107,7 +1205,7 @@ program
         console.error(`${prefix} ${visible.length} packages: ${names}`);
       } else {
         console.error("Context MCP Server starting...");
-        console.error("No packages installed. Run: context add <package.db>");
+        console.error("No packages installed. Run: libref add <package.db>");
       }
 
       const server = new ContextServer(store, { allowedLibraries });
@@ -1159,20 +1257,23 @@ function formatSearchResult(result: SearchResult): string {
 program
   .command("query")
   .description("Query documentation from an installed package")
-  .argument("<library>", "Package name with version (e.g., nextjs@15.0)")
+  .argument(
+    "<library>",
+    'Package identifier: "nextjs@15.0", "nextjs", or "npm/nextjs@15.0"',
+  )
   .argument("<topic>", GET_DOCS_TOPIC_DESCRIPTION)
   .action((library: string, topic: string) => {
     const store = new PackageStore();
     loadPackages(store);
 
     const packages = store.list();
-    const pkg = packages.find((p) => formatLibraryName(p) === library);
+    const pkg = resolveQueryPackage(library, packages);
 
     if (!pkg) {
       const available = packages.map(formatLibraryName);
       if (available.length === 0) {
         console.error("Error: No packages installed.");
-        console.error("Run: context add <package.db>");
+        console.error("Run: libref add <package.db>");
       } else {
         console.error(`Error: Package not found: ${library}`);
         const maxShow = 5;
@@ -1198,38 +1299,6 @@ program
     }
   });
 
-/**
- * Parse a "registry/name[@version]" string (e.g., "npm/next",
- * "pip/django", "npm/next@16.1.7", "npm/@trpc/server@10.0.0").
- * Returns { registry, name, version? } or null if the format is invalid.
- */
-export function parseRegistryPackage(input: string): {
-  registry: string;
-  name: string;
-  version?: string;
-} | null {
-  // Handle scoped packages: npm/@scope/name → registry=npm, name=@scope/name
-  const firstSlash = input.indexOf("/");
-  if (firstSlash <= 0) return null;
-
-  const registry = input.slice(0, firstSlash);
-  let name = input.slice(firstSlash + 1);
-  if (!name) return null;
-
-  // Split off an optional trailing "@version". Use lastIndexOf so scoped
-  // package names like "@trpc/server" aren't mistaken for a version marker.
-  let version: string | undefined;
-  const atIdx = name.lastIndexOf("@");
-  if (atIdx > 0) {
-    const v = name.slice(atIdx + 1);
-    if (v) version = v;
-    name = name.slice(0, atIdx);
-  }
-  if (!name) return null;
-
-  return version ? { registry, name, version } : { registry, name };
-}
-
 program
   .command("browse")
   .description("Search for packages available on the registry server")
@@ -1267,7 +1336,7 @@ program
         console.log(`  ${id.padEnd(32)} ${size}${desc}`);
       }
       console.log(
-        `\nFound ${results.length} version${results.length === 1 ? "" : "s"}. Install with: context install ${registry}/${name}`,
+        `\nFound ${results.length} version${results.length === 1 ? "" : "s"}. Install with: libref install ${registry}/${name}`,
       );
     } catch (err) {
       console.error(`Error: ${err instanceof Error ? err.message : err}`);
@@ -1391,7 +1460,7 @@ program
         const domains = Object.keys(auth);
         if (domains.length === 0) {
           console.log("No platform auth configured.");
-          console.log("Run: context auth add <domain> --cookies <cookies>");
+          console.log("Run: libref auth add <domain> --cookies <cookies>");
           return;
         }
         console.log("Configured platform auth:\n");
@@ -1442,8 +1511,8 @@ function collectHeaders(
 // Only parse when run directly (not when imported for testing)
 const isRunDirectly =
   process.argv[1]?.endsWith("cli.js") ||
-  process.argv[1]?.endsWith("context") ||
-  process.argv[1]?.includes("bin/context");
+  process.argv[1]?.endsWith("libref") ||
+  process.argv[1]?.includes("bin/libref");
 
 if (isRunDirectly) {
   await initDatabase();
diff --git a/packages/context/src/config.ts b/packages/libref/src/config.ts
similarity index 94%
rename from packages/context/src/config.ts
rename to packages/libref/src/config.ts
index 2a1c25a..50050d9 100644
--- a/packages/context/src/config.ts
+++ b/packages/libref/src/config.ts
@@ -1,6 +1,6 @@
 /**
  * Configuration for download servers.
- * Stored in ~/.context/config.json.
+ * Stored in ~/.libref/config.json.
  */
 
 import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
@@ -17,13 +17,13 @@ export interface Config {
   servers: ServerConfig[];
 }
 
-const CONFIG_DIR = join(homedir(), ".context");
+const CONFIG_DIR = join(homedir(), ".libref");
 const CONFIG_PATH = join(CONFIG_DIR, "config.json");
 
 const DEFAULT_CONFIG: Config = {
   servers: [
     {
-      name: "neuledge",
+      name: "libref",
       url: "https://api.context.neuledge.com",
       default: true,
     },
diff --git a/packages/context/src/database.ts b/packages/libref/src/database.ts
similarity index 97%
rename from packages/context/src/database.ts
rename to packages/libref/src/database.ts
index 3f38da3..008b27a 100644
--- a/packages/context/src/database.ts
+++ b/packages/libref/src/database.ts
@@ -42,7 +42,9 @@ export async function initDatabase(): Promise<void> {
   if (backend) return;
 
   try {
-    betterSqlite3Constructor = _require("better-sqlite3");
+    const BetterSqlite3 = _require("better-sqlite3");
+    new BetterSqlite3(":memory:").close();
+    betterSqlite3Constructor = BetterSqlite3;
     backend = "better-sqlite3";
   } catch {
     const sqlJs = await import("sql.js-fts5");
diff --git a/packages/context/src/db.ts b/packages/libref/src/db.ts
similarity index 100%
rename from packages/context/src/db.ts
rename to packages/libref/src/db.ts
diff --git a/packages/context/src/download.ts b/packages/libref/src/download.ts
similarity index 97%
rename from packages/context/src/download.ts
rename to packages/libref/src/download.ts
index 5a60e5d..fb40a61 100644
--- a/packages/context/src/download.ts
+++ b/packages/libref/src/download.ts
@@ -18,7 +18,7 @@ import {
   readPackageInfo,
 } from "./store.js";
 
-const DATA_DIR = join(homedir(), ".context", "packages");
+const DATA_DIR = join(homedir(), ".libref", "packages");
 
 export interface SearchResultEntry {
   registry: string;
diff --git a/packages/context/src/extract-html.ts b/packages/libref/src/extract-html.ts
similarity index 100%
rename from packages/context/src/extract-html.ts
rename to packages/libref/src/extract-html.ts
diff --git a/packages/context/src/fetch.ts b/packages/libref/src/fetch.ts
similarity index 100%
rename from packages/context/src/fetch.ts
rename to packages/libref/src/fetch.ts
diff --git a/packages/context/src/git.test.ts b/packages/libref/src/git.test.ts
similarity index 87%
rename from packages/context/src/git.test.ts
rename to packages/libref/src/git.test.ts
index 59baeda..925b4fd 100644
--- a/packages/context/src/git.test.ts
+++ b/packages/libref/src/git.test.ts
@@ -1,6 +1,7 @@
 import { describe, expect, it } from "vitest";
 import {
   findLatestStableVersion,
+  isMissingRefError,
   isTransientGitError,
   parseMonorepoTag,
 } from "./git.js";
@@ -39,6 +40,27 @@ describe("isTransientGitError", () => {
   });
 });
 
+describe("isMissingRefError", () => {
+  it("detects a tag not pushed yet (npm ahead of git)", () => {
+    expect(
+      isMissingRefError(
+        "Git clone failed: Cloning into '/tmp/context-git-9itQYk'...\nfatal: Remote branch v4.1.9 not found in upstream origin",
+      ),
+    ).toBe(true);
+  });
+
+  it("detects a missing pathspec/reference on checkout", () => {
+    expect(
+      isMissingRefError("error: pathspec 'v4.1.9' did not match any file(s)"),
+    ).toBe(true);
+  });
+
+  it("rejects transient and unrelated errors", () => {
+    expect(isMissingRefError("Could not resolve host: github.com")).toBe(false);
+    expect(isMissingRefError("remote: Repository not found.")).toBe(false);
+  });
+});
+
 describe("parseMonorepoTag", () => {
   it("parses plain version tags", () => {
     expect(parseMonorepoTag("1.2.3")).toEqual({
diff --git a/packages/context/src/git.ts b/packages/libref/src/git.ts
similarity index 97%
rename from packages/context/src/git.ts
rename to packages/libref/src/git.ts
index edc2f5c..fa764d1 100755
--- a/packages/context/src/git.ts
+++ b/packages/libref/src/git.ts
@@ -231,6 +231,25 @@ export function isTransientGitError(message: string): boolean {
   return TRANSIENT_GIT_ERROR_PATTERNS.some((re) => re.test(message));
 }
 
+/**
+ * Git error patterns indicating the requested ref (tag/branch) doesn't exist
+ * in the remote. Happens when a registry (e.g. npm) publishes a version before
+ * the matching git tag is pushed — a transient state that self-heals once the
+ * tag lands, so callers can skip rather than hard-fail.
+ */
+const MISSING_REF_GIT_ERROR_PATTERNS = [
+  /remote branch .* not found in upstream/i,
+  /could not find remote (branch|ref)/i,
+  /(pathspec|reference) .* did not match/i,
+];
+
+/**
+ * Check if a git error message indicates the requested ref doesn't exist.
+ */
+export function isMissingRefError(message: string): boolean {
+  return MISSING_REF_GIT_ERROR_PATTERNS.some((re) => re.test(message));
+}
+
 /**
  * Synchronous sleep (cloneRepository is sync, so no await available).
  */
diff --git a/packages/context/src/guidance.ts b/packages/libref/src/guidance.ts
similarity index 83%
rename from packages/context/src/guidance.ts
rename to packages/libref/src/guidance.ts
index 99f8349..9270ea9 100644
--- a/packages/context/src/guidance.ts
+++ b/packages/libref/src/guidance.ts
@@ -8,7 +8,7 @@ export const GET_DOCS_TOPIC_DESCRIPTION =
   "Use a short API name, keyword, or phrase (for example: 'createServer', 'cors middleware'). Search terms are all matched together, so extra words will narrow but can also eliminate results.";
 
 export const SEARCH_PACKAGES_DESCRIPTION =
-  "Search for documentation packages available on the registry server. Use short package names like 'react', 'next', or 'fastapi'. If you find a match, call download_package, then retry get_docs. If the registry package is unavailable or insufficient, ask the user to run `context add` to build docs from source.";
+  "Search for documentation packages available on the registry server. Use short package names like 'react', 'next', or 'fastapi'. If you find a match, call download_package, then retry get_docs. If the registry package is unavailable or insufficient, ask the user to run `libref add <url>` — any website URL works (auto-fetches llms.txt or falls back to sitemap.xml), and GitHub repos or local directories are also accepted.";
 
 export const SEARCH_PACKAGES_NAME_DESCRIPTION =
   'Short package name to search for (e.g., "react", "next", "fastapi")';
@@ -20,4 +20,4 @@ export const NO_DOCUMENTATION_FOUND_MESSAGE =
   "No documentation found. Try a shorter query using just the API or function name, for example 'cors' instead of 'CORS middleware configuration'.";
 
 export const MISSING_PACKAGE_GUIDANCE =
-  "If the library is not installed, search the registry with search_packages, download it with download_package, then retry get_docs. If the registry package is unavailable or insufficient, ask the user to run `context add` to build docs from source.";
+  "If the library is not installed, search the registry with search_packages, download it with download_package, then retry get_docs. If the registry package is unavailable or insufficient, ask the user to run `libref add <url>` to build docs from source — any website URL works (auto-fetches llms.txt or falls back to sitemap.xml), and GitHub repos or local directories are also accepted.";
diff --git a/packages/context/src/html.ts b/packages/libref/src/html.ts
similarity index 100%
rename from packages/context/src/html.ts
rename to packages/libref/src/html.ts
diff --git a/packages/context/src/index.ts b/packages/libref/src/index.ts
similarity index 98%
rename from packages/context/src/index.ts
rename to packages/libref/src/index.ts
index bd30f21..d2aa3a9 100644
--- a/packages/context/src/index.ts
+++ b/packages/libref/src/index.ts
@@ -39,6 +39,7 @@ export {
   extractVersion,
   type GitCloneResult,
   isGitUrl,
+  isMissingRefError,
   type LocalDocsResult,
   parseGitUrl,
   readLocalDocsFiles,
diff --git a/packages/context/src/llms-txt.test.ts b/packages/libref/src/llms-txt.test.ts
similarity index 100%
rename from packages/context/src/llms-txt.test.ts
rename to packages/libref/src/llms-txt.test.ts
diff --git a/packages/context/src/llms-txt.ts b/packages/libref/src/llms-txt.ts
similarity index 100%
rename from packages/context/src/llms-txt.ts
rename to packages/libref/src/llms-txt.ts
diff --git a/packages/context/src/package-builder.test.ts b/packages/libref/src/package-builder.test.ts
similarity index 74%
rename from packages/context/src/package-builder.test.ts
rename to packages/libref/src/package-builder.test.ts
index a3abb03..dc68612 100644
--- a/packages/context/src/package-builder.test.ts
+++ b/packages/libref/src/package-builder.test.ts
@@ -3,7 +3,7 @@ import { tmpdir } from "node:os";
 import { join } from "node:path";
 import { afterEach, beforeAll, describe, expect, it } from "vitest";
 import { initDatabase, openDatabase } from "./database.js";
-import { buildPackage } from "./package-builder.js";
+import { buildPackage, splitMarkdownByHeadings } from "./package-builder.js";
 
 describe("buildPackage", () => {
   beforeAll(async () => {
@@ -309,3 +309,121 @@ Run the install command.
     }
   });
 });
+
+describe("splitMarkdownByHeadings", () => {
+  it("splits content by ## headings into preamble + per-section parts", () => {
+    const file = {
+      path: "test.txt",
+      content: `# Docs
+
+Intro text.
+
+## Workers
+
+Workers content.
+
+## Pages
+
+Pages content.`,
+    };
+    const result = splitMarkdownByHeadings(file);
+    // preamble + 2 sections = 3 parts
+    expect(result).toHaveLength(3);
+    expect(result[0]?.content).toContain("Intro text.");
+    expect(result[0]?.content).not.toContain("## Workers");
+    expect(result[1]?.content).toContain("## Workers");
+    expect(result[1]?.content).toContain("Workers content.");
+    expect(result[2]?.content).toContain("## Pages");
+    expect(result[2]?.content).toContain("Pages content.");
+  });
+
+  it("handles content starting with ## (no preamble)", () => {
+    const file = {
+      path: "test.txt",
+      content: `## Alpha
+
+Alpha content.
+
+## Beta
+
+Beta content.`,
+    };
+    const result = splitMarkdownByHeadings(file);
+    expect(result).toHaveLength(2);
+    expect(result[0]?.content).toMatch(/^## Alpha/);
+    expect(result[0]?.content).toContain("Alpha content.");
+    expect(result[1]?.content).toMatch(/^## Beta/);
+    expect(result[1]?.content).toContain("Beta content.");
+  });
+
+  it("returns original file when no ## headings exist", () => {
+    const file = {
+      path: "readme.md",
+      content:
+        "# Title\n\nJust a single section.\n\n### Subheading\n\nMore content.",
+    };
+    const result = splitMarkdownByHeadings(file);
+    expect(result).toEqual([file]);
+  });
+
+  it("returns original file when content starts with a single ## section (no split needed)", () => {
+    const file = {
+      path: "single.txt",
+      content: "## Only One Section\n\nContent here.",
+    };
+    const result = splitMarkdownByHeadings(file);
+    expect(result).toEqual([file]);
+  });
+
+  it("preserves the preamble before the first ## heading", () => {
+    const file = {
+      path: "docs.md",
+      content: `---
+title: Docs
+---
+
+# Title
+
+Intro paragraph.
+
+## First Section
+
+Content here.`,
+    };
+    const result = splitMarkdownByHeadings(file);
+    expect(result).toHaveLength(2);
+    expect(result[0]?.content).toContain("Intro paragraph.");
+    expect(result[1]?.content).toContain("## First Section");
+    expect(result[1]?.content).toContain("Content here.");
+  });
+
+  it("preserves empty lines within sections", () => {
+    const file = {
+      path: "spacing.txt",
+      content: `## Section A
+
+Line 1.
+
+Line 2.
+
+## Section B
+
+Line 3.`,
+    };
+    const result = splitMarkdownByHeadings(file);
+    expect(result).toHaveLength(2);
+    expect(result[0]?.content).toContain("Line 1.\n\nLine 2.");
+    expect(result[1]?.content).toContain("Line 3.");
+  });
+
+  it("preserves doc_path across all split parts", () => {
+    const file = {
+      path: "cloudflare.com/llms-full.txt",
+      content: `## Workers\nContent.\n\n## Pages\nContent.`,
+    };
+    const result = splitMarkdownByHeadings(file);
+    for (const part of result) {
+      expect(part.path).toBe("cloudflare.com/llms-full.txt");
+    }
+  });
+});
diff --git a/packages/context/src/package-builder.ts b/packages/libref/src/package-builder.ts
similarity index 75%
rename from packages/context/src/package-builder.ts
rename to packages/libref/src/package-builder.ts
index 135ec61..1ea9795 100644
--- a/packages/context/src/package-builder.ts
+++ b/packages/libref/src/package-builder.ts
@@ -35,6 +35,37 @@ export interface BuildResult {
   totalTokens: number;
 }
 
+/** Files larger than this are pre-split by ## headings before AST parsing to avoid OOM. */
+const MAX_FILE_SIZE_FOR_PARSING = 1024 * 1024; // 1MB
+
+/** Pre-split oversized markdown by ## headings into independently parseable chunks. */
+export function splitMarkdownByHeadings(file: MarkdownFile): MarkdownFile[] {
+  if (!/^## /m.test(file.content)) {
+    return [file];
+  }
+
+  const parts: string[] = [];
+  let current: string[] = [];
+
+  for (const line of file.content.split("\n")) {
+    if (line.startsWith("## ")) {
+      if (current.length > 0) {
+        parts.push(current.join("\n"));
+      }
+      current = [line];
+    } else {
+      current.push(line);
+    }
+  }
+  if (current.length > 0) {
+    parts.push(current.join("\n"));
+  }
+
+  if (parts.length <= 1) return [file];
+
+  return parts.map((content) => ({ path: file.path, content }));
+}
+
 /**
  * Build a documentation package from markdown files.
  */
@@ -95,7 +126,18 @@ export function buildPackage(
     const allSections: DocSection[] = [];
     const seenHashes = new Set<string>();
 
-    for (const file of files) {
+    // Pre-split oversized files by ## headings to avoid OOM during AST parsing
+    const processedFiles = files.flatMap((file) => {
+      if (
+        file.content.length > MAX_FILE_SIZE_FOR_PARSING &&
+        /\.(md|mdx|txt)$/i.test(file.path)
+      ) {
+        return splitMarkdownByHeadings(file);
+      }
+      return [file];
+    });
+
+    for (const file of processedFiles) {
       try {
         const parsed = parseDocument(file.content, file.path);
         for (const section of parsed.sections) {
diff --git a/packages/libref/src/resolve-package.ts b/packages/libref/src/resolve-package.ts
new file mode 100644
index 0000000..b0cac4f
--- /dev/null
+++ b/packages/libref/src/resolve-package.ts
@@ -0,0 +1,131 @@
+import type { PackageInfo } from "./store.js";
+
+/**
+ * Parse a "registry/name[@version]" string (e.g., "npm/next",
+ * "pip/django", "npm/next@16.1.7", "npm/@trpc/server@10.0.0").
+ * Returns { registry, name, version? } or null if the format is invalid.
+ */
+export function parseRegistryPackage(input: string): {
+  registry: string;
+  name: string;
+  version?: string;
+} | null {
+  // Handle scoped packages: npm/@scope/name → registry=npm, name=@scope/name
+  const firstSlash = input.indexOf("/");
+  if (firstSlash <= 0) return null;
+
+  const registry = input.slice(0, firstSlash);
+  let name = input.slice(firstSlash + 1);
+  if (!name) return null;
+
+  // Split off an optional trailing "@version". Use lastIndexOf so scoped
+  // package names like "@trpc/server" aren't mistaken for a version marker.
+  let version: string | undefined;
+  const atIdx = name.lastIndexOf("@");
+  if (atIdx > 0) {
+    const v = name.slice(atIdx + 1);
+    if (v) version = v;
+    name = name.slice(0, atIdx);
+  }
+  if (!name) return null;
+
+  return version ? { registry, name, version } : { registry, name };
+}
+
+/** Parse a `--libs` spec into name (optionally with @version). */
+// Uses lastIndexOf so scoped names like `@trpc/server@1.0.0` split correctly,
+// while a bare scoped name `@trpc/server` (leading `@` only) keeps its name.
+export function parseLibSpec(spec: string): { name: string; version?: string } {
+  const at = spec.lastIndexOf("@");
+  if (at <= 0) return { name: spec };
+  return { name: spec.slice(0, at), version: spec.slice(at + 1) };
+}
+
+/**
+ * Resolve a user-typed library spec against the installed packages.
+ *
+ * Accepts:
+ *   - `name` (e.g. `opentofu`) — matches any installed version of `name`.
+ *   - `name@version` (e.g. `opentofu@1.12`) — exact name+version match.
+ *   - `@scope/name[@version]` (e.g. `@trpc/server@10.0.0`) — scoped names
+ *     are kept intact; the leading `@` is treated as part of the name.
+ *   - `registry/name[@version]` (e.g. `npm/opentofu@1.12`) — tried as a
+ *     fallback when a direct match fails, so a spec copied from
+ *     `libref install` works here too.
+ *   - A trailing `@` (e.g. `opentofu@`) is treated as no version.
+ *   - The SLD or full main domain (e.g. `cloudflare` or `cloudflare.com`)
+ *     — tried as a last-resort fallback for bare inputs without a
+ *     `@version`, so `cloudflare` matches `developers.cloudflare.com`
+ *     when no `cloudflare` package is installed.
+ *
+ * Returns the matched package, or `null` if no installed package fits.
+ */
+export function resolveQueryPackage(
+  input: string,
+  packages: PackageInfo[],
+): PackageInfo | null {
+  const trimmed = input.trim();
+  if (!trimmed) return null;
+
+  // Match the input as a name[@version] first. parseLibSpec keeps a
+  // leading "@" attached to scoped names ("@trpc/server@1.0.0" splits on
+  // the last "@" only), so this path covers scoped names too.
+  const direct = findBySpec(parseLibSpec(trimmed), packages);
+  if (direct) return direct;
+
+  // Fall back to stripping a leading "registry/" segment. We only consult
+  // parseRegistryPackage here so a scoped name like "@trpc/server" is
+  // never misread as registry="@trpc", name="server".
+  if (trimmed.indexOf("/") > 0) {
+    const registryParsed = parseRegistryPackage(trimmed);
+    if (registryParsed) {
+      const fromRegistry = findBySpec(
+        { name: registryParsed.name, version: registryParsed.version },
+        packages,
+      );
+      if (fromRegistry) return fromRegistry;
+    }
+  }
+
+  // Last-resort fallback: match the input against the second-level
+  // domain (e.g. "cloudflare") or the full main domain ("cloudflare.com")
+  // of a package name. Only when the user did not pin a version — a
+  // pinned `cloudflare@1.0.0` is a precise spec, not a brand hint.
+  if (!parseLibSpec(trimmed).version) {
+    const byDomain = packages.find((p) => matchesByDomain(trimmed, p.name));
+    if (byDomain) return byDomain;
+  }
+
+  return null;
+}
+
+function findBySpec(
+  spec: { name: string; version?: string },
+  packages: PackageInfo[],
+): PackageInfo | null {
+  if (!spec.name) return null;
+  return (
+    packages.find((p) => {
+      if (p.name !== spec.name) return false;
+      if (spec.version && p.version !== spec.version) return false;
+      return true;
+    }) ?? null
+  );
+}
+
+/**
+ * True when `input` matches the second-level domain or the full main
+ * domain of `packageName`. `developers.cloudflare.com` → SLD `cloudflare`,
+ * main domain `cloudflare.com`. Names with fewer than two dot-separated
+ * labels have no main domain to match against.
+ */
+function matchesByDomain(input: string, packageName: string): boolean {
+  const parts = packageName.split(".");
+  if (parts.length < 2) return false;
+  const sld = parts[parts.length - 2];
+  const tld = parts[parts.length - 1];
+  if (!sld || !tld) return false;
+  if (input === sld) return true;
+  if (input === `${sld}.${tld}`) return true;
+  return false;
+}
diff --git a/packages/context/src/search.test.ts b/packages/libref/src/search.test.ts
similarity index 100%
rename from packages/context/src/search.test.ts
rename to packages/libref/src/search.test.ts
diff --git a/packages/context/src/search.ts b/packages/libref/src/search.ts
similarity index 100%
rename from packages/context/src/search.ts
rename to packages/libref/src/search.ts
diff --git a/packages/context/src/server.test.ts b/packages/libref/src/server.test.ts
similarity index 99%
rename from packages/context/src/server.test.ts
rename to packages/libref/src/server.test.ts
index 56a0c18..a22980e 100644
--- a/packages/context/src/server.test.ts
+++ b/packages/libref/src/server.test.ts
@@ -399,7 +399,7 @@ describe("ContextServer HTTP transport", () => {
     expect(getDocsText).toContain("search_packages");
     expect(searchPackagesText).toContain("Use short package names like");
     expect(searchPackagesText).toContain("download_package");
-    expect(searchPackagesText).toContain("context add");
+    expect(searchPackagesText).toContain("libref add");
   });
 
   it("returns tool results via HTTP transport", async () => {
diff --git a/packages/context/src/server.ts b/packages/libref/src/server.ts
similarity index 99%
rename from packages/context/src/server.ts
rename to packages/libref/src/server.ts
index dfde5ec..c418397 100644
--- a/packages/context/src/server.ts
+++ b/packages/libref/src/server.ts
@@ -17,6 +17,7 @@ import {
   SEARCH_PACKAGES_DESCRIPTION,
   SEARCH_PACKAGES_NAME_DESCRIPTION,
 } from "./guidance.js";
+import { resolveQueryPackage } from "./resolve-package.js";
 import { type SearchResult, search } from "./search.js";
 import type { PackageInfo, PackageStore } from "./store.js";
 
@@ -250,7 +251,7 @@ export class ContextServer {
     topic: string,
   ): { content: { type: "text"; text: string }[] } {
     const packages = this.visiblePackages();
-    const pkg = packages.find((p) => formatLibraryName(p) === library);
+    const pkg = resolveQueryPackage(library, packages);
 
     if (!pkg) {
       return {
diff --git a/packages/context/src/server.workflow.test.ts b/packages/libref/src/server.workflow.test.ts
similarity index 100%
rename from packages/context/src/server.workflow.test.ts
rename to packages/libref/src/server.workflow.test.ts
diff --git a/packages/libref/src/sitemap.test.ts b/packages/libref/src/sitemap.test.ts
new file mode 100644
index 0000000..84a1f6f
--- /dev/null
+++ b/packages/libref/src/sitemap.test.ts
@@ -0,0 +1,207 @@
+import { describe, expect, it, vi } from "vitest";
+import {
+  fetchSitemapUrls,
+  parseSitemap,
+  resolveSitemapUrls,
+} from "./sitemap.js";
+
+describe("parseSitemap", () => {
+  it("parses a urlset with absolute URLs", () => {
+    const xml = `<?xml version="1.0" encoding="UTF-8"?>
+<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
+  <url><loc>https://example.com/a</loc></url>
+  <url><loc>https://example.com/b</loc></url>
+</urlset>`;
+    const result = parseSitemap(xml, "https://example.com/sitemap.xml");
+    expect(result).toEqual({
+      kind: "urlset",
+      urls: ["https://example.com/a", "https://example.com/b"],
+    });
+  });
+
+  it("resolves relative loc URLs against baseUrl", () => {
+    const xml = `<urlset><url><loc>/docs/a</loc></url></urlset>`;
+    const result = parseSitemap(xml, "https://example.com/sitemap.xml");
+    expect(result).toEqual({
+      kind: "urlset",
+      urls: ["https://example.com/docs/a"],
+    });
+  });
+
+  it("detects a sitemapindex and returns nested sitemap URLs", () => {
+    const xml = `<?xml version="1.0" encoding="UTF-8"?>
+<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
+  <sitemap><loc>https://example.com/sitemaps/docs.xml</loc></sitemap>
+  <sitemap><loc>https://example.com/sitemaps/blog.xml</loc></sitemap>
+</sitemapindex>`;
+    const result = parseSitemap(xml, "https://example.com/sitemap.xml");
+    expect(result).toEqual({
+      kind: "index",
+      sitemaps: [
+        "https://example.com/sitemaps/docs.xml",
+        "https://example.com/sitemaps/blog.xml",
+      ],
+    });
+  });
+
+  it("tolerates namespaced loc tags", () => {
+    const xml = `<urlset xmlns:ns="http://example.com/ns"><url><ns:loc>https://example.com/x</ns:loc></url></urlset>`;
+    const result = parseSitemap(xml, "https://example.com/sitemap.xml");
+    expect(result).toEqual({
+      kind: "urlset",
+      urls: ["https://example.com/x"],
+    });
+  });
+
+  it("returns empty when no loc tags are present", () => {
+    const xml = `<urlset></urlset>`;
+    expect(parseSitemap(xml, "https://example.com/sitemap.xml")).toEqual({
+      kind: "empty",
+    });
+  });
+
+  it("skips URLs that fail to resolve and returns empty if none valid", () => {
+    const xml = `<urlset><url><loc>http://[invalid</loc></url></urlset>`;
+    expect(parseSitemap(xml, "https://example.com/sitemap.xml")).toEqual({
+      kind: "empty",
+    });
+  });
+});
+
+describe("resolveSitemapUrls", () => {
+  it("returns candidate paths at the source URL's origin and at the site root", () => {
+    expect(resolveSitemapUrls("https://example.com/docs/")).toEqual([
+      "https://example.com/docs/sitemap.xml",
+      "https://example.com/docs/sitemap_index.xml",
+      "https://example.com/sitemap.xml",
+      "https://example.com/sitemap_index.xml",
+    ]);
+  });
+
+  it("dedupes identical source-path and root paths for root URLs", () => {
+    expect(resolveSitemapUrls("https://example.com")).toEqual([
+      "https://example.com/sitemap.xml",
+      "https://example.com/sitemap_index.xml",
+      "https://example.com/sitemap.xml",
+      "https://example.com/sitemap_index.xml",
+    ]);
+  });
+});
+
+describe("fetchSitemapUrls", () => {
+  function jsonResponse(body: string, status = 200): Response {
+    return new Response(body, {
+      status,
+      headers: { "content-type": "application/xml" },
+    });
+  }
+
+  function notFound(): Response {
+    return new Response("not found", { status: 404 });
+  }
+
+  it("returns urls from a flat sitemap", async () => {
+    const sitemap = `<?xml version="1.0"?>
+<urlset><url><loc>https://example.com/docs/a</loc></url><url><loc>https://example.com/docs/b</loc></url></urlset>`;
+    const fetchImpl = vi.fn(async (url: string) => {
+      if (url === "https://example.com/sitemap.xml")
+        return jsonResponse(sitemap);
+      return notFound();
+    });
+
+    const urls = await fetchSitemapUrls("https://example.com", {
+      fetchImpl: fetchImpl as unknown as typeof fetch,
+    });
+
+    expect(urls).toEqual([
+      "https://example.com/docs/a",
+      "https://example.com/docs/b",
+    ]);
+  });
+
+  it("falls back to sitemap_index.xml when sitemap.xml is 404", async () => {
+    const sitemap = `<urlset><url><loc>https://example.com/docs/a</loc></url></urlset>`;
+    const fetchImpl = vi.fn(async (url: string) => {
+      if (url === "https://example.com/sitemap.xml") return notFound();
+      if (url === "https://example.com/sitemap_index.xml")
+        return jsonResponse(sitemap);
+      return notFound();
+    });
+
+    const urls = await fetchSitemapUrls("https://example.com", {
+      fetchImpl: fetchImpl as unknown as typeof fetch,
+    });
+
+    expect(urls).toEqual(["https://example.com/docs/a"]);
+  });
+
+  it("recurses into sitemap indexes", async () => {
+    const index = `<?xml version="1.0"?>
+<sitemapindex>
+  <sitemap><loc>https://example.com/sitemaps/docs.xml</loc></sitemap>
+  <sitemap><loc>https://example.com/sitemaps/blog.xml</loc></sitemap>
+</sitemapindex>`;
+    const docsSitemap = `<urlset><url><loc>https://example.com/docs/a</loc></url></urlset>`;
+    const blogSitemap = `<urlset><url><loc>https://example.com/blog/x</loc></url></urlset>`;
+    const fetchImpl = vi.fn(async (url: string) => {
+      if (url === "https://example.com/sitemap.xml") return jsonResponse(index);
+      if (url === "https://example.com/sitemaps/docs.xml")
+        return jsonResponse(docsSitemap);
+      if (url === "https://example.com/sitemaps/blog.xml")
+        return jsonResponse(blogSitemap);
+      return notFound();
+    });
+
+    const urls = await fetchSitemapUrls("https://example.com", {
+      fetchImpl: fetchImpl as unknown as typeof fetch,
+    });
+
+    expect(urls.sort()).toEqual(
+      ["https://example.com/docs/a", "https://example.com/blog/x"].sort(),
+    );
+  });
+
+  it("returns empty when no candidate sitemap responds", async () => {
+    const fetchImpl = vi.fn(async () => notFound());
+    const urls = await fetchSitemapUrls("https://example.com", {
+      fetchImpl: fetchImpl as unknown as typeof fetch,
+    });
+    expect(urls).toEqual([]);
+  });
+
+  it("dedupes URLs across nested sitemaps", async () => {
+    const index = `<sitemapindex><sitemap><loc>https://example.com/a.xml</loc></sitemap><sitemap><loc>https://example.com/b.xml</loc></sitemap></sitemapindex>`;
+    const shared = `<urlset><url><loc>https://example.com/docs/shared</loc></url></urlset>`;
+    const fetchImpl = vi.fn(async (url: string) => {
+      if (url === "https://example.com/sitemap.xml") return jsonResponse(index);
+      if (url === "https://example.com/a.xml") return jsonResponse(shared);
+      if (url === "https://example.com/b.xml") return jsonResponse(shared);
+      return notFound();
+    });
+
+    const urls = await fetchSitemapUrls("https://example.com", {
+      fetchImpl: fetchImpl as unknown as typeof fetch,
+    });
+
+    expect(urls).toEqual(["https://example.com/docs/shared"]);
+  });
+
+  it("respects maxUrls cap", async () => {
+    const sitemap = Array.from(
+      { length: 50 },
+      (_, i) => `<url><loc>https://example.com/p${i}</loc></url>`,
+    ).join("");
+    const fetchImpl = vi.fn(async (url: string) => {
+      if (url === "https://example.com/sitemap.xml")
+        return jsonResponse(`<urlset>${sitemap}</urlset>`);
+      return notFound();
+    });
+
+    const urls = await fetchSitemapUrls("https://example.com", {
+      maxUrls: 5,
+      fetchImpl: fetchImpl as unknown as typeof fetch,
+    });
+
+    expect(urls).toHaveLength(5);
+  });
+});
diff --git a/packages/libref/src/sitemap.ts b/packages/libref/src/sitemap.ts
new file mode 100644
index 0000000..332170e
--- /dev/null
+++ b/packages/libref/src/sitemap.ts
@@ -0,0 +1,170 @@
+/**
+ * sitemap.xml discovery for documentation sites that don't publish an
+ * llms.txt index. Parses sitemap documents (including sitemap indexes),
+ * recurses into nested sitemaps, and returns the deduped URL list.
+ */
+
+import { buildFetchOptions, fetchWithTimeout } from "./fetch.js";
+
+export type ParsedSitemap =
+  | { kind: "urlset"; urls: string[] }
+  | { kind: "index"; sitemaps: string[] }
+  | { kind: "empty" };
+
+const LOC_RE = /<(?:[a-z0-9_-]+:)?loc>\s*([^<]+?)\s*<\/(?:[a-z0-9_-]+:)?loc>/gi;
+const SITEMAPINDEX_RE = /<(?:[a-z0-9_-]+:)?sitemapindex[\s>]/i;
+
+/**
+ * Parse a sitemap XML document. Returns a flat urlset, a sitemap index
+ * pointing at nested sitemaps, or `empty` when no URLs were found.
+ * Relative `<loc>` values are resolved against `baseUrl`.
+ */
+export function parseSitemap(xml: string, baseUrl: string): ParsedSitemap {
+  const matches = Array.from(xml.matchAll(LOC_RE));
+  if (matches.length === 0) return { kind: "empty" };
+
+  const locs: string[] = [];
+  for (const m of matches) {
+    const raw = m[1]?.trim();
+    if (!raw) continue;
+    try {
+      locs.push(new URL(raw, baseUrl).toString());
+    } catch {
+      // skip invalid URLs
+    }
+  }
+
+  if (locs.length === 0) return { kind: "empty" };
+  return SITEMAPINDEX_RE.test(xml)
+    ? { kind: "index", sitemaps: locs }
+    : { kind: "urlset", urls: locs };
+}
+
+const SITEMAP_PATHS = ["/sitemap.xml", "/sitemap_index.xml"];
+
+/** Build candidate sitemap URLs to try for a given source URL.
+ * Tries both the source's path and the site root, since many sites only
+ * publish a single root-level sitemap.xml. */
+export function resolveSitemapUrls(source: string): string[] {
+  const url = new URL(source);
+  const sourceBase = url.origin + url.pathname.replace(/\/$/, "");
+  const root = url.origin;
+  return [
+    ...SITEMAP_PATHS.map((p) => `${sourceBase}${p}`),
+    ...SITEMAP_PATHS.map((p) => `${root}${p}`),
+  ];
+}
+
+export interface FetchSitemapOptions {
+  /** Maximum number of concurrent fetches. Default 5. */
+  concurrency?: number;
+  /** Per-request timeout in milliseconds. Default 30s. */
+  timeoutMs?: number;
+  /** Maximum number of URLs to return. Default 500. */
+  maxUrls?: number;
+  /** Custom fetch implementation (for tests). Defaults to global fetch. */
+  fetchImpl?: typeof fetch;
+  /** Optional logger. */
+  log?: (message: string) => void;
+}
+
+interface SitemapTask {
+  url: string;
+}
+
+/**
+ * Fetch the sitemap at `sourceUrl`, recursing into sitemap indexes.
+ * Returns a deduped list of all URLs found across the sitemap tree.
+ * Returns an empty array when no candidate sitemap responds successfully.
+ */
+export async function fetchSitemapUrls(
+  sourceUrl: string,
+  options: FetchSitemapOptions = {},
+): Promise<string[]> {
+  const {
+    concurrency = 5,
+    timeoutMs = 30_000,
+    maxUrls = 500,
+    fetchImpl = fetch,
+    log,
+  } = options;
+
+  const queue: SitemapTask[] = [];
+  const seenDocs = new Set<string>();
+  const seenSitemaps = new Set<string>();
+  const docs: string[] = [];
+
+  for (const candidate of resolveSitemapUrls(sourceUrl)) {
+    const parsed = await tryFetchSitemap(candidate, fetchImpl, timeoutMs);
+    if (!parsed || parsed.kind === "empty") continue;
+    log?.(`✓ Found sitemap at ${candidate}`);
+    enqueueSitemap(parsed, queue, seenSitemaps, seenDocs, docs, maxUrls);
+    break;
+  }
+
+  if (queue.length === 0) return docs.slice(0, maxUrls);
+
+  let next = 0;
+  async function worker(): Promise<void> {
+    while (next < queue.length) {
+      if (docs.length >= maxUrls) return;
+      const task = queue[next++];
+      if (!task) return;
+      const parsed = await tryFetchSitemap(task.url, fetchImpl, timeoutMs);
+      if (parsed && parsed.kind !== "empty") {
+        enqueueSitemap(parsed, queue, seenSitemaps, seenDocs, docs, maxUrls);
+      }
+    }
+  }
+
+  const workerCount = Math.min(concurrency, queue.length);
+  await Promise.all(Array.from({ length: workerCount }, () => worker()));
+
+  return docs.slice(0, maxUrls);
+}
+
+async function tryFetchSitemap(
+  url: string,
+  fetchImpl: typeof fetch,
+  timeoutMs: number,
+): Promise<ParsedSitemap | null> {
+  try {
+    const response = await fetchWithTimeout(
+      fetchImpl,
+      url,
+      buildFetchOptions(url),
+      timeoutMs,
+    );
+    if (!response.ok) return null;
+    const xml = await response.text();
+    if (!xml.trim()) return null;
+    return parseSitemap(xml, url);
+  } catch {
+    return null;
+  }
+}
+
+function enqueueSitemap(
+  parsed: ParsedSitemap,
+  queue: SitemapTask[],
+  seenSitemaps: Set<string>,
+  seenDocs: Set<string>,
+  docs: string[],
+  maxUrls: number,
+): void {
+  if (parsed.kind === "index") {
+    for (const url of parsed.sitemaps) {
+      if (seenSitemaps.has(url)) continue;
+      seenSitemaps.add(url);
+      queue.push({ url });
+    }
+    return;
+  }
+  if (parsed.kind === "empty") return;
+  for (const url of parsed.urls) {
+    if (docs.length >= maxUrls) return;
+    if (seenDocs.has(url)) continue;
+    seenDocs.add(url);
+    docs.push(url);
+  }
+}
diff --git a/packages/context/src/sql.js.d.ts b/packages/libref/src/sql.js.d.ts
similarity index 100%
rename from packages/context/src/sql.js.d.ts
rename to packages/libref/src/sql.js.d.ts
diff --git a/packages/context/src/store.test.ts b/packages/libref/src/store.test.ts
similarity index 100%
rename from packages/context/src/store.test.ts
rename to packages/libref/src/store.test.ts
diff --git a/packages/context/src/store.ts b/packages/libref/src/store.ts
similarity index 100%
rename from packages/context/src/store.ts
rename to packages/libref/src/store.ts
diff --git a/packages/context/src/test-utils.ts b/packages/libref/src/test-utils.ts
similarity index 100%
rename from packages/context/src/test-utils.ts
rename to packages/libref/src/test-utils.ts
diff --git a/packages/context/tsconfig.build.json b/packages/libref/tsconfig.build.json
similarity index 100%
rename from packages/context/tsconfig.build.json
rename to packages/libref/tsconfig.build.json
diff --git a/packages/context/tsconfig.json b/packages/libref/tsconfig.json
similarity index 72%
rename from packages/context/tsconfig.json
rename to packages/libref/tsconfig.json
index 5ca7d86..88b6f22 100644
--- a/packages/context/tsconfig.json
+++ b/packages/libref/tsconfig.json
@@ -5,8 +5,8 @@
     "module": "NodeNext",
     "baseUrl": ".",
     "paths": {
-      "@neuledge/context": ["src/index.js"],
-      "@neuledge/context/*": ["src/*"]
+      "@wernerbisschoff/libref": ["src/index.js"],
+      "@wernerbisschoff/libref/*": ["src/*"]
     },
     "noEmit": true
   },
diff --git a/packages/context/vitest.config.ts b/packages/libref/vitest.config.ts
similarity index 100%
rename from packages/context/vitest.config.ts
rename to packages/libref/vitest.config.ts
diff --git a/packages/registry/CHANGELOG.md b/packages/registry/CHANGELOG.md
index 7eed214..a89eee3 100644
--- a/packages/registry/CHANGELOG.md
+++ b/packages/registry/CHANGELOG.md
@@ -1,5 +1,12 @@
 # @neuledge/registry
 
+## 0.0.13
+
+### Patch Changes
+
+- Updated dependencies [[`45319fc`](https://github.com/neuledge/context/commit/45319fc6bbf0cb4695c26a221d0fac5dea745682)]:
+  - @neuledge/context@1.2.0
+
 ## 0.0.12
 
 ### Patch Changes
diff --git a/packages/registry/package.json b/packages/registry/package.json
index db9f3ef..b6e33d0 100644
--- a/packages/registry/package.json
+++ b/packages/registry/package.json
@@ -1,6 +1,6 @@
 {
   "name": "@neuledge/registry",
-  "version": "0.0.12",
+  "version": "0.0.18",
   "private": true,
   "description": "Registry infrastructure for building and publishing context packages",
   "type": "module",
@@ -25,7 +25,7 @@
   "author": "Neuledge",
   "license": "Apache-2.0",
   "dependencies": {
-    "@neuledge/context": "workspace:*",
+    "@wernerbisschoff/libref": "workspace:*",
     "commander": "^14.0.0",
     "p-retry": "^8.0.0",
     "yaml": "^2.8.2",
diff --git a/packages/registry/src/build.ts b/packages/registry/src/build.ts
index 3e23ec1..ac347e6 100644
--- a/packages/registry/src/build.ts
+++ b/packages/registry/src/build.ts
@@ -1,7 +1,7 @@
 /**
  * Build documentation packages from registry definitions.
  *
- * Uses @neuledge/context functions directly (workspace dependency)
+ * Uses @wernerbisschoff/libref functions directly (workspace dependency)
  * to clone repos, read docs, and build SQLite packages.
  *
  * Supports both versioned (clone at specific tag) and unversioned
@@ -15,7 +15,7 @@ import {
   buildPackage,
   cloneRepository,
   readLocalDocsFiles,
-} from "@neuledge/context";
+} from "@wernerbisschoff/libref";
 import {
   constructTag,
   isGitVersionEntry,
diff --git a/packages/registry/src/cli.ts b/packages/registry/src/cli.ts
index 905bb7e..c45d5be 100644
--- a/packages/registry/src/cli.ts
+++ b/packages/registry/src/cli.ts
@@ -7,6 +7,7 @@
 
 import { mkdirSync, rmSync } from "node:fs";
 import { resolve } from "node:path";
+import { isMissingRefError } from "@wernerbisschoff/libref";
 import { Command } from "commander";
 import {
   buildFromDefinition,
@@ -291,6 +292,13 @@ program
           succeeded++;
         } catch (err) {
           const message = err instanceof Error ? err.message : String(err);
+          // A registry can publish a version before its git tag is pushed.
+          // Skip (don't fail) — the next run picks it up once the tag lands.
+          if (isMissingRefError(message)) {
+            console.log(`  Skipping ${id} (git tag not published yet)`);
+            skipped++;
+            continue;
+          }
           console.error(`  FAILED ${id}: ${message}`);
           failures.push({ id, error: message });
         }
diff --git a/packages/registry/src/version-check.test.ts b/packages/registry/src/version-check.test.ts
index 5ba49e0..0312bd7 100644
--- a/packages/registry/src/version-check.test.ts
+++ b/packages/registry/src/version-check.test.ts
@@ -137,6 +137,33 @@ describe("discoverVersions", () => {
     );
   });
 
+  it("fetches hex versions and filters to defined ranges", async () => {
+    const hexDef: VersionedDefinition = {
+      ...mockDefinition,
+      name: "phoenix",
+      registry: "hex",
+    };
+
+    const mockFetch = vi.mocked(fetch);
+    mockFetch.mockResolvedValueOnce({
+      ok: true,
+      json: async () => ({
+        releases: [
+          { version: "1.7.0", inserted_at: "2024-06-01T00:00:00Z" },
+          { version: "1.6.0", inserted_at: "2024-03-01T00:00:00Z" },
+          { version: "1.5.0", inserted_at: "2024-01-01T00:00:00Z" },
+        ],
+      }),
+    } as Response);
+
+    const versions = await discoverVersions(hexDef);
+
+    expect(versions.map((v) => v.version)).toEqual(["1.7.0", "1.6.0", "1.5.0"]);
+    expect(mockFetch).toHaveBeenCalledWith(
+      expect.stringContaining("hex.pm/api/packages/phoenix"),
+    );
+  });
+
   it("throws for unsupported registry", async () => {
     const def = { ...mockDefinition, registry: "cargo" };
     await expect(discoverVersions(def)).rejects.toThrow(
diff --git a/packages/registry/src/version-check.ts b/packages/registry/src/version-check.ts
index ce3bf34..ace0b17 100644
--- a/packages/registry/src/version-check.ts
+++ b/packages/registry/src/version-check.ts
@@ -1,5 +1,5 @@
 /**
- * Version discovery from package registry APIs (npm, pip, maven).
+ * Version discovery from package registry APIs (npm, pip, maven, hex).
  *
  * Queries public registry APIs to find available versions,
  * filters to defined ranges, and deduplicates to latest-patch-per-minor.
@@ -32,6 +32,7 @@ const registryFetchers: Record<string, RegistryFetcher> = {
   npm: fetchNpmVersions,
   pip: fetchPipVersions,
   maven: fetchMavenVersions,
+  hex: fetchHexVersions,
 };
 
 /**
@@ -196,6 +197,29 @@ async function fetchMavenVersions(packageName: string): Promise<VersionInfo[]> {
   }));
 }
 
+/**
+ * Fetch versions from Hex.pm API.
+ * Package names are lowercase with underscores (e.g., "phoenix", "phoenix_live_view").
+ */
+async function fetchHexVersions(packageName: string): Promise<VersionInfo[]> {
+  const res = await fetchWithRetry(
+    `https://hex.pm/api/packages/${encodeURIComponent(packageName)}`,
+    `Hex`,
+    packageName,
+  );
+
+  const data = (await res.json()) as {
+    releases?: Array<{ version?: string; inserted_at?: string }>;
+  };
+
+  const releases = data.releases ?? [];
+
+  return releases.map((r) => ({
+    version: r.version ?? "",
+    publishedAt: r.inserted_at,
+  }));
+}
+
 /**
  * Public registries occasionally return 504/503 under load. Retry 5xx and
  * network errors with exponential backoff; 4xx aborts immediately.
diff --git a/pnpm-lock.yaml b/pnpm-lock.yaml
index 2730deb..fa4c6aa 100644
--- a/pnpm-lock.yaml
+++ b/pnpm-lock.yaml
@@ -21,7 +21,7 @@ importers:
         specifier: ^2.6.3
         version: 2.7.6
 
-  packages/context:
+  packages/libref:
     dependencies:
       '@inquirer/prompts':
         specifier: ^8.2.0
@@ -103,9 +103,9 @@ importers:
 
   packages/registry:
     dependencies:
-      '@neuledge/context':
+      '@wernerbisschoff/libref':
         specifier: workspace:*
-        version: link:../context
+        version: link:../libref
       commander:
         specifier: ^14.0.0
         version: 14.0.2
diff --git a/registry/hex/elixir.yaml b/registry/hex/elixir.yaml
new file mode 100644
index 0000000..3f729f7
--- /dev/null
+++ b/registry/hex/elixir.yaml
@@ -0,0 +1,8 @@
+name: elixir
+description: "A dynamic, functional language for building scalable and maintainable applications"
+repository: https://github.com/elixir-lang/elixir
+
+source:
+  type: git
+  url: https://github.com/elixir-lang/elixir
+  docs_path: lib/elixir/pages
diff --git a/registry/hex/phoenix.yaml b/registry/hex/phoenix.yaml
new file mode 100644
index 0000000..fe4a64c
--- /dev/null
+++ b/registry/hex/phoenix.yaml
@@ -0,0 +1,11 @@
+name: phoenix
+description: "A productive web framework for building modern web applications in Elixir"
+repository: https://github.com/phoenixframework/phoenix
+
+versions:
+  - min_version: "1.5.0"
+    source:
+      type: git
+      url: https://github.com/phoenixframework/phoenix
+      docs_path: guides
+    tag_pattern: "v{version}"
diff --git a/registry/hex/phoenix_live_view.yaml b/registry/hex/phoenix_live_view.yaml
new file mode 100644
index 0000000..311676c
--- /dev/null
+++ b/registry/hex/phoenix_live_view.yaml
@@ -0,0 +1,11 @@
+name: phoenix_live_view
+description: "Rich, real-time user experiences with server-rendered HTML in Elixir"
+repository: https://github.com/phoenixframework/phoenix_live_view
+
+versions:
+  - min_version: "0.17.0"
+    source:
+      type: git
+      url: https://github.com/phoenixframework/phoenix_live_view
+      docs_path: guides
+    tag_pattern: "v{version}"
diff --git a/server.json b/server.json
index 171a277..6cb1ba7 100644
--- a/server.json
+++ b/server.json
@@ -1,16 +1,16 @@
 {
   "$schema": "https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json",
-  "name": "io.github.neuledge/context",
+  "name": "io.github.wernerbisschoff/libref",
   "description": "Local-first documentation for AI agents. Offline, instant, private doc retrieval.",
   "repository": {
-    "url": "https://github.com/neuledge/context",
+    "url": "https://github.com/wernerbisschoff/libref",
     "source": "github"
   },
   "version": "0.2.3",
   "packages": [
     {
       "registryType": "npm",
-      "identifier": "@neuledge/context",
+      "identifier": "@wernerbisschoff/libref",
       "version": "0.2.3",
       "transport": {
         "type": "stdio"
