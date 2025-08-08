const Player = (name, marker) => {
    return {name, marker}
}

const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };

    const setCell = (index, marker) => {
        if (board[index] === "") {
            board[index] = marker;
            return true;
        }
        return false;
    }

    const isFull = () => board.every(cell => cell !== "");

    const checkWin = (marker) => {
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6],
        ];
        return winConditions.some(condition =>
            condition.every(index => board[index] === marker)
        );
    };

    return { getBoard, setCell, resetBoard, checkWin, isFull };
})();

const GameController = (() => {
    let player1, player2, currentPlayer;
    let gameActive = false;

    const startGame = (name1, name2) => {
        player1 = Player(name1, "X");
        player2 = Player(name2, "O");
        currentPlayer = player1;
        gameActive = true;
        Gameboard.resetBoard();
        DisplayController.render();
        DisplayController.setMessage(`${currentPlayer.name}'s turn`);
    };

    const playRound = (index) => {
        if (!gameActive) return;
        if (Gameboard.setCell(index, currentPlayer.marker)) {
        DisplayController.render();
        if (Gameboard.checkWin(currentPlayer.marker)) {
            DisplayController.setMessage(`${currentPlayer.name} wins!`);
            gameActive = false;
        } else if (Gameboard.isFull()) {
            DisplayController.setMessage("It's a tie!");
            gameActive = false;
        } else {
            currentPlayer = currentPlayer === player1 ? player2 : player1;
            DisplayController.setMessage(`${currentPlayer.name}'s turn`);
        }
        }
    };

    const restartGame = () => {
        gameActive = true;
        Gameboard.resetBoard();
        currentPlayer = player1;
        DisplayController.render();
        DisplayController.setMessage(`${currentPlayer.name}'s turn`);
    };
    return { startGame, playRound, restartGame };
})();

const DisplayController = (() => {
  const boardDiv = document.getElementById("gameboard");
  const messageDiv = document.getElementById("game-message");

  const render = () => {
    boardDiv.innerHTML = "";
    Gameboard.getBoard().forEach((cell, index) => {
      const cellDiv = document.createElement("div");
      cellDiv.classList.add("square");
      cellDiv.textContent = cell;
      if (cell !== "") {
        cellDiv.classList.add("taken");
      } else {
        cellDiv.addEventListener("click", () => GameController.playRound(index));
      }
      boardDiv.appendChild(cellDiv);
    });
  };

  const setMessage = (msg) => {
    messageDiv.textContent = msg;
  };

  return { render, setMessage };
})();

document.getElementById("start-btn").addEventListener("click", (e) => {
    e.preventDefault();
    const p1 = document.getElementById("player1").value.trim();
    const p2 = document.getElementById("player2").value.trim();

  GameController.startGame(p1, p2);
});

document.getElementById("restart-btn").addEventListener("click", () => {
  GameController.restartGame();
});