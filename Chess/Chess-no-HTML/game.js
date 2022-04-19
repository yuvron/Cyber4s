class Game {
	constructor(board) {
		this.initalizeGame(board);
	}

	initalizeGame(cleanBoard) {
		this.board = cleanBoard;
		this.whitePieces = [];
		this.blackPieces = [];
		for (const i of this.board) {
			this.whitePieces.concat(i.filter((el) => el && el.color == "WHITE"));
			this.blackPieces.concat(i.filter((el) => el && el.color == "BLACK"));
		}
		this.whiteKing = this.whitePieces.filter((el) => el.type == "KING");
		this.blackKing = this.blackPieces.filter((el) => el.type == "KING");
		this.turn = "WHITE";
	}

	getPiece(x, y) {
		return this.board[y][x];
	}

	movePiece(oldX, oldY, newX, newY) {
		this.board[oldY][oldX].move(newX, newY);
		this.board[newY][newX] = this.board[oldY][oldX];
		this.board[oldY][oldX] = undefined;
		this.turn = this.turn == "WHITE" ? "BLACK" : "WHITE";
	}

	isCheck(color) {
		if (color == "WHITE") {
			for (const blackPiece of this.blackPieces) {
				for (const move of blackPiece.getMoves()) {
					if (move == [whiteKing.x, whiteKing.y]) return true;
				}
			}
		} else {
			for (const whitePiece of this.whitePiece) {
				for (const move of whitePiece.getMoves()) {
					if (move == [blackKing.x, blackKing.y]) return true;
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
