---
"@neuledge/registry": patch
---

Update the pinned documentation definitions to Java 27, Python 3.15, and systemd 262. Fix HTML index builds: `resolveBuildSource` now leaves the `{version}` placeholder in the source URL so the HTML index downloader can substitute a release, instead of failing every versioned html-index build.
