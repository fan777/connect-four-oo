/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
class Game {
  
  constructor(player1, player2, height = 6, width = 7) {
    this.players = [player1, player2];
    this.height = height;
    this.width = width;
    this.currPlayer = player1; // active player: 1 or 2

    this.makeBoard();
    this.makeHtmlBoard();
  }

  makeBoard = () => this.board = [...Array(this.height)].map(x => Array(this.width).fill(0)); 

  makeHtmlBoard = () => {
    const board = document.getElementById('board');
    board.innerHTML = '';
  
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

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer.color;
    document.getElementById(`${y}-${x}`).append(piece);
  }
  
  endGame(msg) {
    alert(msg);
    document.getElementById('column-top').removeEventListener('click', this.handleBindClick);
  }

  handleClick(evt) {
    const x = +evt.target.id;
  
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }
  
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);
    
    if (this.checkForWin()) {
      return this.endGame(`The ${this.currPlayer.color} player won!`);
    }
    
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
      
    this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
  }
  
  checkForWin() {
    const _win = cells => cells.every(([y, x]) =>
      y >= 0 &&
      y < this.height &&
      x >= 0 &&
      x < this.width &&
      this.board[y][x] === this.currPlayer
    );
  
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
  
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}

class Player {
  constructor(color) {
    this.color = color;
  }
}

document.getElementById('start-game').addEventListener('click', (evt) => {
  const player1 = new Player(document.getElementById('player-1-color').value ? document.getElementById('player-1-color').value : 'lightcoral');
  const player2 = new Player(document.getElementById('player-2-color').value ? document.getElementById('player-2-color').value : 'grey');
  new Game(player1, player2);
})
