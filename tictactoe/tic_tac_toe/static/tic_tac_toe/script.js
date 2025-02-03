const board = Array(9).fill('');
let currentPlayer = 'X';
const cells = [];
const message = document.getElementById('message');
const restartButton = document.getElementById('restartButton');

function createBoard() {
    const boardContainer = document.getElementById('board');
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', handleCellClick);
        cells.push(cell);
        boardContainer.appendChild(cell);
    }
}

function handleCellClick(event) {
    const index = parseInt(event.target.dataset.index);
    if (board[index] === '' && !isGameOver()) {
        makeMove(index);
        if (!isGameOver()) {
            setTimeout(() => aiMove(), 500); // Simulate AI thinking time
        }
    }
}

function makeMove(index) {
    board[index] = currentPlayer;
    cells[index].textContent = currentPlayer;
    cells[index].classList.add('animate-win'); // Add animation
    checkGameState();
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function aiMove() {
    if (!isGameOver()) {
        const bestMove = findBestMove(board);
        makeMove(bestMove);
    }
}

function findBestMove(currentBoard) {
    const emptyCells = currentBoard.reduce((acc, cell, index) => {
        if (cell === '') acc.push(index);
        return acc;
    }, []);

    if (emptyCells.length === 9) return 4; // Start in the center

    let bestScore = -Infinity;
    let move;

    for (const cell of emptyCells) {
        currentBoard[cell] = 'O';
        const score = minimax(currentBoard, 0, false);
        currentBoard[cell] = '';
        if (score > bestScore) {
            bestScore = score;
            move = cell;
        }
    }

    return move;
}

function minimax(currentBoard, depth, isMaximizing) {
    const result = checkWinner(currentBoard);
    if (result === 'O') return 10 - depth;
    if (result === 'X') return depth - 10;
    if (!currentBoard.includes('')) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (currentBoard[i] === '') {
                currentBoard[i] = 'O';
                const score = minimax(currentBoard, depth + 1, false);
                currentBoard[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (currentBoard[i] === '') {
                currentBoard[i] = 'X';
                const score = minimax(currentBoard, depth + 1, true);
                currentBoard[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinner(currentBoard) {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const combo of winningCombinations) {
        if (currentBoard[combo[0]] && 
            currentBoard[combo[0]] === currentBoard[combo[1]] && 
            currentBoard[combo[0]] === currentBoard[combo[2]]) {
            return currentBoard[combo[0]];
        }
    }

    return currentBoard.includes('') ? null : 'draw';
}

function checkGameState() {
    const result = checkWinner(board);
    if (result === 'X') {
        message.textContent = "You win!";
        disableCells();
    } else if (result === 'O') {
        message.textContent = "AI wins!";
        disableCells();
    } else if (result === 'draw') {
        message.textContent = "It's a draw!";
        disableCells();
    }
}

function disableCells() {
    cells.forEach(cell => cell.classList.add('disabled'));
}

function isGameOver() {
    return checkWinner(board) !== null;
}

restartButton.addEventListener('click', () => {
    board.fill('');
    currentPlayer = 'X';
    message.textContent = '';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('disabled', 'animate-win');
    });
    restartButton.classList.add('clicked'); // Add animation class
    setTimeout(() => restartButton.classList.remove('clicked'), 300); // Remove animation class after animation
});

createBoard();
