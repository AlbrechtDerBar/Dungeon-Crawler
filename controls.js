var changingControls = false;
var currId;
let controlType = 0;
let actionSelect = true;
let currentSelection;
let optionList;
var controls = [
    {default: 'ArrowUp', defaultVal: '⇧', current: 'ArrowUp'},
    {default: 'ArrowRight', defaultVal: '⇨', current: 'ArrowRight'},
    {default: 'ArrowDown', defaultVal: '⇩', current: 'ArrowDown'},
    {default: 'ArrowLeft', defaultVal: '⇦', current: 'ArrowLeft'},
    {default: 'KeyM', defaultVal: 'M', current: 'KeyM'},
    {default: 'KeyE', defaultVal: 'E', current: 'KeyE'},
    {default: 'KeyI', defaultVal: 'I', current: 'KeyI'},
]


onkeydown = function (e) {
    if(changingControls == true) {
        newControl(currId, e.code, e.key);
    }
    else {
        if(held != true) {
            controler(e.code);
            held = true;
        }
    }
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}

onkeyup = function(e) {
    held = false;
}

function controler(key) {
    switch(controlType) {
        case 0:
            move(key);
        break
        case 1:
            battleControls(key);
        break
    }
}

function move(key) {
    let row;
    let col;
    let outBounds = false;
    spawned = false;
    switch(key) {
        // options
        case 'Escape':
            let settings = document.getElementById('settings');
            if(settings.style.display == "none") {
                unloadInventory();
                focusDiv("settings");
            }
            else {
                unloadInventory();
                focusDiv("renderedMap")
            }
            outBounds = true;
        break
        // up
        case controls[0].current:
            row = charPos.row;
            col = charPos.col;
            if(row != 0 && fullMap[row - 1][col].map != 0 && fullMap[row - 1][col].entity != 't' && fullMap[row - 1][col].entity != 'e') {
                if(fullMap[row-1][col].entity != '') {
                    tmpEntity = {entity: fullMap[row-1][col].entity, row: row-1, col: col};
                }
                fullMap[row][col].entity = '';
                fullMap[row - 1][col].entity = 'p';
                charPos.row -= 1;
                reachedExit();
            }
            else {
                outBounds = true;
            }

        break
        // right
        case controls[1].current:
            row = charPos.row;
            col = charPos.col;
            if(col != fullMap[0].length-1 && fullMap[row][col + 1].map != 0 && fullMap[row][col + 1].entity != 't' && fullMap[row][col + 1].entity != 'e') {
                if(fullMap[row][col+1].entity != '') {
                    tmpEntity = {entity: fullMap[row][col+1].entity, row: row, col: col+1};
                }
                fullMap[row][col].entity = '';
                fullMap[row][col + 1].entity = 'p';
                charPos.col += 1;
                reachedExit();
            }
            else {
                outBounds = true;
            }
        break
        // down
        case controls[2].current:
            row = charPos.row;
            col = charPos.col;
            if(row != fullMap.length-1 && fullMap[row + 1][col].map != 0 && fullMap[row + 1][col].entity != 't' && fullMap[row + 1][col].entity != 'e') {
                if(fullMap[row+1][col].entity != '') {
                    tmpEntity = {entity: fullMap[row+1][col].entity, row: row+1, col: col};
                }
                fullMap[row][col].entity = '';
                fullMap[row + 1][col].entity = 'p';
                charPos.row += 1;
                reachedExit();
            }
            else {
                outBounds = true;
            }

        break
        // left
        case controls[3].current:
            row = charPos.row;
            col = charPos.col;
            if(col != 0 && fullMap[row][col - 1].map != 0 && fullMap[row][col - 1].entity != 't' && fullMap[row][col - 1].entity != 'e') {
                if(fullMap[row][col-1].entity != '') {
                    tmpEntity = {entity: fullMap[row][col-1].entity, row: row, col: col-1};
                }
                fullMap[row][col].entity = '';
                fullMap[row][col - 1].entity = 'p';
                charPos.col -= 1;
                reachedExit();
            }
            else {
                outBounds = true;
            }

        break
        // map
        case controls[4].current:
            let table = document.getElementById("table-container");
            if(table.style.display == "none") {
                table.style.display = "block";
            }
            else {
                table.style.display = "none";
            }
            outBounds = true;
        break
        // interact
        case controls[5].current:
            interact();
        break
        // inventory
        case controls[6].current:
            inventory();
        break
        default:
            outBounds = true;
        break
    }
    if(outBounds == false) {
            if(tmpEntity != null && (tmpEntity.row != charPos.row || tmpEntity.col != charPos.col)) {
                fullMap[row][col].entity = tmpEntity.entity;
                tmpEntity = null;
            }
        createRenderMap(rH,rW);
        fillMap(renderedMap, "renderedMap");
        fillMap(fullMap, "table-container");
    }

}

