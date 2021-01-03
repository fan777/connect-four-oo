/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
class Game {
  
  constructor(players, height, width) {
    this.players = players;
    this.height = height;
    this.width = width;
    this.currPlayer = players[0]; // active player

    this.setCurrentTurnHTML();
    this.makeBoard();
    this.makeHtmlBoard();
  }

  /** makeBoard: create in-JS board structure:
   *   board = array of rows, each row is array of cells  (board[y][x])
   */
  makeBoard() { this.board = [...Array(this.height)].map(x => Array(this.width).fill(0)); }

  /** makeHtmlBoard: make HTML table and row of column tops. */
  makeHtmlBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';
  
    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');

    this.handleBindClick = this.handleClick.bind(this);
    top.addEventListener('click', this.handleBindClick);
  
    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }
  
    board.append(top);
  
    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
      board.append(row);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */
  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */
  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer.color;
    document.getElementById(`${y}-${x}`).append(piece);
  }
  
  /** endGame: announce game end */
  endGame(msg) {
    alert(msg);
    document.getElementById('column-top').removeEventListener('click', this.handleBindClick);
    document.getElementById('current-turn').style.backgroundColor = 'white';
    document.getElementById('current-turn').innerText = "";
  }

  /** handleClick: handle click of column top to play piece */
  handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;
    this.gameLogic(x);
  }

  gameLogic(x) {
    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }
  
    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);
    
    // check for win
    if (this.checkForWin()) {
      return this.endGame(`Player ${this.currPlayer.id} won!`);
    }
    
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
    
    // switch players
    this.currPlayer = this.switchPlayer(this.players.findIndex((player) => player === this.currPlayer));
    this.setCurrentTurnHTML();
    if (this.currPlayer.bot === true) {
      this.botMove();
    }
  }

  switchPlayer(currIdx) {
    return this.players[currIdx + 1 < this.players.length ? currIdx + 1 : 0]; 
  }

  botMove() {
    this.gameLogic(Math.floor(Math.random() * this.width));
  }

  setCurrentTurnHTML() {
    document.getElementById('current-turn').style.backgroundColor = this.currPlayer.color;
    document.getElementById('current-turn').style.color='white';
    document.getElementById('current-turn').innerHTML = 'Current Player<br />' + this.currPlayer.id;
  }
  
  checkForWin() {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer
    const _win = cells => cells.every(([y, x]) =>
      y >= 0 &&
      y < this.height &&
      x >= 0 &&
      x < this.width &&
      this.board[y][x] === this.currPlayer
    );
  
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
        
        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}

class Player {
  constructor(id, color) {
    this.id = id;
    this.color = color;
  }
}

class ComputerPlayer extends Player {
  constructor(id, color) {
    super(id, color);
    this.bot = true;
  }
}

// document.getElementById('add-players').addEventListener('click', (evt) => {

// })

document.getElementById('start-game').addEventListener('click', (evt) => {
  const players = [];
  players.push(new Player('1', document.getElementById('player1').value));
  players.push(document.getElementById('player2-bot').checked ? new ComputerPlayer('2', document.getElementById('player2').value) : new Player('2', document.getElementById('player2').value));

  const height = document.getElementById('board-height').value ? parseInt(document.getElementById('board-height').value) : 6;
  const width = document.getElementById('board-width').value ? parseInt(document.getElementById('board-width').value) : 7;
  
  if ((players.reduce((set, player) => set.add(player.color), new Set())).size !== players.length) {
    alert('Player colors must be unique!');
  } else {
    const game = new Game(players, height, width);
    // game.makeBoard();
    // game.makeHtmlBoard();
  }
})
