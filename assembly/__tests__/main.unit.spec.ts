import {
  init,
  getCreaturesByOwner,
  generateCreatureObject,
  procreateCreature,
  previewFutureChildCreature,
  giveSpecificCreaturesToOwner,
  // giveRandomCreaturesToOwner,
  // getSampleCreaturesVector,
  getSampleCreaturesMap,
  getGenerationMap,
  getSkillsVector,
  getOffspringMap,
  setCreatureById,
  setCreatureIdsByOwner,
  getCreatureById,
  deleteCreatureById,
  randomNum
} from "../index";

import {
  CreatureIdList,
  Creature,
  SampleCreature,
  creaturesMap,
  // creaturesVector,
  generationMap,
  skillsVector,
  offspringMap,
  creaturesByOwner,
  creaturesById
} from "../models"

import { storage, PersistentDeque, PersistentMap, PersistentVector, VMContext, VM, logging } from "near-sdk-as";

const owner = 'owner';

const tempCreature: Creature = new Creature(
  'f0',
  '1',
  'ken',
  '10',
  '10',
  '10',
  ['fb'],
  'f',
  '0'
);

const tempSampleCreature: SampleCreature = new SampleCreature(
  'f0',
  'ken',
  '10',
  '10',
  '10',
  ['fb'],
  'f',
  '0'
);

beforeEach(init);

describe("Initialize contract", () => {

  xit("Sample creatures are available in map", () => {
    // log(creaturesMap.getSome("f0"));
    expect(creaturesMap.contains("f0")).toBe(true);
  });

  xit("Generation map is available", () => {
    // log(generationMap.getSome("dw"));
    expect(generationMap.contains('dw')).toBe(true);
  });

  xit("Skills are available in vector", () => {
    const skill = "ha";
    // log(skillsVector);
    expect(skillsVector.length).toBeGreaterThan(0, "Should have skills in vector.");
    expect(skillsVector[0]).toStrictEqual(
      skill,
      'skill should be "ha"'
    );
  });

  xit("Offspring map is available", () => {
    // log(offspringMap.getSome('00'));
    expect(offspringMap.contains('00')).toBe(true);
  });
});

describe("Test hardcoded getters", () => {

  // simulates generateCreature
  xit("Test get and set CreatureIdList", () => {

    // setCreatureById
    creaturesById.set('1', tempCreature);

    // getCreatureIdsByOwner
    let idList = creaturesByOwner.get(owner);
    expect(idList).toBeNull();
    let arrayOfIds = new Array<string>();

    // setCreatureIdsByOwner
    arrayOfIds.push('1');
    let newList = new CreatureIdList(arrayOfIds);
    creaturesByOwner.set(owner, newList);

    // final: test getter of creaturesById
    let retrievedCreature = creaturesById.get('1');
    expect(retrievedCreature).toStrictEqual(tempCreature);

    // final: test getter of creaturesByOwner
    idList = creaturesByOwner.get(owner);
    expect(idList).not.toBeNull();
  })
})

describe("Can create creature", () => {

  xit("test generateCreatureObject()", () => {
    let creatureIdList = creaturesByOwner.get(owner);
    expect(creatureIdList).toBeNull();

    let sampleCreature: SampleCreature = creaturesMap.getSome("f0");

    // calls generateCreature, setCreatureById, getCreatureIdsByOwner, setCreatureIdsByOwner
    let creatureObj = generateCreatureObject('1234', sampleCreature, sampleCreature.skills, owner);

    expect(creatureObj).not.toBeNull();

    // final: test getter of creaturesById
    let retrievedCreature = creaturesById.get(creatureObj.id);
    expect(retrievedCreature).toStrictEqual(creatureObj);

    // final: test getter of creaturesByOwner
    creatureIdList = creaturesByOwner.get(owner);
    expect(creatureIdList).not.toBeNull();

    if (creatureIdList) {
      expect(creatureIdList.arrayOfIds[0]).toBe('1234');
    }
  });

  xit("test setCreatureById() and setCreatureIdsByOwner()", () => {
    let creatureIdList = creaturesByOwner.get(owner);
    expect(creatureIdList).toBeNull();

    setCreatureById(tempCreature.id, tempCreature);
    setCreatureIdsByOwner(owner, tempCreature.id);

    // final: test getter of creaturesById
    let retrievedCreature = creaturesById.get(tempCreature.id);
    expect(retrievedCreature).toStrictEqual(tempCreature);

    // final: test getter of creaturesByOwner
    creatureIdList = creaturesByOwner.get(owner);
    expect(creatureIdList).not.toBeNull();
  })
});

