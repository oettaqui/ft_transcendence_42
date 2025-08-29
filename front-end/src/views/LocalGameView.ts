import { View } from "../app/View";

export class LocalGameView extends View
{
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	x: number;
	y: number;

	dx: number;
	dy: number;

	rayon: number;
	score: [number, number];
	scoreLeftElement: HTMLElement;
	scoreRightElement: HTMLElement;
	TimerElement: HTMLElement;

	xPaddleLeft: number;
	xPaddleRight: number;
	yPaddleLeft: number;
	yPaddleRight: number;
	textWiner: HTMLElement;
	startFlag: boolean;
	winnerFlag: boolean;
	private countdownElements: HTMLElement[] = [];
	private countdownInterval: number | null = null;

	constructor(){
        super();
		// this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
		// this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

		// this.canvas.width = 870;
		// this.canvas.height = 600;

		// kora 
		// this.x = 400;
		// this.y = 300;
		this.dx = 2;
		this.dy = 2;
		this.rayon = 10;
		this.score = [0, 0];
		this.startFlag = false;
		this.winnerFlag = false;

		// // paddle 
		// this.xPaddleLeft = 0;
		// this.yPaddleLeft = 0;


		// // paddle2 
		// this.xPaddleRight = 860;
		// this.yPaddleRight = 0;
    }
    
   	render(): HTMLElement {
		const element = document.createElement('section');
		element.classList.add(
			'bg-[rgba(220,219,219,0.08)]',
			'backdrop-blur-3xl',
			'rounded-4xl',
			'border',
			'border-white/10',
			'w-full',
			'h-[80%]',
			'!mt-16',
			'flex',
			'flex-col',
			'lg:flex-row',
			'items-center',
			'lg:items-stretch',
			'justify-between',
			'!gap-8',
			'lg:!gap-0',
			'!p-2',
			'lg:!p-2',
			'overflow-hidden'
		);
		element.innerHTML = `
		<div id="game-view" class="flex hidden flex-col items-center justify-center gap-4 w-[90%] h-full !m-auto ">
			<div class="border-2 border-white w-full h-[80px] !mb-4 flex items-center gap-4 rounded-xl">
				<div id="user1" class="w-full text-center">user1</div>
				<div id="score-left" class="w-full text-center">${this.score[0]}</div>
				<div id="timer" class="w-full text-center">${this.TimerElement}</div>
				<div id="score-right" class="w-full text-center">${this.score[1]}</div>
				<div id="user2" class="w-full text-center">user2</div>
			</div>
			<canvas id="canvas" class="border-2 border-white/20 rounded-xl" style="background: rgb(243, 156, 18);"></canvas>
			<div id="goal-msg" class="absolute hidden text-4xl font-bold" >goaal!</div>
			<div id="end-game" class="absolute hidden text-4xl border-white"></div>
			<!-- <div id="play" class="absolute flex flex-col p-6 gap-6 items-center border rounded-2xl " style="background: rgb(123, 96, 53)" >
				<div class="flex items-center  gap-3">
					<span class="w-20">user 1:</span>
					<input class="border border-white flex-1 rounded-lg" type="text" id="user1text" minlength="4" maxlength="8">
				</div>
				<div class="flex items-center  gap-3">
					<span class="w-20">user 2:</span>
					<input class="border border-white flex-1 rounded-lg" type="text" id="user2text" minlength="4" maxlength="8">
				</div>
				<div>
					<button type="button" id="playbutton-" class="class="w-[30%] h-[20%]">play</button>
				</div>
			</div> -->
		</div>
		<div id="forme-names" class="">
			<div class="absolute" style="top: -50px; left: 0px;">
				<div style="background: rgb(252, 180, 62); clip-path: polygon(15% 1%, 100% 0%, 88% 100%, 0% 100%); width: 300px; height: 100px; top: 250px; left: 650px;"
					 class="absolute flex items-center justify-center !p-3 border border-withe shadow-2xl">
					<input placeholder="User 1" class="w-[70%] !p-3  border border-white rounded-lg bg-white/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white placeholder-white " type="text" id="user1text" minlength="4" maxlength="8">
			
				</div>
				<div class="absolute" style="left: 430px; top: 250px;">
					<span class="absolute text-shadow-lg/80" style="top: 40px; left:55px; font-size: 5rem;" >S</span>
					<span class="absolute text-shadow-lg/80" style="font-size: 5rem;">V</span>
				</div>
				<div style="background: rgb(252, 180, 62); clip-path: polygon(15% 1%, 100% 0%, 88% 100%, 0% 100%); width: 300px; height: 100px; top: 350px; left: 50px;"
				 class="absolute flex items-center justify-center !p-3" >
					<input placeholder="User 2" class="w-[70%] !p-3  border border-white rounded-lg bg-white/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white placeholder-white " type="text" id="user2text" minlength="4" maxlength="8">
				</div>
			</div>
			<div class ="absolute " style="top: 550px; left: 390px;">
				<button type="button" id="playbutton" class="class="w-[30%] h-[20%]">play</button>
			</div>
		</div>`
		this.canvas = element.querySelector('#canvas') as HTMLCanvasElement;
  		this.ctx = this.canvas.getContext('2d')!;
		this.canvas.width = 900;
		this.canvas.height = 500;
		this.x = this.canvas.width / 2;
		this.y = this.canvas.height / 2;
		// paddle left
		this.xPaddleLeft = 0;
		this.yPaddleLeft = this.canvas.height / 2 - 50;
		// paddle right 
		this.xPaddleRight = 890;
		this.yPaddleRight = this.canvas.height / 2 - 50;
		this.scoreLeftElement = element.querySelector('#score-left') as HTMLElement;
		this.scoreRightElement = element.querySelector('#score-right') as HTMLElement;
		this.TimerElement = element.querySelector('#timer') as HTMLElement;
		this.textWiner = element.querySelector("#end-game") as HTMLElement;
		//stype play button
		// this.DisplayButtonPlay();
		return element;
	}
	private resetBall(resetPaddle: boolean) {
		this.x = this.canvas.width / 2;
		this.y = this.canvas.height / 2;
		if(resetPaddle){
			this.dx = 2;
			this.dy = 2;
			// paddle left
			this.xPaddleLeft = 0;
			this.yPaddleLeft = this.canvas.height / 2 - 50;
			// paddle right 
			this.xPaddleRight = 890;
			this.yPaddleRight = this.canvas.height / 2 - 50;
		}
	}

