const board = document.querySelector(".board");

const endGame = document.querySelector(".endgame");
const msg = document.querySelector(".msg");

const btnEndgameNewgame = document.querySelector(".endgame-newgame");
const resetBtn = document.querySelector(".reset");

const winPlayerX = document.querySelector(".win-player-x");
const winPlayerO = document.querySelector(".win-player-o");

let currentPlayer = "X";
let gameOver = false;

let playerXwin = 0;
let playerOwin = 0;

msg.textContent = `Player ${currentPlayer} turn`;

let cells = Array.from({ length: 9 }).fill(null);

const loadScores = () => {
  playerXwin = localStorage.getItem("playerXwin")
    ? parseInt(localStorage.getItem("playerXwin"))
    : 0;
  playerOwin = localStorage.getItem("playerOwin")
    ? parseInt(localStorage.getItem("playerOwin"))
    : 0;

  winPlayerX.textContent = playerXwin;
  winPlayerO.textContent = playerOwin;
};

loadScores();

resetBtn.onclick = () => {
  localStorage.removeItem("playerXwin");
  localStorage.removeItem("playerOwin");

  playerXwin = 0;
  playerOwin = 0;

  winPlayerX.textContent = playerXwin;
  winPlayerO.textContent = playerOwin;

  resetGame();
};

btnEndgameNewgame.onclick = () => {
  resetGame();
};

const handleClick = (e) => {
  if (gameOver) return;
  const cellIndex = e.target.dataset.index;
  // console.log(cellIndex);
  // Check If cell is Empty Or No
  if (cells[cellIndex]) return;
  updateCell(cellIndex, currentPlayer);
};

const updateCell = (index, value) => {
  cells[index] = value;
  const cell = board.querySelector(`[data-index="${index}"]`);

  cell.innerHTML =
    value === "X"
      ? `<div class="player-x"><span></span><span></span></div>`
      : `<div class="player-o"><span></span></div>`;
  cell.classList.add(value === "X" ? "player-x" : "player-o");

  const winner = checkWinner();
  if (winner || !cells.includes(null)) {
    gameOver = true;
    setTimeout(() => {
      msg.textContent = winner ? `Player ${winner} wins!` : "It's a Draw!";

      btnEndgameNewgame.style.display = "block";
      resetBtn.style.display = "block";
    }, 100);

    if (!winner) {
      board.querySelectorAll(".cell").forEach((cell) => {
        cell.classList.add("draw");
        setTimeout(() => cell.classList.remove("draw"), 1000);
      });
    }
  }

  // Switch Player
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  msg.textContent = `Player ${currentPlayer} turn`;
  // console.log(cells);
};

const checkWinner = () => {
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const combo of winningCombos) {
    // console.log(combo);
    const [a, b, c] = combo;
    // console.log(a, b, c);
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      combo.forEach((index) => {
        board.querySelector(`[data-index="${index}"]`).classList.add("winner");
      });

      if (cells[a] === "X") {
        playerXwin++;
        winPlayerX.textContent = playerXwin;
      } else {
        playerOwin++;
        winPlayerO.textContent = playerOwin;
      }

      setTimeout(() => {
        confetti({
          particleCount: 200, // More confetti particles
          spread: 100, // Spread angle
          origin: { y: 0.6 }, // Confetti starts from 60% height
        });
      }, 300); // Delay for a better effect

      localStorage.setItem("playerXwin", playerXwin);
      localStorage.setItem("playerOwin", playerOwin);
      return cells[a];
    }
  }
  return null;
};

const resetGame = () => {
  cells = Array.from({ length: 9 }).fill(null);
  currentPlayer = "X";
  msg.textContent = `Player ${currentPlayer} turn`;
  btnEndgameNewgame.style.display = "none";
  resetBtn.style.display = "none";
  board.querySelectorAll(".cell").forEach((cell) => {
    cell.innerHTML = "";
    cell.classList.remove("player-x", "player-o", "winner");
  });
  gameOver = false;
};

document.addEventListener("keydown", (e) => {
  if (e.key === "r") {
    resetGame();
  }
});

cells.forEach((cell, index) => {
  cell = document.createElement("div");
  cell.classList.add("cell");
  cell.dataset.index = index;

  cell.addEventListener("click", handleClick);

  cell.addEventListener("mouseenter", function () {
    if (!gameOver && !cells[cell.dataset.index]) {
      currentPlayer === "X"
        ? cell.classList.add("hover-x")
        : cell.classList.add("hover-o");
    }
  });

  cell.addEventListener("mouseleave", function () {
    cell.classList.remove("hover-x", "hover-o");
  });

  board.appendChild(cell);
});
