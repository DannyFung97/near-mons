import { context, logging, base64, math, PersistentVector, PersistentMap } from "near-sdk-as";

import {
  CreatureIdList,
  Creature,
  SampleCreature,
  creaturesById,
  creaturesByOwner,
  creaturesMap,
  // creaturesVector,
  skillsVector,
  generationMap,
  offspringMap,
  initContract
} from "./models";


export function init(): void {
  initContract();
}

export function getCreaturesByOwner(owner: string): Creature[] {
  let creatureIdList = getCreatureIdsByOwner(owner);
  let creaturesList = new Array<Creature>();
  for (let i = 0; i < creatureIdList.length; i++) {
    let creatureId = creatureIdList[i];
    if (creaturesById.contains(creatureId)) {
      let creature = creaturesById.getSome(creatureId);
      creaturesList.push(creature);
    }
  }
  return creaturesList;
}

export function procreateCreature(newSkills: Array<String>, newCreature: SampleCreature, owner: string): Creature {
  let child_id = generateRandomId();

  return generateCreatureObject(
    child_id,
    newCreature,
    newSkills,
    owner
  );
}

export function previewFutureChildCreature(creatureIdA: string, creatureIdB: string): SampleCreature {
  let parentA = getCreatureById(creatureIdA);
  let parentB = getCreatureById(creatureIdB);

  let child_evolutionRank = parentA.evolutionRank < parentB.evolutionRank ?
    offspringMap.getSome(parentA.evolutionRank.concat(parentB.evolutionRank)) :
    offspringMap.getSome(parentB.evolutionRank.concat(parentA.evolutionRank));

  let child_element = parentA.element < parentB.element ?
    generationMap.getSome(parentA.element.concat(parentB.element)) :
    parentA.element > parentB.element ?
    generationMap.getSome(parentB.element.concat(parentA.element)) :
    parentA.element.toString();

  let newCreature = creaturesMap.getSome(child_element.concat(child_evolutionRank));

  return newCreature;
}

export function generateCreatureObject(
  id: string,
  newCreature: SampleCreature,
  newSkills: Array<String>,
  owner: string
): Creature {
  let creature = new Creature(
    newCreature.creatureId,
    id,
    newCreature.name,
    newCreature.atk,
    newCreature.def,
    newCreature.spd,
    newSkills,
    newCreature.element,
    newCreature.evolutionRank
  );

  setCreatureById(id, creature);
  setCreatureIdsByOwner(owner, id);

  return creature;
}

export function giveSpecificCreaturesToOwner(creatureId1: string, creatureId2: string, owner:string): Array<Creature> {
  let parentCreature1: SampleCreature = creaturesMap.getSome(creatureId1);
  let parentCreature2: SampleCreature = creaturesMap.getSome(creatureId2);

  let id1 = generateRandomId();
  let id2 = generateRandomId();

  let newCreature1 = generateCreatureObject(id1, parentCreature1, parentCreature1.skills, owner);
  let newCreature2 = generateCreatureObject(id2, parentCreature2, parentCreature2.skills, owner);

  return [newCreature1, newCreature2];
}

// export function giveRandomCreaturesToOwner(owner: string): Array<Creature> {
//   let randomSampleCreature1 = creaturesVector[(randomNum() * 6) / 100];
//   let randomSampleCreature2 = creaturesVector[(randomNum() * 6) / 100];

//   let id1 = generateRandomId();
//   let id2 = generateRandomId();

//   let newCreature1 = generateCreatureObject(id1, randomSampleCreature1, randomSampleCreature1.skills, owner);
//   let newCreature2 = generateCreatureObject(id2, randomSampleCreature2, randomSampleCreature2.skills, owner);

//   return [newCreature1, newCreature2];
// }

// export function getSampleCreaturesVector(): Array<SampleCreature> {
//   const length = creaturesVector.length;
//   const result = new Array<SampleCreature>(length);
//   for (let i = 0; i < length; i++) {
//     result[i] = creaturesVector[i];
//   }
//   return result;
// }

export function getSampleCreaturesMap(): PersistentMap<string, SampleCreature> {
  return creaturesMap;
}

export function getGenerationMap(): PersistentMap<string, string> {
  return generationMap;
}

export function getSkillsVector(): Array<string> {
  const length = skillsVector.length;
  const result = new Array<string>(length);
  for (let i = 0; i < length; i++) {
    result[i] = skillsVector[i];
  }
  return result;
}

export function getOffspringMap(): PersistentMap<string, string> {
  return offspringMap;
}

function getCreatureIdsByOwner(owner: string): Array<string> {
  let creatureIdList = creaturesByOwner.get(owner);
  if (!creatureIdList) {
    return new Array<string>();
  }
  return creatureIdList.arrayOfIds;
}

export function setCreatureIdsByOwner(owner: string, id: string): void {
  let creatureIdArray = getCreatureIdsByOwner(owner);
  creatureIdArray.push(id);
  let newList = new CreatureIdList(creatureIdArray);
  creaturesByOwner.set(owner, newList);
}

function deleteCreatureIdsByOwner(owner: string, id: string): void {
  const creatureIdList = getCreatureIdsByOwner(owner);
  for (let i = 0; i < creatureIdList.length; i++) {
    if (id == creatureIdList[i]) {
      creatureIdList.splice(i, 1);
    }
  }
  let newList = new CreatureIdList(creatureIdList);
  creaturesByOwner.set(owner, newList);
}

export function getCreatureById(id: string): Creature {
  return creaturesById.getSome(id);
}

export function setCreatureById(id: string, creature: Creature): void {
  creaturesById.set(id, creature);
}

export function deleteCreatureById(id: string): void {
  let creature = getCreatureById(id);
  deleteCreatureIdsByOwner(creature.owner, id);
  creaturesById.delete(id);
}

function generateRandomId(): string {
  const ID_DIGITS: u32 = 16;
  return base64.encode(math.randomBuffer(ID_DIGITS));
}

export function randomNum(): u32 {
  let buf = math.randomBuffer(4);
  return (
    (((0xff & buf[0]) << 24) |
      ((0xff & buf[1]) << 16) |
      ((0xff & buf[2]) << 8) |
      ((0xff & buf[3]) << 0)) %
    100
  );
}