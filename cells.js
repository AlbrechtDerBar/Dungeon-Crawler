class Tile {
    constructor(fill, connection, name, up, right, down, left, index) {
        this.fill = fill;
        this.connection = connection;
        this.name = name;
        this.up = up;
        this.right = right;
        this.down = down;
        this.left = left;
        this.index = index;
    }

    analyze(tiles) {
        for(let tile of tiles) {
            // up
            if(tile.connection[2] == this.connection[0]) {
                this.up.push(tile.index);
            }
            // right
            if(tile.connection[3] == this.connection[1]) {
                this.right.push(tile.index);
            }
            // down
            if(tile.connection[0] == this.connection[2]) {
                this.down.push(tile.index);
            }
            // left
            if(tile.connection[1] == this.connection[3]) {
                this.left.push(tile.index);
            }
        }
    }
}

class MapCell {
    constructor (row, col, collapse, value, available, options) {
        this.row = row;
        this.col = col;
        this.collapse = collapse;
        this.value = value;
        this.available = available;
        this.options = options;
    }
}

const blank = new Tile([[0,0,0],[0,0,0],[0,0,0]], [0, 0, 0, 0], "blnk", [], [], [], [], 0);
const vertical = new Tile([[0,1,0],[0,1,0],[0,1,0]], [1, 0, 1, 0], "vert", [], [], [], [], 1);
const horizontal = new Tile([[0,0,0],[1,1,1],[0,0,0]], [0, 1, 0, 1], "hrzn", [], [], [], [], 2);
const full = new Tile([[1,1,1],[1,1,1],[1,1,1]], [1, 1, 1, 1], "full", [], [], [], [], 3);
const tUp = new Tile([[0,1,0],[1,1,1],[0,0,0]], [1, 1, 0, 1], "tUp", [], [], [], [], 4);
const tRight = new Tile([[0,1,0],[0,1,1],[0,1,0]], [1, 1, 1, 0], "tRight", [], [], [], [], 5);
const tLeft = new Tile([[0,1,0],[1,1,0],[0,1,0]], [1, 0, 1, 1], "tLeft", [], [], [], [], 6);
const tDown = new Tile([[0,0,0],[1,1,1],[0,1,0]], [0, 1, 1, 1], "tDown", [], [], [], [], 7);
const roomUp = new Tile([[0,1,0],[1,1,1],[1,1,1]], [1, 1, 1, 1], "rUp", [], [], [], [], 8);
const roomRight = new Tile([[1,1,0],[1,1,1],[1,1,0]], [1, 1, 1, 1], "rRight", [], [], [], [], 9);
const roomDown = new Tile([[1,1,1],[1,1,1],[0,1,0]], [1, 1, 1, 1], "rDown", [], [], [], [], 10);
const roomLeft = new Tile([[0,1,1],[1,1,1],[0,1,1]], [1, 1, 1, 1], "rLeft", [], [], [], [], 11);
const sw = new Tile([[0,0,0],[1,1,0],[0,1,0]], [0, 0, 1, 1], "sw", [], [], [], [], 12);
const nw = new Tile([[0,1,0],[1,1,0],[0,0,0]], [1, 0, 0, 1], "nw", [], [], [], [], 13);
const ne = new Tile([[0,1,0],[0,1,1],[0,0,0]], [1, 1, 0, 0], "ne", [], [], [], [], 14);
const se = new Tile([[0,0,0],[0,1,1],[0,1,0]], [0, 1, 1, 0], "se", [], [], [], [], 15);
const wUp = new Tile([[1,1,1],[1,1,1],[0,0,0]], [1, 1, 0, 1], "wUp", [], [], [], [], 16);
const wRight = new Tile([[0,1,1],[0,1,1],[0,1,1]], [1, 1, 1, 0], "wRight", [], [], [], [], 17);
const wDown = new Tile([[0,0,0],[1,1,1],[1,1,1]], [0, 1, 1, 1], "wDown", [], [], [], [], 18);
const wLeft = new Tile([[1,1,0],[1,1,0],[1,1,0]], [1, 0, 1, 1], "wLeft", [], [], [], [], 19);
const middle = new Tile([[0,1,0],[1,1,1],[0,1,0]], [1, 1, 1, 1], "middle", [], [], [], [], 20);


const tiles = [blank, vertical, horizontal, full, tUp, tRight, tLeft, tDown, roomUp, roomRight, roomDown, roomLeft, sw, nw, ne, se, wUp, wRight, wDown, wLeft, middle];