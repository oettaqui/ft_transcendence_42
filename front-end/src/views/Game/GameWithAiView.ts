import { View } from "../../app/View";
import { User } from "../../types/User";

export class GameWithAiView extends View
{
	private canvas: HTMLCanvasElement | null = null;
	private ctx: CanvasRenderingContext2D | null = null;
	private x: number | null = null;
	private y: number | null = null;

	private dx: number;
	private dy: number;

	private rayon: number;
	private score: [number, number];
	private scoreLeftElement: HTMLElement | null = null;
	private scoreRightElement: HTMLElement | null = null;
	private TimerElement: HTMLElement | null = null;

	private xPaddleLeft: number | null = null;
	private xPaddleRight: number | null = null;
	private yPaddleLeft: number | null = null;
	private yPaddleRight: number | null = null;
	private textWiner: HTMLElement | null = null;
	startFlag: boolean;
	winnerFlag: boolean;
	private countdownElements: HTMLElement[] = [];
	private countdownInterval: number | null = null;
    private user: User | null = null;
    private level: string | null = null; 
    private isStartToPlay: boolean = false;

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
    
   	render(user: User | null): HTMLElement { 
        this.user = user;
        if (this.user?.avatar === null)
          this.user.avatar = "../../../public/assets/default.jpg";
        console.log("User in GameWithAiView:", this.user);

		const element = document.createElement('section');
		element.classList.add(
			'bg-[var(--secondary)]',
			// 'backdrop-blur-3xl',
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
			// '!gap-8',
			'lg:!gap-0',
			'!p-2',
			// 'lg:!p-2',
			'overflow-hidden'
		);
		element.innerHTML = 
        `
        <div id="level-selection" class="w-full h-full flex flex-col items-center justify-center gap-10">
            <div class="text-center">
                <h1 class="text-6xl font-black text-transparent bg-clip-text bg-[var(--accent)] drop-shadow-2xl !mb-4">
                    P<span class="text-white">ONG</span>P<span class="text-white">ONG</span>
                </h1>
                <p class="text-xl text-white/60 font-medium">Choose Your Difficulty</p>
            </div>
            <div class="flex flex-col sm:flex-row items-center gap-6">
                <button id="level-medium" class="enhanced-btn secondary-btn !cursor-pointer w-60">
                    <span class="flex items-center justify-center !mt-1 text-xl">MEDIUM</span>
                </button>
                <button id="level-hard" class="enhanced-btn secondary-btn !cursor-pointer w-60">
                    <span class="flex items-center justify-center !mt-1 text-xl">HARD</span>
                </button>
            </div>
        </div>

        
        <div id="game-canvas-container" class="flex hidden flex-col items-center justify-center gap-2 w-[88%] h-full !m-auto">
			<div class="relative">
				<div class="w-[100px] h-[100px] absolute top-[-18px] right-[415px] !m-2 flex flex-col items-center bg-[var(--accent)] !pr-4 !pt-3  shadow-lg backdrop-blur-md" style="clip-path: polygon(99% 0, 50% 51%, 0 100%,0 0%);">
					<span class="text-[10px] font-black text-[var(--secondary)] !ml-2 tracking-widest uppercase">Round</span>
					<span id="round-display" class="text-xl font-bold text-[var(--secondary)] drop-shadow-md ">1</span>
				</div>
			</div>
				
			<!-- Scoreboard & Timer -->
			<div class="w-full h-full flex items-center justify-between !px-6 rounded-2xl  border border-white/20 shadow-lg backdrop-blur-md ">
			
			<!-- Player 1 -->
			<div class="flex flex-col items-center text-white w-[20%] ">
				<div class="flex items-center justify-center gap-2">
                    <img src="../../public/assets/ai.jpg" alt="AI" class="w-8 h-8 rounded-full border-2 border-[var(--accent)] object-cover !mr-2">
				    <span id="user2" class="text-lg font-semibold tracking-wide">AI</span>
                </div>
				<span id="score-left" class="text-3xl font-black text-amber-400 drop-shadow-lg">${this.score[0]}</span>
			</div>

			<!-- Timer & Round -->
			<div class="flex flex-col items-center w-[20%] gap-2">
				<div class="flex items-center">
					<div class="flex flex-col items-center">
						<span id="timer" class="text-2xl font-mono text-green-400 drop-shadow-md">00:00</span>
					</div>
				</div>
				<button id="pause-btn" aria-label="Pause" class="opacity-0 !px-2 !py-1 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center ">
					<i id="pause-icon" class="ti ti-player-pause-filled text-2xl"></i>
				</button>
			</div>

			<!-- Player 2 -->
			<div class="flex flex-col items-center text-white w-[20%]">
                <div class="flex items-center gap-2">
				    <span id="user2" class="text-lg font-semibold tracking-wide">${this.user?.username}</span>
                    <img src="${this.user?.avatar}" alt="Player 2" class="w-8 h-8 rounded-full border-2 border-[var(--accent)] object-cover !ml-2">
                </div>
				<span id="score-right" class="text-3xl font-black text-amber-400 drop-shadow-lg">${this.score[1]}</span>
			</div>
			</div>


			<canvas id="canvas" class="border-2 border-white/20 rounded-xl !mb-1" style="background: rgb(243, 156, 18); "></canvas>
			<div id="goal-msg" class="absolute  hidden text-4xl font-bold" >goaal!</div>
			<div id="end-game" class="absolute hidden text-4xl border-white"></div>
			<div id="pause-game-icon" class="absolute hidden border-white bg-white/20 rounded-xl !mt-24">
				<i class="ti ti-player-pause-filled text-8xl text-white/80 drop-shadow-2xl"></i>
			</div>
			<div id="play" class="hidden absolute">Play</div>
			
		</div>

        <div id="startGame" class="hidden relative w-full h-full flex items-center justify-center">
            <div class="absolute bg-[var(--primary)] rounded-3xl"></div>
            <div class="relative z-10 flex flex-col items-center w-full h-full justify-center !mt-8">
                <div class="text-center">
                    <h1 class="text-6xl  font-black text-transparent bg-clip-text bg-[var(--accent)] -500 drop-shadow-2xl !mb-4">
                        P<span class="text-white">ONG</span>P<span class="text-white">ONG</span>
                    </h1>
                    <p class="text-md text-white/60 font-medium">Enter player names to begin the ultimate showdown!</p>
                </div>
                <div class="flex flex-col lg:flex-row items-center gap-12 !mt-4">
                    <div class="relative group w-[350px] ">
                        <div class="absolute "></div>
                        <div class="relative !p-6 flex flex-col justify-center items-center">
                            <div class="text-center !mb-4">
                                <div class="text-5xl text-[var(--accent)] !mb-2 flex justify-center items-center">
                                    <i class="ti ti-user "></i>
                                    <div class="rotate-180"><i class="ti ti-ping-pong text-2xl"></i></div>
                                </div>
                                <p class="text-[12px] text-white/70">Left Paddle (W/S)</p>
                            </div>
                            <img src="../../public/assets/ai.jpg" alt="AI" class="w-24 h-24 !mb-4 rounded-full border-2 border-[var(--accent)] object-cover">
                            <div class="text-2xl font-bold text-white/80">AI</div>
                        </div>
                    </div>
                    <div class="relative flex flex-col items-center">
                        <div class="relative top-6 left-0 w-24 h-24 flex items-center justify-center">
                            <div class=" absolute bottom-4 right-10 text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-500 via-orange-400 to-amber-400 drop-shadow-2xl">V</div>
                            <div class="absolute top-6 left-8 text-8xl  font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-400 via-orange-500 to-red-500 drop-shadow-2xl ">S</div>
                        </div>
                    </div>
                    <div class="relative group w-[350px]">
                        <div class="absolute inset-0 rounded-xl "></div>
                        <div class="relative !p-6 flex flex-col justify-center items-center">
                            <div class="text-center !mb-4">
                                <div class="text-5xl text-[var(--accent)] !mb-2 flex justify-center items-center">
                                    <div class="rotate-90"><i class="ti ti-ping-pong text-2xl"></i></div>
                                    <i class="ti ti-user"></i>
                                </div>
                                <p class="text-[12px] text-white/70">Right Paddle (↑/↓)</p>
                            </div>
                            <img src="${this.user?.avatar}" alt="Player 2" class="w-24 h-24 !mb-4 rounded-full border-2 border-[var(--accent)] object-cover">
                            <div class="text-2xl font-bold text-white/80">${this.user?.username}</div>
                        </div>
                    </div>
                        
                </div>
                <div role="status " class="flex justify-center items-center !mt-4">
                    <svg aria-hidden="true" class="w-12 h-12 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    <span class="sr-only">Loading...</span>
                    
                </div>
            </div>
        </div>
                `;
                

		this.canvas = element.querySelector('#canvas') as HTMLCanvasElement;
  		this.ctx = this.canvas.getContext('2d')!;
		this.canvas.width = 900;
		this.canvas.height = 450;
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
        console.log("Displaying winner message");
		if(!winermsg) return;
		if(!play) return;
        console.log("Displaying winner message. 11111");

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
        console.log("DisplayButtonPlay called 0000");
		const playElement = document.getElementById("play");
		const textPlayElement = document.getElementById("text-play-id");
		if (!playElement) return;
        console.log("DisplayButtonPlay called 1111");
        playElement.classList.remove("hidden");
        console.log("DisplayButtonPlay called 2222");
		playElement.style.left = `50%`;
		playElement.style.top = `60%`;
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
        // the AI paddle movement
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
		// if (!this.canvas) return;
		const container = this.canvas.parentElement;
		if (!container) return;

		this.countdownElements.forEach(el => el.remove());
		this.countdownElements = [];

		for (let i = 0; i <= 3; i++) {
			const countEl = document.createElement('div');
			countEl.className = 'countdown-number';
			if (i === 0) {
				countEl.textContent = 'GO!';
				countEl.style.position = 'absolute';
				countEl.style.left = `56.3%`;
			} else{
				countEl.textContent = i.toString();
				countEl.style.position = 'absolute';
				countEl.style.left = `55.4%`;
			}

			countEl.style.top = '54%';
			countEl.style.transform = 'translate(-50%, -50%) scale(0)';
			countEl.style.width = '100px';
			countEl.style.height = '100px';
			countEl.style.fontSize = '70px';
			countEl.style.fontWeight = '900';
			countEl.style.color = '#fff';
		
			countEl.style.padding = '10px 5px 0 0';


			countEl.style.borderRadius = '50%';
			countEl.style.display = 'flex';
			countEl.style.alignItems = 'center';
			countEl.style.justifyContent = 'center';

			countEl.style.zIndex = '100';
			countEl.style.opacity = '0';
			countEl.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55)'; 

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
    document.addEventListener('keydown', (event: KeyboardEvent) => {
        switch (event.key) {
            case 'ArrowUp':
                if (this.yPaddleRight > 0) {
                    this.yPaddleRight -= 10;
                }
                break;
            case 'ArrowDown':
                if (this.yPaddleRight < this.canvas.height - 100) {
                    this.yPaddleRight += 10;
                }
                break;
        }
    });

    const levelMediumButton = document.getElementById("level-medium");
    const levelHardButton = document.getElementById("level-hard");
    const levelSelection = document.getElementById("level-selection");
    const gameCanvasContainer = document.getElementById("game-canvas-container");
    const startGame = document.getElementById("startGame");

    const handleDifficultySelect = () => {
        levelSelection?.classList.add("hidden");
        startGame?.classList.remove("hidden");
        setTimeout(() => {
            startGame?.classList.add("hidden");
            gameCanvasContainer?.classList.remove("hidden");
            
        }, 1500); 
    };

    levelMediumButton?.addEventListener("click", handleDifficultySelect);
    levelHardButton?.addEventListener("click", handleDifficultySelect);

    // const playButton = document.getElementById("play");
    // if (playButton) {
    //     playButton.addEventListener("click", () => {
    //         this.startCountdown();
    //     });
    // }
    if (this.isStartToPlay === false) {
        this.isStartToPlay = true;
        const playButton = document.getElementById("play");
        playButton?.classList.remove("hidden");
        if (playButton) {
            playButton.addEventListener("click", () => {
                this.startCountdown();
            });
        }
    }

        this.draw();
		this.Timer();
    }
	

}