let game;

let initializeApp = () => {
    game = new GameController(10, 10);
    game.initializeGame();
}

$(document).ready( initializeApp );


class GameData {
    constructor(size, mineCount){
        this.gameBoard = [];
        this.totalCells = null;
        this.size = size;
        this.availableSafeCells = null;
        this.mineCount = mineCount;
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
        let mines = this.mineCount;
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

    calculateSafeCells(){
        this.availableSafeCells = (this.size * this.size) - this.mineCount;
    }

    reduceSafeCellCount(){
        return --this.availableSafeCells;
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
    constructor(size, mineCount){
        this.model = new GameData(size, mineCount);
        this.view = new GameView();
        this.size = size
    }

    initializeGame(){
        this.model.createArrayMatrix();
        this.model.addMines();
        this.model.calculateSafeCells();
        this.view.createBoardOnDOM( this.size );
        this.view.addCellClickHandlers( this.handleCellClick.bind(this) );
    }

    handleCellClick(event){
        let y = event.target.attributes.y.nodeValue >> 0;
        let x = event.target.attributes.x.nodeValue >> 0;

        this.openCell(y, x);
    }

    openCell(y, x){
        let result = this.model.open(y, x);

        if (result){
            this.view.openCell(y, x, this.model.getCell(y, x));

            switch (result){
                case 1:
                    break;
                case 2:
                    this.openAdjSpots(y, x);
                case 3:
                    if (!this.model.reduceSafeCellCount()){
                        console.log('you win!');
                    };
                    break;
            }
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
        let cellTag;

        if (cell.mine){
            cellTag = $('<i>',{
                'class': 'fab fa-git-square'
            })
        } else if (!cell.adjMines){
            cellTag = $('<p>',{
                text: ""
            })
        } else {
            cellTag = $('<p>',{
                text: cell.adjMines
            })
        }
        
        $(`.cell[y=${y}][x=${x}]`).removeClass('clickable').append(cellTag);
    }

    addCellClickHandlers(callback){
        $('.game-container').on('click', '.clickable', callback);
    }
}