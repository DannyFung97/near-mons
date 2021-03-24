import { context, PersistentMap, PersistentVector } from "near-sdk-as";

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
    public name: string
    public atk: string
    public def: string
    public spd: string
    public skills: Array<String>
    public type: string
    public evo: string
    constructor(
        creature: any
    ) {
        this.name = creature.name;
        this.atk = creature.atk;
        this.def = creature.def;
        this.spd = creature.spd;
        this.skills = creature.skills;
        this.type = creature.type;
        this.evo = creature.evo;
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
    const creatureData = [
        {
            name: "Salamander",
            atk: '10',
            def: '10',
            spd: '20',
            skills: ["fs", "su"],
            type: "f",
            evo: '0',
        },
        {
            name: "Turtle",
            atk: '10',
            def: '20',
            spd: '10',
            skills: ["ws", "du"],
            type: "w",
            evo: '0',
        },
        {
            name: "Boar",
            atk: '20',
            def: '20',
            spd: '10',
            skills: ["gpark", "au"],
            type: "g",
            evo: '0',
        },
        {
            name: "Eagle",
            atk: '20',
            def: '10',
            spd: '20',
            skills: ["h", "ls"],
            type: "l",
            evo: '0',
        },
        {
            name: "Bat",
            atk: '10',
            def: '10',
            spd: '20',
            skills: ["ds", "dd"],
            type: "d",
            evo: '0',
        },
        {
            name: "Canine",
            atk: '20',
            def: '20',
            spd: '10',
            skills: ["ns", "ng"],
            type: "n",
            evo: '0',
        },
        {
            name: "Serpent",
            atk: '30',
            def: '30',
            spd: '30',
            skills: ["fg", "ad"],
            type: "f",
            evo: '1',
        },
        {
            name: "Shark",
            atk: '30',
            def: '30',
            spd: '30',
            skills: ["h", "gg"],
            type: "w",
            evo: '1',
        },
        {
            name: "Fairy",
            atk: '20',
            def: '20',
            spd: '20',
            skills: ["h", "gg"],
            type: "g",
            evo: '1',
        },
        {
            name: "Osprey",
            atk: '30',
            def: '20',
            spd: '30',
            skills: ["ls", "su"],
            type: "l",
            evo: '1',
        },
        {
            name: "Imp",
            atk: '20',
            def: '30',
            spd: '30',
            skills: ["dg", "sd"],
            type: "d",
            evo: '1',
        },
        {
            name: "Swordsman",
            atk: '30',
            def: '30',
            spd: '20',
            skills: ["au", "nba"],
            type: "n",
            evo: '1',
        },
        {
            name: "Chimera",
            atk: '30',
            def: '30',
            spd: '30',
            skills: ["fba", "dd"],
            type: "f",
            evo: '2',
        },
        {
            name: "Leviathan",
            atk: '40',
            def: '40',
            spd: '40',
            skills: ["wg", "au"],
            type: "w",
            evo: '2',
        },
        {
            name: "Dryad",
            atk: '30',
            def: '40',
            spd: '30',
            skills: ["du", "gba"],
            type: "g",
            evo: '2',
        },
        {
            name: "Spirit",
            atk: '30',
            def: '30',
            spd: '40',
            skills: ["lba", "lg"],
            type: "l",
            evo: '2',
        },
        {
            name: "Vampire",
            atk: '30',
            def: '40',
            spd: '40',
            skills: ["dba", "ad"],
            type: "d",
            evo: '2',
        },
        {
            name: "Knight",
            atk: '40',
            def: '30',
            spd: '30',
            skills: ["nbo", "du"],
            type: "n",
            evo: '2',
        },
        {
            name: "Pele",
            atk: '40',
            def: '40',
            spd: '50',
            skills: ["fbo", "sd"],
            type: "f",
            evo: '3',
        },
        {
            name: "Sobek",
            atk: '50',
            def: '40',
            spd: '50',
            skills: ["wbo", "gg"],
            type: "w",
            evo: '3',
        },
        {
            name: "Gaia",
            atk: '40',
            def: '50',
            spd: '40',
            skills: ["gbo", "ng"],
            type: "g",
            evo: '3',
        },
        {
            name: "Thor",
            atk: '50',
            def: '30',
            spd: '50',
            skills: ["lbo", "dg"],
            type: "l",
            evo: '3',
        },
        {
            name: "Hades",
            atk: '40',
            def: '50',
            spd: '40',
            skills: ["dbo", "lg"],
            type: "d",
            evo: '3',
        },
        {
            name: "Hercules",
            atk: '50',
            def: '50',
            spd: '30',
            skills: ["fg", "dg"],
            type: "n",
            evo: '3',
        }
    ];

    for (let i = 0; i < creatureData.length; i++) {
        creaturesMap.set(creatureData[i].type.concat(creatureData[i].evo), new SampleCreature(creatureData[i]));
        creaturesVector.push(creatureData[i]);
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