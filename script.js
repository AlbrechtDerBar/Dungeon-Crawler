var floor = 0;
var map = [];
var fullMap = [];
var renderedMap = [];
var exit;
var validSpawn;
var spawned = true;
var spawn;
var charPos = {row:-1, col:-1};
var h = 5;
var w = 5;
var rH = 4;
var rW = 3;
var held = false;
var tmpEntity;
var player = new Player("Hero", 1, playerinv.weapons[1], playerinv.armor[1], []);
var battleXp = 0;


onload = function() {
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
    let container;
    let inv;
    let stat;
    if(type == 0) {
        itemArr = weaponTypes;
        container = "weapons";
        type = "weapon";
        inv = player.inventory.weapons;
    }
    else {
        itemArr = armorTypes;
        container = "armor";
        type = "armor";
        inv = player.inventory.armor;
    }
    let item = createItem(itemArr);
    if(type == "weapon") {
        stat = item.atk
    }
    else {
        stat = item.def;
    }
    inv.push(item);
    let row = document.querySelector(`#${container} > form`);
    let itemNum = row.getAttribute('num') 
    itemNum = parseInt(itemNum) + 1;
    row.setAttribute('num', itemNum);
    let input = document.createElement('input');
    let label = document.createElement('label');
    let br = document.createElement('br');

    input.type = "radio";
    input.id = `${type}${itemNum}`;
    input.name = `${type}`;
    input.value = `${itemNum}`;
    input.setAttribute('onchange', "equip(this)");
    label.setAttribute('for', `${type}${itemNum}`);
    label.innerText = `${item.name} +${stat}`;
    row.appendChild(input);
    row.appendChild(label);
    row.appendChild(br);
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

function savePlayer() {
    let a = document.getElementById("saveButton");
    let file = new Blob([JSON.stringify(player)], {type: 'text/JSON'});
    a.href = URL.createObjectURL(file);
    a.download = "player.JSON";
    a.click();
}

function getFile() {
    let load = document.getElementById("loadButton");
    load.click();
}

function loadPlayer(evt) {
    let fr = new FileReader();
    let file = evt.files[0];
    fr.readAsText(file);
    fr.onload = function(e) {
        player = JSON.parse(e.target.result);
    }
    fr.error = function() {
        console.log("there was an error processing your file.");
    }
}

// takes the id of the only div that should be shown and hides all other divs
function focusDiv(id) {
    document.getElementById(id).style.display = "";
    let divs = document.querySelectorAll('.main');
    for(i = 0; i < divs.length; i++) {
        if(divs[i].id != id) {
            divs[i].style.display = "none";
        }
    }
}