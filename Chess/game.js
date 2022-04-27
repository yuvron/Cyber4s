class Game {
	constructor(board) {
		this.initalizeGame(board);
	}

	//Setting all the game variables to starting values
	initalizeGame(cleanBoard) {
		this.board = cleanBoard;
		this.whitePieces = [];
		this.blackPieces = [];
		for (const i of this.board) {
			this.whitePieces = this.whitePieces.concat(i.filter((el) => el && el.color === "WHITE"));
			this.blackPieces = this.blackPieces.concat(i.filter((el) => el && el.color === "BLACK"));
		}
		this.whiteKing = this.whitePieces.find((el) => el.type === "KING");
		this.blackKing = this.blackPieces.find((el) => el.type === "KING");
		this.turn = "WHITE";
		this.isRunning = true;
	}

	getPiece(x, y) {
		return this.board[y][x];
	}

	//Moving a piece to a new position in the board
	//Returning true if the move is legal
	movePiece(oldX, oldY, newX, newY) {
		const movingPiece = this.board[oldY][oldX];
		const temp = this.board[newY][newX];
		this.board[newY][newX] = movingPiece;
		this.board[oldY][oldX] = undefined;
		if (movingPiece.type === "KING") movingPiece.move(newX, newY);
		if (temp) this.killPiece(temp);
		if (this.isCheck(this.turn)) {
			this.board[oldY][oldX] = movingPiece;
			this.board[newY][newX] = temp;
			if (temp) this.revivePiece(temp);
			if (movingPiece.type === "KING") movingPiece.move(oldX, oldY);
			addNotification("Your king is either threatened or will be so after the desired move, you can't do that");
			return false;
		} else {
			if (temp)
				addNotification(
					`${movingPiece.color.charAt(0)}${movingPiece.color
						.slice(1)
						.toLowerCase()} ${movingPiece.type.toLowerCase()} captured ${temp.color.toLowerCase()} ${temp.type.toLowerCase()}`
				);
			if (this.board[newY][newX].move(newX, newY)) upgradeWindow.style.visibility = "visible"; //show upgrade screen
			else this.switchTurns();
			return true;
		}
	}

	//Switching turns, checking for possible check and checkmate
	switchTurns() {
		this.turn = this.turn === "WHITE" ? "BLACK" : "WHITE";
		if (this.isCheck(this.turn)) {
			if (this.isCheckMate(this.turn)) {
				const winningColor = this.turn === "WHITE" ? "black" : "white";
				addNotification(`Checkmate! ${winningColor} won! Press the restart button if you wish to play again`);
				this.isRunning = false;
			} else addNotification(`Check! ${this.turn.toLowerCase()} king is threatened`);
		}
	}

	//Returing true if the color checked's king is under check
	isCheck(color) {
		if (color === "WHITE") {
			for (const blackPiece of this.blackPieces) {
				for (const move of blackPiece.getMoves(this.board)) {
					if (move[0] === this.whiteKing.x && move[1] === this.whiteKing.y) return true;
				}
			}
		} else {
			for (const whitePiece of this.whitePieces) {
				for (const move of whitePiece.getMoves(this.board)) {
					if (move[0] === this.blackKing.x && move[1] === this.blackKing.y) return true;
				}
			}
		}
		return false;
	}

	//Returning true if the color checked has lost
	isCheckMate(color) {
		const condition = (piece, move) => {
			const x = piece.x;
			const y = piece.y;
			const temp = this.board[move[1]][move[0]];
			piece.move(move[0], move[1], false);
			this.board[move[1]][move[0]] = piece;
			this.board[y][x] = undefined;
			if (temp) this.killPiece(temp);
			const isCheck = this.isCheck(color);
			piece.move(x, y, false);
			this.board[move[1]][move[0]] = temp;
			this.board[y][x] = piece;
			if (temp) this.revivePiece(temp);
			return isCheck;
		};
		if (color === "WHITE") {
			for (const whitePiece of this.whitePieces) {
				for (const move of whitePiece.getMoves(this.board)) {
					if (!condition(whitePiece, move)) return false;
				}
			}
		} else {
			for (const blackPiece of this.blackPieces) {
				for (const move of blackPiece.getMoves(this.board)) {
					if (!condition(blackPiece, move)) return false;
				}
			}
		}
		return true;
	}

	//Removing a piece from the pieces array, meaning it was captured
	killPiece(piece) {
		if (piece.color === "WHITE") this.whitePieces.splice(this.whitePieces.indexOf(piece), 1);
		else this.blackPieces.splice(this.blackPieces.indexOf(piece), 1);
	}

	//Returning a piece from the pieces array, meaning it wasn't actually captured
	revivePiece(piece) {
		if (piece.color === "WHITE") this.whitePieces.push(piece);
		else this.blackPieces.push(piece);
	}

	//Upgrades a pawn to a better piece
	upgradePiece(piece, upgradeTo) {
		addNotification(`${piece.color} PAWN upgraded to ${upgradeTo}`);
		piece.type = upgradeTo;
	}
}
