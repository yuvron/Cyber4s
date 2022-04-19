class Piece {
	constructor(type, color, x, y) {
		this.type = type;
		this.color = color;
		this.x = x;
		this.y = y;
		this.isInStartingPosition = true;
	}

	getMoves(board) {
		let moves = [];
		switch (this.type) {
			case "PAWN":
				moves = this.getPawnMoves(board);
				break;
			case "ROOK":
				moves = this.getStraights(board);
				break;
			case "KNIGHT":
				moves = this.getKnightMoves(board);
				break;
			case "BISHOP":
				moves = this.getDiagonals(board);
				break;
			case "QUEEN":
				moves = this.getStraights(board);
				moves = moves.concat(this.getDiagonals(board));
				break;
			case "KING":
				moves = this.getStraights(board, true);
				moves = moves.concat(this.getDiagonals(board, true));
				break;
		}
		return moves;
	}

	getPawnMoves(board) {
		let pawnMoves = [];
		let multiplier = this.color == "WHITE" ? 1 : -1;
		let newY = this.y + 1 * multiplier;
		if (!board[newY][this.x]) pawnMoves.push([this.x, newY]);
		newY = this.y + 2 * multiplier;
		if (this.isInStartingPosition && !board[newY][this.x]) pawnMoves.push([this.x, newY]);
		newY = this.y + 1 * multiplier;
		let newX = this.x + 1;
		if (board[newY][newX] && board[newY][newX].color != this.color) pawnMoves.push([newX, newY]);
		newX = this.x - 1;
		if (board[newY][newX] && board[newY][newX].color != this.color) pawnMoves.push([newX, newY]);
		return pawnMoves;
	}

	getKnightMoves(board) {
		let knightMoves = [];
		let condition = (x, y) => {
			if (x >= 0 && x < 8 && y >= 0 && y < 8) {
				if (!board[y][x] || board[y][x].color != this.color) knightMoves.push([x, y]);
			}
		};
		for (let i = -2; i <= 2; i++) {
			for (let j = -2; j <= 2; j++) {
				if (Math.abs(i) != Math.abs(j) && i != 0 && j != 0) {
					condition(this.x + i, this.y + j);
				}
			}
		}
		// condition(this.x + 2, this.y + 1);
		// condition(this.x + 2, this.y - 1);
		// condition(this.x - 2, this.y + 1);
		// condition(this.x - 2, this.y - 1);
		// condition(this.x + 1, this.y + 2);
		// condition(this.x + 1, this.y - 2);
		// condition(this.x - 1, this.y + 2);
		// condition(this.x - 1, this.y - 2);
		return knightMoves;
	}

	getStraights(board, once = false) {
		let straights = [];
		let condition = (i, j) => {
			if (!board[j][i]) straights.push([i, j]);
			else if (board[j][i].color != this.color) {
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

	getDiagonals(board, once = false) {
		let diagonals = [];
		let condition = (i, j) => {
			if (!board[j][i]) diagonals.push([i, j]);
			else if (board[j][i].color != this.color) {
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
		//If a pawn reaches the end it turns to a better piece
		if (this.type == "PAWN" && (this.y == GAME_SIZE - 1 || this.y == 0)) {
			if (confirm("Please")) {
				this.type = "QUEEN";
				console.log("AA");
			}
		}
	}
}
