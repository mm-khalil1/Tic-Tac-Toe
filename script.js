/*
Tic-Tac-Toe Game

This script implements a simple tic-tac-toe game using HTML, CSS, and JavaScript.
Players take turns clicking on cells in a grid to place their marks (X or O). 
The game checks for a winner or a tie after each move and displays appropriate messages.
The game board is dynamically generated based on the specified number of rows.
Players can reset the game at any time.

Author: Mahmoud Khalil
Date: 22-02-2024

Instructions:
- Click on a cell to place your mark (X or O).
- The first player to get three marks in a row (horizontally, vertically, or diagonally) wins.
- If all cells are filled and no winner is found, the game ends in a tie.
- Click the "Reset" button to start a new game.
*/

// Constants
const NUMBER_OF_ROWS = 3;
const boxesTotal = NUMBER_OF_ROWS ** 2;

// Global Variables
let boxesCounter = 0;
let currentPlayer = 'X';
let gameBoard = Array.from({ length: NUMBER_OF_ROWS }, () => Array(NUMBER_OF_ROWS).fill('_'));

// Function to get row and column position from index
const getCellPosition = (index, numberOfRows) => {
    const row = Math.floor(index / numberOfRows);
    const col = index % numberOfRows;
    return [row, col];
}

// Function to check for a winner
const checkForWinner = () => {
    // Generate all possible lines on the game board (rows, columns, diagonals)
    const boardLines = [
        ...gameBoard,
        ...gameBoard.map((_, i) => gameBoard.map(row => row[i])),
        gameBoard.map((row, i) => row[i]),
        gameBoard.map((row, i) => row[gameBoard.length - i - 1])
    ];

    // Check each line for a winner
    for (let line of boardLines) {
        if (line[0] !== '_' && line.every(cell => cell === line[0])) {
            return true; // If all elements in the line are the same and not '_'
        }
    }
    return false; // If no winner is found in any line
}

// Function to check for a tie
const checkForTie = () => !gameBoard.some(row => row.includes('_'));

// Function to display win message
const runWinMessage = (player) => {
    setTimeout(() => {
        alert(`Player ${player} Won!`);
        resetBoard();
    }, 100);
}

// Function to display tie message
const runTieMessage = () => {
    setTimeout(() => {
        alert(`It's a Tie!`);
        resetBoard();
    }, 100);
}

// Function to update cell content and style
const printMarkInCell = (cell, mark) => {
    cell.querySelector('.value').textContent = mark;
    cell.classList.add(`cell--${mark}`);
}

// Event handler for cell click
const cellClickHandler = (event, index) => {
    const cell = event.target;
    const [row, col] = getCellPosition(index, NUMBER_OF_ROWS);

    // Check if cell is empty
    if (gameBoard[row][col] === '_'){
        gameBoard[row][col] = currentPlayer;
        boxesCounter++;
        printMarkInCell(cell, currentPlayer);

        // Check for winner
        if (checkForWinner()) {
            runWinMessage(currentPlayer);
            return;
        }

        // Check for tie
        if (checkForTie()) {
            runTieMessage();
            return;
        }
    
        // Toggle currentPlayer
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}

// Function to create cell for the board
const createCell = (index) => {
    const cellElementString = `<div class="cell" role="button" tabindex="${index + 1}"><span class="value"></span></div>`;
    const cellElement = document.createRange().createContextualFragment(cellElementString);

    cellElement.querySelector('.cell').onclick = (event) => cellClickHandler(event, index);
    cellElement.querySelector('.cell').onkeydown = (event) => 
        event.key === 'Enter' ? cellClickHandler(event, index) : true;
    
    return cellElement;
}

// Function to create game board
const createBoard = () => {
    const container = document.querySelector('.container');
    const board = document.createElement('div');
    board.classList.add('board');
    
    // Create cells and add event listeners
    for (let i = 0; i < boxesTotal; i++) {
        const cellElement = createCell(i)
        board.appendChild(cellElement);
        document.documentElement.style.setProperty('--grid-rows', NUMBER_OF_ROWS);
    }

    // Add board to container
    container.insertAdjacentElement('afterbegin', board);
}

// Function to reset the game board
const resetBoard = () => {
    const cells = document.querySelectorAll('.cell');
    
    // Reset game state
    boxesCounter = 0;
    currentPlayer = 'X';
    gameBoard.forEach(row => row.fill('_'));

    // Clear cells content and styles
    cells.forEach(cell => {
        cell.querySelector('.value').textContent = '';
        cell.classList.remove('cell--X', 'cell--O');
    });
}

// Initialize game board
createBoard();

// Event listener for reset button
document.querySelector('#reset').onclick = () => resetBoard();
