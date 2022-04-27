const GAME_SIZE = 8;
const BOARD_SIZE = GAME_SIZE + 2;
const CHESS_TYPES = ["PAWN", "ROOK", "KNIGHT", "BISHOP", "QUEEN", "KING", "BISHOP", "KNIGHT", "ROOK"];
const WHITE_PIECES_ALTERNATIVE = ["♙", "♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"];
const BLACK_PIECES2_ALTERNATIVE = ["♟", "♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"];
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
const notifications = document.getElementById("notification-container");
const upgradeWindow = document.getElementById("upgrade-container");
let chosenCell = undefined;
let desiredCell = undefined;
let availableMoves = [];

//Creates a table element (the board) and appending it all the rows and cells of the table
function createBoard() {
	const container = document.getElementById("container");
	const table = document.createElement("table");
	table.id = "board";
	container.appendChild(table);
	let isSideRow = false; //Side rows contain only letters and are not part of the game
	let isSideColumn = false; //Side columns contain only numbers and are not part of the game
	//loop to create 10 rows (8 for the game, 2 for the letters)
	for (let i = BOARD_SIZE - 1; i >= 0; i--) {
		const row = table.insertRow();
		isSideRow = i === 0 || i === BOARD_SIZE - 1;
		for (let j = 0; j < BOARD_SIZE; j++) {
			const cell = row.insertCell();
			isSideColumn = j === 0 || j === BOARD_SIZE - 1;
			if (isSideRow) {
				cell.classList.add("letter");
				if (isSideColumn) cell.classList.add("number");
				else cell.innerText = String.fromCharCode(j + 64); //65 = A (ASCII)
			} else {
				if (isSideColumn) {
					cell.classList.add("number");
					cell.innerText = i;
				} else {
					cell.classList.add("tile");
					cell.id = j - 1 + "-" + (i - 1);
					cell.addEventListener("click", (event) => cellClicked(event, j - 1, i - 1));
					if ((i + j) % 2 === 0) cell.classList.add("black");
					else cell.classList.add("white");
				}
			}
		}
	}
	return table;
}

//Placing all the pieces in place and creating the array of the board
function initializeBoard(table) {
	const board = [];
	rows = [...table.rows];
	rows.shift(); //Remove the first row (letters)
	rows.pop(); //Remove the last row (letters)
	for (let i = rows.length - 1; i >= 0; i--) {
		board[i] = [];
		cells = [...rows[i].cells];
		cells.shift(); //Remove the first column (numbers)
		cells.pop(); //Remove the last column (numbers)
		for (const j in cells) {
			if (i === 0) {
				cells[j].innerHTML = BLACK_PIECES[+j + 1];
				board[i][j] = new Piece(CHESS_TYPES[+j + 1], "WHITE", +j, i);
			} else if (i === 1) {
				cells[j].innerHTML = BLACK_PIECES[0];
				board[i][j] = new Piece("PAWN", "WHITE", +j, i);
			} else if (i === cells.length - 2) {
				cells[j].innerHTML = WHITE_PIECES[0];
				board[i][j] = new Piece("PAWN", "BLACK", +j, i);
			} else if (i === cells.length - 1) {
				cells[j].innerHTML = WHITE_PIECES[+j + 1];
				board[i][j] = new Piece(CHESS_TYPES[+j + 1], "BLACK", +j, i);
			} else {
				cells[j].innerHTML = "";
				board[i][j] = undefined;
			}
		}
	}
	return board;
}

//Moving a piece in the HTML board
function updateBoard(newPos, lastPos) {
	newPos.innerHTML = lastPos.innerHTML;
	lastPos.innerHTML = "";
	updateTurn();
}

//Updating the turn indicator
function updateTurn() {
	const turn = document.getElementById("turn");
	if ((game.turn === "WHITE" && game.isRunning) || (game.turn === "BLACK" && !game.isRunning)) {
		turn.className = "white-turn";
		table.style.borderColor = "white";
		if (game.isRunning) turn.innerText = "White Turn";
		else turn.innerText = "White Won!";
	} else {
		turn.className = "black-turn";
		table.style.borderColor = "black";
		if (game.isRunning) turn.innerText = "Black Turn";
		else turn.innerText = "Black Won!";
	}
}

