// A function that returns a query string to access individual cells in the game_board.
function get_cell_query(i, j) {
    return `#row${i} #column${j}`
}

// A function that returns a query string to access individual paragraphs inside cells in the game_board.
function get_paragraph_query(i, j) {
    return get_cell_query(i, j) + " > p";
}

document.querySelectorAll("[id*='row'] [id*='column']").forEach(el => {
    // Add a listener to the element that is triggered on click and calls the function handleClick().
    el.addEventListener('click', handleClick);
})

// A function to clear all paragraphs in the game_board.
function clear_board() {
    document.querySelectorAll("[id*='row'] [id*='column'] > p").forEach(el => el.innerHTML = "")
}

// A function that given an array of choice options returns a random one.
function random_choice(choices) {
    return choices[Math.floor(Math.random() * choices.length)];
}

// A function that initialises the data-data attribute of the game-board element to the stringified value of the variable game_board.
function init_game() {
    document.getElementById("game-board").setAttribute("data-data", JSON.stringify({
        game_board: [[null, null, null], [null, null, null], [null, null, null]],
        player: random_choice(["X", "O"]),
        game_over: false
    }));
}

// A function that loads the game_state object from the data-data attribute of the game-board element.
function get_game_state() {
    return JSON.parse(document.getElementById("game-board").getAttribute("data-data"));
}

// A function that seves the game_state object to the data-data attribute of the game-board element.
function save_game_state(game_state) {
    document.getElementById("game-board").setAttribute("data-data", JSON.stringify(game_state));
}

// A function to update the game_state after a move.
// The function takes the move as an argument.
// Load the game_state from the data-data attribute of the game-board element.
// Update the player variable in the game_state object to the 'X' if it was 'O' and 'O' if it was 'X'.
// Update the game_over variable in the game_state object to true if the game is over.
// Update the game_board variable in the game_state object to the new game_board given the location of the move.
// Save the game_state to the data-data attribute of the game-board element.

function update_game_state(move) {
    let game_state = get_game_state();
    console.log(game_state);
    game_state.game_board = update_game_board(game_state.game_board, move, game_state.player);
    game_state.game_over = check_win(game_state.game_board);
    game_state.player = game_state.player === "X" ? "O" : "X";
    save_game_state(game_state);
}

// A function that updates the game board given the move and the game_board.
// The function should return the new game_board.
function update_game_board(game_board, move, player) {
    let new_game_board = game_board.slice();
    new_game_board[move.i][move.j] = player;
    return new_game_board;
}

// A function that resets the game state if the game was won.
// The function should load the game_state from the data-data attribute of the game-board element.
function reset_if_won() {
    let game_state = get_game_state();
    if (game_state.game_over) {
        init_game();
    }
}

init_game();

// Create the function handleClick that is triggered on click.
// The function should print the id of the element that was clicked.
// The function should also print the id of the parent element.
function handleClick(event) {
    // Set the value of variable i to the number of the column that was clicked.
    let i = parseInt(event.target.id.slice(-1)) - 1;
    // Set the value of variable j to the number of the parent row that was clicked.
    let j = parseInt(event.target.parentElement.id.slice(-1)) - 1;

    // Update game state using the update_game_state function and passing the move as an argument.
    update_game_state({
        i: i,
        j: j
    });

    update_ui();

    reset_if_won();
}

// A function that updates the UI to reflect the current game state.
// The function should clear all paragraphs in the game_board.
// The function should update the paragraphs in the game_board to reflect the current game state.
// The function should update the announcement paragraph to reflect the current game state.
function update_ui() {
    clear_board();
    let game_state = get_game_state();

    if (game_state.game_over) {
        document.getElementById("announcement").innerHTML = `Game over! ${game_state.player === 'X' ? 'O' : 'X'} wins!`;
        return;
    }

    game_state.game_board.forEach((row, i) => {
        row.forEach((cell, j) => {
            if (cell !== null) {
                document.querySelector(get_paragraph_query(j + 1, i + 1)).innerHTML = cell;
            }
        })
    })
}


// Create a function that given the array game_board checks if any of the rows, columns or diagonals contain three of the same values.
// The function should return true if any of the rows, columns or diagonals contain three of the same values.
// The function should return false if no rows, columns or diagonals contain three of the same values.
function check_win(game_board) {
    for (let i = 0; i < game_board.length; i++) {
        if (game_board[i][0] === game_board[i][1] && game_board[i][1] === game_board[i][2] && game_board[i][0] !== null) {
            return true;
        }
    }
    for (let i = 0; i < game_board.length; i++) {
        if (game_board[0][i] === game_board[1][i] && game_board[1][i] === game_board[2][i] && game_board[0][i] !== null) {
            return true;
        }
    }
    if (game_board[0][0] === game_board[1][1] && game_board[1][1] === game_board[2][2] && game_board[0][0] !== null) {
        return true;
    }
    if (game_board[0][2] === game_board[1][1] && game_board[1][1] === game_board[2][0] && game_board[0][2] !== null) {
        return true;
    }
    return false;
}