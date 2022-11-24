if(localStorage.getItem('player') == null) {
    localStorage.setItem("player", JSON.stringify(new Player("Hero", 1, playerinv.weapons[1], playerinv.armor[1], [])));
}
let player = Object.assign(new Player, JSON.parse(localStorage.getItem("player")))

function savePlayer() {
    // Manual Player obj download
    // let a = document.getElementById("saveButton");
    // let file = new Blob([JSON.stringify(player)], {type: 'text/JSON'});
    // a.href = URL.createObjectURL(file);
    // a.download = "player.JSON";
    // a.click();
    localStorage.player = JSON.stringify(player);
}

// function getFile() {
//     let load = document.getElementById("loadButton");
//     load.click();
// }

function loadPlayer() {
    // let fr = new FileReader();
    // let file = evt.files[0];
    // fr.readAsText(file);
    // fr.onload = function(e) {
    //     player = JSON.parse(e.target.result);
    // }
    // fr.error = function() {
    //     console.log("there was an error processing your file.");
    // }
    player = Object.assign(new Player, JSON.parse(localStorage.getItem("player")));
}

function deletePlayer() {
    localStorage.setItem("player", JSON.stringify(new Player("Hero", 1, playerinv.weapons[1], playerinv.armor[1], [])));
    player = Object.assign(new Player, JSON.parse(localStorage.getItem("player")));
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

function home() {
    savePlayer();
    let a = document.createElement('a');
    a.setAttribute('href', "index.html");
    document.body.appendChild(a);
    a.click();
}