# `rust-cargo-make` action

Install `cargo-make` by downloading the executable (faster than
`cargo install cargo-make`, seconds vs minutes).

## Inputs

### `version`

**Optional** version of `cargo-make` to install (eg. `"0.22.2"`, `"latest"`).

## Example usage

```yaml
- uses: dtolnay/rust-toolchain@stable
- uses: davidB/rust-cargo-make@v1
- uses: actions/checkout@v1
- name: Run tests
  run: cargo make ci-flow
```

```yaml
- uses: dtolnay/rust-toolchain@stable
- uses: davidB/rust-cargo-make@v1
  with:
    version: '0.23.0'
- uses: actions/checkout@v1
- name: Run tests
  run: cargo make ci-flow
```

## Alternatives

- [taiki-e/install-action: GitHub Action for installing development tools (mainly from GitHub Releases).](https://github.com/taiki-e/install-action),
  full
  [list of installable tools](https://github.com/taiki-e/install-action/blob/main/TOOLS.md)

  ```yaml
  - uses: taiki-e/install-action@v2
    with:
      tool: cargo-make
  ```

- using [mise](https://mise.jdx.dev/) and its GitHub Action to setup rust,
  cargo-make, and other tools (on local machine & GitHub workflow), partial list
  of installable tools at
  [asdf-vm/asdf-plugins: Convenience shortname repository for asdf community plugins](https://github.com/asdf-vm/asdf-plugins)
  but there are other alternatives than asdf.
