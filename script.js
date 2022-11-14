var player = new Player("Hero", 1, playerinv.weapons[1], playerinv.armor[1], []);

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