beforeEach(init);

describe("Can preview and procreate creatures", () => {

  xit("Procreate", () => {
    const createdCreature: Creature = procreateCreature(tempSampleCreature.skills, tempSampleCreature, owner);

    expect(createdCreature.name).toBe(tempCreature.name);
    expect(createdCreature.atk).toBe(tempCreature.atk);
    expect(createdCreature.def).toBe(tempCreature.def);
    expect(createdCreature.spd).toBe(tempCreature.spd);
    expect(createdCreature.element).toBe(tempCreature.element);
    expect(createdCreature.evolutionRank).toBe(tempCreature.evolutionRank);
  })

  it("Preview and procreate", () => {

    const parentCreature1: Creature = procreateCreature(tempSampleCreature.skills, creaturesMap.getSome('d0'), owner);
    const parentCreature2: Creature = procreateCreature(tempSampleCreature.skills, creaturesMap.getSome('l0'), owner);

    const skillsArray = ['fb', 'fg', 'au', 'sd']

    const futureCreature: SampleCreature = previewFutureChildCreature(parentCreature1.id, parentCreature2.id);
    const createdCreature: Creature = procreateCreature(skillsArray, futureCreature, owner);

    expect(futureCreature.name).toBe(creaturesMap.getSome('n1').name);
    expect(futureCreature.atk).toBe(creaturesMap.getSome('n1').atk);
    expect(futureCreature.def).toBe(creaturesMap.getSome('n1').def);
    expect(futureCreature.spd).toBe(creaturesMap.getSome('n1').spd);
    expect(futureCreature.skills).toHaveLength(creaturesMap.getSome('n1').skills.length);
    expect(futureCreature.element).toBe(creaturesMap.getSome('n1').element);
    expect(futureCreature.evolutionRank).toBe(creaturesMap.getSome('n1').evolutionRank);

    expect(createdCreature.creatureId).toBe(creaturesMap.getSome('n1').creatureId);
    expect(createdCreature.name).toBe(creaturesMap.getSome('n1').name);
    expect(createdCreature.atk).toBe(creaturesMap.getSome('n1').atk);
    expect(createdCreature.def).toBe(creaturesMap.getSome('n1').def);
    expect(createdCreature.spd).toBe(creaturesMap.getSome('n1').spd);
    expect(createdCreature.skills).toHaveLength(skillsArray.length);
    expect(createdCreature.element).toBe(creaturesMap.getSome('n1').element);
    expect(createdCreature.evolutionRank).toBe(creaturesMap.getSome('n1').evolutionRank);
  });

  xit("Test previewFutureChildCreature", () => {
    let parentA = getCreatureById('d0');
    let parentB = getCreatureById('l0');

    let child_evolutionRank = parentA.evolutionRank < parentB.evolutionRank ?
    offspringMap.getSome(parentA.evolutionRank.concat(parentB.evolutionRank)) :
    offspringMap.getSome(parentB.evolutionRank.concat(parentA.evolutionRank));

    let child_element = parentA.element < parentB.element ?
    generationMap.getSome(parentA.element.concat(parentB.element)) :
    parentA.element > parentB.element ?
    generationMap.getSome(parentB.element.concat(parentA.element)) :
    parentA.element.toString();

    let newCreature = creaturesMap.getSome(child_element.concat(child_evolutionRank));

    log(newCreature);
  });

  xit("Test procreateCreature", () => {

  });
})

describe("Test getter functions", () => {

  xit("Get creature objects by owner", () => {
    const creaturesList: Creature[] = getCreaturesByOwner(owner)
    expect(creaturesList).toBeNull();
  });

  xit("Get child creature preview", () => {
    let creature = previewFutureChildCreature('d0', 'l0');
    log(creature);
  });

  xit("Get sample creature objects map", () => {
    let creaturesMap = getSampleCreaturesMap();
    log(creaturesMap);
  });

  xit("Get generation map", () => {
    let generationsMap = getGenerationMap();
    log(generationsMap);
  });

  xit("Get skills vector", () => {
    let skillsVector = getSkillsVector();
    log(skillsVector);
  });

  xit("Get offspring map", () => {
    let offspringMap = getOffspringMap();
    log(offspringMap);
  });

  xit("Get creature by id", () => {
    let creature = getCreatureById('d3');
    log(creature);
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
    const givenCreatures: Array<Creature> = giveSpecificCreaturesToOwner('d0', 'l0', owner);
    creatureIdList = getCreaturesByOwner(owner);
    expect(creatureIdList).toHaveLength(2);
  });
});