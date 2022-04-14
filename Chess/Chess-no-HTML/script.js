const GAME_SIZE = 8;
const BOARD_SIZE = GAME_SIZE + 2;

//Creates a table element (the board) and appending it all the rows and cells of the table
function createBoard() {
	const body = document.getElementsByTagName("body")[0];
	const board = document.createElement("table");
	body.appendChild(board);
	board.setAttribute("id", "board");
	//loop to create 10 rows (8 for the game, 2 for the letters)
	for (let i = BOARD_SIZE - 1; i >= 0; i--) {
		const row = document.createElement("tr"); //Row number i
		//Checking if the current row is a game row or a letters row
		if (i == 0 || i == BOARD_SIZE - 1) {
			for (let j = 0; j < BOARD_SIZE; j++) {
				const cell = document.createElement("th");
				row.appendChild(cell);
				if (j == 0 || j == BOARD_SIZE - 1) {
					cell.classList.add("letter");
					cell.classList.add("number");
				} else {
					cell.className = "letter";
					cell.innerText = String.fromCharCode(j + 64);
				}
			}
		} else {
			//Handling the actual game rows
			for (let j = 0; j < BOARD_SIZE; j++) {
				let cell;
				//Side cells hold numbers, they are not games cells
				if (j == 0 || j == BOARD_SIZE - 1) {
					cell = document.createElement("th");
					cell.className = "number";
					cell.innerText = i;
				} else {
					//Handling the actual game cells
					cell = document.createElement("td");
					cell.classList.add("tile");
					if (i % 2 == 0) {
						if (j % 2 == 0) cell.classList.add("black");
						else cell.classList.add("white");
					} else {
						if (j % 2 == 0) cell.classList.add("white");
						else cell.classList.add("black");
					}
				}
				row.appendChild(cell);
			}
		}
		board.appendChild(row);
	}
}

createBoard(); //calling the function that intializes the board
