let floor = 0;
let map = [];
let fullMap = [];
let renderedMap = [];
let exit;
let validSpawn;
let spawned = true;
let spawn;
let charPos = {row:-1, col:-1};
let h = 5;
let w = 5;
let rH = 4;
let rW = 3;
let held = false;
let tmpEntity;
let battleXp = 0;
let battleGold = 0;

onload = function() {
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
        // true for mobile device
        this.document.getElementById("mobileControls").style.display = "";
    }
    else{
    // false for not mobile device
    }
    newFloor();
}

function spawnPlayer() {
    validSpawn = [];
    let h = fullMap.length;
    let w = fullMap[0].length;
    for(i=0;i<h*w;i++) {
        let col = i%w;
        let row = Math.floor(i/h) % h;
        let cell = fullMap[row][col];

        if(cell.map == 1) {
            validSpawn.push({'row': row, 'col': col});
        }
    }

    spawn = Math.floor(Math.random() * validSpawn.length);
    spawn = validSpawn[spawn];
    validSpawn.splice(spawn, 1);
    fullMap[spawn.row][spawn.col].entity = "p";
    fullMap[spawn.row][spawn.col].map = 2;
    charPos = {row: spawn.row, col: spawn.col};
}

function createRenderMap(h, w) {
    renderedMap = [];
    let height = h*2+1;
    let width = w*2+1;
    let tmpArr =[];

    for(let i = 0; i < (height*width); i++) {
        let curCol = i%height;
        let curRow = Math.floor(i/height) % height;
        let addR = curRow - w;
        let addC = curCol - h;
        let row = charPos.row + addR;
        let col = charPos.col + addC;
        
        let newRow = i % height;
        if((row < 0 || row >= fullMap.length) || (col < 0 || col >= fullMap[0].length)) {
            tmpArr.push(-1);
        }
        else {
            tmpArr.push(fullMap[row][col]);
        }
        if(newRow == height - 1) {
            renderedMap.push(tmpArr);
            tmpArr = [];
        }
    }
}

function newFloor() {
    floor += 1;
    map = [];
    fullMap = [];
    renderedMap = [];
    spawn;
    charPos = {row:-1, col:-1};
    let table = document.getElementById("table-container");
    table.removeChild(table.firstChild);
    table = document.getElementById("renderedMap");
    table.removeChild(table.firstChild);
    generateMap();
    for(let i=0; i<h*w; i++) {
        collapse();
    }
    createUsableMap();
    objectify(fullMap);
    spawnPlayer();
    spawnEnemy();
    spawnTreasure();
    spawnExit();
    createRenderMap(rH, rW);
    generateTable(fullMap, "table-container");
    generateTable(renderedMap, "renderedMap");
    fillMap(fullMap, "table-container");
    fillMap(renderedMap, "renderedMap");
}

function spawnExit() {
    let rnd = Math.floor(Math.random() * validSpawn.length);
    exit = validSpawn[rnd];
    validSpawn.splice(rnd, 1);
    fullMap[exit.row][exit.col].map = 3;
}

function reachedExit() {
    if(exit.row == charPos.row && exit.col == charPos.col) {
        return true;
    }
    else {
        return false;
    }
}

function onSpawn() {
    if(spawn.row == charPos.row && spawn.col == charPos.col) {
        return true;
    }
    else {
        return false;
    }
}

function spawnEnemy() {
    let enemyNum = Math.floor(validSpawn.length/50);
    for(let i = 0; i < enemyNum; i++) {
        let rnd = Math.floor(Math.random() * validSpawn.length);
        let spawn = validSpawn[rnd];
        validSpawn.splice(rnd, 1);
        let row = spawn.row
        let col = spawn.col
        fullMap[row][col].entity = 'e';
    }
}

function spawnTreasure() {
    let enemyNum = Math.floor(validSpawn.length/50);
    for(let i = 0; i < enemyNum; i++) {
        let rnd = Math.floor(Math.random() * validSpawn.length);
        let spawn = validSpawn[rnd];
        validSpawn.splice(rnd, 1);
        let row = spawn.row
        let col = spawn.col
        fullMap[row][col].entity = 't';
    }
}

function openChest(row, col) {
    addLoot();
    fullMap[row][col].entity = 'to';
    fillMap(fullMap, "table-container");
    fillMap(renderedMap, "renderedMap");
}

function battle(row, col) {
    controlType = 1;
    optionList = document.querySelector("#actionOptions");
    currentSelection = optionList.firstElementChild;
    fullMap[row][col].entity = '';
    fillMap(fullMap, "table-container");
    fillMap(renderedMap, "renderedMap");

    focusDiv("battle");
    // document.getElementById("renderedMap").style.display = "none";
    // document.getElementById("battle").style.display = "block";

    let icon = document.createElement('img');
    icon.src = "Img/Tengu.gif";
    document.getElementById("hero0p").appendChild(icon);
    document.getElementById("hero0i").style.backgroundColor = "lightgray";
    let heroInfo = document.getElementById("hero0i");
    heroInfo.querySelector(".name").innerText = "hero";
    heroInfo.querySelector(".level").innerText = `lvl.${player.level}`;
    heroInfo.querySelector(".health").style.background = `linear-gradient(to right, green ${player.currHealth/player.maxHealth*100}%, red 0%)`;
    console.log(player.currHealth/player.maxHealth*100);
    heroInfo.querySelector(".health").innerText = `${player.currHealth}/${player.maxHealth}`;
    generateEnemies();
}

