#!/usr/bin/env bash
set -e

echo
echo \$CONTRACT is $CONTRACT
echo \$OWNER is $OWNER
echo

near call $CONTRACT init '{}' --account_id $OWNER

near call $CONTRACT giveCreaturesToOwner '{"creatureId1":"g0"}' '{"creatureId1":"f0"}' --account_id $OWNER

# near view $CONTRACT getCreaturesByOwner '{"owner":`$OWNER`}'