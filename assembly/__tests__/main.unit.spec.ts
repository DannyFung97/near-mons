import {
  init,
  getCreaturesByOwner,
  procreateCreature,
  previewFutureChildCreature,
  giveCreaturesToOwner,
  getSampleCreature,
  getGeneration,
  getOffspring,
  setCreatureByInstanceId,
  setCreatureIdsByOwner,
  getCreatureByInstanceId,
  deleteCreatureByInstanceId,
} from "../index";

import {
  CreatureIdList,
  Creature,
  SampleCreature,
  sampleCreaturesMap,
  generationMap,
  offspringMap,
  creaturesByOwner,
  creaturesByInstanceId
} from "../models"

import { storage, PersistentDeque, PersistentMap, PersistentVector, VMContext, VM, logging } from "near-sdk-as";

const owner = 'bob';

const tempCreature1: Creature = new Creature(
  'f0',
  '1',
  'sal',
  '10',
  '10',
  '10',
  ['fb'],
  'f',
  '0'
);

const tempCreature2: Creature = new Creature(
  'w0',
  '2',
  'tur',
  '10',
  '20',
  '10',
  ['ws', 'du'],
  'w',
  '0'
);

const tempSampleCreature1: SampleCreature = new SampleCreature(
  'f0',
  'sal',
  '10',
  '10',
  '10',
  ['fb'],
  'f',
  '0'
);

const tempSampleCreature2: SampleCreature = new SampleCreature(
  'w0',
  'tur',
  '10',
  '20',
  '10',
  ['ws', 'du'],
  'w',
  '0'
);

beforeEach(init);

describe("Initialize contract", () => {

  it("Sample creatures are available in map", () => {
    expect(sampleCreaturesMap.contains("f0")).toBe(true);
  });

  it("Generation map is available", () => {
    expect(generationMap.contains('dw')).toBe(true);
  });

  it("Offspring map is available", () => {
    expect(offspringMap.contains('00')).toBe(true);
  });
});

describe("Test hardcoded getters", () => {

  // simulates generateCreature
  it("Test get and set CreatureIdList", () => {

    // setCreatureById
    creaturesByInstanceId.set('1', tempCreature1);

    // getCreatureIdsByOwner
    let idList = creaturesByOwner.get(owner);
    expect(idList).toBeNull();
    let arrayOfIds = new Array<string>();

    // setCreatureIdsByOwner
    arrayOfIds.push('1');
    let newList = new CreatureIdList(arrayOfIds);
    creaturesByOwner.set(owner, newList);

    // final: test getter of creaturesById
    let retrievedCreature = creaturesByInstanceId.get('1');
    expect(retrievedCreature).toStrictEqual(tempCreature1);

    // final: test getter of creaturesByOwner
    idList = creaturesByOwner.get(owner);
    expect(idList).not.toBeNull();
  })
})

describe("Can create creature", () => {

  it("test generateCreatureObject()", () => {
    let creatureIdList = creaturesByOwner.get(owner);
    expect(creatureIdList).toBeNull();

    let sampleCreature: SampleCreature = sampleCreaturesMap.getSome("f0");

    // calls generateCreature, setCreatureById, getCreatureIdsByOwner, setCreatureIdsByOwner
    let creatureObj = procreateCreature(sampleCreature.skills, sampleCreature.sampleId);

    expect(creatureObj).not.toBeNull();

    // final: test getter of creaturesBySampleId
    let retrievedCreature = creaturesByInstanceId.get(creatureObj.instanceId);
    expect(retrievedCreature).toStrictEqual(creatureObj);

    // final: test getter of creaturesByOwner
    creatureIdList = creaturesByOwner.get(owner);
    expect(creatureIdList).not.toBeNull();

    expect(creatureObj.owner).toBe(owner);
    if (creatureIdList) {
      expect(creatureIdList.arrayOfIds[0]).toBe(creatureObj.instanceId);
    }
  });

  it("test setCreatureByInstanceId() and setCreatureIdsByOwner() from generateCreatureObject()", () => {
    let creatureIdList = creaturesByOwner.get(owner);
    expect(creatureIdList).toBeNull();

    setCreatureByInstanceId(tempCreature1.instanceId, tempCreature1);
    setCreatureIdsByOwner(owner, tempCreature1.instanceId);

    // final: test getter of creaturesByinstanceId
    let retrievedCreature = creaturesByInstanceId.get(tempCreature1.instanceId);
    expect(retrievedCreature).toStrictEqual(tempCreature1);

    // final: test getter of creaturesByOwner
    creatureIdList = creaturesByOwner.get(owner);
    expect(creatureIdList).not.toBeNull();
  })
});

beforeEach(init);

