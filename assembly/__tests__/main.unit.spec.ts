import {
  init,
  getCreaturesByOwner,
  procreateCreature,
  previewFutureChildCreature,
  giveSpecificCreaturesToOwner,
  giveRandomCreaturesToOwner,
  getSampleCreaturesVector,
  getSampleCreaturesMap,
  getGenerationMap,
  getSkillsVector,
  getOffspringMap,
  getCreatureById,
  deleteCreatureById,
} from "../index";
import {
  Creature,
  SampleCreature
} from "../models"
import { storage, PersistentDeque, VMContext, VM, logging } from "near-sdk-as";

const owner = 'owner';

let messages: PersistentDeque<string>;

describe("Initialize contract", () => {
  it("init", () => {
    init();
  });

  it("Sample creatures are available in vector", () => {
    expect(getSampleCreaturesVector().length).toBeGreaterThan(0);
  });

  it("Sample creatures are available in map", () => {
    expect(getSampleCreaturesMap().contains('sal')).toBe(true);
  });

  it("Generation map is available", () => {
    expect(getGenerationMap().contains('00')).toBe(true);
  });

  it("Skills are available", () => {
    expect(getSkillsVector().length).toBeGreaterThan(0);
  });

  it("Offspring map is available", () => {
    expect(getOffspringMap().contains('df')).toBe(true);
  });
})

describe("Give owner 2 creatures", () => {

  it("owner does not own any creatures", () => {
    expect(getCreaturesByOwner(owner).length).toBe(0);
  });

  it("owner is given 2 creatures", () => {
    giveRandomCreaturesToOwner();
    const numCreatures = getCreaturesByOwner(owner)
    expect(numCreatures.length).toBe(2);
  });
});

// describe("Procreate new creature using two creatures as parents", () => {
//   let creatures: Creature[];

//   it("owner owns at least 2 creatures", () => {
//     // logging.log(creatures.toString());
//     creatures = getCreaturesByOwner(owner);
//     expect(creatures.length).toBeGreaterThanOrEqual(2);
//   });

//   it("owner is previewed the future child creature", () => {
//     // logging.log(creatures.length);
//     let sample: SampleCreature = previewFutureChildCreature(creatures[0].id, creatures[1].id);
//     // logging.log(sample);
//   });
// });