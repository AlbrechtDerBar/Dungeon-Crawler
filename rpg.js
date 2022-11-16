class Player {
    constructor(name, level, eqWeapon, eqArmor, spellList) {
        this.name = name;
        this.level = level;
        this.maxHealth = 14 + this.level;
        this.currHealth = this.maxHealth;
        this.atk = 4 + this.level;
        this.def = 0 + this.level;
        this.currXp = 0;
        this.nextLevel = (this.level/0.08)^2;
        this.eqArmor = eqArmor;
        this.eqWeapon = eqWeapon;
        this.spellList = spellList;
        this.inventory = playerinv;
        this.gold = 0;
    }

    lowerHealth(dmg) {
        let totaldef = this.def + this.eqArmor.def;
        dmg = dmg - totaldef;
        if (dmg < 1) {
            dmg = 1;
        }
        if(this.eqArmor.def == 99999) {
            dmg = 0;
        }
        this.currHealth -= dmg;
        if (this.currHealth < 0) {
            this.currHealth = 0;
        }
    }

    addXp(totalXp) {
        this.currXp += totalXp;
        if(this.currXp >= this.nextLevel) {
            this.currXp -= this.nextLevel;
            this.levelUp();
        }
    }

    levelUp() {
        player = new Player(this.name, this.level+1, this.eqWeapon, this.eqArmor, this.spellList);
        player.currXp = this.currXp;
    }
}

class Enemy {
    constructor(name, level, element) {
        this.name = name;
        this.level = level;
        this.maxHealth = 9 + this.level;
        this.currHealth = this.maxHealth;
        this.atk = 0 + this.level;
        this.def = 0 + this.level;
        this.xp = 5 * this.level;
        this.element = element;
        this.resistance = element;
    }

    lowerHealth(dmg) {
        let totaldef = this.def;
        dmg = dmg - totaldef;
        if (dmg < 1) {
            dmg = 1;
        }
        this.currHealth -= dmg;
        if (this.currHealth < 0) {
            this.currHealth = 0;
        }
    }
}

class Weapon {
    constructor(name, element, atk) {
        this.name = name;
        this.element = element;
        this.atk = atk;
        this.value = 5 * this.atk + 5;
        this.type = "weapon";
    }
}

class Armor {
    constructor(name, resistance, def) {
        this.name = name;
        this.resistance = resistance;
        this.def = def;
        this.value = 5 * this.def + 5;
        this.type = "armor";
    }
}

class Spell {
    constructor(name, description, element, atk, level) {
        this.name = name;
        this.description = description;
        this.element = element;
        this.atk = atk;
        this.level = level;
    }
}


let spells =[];

let armor =[
    new Armor('Rags', 'none', 0),
    new Armor('Armor of God', 'none', 99999),
];

let weapons =[
    new Weapon('Shiv', 'none', 0),
    new Weapon('Sword of God', 'none', 99999),
];

function randomItemName(itemArr) {
    let name;
    let rItem = Math.floor(Math.random() * itemArr.length);
    rItem = itemArr[rItem];
    let rDescriptor = Math.floor(Math.random() * descriptor.length);
    rDescriptor = descriptor[rDescriptor];
    let rName = Math.floor(Math.random() * names.length);
    rName = names[rName];
    let namingType = Math.floor(Math.random() * 100);
    switch(true) {
        case namingType < 48:
            name = `${rName}s' ${rItem}`;
        break
        case namingType > 47 && namingType < 96:
            name = `${rItem} of ${rName}`;
        break
        case namingType > 95 && namingType < 98:
            name = `${rName}s' ${rItem} of ${rDescriptor}`;
        break
        case namingType > 97:
            name = `${rDescriptor} ${rItem} of ${rName}`;
        break
        default :
            name = "broken";
        break
    }
    return name;
}

function createItem(itemArr) {
    let name, resistance, def, element, atk, item;
    resistance, element = "none";
    if(itemArr == weaponTypes) {
        name = randomItemName(itemArr);
        if (name.includes("Water") || name.includes("Wetness")) {
            element = "water";
        }
        else if (name.includes("Fire") || name.includes("Heat")) {
            element = "fire";
        }
        else if (name.includes("Grass") || name.includes("Grassiness")) {
            element = "grass";
        }
        atk = Math.floor(Math.random() * 3);
        item = new Weapon(name, element, atk);
    }
    else if (itemArr == armorTypes) {
        name = randomItemName(itemArr);
        if (name.includes("Water") || name.includes("Wetness")) {
            resistance = "water";
        }
        else if (name.includes("Fire") || name.includes("Heat")) {
            resistance = "fire";
        }
        else if (name.includes("Grass") || name.includes("Grassiness")) {
            resistance = "grass";
        }
        def = Math.floor(Math.random() * 3);
        item = new Armor(name, resistance, def);
    }
    return item;
}

function lootGen() {
    let rnd = Math.floor(Math.random() * 2);
    let itemArr;
    if(rnd == 0) {
        itemArr = armorTypes;
    }
    else {
        itemArr = weaponTypes;
    }
    let item = createItem(weaponTypes);
    return item;
}

let armorTypes = ["Helm", "Helmet", "Pauldron", "Curiass", "Vambrace", "Gauntlet", "Greaves", "Mail", "Great helm", "Sallet", "Armet", "Bevor", "Gorget", "Brigandine", "Breastplate", "Codpiece"];
let weaponTypes = ["Stick", "Knife", "Club", "Ax", "Sword", "Spear", "Halberd", "Boomerang", "Crossbow", "Bolo", "Grenade", "Spear", "Bow", "Artillery", "Cannon", "Rocket", "Missle", "Torpedo", "Revolver", "Rifle", "Shotgun", "Machine Gun", "Tank", "Airplane", "Landmine", "Longsword", "Shortsword", "Mace", "Dagger", "Bayonet", "Machete", "Hatchet", "Pitchfork", "Sickle", "Scythe", "Khopesh", "Takoba", "Katana", "Odachi", "Kunai", "Tanto", "Wakizashi", "Kalis"];

let descriptor =["Water", "Fire", "Wetness", "Heat", "Grass", "Grassiness"];
let names = ["Misk", "Omettia", "Geia", "Jeralia", "Ovisia", "Kehsi", "Bafon", "Kaian", "Shawth",  "Ayn", "Varant", "Peri", "Nydd", "Leiea", "Orthur", "Novius", "Napari", "Veric", "Astram", "Tasia", "Gwaelon", "Mailia", "Adanrandir", "Clatharla", "Hatharal", "Norodiir", "Reysalor", "Bofa", "Deez"];

let enemyNames = ['Rat'];
let enemies = [];

let playerinv = {
    weapons: [weapons[0], weapons[1]],
    armor: [armor[0], armor[1]],
}
