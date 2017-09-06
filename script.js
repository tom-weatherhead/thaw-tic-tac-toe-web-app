// thaw-tic-tac-toe-web-app/script.js

const nBoardDimension = 3;
const nBoardWidth = nBoardDimension;
const nBoardHeight = nBoardDimension;
const nBoardArea = nBoardWidth * nBoardHeight;

const EmptyNumber = -1;
const XNumber = 0;
const ONumber = 1;

const PlayerNames = ['X', 'O'];

let boardPopulation;
let aBoardImageNumbers = null;	// new Array(nBoardArea);
let NumberOfCurrentPlayer;
let PlayerIsAutomated = [false, true];
let PlayerPly = [6, 6];

let isGameOver;
let isXVictory;
let isOVictory;

// **** Function Declarations ****

function isVictory (player, row, column) {
	// 1) Check the specified row.
	let victory = true;

	for (let column2 = 0; column2 < nBoardDimension; ++column2) {

		if (aBoardImageNumbers[row * nBoardDimension + column2] !== player) {
			victory = false;
			break;
		}
	}

	if (victory) {
		return true;
	}

	// 2) Check the specified column.
	victory = true;

	for (var row2 = 0; row2 < nBoardDimension; ++row2) {

		if (aBoardImageNumbers[row2 * nBoardDimension + column] !== player) {
			victory = false;
			break;
		}
	}

	if (victory) {
		return true;
	}

	if (row === column) {
		// 3) Check the primary diagonal.
		victory = true;

		for (var i = 0; i < nBoardDimension; ++i) {

			if (aBoardImageNumbers[i * nBoardDimension + i] !== player) {
				victory = false;
				break;
			}
		}

		if (victory) {
			return true;
		}
	}

	if (row + column === nBoardDimension - 1) {
		// 4) Check the secondary diagonal.
		victory = true;

		for (i = 0; i < nBoardDimension; ++i) {

			if (aBoardImageNumbers[i * nBoardDimension + nBoardDimension - 1 - i] !== player) {
				victory = false;
				break;
			}
		}

		if (victory) {
			return true;
		}
	}

	return false;
}

function placePiece (player, row, column) {
	// If player is X or O, the square being written to must be empty just before the move is made.
	// If player is Empty, the square being written to must be non-empty just before the move is made, and displayMove must be false.

	if (row < 0 || row >= nBoardDimension) {
		alert('PlacePiece() : row ' + row + ' is out of range; nBoardDimension == ' + nBoardDimension);	// eslint-disable-line no-alert

		return false;
	}

	if (column < 0 || column >= nBoardDimension) {
		alert('PlacePiece() : column is out of range.');	// eslint-disable-line no-alert

		return false;
	}

	var oldSquareContent = aBoardImageNumbers[row * nBoardDimension + column];

	if (player !== EmptyNumber) {

		if (oldSquareContent !== EmptyNumber) {
			alert('PlacePiece() : Attempted to write an X or an O into a non-empty square.');	// eslint-disable-line no-alert

			return false;
		}
	} else if (oldSquareContent === EmptyNumber) {
		alert('PlacePiece() : Attempted to erase an already-empty square.');	// eslint-disable-line no-alert

		return false;
	}

	aBoardImageNumbers[row * nBoardDimension + column] = player;

	if (player === EmptyNumber) {
		--boardPopulation;
	} else {
		++boardPopulation;
	}

	const victory = player !== EmptyNumber && isVictory(player, row, column);

	return victory; // This can return true for real or speculative moves.
}

function getImagePath (imageNumber) {
	var imageName = 'empty';

	if (imageNumber === XNumber) {
		imageName = 'x';
	} else if (imageNumber === ONumber) {
		imageName = 'o';
	}

	return 'images/' + imageName + '.png';
}

function displayTurnMessage () {
	let turnMessage;

	if (!isGameOver) {
		turnMessage = PlayerNames[NumberOfCurrentPlayer];

		if (PlayerIsAutomated[NumberOfCurrentPlayer]) {
			turnMessage = turnMessage + ' is thinking...';
		} else {
			turnMessage = turnMessage + '\'s turn.';
		}
	} else {

		if (isXVictory) {
			turnMessage = PlayerNames[XNumber] + ' wins.';
		} else if (isOVictory) {
			turnMessage = PlayerNames[ONumber] + ' wins.';
		} else {
			turnMessage = 'Tie game.';
		}

		turnMessage = 'Game over; ' + turnMessage;
	}

	$('#turnMessage').html(turnMessage);	// eslint-disable-line no-undef
}

function moveHelper (row, col) {
	let winningMove = placePiece(NumberOfCurrentPlayer, row, col);

	$('[name=\'squares\']').eq(row * nBoardDimension + col).prop('src', getImagePath(NumberOfCurrentPlayer));	// eslint-disable-line no-undef

	isGameOver = winningMove || boardPopulation === nBoardArea;

	if (winningMove) {

		if (NumberOfCurrentPlayer === XNumber) {
			isXVictory = true;
		} else {
			isOVictory = true;
		}
	}

	NumberOfCurrentPlayer = 1 - NumberOfCurrentPlayer;
	displayTurnMessage();

	if (!isGameOver && PlayerIsAutomated[NumberOfCurrentPlayer]) {
		// Wait for 100 ms before the next move to give the browser time to update the board.
		setTimeout(automatedMove, 100);		// eslint-disable-line no-use-before-define
	}
}