	private UpdateScore(){
		this.scoreLeftElement.textContent = this.score[0].toString();
		this.scoreRightElement.textContent = this.score[1].toString();
	}

	private DistanceBallAndPaddle(){

	}

	private AnimationGoal(){
		const goalmsg = document.getElementById("goal-msg");

		if(!goalmsg) return;

		goalmsg.style.left = `${this.canvas.width/2}px`;
		goalmsg.style.top = `${this.canvas.height/2 + 150}px`;

		goalmsg.classList.remove("hidden");
		goalmsg.classList.add('animate-ping');
		
		setTimeout(()=> {
			goalmsg.classList.add("hidden");
			goalmsg.classList.remove('animate-ping');
		}, 1000);
	}

	private DisplayWiner(){
		const winermsg = document.getElementById("end-game");
		const play = document.getElementById("forme-names");
		const game_view = document.getElementById("game-view");

		if(!winermsg || !game_view || !play) return;

		winermsg.style.left = `${this.canvas.width/2}px`;
		winermsg.style.top = `${this.canvas.height/2 + 100}px`;

		winermsg.classList.remove("hidden");
		winermsg.classList.add('border');
		winermsg.classList.add('rounded-xl');
		winermsg.style.fontSize = "2rem";
		winermsg.style.fontWeight = "bold";
		winermsg.style.color = "white";
		winermsg.style.textShadow = "2px 2px 4px black";
		winermsg.style.padding = "20px";
		winermsg.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
		this.startFlag = false;
		// if(this.score[0] > this.score[1])
		this.textWiner.textContent = this.score[0].toString() + " - " + this.score[1].toString();
		// else
		// 	this.textWiner.textContent = "user2 is the winner";
		this.resetBall(true);
		this.winnerFlag = true;
		this.score[0] = 0;
		this.score[1] = 0;
		this.scoreLeftElement.textContent = this.score[0].toString();
		this.scoreRightElement.textContent = this.score[1].toString();
		setTimeout(() => {
			this.Timer();
			winermsg.classList.add("hidden");
			game_view.classList.add("hidden");
			this.winnerFlag = false;
			play.classList.remove("hidden");
		}, 3000);
	}

	private FormatTime(second: number): string{
		const minutes = Math.floor(second / 60);
		const secs: number = second % 60;
		
		return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	}


	private Timer()
	{
		let max: number = 5;
		this.TimerElement.textContent = this.FormatTime(max);
		
		const countdown = setInterval(()=>{
			if(this.startFlag)
			{
				max--;
				this.dx *= 1.05;
				this.dy *= 1.05;
			}
			this.TimerElement.textContent = this.FormatTime(max);
			
			if(max <= 0){
				clearInterval(countdown);
				this.DisplayWiner();
				this.DisplayButtonPlay();
			}
		}, 1000);
	}


