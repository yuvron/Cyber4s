const GAME_SIZE = 8;
const BOARD_SIZE = GAME_SIZE + 2;
const CHESS_TYPES = ["PAWN", "ROOK", "KNIGHT", "BISHOP", "QUEEN", "KING", "BISHOP", "KNIGHT", "ROOK"];
const WHITE_PIECES1 = ["♙", "♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"];
const BLACK_PIECES1 = ["♟", "♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"];
const WHITE_PIECES = [
	'<i class="fa-regular fa-chess-pawn"></i>',
	'<i class="fa-regular fa-chess-rook"></i>',
	'<i class="fa-regular fa-chess-knight"></i>',
	'<i class="fa-regular fa-chess-bishop"></i>',
	'<i class="fa-regular fa-chess-queen"></i>',
	'<i class="fa-regular fa-chess-king"></i>',
	'<i class="fa-regular fa-chess-bishop"></i>',
	'<i class="fa-regular fa-chess-knight"></i>',
	'<i class="fa-regular fa-chess-rook"></i>',
];
const BLACK_PIECES = [
	'<i class="fa-solid fa-chess-pawn"></i>',
	'<i class="fa-solid fa-chess-rook"></i>',
	'<i class="fa-solid fa-chess-knight"></i>',
	'<i class="fa-solid fa-chess-bishop"></i>',
	'<i class="fa-solid fa-chess-queen"></i>',
	'<i class="fa-solid fa-chess-king"></i>',
	'<i class="fa-solid fa-chess-bishop"></i>',
	'<i class="fa-solid fa-chess-knight"></i>',
	'<i class="fa-solid fa-chess-rook"></i>',
];
const BOARD = [];
let chosenCell = undefined;
let availableMoves = [];

class Piece {
	constructor(type, color, x, y) {
		this.type = type;
		this.color = color;
		this.x = x;
		this.y = y;
		this.isInStartingPosition = true;
	}

	getMoves() {
		let moves = [];
		let multiplier = this.color == "WHITE" ? 1 : -1;
		switch (this.type) {
			case "PAWN":
				moves.push([this.x, this.y + 1 * multiplier]);
				if (this.isInStartingPosition) moves.push([this.x, this.y + 2 * multiplier]);
				break;
			case "ROOK":
				moves = this.getStraights();
				break;
			case "KNIGHT":
				moves = this.getStraights(true);
				moves = moves.concat(this.getDiagonals(true));
				break;
			case "BISHOP":
				moves = this.getDiagonals();
				break;
			case "QUEEN":
				moves = this.getStraights();
				moves = moves.concat(this.getDiagonals());
				break;
			case "KING":
				moves.push([this.x + 1, this.y + 1]);
				moves.push([this.x + 1, this.y]);
				moves.push([this.x + 1, this.y - 1]);
				moves.push([this.x, this.y - 1]);
				moves.push([this.x, this.y + 1]);
				moves.push([this.x - 1, this.y + 1]);
				moves.push([this.x - 1, this.y]);
				moves.push([this.x - 1, this.y - 1]);
				break;
		}
		return moves;
	}

	getStraights() {
		let straights = [];
		let condition = (i, j) => {
			if (!BOARD[j][i]) straights.push([i, j]);
			else if (BOARD[j][i].color != this.color) {
				straights.push([i, j]);
				return true;
			} else return true;
		};
		for (let i = this.x + 1; i < GAME_SIZE; i++) if (condition(i, this.y) || once) break;
		for (let i = this.x - 1; i >= 0; i--) if (condition(i, this.y) || once) break;
		for (let j = this.y + 1; j < GAME_SIZE; j++) if (condition(this.x, j) || once) break;
		for (let j = this.y - 1; j >= 0; j--) if (condition(this.x, j) || once) break;
		return straights;
	}

	getDiagonals(once = false) {
		let diagonals = [];
		let condition = (i, j) => {
			if (!BOARD[j][i]) diagonals.push([i, j]);
			else if (BOARD[j][i].color != this.color) {
				diagonals.push([i, j]);
				return true;
			} else return true;
		};
		let i = this.x + 1;
		let j = this.y + 1;
		while (i < GAME_SIZE && j < GAME_SIZE) {
			if (condition(i, j) || once) break;
			i++;
			j++;
		}
		i = this.x - 1;
		j = this.y + 1;
		while (i >= 0 && j < GAME_SIZE) {
			if (condition(i, j) || once) break;
			i--;
			j++;
		}
		i = this.x - 1;
		j = this.y - 1;
		while (i >= 0 && j >= 0) {
			if (condition(i, j) || once) break;
			i--;
			j--;
		}
		i = this.x + 1;
		j = this.y - 1;
		while (i < GAME_SIZE && j >= 0) {
			if (condition(i, j) || once) break;
			i++;
			j--;
		}
		return diagonals;
	}

