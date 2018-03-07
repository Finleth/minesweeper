
let initializeApp = () => {
    let game = new GameController(10);
    game.initializeGame();
}

$(document).ready( initializeApp );


class GameData {
    constructor(){
        this.gameBoard = [];
        this.totalCells = null;
    }

    createArrayMatrix(size){
        for (let y=0; y<size; y++){
            let row = [];
            for (let x=0; x<size; x++){
                let cell = new Cell();
                row.push(cell);
            }
            this.gameBoard.push(row);
        }
    }
}

class Cell {
    constructor(){
        this.mine = 0;
        this.adjMines = 0;
        this.display = 0;
    }

    open(){
        this.display = 1;
        if (this.mine){
            alert('you lost');
        } else if (!this.adjMines){
            this.openAdjSpots();
        }
    }

    openAdjSpots(){
        console.log('opening adjacent spots');
    }
}

class GameController {
    constructor(size){
        this.model = new GameData();
        this.size = size
    }

    initializeGame(){
        this.model.createArrayMatrix(this.size);
    }
}