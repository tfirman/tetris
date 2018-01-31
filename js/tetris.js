const directions = {left: new Point(-1, 0), right: new Point(1, 0), up: new Point(0, 1), down: new Point(0, -1)};

function Point(x, y, center){
  this.x = x;
  this.y = y;

  if(center != undefined){
    this.center = center;
  } else {
    this.center = false;
  }
  this.meta = {};
}
// POINT OBJECT DEFINITION
//returns a new point at x, y with all meta-information of the current point
Point.prototype.newCopy = function(x, y){
  var newPoint = new Point(x, y);
  newPoint.center = this.center;
  newPoint.meta = this.meta;
  return newPoint;
}

Point.prototype.equals = function(point){
  return(point.x === this.x && point.y === this.y);
}

Point.prototype.add = function(point){
  return this.newCopy(this.x + point.x, this.y + point.y);
}

Point.prototype.subtract = function(point){
  return this.newCopy(this.x - point.x, this.y - point.y);
}

Point.prototype.multiply = function(amount){
  return this.newCopy(this.x * amount, this.y * amount);
}

Point.prototype.toString = function(){
  return "(" + this.x + ", " + this.y + ")";
}

//BLOCK OBJECT DEFINITION

function Block(points, color, rotator){
  this.points = points;
  this.color = color;
  if(rotator != undefined){
    this.defaultRotate = Block.prototype.rotate;
    this.rotate = rotator;
  }
  this.meta = {};
}

Block.prototype.newCopy = function(points){
  var newBlock = new Block(points, this.rotate);
  newBlock.meta = this.meta;
  return newBlock;
}

Block.prototype.findCenter = function(){
  var center;
  this.points.forEach(function(point){
    if(point.center){
      center = point;
    }
  });
  return center;
}

Block.prototype.moveTo = function(target){
  var difference = target.subtract(this.findCenter());
  var output = [];
  this.points.forEach(function(point){
    var newPoint = point.add(difference);
    output.push(newPoint);
  });
  return this.newCopy(output);
}

Block.prototype.rotate = function(counterclockwise){
  var local = [];
  var centerPosition = this.findCenter();

  this.points.forEach(function(point){
    local.push(point.subtract(centerPosition));
  });

  var rotated = [];
  local.forEach(function(point){
    var newPoint;
    if(counterclockwise){
      newPoint = point.newCopy(-point.y, point.x);
    } else {
      newPoint = point.newCopy(point.y, -point.x);
    }
    rotated.push(newPoint);
  });

  var rotatedGlobal = [];
  rotated.forEach(function(point){
    var newPoint = point.add(centerPosition);
    rotatedGlobal.push(newPoint);
  });

  return this.newCopy(rotatedGlobal);
}

Block.prototype.translate = function(direction, amount){
  if(isNaN(amount)){
    amount = 1;
  }
  var moveBy = direction.multiply(amount);
  var result = [];
  this.points.forEach(function(point){
    result.push(point.add(moveBy));
  });
  return this.newCopy(result);
}

Block.prototype.collides = function(otherBlock){
  var collides = false;
  this.points.forEach(function(thisPoint){
    otherBlock.points.forEach(function(otherPoint){
      if(thisPoint.equals(otherPoint)){
        collides = true;
      }
    })
  });
  return collides;
}

var lineRotator = function(counterclockwise){
  var vertical = (this.points[0].y !== this.points[1].y);
  if(vertical){
    return this.defaultRotate(false);
  } else {
    return this.defaultRotate(true);
  }
}

var squareRotator = function(counterclockwise){
  return this;
}

var currentBlock0 = new Block([new Point(0, 19), new Point(0, 18, true), new Point(0, 17), new Point(0,16)], 1);
var currentBlock1 = new Block([new Point(1, 19), new Point(1, 18, true), new Point(2, 18), new Point(2,19)], 4);
var currentBlock2 = new Block([new Point(3, 19), new Point(3, 18, true), new Point(4, 18), new Point(4,19)], 4);
var currentBlock3 = new Block([new Point(5, 19), new Point(5, 18, true), new Point(5, 17), new Point(5,16)], 1);
var currentBlock4 = new Block([new Point(6, 19), new Point(6, 18, true), new Point(7, 18), new Point(7,19)], 4);
var currentBlock5 = new Block([new Point(8, 19), new Point(8, 18, true), new Point(9, 19), new Point(9,18)], 4);

var bottomBlock = new Block([], 1);
var score = 0;
function mergeBlocks (bottomBlock, currentBlock) {
  bottomBlock.points.push.apply(bottomBlock.points, currentBlock.points);
  var numPointsInRow = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  bottomBlock.points.forEach(function(Point) {
    numPointsInRow[Point.y]++
  });
  for (i=0;i<=19;i++) {
    if (numPointsInRow[i]===10) {
      score +=100;
      var tempBBlock = new Block([], 1);
      bottomBlock.points.forEach(function(Point) {
        if(Point.y>i) {
          tempBBlock.points.push(Point);
        } else if (Point.y<i) {
          tempBBlock.points.push(Point.newCopy(Point.x,Point.y+1));
        };
      });
      bottomBlock = tempBBlock;
    };
  };
  return bottomBlock;
}

const pieces = {
  piece1: new Block([new Point(0, 0), new Point(1, 0, true), new Point(2, 0), new Point(3, 0)], 1, lineRotator),
  piece2: new Block([new Point(0, 1), new Point(0, 0), new Point(1, 0, true), new Point(2, 0)], 2),
  piece3: new Block([new Point(0, 0), new Point(1, 0, true), new Point(2, 0), new Point(2, 1)], 3),
  piece4: new Block([new Point(1, 1, true), new Point(1, 0), new Point(0, 0), new Point(0, 1)], 4, squareRotator),
  piece5: new Block([new Point(0, 0), new Point(1, 0), new Point(1, 1, true), new Point(2, 1)], 5),
  piece6: new Block([new Point(0, 1), new Point (1, 1, true), new Point(1, 0), new Point(2, 0)], 6),
  piece7: new Block([new Point(1, 1), new Point(1, 0, true), new Point(0, 0), new Point(2, 0)], 7)
};

// function colorPick(color) {
//   var colors = [];
//   switch(color) {
//     case 1:
//     colors = ["#00ffff","#33ffff","#00dddd"];
//     break;
//     case 2:
//     colors = ["#0000ff","#3333ff","#0000dd"];
//     break;
//     case 3:
//     colors = ["#ff7700","#ff9933","#dd6600"];
//     break;
//     case 4:
//     colors = ["#ffff00","#ffff33","#dddd00"];
//     break;
//     case 5:
//     colors = ["#00ff00","#33ff33","#00dd00"];
//     break;
//     case 6:
//     colors = ["#ff0000","#ff3333","#dd0000"];
//     break;
//     case 7:
//     colors = ["#770077","#993399","#660066"];
//     break;
//     default:
//     console.log ("color out of bounds in colorpick");
//   }
//   return colors;
// }
