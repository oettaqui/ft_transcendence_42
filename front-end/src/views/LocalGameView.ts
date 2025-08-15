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

	xPaddleLeft: number;
	xPaddleRight: number;
	yPaddleLeft: number;
	yPaddleRight: number;

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
		element.innerHTML = `<div class="flex flex-col items-center gap-4">
			<div class="border-2 border-white w-240 h-20 mb-4 flex items-center gap-4">
				<div class="w-full text-center">user1</div>
				<div id="score-left" class="w-full text-center">${this.score[0]}</div>
				<div id="timer" class="w-full text-center">00:00</div>
				<div id="score-right" class="w-full text-center">${this.score[1]}</div>
				<div class="w-full text-center">user2</div>
				</div>
			<canvas id="canvas" class="border-2 border-white " style="background: rgb(243, 156, 18);"></canvas>
			</div>`
		this.canvas = element.querySelector('#canvas') as HTMLCanvasElement;
  		this.ctx = this.canvas.getContext('2d')!;
		this.canvas.width = 950;
		this.canvas.height = 600;
		this.x = this.canvas.width / 2;
		this.y = this.canvas.height / 2;
		// paddle left
		this.xPaddleLeft = 0;
		this.yPaddleLeft = this.canvas.height / 2 - 50;
		// paddle right 
		this.xPaddleRight = 940;
		this.yPaddleRight = this.canvas.height / 2 - 50 ;
		this.scoreLeftElement = element.querySelector('#score-left') as HTMLElement;
		this.scoreRightElement = element.querySelector('#score-right') as HTMLElement;
		return element;
	}

	private resetBall() {
		this.x = this.canvas.width / 2;
		this.y = this.canvas.height / 2;
	}

	private UpdateScore(){
		this.scoreLeftElement.textContent = this.score[0].toString();
		this.scoreRightElement.textContent = this.score[1].toString();
	}

	draw(): void {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.ctx.beginPath();
		this.ctx.arc(this.x, this.y, this.rayon, 0, Math.PI * 2);
		this.ctx.fillStyle = "white";
		this.ctx.fill();
		if(this.y - this.rayon <= 0 || this.y + this.rayon >= 600)
			this.dy *= -1;

		if(this.x - this.rayon <= this.xPaddleLeft + this.rayon && this.y >= this.yPaddleLeft && this.y < this.yPaddleLeft + 100)
		{
			this.dx *= -1;
		}
		if(this.x + this.rayon >= this.xPaddleRight && this.y >= this.yPaddleRight && this.y < this.yPaddleRight + 100)
		{
			this.dx *= -1;
		}

		if (this.x - this.rayon < 0) {
			this.score[1]++;
			this.resetBall();
			this.UpdateScore();
			// console.log(this.score[0], this.score[1]);
		}
		if(this.x + this.rayon > this.canvas.width){
			this.score[0]++;
			this.resetBall();
			this.UpdateScore();
			// console.log(this.score[0], this.score[1]);
		}
		this.x += this.dx;
		this.y += this.dy;
		
		this.ctx.fillStyle = "white";
		this.ctx.fillRect(this.xPaddleLeft, this.yPaddleLeft, 10, 100);
		this.ctx.fillRect(this.xPaddleRight, this.yPaddleRight, 10, 100);
		this.ctx.fillRect(this.canvas.width/2, 0, 2, 600);
		requestAnimationFrame(() => this.draw());
	}
	// protected addEventListener(element: HTMLElement, event: string, handler: EventListener): void {
	// 	document.addEventListener('keydown', )
	// }
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
					if(this.yPaddleLeft < 500)
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
					if(this.yPaddleRight < 500)
					{
						this.yPaddleRight += 10;
					}
					break;
			}
		});
		this.draw();
    }
	

}