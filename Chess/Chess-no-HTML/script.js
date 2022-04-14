//Creates a table row element with the board tiles.
//@param rowNumber - the number of the row currently created.
//@return ROW - the new row element.
function createContentRow(rowNumber) {
	const ROW = document.createElement("tr");
	for (let i = 0; i < 10; i++) {
		let cell;
		if (i == 0 || i == 9) {
			cell = document.createElement("th");
			cell.className = "number";
			cell.innerText = rowNumber;
		} else {
			cell = document.createElement("td");
			cell.classList.add("tile");
			if (rowNumber % 2 == 0) {
				if (i % 2 == 0) cell.classList.add("black");
				else cell.classList.add("white");
			} else {
				if (i % 2 == 0) cell.classList.add("white");
				else cell.classList.add("black");
			}
		}
		ROW.appendChild(cell);
	}
	return ROW;
}

//Creates a table row element for the ends of the board.
//@return ROW - the new row element.
function createEndRow() {
	const ROW = document.createElement("tr");
	for (let i = 0; i < 10; i++) {
		const cell = document.createElement("th");
		ROW.appendChild(cell);
		if (i == 0 || i == 9) {
			cell.classList.add("letter");
			cell.classList.add("number");
		} else {
			cell.className = "letter";
			cell.innerText = String.fromCharCode(i + 64);
		}
	}
	return ROW;
}

//Creates a table element (the board) and appending it all the rows of the table
function createBoard() {
	const BODY = document.getElementsByTagName("body")[0];
	const BOARD = document.createElement("table");
	BODY.appendChild(BOARD);
	BOARD.setAttribute("id", "board");
	for (let i = 9; i >= 0; i--) {
		if (i == 0 || i == 9) BOARD.appendChild(createEndRow());
		else BOARD.appendChild(createContentRow(i));
	}
}

createBoard(); //calling the function that intializes the board
