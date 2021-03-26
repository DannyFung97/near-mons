# near-mons

## Usage

### Getting started

1. clone this repo to a local folder
2. run `yarn`
3. run `yarn test`

### Top-level `yarn` commands

- run `yarn test` to run all tests
  - (!) be sure to run `yarn build:release` at least once before:
    - run `yarn test:unit` to run only unit tests
    - run `yarn test:simulate` to run only simulation tests
- run `yarn build` to quickly verify build status
- run `yarn clean` to clean up build folder

### Other documentation

- Sample contract and test documentation
  - see `/src/sample/README` for contract interface
  - see `/src/sample/__tests__/README` for Sample unit testing details

- Sample contract simulation tests
  - see `/simulation/README` for simulation testing


## The file system

Please note that boilerplate project configuration files have been ommitted from the following lists for simplicity.

### Contracts and Unit Tests

```txt
src
├── sample                        <-- sample contract
│   ├── README.md
│   ├── __tests__
│   │   ├── README.md
│   │   └── index.unit.spec.ts
│   └── assembly
│       └── index.ts
└── utils.ts                      <-- shared contract code
```

### Helper Scripts

```txt
scripts
├── 1.init.sh
├── 2.run.sh
└── README.md                     <-- instructions
```

This is an application that utilizes a smart contract that mints NFTs as ingame collectibles. Users can create new creatures by having two parent creatures procreate to form a child creature, which will inherit its parents' skills and attributes.

Smart Contract API
=====================

model.ts
----------

   List of creature ids.

      export class CreatureIdList {
         constructor(public arrayOfIds: Array<string>) { }
      }

   Creature class that contains the creature's owner and metadata.

      export class Creature {
        owner: string;
        constructor(
          public sampleId: string,
          public instanceId: string,
          public name: string,
          public atk: string,
          public def: string,
          public spd: string,
          public skills: Array<string>,
          public element: string,
          public evolutionRank: string,
        ) {
          this.owner = context.sender;
        }
      }

   Creature class used to preview creatures in their original states.

      export class SampleCreature {
         public sampleId: string,
         public name: string;
         public atk: string;
         public def: string;
         public spd: string;
         public skills: Array<String>;
         public type: string;
         public evo: string;
      }

   A persistent map that links creature id to creature object.

      export const creaturesByInstanceId = new PersistentMap<string, Creature>('ci');

   A persistent map that links owner name to array of creature ids they own.
         
      export const creaturesByOwner = new PersistentMap<string, CreatureIdList>("co")

   A map of all sample creatures with their sample id as key.

      export const sampleCreaturesMap = new PersistentMap<string, SampleCreature>("cm")

   A map of all type combinations during procreation. Concatenate the two parents' types in alphabetical order into a string, then use this map to find the value of the child's type. If the parents share the same type, then the child will be of that type too.

      export const generationMap = new PersistentMap<string, string>("gm")

   A map of all evolution combinations during procreation. Concatenate the two parents' evolution ranks in numerical order into a string, then use this map to find the value of the child's evolution rank.

      export const offspringMap = new PersistentMap<string, string>("om")
   
index.ts
----------

   Initializes contract, as well as procreation and creature data.

      export function init(): void

   Return array list of creature objects owned by a user.

      export function getCreaturesByOwner(owner: string): Creature[]

   Function to let the user foresee what child creature they will get from the parent's procreation, along with their skills and attributes. From the user interface, after being viewed what child creature will result from both parents, the user can select which of the parents' skills the child will learn, and which of the child's skills it will forget.

      export function previewFutureChildCreature(creatureInstanceIdA: string, creatureInstanceIdB: string): SampleCreature
      
   Procreate a new creature using the parent's instance ids, user's chosen skills, and the SampleCreature of the future child creature.

      export function procreateCreature(parentInstanceIdA: string, parentInstanceIdB: string, newSkills: Array<string>, newCreatureSampleId: string): Creature
   
   Generate a new creature, this is primarily a helper function to procreateCreature(). In here, a new creature object is created, assigned a random ID, and set to an owner.

      function generateCreatureObject(
        instanceId: string,
        newCreature: SampleCreature,
        newSkills: Array<string>
      ): Creature

   Function to give two creatures to the owner, should only be called if the owner does not have creatures.

      export function giveCreaturesToOwner(creatureSampleId1: string, creatureSampleId2: string): Array<Creature>

   Get sample creature using sample Id.

      export function getSampleCreature(creatureSampleId: string): SampleCreature

   Get generation from generation map.

      export function getGeneration(combo: string): string

   Get offspring output from offspring map.

      export function getOffspring(combo: string): string

   Get the creature ids from the owner.

      function getCreatureIdsByOwner(owner: string): Array<string>

   Assign the creature ids to the owner.

      function setCreatureIdsByOwner(owner: string, id: string): void

   Delete the creature ids from the owner.

      function deleteCreatureIdsByOwner(owner: string, id: string): void

   Get creature object by id.

      export function getCreatureById(id: string): Creature

   Set creature object by id.

      function setCreatureById(id: string, creature: Creature): void

   Delete creature object by id.

      export function deleteCreatureById(id: string): void

   Random ID Generator.

      function generateRandomId(): String {
         const ID_DIGITS: u32 = 16;
         return base64.encode(math.randomBuffer(ID_DIGITS));
      }