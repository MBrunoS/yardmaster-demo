# yardmaster-demo

A small order-pricing library that exists to demonstrate
[Yardmaster](https://github.com/MBrunoS/yardmaster), an exact-candidate merge queue for GitHub.
Nothing here is meant for production use. Pull requests in this repository are created by demo
scripts and merged by Yardmaster.

## What is here

| Path | Purpose |
| --- | --- |
| `src/`, `tests/` | The library (line items, discounts, tax) and its Vitest suite |
| `.github/workflows/ci.yml` | Type check and tests on every pull request and on `main` |
| `.github/workflows/yardmaster-validation.yml` | The workflow Yardmaster dispatches against each merge candidate ([contract version 1](https://github.com/MBrunoS/yardmaster/blob/main/docs/merge-queue.md#validation-workflow-contract)) |

| `scripts/burst.sh [N]` | Opens N (default 6, at most 8) small independent pull requests |
| `scripts/scenario-semantic-conflict.sh` | Opens two pull requests that are green alone and red together |
| `scripts/scenario-base-moves.sh` | Opens one pull request and moves `main` while it validates |
| `scripts/reset.sh` | Closes `demo/*` pull requests, deletes `demo/*` branches, and force-pushes `main` back to `baseline` |

The scripts need `git` and an authenticated `gh`. They refuse to run against a repository that is
not named `yardmaster-demo`, and they build pull requests in a temporary worktree, so your checkout
is not modified.

The validation workflow checks out the exact candidate commit, verifies it is the commit
Yardmaster asked for, then runs the same type check and tests as CI.

## Run the tests

You need Node.js 24 and pnpm 11.

```sh
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
```

## The `baseline` tag

`baseline` marks the clean state of `main` that every demo starts from. Demo runs merge pull
requests into `main`; resetting moves `main` back to `baseline`. After merging a change that
should survive a reset (library, workflows, or scripts), move the tag:

```sh
git fetch origin
git tag --force baseline origin/main
git push --force origin baseline
```

Setup and the demo script are in the
[Yardmaster demo runbook](https://github.com/MBrunoS/yardmaster/blob/main/docs/demo.md).
