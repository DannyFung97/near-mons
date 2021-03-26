# Scripts

## Setting up your terminal

*This window is used to compile, deploy and control the contract*
- Environment
  ```sh
  export CONTRACT=        # depends on deployment
  export OWNER=           # any account you control

  # for example
  # export CONTRACT=dev-1615190770786-2702449
  # export OWNER=mons.testnet
  ```

- Commands
  ```sh
  1.init.sh               # cleanup, compile and deploy contract
  2.run.sh                # call methods on the deployed contract
  ```
---

## Common Contract calls

*There are several essential functions that can be called.*

  Retrieves a list of all creatures that OWNER owns.

    near view $CONTRACT getCreaturesByOwner '{"owner":"'$OWNER'"}'

  Retrieves the creature that would result from the fusion of two creatures. Replace the placeholder instances of "ID" with respective parent creature instance id.

    near call $CONTRACT previewFutureChildCreature '{"creatureInstanceIdA": "ID",   "creatureInstanceIdB": "ID"}' --account_id $OWNER

  Retrieves creature by instance id. Replace the placeholder instances of "ID" with respective parent creature instance id.

    near view $CONTRACT getCreatureByInstanceId '{"instanceId": "ID"}'

  Fuse for the new creature using two parent creatures. Replace the placeholder instances of "ID" with respective parent creature instance id.

    near call $CONTRACT procreateCreature '{"parentInstanceIdA": "ID", "parentInstanceIdB": "ID", "newSkills": ["du", "dd", "fB"], "newCreatureSampleId": "ID"}' --account_id $OWNER