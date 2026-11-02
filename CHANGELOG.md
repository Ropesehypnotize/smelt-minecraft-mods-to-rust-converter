# Changelog


## 1.1.22 · 2026-11-01

- Ports finish when a mod bundles its own dependencies.
- Generated crates build with the current toolchain.
- Progress view survives long runs without freezing.
- Better error wording when a jar entry is unreadable.

## 1.1.21

- Mappings for Horizon 26.3: 41 new Fabric rules and the NeoForge event set, so more client mods come over as **Works** instead of **Partly**.
- Zoom and smooth-camera mixins are recognised from the known-pattern list even when the mod renames the accessor.
- Settings screens: the panel itself now comes over, so a mod's own options can be changed in game; only custom list widgets stay out.
- Reading a mod is about a third faster on big jars, and the progress bar no longer jumps at the end.
- `smelt check --json` gains a `hooks` array per mod, so CI can fail on a specific missing hook.
- The portable Windows build no longer needs the Visual C++ runtime installed.

## 1.1.7

- Verdicts explain themselves in one line: what came over, what didn't, and why.
- Quilt mods that only use the Fabric API are read through the Fabric rules.
- Fixed a crash when a jar's manifest lists a loader Smelt doesn't know.

## 1.0.0

- Drop a Fabric or NeoForge `.jar` and get a mod for Minecraft on Rust (Horizon 26.3).
- Three plain verdicts: works, partly, won't run.
- Code becomes a `.hnmod`; blocks, items, recipes and textures become a `.hmod`.
- **Add to Horizon** installs the result in one click.
- Developer mode: Java and Rust side by side, port plan export, the generated Cargo project.
- `smelt` command for single mods, whole folders and CI (`--json`).
- Portable builds for Windows (`.exe`) and Linux (AppImage).
