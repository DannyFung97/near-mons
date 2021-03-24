mons
==================

This is an application that utilizes a smart contract that mints NFTs as ingame collectibles. Users can create new creatures by having two parent creatures procreate to form a child creature, which will inherit its parents' skills and attributes.

Smart Contract API
=====================

model.ts
----------

   List of creature ids.

      export class CreatureIdList {
         constructor(public id: Array<string>) {}
      }

   Creature class that contains the creature's owner and metadata.

      export class Creature {
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

   Creature class used to preview creatures in their original states.

      export class SampleCreature {
         public name: string;
         public atk: string;
         public def: string;
         public spd: string;
         public skills: Array<String>;
         public type: string;
         public evo: string;
      }

   A persistent map that links creature id to creature object.

      export const creaturesById = new PersistentMap<string, Creature>('creaturesById');

   A persistent map that links owner name to array of creature ids they own.
         
      export const creaturesByOwner = new PersistentMap<string, CreatureIdList>("creaturesByOwner")

   An array of all existing creatures as well as their metadata.

      export const creaturesArray: Array<SampleCreature> = [
         {
            name: "Salamander",
            atk: '10',
            def: '10',
            spd: '20',
            skills: ["firespark", "speedup"], 
            type: "fire", 
            evo: '0',
      }, {...}, {...}, ... ]

   An map of all existing skills with their names and descriptions.

      export const skillsMap: any = {
         'fireguard': { description: 'Resistance against fire damage.'},
         ... }

   A map of all type combinations during procreation. Concatenate the two parents' types in alphabetical order into a string, then use this map to find the value of the child's type. If the parents share the same type, then the child will be of that type too.

      export const generationMap: any = {'darkwater': 'fire', ... }

   A map of all evolution combinations during procreation. Concatenate the two parents' evolution ranks in numerical order into a string, then use this map to find the value of the child's evolution rank.

      export const offspringMap: any {
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

   A map for reference to elemental weaknesses. For example, fire is weak to water, water is weak to grass, etc.

      export const elementMap: any {
         'fire': 'water',
         'water': 'grass',
         'grass': 'fire',
         'light': 'dark',
         'dark': 'light',
         'normal': 'normal'
      }
   
index.ts
----------

   Return array list of creature objects owned by a user.

      export function getCreaturesByOwner(owner: string): Creature[]
      
   Procreate a new creature using the user's chosen skills, and the SampleCreature of the future child creature.

      export function procreateCreature(newSkills: Array<String>, newCreature: SampleCreature): Creature

   Function to let the user see what child creature they will get from procreation. From the user interface, after being viewed what child creature will result from both parents, the user can select which of the parents' skills to inherit, and which of the child's skills it will forget.

      export function previewFutureChildCreature(a_id: string, b_id: string): SampleCreature
   
   Generate a new creature, this is primarily a helper function to procreateCreature(). In here, a new creature object is created, assigned a random ID, and set to an owner.

      function generateCreatureObject(
         id: string,
         newCreature: SampleCreature,
         newSkills: Array<String>,
      ): Creature

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

   Get skill data.

      export function getSkillData(skill_name: string): string

   Get weakness to an element.

      export function getElementWeakness(type: string): string

   Random ID Generator.

      function generateRandomId(): String {
         const ID_DIGITS: u32 = 16;
         return base64.encode(math.randomBuffer(ID_DIGITS));
      }