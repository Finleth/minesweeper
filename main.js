let game;

let initializeApp = () => {
    game = new GameController(10);
    game.initializeGame();
}

$(document).ready( initializeApp );


class GameData {
    constructor(size){
        this.gameBoard = [];
        this.totalCells = null;
        this.size = size;
    }

    createArrayMatrix(){
        for (let y=0; y<this.size; y++){
            let row = [];
            for (let x=0; x<this.size; x++){
                let cell = new Cell(y, x, this.size);
                row.push(cell);
            }
            this.gameBoard.push(row);
        }
    }

    addMines(){
        let mines = 10;
        while (mines > 0){
            let y = (Math.random() * this.size) >> 0;
            let x = (Math.random() * this.size) >> 0;
            let currentCell = this.gameBoard[y][x];
            if (!currentCell.mine){
                currentCell.mine = 1;
                this.addAdjMineCount(y-1, x-1);
                mines--;
            }
        }
    }

    getCell(y, x){
        return this.gameBoard[y][x];
    }

    addAdjMineCount(y, x){
        for (let row_i= Math.max(y, 0); row_i < Math.min(this.size, y+3); row_i++){
            for (let col_i= Math.max(x, 0); col_i < Math.min(this.size, x+3); col_i++){
                this.gameBoard[row_i][col_i].adjMines++;
            }
        }
    }

    open(y, x){
        let currentCell = this.gameBoard[y][x];

        if (currentCell.display){
            return 0;
        }
        currentCell.display = 1;

        console.log(currentCell);

        if (currentCell.mine){
            return 1;
        } else if (!currentCell.adjMines){
            return 2;
        } else {
            return 3;
        }
    }
}

class Cell {
    constructor(){
        this.mine = 0;
        this.adjMines = 0;
        this.display = 0;
    }
}

class GameController {
    constructor(size){
        this.model = new GameData(size);
        this.view = new GameView();
        this.size = size
    }

    initializeGame(){
        this.model.createArrayMatrix();
        this.model.addMines();
        this.view.createBoardOnDOM( this.size );
        this.view.addCellClickHandlers( this.handleCellClick.bind(this) );
    }

    handleCellClick(event){
        let y = event.target.attributes.y.nodeValue;
        let x = event.target.attributes.x.nodeValue;

        this.openCell(y, x);
    }

    openCell(y, x){
        let result = this.model.open(y, x);

        if (result){
            switch (result){
                case 1:
                    console.log('was a mine');
                    break;
                case 2:
                    debugger;
                    this.openAdjSpots(y, x);
                    break;
                case 3:
                    console.log('there were adjacent mines');
                    break;
            }
            this.view.openCell(y, x, this.model.getCell(y, x));
        }
    }

    openAdjSpots(y, x){
        for (let row_i= Math.max(y-1, 0); row_i < Math.min(this.size, y+2); row_i++){
            for (let col_i= Math.max(x-1, 0); col_i < Math.min(this.size, x+2); col_i++){
                this.openCell(row_i, col_i);
            }
        }
    }
}

class GameView {
    createBoardOnDOM(size){
        let rows = [];
        for (let y=0; y<size; y++){
            rows.push( this.createDOMRow(size, y) );
        }
        $('.game-container').append(rows);
    }

    createDOMRow(size, y){
        let row = $('<div>',{
            'class': 'row',
            css: {
                height: 100 / size + '%'
            }
        });
        for (let x=0; x<size; x++){
            row.append( this.createDOMCell(size, y, x) );
        }
        return row;
    }

    createDOMCell(size, y, x){
        let cell = $('<div>',{
            'class': 'cell clickable',
            css: {
                width: 100 / size + '%'
            },
            'y': y,
            'x': x
        });
        return cell;
    }

    openCell(y, x, cell){
        let text = $('<p>',{
            text: cell.adjMines
        })
        $(`.cell[y=${y}][x=${x}]`).removeClass('clickable').append(text);
    }

    addCellClickHandlers(callback){
        $('.game-container').on('click', '.cell', callback);
    }
}