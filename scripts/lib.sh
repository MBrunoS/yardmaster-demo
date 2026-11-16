# Shared helpers for the demo scripts. Source this file; do not run it.
#
# Scripts never touch your checkout: they build each pull request in a
# temporary worktree and push it straight to a fixed `demo/*` branch.

set -euo pipefail

DEMO_REPO_NAME="yardmaster-demo"

die() {
  echo "error: $*" >&2
  exit 1
}

for tool in git gh; do
  command -v "$tool" >/dev/null || die "$tool is required"
done

ROOT="$(git -C "$(dirname "${BASH_SOURCE[0]}")" rev-parse --show-toplevel)"
FIXTURES="$ROOT/scripts/fixtures"
cd "$ROOT"

# Every script refuses to run anywhere but a repository named yardmaster-demo.
REPO="$(gh repo view --json nameWithOwner --jq .nameWithOwner)"
[[ "${REPO#*/}" == "$DEMO_REPO_NAME" ]] ||
  die "these scripts only run against a repository named $DEMO_REPO_NAME, not $REPO"

WORKTREE=""

cleanup_worktree() {
  [[ -n "$WORKTREE" ]] && git worktree remove --force "$WORKTREE" 2>/dev/null || true
}
trap cleanup_worktree EXIT

branch_exists() {
  git ls-remote --exit-code --heads origin "$1" >/dev/null 2>&1
}

# Fails before anything is created if a scenario branch is left over.
require_new_branches() {
  local branch
  for branch in "$@"; do
    if branch_exists "$branch"; then
      die "branch $branch already exists on $REPO. Run scripts/reset.sh, then try again."
    fi
  done
}

# Points the temporary worktree at a clean copy of the current `main`.
fresh_worktree() {
  git fetch --quiet origin main
  if [[ -z "$WORKTREE" ]]; then
    WORKTREE="$(mktemp -d)/demo"
    git worktree add --quiet --detach "$WORKTREE" origin/main
  else
    git -C "$WORKTREE" checkout --quiet --detach origin/main
    git -C "$WORKTREE" clean --quiet -fd
  fi
}

# commit_and_push <branch> <commit message>
commit_and_push() {
  git -C "$WORKTREE" add --all
  git -C "$WORKTREE" commit --quiet --message "$2"
  git -C "$WORKTREE" push --quiet origin "HEAD:refs/heads/$1"
}

# open_pr <branch> <title> <body>; prints the pull request URL.
open_pr() {
  gh pr create --repo "$REPO" --base main --head "$1" --title "$2" --body "$3"
}

# Blocks until the pull request's CI finishes, and fails if it is not green.
wait_for_green_ci() {
  local pr="$1" status=0 tries=0
  # Checks take a few seconds to register on a new pull request.
  until gh pr checks "$pr" --repo "$REPO" >/dev/null 2>&1 || [[ $? -eq 8 ]]; do
    tries=$((tries + 1))
    [[ $tries -lt 30 ]] || die "no CI checks appeared on $pr"
    sleep 2
  done
  gh pr checks "$pr" --repo "$REPO" --watch --interval 5 >/dev/null || status=$?
  [[ $status -eq 0 ]] || die "CI is not green on $pr"
  echo "CI green: $pr"
}