//Adds a piece to the opponent player's captures list
function addPieceToCaptures(piece, cell) {
	const oppColor = piece.color === "WHITE" ? "black" : "white";
	const div = document.getElementById(`${oppColor}-cap`);
	const newCapture = document.createElement("span");
	newCapture.innerHTML = cell.innerHTML;
	div.appendChild(newCapture);
}

//Handling click events on tiles in the board
function cellClicked(e, x, y) {
	if (game.isRunning) {
		//A function that toggles all the highlighted cells back
		const toggleBack = () => {
			chosenCell.classList.toggle("selected");
			for (const cell of availableMoves) cell.classList.toggle("move");
			availableMoves = [];
		};
		//Checking if the clicked cell is not a possible move from an earlier click
		if (!availableMoves.includes(e.currentTarget)) {
			//Checking if there is a previous clicked cell, if so unmarking it
			if (chosenCell) toggleBack();
			if (chosenCell === e.currentTarget) chosenCell = undefined;
			else {
				let piece = game.getPiece(x, y);
				if (piece && piece.color === game.turn) {
					chosenCell = e.currentTarget;
					chosenCell.classList.toggle("selected");
					let moves = piece.getMoves(game.board);
					if (moves) {
						for (const move of moves) {
							const el = document.getElementById(move[0] + "-" + move[1]);
							if (el) {
								el.classList.toggle("move");
								availableMoves.push(el);
							}
						}
					}
				} else chosenCell = undefined;
			}
			//Handling moves clicks
		} else {
			desiredCell = e.currentTarget;
			let lastId = chosenCell.id.split("-");
			let lastX = +lastId[0];
			let lastY = +lastId[1];
			const tryMove = game.movePiece(lastX, lastY, x, y);
			if (tryMove) {
				if (typeof tryMove === "object") addPieceToCaptures(tryMove, desiredCell);
				updateBoard(e.currentTarget, chosenCell);
				toggleBack();
				chosenCell = undefined;
			}
		}
	}
}

//Pushing a toast notification on the screen and playing a sound, removing the notification after 6 seconds
function addNotification(text) {
	const notif = document.createElement("div");
	notif.className = "notification";
	notif.innerText = text;
	notifications.appendChild(notif);
	const beep = () =>
		new Audio(
			"data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU="
		).play();
	beep();
	//Double beep if checkmate
	if (text.includes("Checkmate")) setTimeout(() => beep(), 300);
	setTimeout(() => notif.remove(), 6000);
}

//Setting up utility buttons (restart and upgrade menu)
function initUtils() {
	//Setup restart button events
	const restart = document.getElementById("restart");
	const restartIcon = document.getElementById("restart-icon");
	restart.addEventListener("mouseover", () => restartIcon.classList.add("fa-spin"));
	restart.addEventListener("mouseout", () => restartIcon.classList.remove("fa-spin"));
	restart.addEventListener("click", () => {
		game.initalizeGame(initializeBoard(table));
		updateTurn();
		addNotification("Game is restarting...");
	});
	//Setup upgrade button events
	const upgradeOptions = [...upgradeWindow.getElementsByTagName("i")];
	upgradeOptions.forEach((el) => {
		el.addEventListener("click", () => {
			const newType = el.getAttribute("name");
			if (game.turn === "WHITE") desiredCell.innerHTML = WHITE_PIECES[CHESS_TYPES.indexOf(newType)];
			else desiredCell.innerHTML = BLACK_PIECES[CHESS_TYPES.indexOf(newType)];
			const cellId = desiredCell.id.split("-");
			const piece = game.getPiece(cellId[0], cellId[1]);
			game.upgradePiece(piece, newType);
			el.style.transition = "0s";
			upgradeWindow.style.visibility = "hidden";
			game.switchTurns();
			if (!game.isRunning) updateTurn();
		});
	});
}

const table = createBoard();
const game = new Game(initializeBoard(table));
initUtils();
