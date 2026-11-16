#!/usr/bin/env bash
# Scenario: the target branch moves while a candidate is validating.
#
# Opens one pull request (demo/base-moves) whose validation is held for 45
# seconds, waits for you to enqueue it, and pushes an unrelated commit to
# `main` once Yardmaster reports "Validating". Yardmaster refuses to publish a
# candidate built on the old `main`: it replaces the attempt, validates a new
# candidate on the moved base, and merges that one.
#
# `main` must accept a direct push from you: no branch protection, or a
# ruleset that lets repository admins bypass it.

source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

BRANCH="demo/base-moves"
NOTE_PATH="docs/release-notes.md"
require_new_branches "$BRANCH"

fresh_worktree
cp -R "$FIXTURES/base-moves/." "$WORKTREE/"
# [slow-demo] makes the validation workflow hold this pull request's runs.
commit_and_push "$BRANCH" "feat: add receipt line formatting

[slow-demo]"
HEAD_SHA="$(git -C "$WORKTREE" rev-parse HEAD)"
PR="$(open_pr "$BRANCH" "Add receipt line formatting" \
  "Formats one receipt line per item: quantity, SKU and line total.")"
wait_for_green_ci "$PR"

echo
echo "Enqueue it now from the Yardmaster dashboard (Pull requests): $PR"
echo "Waiting for Yardmaster to report Validating..."

check_run_title() {
  gh api "repos/$REPO/commits/$HEAD_SHA/check-runs" \
    --jq '[.check_runs[] | select(.name == "Yardmaster")] | first | .output.title // ""'
}

deadline=$((SECONDS + 600))
until [[ "$(check_run_title)" == "Validating" ]]; do
  [[ $SECONDS -lt $deadline ]] || die "the pull request did not reach Validating within 10 minutes"
  sleep 3
done

# The contents API needs the current blob SHA when the file already exists.
note_sha="$(gh api "repos/$REPO/contents/$NOTE_PATH?ref=main" --jq .sha 2>/dev/null || true)"
PUSH_SHA="$(gh api --method PUT "repos/$REPO/contents/$NOTE_PATH" \
  --field message="docs: add release note" \
  --field branch=main \
  --field content="$(printf '# Release notes\n\n- Pushed to main at %s while a candidate was validating.\n' "$(date -u +%FT%TZ)" | base64 | tr -d '\n')" \
  ${note_sha:+--field sha="$note_sha"} \
  --jq .commit.sha)"
echo "Pushed $PUSH_SHA to main while the candidate was validating."
echo "Waiting for Yardmaster to replace the attempt, validate again, and merge..."

deadline=$((SECONDS + 600))
until [[ "$(gh pr view "$PR" --repo "$REPO" --json state --jq .state)" == "MERGED" ]]; do
  [[ $SECONDS -lt $deadline ]] || die "the pull request was not merged within 10 minutes"
  sleep 5
done

tip="$(gh api "repos/$REPO/commits/main" --jq '[.sha, .parents[].sha] | join(" ")')"
read -r MERGED_SHA PARENT_BASE PARENT_HEAD <<<"$tip"
[[ "$PARENT_BASE" == "$PUSH_SHA" && "$PARENT_HEAD" == "$HEAD_SHA" ]] ||
  die "main is at $MERGED_SHA, which is not a merge of the direct push and the pull request"

cat <<DONE

Merged. main is at $MERGED_SHA, a merge of:
  the direct push    $PUSH_SHA
  the pull request   $HEAD_SHA

In the dashboard, History shows a replaced attempt followed by a successful
one for this item, and the merged SHA equals the validated candidate SHA.
DONE
