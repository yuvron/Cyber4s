class Piece {
	constructor(type, color, x, y) {
		this.type = type;
		this.color = color;
		this.x = x;
		this.y = y;
		this.isInStartingPosition = true;
	}

	getMoves(board) {
		switch (this.type) {
			case "PAWN":
				return this.getPawnMoves(board);
			case "ROOK":
				return this.getStraights(board);
			case "KNIGHT":
				return this.getKnightMoves(board);
			case "BISHOP":
				return this.getDiagonals(board);
			case "QUEEN":
				return this.getStraights(board).concat(this.getDiagonals(board));
			case "KING":
				return this.getStraights(board, true).concat(this.getDiagonals(board, true));
			default:
				return [];
		}
	}

	getPawnMoves(board) {
		const pawnMoves = [];
		const multiplier = this.color === "WHITE" ? 1 : -1;
		let newY = this.y + 1 * multiplier;
		//Regular moves
		if (!board[newY][this.x]) {
			pawnMoves.push([this.x, newY]);
			newY = this.y + 2 * multiplier;
			if (this.isInStartingPosition && !board[newY][this.x]) pawnMoves.push([this.x, newY]);
		}
		//Capturing moves
		newY = this.y + 1 * multiplier;
		let newX = this.x + 1;
		if (board[newY][newX] && board[newY][newX].color !== this.color) pawnMoves.push([newX, newY]);
		newX = this.x - 1;
		if (board[newY][newX] && board[newY][newX].color !== this.color) pawnMoves.push([newX, newY]);
		return pawnMoves;
	}

	getKnightMoves(board) {
		let knightMoves = [];
		let filter = (x, y) => {
			if (x >= 0 && x < 8 && y >= 0 && y < 8) {
				if (!board[y][x] || board[y][x].color !== this.color) knightMoves.push([x, y]);
			}
		};
		filter(this.x + 2, this.y + 1);
		filter(this.x + 2, this.y - 1);
		filter(this.x - 2, this.y + 1);
		filter(this.x - 2, this.y - 1);
		filter(this.x + 1, this.y + 2);
		filter(this.x + 1, this.y - 2);
		filter(this.x - 1, this.y + 2);
		filter(this.x - 1, this.y - 2);
		return knightMoves;
	}

	getStraights(board, once = false) {
		let straights = [];
		straights = straights.concat(this.getMovesByDirection(board, 1, 0, once)); //Checking moves to the right
		straights = straights.concat(this.getMovesByDirection(board, -1, 0, once)); //Checking moves to the left
		straights = straights.concat(this.getMovesByDirection(board, 0, 1, once)); //Checking moves up
		straights = straights.concat(this.getMovesByDirection(board, 0, -1, once)); //Checking moves down
		return straights;
	}

	getDiagonals(board, once = false) {
		let diagonals = [];
		diagonals = diagonals.concat(this.getMovesByDirection(board, 1, 1, once)); //Checking moves right and up diagonally
		diagonals = diagonals.concat(this.getMovesByDirection(board, -1, 1, once)); //Checking moves left and up diagonally
		diagonals = diagonals.concat(this.getMovesByDirection(board, 1, -1, once)); //Checking moves right and down diagonally
		diagonals = diagonals.concat(this.getMovesByDirection(board, -1, -1, once)); //Checking moves left and down diagonally
		return diagonals;
	}

	//Returns possible moves based on given direction
	getMovesByDirection(board, xInc, yInc, once = false) {
		let moves = [];
		let i = this.x + xInc;
		let j = this.y + yInc;
		while (i >= 0 && i < GAME_SIZE && j >= 0 && j < GAME_SIZE) {
			if (!board[j][i]) moves.push([i, j]);
			else {
				if (board[j][i].color !== this.color) moves.push([i, j]);
				return moves;
			}
			if (once) return moves;
			i += xInc;
			j += yInc;
		}
		return moves;
	}

	//Moving the piece to a new place
	//Returning true if a pawn reached the end of the board
	//isFinal tells the function if the movement is actually happening (when checking for checkmate 'demo' moves are taking place)
	move(x, y, isFinal = true) {
		if (this.isInStartingPosition && isFinal) this.isInStartingPosition = false;
		this.x = x;
		this.y = y;
		//If a pawn reaches the end it turns to a better piece
		if (this.type === "PAWN" && (this.y === GAME_SIZE - 1 || this.y === 0)) return true;
	}
}
