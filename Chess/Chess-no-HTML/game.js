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
		this.whiteKing = this.whitePieces.find((el) => el.type == "KING");
		this.blackKing = this.blackPieces.find((el) => el.type == "KING");
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
		if (movingPiece.type == "KING") movingPiece.move(newX, newY);
		if (temp) this.killPiece(temp);
		if (this.isCheck(this.turn.color)) {
			this.board[oldY][oldX] = movingPiece;
			this.board[newY][newX] = temp;
			if (temp) this.revivePiece(temp);
			if (movingPiece.type == "KING") movingPiece.move(oldX, oldY);
			alert("Since the point of the game is killing the enemy king I'm not going to let you do that to yourself");
			return false;
		} else {
			this.board[newY][newX].move(newX, newY);
			this.turn = this.turn == "WHITE" ? "BLACK" : "WHITE";
			if (temp) console.log(`${movingPiece.color} ${movingPiece.type} captured ${temp.color} ${temp.type}`);
			if (this.isCheck(this.turn.color)) {
				if (this.isCheckMate(this.turn.color)) alert("I think you just lost");
				else alert("Your king is threatend!!!");
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
		const condition = (piece, move) => {
			const x = piece.x;
			const y = piece.y;
			const temp = this.board[move[1]][move[0]];
			piece.move(move[0], move[1]);
			this.board[move[1]][move[0]] = piece;
			this.board[y][x] = undefined;
			if (temp) this.killPiece(temp);
			const isCheck = this.isCheck(color);
			piece.move(x, y);
			this.board[move[1]][move[0]] = temp;
			this.board[y][x] = piece;
			if (temp) this.revivePiece(temp);
			return isCheck;
		};
		if (color == "WHITE") {
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

	killPiece(piece) {
		if (piece.color == "WHITE") this.whitePieces.splice(this.whitePieces.indexOf(piece), 1);
		else this.blackPieces.splice(this.blackPieces.indexOf(piece), 1);
	}

	revivePiece(piece) {
		if (piece.color == "WHITE") this.whitePieces.push(piece);
		else this.blackPieces.push(piece);
	}
}
