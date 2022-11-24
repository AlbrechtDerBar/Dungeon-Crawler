onload = function() {
    loadListeners();
}
let item;

function loadListeners() {
    let bets = document.querySelectorAll('.bet');
    for(let i = 0; i < bets.length; i++) {
        bets[i].addEventListener('click', placeBet);
    }
}

function placeBet() {
    let self = this;
    if(self.firstElementChild == null) {
        console.log("test")
        if(self.classList.contains('left')) {
        console.log("test1")
            let chip = document.createElement('div');
            let spacer = document.createElement('div');
            let middle = document.createElement('div');
            chip.className = "chipL";
            middle.className = "chipM";
            self.appendChild(chip);
            chip.appendChild(spacer);
            spacer.appendChild(middle);
        }
        else {
        console.log("test2")
            let chip = document.createElement('div');
            let spacer = document.createElement('div');
            let middle = document.createElement('div');
            chip.className = "chipR";
            middle.className = "chipM";
            self.appendChild(chip);
            chip.appendChild(spacer);
            spacer.appendChild(middle);
        }
    }
    else {
        self.removeChild(self.firstElementChild);
    }
}