	move(x, y) {
		if (this.isInStartingPosition) this.isInStartingPosition = false;
		this.x = x;
		this.y = y;
	}
}

//Creates a table element (the board) and appending it all the rows and cells of the table
function createBoard() {
	const body = document.body;
	const table = document.createElement("table");
	table.id = "board";
	body.appendChild(table);
	let isSideRow = false;
	let isSideColumn = false;
	//loop to create 10 rows (8 for the game, 2 for the letters)
	for (let i = BOARD_SIZE - 1; i >= 0; i--) {
		const row = table.insertRow();
		isSideRow = i == 0 || i == BOARD_SIZE - 1;
		for (let j = 0; j < BOARD_SIZE; j++) {
			const cell = row.insertCell();
			isSideColumn = j == 0 || j == BOARD_SIZE - 1;
			if (isSideRow) {
				cell.classList.add("letter");
				if (isSideColumn) cell.classList.add("number");
				else cell.innerText = String.fromCharCode(j + 64);
			} else {
				if (isSideColumn) {
					cell.classList.add("number");
					cell.innerText = i;
				} else {
					cell.classList.add("tile");
					cell.id = j - 1 + "-" + (i - 1);
					cell.addEventListener("click", cellClicked);
					if (i % 2 == 0) {
						if (j % 2 == 0) cell.classList.add("black");
						else cell.classList.add("white");
					} else {
						if (j % 2 == 0) cell.classList.add("white");
						else cell.classList.add("black");
					}
				}
			}
		}
	}
	return table;
}

function initializeBoard(table) {
	rows = [...table.rows];
	rows.shift(); //Remove the first row (letters)
	rows.pop(); //Remove the last row (letters)
	for (let i = rows.length - 1; i >= 0; i--) {
		BOARD[i] = [];
		cells = [...rows[i].cells];
		cells.shift(); //Remove the first column (numbers)
		cells.pop(); //Remove the last column (numbers)
		for (const j in cells) {
			BOARD[i][j] = undefined;
			if (i == 0) {
				cells[j].innerHTML = BLACK_PIECES[+j + 1];
				BOARD[i][j] = new Piece(CHESS_TYPES[+j + 1], "WHITE", +j, i);
			} else if (i == 1) {
				cells[j].innerHTML = BLACK_PIECES[0];
				BOARD[i][j] = new Piece("PAWN", "WHITE", +j, i);
			} else if (i == cells.length - 2) {
				cells[j].innerHTML = WHITE_PIECES[0];
				BOARD[i][j] = new Piece("PAWN", "BLACK", +j, i);
			} else if (i == cells.length - 1) {
				cells[j].innerHTML = WHITE_PIECES[+j + 1];
				BOARD[i][j] = new Piece(CHESS_TYPES[+j + 1], "BLACK", +j, i);
			}
		}
	}
}

function updateBoard(newPos, lastPos) {
	newPos.innerHTML = lastPos.innerHTML;
	lastPos.innerHTML = "";
}

function cellClicked(e) {
	if (!availableMoves.includes(e.currentTarget)) {
		if (chosenCell) {
			chosenCell.classList.toggle("selected");
			for (const cell of availableMoves) {
				cell.classList.toggle("move");
			}
			availableMoves = [];
		}
		if (chosenCell == e.currentTarget) chosenCell = undefined;
		else {
			chosenCell = e.currentTarget;
			chosenCell.classList.toggle("selected");
			let id = e.currentTarget.id.split("-");
			let x = id[0];
			let y = id[1];
			console.log(x, y);
			if (BOARD[y][x] != undefined) {
				let moves = BOARD[y][x].getMoves();
				console.log(moves);
				if (moves) {
					for (const move of moves) {
						const el = document.getElementById(move[0] + "-" + move[1]);
						if (el) {
							el.classList.toggle("move");
							availableMoves.push(el);
						}
					}
				}
			} else {
			}
		}
	} else {
		let id = e.currentTarget.id.split("-");
		let x = id[0];
		let y = id[1];
		let id2 = chosenCell.id.split("-");
		let x2 = id2[0];
		let y2 = id2[1];
		BOARD[y2][x2].move(+x, +y);
		updateBoard(e.currentTarget, chosenCell);
		BOARD[y][x] = BOARD[y2][x2];
		BOARD[y2][x2] = undefined;
		chosenCell.classList.toggle("selected");
		for (const cell of availableMoves) {
			cell.classList.toggle("move");
		}
		availableMoves = [];
		chosenCell = undefined;
	}
}

const table = createBoard();
initializeBoard(table);
console.log(BOARD);
