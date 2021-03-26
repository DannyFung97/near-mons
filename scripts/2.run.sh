#!/usr/bin/env bash
set -e

echo
echo \$CONTRACT is $CONTRACT
echo \$OWNER is $OWNER
echo

echo "near call \$CONTRACT giveCreaturesToOwner '{\"creatureId1\":"\g0\"} {\"creatureId1":"\f0"}' --account_id \$OWNER"

near call $CONTRACT giveCreaturesToOwner '{"creatureId1": "g0", "creatureId2": "f0"}' --account_id $OWNER