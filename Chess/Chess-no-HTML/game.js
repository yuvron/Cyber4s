class Game {
	constructor(board) {
		this.initalizeGame(board);
	}

	initalizeGame(cleanBoard) {
		this.board = cleanBoard;
		this.whitePieces = [];
		this.blackPieces = [];
		for (const i of this.board) {
			this.whitePieces = this.whitePieces.concat(i.filter((el) => el && el.color == "WHITE"));
			this.blackPieces = this.blackPieces.concat(i.filter((el) => el && el.color == "BLACK"));
		}
		this.whiteKing = this.whitePieces.filter((el) => el.type == "KING")[0];
		this.blackKing = this.blackPieces.filter((el) => el.type == "KING")[0];
		this.turn = "WHITE";
	}

	getPiece(x, y) {
		return this.board[y][x];
	}

	movePiece(oldX, oldY, newX, newY) {
		const movingPiece = this.board[oldY][oldX];
		const temp = this.board[newY][newX];
		this.board[newY][newX] = movingPiece;
		this.board[oldY][oldX] = undefined;
		if (this.isCheck(movingPiece.color)) {
			this.board[oldY][oldX] = movingPiece;
			this.board[newY][newX] = temp;
			alert("Since the point of the game is killing the enemy king I'm not going to let you do that to yourself");
			return false;
		} else {
			this.board[newY][newX].move(newX, newY);
			this.turn = this.turn == "WHITE" ? "BLACK" : "WHITE";
			if (temp) {
				if (this.turn == "BLACK") this.blackPieces.splice(this.blackPieces.indexOf(temp), 1);
				else this.whitePieces.splice(this.whitePieces.indexOf(temp), 1);
				console.log(
					`${movingPiece.color.toLowerCase()} ${movingPiece.type.toLowerCase()} captured ${this.turn.toLowerCase()} ${temp.type.toLowerCase()}`
				);
			}
			return true;
		}
	}

	isCheck(color) {
		if (color == "WHITE") {
			for (const blackPiece of this.blackPieces) {
				for (const move of blackPiece.getMoves(this.board)) {
					if (move[0] == this.whiteKing.x && move[1] == this.whiteKing.y) return true;
				}
			}
		} else {
			for (const whitePiece of this.whitePieces) {
				for (const move of whitePiece.getMoves(this.board)) {
					if (move[0] == this.blackKing.x && move[1] == this.blackKing.y) return true;
				}
			}
		}
		return false;
	}

	isCheckMate(color) {
		if (color == "WHITE") {
			for (const whitePiece of this.whitePieces) {
				for (const move of whitePiece.getMoves()) {
					const x = whitePiece.x;
					const y = whitePiece.y;
					whitePiece.move(move.x, move.y);
					const isCheck = this.isCheck(color);
					whitePiece.move(x, y);
					if (!isCheck) return false;
				}
			}
		} else {
			for (const blackPiece of this.blackPieces) {
				for (const move of blackPiece.getMoves()) {
					const x = blackPiece.x;
					const y = blackPiece.y;
					blackPiece.move(move.x, move.y);
					const isCheck = this.isCheck(color);
					blackPiece.move(x, y);
					if (!isCheck) return false;
				}
			}
		}
	}
}