	private moveBall(){
		if(this.y - this.rayon <= 0 || this.y + this.rayon >= 500)
			this.dy *= -1;

		if(this.x - this.rayon <= this.xPaddleLeft + 10 && this.y >= this.yPaddleLeft && this.y < this.yPaddleLeft + 100)
		{
			this.dx *= -1;
		}
		if(this.x + this.rayon >= this.xPaddleRight && this.y >= this.yPaddleRight && this.y < this.yPaddleRight + 100)
		{
			this.dx *= -1;
		}
		if (this.x - this.rayon < 0) {
			this.score[1]++;
			this.resetBall(false);
			this.UpdateScore();
			this.AnimationGoal();
		}
		if(this.x + this.rayon > this.canvas.width){
			this.score[0]++;
			this.resetBall(false);
			this.UpdateScore();
			this.AnimationGoal(); 
		}

		this.x += this.dx;
		this.y += this.dy;
	}

	private  DisplayButtonPlay(){
		const playElement = document.getElementById("playbutton");
		if (!playElement ) return;

		// this.canvas.classList.add("animate-pulse");
		
		// this.canvas.style.backgroundColor = 'rgba(243, 156, 18, 0.5)';

		// playElement.style.left = `${this.canvas.width/2 - 40}px`;
		// playElement.style.top = `${this.canvas.height/2 + 120}px`;
		playElement.style.width = '200px';
		playElement.style.height = '60px';
		playElement.style.border = '2px solid white';
		playElement.style.borderRadius = '30px';
		playElement.style.fontSize = '1.5rem';
		playElement.style.fontWeight = 'bold';
		playElement.style.color = 'white';
		playElement.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
		playElement.style.padding = '10px';
		playElement.style.backgroundColor = 'rgba(243, 156, 18, 0.9)';
		playElement.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
		playElement.style.cursor = 'pointer';
		playElement.style.transition = 'all 0.3s ease';
		playElement.style.display = 'flex';
		playElement.style.alignItems = 'center';
		playElement.style.justifyContent = 'center';
		playElement.style.gap = '10px';



		// playElement.onmouseenter = () => {
		// 	if (!this.startFlag && !this.winnerFlag) {
		// 		playElement.style.transform = 'scale(1.05)';
		// 		playElement.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
		// 		playElement.style.backgroundColor = 'rgba(243, 156, 18, 1)';
		// 	}
		// };
		
		// playElement.onmouseleave = () => {
		// 	if (!this.startFlag && !this.winnerFlag) {
		// 		playElement.style.transform = 'scale(1)';
		// 		playElement.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
		// 		playElement.style.backgroundColor = 'rgba(243, 156, 18, 0.9)';
		// 	}
		// };

		if (this.startFlag)
		{
			playElement.classList.add("hidden");
			this.canvas.style.backgroundColor = "rgba(243, 156, 18)";
			this.canvas.classList.remove("animate-pulse");
		} 
		else {
			if (!this.winnerFlag) {
				playElement.classList.remove("hidden");
			}
		}
	}


	private moveBallHori(){
		if(this.x + this.rayon >= this.xPaddleRight)
			this.dx *= -1;
		if(this.x - this.rayon <= this.xPaddleLeft + 10)
			this.dx *= -1;
		this.x += this.dx;
	}
	draw(): void {
		this.DisplayButtonPlay();
		
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		
		this.ctx.beginPath();
		this.ctx.fillStyle = "white";
		this.ctx.arc(450, 250, 150, 0, Math.PI * 2);
		this.ctx.fill();
		this.ctx.beginPath();
		this.ctx.fillStyle = 'rgb(243, 156, 18)';
		this.ctx.arc(450, 250, 148, 0, Math.PI * 2);
		this.ctx.fill();
		this.ctx.beginPath();
		this.ctx.fillStyle = "white";
		this.ctx.fillRect(this.canvas.width/2, 0, 2, 600);

		this.ctx.beginPath();
		// shadow settings
		this.ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
		this.ctx.shadowBlur = 15;
		this.ctx.shadowOffsetX = -this.dx * 2;
		this.ctx.shadowOffsetY = -this.dy * 2; 

		this.ctx.arc(this.x, this.y, this.rayon, 0, Math.PI * 2);
		this.ctx.fillStyle = "white";
		this.ctx.fill();

		this.ctx.shadowColor = "rgba(0, 0, 0, 0.5)";;
		this.ctx.shadowBlur = 10;
		this.ctx.shadowOffsetX = 5;
		this.ctx.shadowOffsetY = 5;
		
		if(this.startFlag){
			this.moveBall();
		}
		else{
			this.moveBallHori();
		}
		
		this.ctx.fillStyle = "white";
		this.ctx.beginPath();
		this.ctx.roundRect(this.xPaddleLeft, this.yPaddleLeft, 10, 100, 5);
		this.ctx.fill();
		
		this.ctx.beginPath();
		this.ctx.roundRect(this.xPaddleRight, this.yPaddleRight, 10, 100, 5);
		this.ctx.fill();

		

		this.ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
		this.ctx.shadowBlur = 0;
		this.ctx.shadowOffsetX = 0;
		this.ctx.shadowOffsetY = 0;

		

		requestAnimationFrame(() => this.draw());
	}