function battleControls(key) {
    switch(key) {
        // up arrow
        case controls[0].current:
            if(currentSelection.hasAttribute("index") && currentSelection.getAttribute("index") != "back") {
                document.getElementById(`enemy${currentSelection.getAttribute("index")}p`).style.backgroundColor = "";
            }
            if(currentSelection.previousElementSibling != null) {
                currentSelection.firstElementChild.innerText = "";
                currentSelection = currentSelection.previousElementSibling;
                currentSelection.firstElementChild.innerText = ">";
                if(currentSelection.hasAttribute("index") && currentSelection.getAttribute("index") != "back") {
                    document.getElementById(`enemy${currentSelection.getAttribute("index")}p`).style.backgroundColor = "tomato";
                }
            }
            else {
                currentSelection.firstElementChild.innerText = "";
                currentSelection = optionList.lastElementChild;
                currentSelection.firstElementChild.innerText = ">";
                if(currentSelection.hasAttribute("index") && currentSelection.getAttribute("index") != "back") {
                    document.getElementById(`enemy${currentSelection.getAttribute("index")}p`).style.backgroundColor = "tomato";
                }
            }
        break
        // right
        case controls[1].current:
            if(currentSelection.hasAttribute("index") && currentSelection.getAttribute("index") != "back") {
                document.getElementById(`enemy${currentSelection.getAttribute("index")}p`).style.backgroundColor = "";
            }
            if(currentSelection.nextElementSibling != null) {
                currentSelection.firstElementChild.innerText = "";
                currentSelection = currentSelection.nextElementSibling;
                currentSelection.firstElementChild.innerText = ">";
                if(currentSelection.hasAttribute("index") && currentSelection.getAttribute("index") != "back") {
                    document.getElementById(`enemy${currentSelection.getAttribute("index")}p`).style.backgroundColor = "tomato";
                }
            }
            else {
                currentSelection.firstElementChild.innerText = "";
                currentSelection = optionList.firstElementChild;
                currentSelection.firstElementChild.innerText = ">";
                if(currentSelection.hasAttribute("index") && currentSelection.getAttribute("index") != "back") {
                    document.getElementById(`enemy${currentSelection.getAttribute("index")}p`).style.backgroundColor = "tomato";
                }
            }
        break
        // down
        case controls[2].current:
            if(currentSelection.hasAttribute("index") && currentSelection.getAttribute("index") != "back") {
                document.getElementById(`enemy${currentSelection.getAttribute("index")}p`).style.backgroundColor = "";
            }
            if(currentSelection.nextElementSibling != null) {
                currentSelection.firstElementChild.innerText = "";
                currentSelection = currentSelection.nextElementSibling;
                currentSelection.firstElementChild.innerText = ">";
                if(currentSelection.hasAttribute("index") && currentSelection.getAttribute("index") != "back") {
                    document.getElementById(`enemy${currentSelection.getAttribute("index")}p`).style.backgroundColor = "tomato";
                }
            }
            else {
                currentSelection.firstElementChild.innerText = "";
                currentSelection = optionList.firstElementChild;
                currentSelection.firstElementChild.innerText = ">";
                if(currentSelection.hasAttribute("index") && currentSelection.getAttribute("index") != "back") {
                    document.getElementById(`enemy${currentSelection.getAttribute("index")}p`).style.backgroundColor = "tomato";
                }
            }
        break
        // left
        case controls[3].current:
            if(currentSelection.hasAttribute("index") && currentSelection.getAttribute("index") != "back") {
                document.getElementById(`enemy${currentSelection.getAttribute("index")}p`).style.backgroundColor = "";
            }
            if(currentSelection.previousElementSibling != null) {
                currentSelection.firstElementChild.innerText = "";
                currentSelection = currentSelection.previousElementSibling;
                currentSelection.firstElementChild.innerText = ">";
                if(currentSelection.hasAttribute("index") && currentSelection.getAttribute("index") != "back") {
                    document.getElementById(`enemy${currentSelection.getAttribute("index")}p`).style.backgroundColor = "tomato";
                }
            }
            else {
                currentSelection.firstElementChild.innerText = "";
                currentSelection = optionList.lastElementChild;
                currentSelection.firstElementChild.innerText = ">";
                if(currentSelection.hasAttribute("index") && currentSelection.getAttribute("index") != "back") {
                    document.getElementById(`enemy${currentSelection.getAttribute("index")}p`).style.backgroundColor = "tomato";
                }
            }
        break
        // select
        case controls[5].current:
            if(actionSelect == true) {
                let selected = currentSelection.id;
                switch(true) {
                    case selected == "attack":
                        attackOptionsGen();
                    break
                    case selected == "run":
                        run();
                    break
                    case currentSelection.hasAttribute("index") && currentSelection.getAttribute("index") != "back":
                        attack();
                        for(let i = 0; i < enemies.length; i++) {
                            enemyTurn(enemies[i]);
                        }
                    break
                    case currentSelection.hasAttribute("index") && currentSelection.getAttribute("index") == "back":
                        back();
                    break
                }
            }
            else {

            }
        break
    }
}

