# Security

Smelt works offline. It reads the mods you give it and writes files to your Horizon folder or to the folder you choose. It doesn't upload anything and doesn't phone home.

Converted mods with code (`.hnmod`) run unsandboxed in Horizon, like any native Horizon mod. Horizon asks the player to trust each one before it runs. Smelt never skips or answers that prompt.

If you find a way to make Smelt write outside the folder it was given, or to produce a mod that does something the original didn't, please report it privately through GitHub's **Report a vulnerability** button instead of a public issue.
