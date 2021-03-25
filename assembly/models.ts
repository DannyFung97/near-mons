import { context, logging, PersistentMap, PersistentVector } from "near-sdk-as";

@nearBindgen
export class CreatureIdList {
  constructor(public id: Array<string>) { }
}

@nearBindgen
export class Creature {
  owner: string;
  constructor(
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

@nearBindgen
export class SampleCreature {
  constructor(
    public name: string,
    public atk: string,
    public def: string,
    public spd: string,
    public skills: Array<String>,
    public type: string,
    public evo: string
  ) {

  }
}

export const creaturesById = new PersistentMap<string, Creature>('ci');

export const creaturesByOwner = new PersistentMap<string, CreatureIdList>("co");

export const creaturesMap = new PersistentMap<string, SampleCreature>("cm");

export const creaturesVector = new PersistentVector<SampleCreature>("cv");

export const generationMap = new PersistentMap<string, string>("gm");

export const skillsVector = new PersistentVector<string>("sm");

export const offspringMap = new PersistentMap<string, string>("om");

export function initContract(): void {
  initCreatures();
  initGenerationMap();
  initSkillsVector();
  initOffspringMap();
}

function initCreatures(): void {
  const creaturesData = [
    "sal:10:10:10:fs,su:f:0",
    "tur:10:20:10:ws,du:w:0",
    "boa:20:20:10:gs,au:g:0",
    "eag:20:10:20:h,ls:l:0",
    "bat:20:10:20:ds,dd:d:0",
    "can:20:20:10:ns,ng:n:0",
    "ser:30:30:30:fg,ad:f:1",
    "sha:30:30:30:ha,gg:w:1",
    "fai:20:20:20:ha,gg:g:1",
    "osp:30:20:30:ls,su:l:1",
    "imp:20:30:30:dg,sd:d:1",
    "swo:30:30:20:au,nb:n:1",
    "chi:30:30:30:fb,dd:f:2",
    "lev:40:40:40:wg,au:w:2",
    "dry:30:40:30:du,gb:g:2",
    "spi:30:30:40:lb,lg:l:2",
    "vam:30:40:40:db,ad:d:2",
    "kni:40:30:30:nB,du:n:2",
    "pel:40:40:50,fB,sd:f:3",
    "sob:50:40:50:wB,gg:w:3",
    "gai:40:50:40:gB,ng:g:3",
    "tho:50:30:50:lB,dg:l:3",
    "had:40:50:40:dB,lg:d:3",
    "her:50:50:30:fg,dg:n:3"
  ]

  for (let i = 0; i < creaturesData.length; i++) {
    let creatureData = creaturesData[i].split(":");
    let creature = new SampleCreature(
      creatureData[0],
      creatureData[1],
      creatureData[2],
      creatureData[3],
      creatureData[4].split(','),
      creatureData[5],
      creatureData[6]
    );
    creaturesMap.set(creatureData[5].concat(creatureData[6]), creature);
    creaturesVector.push(creature);
  }
}

function initGenerationMap(): void {
  const creaturesData = [
    "dw:f",
    "dl:n",
    "dn:n",
    "dg:w",
    "df:g",
    "fw:d",
    "fg:l",
    "fl:w",
    "fn:n",
    "gw:n",
    "gl:f",
    "gn:n",
    "lw:g",
    "ln:n",
    "nw:n"
  ]

  for (let i = 0; i < creaturesData.length; i++) {
    const keyPair = creaturesData[i].split(":")
    generationMap.set(keyPair[0], keyPair[1]);
  }
}

function initSkillsVector(): void {
  const skillsData = [
    "h",
    "fg",
    "wg",
    "gg",
    "lg",
    "dg",
    "ng",
    "fs",
    "fba",
    "fbo",
    "ws",
    "wba",
    "wbo",
    "gs",
    "gba",
    "gbo",
    "ls",
    "lba",
    "lbo",
    "ds",
    "dba",
    "dbo",
    "ns",
    "nba",
    "nbo",
    "au",
    "du",
    "su",
    "ad",
    "dd",
    "sd"
  ];

  for (let i = 0; i < skillsData.length; i++) {
    skillsVector.push(skillsData[i]);
  }
}

function initOffspringMap(): void {
  const offspringData = [
    "00:1",
    "01:1",
    "02:1",
    "03:1",
    "11:2",
    "12:2",
    "13:2",
    "22:3",
    "23:3",
    "33:0"
  ]

  for (let i = 0; i < offspringData.length; i++) {
    const keyPair = offspringData[i].split(":")
    offspringMap.set(keyPair[0], keyPair[1]);
  }
}