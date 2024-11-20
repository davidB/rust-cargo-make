# Build a JavaScript Action using TypeScript

The project is based on the template
[actions/typescript-action: Create a TypeScript Action with tests, linting, workflow, publishing, and versioning](https://github.com/actions/typescript-action)

## Code in Main branch

Install the dependencies

```bash
npm install
```

Build & test

```bash
npm run all
```

## Change action.yml

The action.yml contains defines the inputs and output for your action.

Update the action.yml with your name, description, inputs and outputs for your
action.

See the
[documentation](https://help.github.com/en/articles/metadata-syntax-for-github-actions)

## Change the Code

Most toolkit and CI/CD operations involve async operations so the action is run
in an async function.

```javascript
import * as core from '@actions/core';
...

async function run() {
  try {
      ...
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
```

See the
[toolkit documentation](https://github.com/actions/toolkit/blob/master/README.md#packages)
for the various packages.

## Publish to a distribution branch

Actions are run from GitHub repos. We will create a releases branch and only
checkin production modules (core in this case).

Comment out node_modules in .gitignore and create a releases/v1 branch

```bash
# comment out in distribution branches
# node_modules/
```
<!--
```bash
npm run all
git add dist
git commit -a -m "📦"
# no need to align version in package.json with this value
git tag -a "v1.10.0" -m "🔖 1.10.0"
git tag -a "v1" -m "🔖 update v1.10.0" -f
#git push --follow-tags --force
git push
git push --tags --force
```

Then go to <https://github.com/davidB/rust-cargo-make/releases/new?tag=v1.5.0>
to publish the release on the marketplace
-->

```bash
scripts/release
```

Your action is now published! :rocket:

See the
[versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)

## Validate

You can now validate the action by referencing the releases/v1 branch

```yaml
uses: actions/typescript-action@releases/v1
with:
  milliseconds: 1000
```

See the [actions tab](https://github.com/actions/javascript-action/actions) for
runs of this action! :rocket:

## Notify Marketplace of the new version

Edit tag on GitHub:
<https://github.com/davidB/rust-cargo-make/releases/new?tag=v1.5.0>