describe("Can preview and procreate creatures", () => {

  it("Test Preview", () => {
    let parentA = procreateCreature(tempSampleCreature1.skills, tempSampleCreature1.sampleId);
    let parentB = procreateCreature(tempSampleCreature2.skills, tempSampleCreature2.sampleId);

    let child_evolutionRank = parentA.evolutionRank < parentB.evolutionRank ?
    offspringMap.getSome(parentA.evolutionRank.concat(parentB.evolutionRank)) :
    offspringMap.getSome(parentB.evolutionRank.concat(parentA.evolutionRank));

    let child_element = parentA.element < parentB.element ?
    generationMap.getSome(parentA.element.concat(parentB.element)) :
    parentA.element > parentB.element ?
    generationMap.getSome(parentB.element.concat(parentA.element)) :
    parentA.element.toString();

    let newCreature = sampleCreaturesMap.getSome(child_element.concat(child_evolutionRank));

    expect(newCreature.sampleId).toBe('d1');
    expect(newCreature.name).toBe('imp');
  });

  it("Test Procreate", () => {
    const createdCreature: Creature = procreateCreature(tempSampleCreature1.skills, tempSampleCreature1.sampleId);

    expect(createdCreature.name).toBe(tempSampleCreature1.name);
    expect(createdCreature.atk).toBe(tempSampleCreature1.atk);
    expect(createdCreature.def).toBe(tempSampleCreature1.def);
    expect(createdCreature.spd).toBe(tempSampleCreature1.spd);
    expect(createdCreature.element).toBe(tempSampleCreature1.element);
    expect(createdCreature.evolutionRank).toBe(tempSampleCreature1.evolutionRank);
  })

  it("Test Preview and procreate", () => {

    let parentA = procreateCreature(tempSampleCreature1.skills, tempSampleCreature1.sampleId);
    let parentB = procreateCreature(tempSampleCreature2.skills, tempSampleCreature2.sampleId);

    const futureCreature: SampleCreature = previewFutureChildCreature(parentA.instanceId, parentB.instanceId);
    
    const skillsArray = [parentA.skills[0], parentB.skills[0], parentB.skills[1], futureCreature.skills[0]]
    const createdCreature: Creature = procreateCreature(skillsArray, futureCreature.sampleId);

    expect(futureCreature.name).toBe(sampleCreaturesMap.getSome('d1').name);
    expect(futureCreature.atk).toBe(sampleCreaturesMap.getSome('d1').atk);
    expect(futureCreature.def).toBe(sampleCreaturesMap.getSome('d1').def);
    expect(futureCreature.spd).toBe(sampleCreaturesMap.getSome('d1').spd);
    expect(futureCreature.skills).toHaveLength(sampleCreaturesMap.getSome('d1').skills.length);
    expect(futureCreature.element).toBe(sampleCreaturesMap.getSome('d1').element);
    expect(futureCreature.evolutionRank).toBe(sampleCreaturesMap.getSome('d1').evolutionRank);

    expect(createdCreature.sampleId).toBe(sampleCreaturesMap.getSome('d1').sampleId);
    expect(createdCreature.name).toBe(sampleCreaturesMap.getSome('d1').name);
    expect(createdCreature.atk).toBe(sampleCreaturesMap.getSome('d1').atk);
    expect(createdCreature.def).toBe(sampleCreaturesMap.getSome('d1').def);
    expect(createdCreature.spd).toBe(sampleCreaturesMap.getSome('d1').spd);
    expect(createdCreature.skills).toHaveLength(skillsArray.length);
    expect(createdCreature.element).toBe(sampleCreaturesMap.getSome('d1').element);
    expect(createdCreature.evolutionRank).toBe(sampleCreaturesMap.getSome('d1').evolutionRank);
  });
})

describe("Test getter functions", () => {

  it("Get creature objects by owner", () => {
    let creaturesList: Creature[] = getCreaturesByOwner(owner)
    expect(creaturesList).toHaveLength(0);
    
    const givenCreatures: Array<Creature> = giveCreaturesToOwner('d0', 'l0');
    creaturesList = getCreaturesByOwner(owner);
    expect(creaturesList).toHaveLength(2);
  });

  it("Get child creature preview", () => {
    let parentA = procreateCreature(tempSampleCreature1.skills, tempSampleCreature1.sampleId);
    let parentB = procreateCreature(tempSampleCreature2.skills, tempSampleCreature2.sampleId);
    let creature = previewFutureChildCreature(parentA.instanceId, parentB.instanceId);

    expect(creature.sampleId).toBe('d1');
    expect(creature.name).toBe('imp');
  });

  it("Get sample creature objects map", () => {
    let creature = getSampleCreature('d0');
    expect(creature.name).toBe('bat');
  });

  it("Get generation map", () => {
    let generation = getGeneration('df');
    expect(generation).toStrictEqual('g');
  });

  it("Get offspring map", () => {
    let offspring = getOffspring('00');
    expect(offspring).toStrictEqual('1');
  });

  it("Get creature by instance id", () => {
    let sampleCreature: SampleCreature = sampleCreaturesMap.getSome("f0");
    let creatureObj = procreateCreature(sampleCreature.skills, sampleCreature.sampleId);
    let creature = getCreatureByInstanceId(creatureObj.instanceId);

    expect(creature.name).toBe(creatureObj.name);
  });
});

describe("Give owner 2 creatures", () => {

  it("owner does not own any creatures", () => {
    let creatureIdList = getCreaturesByOwner(owner);
    expect(creatureIdList).toHaveLength(0);
  });

  it("owner is given 2 creatures", () => {
    let creatureIdList = getCreaturesByOwner(owner);
    expect(creatureIdList).toHaveLength(0);
    const givenCreatures: Array<Creature> = giveCreaturesToOwner('d0', 'l0');
    creatureIdList = getCreaturesByOwner(owner);
    expect(creatureIdList).toHaveLength(2);
  });
});

describe('Delete creature from owner', () => {

  it('delete by instance id', () => {
    const givenCreatures: Array<Creature> = giveCreaturesToOwner('d0', 'l0');

    let numCreatures = getCreaturesByOwner(owner);
    expect(numCreatures).toHaveLength(2);
    deleteCreatureByInstanceId(givenCreatures[0].instanceId);

    numCreatures = getCreaturesByOwner(owner);
    expect(numCreatures).toHaveLength(1);
    deleteCreatureByInstanceId(givenCreatures[1].instanceId);

    numCreatures = getCreaturesByOwner(owner);
    expect(numCreatures).toHaveLength(0);
  })
});