function changeControl(id) {
    let button = document.getElementById(id);
    button.innerText = "<unbound>";
    currId = id;
    changingControls = true;
}

function newControl(id, key, val) {
    button = document.getElementById(id);
    switch(id) {
        case 'up':
            controls[0].current = key;
            button.innerText = `<${val[0].toUpperCase()}>`;
        break;
        case 'right':
            controls[1].current = key;
            button.innerText = `<${val[0].toUpperCase()}>`;
        break;
        case 'down':
            controls[2].current = key;
            button.innerText = `<${val[0].toUpperCase()}>`;
        break;
        case 'left':
            controls[3].current = key;
            button.innerText = `<${val[0].toUpperCase()}>`;
        break;
        case 'map':
            controls[4].current = key;
            button.innerText = `<${val[0].toUpperCase()}>`;
        break;
        case 'interact':
            controls[5].current = key;
            button.innerText = `<${val[0].toUpperCase()}>`;
        break;
        case 'inventory':
            controls[6].current = key;
            button.innerText = `<${val[0].toUpperCase()}>`;
        break;
    }
    changingControls = false;
}

function interact() {
    let row = charPos.row;
    let col = charPos.col;
    let n = {entity: '', row: '', col: ''};
    let e = {entity: '', row: '', col: ''};
    let s = {entity: '', row: '', col: ''};
    let w = {entity: '', row: '', col: ''};
    if(row-1 != -1) {
        n = fullMap[row-1][col];
    }
    if(col + 1 != fullMap[0].length) {
        e = fullMap[row][col+1];
    }
    if(col-1 != -1) {
        w = fullMap[row][col-1];
    }
    if(row + 1 != fullMap.length) {
        s = fullMap[row+1][col];
    }
    let cardinalCells = [n, e, s, w];
    let entities = [];
    
        if (cardinalCells[0].entity != '') {
            entities.push({entity: cardinalCells[0].entity, row: charPos.row-1, col: charPos.col});
        }
        if (cardinalCells[1].entity != '') {
            entities.push({entity: cardinalCells[1].entity, row: charPos.row, col: charPos.col+1});
        }
        if (cardinalCells[2].entity != '') {
            entities.push({entity: cardinalCells[2].entity, row: charPos.row+1, col: charPos.col});
        }
        if (cardinalCells[3].entity != '') {
            entities.push({entity: cardinalCells[3].entity, row: charPos.row, col: charPos.col-1});
        }

        if(entities.length > 1) {
            let enemies = entities.filter(e=>{return e.entity == 'e'});
            if(enemies.length == 0) {
                openChest(entities[0].row, entities[0].col);
            }
            else {
                battle(enemies[0].row, enemies[0].col);
            }
        }
        else if(entities.length != 0) {
            if(entities[0].entity == 't') {
                openChest(entities[0].row, entities[0].col)
            }
            else if(entities[0].entity == 'e') {
                battle(entities[0].row, entities[0].col);
            }
        }
        if(entities.length == 0 || entities.some(e => {return e.entity = "to"})) {
            if(reachedExit()) {
                newFloor();
            }
            else if(onSpawn()) {
                window.location = "index.html";
            }
        }
}

function inventory() {
    let inventory = document.getElementById("inventory-div");
    if (inventory.style.display == 'none') {
        loadInventory();
        focusDiv("inventory-div");
    }
    else {
        unloadInventory();
        focusDiv("renderedMap");
    }
    
}

