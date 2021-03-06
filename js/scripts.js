$(document).ready(function () {
	score = 0;
  timer = 1000;
	bottomBlock = new Block([], 1);
	blockArr = buildBlockArr();
	nextPiece = blockArr.shift();
	inputPiece = getNewPiece();
  canvas = document.getElementById('canvas');
	c = canvas.getContext('2d');
	noMoreInput = false;
	startScreen(c, canvas);
})

var main = function (c, canvas) {
	dropBlock(c,canvas);
	document.onkeydown = function (e) {
		if (!noMoreInput) {
			e.preventDefault();
			switch (e.keyCode) {
			case 37:
				moveLeft(c, canvas);
				break;
			case 38:
				rotatePiece(c, canvas);
				break;
			case 39:
				moveRight(c, canvas);
				break;
			case 40:
				moveDown(c, canvas);
				break;
			case 32:
				moveDownAll(c,canvas);
				break;
			default:
				console.log('non arrow key');
			};
			drawScreen(c, canvas);
		};
	};
}

function dropBlock(c, canvas) {
	if (typeof dropInterval !== 'undefined') {clearInterval(dropInterval)};
	dropInterval = setInterval(function() {
		if (moveDown(c, canvas) === false) {
			drawScreen(c, canvas);
		}
	}, timer);
}

function gameOver() {
    clearInterval(dropInterval);
    $("#canvas").hide();
    $("#game-over").show();
		$("#score").text("Score: "+score);
		$("#score").show();
}

function moveLeft(c, canvas) {
	newPiece = inputPiece.translate(directions.left);
	if (newPiece.collides(bottomBlock) || newPiece.collides(boundingBlock)) {
		return;
	}
	else {
		inputPiece = inputPiece.translate(directions.left);
		drawScreen(c, canvas);
	}
}

function moveRight(c, canvas) {
	newPiece = inputPiece.translate(directions.right);
	if (newPiece.collides(bottomBlock) || newPiece.collides(boundingBlock)) {
		return;
	}
	else {
		inputPiece = inputPiece.translate(directions.right);
		drawScreen(c, canvas);
	}
}

function moveDown(c, canvas) {
	newPiece = inputPiece.translate(directions.down);
	if (newPiece.collides(bottomBlock) || newPiece.collides(boundingBlock)) {
		bottomBlock = mergeBlocks(bottomBlock, inputPiece);
		inputPiece = getNewPiece();
		return false;
	}
	else {
		inputPiece = inputPiece.translate(directions.down);
		drawScreen(c, canvas);
	}
}

function moveDownAll(c,canvas) {
	notDone = true;
	while (notDone) {
		newPiece = inputPiece.translate(directions.down);
		if (newPiece.collides(bottomBlock) || newPiece.collides(boundingBlock)) {
			bottomBlock = mergeBlocks(bottomBlock, inputPiece);
			inputPiece = getNewPiece();
			notDone = false;
		}
		else {
			inputPiece = inputPiece.translate(directions.down);
			drawScreen(c, canvas);
		}
	}
}

function rotatePiece(c, canvas) {
	newPiece = inputPiece.rotate();
	if (newPiece.rotate().collides(bottomBlock) || newPiece.collides(boundingBlock)){
		return;
	}
	else{
	    inputPiece = inputPiece.rotate();
	    drawScreen(c, canvas);
		return inputPiece;
	}
}

function startScreen(c, canvas) {
	var blinkOn = true;
	var textInterval = window.setInterval(function () {
		var image = document.getElementById('source');
		if (blinkOn) {
			blinkOn = false;
			//console.log("Blink On");
			c.fillStyle = '#555555';
			c.font = '48px serif';
			c.fillText('Click to begin.', 250, 600);
			c.drawImage(image, 0, 0);
		} else {
			//console.log("Blink Off");
			blinkOn = true;
			c.clearRect(0, 0, canvas.width, canvas.height);
			c.drawImage(image, 0, 0);
		}
		$('#canvas').click(function(e){
			clearInterval(textInterval);
			main(c,canvas);
		});
	}, 500);
}

function colorPick(color) {
	var colors = [];
	switch (color) {
	case 1:
		colors = ['#00ffff', '#33ffff', '#00dddd'];
		break;
	case 2:
		colors = ['#0000ff', '#3333ff', '#0000dd'];
		break;
	case 3:
		colors = ['#ff7700', '#ff9933', '#dd6600'];
		break;
	case 4:
		colors = ['#ffff00', '#ffff33', '#dddd00'];
		break;
	case 5:
		colors = ['#00ff00', '#33ff33', '#00dd00'];
		break;
	case 6:
		colors = ['#ff0000', '#ff3333', '#dd0000'];
		break;
	case 7:
		colors = ['#770077', '#993399', '#660066'];
		break;
	default:
		console.log('color out of bounds in colorpick ' + color);
	}
	return colors;
}

