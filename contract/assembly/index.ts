import { context, logging, base64, math } from "near-sdk-as";

import {
  Creature,
  SampleCreature,
  CreatureIdList,
  creaturesById,
  creaturesByOwner,
  creaturesArray,
  skillsMap,
  generationMap,
  elementMap,
  offspringMap,
} from "./model";

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

export function procreateCreature(newSkills: Array<String>, newCreature: SampleCreature): Creature {
  let child_id = generateRandomId();

  return generateCreatureObject(
    child_id,
    newCreature,
    newSkills
  );
}

export function previewFutureChildCreature(a_id: string, b_id: string): SampleCreature {
  let a_parent = getCreatureById(a_id);
  let b_parent = getCreatureById(b_id);

  let child_evolutionRank = a_parent.evolutionRank < b_parent.evolutionRank ?
    offspringMap[a_parent.evolutionRank.concat(b_parent.evolutionRank)] :
    offspringMap[b_parent.evolutionRank.concat(a_parent.evolutionRank)];

  let child_element = a_parent.element < b_parent.element ?
    generationMap[a_parent.element.concat(b_parent.element)] :
    generationMap[b_parent.element.concat(a_parent.element)];

  let newCreatureCandidates = creaturesArray.filter(creature =>
    (creature.evo === child_evolutionRank && creature.type === child_element));

  let newCreature = newCreatureCandidates[0];

  return newCreature;
}

function generateCreatureObject(
  id: string,
  newCreature: SampleCreature,
  newSkills: Array<String>,
): Creature {
  let childCreature = new Creature(
    id,
    newCreature.name,
    newCreature.atk,
    newCreature.def,
    newCreature.spd,
    newSkills,
    newCreature.type,
    newCreature.evo
  );

  setCreatureById(id, childCreature);
  setCreatureIdsByOwner(context.sender, id);

  return childCreature;
}

function getCreatureIdsByOwner(owner: string): Array<string> {
  let creatureIdList = creaturesByOwner.get(owner);
  if (!creatureIdList) {
    return new Array<string>();
  }
  return creatureIdList.id;
}

function setCreatureIdsByOwner(owner: string, id: string): void {
  let creatureIdList = getCreatureIdsByOwner(owner);
  creatureIdList.push(id);
  let newList = new CreatureIdList(creatureIdList);
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

function setCreatureById(id: string, creature: Creature): void {
  creaturesById.set(id, creature);
}

export function deleteCreatureById(id: string): void {
  let creature = getCreatureById(id);
  deleteCreatureIdsByOwner(creature.owner, id);
  creaturesById.delete(id);
}

export function getSkillData(skill_name: string): string {
  return skillsMap[skill_name];
}

export function getElementWeakness(type: string): string {
  return elementMap[type];
}

function generateRandomId(): string {
  const ID_DIGITS: u32 = 16;
  return base64.encode(math.randomBuffer(ID_DIGITS));
}

function randomNum(): u32 {
  let buf = math.randomBuffer(4);
  return (
    (((0xff & buf[0]) << 24) |
      ((0xff & buf[1]) << 16) |
      ((0xff & buf[2]) << 8) |
      ((0xff & buf[3]) << 0)) %
    100
  );
}