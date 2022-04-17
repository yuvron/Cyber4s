const GAME_SIZE = 8;
const BOARD_SIZE = GAME_SIZE + 2;
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
let chosen;

//Creates a table element (the board) and appending it all the rows and cells of the table
function createBoard() {
	const body = document.body;
	const board = document.createElement("table");
	board.id = "board";
	body.appendChild(board);
	let isSideRow = false;
	let isSideColumn = false;
	//loop to create 10 rows (8 for the game, 2 for the letters)
	for (let i = BOARD_SIZE - 1; i >= 0; i--) {
		const row = board.insertRow();
		isSideRow = i == 0 || i == BOARD_SIZE - 1;
		for (let j = 0; j < BOARD_SIZE; j++) {
			const cell = row.insertCell();
			cell.id = "cell-" + i + "-" + j;
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
					cell.addEventListener("click", () => cellClicked(cell));
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
	return board;
}

function initializeBoard(board) {
	rows = [...board.rows];
	rows.shift(); //Remove the first row (letters)
	rows.pop(); //Remove the last row (letters)
	for (const i in rows) {
		cells = [...rows[i].cells];
		cells.shift(); //Remove the first column (numbers)
		cells.pop(); //Remove the last column (numbers)
		for (const j in cells) {
			if (i == 0) cells[j].innerHTML = BLACK_PIECES[+j + 1];
			if (i == 1) cells[j].innerHTML = BLACK_PIECES[0];
			if (i == cells.length - 2) cells[j].innerHTML = WHITE_PIECES[0];
			if (i == cells.length - 1) cells[j].innerHTML = WHITE_PIECES[+j + 1];
		}
	}
}

function cellClicked(cell) {
	if (chosen) chosen.classList.toggle("selected");
	chosen = cell;
	chosen.classList.toggle("selected");
}

const board = createBoard(); //calling the function that intializes the board
initializeBoard(board);
