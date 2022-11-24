onload = function() {
    loadListeners();
    document.getElementById("gold").innerText = player.gold;
}
let playerBets = [];
let winningBets = [];

function loadListeners() {
    let bets = document.querySelectorAll('.bet');
    for(let i = 0; i < bets.length; i++) {
        bets[i].addEventListener('click', placeBet);
    }
}

function bet() {
    let bet = document.getElementById("bet").value
    if(playerBets == "" || bet < 1 || bet > player.gold) {
        alert("please place a valid bet");
    }
    else {
        getWinningBets();
        calculateGold();
    }
}

function placeBet() {
    let self = this;
    if(self.firstElementChild == null) {
        if(self.classList.contains('left')) {
            let chip = document.createElement('div');
            let spacer = document.createElement('div');
            let middle = document.createElement('div');
            chip.className = "chipL";
            middle.className = "chipM";
            self.appendChild(chip);
            chip.appendChild(spacer);
            spacer.appendChild(middle);
            playerBets.push(self.id);
        }
        else {
            let chip = document.createElement('div');
            let spacer = document.createElement('div');
            let middle = document.createElement('div');
            chip.className = "chipR";
            middle.className = "chipM";
            self.appendChild(chip);
            chip.appendChild(spacer);
            spacer.appendChild(middle);
            playerBets.push(self.id);
        }
    }
    else {
        self.removeChild(self.firstElementChild);
        let index = playerBets.indexOf(self.id);
        if (index > -1) { 
            playerBets.splice(index, 1); 
        }
    }
}

function clearBets() {
    let bets = document.querySelectorAll('.bet');
    for(let i = 0; i < bets.length; i++) {
        if(bets[i].firstElementChild) {
            bets[i].removeChild(bets[i].firstElementChild);
        }
    }
    document.getElementById("bet").value = "";
}

// inner bets
function winningNumber() {
    let num = Math.floor(Math.random(12345) * 38);
    if(num == 37) {
        return "00";
    }
    else {
        return num.toString();
    }
}

function columnNum(num) {
    num = parseInt(num);
    let column;
    switch(num % 3) {
        case 1:
            column = "c1";
        break;
        case 2:
            column = "c2";
        break;
        case 0:
            column = "c3";
        break;
    }
    return column;
}

// outer bet functions
function isEven(num) {
    num = parseInt(num);
    if(num % 2 == 0) {
        return "even";
    }
    else {
        return "odd";
    }
}

function get12(num) {
    num = parseInt(num);
    let bet;
    switch(true) {
        case num/12 <= 1:
            bet = "P12";
        break
        case num/24 <= 1:
            bet = "M12";
        break
        default:
            bet = "D12";
        break
    }
    return bet
}

function highLow(num) {
    num = parseInt(num);
    if(num < 19) {
        return "low";
    }
    else {
        return "high";
    }
}

function redBlack(num) {
    let color;
    num = parseInt(num);
    switch(true) {
        case 2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35:
            color = "black";
        break;
        default:
            color = "red";
        break;
    }
    return color;
}

// get all bets
function getWinningBets() {
    let num = winningNumber();
    winningBets.push(num);
    winningBets.push(columnNum(num));
    winningBets.push(isEven(num));
    winningBets.push(get12(num));
    winningBets.push(highLow(num));
    winningBets.push(redBlack(num));
}

function calculateGold() {
    let bet = document.getElementById("bet").value;
    let total = 0;
    for(let i = 0; i < playerBets.length; i++) {
        if(winningBets.includes(playerBets[i])) {
            total += bet*getOdds(playerBets[i]);
        }
        else {
            total -= bet*getOdds(playerBets[i]);
        }
    }
    winningBets = [];
    addGold(total);
}

function getOdds(bet) {
    let odds;
    switch(bet) {
        case "low", "high", "even", "odd", "black", "red":
            odds = 1;
        break;
        case "P12", "M12", "D12", "c1", "c2", "c3":
            odds = 2;
        break;
        default:
            odds = 35;
        break;
    }
    return odds;
}

function addGold(gold) {
    alert(`You won ${gold}G`);
    player.gold += gold;
    document.getElementById("gold").innerText = player.gold;
    savePlayer();
}

function minBet() {
    document.getElementById("bet").value = 1;
}

function maxBet() {
    document.getElementById("bet").value = player.gold;
}

function showDiv(node) {
    let value = node.getAttribute('value');
    let games = document.querySelectorAll('.game-container');
    for(let i = 0; i < games.length; i++) {
        if(games[i].id == value) {
            games[i].style.display = "";
        }
        else {
            games[i].style.display = "none";
        }
    }
}