function emptyBattleTable() {
    for(let i = 0; i < 4; i++) {
        let item = document.getElementById(`enemy${i}i`);
        item.style.backgroundColor = "";
        item.querySelector(".name").innerText = "";
        item.querySelector(".level").innerText = "";
        item.querySelector(".health").innerText = ``;
        item.querySelector(".health").style.background = "";
        if(document.getElementById(`enemy${i}p`).firstChild != null) {
            document.getElementById(`enemy${i}p`).removeChild(document.getElementById(`enemy${i}p`).firstChild);
        }
    }
    document.getElementById("hero0p").removeChild(document.getElementById("hero0p").firstChild);
    let heroInfo = document.getElementById("hero0i");
    document.getElementById("hero0i").style.backgroundColor = "";
    heroInfo.querySelector(".name").innerText = "";
    heroInfo.querySelector(".level").innerText = ``;
    heroInfo.querySelector(".health").style.backgroundColor = "";
    heroInfo.querySelector(".health").innerText = ``;

}

function addLoot() {
    let type = Math.floor(Math.random() * 2);
    let itemArr;
    let inv;
    if(type == 0) {
        itemArr = weaponTypes;
        inv = player.inventory.weapons;
    }
    else {
        itemArr = armorTypes;

        inv = player.inventory.armor;
    }
    let item = createItem(itemArr);
    inv.push(item);
}

function generateEnemies() {
    let number = Math.floor(Math.random() * 3) + 1;

    for(let i = 0; i < number; i++) {
        let enemy = new Enemy(enemyNames[0], floor, "none");
        enemies.push(enemy);

        let item = document.getElementById(`enemy${i}i`);
        item.style.backgroundColor = "lightgray";
        item.querySelector(".name").innerText = enemy.name;
        item.querySelector(".level").innerText = `lvl.${enemy.level}`;
        item.querySelector(".health").innerText = `${enemy.currHealth}/${enemy.maxHealth}`;
        item.querySelector(".health").style.background = "green";
        let img = document.createElement('img');
        img.src = "./Img/rat.gif";
        document.getElementById(`enemy${i}p`).appendChild(img);
    }
}

function equip(elem) {
    let type = elem.name;
    let index = elem.value;
    if(type == "weapon") {
        player.eqWeapon = player.inventory.weapons[index];
    }
    else {
        player.eqArmor = player.inventory.armor[index];
    }
}

function loadInventory() {
    for(i = 0; i < player.inventory.weapons.length; i++) {
        let row = document.querySelector(`#weapons > form`);
        let itemNum = row.getAttribute('num');
        let input = document.createElement('input');
        let label = document.createElement('label');
        let br = document.createElement('br');

        input.type = "radio";
        input.id = `weapon${itemNum}`;
        input.name = `weapon`;
        input.value = `${itemNum}`;
        input.setAttribute('onchange', "equip(this)");
        label.setAttribute('for', `weapon${itemNum}`);
        label.innerText = `${player.inventory.weapons[i].name} +${player.inventory.weapons[i].atk}`;
        row.appendChild(input);
        row.appendChild(label);
        row.appendChild(br);
        if(JSON.stringify(player.inventory.weapons[i]) == JSON.stringify(player.eqWeapon)) {
            input.checked = true;
        }
        itemNum = parseInt(itemNum) + 1;
        row.setAttribute('num', itemNum);
    }
    for(i = 0; i < player.inventory.armor.length; i++) {
        let row = document.querySelector(`#armor > form`);
        let itemNum = row.getAttribute('num') 
        let input = document.createElement('input');
        let label = document.createElement('label');
        let br = document.createElement('br');

        input.type = "radio";
        input.id = `armor${itemNum}`;
        input.name = `armor`;
        input.value = `${itemNum}`;
        input.setAttribute('onchange', "equip(this)");
        label.setAttribute('for', `armor${itemNum}`);
        label.innerText = `${player.inventory.armor[i].name} +${player.inventory.armor[i].def}`;
        row.appendChild(input);
        row.appendChild(label);
        row.appendChild(br);
        if(JSON.stringify(player.inventory.armor[i]) == JSON.stringify(player.eqArmor)) {
            input.checked = true;
        }
        itemNum = parseInt(itemNum) + 1;
        row.setAttribute('num', itemNum);
    }
}

function unloadInventory() {
    let forms = document.querySelectorAll('form');
    for(let i = 0; i < forms.length; i++) {
        forms[i].setAttribute('num', "0");
        forms[i].innerHTML = "";
    }
}