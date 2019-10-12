# `rust-cargo-make` javascript action

Install `cargo-make` by download the executable (faster than `cargo install cargo-make`, seconds vs minutes)

## Inputs

### `version`

**Optional** The version of. Default `"0.22.2"`.

## Example usage

```yaml
    - uses: actions-rs/toolchain@v1
      with:
        toolchain: stable
        override: true
    - uses: davidB/rust-cargo-make@v1
      with:
        version: 0.22.2
    - uses: actions/checkout@v1
    - name: Run tests
      run: cargo make --disable-check-for-updates ci-flow
```
