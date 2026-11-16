#!/usr/bin/env bash
# Scenario: two pull requests that are green alone and red together.
#
#   A (demo/semantic-a) renames applyDiscount to applyPercentDiscount everywhere.
#   B (demo/semantic-b) adds loyalty discounts that call applyDiscount.
#
# They touch different files, so Git sees no conflict and each passes CI.
# Enqueue A, then B. Yardmaster merges A, builds B's candidate on the new
# `main`, validation fails, and B is not merged. `main` stays green.

source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

BRANCH_A="demo/semantic-a"
BRANCH_B="demo/semantic-b"
require_new_branches "$BRANCH_A" "$BRANCH_B"

fresh_worktree
(
  cd "$WORKTREE"
  grep -rl --include='*.ts' 'applyDiscount' src tests |
    xargs perl -pi -e 's/\bapplyDiscount\b/applyPercentDiscount/g'
)
commit_and_push "$BRANCH_A" "refactor: rename applyDiscount to applyPercentDiscount"
PR_A="$(open_pr "$BRANCH_A" "Rename applyDiscount to applyPercentDiscount" \
  "Fixed-amount discounts are coming, so the percent-based function gets an explicit name. Every call site and test is updated.")"

fresh_worktree
cp -R "$FIXTURES/semantic-b/." "$WORKTREE/"
commit_and_push "$BRANCH_B" "feat: add loyalty tier discounts"
PR_B="$(open_pr "$BRANCH_B" "Add loyalty tier discounts" \
  "Silver members get 5% off and gold members get 10% off, built on the existing applyDiscount.")"

wait_for_green_ci "$PR_A"
wait_for_green_ci "$PR_B"

cat <<DONE

Both pull requests are green on their own:
  A  $PR_A
  B  $PR_B

Enqueue A first, then B, from the Yardmaster dashboard (Queue, Add pull requests).
Expected: A merges. B fails validation and stays open. main stays green.
DONE
