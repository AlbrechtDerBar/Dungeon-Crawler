
onload = function() {
    createPlayerItemTable();
    createShopItemTable();
    document.getElementById("player-inv-gold").innerText = player.gold;
    document.getElementById("shop-inv-gold").innerText = 1000;
}

function createPlayerItemTable() {
    for(let i = 0; i < player.inventory.weapons.length; i++) {
        let item = player.inventory.weapons[i];
        // console.log(item);
        createItemNode(item);
    }
    for(let i = 0; i < player.inventory.armor.length; i++) {
        let item = player.inventory.armor[i];
        // console.log(item);
        createItemNode(item);
    }
}

function createShopItemTable() {
    for(let i = 0; i < Math.floor(player.level/3) + 1; i++) {
        createShopItem();
    }
}

function createItemNode(item) {
    let attr;
    let attrVal;
    if(item.def == null) {
        attr = "Atk";
        attrVal = item.atk;
    }
    else {
        attr = "Def";
        attrVal = item.def;
    }

    let table = document.getElementById("player-inventory");
    let num = table.getAttribute('num');
    num = parseInt(num);
    let tr = document.createElement('tr');
    let name = document.createElement('td');
    let info = document.createElement('span');
    let buttonRow = document.createElement('td');
    let button = document.createElement('button');

    tr.className = "player-inventory";
    tr.setAttribute("item", JSON.stringify(item));
    table.firstElementChild.appendChild(tr);
    tr.appendChild(buttonRow);
    tr.setAttribute('val', item.value);
    buttonRow.appendChild(button);
    button.innerText = "+";
    button.setAttribute('onclick', "addToSell(this)");
    tr.appendChild(name);
    name.innerText = item.name;
    name.className = "item";
    name.appendChild(info);
    info.className = "tooltiptext";
    info.innerText = `+${attrVal} ${attr}, ${item.value}G`;

    table.setAttribute('num', `${num+1}`);
}

function createShopItem() {
    let item = lootGen();
    let attr;
    let attrVal;
    if(item.def == null) {
        attr = "Atk";
        attrVal = item.atk;
    }
    else {
        attr = "Def";
        attrVal = item.def;
    }

    let table = document.getElementById("shop-inventory");
    let num = table.getAttribute('num');
    num = parseInt(num);
    let tr = document.createElement('tr');
    let name = document.createElement('td');
    let info = document.createElement('span');
    let buttonRow = document.createElement('td');
    let button = document.createElement('button');

    tr.className = "shop-inventory";
    tr.setAttribute("item", JSON.stringify(item));
    table.firstElementChild.appendChild(tr);
    tr.appendChild(buttonRow);
    tr.setAttribute('val', item.value);
    buttonRow.appendChild(button);
    button.innerText = "+";
    button.setAttribute('onclick', "addToBuy(this)");
    tr.appendChild(name);
    name.innerText = item.name;
    name.className = "item";
    name.appendChild(info);
    info.className = "tooltiptext";
    info.innerText = `+${attrVal} ${attr}, ${item.value}G`;

    table.setAttribute('num', `${num+1}`);
}

function addToSell(item) {
    let node = item.parentElement.parentElement;
    let tmpNode = node.cloneNode(true);
    tmpNode.className = "player-sell-inventory";
    let button = tmpNode.firstChild.firstChild;
    button.innerText = "-";
    button.setAttribute('onclick', "removeFromSell(this)");
    document.getElementById("player-sell-inventory").firstElementChild.appendChild(tmpNode);
    node.remove();
    let playerGold = document.getElementById("player-gold");
    let currVal = parseInt(playerGold.innerText);
    playerGold.innerText = currVal + parseInt(node.getAttribute('val'));

    let transaction = document.getElementById("shop-gold");
    let currTransaction = parseInt(transaction.innerText);
    transaction.innerText = currTransaction - parseInt(node.getAttribute('val'));
}

function removeFromSell(item) {
    let node = item.parentElement.parentElement;
    let tmpNode = node.cloneNode(true);
    tmpNode.className = "player-inventory";
    let button = tmpNode.firstChild.firstChild;
    button.innerText = "+";
    button.setAttribute('onclick', "addToSell(this)");
    document.getElementById("player-inventory").firstElementChild.appendChild(tmpNode);
    node.remove();

    let playerGold = document.getElementById("player-gold");
    let currVal = parseInt(playerGold.innerText);
    playerGold.innerText = currVal - parseInt(node.getAttribute('val'));

    let transaction = document.getElementById("shop-gold");
    let currTransaction = parseInt(transaction.innerText);
    transaction.innerText = currTransaction + parseInt(node.getAttribute('val'));
}


