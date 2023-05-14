var origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';

//all possible winning combinations
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

//cells array to store and access all 9 boxes
const cells = document.querySelectorAll('.cell');
startGame();

function startGame() {
	//popup for replay of game
	document.querySelector(".endgame").style.display = "none";

	//initializing origin board with index numbers
	origBoard = Array.from(Array(9).keys());


	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
}


//to make square crossed
function turnClick(square) {
	if (typeof origBoard[square.target.id] == 'number') {
		turn(square.target.id, huPlayer)

		//if player hasn't won and it isn't a win
		setTimeout(() => {
			if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
		}, 500);

		
	}
}


//to make square crossed or circle
function turn(squareId, player) {

	//put value
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;


	let gameWon = checkWin(origBoard, player)
	if (gameWon) gameOver(gameWon)
}



function checkWin(board, player) {
	let plays = board.reduce((a, e, i) =>(e === player) ? a.concat(i) : a, []);//initial value of a is []
        //a is total value variable
        // e is current value
        //i is index
	let gameWon = null;


	//index traverses every object in array and win is "win combinations"
	for (let [index, win] of winCombos.entries()) {
        //condition checks if player has entered anything or not
		if (win.every(elem => plays.indexOf(elem) >-1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

//if someone won or its a tie
function gameOver(gameWon) {

	//show who and which combination won
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player == huPlayer ? "blue" : "red";
	}

	//remove clicking event
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");
}



function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}


//return which squares aren't played by anyone
function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');
}


//find the best possible move
function bestSpot() {
	return minimax(origBoard, aiPlayer).index;
}


//check if there is a tie
function checkTie() {

	//if all squares are occupied 
	if (emptySquares().length == 0) {
		
		let gameWon = checkWin(origBoard, huPlayer)
		if (gameWon) 
		{
			gameOver(gameWon);
			return;
		}

		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie Game!")
		return true;
	}
	return false;
}

//new board is the current board on which minmax is to be applied.
function minimax(newBoard, player) {
	var availSpots = emptySquares();

	//recursive condition to terminate :start

	//if the hu player is winning then score -10
	if (checkWin(newBoard, huPlayer)) {
		return {score: -10};
	} 
	
	//if the AI player is winning then score 10
	else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} 
	
	//if there is Tie . Return 0
	else if (availSpots.length === 0) {
		return {score: 0};
	}

	//recursive condition to terminate :end

	//Array for storing all the possible moves
	var moves = [];

	//iterate through all moves and check all possibilities
	for (var i = 0; i < availSpots.length; i++) {

		//move object to store the chosen sequence
		var move = {};

		//index is data field of move
		move.index = newBoard[availSpots[i]];
		//change the baord's square to X or O
		newBoard[availSpots[i]] = player;


		//recursive call with toggling player
		if (player == aiPlayer) {
			//recursion call
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {

			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		//if the move isn't chosen then put the index value back
		newBoard[availSpots[i]] = move.index;

		//push the chosen move object to moves array
		moves.push(move);
	}
	//end of for loop

	
	var bestMove;
	if(player === aiPlayer) {
		//check the bestmove for AI player
		var bestScore = -10000;

		//iterate over all possible moves and check the best score based
		//on score data field
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}



