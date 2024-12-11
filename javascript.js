function Square() {
    let value = "_";

    function addToken(player) {
        value = player;
    };

    function getValue() {
        return value
    };

    return {
        addToken,
        getValue
    };
}

const gameboard = (function () {
    const length = 3;
    const board = [];

    // 2D array
    for (let row = 0; row < length; row++) {
        board[row] = [];
        for (let column = 0; column < length; column++) {
            board[row].push(Square());
        }
    }

    function printBoard() {
        const boardWithSquareValues = board.map(function (row) {
            return row.map(function (square) {
                return square.getValue();
            })
        })
        console.table(boardWithSquareValues);
    }

    function markSquare(row, column, player) {
        const square = board[row][column];

        if (square.getValue() !== "_") {
            throw new Error("Invalid move! That square is already taken.");
        } else {
            square.addToken(player);
        }
    }

    function checkWinner(playerToken) {
        function allPlayerMarked(arr) {
            return arr.every(function (value) {
                return value === playerToken;
            })
        }

        // Check rows
        for (let row = 0; row < length; row++) {
            const rowValues = board[row].map(function (square) {
                return square.getValue();
            })
            if (allPlayerMarked(rowValues)) {
                return true;
            }
        }

        // Check columns
        for (let col = 0; col < length; col++) {
            const columnValues = board.map(function (row) {
                return row[col].getValue();
            })
            if (allPlayerMarked(columnValues)) {
                return true;
            }
        }

        // Check diagonals
        const topLefToBottomRightValues = [];
        const topRightToBottomLeftValues = [];
        for (let value = 0; value < length; value++) {
            topLefToBottomRightValues.push(board[value][value].getValue());
            // Negative indices start at -1, so we have to negate the value then offset it
            topRightToBottomLeftValues.push(board[value].at(-value - 1).getValue());
        }
        if (allPlayerMarked(topLefToBottomRightValues) || allPlayerMarked(topRightToBottomLeftValues)) {
            return true;
        }

        return false;
    }

    return { printBoard, markSquare, checkWinner }
})();

function player(name, token) {
    return { name, token };
}

const gameController = (function () {
    const playerOne = player("Player One", "X");
    const playerTwo = player("Player Two", "O");

    function playRound(player) {
        console.log(`It is ${player.name}'s turn.`)
        const row = prompt("Which row?");
        const column = prompt("Which column?");
        gameboard.markSquare(row, column, player.token);

        if (gameboard.checkWinner(player.token) === true) {
            gameboard.printBoard();
            console.log(`${player.name} wins!`)
            return true;
        }

        return false;
    }

    function playGame() {
        console.log("Let's play Tic Tac Toe!")

        let winner = false;
        let activePlayer = playerOne;
        do {
            gameboard.printBoard();
            winner = playRound(activePlayer);
            activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
        } while (winner === false);
    }

    return { playGame };
})();
