// Tic-Tac-Toe - Script.js - Javascript - March 8, 2014

// **** Global Variable Declarations ****

var nBoardDimension = 3;
var nBoardWidth = nBoardDimension;
var nBoardHeight = nBoardDimension;
var nBoardArea = nBoardWidth * nBoardHeight;
var boardPopulation;
var aBoardImageNumbers = null;  // new Array(nBoardArea);
var EmptyNumber = -1;
var victoryValue = 100;
var defeatValue = -victoryValue;

var XNumber = 0;
var ONumber = 1;
var NumberOfCurrentPlayer;
var boardPopulation;
var PlayerNames = ["X", "O"];
// var PlayerIsAutomated = [false, false];
var PlayerIsAutomated = [false, true];
var PlayerPly = [6, 6];
var isGameOver;
var isXVictory;
var isOVictory;

// **** jQuery Function Declarations ****

$(document).ready(function () {
    onPageLoad();
});

// **** Function Declarations ****

function isVictory(player, row, column)
{
    // 1) Check the specified row.
    var victory = true;

    for (var column2 = 0; column2 < nBoardDimension; ++column2)
    {

        if (aBoardImageNumbers[row * nBoardDimension + column2] != player)
        {
            victory = false;
            break;
        }
    }

    if (victory)
    {
        return true;
    }

    // 2) Check the specified column.
    victory = true;

    for (var row2 = 0; row2 < nBoardDimension; ++row2)
    {

        if (aBoardImageNumbers[row2 * nBoardDimension + column] != player)
        {
            victory = false;
            break;
        }
    }

    if (victory)
    {
        return true;
    }

    if (row == column)
    {
        // 3) Check the primary diagonal.
        victory = true;

        for (var i = 0; i < nBoardDimension; ++i)
        {

            if (aBoardImageNumbers[i * nBoardDimension + i] != player)
            {
                victory = false;
                break;
            }
        }

        if (victory)
        {
            return true;
        }
    }

    if (row + column == nBoardDimension - 1)
    {
        // 4) Check the secondary diagonal.
        victory = true;

        for (var i = 0; i < nBoardDimension; ++i)
        {

            if (aBoardImageNumbers[i * nBoardDimension + nBoardDimension - 1 - i] != player)
            {
                victory = false;
                break;
            }
        }

        if (victory)
        {
            return true;
        }
    }

    return false;
}

function placePiece(player, row, column, displayMove) // displayMove is not used.
{
    // If player is X or O, the square being written to must be empty just before the move is made.
    // If player is Empty, the square being written to must be non-empty just before the move is made, and displayMove must be false.

    if (row < 0 || row >= nBoardDimension)
    {
        alert("PlacePiece() : row " + row + " is out of range; nBoardDimension == " + nBoardDimension);
        return false;
    }

    if (column < 0 || column >= nBoardDimension)
    {
        alert("PlacePiece() : column is out of range.");
        return false;
    }

    var oldSquareContent = aBoardImageNumbers[row * nBoardDimension + column];

    if (player != EmptyNumber)
    {

        if (oldSquareContent != EmptyNumber)
        {
            alert("PlacePiece() : Attempted to write an X or an O into a non-empty square.");
            return false;
        }
    }
    else
    {

        if (oldSquareContent == EmptyNumber)
        {
            alert("PlacePiece() : Attempted to erase an already-empty square.");
            return false;
        }
    }

    aBoardImageNumbers[row * nBoardDimension + column] = player;

    if (player == EmptyNumber)
    {
        --boardPopulation;
    }
    else
    {
        ++boardPopulation;
    }

    var victory = player != EmptyNumber && isVictory(player, row, column);

    return victory; // This can return true for real or speculative moves.
}

// ****

function getImagePath(imageNumber) {
    var imageName = "empty";

    if (imageNumber == XNumber) {
        imageName = "x";
    } else if (imageNumber == ONumber) {
        imageName = "o";
    }

    return "images/" + imageName + ".png";
}

function displayTurnMessage() {
    var turnMessage;

    if (!isGameOver) {
        turnMessage = PlayerNames[NumberOfCurrentPlayer];

        if (PlayerIsAutomated[NumberOfCurrentPlayer]) {
            turnMessage = turnMessage + " is thinking...";
        } else {
            turnMessage = turnMessage + "'s turn.";
        }
    } else {

        if (isXVictory) {
            turnMessage = PlayerNames[XNumber] + " wins.";
        } else if (isOVictory) {
            turnMessage = PlayerNames[ONumber] + " wins.";
        } else {
            turnMessage = "Tie game.";
        }

        turnMessage = "Game over; " + turnMessage;
    }

    $("#turnMessage").html(turnMessage);
}

function moveHelper(row, col) {
    var isVictory = placePiece(NumberOfCurrentPlayer, row, col, true);

    $("[name='squares']").eq(row * nBoardDimension + col).prop("src", getImagePath(NumberOfCurrentPlayer));

    isGameOver = isVictory || boardPopulation == nBoardArea;

    if (isVictory) {

        if (NumberOfCurrentPlayer == XNumber) {
            isXVictory = true;
        } else {
            isOVictory = true;
        }
    }

    NumberOfCurrentPlayer = 1 - NumberOfCurrentPlayer;
    displayTurnMessage();

    if (!isGameOver && PlayerIsAutomated[NumberOfCurrentPlayer]) {
        setTimeout("automatedMove()", 100);     // Wait for 100 ms before the next move to give the browser time to update the board.
    }
}

