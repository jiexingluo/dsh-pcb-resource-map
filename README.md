# PCB Resource Map for DeepSeek Harness

[中文](README.zh.md) | English

A standalone viewer plugin for `.resmap` files containing UTF-8 SVG. NET hover,
selection and Ctrl/Meta multi-selection, authored Relay ON/OFF switching with mouse
or keyboard, fit-to-window, 100%, zoom buttons and Ctrl/Meta-wheel are supported.
Drawings without interactive markers render as static SVG.

This repository is maintained separately from DeepSeek Harness. No modifications
to DSH, SideTest, or the viewed files are required. Relay switching changes the
preview only; it never controls hardware or writes back to the source.

## Install

Requires DeepSeek Harness **0.2.2-rc.1** and Node **24.9 or newer**. Other DSH
versions have not been validated; compatibility is deliberately pinned while the
plugin API is pre-stable.

Use **Plugins → Add plugin**, and enter the URL of a built `.tgz` package, or run:

```powershell
dsh plugin --profile web add "C:/path/to/dsh-pcb-resource-map-0.1.0.tgz"
```

The repository includes `lib/` build outputs. GitHub's source archive can also be
installed directly from a version tag:

```powershell
dsh plugin --profile web add "https://github.com/jiexingluo/dsh-pcb-resource-map/archive/refs/tags/v0.1.0.tar.gz"
```

Use `archive/refs/heads/main.tar.gz` to track development instead. Restart DSH
if it reports that a restart is required, then refresh the page. Find **PCB Resource
Map** in Installed plugins. Open a `.resmap` through the workspace Files view. The
document viewer menu also offers Plain text and the shared Reload control.

The intended npm package name is `dsh-pcb-resource-map`, but **no npm
registry release has been published yet**. After a maintainer publishes it, the
usual install command will be:

```powershell
dsh plugin --profile web add dsh-pcb-resource-map
```

Do not install the earlier in-tree prototype at the same time: disable or remove
`@deepseek-ai/dsh-client-ui-resmap` first to avoid two renderer registrations.

## Develop

```powershell
npm install --global pnpm@11.28.5
pnpm install --frozen-lockfile
npm run check
npm test
npm run build
npm run verify:package
npm pack
```

The committed pnpm lockfile is used for development and CI.
`scripts/build.mjs` builds the Node companion, DSH module-loader browser factory,
and scoped CSS without using DSH's monorepo build scripts. React and UI primitives
come from the running DSH browser module table; DOMPurify is bundled with notices.
The insertion patch owns `pcb-resource-map`, rather than overriding an upstream row.

Commit `lib/` after rebuilding so GitHub archive installs work without lifecycle
scripts. `npm pack` rebuilds before packaging. Build/test CI uploads a `.tgz`
artifact. The npm release workflow is manual and requires an `NPM_TOKEN` repository
secret for an account permitted to publish this package; it does not run on push.

For a real, keyless browser integration check against a built DSH checkout:

```powershell
$env:DSH_CHECKOUT = "D:/CodeBase/deepseek-harness-master"
node scripts/test-dsh.mjs
```

## Supported SVG markers and limits

- NET: `data-type="NET"`, or `data-role="wire"` plus `data-net`.
- Relay: `data-type="Relay"` or `data-role="relay"` with uniquely resolvable
  authored `_ON`/`_OFF` child IDs. Ambiguous state pairs remain static.
- Valid viewBox or positive absolute width/height; no percentage-only dimensions.
- Scripts, external resources, links and animation are blocked. A sanitized,
  script-free sandboxed iframe isolates file CSS and IDs. White paper preserves
  authored colors under both DSH themes. The Host complete-file size cap applies.
- Viewing state resets on reload; no edit/export or hardware connection.

## Provenance and licensing

Extracted from the DSH prototype commit `7f18821d`, based on upstream
`fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159`. The original upstream MIT notice is
retained in [LICENSE](LICENSE). DOMPurify notices are in
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Private customer maps and local
authentication data are not part of this repository.
