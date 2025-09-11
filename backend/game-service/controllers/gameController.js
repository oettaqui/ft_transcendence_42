const WebSocket = require('ws');
const { Server } = require('socket.io');

const gameSocket = new Server(3003, { cors: { origin: '*' } });

// const wss = new WebSocket.Server({port: 3003});
let xPaddleLeft = 0;
let yPaddleLeft = 0;
let xPaddleRight = 690;
let yPaddleRight = 0;
let x = 370;
let y = 250;
let dx = 2;
let dy = 2;
let rayon = 10;


let players = [];
let paddle = 0;

let gameState = {
  x: 370,
  y: 250,
  dx: (Math.random() < 0.5 ? -1 : 1) * 2,
  dy: (Math.random() < 0.5 ? -1 : 1) * 2,
  xPaddleLeft: 0,
  yPaddleLeft: 200,
  xPaddleRight: 690,
  yPaddleRight: 200,
  score1: 0,
  score2: 0
};

const interval = setInterval(() => {
	// wss.clients.forEach((client, idx) => {
	// 	if (client.readyState === client.OPEN) {
	// 		moveBall();
	// 		client.send(JSON.stringify({
	// 			type: "ballposition",
	// 			x: x,
	// 			y: y,
	// 			xPaddleLeft: xPaddleLeft,
	// 			yPaddleLeft: yPaddleLeft,
	// 			xPaddleRight: xPaddleRight,
	// 			yPaddleRight: yPaddleRight,
	// 		}));

	// 	}
	// });
	moveBall();
	gameSocket.emit('gameState', gameState);

}, 30);


function resetBall() {
	// if (!canvas) return;
	x = 370;
    y = 250;
	// if(resetPaddle){
		// dx = 2;
		// dy = 2;
		dx = (Math.random() < 0.5 ? -1 : 1) * 2;
		dy = (Math.random() < 0.5 ? -1 : 1) * 2;
		// xPaddleLeft = 0;
		// yPaddleLeft = canvas.height / 2 - 50;
		
		// xPaddleRight = 890;
		// yPaddleRight = canvas.height / 2 - 50;
	// }
}

function moveBall(){
	const {x, y, dx, dy, xPaddleLeft, yPaddleLeft, xPaddleRight, yPaddleRight } = gameState;

	if(y - rayon <= 0 || y + rayon >= 500)
		gameState.dy = dy;

	if(x - rayon <= xPaddleLeft + 10 && y >= yPaddleLeft && y < yPaddleLeft + 100)
	{
		gameState.dx = -dx;
	}
	if(x + rayon >= xPaddleRight && y >= yPaddleRight && y < yPaddleRight + 100)
	{
		gameState.dx = -dx;
	}
	if (x - rayon < 0) {
		gameState.score2++;
		resetBall(false);
	}
	if(x + rayon > 700){
		gameState.score1++;
		resetBall(false);
	}
	gameState.x += gameState.dx;
	gameState.y += gameState.dy;
}

gameSocket.on("connection", (ws) => {
  console.log("Player connected");

  //new player
  players.push({
    ws: ws,
    index: paddle,
    isLeftPaddle: paddle === 0 // First player = left, second = right (ila fih 0 isleftpaddle ghatkon true)
  });
  if(players.length === 2){
    console.log("hahoma joj");
  }
  let paddleIndex = paddle;
  paddle++;
  ws.on("message", (msg) => {
    const data = JSON.parse(msg);
    if(data.type === "position"){
		console.log('========================', paddleIndex);
			if (paddleIndex === 0){
				console.log(`9beel ==> yPaddleLeft ${yPaddleLeft}`);
				yPaddleLeft += data.move;
				console.log(`be3d ==> yPaddleLeft ${yPaddleLeft}`);
			}
			else if (paddleIndex === 1) {
				console.log(`be3d ==> yPaddleRight ${yPaddleRight}`);
				yPaddleRight += data.move;
				console.log(`be3d ==> yPaddleRight ${yPaddleRight}`);
			}
    }
  })
});

