#!/usr/bin/env bash
set -e

echo
echo \$CONTRACT is $CONTRACT
echo \$OWNER is $OWNER
echo

near call $CONTRACT init '{}' --account_id $OWNER

near call $CONTRACT giveCreaturesToOwner '{"creatureSampleId1": "g0", "creatureSampleId2": "f0"}' --account_id $OWNER

echo near view $CONTRACT getCreaturesByOwner '{"owner":"'$OWNER'"}'

echo
echo "Hello! You have been given two creatures!"
echo
echo 'check 2.run.sh for command: near call $CONTRACT previewFutureChildCreature '{"creatureInstanceIdA": "ID", "creatureInstanceIdB": "ID"}' --account_id $OWNER'
echo
echo 'check 2.run.sh for command: near view $CONTRACT getCreatureByInstanceId '{"instanceId": "ID"}''
echo
echo 'check 2.run.sh for command: near call $CONTRACT procreateCreature '{"parentInstanceIdA": "ID", "parentInstanceIdB": "ID", "newSkills": ["du", "dd", "fB"], "newCreatureSampleId": "ID"}' --account_id $OWNER'
