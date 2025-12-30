/**
 * Yashu Tic-Tac-Toe - Game Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const cells = document.querySelectorAll('.cell');
    const statusText = document.getElementById('game-status');
    const restartBtn = document.getElementById('restart-btn');
    const newGameBtn = document.getElementById('new-game-btn');
    const playerXInput = document.getElementById('player-x-name');
    const playerOInput = document.getElementById('player-o-name');
    const cardX = document.getElementById('card-x');
    const cardO = document.getElementById('card-o');
    const winnerOverlay = document.getElementById('winner-overlay');
    const winnerMsg = document.getElementById('winner-text');
    const overlayClose = document.getElementById('overlay-close');

    // Game State
    let currentPlayer = 'X';
    let board = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let playerXName = 'Player X';
    let playerOName = 'Player O';

    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    // Functions
    const updateNames = () => {
        playerXName = playerXInput.value.trim() || 'Player X';
        playerOName = playerOInput.value.trim() || 'Player O';
        updateStatus();
    };

    const updateStatus = () => {
        // Only update if we are not currently showing a DB status message
        if (statusText.style.color === 'rgb(16, 185, 129)' || statusText.style.color === 'rgb(239, 68, 68)') {
            return;
        }

        const name = currentPlayer === 'X' ? playerXName : playerOName;
        statusText.textContent = `${name}'s Turn (${currentPlayer})`;
        statusText.style.color = 'var(--text-muted)';

        // Update active player card highlighting
        if (currentPlayer === 'X') {
            cardX.classList.add('active');
            cardO.classList.remove('active');
        } else {
            cardO.classList.add('active');
            cardX.classList.remove('active');
        }
    };

    const handleCellClick = (e) => {
        const cell = e.target;
        const index = parseInt(cell.getAttribute('data-index'));

        if (board[index] !== '' || !gameActive) return;

        updateNames(); // Ensure names are fresh
        makeMove(index, cell);
        checkResult();
    };

    const makeMove = (index, cell) => {
        board[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer.toLowerCase(), 'occupied');
    };

    const checkResult = () => {
        let roundWon = false;
        let winningLine = [];

        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                roundWon = true;
                winningLine = [a, b, c];
                break;
            }
        }

        if (roundWon) {
            const winnerName = currentPlayer === 'X' ? playerXName : playerOName;
            showWinner(`${winnerName} (${currentPlayer}) Wins!`, winningLine);
            gameActive = false;
            return;
        }

        if (!board.includes('')) {
            showWinner('Match Draw!', []);
            gameActive = false;
            return;
        }

        // Switch player
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateStatus();
    };

    const saveResult = async (winnerSymbolOrDraw) => {
        let winnerName = winnerSymbolOrDraw;
        if (winnerSymbolOrDraw === 'X') winnerName = playerXName;
        if (winnerSymbolOrDraw === 'O') winnerName = playerOName;

        const resultData = {
            playerX: playerXName,
            playerO: playerOName,
            winner: winnerName
        };

        try {
            const response = await fetch('http://localhost:5000/api/results', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(resultData)
            });
            const data = await response.json();
            console.log('Result saved:', data);

            // Show a subtle toast or log message
            statusText.textContent = `✅ Result saved to database!`;
            statusText.style.color = '#10b981'; // Green color
            setTimeout(updateStatus, 3000); // Revert to turn status after 3s
        } catch (error) {
            console.error('Error saving result to database:', error);
            statusText.textContent = `❌ Database error (Check .env)`;
            statusText.style.color = '#ef4444'; // Red color
            setTimeout(updateStatus, 3000);
        }
    };

    const showWinner = (message, winningLine) => {
        winnerMsg.textContent = message;

        // Save result to DB
        if (winningLine.length > 0) {
            saveResult(currentPlayer);
        } else {
            saveResult('Draw');
        }

        // Highlight winning cells
        winningLine.forEach(index => {
            cells[index].classList.add('winning-cell');
        });

        // Show overlay with a slight delay for dramatic effect
        setTimeout(() => {
            winnerOverlay.classList.remove('hidden');
        }, 500);
    };

    const restartGame = () => {
        currentPlayer = 'X';
        board = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;

        cells.forEach(cell => {
            cell.textContent = '';
            cell.className = 'cell';
        });

        winnerOverlay.classList.add('hidden');
        updateStatus();
    };

    const newGame = () => {
        playerXInput.value = '';
        playerOInput.value = '';
        playerXName = 'Player X';
        playerOName = 'Player O';
        restartGame();
    };

    // Event Listeners
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    restartBtn.addEventListener('click', restartGame);
    newGameBtn.addEventListener('click', newGame);
    overlayClose.addEventListener('click', restartGame);

    // Auto-update names as user types
    playerXInput.addEventListener('input', updateNames);
    playerOInput.addEventListener('input', updateNames);

    // Initial status
    updateStatus();
});