function getNewPiece() {
	iPiece = nextPiece;
	if (blockArr.length === 0) {
		blockArr = buildBlockArr();
	}
	nextPiece = blockArr.shift();
    if (iPiece.collides(bottomBlock)) {
		  noMoreInput = true
      gameOver();
      console.log("GAME OVER, your score was: ", score);
    }
	return iPiece;
}

function drawScreen(c, canvas) {
	c.clearRect(0, 0, canvas.width, canvas.height);
	drawUI(c);
	inputPiece.points.forEach(function(Point) {
		drawTile(c, Point.x, Point.y, Point.meta.color);
	});
	bottomBlock.points.forEach(function(Point) {
		drawTile(c, Point.x, Point.y, Point.meta.color);
	});
	nextPiece.points.forEach(function(Point) {
		drawTile(c, Point.x + 9, Point.y + 1, Point.meta.color);
	});
}

function drawTile(c, x, y, color) {
	var xPos = (50 * x) + 5;
	var yPos = (50 * y) + 5;
	var colors = colorPick(color);

	c.lineWidth = 2;
	c.beginPath();
	c.moveTo(xPos, yPos);
	c.lineTo(xPos + 48, yPos);
	c.lineTo(xPos + 48, yPos + 48);
	c.lineTo(xPos, yPos + 48);
	c.closePath();
	c.stroke();

	c.fillStyle = colors[0];
	c.lineWidth = 1;
	c.beginPath();
	c.moveTo(xPos + 2, yPos);
	c.lineTo(xPos + 48, yPos);
	c.lineTo(xPos + 48, yPos + 48);
	c.lineTo(xPos + 2, yPos + 48);
	c.closePath();

	c.beginPath();
	c.moveTo(xPos + 9, yPos + 9);
	c.lineTo(xPos + 39, yPos + 9);
	c.lineTo(xPos + 39, yPos + 39);
	c.lineTo(xPos + 9, yPos + 39);
	c.closePath();
	c.fill();

	c.fillStyle = colors[1];
	c.beginPath();
	c.moveTo(xPos + 1, yPos + 1);
	c.lineTo(xPos + 9, yPos + 9);
	c.lineTo(xPos + 39, yPos + 9);
	c.lineTo(xPos + 47, yPos + 1);
	c.closePath();
	c.fill();

	c.beginPath();
	c.moveTo(xPos + 1, yPos + 1);
	c.lineTo(xPos + 9, yPos + 9);
	c.lineTo(xPos + 9, yPos + 39);
	c.lineTo(xPos + 1, yPos + 47);
	c.closePath();
	c.fill();

	c.fillStyle = colors[2];
	c.beginPath();
	c.moveTo(xPos + 1, yPos + 47);
	c.lineTo(xPos + 9, yPos + 39);
	c.lineTo(xPos + 39, yPos + 39);
	c.lineTo(xPos + 47, yPos + 47);
	c.closePath();
	c.fill();

	c.beginPath();
	c.moveTo(xPos + 47, yPos + 47);
	c.lineTo(xPos + 39, yPos + 39);
	c.lineTo(xPos + 39, yPos + 9);
	c.lineTo(xPos + 47, yPos + 1);
	c.closePath();
	c.fill();
}

function drawUI(c, canvas) {
	c.lineWidth = 4;
	c.beginPath();
	c.moveTo(2, 2);
	c.lineTo(506, 2);
	c.lineTo(506, 1006);
	c.lineTo(2, 1006);
	c.closePath();
	c.stroke();

	c.beginPath();
	c.fillStyle = '#ccffdd';
	c.moveTo(556, 2);
	c.lineTo(860, 2);
	c.lineTo(860, 206);
	c.lineTo(556, 206);
	c.closePath();
	c.fill();
	c.stroke();

	c.moveTo(556, 250);
	c.lineTo(860, 250);
	c.lineTo(860, 375);
	c.lineTo(556, 375);
	c.closePath();
	c.stroke();
	c.fillStyle = 'darkblue';
	c.font = '48px Arial';
	c.textAlign = 'center';
	c.fillText('Score:', 708, 300);
	c.fillText(score, 708, 350);

	c.fillStyle = '#000000';
	c.fillRect(506, 0, 50, 1008);
	c.fillRect(556, 208, 308, 40);
	c.fillRect(556, 377, 308, 631);
}