function run() {
    enemies = [];
    controlType = 0;
    focusDiv("renderedMap");
    currentSelection.firstElementChild.innerText = "";
    currentSelection = optionList.firstElementChild;
    currentSelection.firstElementChild.innerText = ">";
    back();
    emptyBattleTable();
}

function attackOptionsGen() {
    // focusDiv("options2");
    document.getElementById("options1").style.display = "none";
    optionList = document.querySelector("#attackOptions");
    document.getElementById("options2").style.display = "block";
    let list = document.getElementById("attackOptions");
    for(let i = 0; i < enemies.length; i++) {
        let li = document.createElement('li');
        let a = document.createElement('a');
        li.innerText = ` ${enemies[0].name}`;
        li.insertBefore(a, li.firstChild);
        li.setAttribute('index', `${enemies.length - (i+1)}`);
        list.appendChild(li);
    }
    let li = document.createElement('li');
    let a = document.createElement('a');
    li.innerText = "Back";
    li.insertBefore(a, li.firstChild);
    li.setAttribute('index', "back");
    list.appendChild(li);
    optionList.style.display = "block";
    currentSelection = optionList.firstElementChild;
    currentSelection.firstElementChild.innerText = ">";
    document.getElementById(`enemy${currentSelection.getAttribute("index")}p`).style.backgroundColor = "tomato";
}

function attack() {
    document.getElementById(`enemy${currentSelection.getAttribute("index")}p`).style.backgroundColor = "";
    let hitEnemy = enemies[parseInt(currentSelection.getAttribute("index"))];
    hitEnemy.lowerHealth(player.atk + player.eqWeapon.atk);
    let heatlhBar = document.querySelector(`#enemy${currentSelection.getAttribute("index")}i > table > tbody > tr > .health`);
    heatlhBar.innerText = `${hitEnemy.currHealth}/${hitEnemy.maxHealth}`;
    let healthLeft = (hitEnemy.currHealth/hitEnemy.maxHealth);
    heatlhBar.style.background = `linear-gradient(to right, green ${healthLeft*100}%, red 0%)`;
    if(hitEnemy.currHealth == 0) {
        battleXp += hitEnemy.xp;
        enemies.splice(parseInt(currentSelection.getAttribute("index")), 1);
        let item = document.getElementById(`enemy${currentSelection.getAttribute("index")}i`);
        item.style.backgroundColor = "";
        item.querySelector(".name").innerText = "";
        item.querySelector(".level").innerText = "";
        item.querySelector(".health").innerText = ``;
        item.querySelector(".health").style.backgroundColor = "";
        item.querySelector(".health").style.background = "";
        if(document.getElementById(`enemy${currentSelection.getAttribute("index")}p`).firstChild != null) {
            document.getElementById(`enemy${currentSelection.getAttribute("index")}p`).removeChild(document.getElementById(`enemy${currentSelection.getAttribute("index")}p`).firstChild);
        }
    }
    // if player wins
    if(enemies.length == 0) {
        controlType = 0;
        player.addXp(battleXp);
        battleXp = 0;
        run();
    }
    else {
        back();
    }
}

function enemyTurn(enemy) {
    player.lowerHealth(enemy.atk);
    let heatlhBar = document.querySelector(`#hero0i > table > tbody > tr > .health`);
    heatlhBar.innerText = `${player.currHealth}/${player.maxHealth}`;
    let healthLeft = (player.currHealth/player.maxHealth);
    heatlhBar.style.background = `linear-gradient(to right, green ${healthLeft*100}%, red 0%)`;
    // if player loses
    if(player.currHealth == 0) {
        player.currHealth = player.maxHealth;
        localStorage.player = player;
        window.location = "index.html";
        // floor = 0;
        // newFloor();
        // run();
        // heatlhBar.style.background = `linear-gradient(to right, green 100%, red 0%)`;
    }
}

function back() {
    document.getElementById("options1").style.display = "block";
    optionList = document.querySelector("#actionOptions");
    document.getElementById("options2").style.display = "none";
    currentSelection = optionList.firstElementChild;
    document.getElementById("attackOptions").innerHTML = "";
}

function showControls() {
    let controlDisplay = document.getElementById("controls");
    let buttons = document.getElementById("settingsButtons");
    if(controlDisplay.style.display == "") {
        controlDisplay.style.display = "none";
        buttons.style.display = "";
    }
    else {
        controlDisplay.style.display = "";
        settingsButtons.style.display = "none";
    }
}