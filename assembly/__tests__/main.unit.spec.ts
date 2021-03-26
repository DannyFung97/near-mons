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

    const givenCreatures: Array<Creature> = giveCreaturesToOwner('d0', 'l0');
    const futureCreature: SampleCreature = previewFutureChildCreature(givenCreatures[0].instanceId, givenCreatures[1].instanceId);

    // calls generateCreature, setCreatureById, getCreatureIdsByOwner, setCreatureIdsByOwner
    let creatureObj = procreateCreature(givenCreatures[0].instanceId, givenCreatures[1].instanceId, futureCreature.skills, futureCreature.sampleId);

    expect(creatureObj).not.toBeNull();

    // final: test getter of creaturesBySampleId
    let retrievedCreature = creaturesByInstanceId.get(creatureObj.instanceId);
    expect(retrievedCreature).toStrictEqual(creatureObj);

    // final: test getter of creaturesByOwner
    creatureIdList = creaturesByOwner.get(owner);
    expect(creatureIdList).not.toBeNull();

    expect(creatureObj.owner).toBe(owner);
    if (creatureIdList) {
      expect(creatureIdList.arrayOfIds[2]).toBe(creatureObj.instanceId);
      expect(futureCreature.sampleId).toBe(creatureObj.sampleId);
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
    const givenCreatures: Array<Creature> = giveCreaturesToOwner('d0', 'l0');

    let child_evolutionRank = givenCreatures[0].evolutionRank < givenCreatures[1].evolutionRank ?
    offspringMap.getSome(givenCreatures[0].evolutionRank.concat(givenCreatures[1].evolutionRank)) :
    offspringMap.getSome(givenCreatures[1].evolutionRank.concat(givenCreatures[0].evolutionRank));

    let child_element = givenCreatures[0].element < givenCreatures[1].element ?
    generationMap.getSome(givenCreatures[0].element.concat(givenCreatures[1].element)) :
    givenCreatures[0].element > givenCreatures[1].element ?
    generationMap.getSome(givenCreatures[1].element.concat(givenCreatures[0].element)) :
    givenCreatures[0].element.toString();

    let newCreature = sampleCreaturesMap.getSome(child_element.concat(child_evolutionRank));

    expect(newCreature.sampleId).toBe('n1');
    expect(newCreature.name).toBe('swo');
  });

  it("Test Procreate", () => {
    const givenCreatures: Array<Creature> = giveCreaturesToOwner('d0', 'l0');

    const futureCreature: SampleCreature = previewFutureChildCreature(givenCreatures[0].instanceId, givenCreatures[1].instanceId);
    const createdCreature: Creature = procreateCreature(givenCreatures[0].instanceId, givenCreatures[1].instanceId, futureCreature.skills, futureCreature.sampleId);

    expect(createdCreature.name).toBe(futureCreature.name);
    expect(createdCreature.atk).toBe(futureCreature.atk);
    expect(createdCreature.def).toBe(futureCreature.def);
    expect(createdCreature.spd).toBe(futureCreature.spd);
    expect(createdCreature.element).toBe(futureCreature.element);
    expect(createdCreature.evolutionRank).toBe(futureCreature.evolutionRank);
  })

  it("Test Preview and procreate", () => {

    const givenCreatures: Array<Creature> = giveCreaturesToOwner('f0', 'w0');
    const futureCreature: SampleCreature = previewFutureChildCreature(givenCreatures[0].instanceId, givenCreatures[1].instanceId);

    const skillsArray = [givenCreatures[0].skills[0], givenCreatures[1].skills[0], givenCreatures[1].skills[1], futureCreature.skills[0]]
    const createdCreature: Creature = procreateCreature(givenCreatures[0].instanceId, givenCreatures[1].instanceId, skillsArray, futureCreature.sampleId);

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
    const givenCreatures: Array<Creature> = giveCreaturesToOwner('f0', 'w0');

    let creature = previewFutureChildCreature(givenCreatures[0].instanceId, givenCreatures[1].instanceId);

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
    const givenCreatures: Array<Creature> = giveCreaturesToOwner('f0', 'w0');
    const futureCreature: SampleCreature = previewFutureChildCreature(givenCreatures[0].instanceId, givenCreatures[1].instanceId);
    let creatureObj = procreateCreature(givenCreatures[0].instanceId, givenCreatures[1].instanceId, futureCreature.skills, futureCreature.sampleId);
    let creature = getCreatureByInstanceId(creatureObj.instanceId);

    expect(creature.name).toBe(creatureObj.name);
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