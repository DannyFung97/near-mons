mons
==================

This is an application that utilizes a smart contract that mints NFTs as ingame collectibles. Users can create new creatures by having two parent creatures procreate to form a child creature, which will inherit its parents' skills and attributes.

Smart Contract API
=====================

model.ts
----------

   An array of all existing creatures as well as their metadata.

      export const creaturesArray = [
         {
            name: "Salamander",
            atk: '10',
            def: '10',
            spd: '20',
            skills: ["firespark", "speedup"], 
            type: "fire", 
            evo: '0',
      }, {...}, {...}, ... ]

   An array of all existing skills with their names and descriptions.

      export const skillsArray = [
         {
            name: 'fireguard', description: 'Resistance against fire damage.'
         }, 
         {...}, {...}, ... ]

   A map of all type combinations during procreation. Concatenate the two parents' types in alphabetical order into a string, then use this map to find the value of the child's type. If the parents share the same type, then the child is will of that type too.

      export const generationMap = {'darkwater': 'fire', ... }

   A map of all evolution combinations during procreation. Concatenate the two parents' evolution ranks in numerical order into a string, then use this map to find the value of the child's evolution rank.

      export const offspringMap: {
         '00': '1',
         '01': '1',
         '02': '1',
         '03': '1',
         '11': '2',
         '12': '2',
         '13': '2',
         '22': '3',
         '23': '3',
         '33': '0',
      }

   A map of for reference to elemental weaknesses. For example, fire is weak to water, water is weak to grass, etc.

      export const elementMap: {
         'fire': 'water',
         'water': 'grass',
         'grass': 'fire',
         'light': 'dark',
         'dark': 'light',
         'normal': 'normal'
      }

   List of creature ids.

      export class CreatureIdList {
         constructor(public id: Array<string>) {}
      }

   Creature class that contains the creature's owner and metadata.

      export Creature class {
         owner: string;
         constructor (
            public id: string,
            public name: string,
            public atk: string,
            public def: string,
            public spd: string,
            public skills: Array<String>,
            public element: string,
            public evolutionRank: string,
         ) {
            this.owner = context.sender;
         }
      }

   A persistent map that links creature id to creature object.

      export const creaturesById = new PersistentMap<string, Creature>('creatures');

   A persistent map that links owner name to array of creature ids they own.
         
      export const creaturesByOwner = new PersistentMap<string, CreatureList>("creaturesByOwner")

   
main.ts
----------

   Return array list of creature objects owned by a user.

      export function getCreaturesByOwner(owner: string): Creature[]
      
   Return array list of creature ids owned by a user, primarily a helper function for getCreaturesByOwner().
      
      function getCreatureIdsByOwner(owner: string): Array<string>
      
   Procreate a new creature using two parent creatures.

      export function procreateCreature(a: Creature, b: Creature): Creature
   
   Generate a new creature, this is primarily a helperfunction to procreateCreature. In here, a new creature object is created, assigned a random ID, and set to an owner.

      function generateCreatureObject(
         id: string, 
         name: string,
         atk: string,
         def: string,
         spd: string,
         newSkills: Array<String>,
         element: string,
         evolutionRank: string,
      )

   Set skills to a creature, primaily used for inheriting parent skills. The maximum number a creature can have is 6, this needs to be checked before this method. Helper function to generateCreatureObject().

      function setSkills(newSkills: Array<String>, id: string): void

   Get the creature ids from the owner.

      function getCreatureIdsByOwner(owner: string): Array<string>

   Assign the creature ids to the owner.

      function setCreatureIdsByOwner(owner: string, id: string): void

   Delete the creature ids from the owner.

      function deleteCreatureIdsByOwner(owner: string, id: string): void

   Get creature object by id.

      export function getCreatureByid(id: string): Creature

   Set creature object by id.

      function setCreatureById(id: string, creature: Creature): void

   Delete creature object by id.

      export function deleteCreatureById(id: string): void

   Random ID Generator.

      function generateRandomId(): Uint8Array {
         const ID_DIGITS: u32 = 16;
         return base64.encode(math.randomBuffer(ID_DIGITS));
      }