	private createCountdownElements() {
		const container = this.canvas.parentElement;
		if (!container) return;
		
		this.countdownElements.forEach(el => el.remove());
		this.countdownElements = [];
		
		for (let i = 1; i <= 3; i++) {
			const countEl = document.createElement('div');
			countEl.className = 'countdown-number';
			countEl.textContent = i.toString();
			countEl.style.position = 'absolute';
			countEl.style.left = `${this.canvas.width/2 + 40}px`;
			countEl.style.top = `${this.canvas.height/2 + 125}px`;
			countEl.style.width = '50px';
			countEl.style.height = '50px';
			countEl.style.fontSize = '40px';
			countEl.style.fontWeight = 'bold';
			countEl.style.color = 'white';
			countEl.style.backgroundColor = 'rgba(220, 202, 171, 0.8)';
			countEl.style.borderRadius = '50%';
			countEl.style.display = 'flex';
			countEl.style.alignItems = 'center';
			countEl.style.justifyContent = 'center';
			countEl.style.zIndex = '100';
			countEl.style.opacity = '0';
			countEl.style.transform = 'scale(0)';
			countEl.style.transition = 'all 0.3s ease-out';
			
			container.appendChild(countEl);
			this.countdownElements.push(countEl);
		}
	}


	private startCountdown(){
		// const playButton = document.getElementById("play");
		this.canvas.classList.add("animate-pulse");
		// if(!playButton) return;
		this.createCountdownElements();

		let count = 3;
		this.countdownInterval = window.setInterval(() => {
			// playButton.classList.add("!hidden");
			if (count > 0) {
				this.showCountdownNumber(count);
				count--;
			} else {
				this.hideCountdown();
				if (this.countdownInterval) {
					clearInterval(this.countdownInterval);
					this.countdownInterval = null;
				}
				this.startFlag = true;
				this.resetBall(true);
				this.canvas.classList.remove("animate-pulse");
				// playButton.textContent = "PLAY";
			}
		}, 1000);
	}
	private showCountdownNumber(num: number) {
		const el = this.countdownElements[num - 1];
		if (!el) return;
		
		el.style.opacity = '1';
		el.style.transform = 'scale(1)';
		
		setTimeout(() => {
			el.style.opacity = '0';
			el.style.transform = 'scale(2)';
		}, 800);
	}

	private hideCountdown() {
		this.countdownElements.forEach(el => {
			el.style.opacity = '0';
			el.style.transform = 'scale(0)';
		});
	}

	onMount(): void {
		document.addEventListener('keydown', (event : KeyboardEvent) => {
			switch(event.key)
			{
				case 'w':
					if(this.yPaddleLeft > 0)
					{
						this.yPaddleLeft -= 10;
					}
					break;
				case 's':
					if(this.yPaddleLeft < 400)
					{
						this.yPaddleLeft += 10;
					}
					break;
				case 'ArrowUp':
					if(this.yPaddleRight > 0)
					{
						this.yPaddleRight -= 10;
					}
					break;
				case 'ArrowDown':
					if(this.yPaddleRight < 400)
					{
						this.yPaddleRight += 10;
					}
					break;
			}
		});
		// console.log("1");
		const playButton = document.getElementById("playbutton");
		const game = document.getElementById("game-view");
		const formeNames = document.getElementById("forme-names");
		if (playButton && game && formeNames) {
			console.log("hiii");
			playButton.addEventListener("click", () => {
				
				const textUser1 = document.getElementById("user1text") as HTMLInputElement;
				const textUser2 = document.getElementById("user2text") as HTMLInputElement;
				
				const nameUser1 = document.getElementById("user1");
				const nameUser2 = document.getElementById("user2");

				if(!textUser1 || !textUser2 || !nameUser1 || !nameUser2) return;

				nameUser1.textContent = textUser1.value;
				nameUser2.textContent = textUser2.value;
				game.classList.remove("hidden");
				formeNames.classList.add("hidden");

				this.startCountdown();
			});
		}
		this.draw();

		this.Timer();
    }
}