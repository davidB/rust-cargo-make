# `rust-cargo-make` action

Install `cargo-make` by downloading the executable (faster than `cargo install cargo-make`, seconds vs minutes).

## Inputs

### `version`

**Optional** version of `cargo-make` to install (eg. `"0.22.2"`, `"latest"`).

## Example usage

```yaml
    - uses: actions-rs/toolchain@v1
      with:
        toolchain: stable
        override: true
    - uses: davidB/rust-cargo-make@v1
    - uses: actions/checkout@v1
    - name: Run tests
      run: cargo make --disable-check-for-updates ci-flow
```

```yaml
    - uses: actions-rs/toolchain@v1
      with:
        toolchain: stable
        override: true
    - uses: davidB/rust-cargo-make@v1
      with:
        version: '0.23.0'
    - uses: actions/checkout@v1
    - name: Run tests
      run: cargo make --disable-check-for-updates ci-flow
```
