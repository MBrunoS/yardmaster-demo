#!/usr/bin/env bash
# Restores the clean demo state:
#   1. closes every open pull request whose head branch is demo/*
#   2. deletes every demo/* branch
#   3. force-pushes `main` back to the `baseline` tag
#
# It force-pushes, so it only runs against a repository named yardmaster-demo
# (lib.sh enforces that). Empty the Yardmaster queue before running it.

source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

git fetch --quiet --force origin "refs/tags/baseline:refs/tags/baseline" 2>/dev/null ||
  die "no baseline tag on $REPO. Create it on the clean main: git tag baseline origin/main && git push origin baseline"
BASELINE="$(git rev-parse 'baseline^{commit}')"

gh pr list --repo "$REPO" --state open --limit 200 --json number,headRefName \
  --jq '.[] | select(.headRefName | startswith("demo/")) | .number' |
  while read -r number; do
    gh pr close "$number" --repo "$REPO" >/dev/null
    echo "Closed #$number"
  done

git ls-remote --heads origin 'refs/heads/demo/*' | cut -f2 |
  while read -r ref; do
    git push --quiet origin --delete "$ref"
    echo "Deleted ${ref#refs/heads/}"
  done

git push --quiet --force origin "$BASELINE:refs/heads/main"
echo "main is at baseline ($BASELINE). Ready for the next run."
