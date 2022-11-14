function generateMap() {
    for(i=0; i<h*w; i++) {
        let col = i%w;
        let row = Math.floor(i/h) % h 
        if(map[row] == null) {
            map.push([]);
        }
        let newCell = new MapCell(row, col, false, "none", 21, [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]);
        map[row].push(newCell);
    }
}

// wave function collapse that generates map based on tile edges
function collapse() {
    // variable of sorted mapcells
    let mapSort = [];

    // generates the map cells for the copied array
    for(i=0;i<h*w;i++) {
        let col = i%w;
        let row = Math.floor(i/h) % h;
        let cell = map[row][col];
        if (cell.collapse == true) {
            continue;
        }
        let obj = {'row' : row, 'col' : col, 'available' : cell.available}
        mapSort.push(obj);
    }
    // sorts the array
    mapSort.sort((a, b) => (a.available > b.available) ? 1 : -1)
    // gets the smallest number of available cells and finds the first index that is higher than that.
    let min = mapSort[0].available;
    let higherIndex = mapSort.findIndex(num => {return num.available > min;});

    // if all the indexes arent the same create a subarray of the smallest indexes
    if (higherIndex != -1) {
        mapSort = mapSort.slice(0, higherIndex);
    }


    let rnd = Math.floor(Math.random() * mapSort.length)
    let row = mapSort[rnd]["row"];
    let col = mapSort[rnd]["col"];
    let available = map[row][col].available;
    let rndTile = Math.floor(Math.random() * available);
    let chosenTile = map[row][col].options[rndTile];

    // only generates blank tiles when necessary
    if(available > 1 && chosenTile == 0) {
        while(chosenTile == 0) {
            rndTile = Math.floor(Math.random() * available);
            chosenTile = map[row][col].options[rndTile];
        }
    }
    

    map[row][col].collapse = true;
    map[row][col].value = tiles[chosenTile].name;
    // debug to show map with images
    // document.getElementById(row.toString() + col).style.backgroundImage = "url('Img/" + tiles[chosenTile].name + ".png')";
    tiles[chosenTile].analyze(tiles);
    // up
    if(row != 0) {
        let up = map[row-1][col];
        let newOptions = [];
        for(i=0;i<up.options.length;i++) {
            if (tiles[chosenTile].up.includes(up.options[i])) {
                newOptions.push(up.options[i]);
            }
        }
        up.options = newOptions;
        up.available = newOptions.length;
        // document.getElementById((row-1) + col.toString()).style.backgroundColor = "green";
    }
    // right
    if(col != w-1) {
        let right = map[row][col+1];
        let newOptions = [];
        for(i=0;i<right.options.length;i++) {
            if (tiles[chosenTile].right.includes(right.options[i])) {
                newOptions.push(right.options[i]);
            }
        }
        right.options = newOptions;
        right.available = newOptions.length;
        // document.getElementById(row+(col+1).toString()).style.backgroundColor = "yellow";
    }
    // down
    if(row != h-1) {
        let down = map[row+1][col];
        let newOptions = [];
        for(i=0;i<down.options.length;i++) {
            if (tiles[chosenTile].down.includes(down.options[i])) {
                newOptions.push(down.options[i]);
            }
        }
        down.options = newOptions;
        // down.options = tiles[rndTile].down;
        down.available = newOptions.length;
        // document.getElementById((row+1) + col.toString()).style.backgroundColor = "red";
    }
    // left
    if((col != 0)) {
        let left = map[row][col-1];
        let newOptions = [];
        for(i=0;i<left.options.length;i++) {
            if (tiles[chosenTile].left.includes(left.options[i])) {
                newOptions.push(left.options[i]);
            }
        }
        left.options = newOptions;
        // left.options = tiles[rndTile].left;
        left.available = newOptions.length;
        // document.getElementById(row + (col-1).toString()).style.backgroundColor = "blue";
    }
}

function createUsableMap() {
    let row1 = [];
    let row2 = [];
    let row3 = [];

    for(i=0;i<h*w;i++) {
        let col = i%w;
        let row = Math.floor(i/h) % h;
        let newRow = i % map.length;
        let cell = map[row][col].value;

        cell = tiles.find(val => {return val.name == cell});
        cell.fill[0].forEach(val => {row1.push(val)});
        cell.fill[1].forEach(val => {row2.push(val)});
        cell.fill[2].forEach(val => {row3.push(val)});
        if(newRow == (map.length - 1)) {
            fullMap.push(row1);
            fullMap.push(row2);
            fullMap.push(row3);
            row1 = [];
            row2 = [];
            row3 = [];
        }
    }
}

function generateTable(map, container) {
    let h = map.length;
    let w = map[0].length;
    let row;
    let col;
    let table = document.createElement("table");
    for(let i=0; i < h; i++) {
        let tr = document.createElement("tr");
        for(let j=0; j < w; j++) {
            if(i < 10) {
                row = `0${i}`;
            }
            else {
                row = i;
            }
            if(j < 10) {
                col = `0${j}`;
            }
            else {
                col = j;
            }
            let td = document.createElement("td");
            td.setAttribute('id', `c${row}${col}`);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    document.getElementById(container).appendChild(table);
}

function fillMap(map, container) {
    let h = map.length;
    let w = map[0].length;
    for(i=0;i<h*w;i++) {
        let col = i%w;
        let row = Math.floor(i/w) % h;
        let cell = map[row][col];
        if(row < 10) {
            row = `0${row}`;
        }
        if(col < 10) {
            col = `0${col}`;
        }
        let tableCell = document.querySelector(`#${container} > table > tr > #c${row}${col}`);
        if(tableCell.firstChild !=null) {
            tableCell.removeChild(tableCell.firstChild);
        }

        if(cell.map == '0' || cell == -1) {
            tableCell.style.backgroundImage = `url('Img/Wall.png')`;
        }
        else if(cell.map == '1') {
            tableCell.style.backgroundImage = `url('Img/Floor.png')`;
        }
        else if(cell.map == '2') {
            tableCell.style.backgroundImage = `url('Img/Stairs_up.png')`;
        }
        else if(cell.map == '3') {
            tableCell.style.backgroundImage = `url('Img/Stairs_down.png')`;
        }

        if(cell.entity == 'p') {
            let img = document.createElement('img');
            img.setAttribute('src', "Img/Tengu.gif");
            tableCell.appendChild(img);
        }
        else if(cell.entity == 'e') {
            let img = document.createElement('img');
            img.setAttribute('src', "Img/rat.gif");
            tableCell.appendChild(img);
        }
        else if(cell.entity == 't') {
            let img = document.createElement('img');
            img.setAttribute('src', "Img/chest_closed.png");
            tableCell.appendChild(img);
        }
        else if(cell.entity == 'to') {
            let img = document.createElement('img');
            img.setAttribute('src', "Img/chest_open.png");
            tableCell.appendChild(img);
        }
    }
}

function objectify(map) {
    let h = map.length;
    let w = map[0].length;
    for(i=0;i<h*w;i++) {
        let col = i%w;
        let row = Math.floor(i/h) % h;
        let cell = map[row][col];
        map[row][col] = {entity: "", map: cell};
    }
}