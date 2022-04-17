const GAME_SIZE = 8;
const BOARD_SIZE = GAME_SIZE + 2;

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
}

createBoard(); //calling the function that intializes the board
