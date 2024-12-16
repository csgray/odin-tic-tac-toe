function Square() {
    let value = "";

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

    function newBoard() {
        for (let row = 0; row < length; row++) {
            board[row] = [];
            for (let column = 0; column < length; column++) {
                board[row].push(Square());
            }
        }
    }

    function getBoard() {
        return board;
    }

    function getSquareValues() {
        return board.map(function (row) {
            return row.map(function (square) {
                return square.getValue();
            })
        })
    }

    function printBoard() {
        const boardWithSquareValues = getSquareValues();
        console.table(boardWithSquareValues);
    }

    function markSquare(row, column, player) {
        const square = board[row][column];

        if (square.getValue() !== "") {
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

    function checkDraw() {
        const boardWithSquareValues = getSquareValues();
        return !boardWithSquareValues.flat().includes("");
    }

    return { newBoard, getBoard, printBoard, markSquare, checkWinner, checkDraw }
})();

function Player(name, token) {
    return { name, token };
}

const gameController = (function () {
    const playerOne = Player("Player One", "X");
    const playerTwo = Player("Player Two", "O");
    let activePlayer = playerOne;

    function getActivePlayer() {
        return activePlayer.name;
    }

    function playRound(row, column) {
        gameboard.markSquare(row, column, activePlayer.token);

        if (gameboard.checkWinner(activePlayer.token)) {
            return activePlayer.name;
        }

        if (gameboard.checkDraw()) {
            return "draw";
        }

        // There was no winner so switch players and return
        activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
        return null;
    }

    function startNewGame() {
        activePlayer = playerOne;
        gameboard.newBoard();
    }

    return { getActivePlayer, playRound, startNewGame };
})();

function screenController() {
    const boardDiv = document.getElementById("board");
    const messageDiv = document.getElementById("message");
    const newGameButton = document.getElementById("new-game");

    function updateScreen() {
        boardDiv.textContent = "";

        const board = gameboard.getBoard();
        board.forEach(function (row, rowIndex) {
            row.forEach(function (square, columnIndex) {
                const squareButton = document.createElement("button");
                squareButton.classList.add("square");
                squareButton.dataset.row = rowIndex;
                squareButton.dataset.column = columnIndex;
                squareButton.textContent = square.getValue();
                boardDiv.appendChild(squareButton);
            })
        })
    }

    function clickHandlerBoard(event) {
        const selectedRow = event.target.dataset.row;
        const selectedColumn = event.target.dataset.column;
        // Check for valid square
        if (!selectedRow || !selectedColumn) return;

        const winner = gameController.playRound(selectedRow, selectedColumn);

        if (winner !== null) {
            if (winner === "draw") {
                messageDiv.textContent = "It's a draw."
            } else {
                messageDiv.textContent = `${winner} wins!`
            }
            boardDiv.removeEventListener("click", clickHandlerBoard);
            updateScreen();
            return;
        }

        messageDiv.textContent = `It is ${gameController.getActivePlayer()}'s turn.`
        updateScreen();
    }

    function startNewGame(event) {
        gameController.startNewGame();
        boardDiv.addEventListener("click", clickHandlerBoard);
        messageDiv.textContent = `It is ${gameController.getActivePlayer()}'s turn.`
        updateScreen();
    }

    newGameButton.addEventListener("click", startNewGame)
    startNewGame();
}

screenController();
