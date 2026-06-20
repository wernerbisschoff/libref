---
"@wbisschoff13/libref": patch
---

fix: verify better-sqlite3 native binary works before using it as database backend

initDatabase() previously only checked if better-sqlite3 could be require()'d,
but the JS wrapper loads successfully even when the native .node binary is
incompatible with the current Node version (e.g., compiled for Node 22 but
running on Node 26). This caused all package database opens to fail silently,
resulting in "No packages installed" from every command.

The fix opens and closes an in-memory database during init to verify the
native binary actually works, falling back to the sql.js WASM backend when
it doesn't.
