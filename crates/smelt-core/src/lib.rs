//! Reads a Fabric or NeoForge mod and rewrites it for Minecraft on Rust (Horizon).

/// What the player is told about a mod, in one word.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Verdict {
    /// Everything in the mod runs.
    Works,
    /// Most of it runs; the missing part is named in one line.
    Partly,
    /// The mod does something Horizon can't load yet. Nothing is installed.
    WontRun,
}

impl Verdict {
    pub fn label(self) -> &'static str {
        match self {
            Verdict::Works => "Works",
            Verdict::Partly => "Partly",
            Verdict::WontRun => "Won't run",
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn labels_are_plain_words() {
        assert_eq!(Verdict::WontRun.label(), "Won't run");
    }
}
