#!/usr/bin/env bash
# Opens a burst of small, independent pull requests, as a fleet of coding
# agents would. Usage: scripts/burst.sh [N]   (default 6, at most 8)
#
# Each pull request adds one new module and its test, so none conflicts with
# another. Commits carry an Assisted-by trailer naming this script; Yardmaster
# records such pull requests as agent-authored.
#
# Enqueue them together from the dashboard (Queue, Add pull requests).
# The queue is serial: expect about 45 seconds per pull request.

source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

# slug | title | body
CHANGES=(
  "jpy-rounding|Add tax rounding for JPY|The yen has no minor unit. Adds whole-yen rounding and a yen tax helper, with tests."
  "bulk-discount|Add bulk discount tiers|Adds quantity tiers at 10, 50 and 100 units (5%, 10%, 15%), with tests."
  "free-shipping|Add free shipping threshold|Orders of 75 or more ship free; smaller orders pay a flat 7.50. Includes tests."
  "coupon-validation|Add coupon code validation|Validates coupon codes as 6 to 12 uppercase letters or digits, with tests."
  "eur-formatting|Add EUR price formatting|Formats amounts as 1.234,50 € without depending on the runtime locale data. Includes tests."
  "gift-wrap|Add gift wrap surcharge|Charges 2.50 per unit for gift wrap across the order, with tests."
  "loyalty-points|Add loyalty points accrual|Earns one point per whole currency unit spent and none on refunds. Includes tests."
  "order-weight|Add order weight calculation|Sums parcel weights into kilograms for shipping quotes, with tests."
)

COUNT="${1:-6}"
[[ "$COUNT" =~ ^[1-9][0-9]*$ && "$COUNT" -le "${#CHANGES[@]}" ]] ||
  die "usage: scripts/burst.sh [N], with N between 1 and ${#CHANGES[@]}"

SELECTED=("${CHANGES[@]:0:COUNT}")
for change in "${SELECTED[@]}"; do
  require_new_branches "demo/burst-${change%%|*}"
done

PRS=()
for change in "${SELECTED[@]}"; do
  IFS='|' read -r slug title body <<<"$change"
  fresh_worktree
  cp -R "$FIXTURES/burst/$slug/." "$WORKTREE/"
  commit_and_push "demo/burst-$slug" "$title

Assisted-by: demo-agent (scripted by scripts/burst.sh)"
  pr="$(open_pr "demo/burst-$slug" "$title" "$body")"
  PRS+=("$pr")
  echo "Opened $pr"
done

for pr in "${PRS[@]}"; do
  wait_for_green_ci "$pr"
done

cat <<DONE

$COUNT pull requests are open and green.
Enqueue them together from the Yardmaster dashboard (Queue, Add pull requests).
Expected: they merge one at a time in the order they were enqueued, and each
waiting pull request's Yardmaster check shows how many are ahead of it.
DONE
