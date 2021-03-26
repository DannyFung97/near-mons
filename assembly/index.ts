import { context, logging, base64, math, PersistentVector, PersistentMap } from "near-sdk-as";

import {
  CreatureIdList,
  Creature,
  SampleCreature,
  creaturesByInstanceId,
  creaturesByOwner,
  sampleCreaturesMap,
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
    if (creaturesByInstanceId.contains(creatureId)) {
      let creature = creaturesByInstanceId.getSome(creatureId);
      creaturesList.push(creature);
    }
  }
  return creaturesList;
}

export function procreateCreature(newSkills: Array<String>, newCreature: SampleCreature): Creature {
  let child_id = generateRandomId();

  return generateCreatureObject(
    child_id,
    newCreature,
    newSkills
  );
}

export function previewFutureChildCreature(creatureIdA: string, creatureIdB: string): SampleCreature {
  let parentA = getCreatureByInstanceId(creatureIdA);
  let parentB = getCreatureByInstanceId(creatureIdB);

  let child_evolutionRank = parentA.evolutionRank < parentB.evolutionRank ?
    offspringMap.getSome(parentA.evolutionRank.concat(parentB.evolutionRank)) :
    offspringMap.getSome(parentB.evolutionRank.concat(parentA.evolutionRank));

  let child_element = parentA.element < parentB.element ?
    generationMap.getSome(parentA.element.concat(parentB.element)) :
    parentA.element > parentB.element ?
    generationMap.getSome(parentB.element.concat(parentA.element)) :
    parentA.element.toString();

  let newCreature = sampleCreaturesMap.getSome(child_element.concat(child_evolutionRank));

  return newCreature;
}

function generateCreatureObject(
  instanceId: string,
  newCreature: SampleCreature,
  newSkills: Array<String>
): Creature {
  let creature = new Creature(
    newCreature.sampleId,
    instanceId,
    newCreature.name,
    newCreature.atk,
    newCreature.def,
    newCreature.spd,
    newSkills,
    newCreature.element,
    newCreature.evolutionRank
  );

  setCreatureByInstanceId(instanceId, creature);
  setCreatureIdsByOwner(context.sender, instanceId);

  return creature;
}

export function giveCreaturesToOwner(creatureId1: string, creatureId2: string): Array<Creature> {
  let parentCreature1: SampleCreature = sampleCreaturesMap.getSome(creatureId1);
  let parentCreature2: SampleCreature = sampleCreaturesMap.getSome(creatureId2);

  let id1 = generateRandomId();
  let id2 = generateRandomId();

  let newCreature1 = generateCreatureObject(id1, parentCreature1, parentCreature1.skills);
  let newCreature2 = generateCreatureObject(id2, parentCreature2, parentCreature2.skills);

  return [newCreature1, newCreature2];
}

export function getSampleCreature(creatureId: string): SampleCreature {
  return sampleCreaturesMap.getSome(creatureId);
}

export function getGeneration(combo: string): string {
  return generationMap.getSome(combo);
}

export function getOffspring(combo: string): string {
  return offspringMap.getSome(combo);
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

export function getCreatureByInstanceId(instanceId: string): Creature {
  return creaturesByInstanceId.getSome(instanceId);
}

export function setCreatureByInstanceId(instanceId: string, creature: Creature): void {
  creaturesByInstanceId.set(instanceId, creature);
}

export function deleteCreatureByInstanceId(instanceId: string): void {
  let creature = getCreatureByInstanceId(instanceId);
  deleteCreatureIdsByOwner(creature.owner, instanceId);
  creaturesByInstanceId.delete(instanceId);
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

// export function getSkillsVector(): Array<string> {
//   const length = skillsVector.length;
//   const result = new Array<string>(length);
//   for (let i = 0; i < length; i++) {
//     result[i] = skillsVector[i];
//   }
//   return result;
// }