import { context, PersistentMap } from "near-sdk-as";

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
    public name: string;
    public atk: string;
    public def: string;
    public spd: string;
    public skills: Array<String>;
    public type: string;
    public evo: string;
}

export const creaturesById = new PersistentMap<string, Creature>('creaturesById');

export const creaturesByOwner = new PersistentMap<string, CreatureIdList>("creaturesByOwner");

export const creaturesArray: Array<SampleCreature> = [
    {
        name: "Salamander",
        atk: '10',
        def: '10',
        spd: '20',
        skills: ["firespark", "speedup"],
        type: "fire",
        evo: '0',
    },
    {
        name: "Turtle",
        atk: '10',
        def: '20',
        spd: '10',
        skills: ["waterspark", "defenseup"],
        type: "water",
        evo: '0',
    },
    {
        name: "Boar",
        atk: '20',
        def: '20',
        spd: '10',
        skills: ["grasspark", "attackup"],
        type: "grass",
        evo: '0',
    },
    {
        name: "Eagle",
        atk: '20',
        def: '10',
        spd: '20',
        skills: ["home advantage", "lightspark"],
        type: "light",
        evo: '0',
    },
    {
        name: "Bat",
        atk: '10',
        def: '10',
        spd: '20',
        skills: ["darkspark", "defensedown"],
        type: "dark",
        evo: '0',
    },
    {
        name: "Canine",
        atk: '20',
        def: '20',
        spd: '10',
        skills: ["norspark", "norguard"],
        type: "normal",
        evo: '0',
    },
    {
        name: "Serpent",
        atk: '30',
        def: '30',
        spd: '30',
        skills: ["fireguard", "attackdown"],
        type: "fire",
        evo: '1',
    },
    {
        name: "Shark",
        atk: '30',
        def: '30',
        spd: '30',
        skills: ["home advantage", "grassguard"],
        type: "water",
        evo: '1',
    },
    {
        name: "Fairy",
        atk: '20',
        def: '20',
        spd: '20',
        skills: ["home advantage", "grassguard"],
        type: "grass",
        evo: '1',
    },
    {
        name: "Osprey",
        atk: '30',
        def: '20',
        spd: '30',
        skills: ["lightspark", "speedup"],
        type: "light",
        evo: '1',
    },
    {
        name: "Imp",
        atk: '20',
        def: '30',
        spd: '30',
        skills: ["darkguard", "speeddown"],
        type: "dark",
        evo: '1',
    },
    {
        name: "Swordsman",
        atk: '30',
        def: '30',
        spd: '20',
        skills: ["attackup", "norball"],
        type: "normal",
        evo: '1',
    },
    {
        name: "Chimera",
        atk: '30',
        def: '30',
        spd: '30',
        skills: ["fireball", "defensedown"],
        type: "fire",
        evo: '2',
    },
    {
        name: "Leviathan",
        atk: '40',
        def: '40',
        spd: '40',
        skills: ["waterguard", "attackup"],
        type: "water",
        evo: '2',
    },
    {
        name: "Dryad",
        atk: '30',
        def: '40',
        spd: '30',
        skills: ["defenseup", "grassball"],
        type: "grass",
        evo: '2',
    },
    {
        name: "Spirit",
        atk: '30',
        def: '30',
        spd: '40',
        skills: ["lightball", "lightguard"],
        type: "light",
        evo: '2',
    },
    {
        name: "Vampire",
        atk: '30',
        def: '40',
        spd: '40',
        skills: ["darkball", "attackdown"],
        type: "dark",
        evo: '2',
    },
    {
        name: "Knight",
        atk: '40',
        def: '30',
        spd: '30',
        skills: ["norbolt", "defenseup"],
        type: "normal",
        evo: '2',
    },
    {
        name: "Pele",
        atk: '40',
        def: '40',
        spd: '50',
        skills: ["firebolt", "speeddown"],
        type: "fire",
        evo: '3',
    },
    {
        name: "Sobek",
        atk: '50',
        def: '40',
        spd: '50',
        skills: ["waterbolt", "grassguard"],
        type: "water",
        evo: '3',
    },
    {
        name: "Gaia",
        atk: '40',
        def: '50',
        spd: '40',
        skills: ["grassbolt", "norguard"],
        type: "grass",
        evo: '3',
    },
    {
        name: "Thor",
        atk: '50',
        def: '30',
        spd: '50',
        skills: ["lightbolt", "darkguard"],
        type: "light",
        evo: '3',
    },
    {
        name: "Hades",
        atk: '40',
        def: '50',
        spd: '40',
        skills: ["darkbolt", "lightguard"],
        type: "dark",
        evo: '3',
    },
    {
        name: "Hercules",
        atk: '50',
        def: '50',
        spd: '30',
        skills: ["fireguard", "darkguard"],
        type: "normal",
        evo: '3',
    },
]

export const skillsMap: any = {
    'home advantage': { description: 'Goes first in battle.' },
    'fireguard': { description: 'Resistance against fire damage.' },
    'waterguard': { description: 'Resistance against water damage.' },
    'grassguard': { description: 'Resistance against grass damage.' },
    'lightguard': { description: 'Resistance against light damage.' },
    'darkguard': { description: 'Resistance against dark damage.' },
    'norguard': { description: 'Resistance against normal damage.' },
    'firespark': { description: 'Small fire attack.' },
    'fireball': { description: 'Medium fire attack.' },
    'firebolt': { description: 'Large fire attack.' },
    'waterspark': { description: 'Small water attack.' },
    'waterball': { description: 'Medium water attack.' },
    'waterbolt': { description: 'Large water attack.' },
    'grasspark': { description: 'Small grass attack.' },
    'grassball': { description: 'Medium grass attack.' },
    'grassbolt': { description: 'Large grass attack.' },
    'lightspark': { description: 'Small light attack.' },
    'lightball': { description: 'Medium light attack.' },
    'lightbolt': { description: 'Large light attack.' },
    'darkspark': { description: 'Small dark attack.' },
    'darkball': { description: 'Medium dark attack.' },
    'darkbolt': { description: 'Large dark attack.' },
    'norspark': { description: 'Small normal attack.' },
    'norball': { description: 'Medium normal attack.' },
    'norbolt': { description: 'Large normal attack.' },
    'attackup': { description: 'Increase own attack temporarily.' },
    'defenseup': { description: 'Increase own defense temporarily.' },
    'speedup': { description: 'Increase own speed temporarily.' },
    'attackdown': { description: 'Decrease opponent attack temporarily.' },
    'defensedown': { description: 'Decrease opponent defense temporarily.' },
    'speeddown': { description: 'Decrease opponent speed temporarily.' },
}

export const generationMap: any = {
    'darkwater': 'fire',
    'darklight': 'normal',
    'darknormal': 'normal',
    'darkgrass': 'water',
    'darkfire': 'grass',
    'firewater': 'dark',
    'firegrass': 'light',
    'firelight': 'water',
    'firenormal': 'normal',
    'grasswater': 'normal',
    'grasslight': 'fire',
    'grassnormal': 'normal',
    'lightwater': 'grass',
    'lightnormal': 'normal',
    'normalwater': 'normal'
}

export const elementMap: any = {
    'fire': 'water',
    'water': 'grass',
    'grass': 'fire',
    'light': 'dark',
    'dark': 'light',
    'normal': 'normal'
}

export const offspringMap: any = {
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