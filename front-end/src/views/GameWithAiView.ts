import { View } from "../app/View";

export class GameWithAiView extends View
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
		element.innerHTML = `<div class="flex flex-col items-center justify-center gap-4 w-[90%] h-full !m-auto ">
			<div class="border-2 border-white w-full h-[80px] !mb-4 flex items-center gap-4 rounded-xl">
				<div class="w-full text-center">AI</div>
				<div id="score-left" class="w-full text-center">${this.score[0]}</div>
				<div id="timer" class="w-full text-center">${this.TimerElement}</div>
				<div id="score-right" class="w-full text-center">${this.score[1]}</div>
				<div class="w-full text-center">ME</div>
			</div>
			<canvas id="canvas" class="border-2 border-white/20 rounded-xl" style="background: rgb(243, 156, 18);"></canvas>
			<div id="goal-msg" class="absolute hidden text-4xl font-bold" >goaal!</div>
			<button type="button" id="play" class="w-[30%] h-[20%] absolute " ><span id="text-play-id"> play </span></button>
			<div id="end-game" class="absolute hidden text-4xl border-white"></div>
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
		const play = document.getElementById("play");

		if(!winermsg) return;
		if(!play) return;

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
			this.winnerFlag = false;
			play.classList.remove("!hidden");
		}, 3000);
	}

	private FormatTime(second: number): string{
		const minutes = Math.floor(second / 60);
		const secs: number = second % 60;
		
		return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	}


	private Timer()
	{
		let max: number = 30;
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
		// const playElement = document.getElementById("play");
		// const textPlayElement = document.getElementById("text-play-id");
		// if(!playElement) return ;

		// playElement.style.left = `${this.canvas.width/2 - 100}px`;
		// playElement.style.top = `${this.canvas.height/2 + 100}px`;

		// playElement.style.left = `${this.canvas.width/2 - 100}px`;
		// playElement.style.top = `${this.canvas.height/2 + 100}px`;
		// playElement.style.width = '200px';
		// playElement.style.height = '60px';
		// playElement.style.border = '2px solid white';
		// playElement.style.borderRadius = '30px';
		// playElement.style.fontSize = '1.5rem';
		// playElement.style.fontWeight = 'bold';
		// playElement.style.color = 'white';
		// playElement.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
		// playElement.style.padding = '10px';
		// playElement.style.backgroundColor = 'rgba(243, 156, 18, 0.9)';
		// playElement.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
		// playElement.style.cursor = 'pointer';
		// playElement.style.transition = 'all 0.3s ease';
		// playElement.style.display = 'flex';
		// playElement.style.alignItems = 'center';
		// playElement.style.justifyContent = 'center';
		// playElement.style.gap = '10px';
		// if(this.startFlag){
		// 	playElement.classList.add("hidden");
		// 	this.canvas.style.backgroundColor = "rgba(243, 156, 18)"
		// 	this.canvas.classList.remove("animate-pulse");
		// }
		// else{
		// 	if(!this.winnerFlag){
		// 		playElement.classList.remove("hidden");
		// 	}
		// 	this.canvas.style.backgroundColor = "rgba(243, 156, 18, 0.5)"
		// 	this.canvas.classList.add("animate-pulse");
		// }

		const playElement = document.getElementById("play");
		const textPlayElement = document.getElementById("text-play-id");
		if (!playElement) return;

		playElement.style.left = `${this.canvas.width/2 - 40}px`;
		playElement.style.top = `${this.canvas.height/2 + 120}px`;
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
		if(this.y <= this.yPaddleLeft + 50 && this.x < 200 && this.yPaddleLeft > 0){
			this.yPaddleLeft = this.yPaddleLeft - 3;
		}
		if(this.y > this.yPaddleLeft + 50 && this.x < 200 && this.yPaddleLeft < 400){
			this.yPaddleLeft = this.yPaddleLeft + 3;
		}
		this.ctx.fillStyle = "white";
		this.ctx.beginPath();
		this.ctx.roundRect(this.xPaddleLeft, this.yPaddleLeft, 10, 100, 5);
		this.ctx.fill();
		
		this.ctx.beginPath();
		this.ctx.roundRect(this.xPaddleRight, this.yPaddleRight, 10, 100, 5);
		this.ctx.fill();

		this.ctx.beginPath();
		this.ctx.fillRect(this.canvas.width/2, 0, 2, 600);

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
		const playButton = document.getElementById("play");
		if(!playButton) return;
		this.createCountdownElements();

		let count = 3;
		this.countdownInterval = window.setInterval(() => {
			playButton.classList.add("!hidden");
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
				playButton.textContent = "PLAY";
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
		// this.addPulseAnimation();
		document.addEventListener('keydown', (event : KeyboardEvent) => {
			switch(event.key)
			{
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
		const playButton = document.getElementById("play");
		if (playButton) {
			playButton.addEventListener("click", () => {
				// let x:number = 4;
				// const ll = setInterval(()=>{
				// 	x--;
				// 	playButton.textContent = x.toString();
				// 	if(x < 0){
				// 		clearInterval(ll);
				// 		playButton.textContent = "play";
				// 		this.startFlag = true;
				// 	}
				// },1000);
				this.startCountdown();
			});
		}
		this.draw();

		this.Timer();
    }
	

}