function addToBuy(item) {
    let node = item.parentElement.parentElement;
    let tmpNode = node.cloneNode(true);
    tmpNode.className = "shop-sell-inventory";
    let button = tmpNode.firstChild.firstChild;
    button.innerText = "-";
    button.setAttribute('onclick', "removeFromBuy(this)");
    document.getElementById("shop-sell-inventory").firstElementChild.appendChild(tmpNode);
    node.remove();

    let playerGold = document.getElementById("shop-gold");
    let currVal = parseInt(playerGold.innerText);
    playerGold.innerText = currVal + parseInt(node.getAttribute('val'));

    let transaction = document.getElementById("player-gold");
    let currTransaction = parseInt(transaction.innerText);
    transaction.innerText = currTransaction - parseInt(node.getAttribute('val'));
}

function removeFromBuy(item) {
    let node = item.parentElement.parentElement;
    let tmpNode = node.cloneNode(true);
    tmpNode.className = "shop-inventory";
    let button = tmpNode.firstChild.firstChild;
    button.innerText = "+";
    button.setAttribute('onclick', "addToBuy(this)");
    document.getElementById("shop-inventory").firstElementChild.appendChild(tmpNode);
    node.remove();

    let playerGold = document.getElementById("shop-gold");
    let currVal = parseInt(playerGold.innerText);
    playerGold.innerText = currVal - parseInt(node.getAttribute('val'));

    let transaction = document.getElementById("player-gold");
    let currTransaction = parseInt(transaction.innerText);
    transaction.innerText = currTransaction + parseInt(node.getAttribute('val'));
}

function sell() {
    let playerGold = document.getElementById("player-gold");
    let shopGold = document.getElementById("shop-gold");
    let playerInvGold = document.getElementById("player-inv-gold");
    let shopInvGold = document.getElementById("shop-inv-gold");
    let playerCanPay = (parseInt(playerGold.innerText) + parseInt(playerInvGold.innerText)) >= 0;
    let shopCanPay = (parseInt(shopGold.innerText) + parseInt(shopInvGold.innerText)) >= 0;
    if(shopCanPay && playerCanPay) {
        transferItems();
    }
    else {
        if(shopCanPay) {
            alert("You dont have enough gold for this transaction")
        }
        else {
            alert("The shop doesn't have enough gold for this transaction")
        }
    }
}

function transferItems() {
    let playerSell = document.querySelectorAll(".player-sell-inventory");
    let shopSell = document.querySelectorAll(".shop-sell-inventory");
    for(i = 0; i < playerSell.length; i++) {
        let node = playerSell[i];
        let tmpNode = node.cloneNode(true);
        tmpNode.className = "shop-inventory"
        let button = tmpNode.firstChild.firstChild;
        button.innerText = "+";
        button.setAttribute('onclick', "addToBuy(this)");
        document.getElementById("shop-inventory").firstElementChild.appendChild(tmpNode);
        node.remove();
    }
    for(i = 0; i < shopSell.length; i++) {
        let node = shopSell[i];
        let tmpNode = node.cloneNode(true);
        tmpNode.className = "player-inventory";
        let button = tmpNode.firstChild.firstChild;
        button.innerText = "+";
        button.setAttribute('onclick', "addToSell(this)");
        document.getElementById("player-inventory").firstElementChild.appendChild(tmpNode);
        node.remove();
        let item = JSON.parse(tmpNode.getAttribute('item'));
        if(item.type == "weapon") {
            player.inventory.weapons.push(item);
        }
        else {
            player.inventory.armor.push(item);
        }
    }

    let playerInvGold = document.getElementById("player-inv-gold");
    let playerGold = document.getElementById("player-gold");
    playerInvGold.innerText = parseInt(playerInvGold.innerText) + parseInt(playerGold.innerText);
    playerGold.innerText = "0";
    player.gold =parseInt(playerInvGold.innerText);

    let shopInvGold = document.getElementById("shop-inv-gold");
    let shopGold = document.getElementById("shop-gold");
    shopInvGold.innerText = parseInt(shopInvGold.innerText) + parseInt(shopGold.innerText);
    shopGold.innerText = "0";

    savePlayer();
}