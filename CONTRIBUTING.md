# Contributing

Thanks for helping Smelt bring more mods to Minecraft on Rust.

## The easiest way to help: mappings

Most of what Smelt knows lives in [`mappings/`](mappings): one TOML file per loader that says which Java API becomes which Horizon hook. If a mod gets "Partly" or "Won't run" because a call isn't mapped yet, a new rule there is often the whole fix.

Each rule needs:

- `java`: the class or method, as it appears in the bytecode
- `horizon`: the hook or helper it maps to
- `confidence`: `auto` when the rewrite is exact, `review` when a person should look at it
- a test mod under `crates/smelt-core/tests/mods/` that uses the call

## Reporting a wrong verdict

Open an issue with the mod's name, its version and the output of:

```bash
smelt check <mod>.jar --json
```

Please don't attach other people's `.jar` files. A link to the mod page is enough.

## Code

```bash
cargo fmt --all
cargo clippy --workspace -- -D warnings
cargo test --workspace
```

Keep user-facing text short and plain. The app is for players, not for programmers: one sentence per verdict, no jargon.