function getJSONTicTacToeRequest (boardString, maxPly, descriptor = {}) {
	let url = '/tictactoe/' + boardString + '/' + maxPly;

	if (descriptor.protocol || descriptor.name || descriptor.port) {
		const webServerProtocol = descriptor.protocol || 'http';
		const webServerName = descriptor.name || 'localhost';
		const webServerPort = descriptor.port || 3001;

		url = webServerProtocol + '://' + webServerName + ':' + webServerPort + url;
	}

	// This is essentially an augmented version of jQuery's AJAX $.getJSON()
	// See https://api.jquery.com/jquery.getjson/
	$.ajax({								// eslint-disable-line no-undef
		dataType: 'json',
		url: url,
		success: function (result) {
			moveHelper(result.bestRow, result.bestColumn);
		},
		error: function (error) {
			const message = 'getJSONTicTacToeRequest() sent to \'' + url + '\' failed; error is: ' + error.status + ' ' + error.statusText;

			console.error(message);
			alert(message);									// eslint-disable-line no-alert
		}
	});
}

function automatedMove () {
	let boardString = aBoardImageNumbers.map(n => {

		if (n === 0) {
			return 'X';
		} else if (n === 1) {
			return 'O';
		} else {
			return 'E';
		}
	}).join('');

	getJSONTicTacToeRequest(boardString, PlayerPly[NumberOfCurrentPlayer]);
}

function squareClicked (i) {			// eslint-disable-line no-unused-vars

	if (isGameOver || PlayerIsAutomated[NumberOfCurrentPlayer]) {
		return;
	}

	var row = parseInt(i / nBoardWidth, 10);
	var col = i % nBoardWidth;

	moveHelper(row, col);
}

function populateLookaheadDDL (ddlID) {
	// Clear the list.
	$('#' + ddlID).html('');	// eslint-disable-line no-undef

	for (var i = 1; i <= 9; ++i) {
		// Perhaps we could reverse this and use append instead of appendTo.
		$('<option>' + i + '</option>').appendTo('#' + ddlID);	// eslint-disable-line no-undef
	}
}

function newGame () {
	var pathToEmptyImage = getImagePath(EmptyNumber);

	for (var i = 0; i < aBoardImageNumbers.length; ++i) {
		aBoardImageNumbers[i] = EmptyNumber;
	}

	$('[name=\'squares\']').each(function () {		// eslint-disable-line no-undef
		$(this).prop('src', pathToEmptyImage);		// eslint-disable-line no-undef
	});

	NumberOfCurrentPlayer = XNumber;
	boardPopulation = 0;
	isGameOver = false;
	isXVictory = false;
	isOVictory = false;
	displayTurnMessage();

	if (PlayerIsAutomated[NumberOfCurrentPlayer]) {
		setTimeout(automatedMove, 100);
	}
}

function constructBoard () {
	var pathToEmptyImage = getImagePath(EmptyNumber);
	var i = 0;

	for (var r = 0; r < nBoardHeight; ++r) {
		var rowName = 'row' + r;

		$('<tr id=\'' + rowName + '\'></tr>').appendTo('#board');	// eslint-disable-line no-undef

		for (var c = 0; c < nBoardWidth; ++c) {
			$('<td><img name=\'squares\' class=\'tightBox\' src=\'' + pathToEmptyImage + '\' onclick=\'squareClicked(' + i + ')\' /></td>').appendTo('#' + rowName);	// eslint-disable-line no-undef
			++i;
		}
	}

	populateLookaheadDDL('ddlLookaheadX');
	populateLookaheadDDL('ddlLookaheadO');

	$('#cbAutomateX').prop('checked', PlayerIsAutomated[XNumber]);		// eslint-disable-line no-undef
	$('#cbAutomateO').prop('checked', PlayerIsAutomated[ONumber]);		// eslint-disable-line no-undef
	$('#ddlLookaheadX').val(PlayerPly[XNumber]);						// eslint-disable-line no-undef
	$('#ddlLookaheadO').val(PlayerPly[ONumber]);						// eslint-disable-line no-undef
	$('#ddlLookaheadX').prop('disabled', !PlayerIsAutomated[XNumber]);	// eslint-disable-line no-undef
	$('#ddlLookaheadO').prop('disabled', !PlayerIsAutomated[ONumber]);	// eslint-disable-line no-undef
	aBoardImageNumbers = new Array(nBoardArea);
	newGame();
}

function onPageLoad () {
	constructBoard();
}

function cbAutomateX_onChange () {					// eslint-disable-line no-unused-vars
	PlayerIsAutomated[XNumber] = $('#cbAutomateX').prop('checked');			// eslint-disable-line no-undef
	$('#ddlLookaheadX').prop('disabled', !PlayerIsAutomated[XNumber]);		// eslint-disable-line no-undef

	if (!isGameOver && PlayerIsAutomated[XNumber] && NumberOfCurrentPlayer === XNumber) {
		automatedMove();
	}
}

function cbAutomateO_onChange () {					// eslint-disable-line no-unused-vars
	PlayerIsAutomated[ONumber] = $('#cbAutomateO').prop('checked');			// eslint-disable-line no-undef
	$('#ddlLookaheadO').prop('disabled', !PlayerIsAutomated[ONumber]);		// eslint-disable-line no-undef

	if (!isGameOver && PlayerIsAutomated[ONumber] && NumberOfCurrentPlayer === ONumber) {
		automatedMove();
	}
}

function ddlLookaheadX_onChange () {					// eslint-disable-line no-unused-vars
	PlayerPly[XNumber] = parseInt($('#ddlLookaheadX').val(), 10);			// eslint-disable-line no-undef
}

function ddlLookaheadO_onChange () {					// eslint-disable-line no-unused-vars
	PlayerPly[ONumber] = parseInt($('#ddlLookaheadO').val(), 10);			// eslint-disable-line no-undef
}

// **** jQuery Function Declarations ****

$(document).ready(function () {			// eslint-disable-line no-undef
	onPageLoad();
});