function getJSONTicTacToeRequest (boardString, maxPly, descriptor = {}) {
	let webServerProtocol = descriptor.protocol || 'http';
	let webServerName = descriptor.name || 'localhost';
	let webServerPort = descriptor.port || 3000;
	// let url = webServerProtocol + '://' + webServerName + ':' + webServerPort + '/tictactoe/' + boardString.replace(/ /g, 'E') + '/' + maxPly;
	// let url = webServerProtocol + '://' + webServerName + ':' + webServerPort + '/tictactoe/' + boardString + '/' + maxPly;
	let url = '/tictactoe/' + boardString + '/' + maxPly;

	// This is essentially an augmented version of jQuery's AJAX $.getJSON()
	// See https://api.jquery.com/jquery.getjson/
	$.ajax({								// eslint-disable-line no-undef
		dataType: 'json',
		url: url,
		success: function (result) {
			// const message = 'getJSONRequest() sent to \'' + url + '\' succeeded; result is:';

			// console.log(message, result);
			// alert(message + ' ' + JSON.stringify(result));	// eslint-disable-line no-alert
			moveHelper(result.bestRow, result.bestColumn);
		},
		error: function (error) {
			const message = 'getJSONTicTacToeRequest() sent to \'' + url + '\' failed; error is: ' + error.status + ' ' + error.statusText;

			console.error(message);
			alert(message);									// eslint-disable-line no-alert
		}
	});
}

function automatedMove() {
	// var returnObject = findBestMove(NumberOfCurrentPlayer, PlayerPly[NumberOfCurrentPlayer], defeatValue - 1, true);

	// moveHelper(returnObject.bestRow, returnObject.bestCol);

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

function squareClicked(i) {

    if (isGameOver || PlayerIsAutomated[NumberOfCurrentPlayer]) {
        return;
    }

    var row = parseInt(i / nBoardWidth, 10);
    var col = i % nBoardWidth;

    moveHelper(row, col);
}

function populateLookaheadDDL(ddlID) {
    $("#" + ddlID).html("");    // Clear the list.

    for (var i = 1; i <= 9; ++i) {
        $("<option>" + i + "</option>").appendTo("#" + ddlID); // Perhaps we could reverse this and use append instead of appendTo.
    }
}

function constructBoard() {
    var pathToEmptyImage = getImagePath(EmptyNumber);
    var i = 0;

    for (var r = 0; r < nBoardHeight; ++r) {
        var rowName = "row" + r;

        $("<tr id='" + rowName + "'></tr>").appendTo("#board");

        for (var c = 0; c < nBoardWidth; ++c) {
            $("<td><img name='squares' class='tightBox' src='" + pathToEmptyImage + "' onclick='squareClicked(" + i + ")' /></td>").appendTo("#" + rowName);
            ++i;
        }
    }

    populateLookaheadDDL("ddlLookaheadX");
    populateLookaheadDDL("ddlLookaheadO");

    $("#cbAutomateX").prop("checked", PlayerIsAutomated[XNumber]);
    $("#cbAutomateO").prop("checked", PlayerIsAutomated[ONumber]);
    $("#ddlLookaheadX").val(PlayerPly[XNumber]);
    $("#ddlLookaheadO").val(PlayerPly[ONumber]);
    $("#ddlLookaheadX").prop("disabled", !PlayerIsAutomated[XNumber]);
    $("#ddlLookaheadO").prop("disabled", !PlayerIsAutomated[ONumber]);
    aBoardImageNumbers = new Array(nBoardArea);
    newGame();
}

// **** Event Handlers ****

function onPageLoad() {
    constructBoard();
}

function newGame() {
    var pathToEmptyImage = getImagePath(EmptyNumber);

    for (var i = 0; i < aBoardImageNumbers.length; ++i) {
        aBoardImageNumbers[i] = EmptyNumber;
    }

    $("[name='squares']").each(function () {
        $(this).prop("src", pathToEmptyImage);
    });

    NumberOfCurrentPlayer = XNumber;
    boardPopulation = 0;
    isGameOver = false;
    isXVictory = false;
    isOVictory = false;
    displayTurnMessage();

    if (PlayerIsAutomated[NumberOfCurrentPlayer]) {
        setTimeout("automatedMove()", 100);
    }
}

function cbAutomateX_onChange() {
    PlayerIsAutomated[XNumber] = $("#cbAutomateX").prop("checked");
    $("#ddlLookaheadX").prop("disabled", !PlayerIsAutomated[XNumber]);

    if (!isGameOver && PlayerIsAutomated[XNumber] && NumberOfCurrentPlayer == XNumber) {
        automatedMove();
    }
}

function cbAutomateO_onChange() {
    PlayerIsAutomated[ONumber] = $("#cbAutomateO").prop("checked");
    $("#ddlLookaheadO").prop("disabled", !PlayerIsAutomated[ONumber]);

    if (!isGameOver && PlayerIsAutomated[ONumber] && NumberOfCurrentPlayer == ONumber) {
        automatedMove();
    }
}

function ddlLookaheadX_onChange() {
    PlayerPly[XNumber] = parseInt($("#ddlLookaheadX").val(), 10);
}

function ddlLookaheadO_onChange() {
    PlayerPly[ONumber] = parseInt($("#ddlLookaheadO").val(), 10);
}
