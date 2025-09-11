import { View } from "../../app/View";

export class LocalGameView extends View
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
	private startFlag: boolean;
	private winnerFlag: boolean;
	private countdownElements: HTMLElement[] = [];
	private countdownInterval: number | null = null;

	
	private currentRound: number = 1;
	private maxRounds: number = 5;
	private roundElement: HTMLElement | null = null;

	private paused: boolean = false;
	private rafId: number | null = null;            
	private timerInterval: number | null = null; 
	private roundDuration: number = 5;
	private timeLeft: number;
	private timerPaused: boolean = false; 


	

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

		this.timeLeft = this.roundDuration;
    }
    
	private resetBallSpeed() {
		this.dx = 2;
		this.dy = 2;
	}

	private checkRoundEnd(): boolean {
		
		const scoreDiff = Math.abs(this.score[0] - this.score[1]);
		
		
		if (this.currentRound >= this.maxRounds || 
			(scoreDiff >= 2 && Math.max(this.score[0], this.score[1]) > 2)) {
			return true;
		}
		return false;
	}


private ensureRoundStyles() {
  if (document.getElementById('round-msg-styles')) return;
  const style = document.createElement('style');
  style.id = 'round-msg-styles';
  style.textContent = `
    @keyframes roundPop {
      0%   { transform: translate(-50%, -50%) scale(.6); opacity: 0; }
      60%  { transform: translate(-50%, -50%) scale(1.06); opacity: 1; }
      100% { transform: translate(-50%, -50%) scale(1); }
    }
    @keyframes roundOut {
      0%   { transform: translate(-50%, -50%) scale(1);   opacity: 1; }
      100% { transform: translate(-50%, -50%) scale(1.14); opacity: 0; }
    }
    @keyframes shineSweep {
      0%   { left: -160%; }
      100% { left: 160%; }
    }
    @keyframes badgeGlow {
      0%,100% { box-shadow:
        0 10px 40px rgba(0,0,0,.35),
        0 0 0 2px rgba(255,255,255,.15) inset,
        0 0 24px rgba(255,170,40,.45);
      }
      50% { box-shadow:
        0 10px 40px rgba(0,0,0,.35),
        0 0 0 2px rgba(255,255,255,.25) inset,
        0 0 38px rgba(255,160,30,.75);
      }
    }
  `;
  document.head.appendChild(style);
}

	private displayRoundMessage() {
		this.ensureRoundStyles();

		
		document.getElementById('round-msg')?.remove();

		
		const wrap = document.createElement('div');
		wrap.id = 'round-msg';
		wrap.style.position = 'absolute';
		wrap.style.left = '59%';
		wrap.style.top = '60%';
		wrap.style.transform = 'translate(-50%, -50%)';
		wrap.style.zIndex = '200';
		wrap.style.pointerEvents = 'none';
		wrap.style.animation = 'roundPop 600ms cubic-bezier(0.68,-0.55,0.27,1.55) forwards';

		
		const card = document.createElement('div');
		card.style.position = 'relative';
		card.style.padding = '18px 28px';
		card.style.borderRadius = '22px';
		card.style.maxWidth = '320px';
		card.style.textAlign = 'center';
		card.style.width = 'fit-content';
		
		card.style.background = 'linear-gradient(180deg, rgba(0,0,0,.55), rgba(0,0,0,.35))';
		card.style.backdropFilter = 'blur(6px)';
		
		card.style.border = '1px solid rgba(255,255,255,.18)';
		card.style.boxShadow = '0 10px 40px rgba(0,0,0,.35), 0 0 24px rgba(255,170,40,.45)';
		card.style.animation = 'badgeGlow 1600ms ease-in-out 200ms 1';

		
		const glow = document.createElement('div');
		glow.style.position = 'absolute';
		glow.style.inset = '-6px';
		glow.style.borderRadius = '26px';
		glow.style.background = 'linear-gradient(90deg, rgba(255,214,102,.25), rgba(255,138,76,.55), rgba(255,69,0,.35))';
		glow.style.filter = 'blur(10px)';
		glow.style.opacity = '0.9';
		glow.style.zIndex = '-1';

		
		const shine = document.createElement('div');
		shine.style.position = 'absolute';
		shine.style.top = '0';
		shine.style.left = '-10%';
		shine.style.width = '10%';
		shine.style.margin = 'auto';
		shine.style.height = '100%';
		shine.style.transform = 'skewX(-20deg)';
		shine.style.background = 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.22) 50%, rgba(255,255,255,0) 100%)';
		shine.style.animation = 'shineSweep 1100ms ease-out 300ms 1';
		shine.style.pointerEvents = 'none';

		
		const title = document.createElement('div');
		title.textContent = `ROUND ${this.currentRound}`;
		title.style.fontFamily = 'inherit';
		title.style.fontWeight = '900';
		title.style.letterSpacing = '3px';
		title.style.fontSize = '42px';
		title.style.lineHeight = '1';
		title.style.color = '#fff';
		
		title.style.textShadow = `
			0 2px 0 rgba(0,0,0,.45),
			0 0 12px rgba(255,176,36,.85),
			0 0 28px rgba(255,120,20,.55)
		`;

		const sub = document.createElement('div');
		sub.textContent = 'GET READY';
		sub.style.marginTop = '6px';
		sub.style.fontWeight = '800';
		sub.style.letterSpacing = '4px';
		sub.style.fontSize = '14px';
		sub.style.color = 'rgba(255,255,255,.85)';
		sub.style.textShadow = '0 1px 0 rgba(0,0,0,.5)';

		
		card.appendChild(shine);
		card.appendChild(title);
		card.appendChild(sub);
		wrap.appendChild(glow);
		wrap.appendChild(card);

		const parent = this.canvas?.parentElement;
		if (!parent) return;
		parent.appendChild(wrap);

		
		setTimeout(() => {
			wrap.style.animation = 'roundOut 520ms ease forwards';
			setTimeout(() => wrap.remove(), 520);
		}, 2200);
	}


   	render(): HTMLElement {
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
		element.innerHTML = `
		<div id="game-view" class="flex hidden flex-col items-center justify-between gap-2 w-[88%] h-full !m-auto">
			<div class="relative">
				<div class="w-[100px] h-[100px] absolute top-[-18px] right-[415px] !m-2 flex flex-col items-center bg-[var(--accent)] !pr-4 !pt-3  shadow-lg backdrop-blur-md" style="clip-path: polygon(99% 0, 50% 51%, 0 100%,0 0%);">
					<span class="text-[10px] font-black text-[var(--secondary)] !ml-2 tracking-widest uppercase">Round</span>
					<span id="round-display" class="text-xl font-bold text-[var(--secondary)] drop-shadow-md ">1</span>
				</div>
			</div>
				
			<!-- Scoreboard & Timer -->
			<div class="w-full h-[15%] flex items-center justify-between !px-6 rounded-2xl  border border-white/20 shadow-lg backdrop-blur-md !mt-5">
			
				<!-- Player 1 -->
				<div class="flex flex-col items-center text-white w-[20%]">
					<span id="user1" class="text-lg font-semibold tracking-wide">User 1</span>
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
					<span id="user2" class="text-lg font-semibold tracking-wide">User 2</span>
					<span id="score-right" class="text-3xl font-black text-amber-400 drop-shadow-lg">${this.score[1]}</span>
				</div>
			</div>


			<canvas id="canvas" class="border-2 border-white/20 rounded-xl !mb-10 h-[70%] w-full" style="background: rgb(243, 156, 18); "></canvas>
			<div id="goal-msg" class="absolute  hidden text-4xl font-bold" >goaal!</div>
			<div id="end-game" class="absolute hidden text-4xl border-white"></div>
			<div id="pause-game-icon" class="absolute hidden border-white bg-white/20 rounded-xl top-[54%] !m-auto">
				<i class="ti ti-player-pause-filled text-8xl text-white/80 drop-shadow-2xl"></i>
			</div>
		</div>

		<!-- form for names -->
		<div id="forme-names" class="relative w-full h-full flex items-center justify-center">
			<div class="absolute bg-[var(--primary)] rounded-3xl"></div>

			<div class="relative z-10 flex flex-col items-center gap-10 w-full h-full justify-center !mt-8">
				<div class="text-center">
					<h1 class="text-6xl  font-black text-transparent bg-clip-text bg-[var(--accent)] -500 drop-shadow-2xl !mb-4">
						P<span class="text-white">ONG</span>P<span class="text-white">ONG</span>
					</h1>
					<p class="text-md text-white/60 font-medium">Enter player names to begin the ultimate showdown!</p>
				</div>

				<div class="flex flex-col lg:flex-row items-center gap-12 !">
					<!-- Player 1 Form -->
					<div class="relative group w-[350px] ">
						<div class="absolute "></div>
						<div class="relative !p-6 flex flex-col	justify-center items-center">
							<div class="text-center !mb-4">
								<div class="text-5xl text-[var(--accent)] !mb-2 flex justify-center items-center">
									<i class="ti ti-user "></i>
									<div class="rotate-180"><i class="ti ti-ping-pong text-2xl"></i></div>
								</div>
								
								<p class="text-[12px] text-white/70">Left Paddle (W/S)</p>
							</div>
							<input placeholder="Enter name..." 
								class="w-[80%] !px-2 !py-2  border-0 border-b-1 border-amber-400 text-white placeholder-amber-100/20 placeholder:text-sm focus:outline-none  text-center text-md " 
								type="text" id="user1text" minlength="2" maxlength="12">
						</div>
					</div>
					
					<!-- VS Divider -->
					<div class="relative flex flex-col items-center">
						<div class="relative top-6 left-0 w-24 h-24 flex items-center justify-center">
							<div class=" absolute bottom-4 right-10 text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-500 via-orange-400 to-amber-400 drop-shadow-2xl">
								V
							</div>
							<div class="absolute top-6 left-8 text-8xl  font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-400 via-orange-500 to-red-500 drop-shadow-2xl ">
								S
							</div>
						</div>
					</div>
					
					<!-- Player 2 Form -->
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
							<input placeholder="Enter name..." 
								class="w-[80%] !px-2 !py-2 border-0 border-b-1 border-amber-400 backdrop-blur-xl text-white placeholder-amber-100/20 placeholder:text-sm focus:outline-none text-center text-md " 
								type="text" id="user2text" minlength="2" maxlength="12">
						</div>
					</div>

				</div>
				<div class="flex justify-center w-full !mb-4 " id="playbutton">
					<button  class="enhanced-btn secondary-btn !cursor-pointer" >
						<span class="flex items-center justify-center !mt-1 text-xl"> START GAME <i class="ti ti-device-gamepad-2 !pb-2 !pl-6 text-3xl"></i></span>
					</button>
				</div>

			</div>
				
		</div>
		
		`


		this.canvas = element.querySelector('#canvas') as HTMLCanvasElement;
  		this.ctx = this.canvas.getContext('2d')!;
		this.canvas.width = 900;
		this.canvas.height = 450;
		this.x = this.canvas.width / 2;
		this.y = this.canvas.height / 2;
	
		this.xPaddleLeft = 0;
		this.yPaddleLeft = this.canvas.height / 2 - 50;
		
		this.xPaddleRight = 890;
		this.yPaddleRight = this.canvas.height / 2 - 50;
		this.scoreLeftElement = element.querySelector('#score-left') as HTMLElement;
		this.scoreRightElement = element.querySelector('#score-right') as HTMLElement;
		this.TimerElement = element.querySelector('#timer') as HTMLElement;
		this.roundElement = element.querySelector('#round-display') as HTMLElement;
		this.textWiner = element.querySelector("#end-game") as HTMLElement;
		// this.DisplayButtonPlay();
		return element;

		
	}
	
	private resetBall(resetPaddle: boolean) {
		if (!this.canvas) return;
		this.x = this.canvas.width / 2;
		this.y = this.canvas.height / 2;
		if(resetPaddle){
			// this.dx = 2;
			// this.dy = 2;

			this.dx = (Math.random() < 0.5 ? -1 : 1) * 2;
			this.dy = (Math.random() < 0.5 ? -1 : 1) * 2;

			
			this.xPaddleLeft = 0;
			this.yPaddleLeft = this.canvas.height / 2 - 50;
			
			this.xPaddleRight = 890;
			this.yPaddleRight = this.canvas.height / 2 - 50;
		}
	}

	private UpdateScore(){
		if (!this.scoreLeftElement || !this.scoreRightElement) return;
		this.scoreLeftElement.textContent = this.score[0].toString();
		this.scoreRightElement.textContent = this.score[1].toString();
	}

	private UpdateRoundDisplay(){
		if (this.roundElement) {
			this.roundElement.textContent = this.currentRound.toString();
		}
	}

	private DistanceBallAndPaddle(){

	}

	// private AnimationGoal(){
	// 	const goalMsg = document.getElementById("goal-msg");
		

	// 	goalMsg.style.position = "absolute";
	// 	goalMsg.style.left = `52%`;
	// 	goalMsg.style.top = `56%`;

	// 	goalMsg.classList.remove("hidden");
	// 	// goalMsg.classList.add("animate-ping");
	// 	goalMsg.classList.add("animate-bounce");
	// 	goalMsg.classList.add("text-6xl");
		

	// 	setTimeout(() => {
	// 		goalMsg.classList.add("hidden");
	// 	}, 1500);
	// }


private AnimationGoal() {
    this.ensureRoundStyles(); 

   
    document.getElementById('goal-msg')?.remove();

   
    const wrap = document.createElement('div');
    wrap.id = 'goal-msg';
    wrap.style.position = 'absolute';
    wrap.style.left = '59%';
    wrap.style.top = '60%';
    wrap.style.transform = 'translate(-50%, -50%)';
    wrap.style.zIndex = '200';
    wrap.style.pointerEvents = 'none';
    wrap.style.animation = 'roundPop 600ms cubic-bezier(0.68,-0.55,0.27,1.55) forwards';

    
    const card = document.createElement('div');
    card.style.position = 'relative';
    card.style.padding = '20px 36px';
    card.style.borderRadius = '22px';
    card.style.maxWidth = '320px';
    card.style.textAlign = 'center';
    card.style.width = 'fit-content';
   
    card.style.background = 'linear-gradient(180deg, rgba(0,0,0,.6), rgba(0,0,0,.35))';
    card.style.backdropFilter = 'blur(6px)';
   
    card.style.border = '2px solid rgba(255, 100, 50, 0.7)';
    card.style.boxShadow = '0 10px 40px rgba(0,0,0,.35), 0 0 24px rgba(255,100,50,.45)';
    card.style.animation = 'badgeGlow 1600ms ease-in-out 200ms 1';

   
    const glow = document.createElement('div');
    glow.style.position = 'absolute';
    glow.style.inset = '-6px';
    glow.style.borderRadius = '26px';
    glow.style.background = 'linear-gradient(90deg, rgba(255,50,50,.3), rgba(255,120,20,.55), rgba(255,69,0,.35))';
    glow.style.filter = 'blur(12px)';
    glow.style.opacity = '0.9';
    glow.style.zIndex = '-1';

    
    const shine = document.createElement('div');
    shine.style.position = 'absolute';
    shine.style.top = '0';
    shine.style.left = '-10%';
    shine.style.width = '10%';
    shine.style.height = '100%';
    shine.style.transform = 'skewX(-20deg)';
    shine.style.background = 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.22) 50%, rgba(255,255,255,0) 100%)';
    shine.style.animation = 'shineSweep 1100ms ease-out 300ms 1';
    shine.style.pointerEvents = 'none';

   
    const title = document.createElement('div');
    title.textContent = 'GOAL!';
    title.style.fontFamily = 'inherit';
    title.style.fontWeight = '900';
    title.style.letterSpacing = '4px';
    title.style.fontSize = '48px';
    title.style.lineHeight = '1';
    title.style.color = '#fff';
    title.style.textShadow = `
        0 2px 0 rgba(0,0,0,.45),
        0 0 14px rgba(255,100,50,.85),
        0 0 32px rgba(255,140,40,.55)
    `;

    
    const sub = document.createElement('div');
    sub.textContent = 'SCORE!';
    sub.style.marginTop = '6px';
    sub.style.fontWeight = '800';
    sub.style.letterSpacing = '3px';
    sub.style.fontSize = '16px';
    sub.style.color = 'rgba(255,255,255,.85)';
    sub.style.textShadow = '0 1px 0 rgba(0,0,0,.5)';

    
    card.appendChild(shine);
    card.appendChild(title);
    card.appendChild(sub);
    wrap.appendChild(glow);
    wrap.appendChild(card);

    const parent = this.canvas?.parentElement;
    if (!parent) return;
    parent.appendChild(wrap);

    
    setTimeout(() => {
        wrap.style.animation = 'roundOut 520ms ease forwards';
        setTimeout(() => wrap.remove(), 520);
    }, 1200);
}



	// private DisplayWiner(){
	// 	const winermsg = document.getElementById("end-game");
	// 	const play = document.getElementById("forme-names");
	// 	const game_view = document.getElementById("game-view");

	// 	if(!winermsg || !game_view || !play) return;

	// 	winermsg.style.left = `60%`;
	// 	winermsg.style.top = `60%`;

	// 	winermsg.classList.remove("hidden");
	// 	winermsg.classList.add('border');
	// 	winermsg.classList.add('rounded-xl');
	// 	winermsg.style.fontSize = "2rem";
	// 	winermsg.style.fontWeight = "bold";
	// 	winermsg.style.color = "white";
	// 	winermsg.style.textShadow = "2px 2px 4px black";
	// 	winermsg.style.padding = "20px";
	// 	winermsg.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
	// 	this.startFlag = false;
	// 	// if(this.score[0] > this.score[1])
	// 	this.textWiner.textContent = this.score[0].toString() + " - " + this.score[1].toString();
	// 	// else
	// 	// 	this.textWiner.textContent = "user2 is the winner";
	// 	this.resetBall(true);
	// 	this.winnerFlag = true;
	// 	// Reset for new game
	// 	this.score[0] = 0;
	// 	this.score[1] = 0;
	// 	this.currentRound = 1;
	// 	this.scoreLeftElement.textContent = this.score[0].toString();
	// 	this.scoreRightElement.textContent = this.score[1].toString();
	// 	this.UpdateRoundDisplay();
	// 	setTimeout(() => {
	// 		this.stopTimer(); // Stop the current timer
	// 		winermsg.classList.add("hidden");
	// 		game_view.classList.add("hidden");
	// 		this.winnerFlag = false;
	// 		play.classList.remove("hidden");
	// 	}, 3000);
	// }


	private DisplayWiner() {
    const parent = this.canvas?.parentElement;
    if (!parent) return;

    document.getElementById('winner-msg')?.remove();

	const winermsg = document.getElementById("end-game");
	const play = document.getElementById("forme-names");
	const game_view = document.getElementById("game-view");

	if(!winermsg || !game_view || !play) return;

   
    const wrap = document.createElement('div');
    wrap.id = 'winner-msg';
    wrap.style.position = 'absolute';
    wrap.style.left = '59%';
    wrap.style.top = '60%';
    wrap.style.transform = 'translate(-50%, -50%)';
    wrap.style.zIndex = '200';
    wrap.style.pointerEvents = 'none';
    wrap.style.animation = 'roundPop 600ms cubic-bezier(0.68,-0.55,0.27,1.55) forwards';

   
    const card = document.createElement('div');
    card.style.position = 'relative';
    card.style.padding = '22px 40px';
    card.style.borderRadius = '24px';
    card.style.maxWidth = '360px';
    card.style.textAlign = 'center';
    card.style.width = 'fit-content';
    
    card.style.background = 'linear-gradient(180deg, rgba(0,0,0,.65), rgba(0,0,0,.4))';
    card.style.backdropFilter = 'blur(6px)';
    
    card.style.border = '2px solid rgba(50,255,100,0.8)';
    card.style.boxShadow = '0 12px 50px rgba(0,0,0,.35), 0 0 30px rgba(50,255,100,.55)';
    card.style.animation = 'badgeGlow 1600ms ease-in-out 200ms 1';

   
    const glow = document.createElement('div');
    glow.style.position = 'absolute';
    glow.style.inset = '-6px';
    glow.style.borderRadius = '28px';
    glow.style.background = 'linear-gradient(90deg, rgba(50,255,100,.25), rgba(0,255,120,.5), rgba(0,255,200,.3))';
    glow.style.filter = 'blur(12px)';
    glow.style.opacity = '0.9';
    glow.style.zIndex = '-1';

    
    const shine = document.createElement('div');
    shine.style.position = 'absolute';
    shine.style.top = '0';
    shine.style.left = '-10%';
    shine.style.width = '10%';
    shine.style.height = '100%';
    shine.style.transform = 'skewX(-20deg)';
    shine.style.background = 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.22) 50%, rgba(255,255,255,0) 100%)';
    shine.style.animation = 'shineSweep 1100ms ease-out 300ms 1';
    shine.style.pointerEvents = 'none';

    
    const title = document.createElement('div');
    title.textContent = 'WINNER!';
    title.style.fontFamily = 'inherit';
    title.style.fontWeight = '900';
    title.style.letterSpacing = '4px';
    title.style.fontSize = '48px';
    title.style.lineHeight = '1';
    title.style.color = '#fff';
    title.style.textShadow = `
        0 2px 0 rgba(0,0,0,.45),
        0 0 14px rgba(50,255,100,.85),
        0 0 32px rgba(0,255,140,.55)
    `;

    
    const sub = document.createElement('div');
    sub.textContent = `${this.score[0]} - ${this.score[1]}`;
    sub.style.marginTop = '8px';
    sub.style.fontWeight = '800';
    sub.style.letterSpacing = '3px';
    sub.style.fontSize = '20px';
    sub.style.color = 'rgba(255,255,255,.85)';
    sub.style.textShadow = '0 1px 0 rgba(0,0,0,.5)';

    
    card.appendChild(shine);
    card.appendChild(title);
    card.appendChild(sub);
    wrap.appendChild(glow);
    wrap.appendChild(card);

    parent.appendChild(wrap);

		this.startFlag = false;
		if(!winermsg || !game_view || !play) return;
		if(!this.textWiner || !this.scoreLeftElement || !this.scoreRightElement) return;
		// if(this.score[0] > this.score[1])
		this.textWiner.textContent = this.score[0].toString() + " - " + this.score[1].toString();
		this.resetBall(true);
		this.winnerFlag = true;
		this.score[0] = 0;
		this.score[1] = 0;
		this.currentRound = 1;
		this.scoreLeftElement.textContent = this.score[0].toString();
		this.scoreRightElement.textContent = this.score[1].toString();
		this.UpdateRoundDisplay();
		setTimeout(() => {
			wrap.style.animation = 'roundOut 520ms ease forwards';
			setTimeout(() => wrap.remove(), 520);
			this.stopTimer();
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
		if (!this.TimerElement) return;
		let min: number = 0;
		let max: number = 50;
		this.TimerElement.textContent = this.FormatTime(min);
		
		this.timerInterval = setInterval(()=>{
			if(this.startFlag && !this.timerPaused)
				{
				if (!this.TimerElement) return;
				max--;
				min++;
				this.dx *= 1.05;
				this.dy *= 1.05;
				this.TimerElement.textContent = this.FormatTime(min);
			}
			
		}, 1000);
	}

	private pauseTimer() {
		this.timerPaused = true;

	}

	private resumeTimer() {
		this.timerPaused = false;
	}

	private stopTimer() {
		if (this.timerInterval) {
			clearInterval(this.timerInterval);
			this.timerInterval = null;
		}
		this.timerPaused = false;
	}


	private pauseGame() {
		if (this.paused) return;
		this.paused = true;
		this.startFlag = false;

		if (this.rafId !== null) {
			cancelAnimationFrame(this.rafId);
			this.rafId = null;
		}

		
		// this.stopTimer();

		
		const icon = document.getElementById('pause-icon');
		if (icon) icon.className = 'ti ti-player-play text-2xl';
		
		const pauseOverlay = document.getElementById('pause-game-icon');
		if (pauseOverlay) pauseOverlay.classList.remove('hidden');
		const canvasParent = this.canvas;
		if (!canvasParent) return;
		canvasParent.classList.add('opacity-60');
		canvasParent.classList.remove('opacity-100');
		
		

	}

	private resumeGame() {
		if (!this.paused) return;
		this.paused = false;
		this.startFlag = true;
		
		this.draw();

		
		// if (this.startFlag) {
		// 	this.startTimer(); 
		// }

		
		const icon = document.getElementById('pause-icon');
		if (icon) icon.className = 'ti ti-player-pause text-2xl';
		const pauseOverlay = document.getElementById('pause-game-icon');
		if (pauseOverlay) pauseOverlay.classList.add('hidden');
		const canvasParent = this.canvas;
		if (!canvasParent) return;
		canvasParent.classList.remove('opacity-60');
		canvasParent.classList.add('opacity-100');
		
	}

	private togglePause() {
		if (this.paused) this.resumeGame();
		else this.pauseGame();
	}

	private handleGoal() {
		
		this.pauseTimer();
		document.getElementById("pause-btn")?.classList.remove("opacity-100");
		document.getElementById("pause-btn")?.classList.add("opacity-0");
		this.startFlag = false; 
		
		
		this.resetBallSpeed();
		
		setTimeout(() => {
			
			if (this.checkRoundEnd()) {
				this.stopTimer();
				this.DisplayWiner();
			} else {
				
				
				this.currentRound++;
				this.UpdateRoundDisplay();
				this.displayRoundMessage();
				
				
				setTimeout(() => {
					if (this.startFlag) return;
						this.startFlag = true;
					this.resetBall(true);
					this.resumeTimer();
					document.getElementById("pause-btn")?.classList.remove("opacity-0");
					document.getElementById("pause-btn")?.classList.add("opacity-100");
				}, 2500);
			}
		}, 1000);
	}

	private moveBall(){
		// if (!this.canvas || !this.y || !this.x || !this.xPaddleLeft || !this.yPaddleLeft || !this.xPaddleRight || !this.yPaddleRight) return;

		if(this.y - this.rayon <= 0 || this.y + this.rayon >= this.canvas.height)
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
			this.handleGoal();
		}
		if(this.x + this.rayon > this.canvas.width){
			this.score[0]++;
			this.resetBall(false);

			this.UpdateScore();
			this.AnimationGoal(); 
			this.handleGoal();
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
			// if (!this.canvas) return;
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
		// if (!this.canvas || !this.x || !this.xPaddleLeft || !this.xPaddleRight) return;
		if(this.x + this.rayon >= this.xPaddleRight)
			this.dx *= -1;
		if(this.x - this.rayon <= this.xPaddleLeft + 10)
			this.dx *= -1;
		this.x += this.dx;
	}

	draw(): void {
		this.DisplayButtonPlay();
		// if (!this.ctx || !this.x || !this.y || !this.xPaddleLeft || !this.yPaddleLeft || !this.xPaddleRight || !this.yPaddleRight) return;
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		const cx = this.canvas.width / 2;
		const cy = this.canvas.height / 2;
		this.ctx.beginPath();
		this.ctx.fillStyle = "white";
		this.ctx.arc(cx, cy, this.canvas.height / 4, 0, Math.PI * 2);
		this.ctx.fill();

		this.ctx.beginPath();
		this.ctx.fillStyle = 'rgb(243, 156, 18)';
		this.ctx.arc(cx, cy, this.canvas.height / 4 - 3, 0, Math.PI * 2);
		this.ctx.fill();

		
		this.ctx.beginPath();
		this.ctx.fillStyle = "white";
		this.ctx.fillRect(this.canvas.width/2 - 1, 0, 2, this.canvas.height);

		
		this.ctx.beginPath();
		this.ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
		this.ctx.shadowBlur = 15;
		this.ctx.shadowOffsetX = -this.dx * 2;
		this.ctx.shadowOffsetY = -this.dy * 2;
		this.ctx.arc(this.x, this.y, this.rayon, 0, Math.PI * 2);
		this.ctx.fillStyle = "white";
		this.ctx.fill();

		
		this.ctx.shadowColor = "rgba(0, 0, 0, 0)";
		this.ctx.shadowBlur = 0;
		this.ctx.shadowOffsetX = 0;
		this.ctx.shadowOffsetY = 0;

		
		if (!this.paused) {
			if (this.startFlag) {
				this.moveBall();
			} else {
				this.moveBallHori();
			}
		}

		
		this.ctx.fillStyle = "white";
		this.ctx.beginPath();
		this.ctx.roundRect(this.xPaddleLeft, this.yPaddleLeft, 10, 100, 5);
		this.ctx.fill();

		this.ctx.beginPath();
		this.ctx.roundRect(this.xPaddleRight, this.yPaddleRight, 10, 100, 5);
		this.ctx.fill();

		
		if (!this.paused) {
			this.rafId = requestAnimationFrame(() => this.draw());
		} else {
			this.rafId = null;
		}
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
		// if(!this.canvas) return;
		// const playButton = document.getElementById("play");
		this.canvas.classList.add("animate-pulse");
		// if(!playButton) return;
		this.createCountdownElements();

		let count = 4;
		this.countdownInterval = window.setInterval(() => {
			if(!this.canvas) return;
			// playButton.classList.add("!hidden");
			if (count > 0) {
				this.showCountdownNumber(count);
				count--;
			} else {
				document.getElementById("pause-btn")?.classList.remove("opacity-0");
				document.getElementById("pause-btn")?.classList.add("opacity-100");
				this.Timer(); 
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
			// if(!this.xPaddleRight || !this.yPaddleRight || !this.xPaddleLeft || !this.yPaddleLeft) return;
			switch(event.key)
			{
				case 'w':
					if(this.yPaddleLeft > 0)
					{
						this.yPaddleLeft -= 20;
					}
					break;
				case 's':
					if(this.yPaddleLeft < 340)
					{
						this.yPaddleLeft += 20;
					}
					break;
				case 'ArrowUp':
					if(this.yPaddleRight > 0)
					{
						this.yPaddleRight -= 20;
					}
					break;
				case 'ArrowDown':
					if(this.yPaddleRight < 340)
					{
						this.yPaddleRight += 20;
					}
					break;
			}
		});
		// console.log("1");
		const playButton = document.getElementById("playbutton");
		const game = document.getElementById("game-view");
		const formeNames = document.getElementById("forme-names");
		if (playButton && game && formeNames) {
			// console.log("hiii");
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

		const pauseBtn = document.getElementById("pause-btn");
		if (pauseBtn) {
		pauseBtn.addEventListener("click", (e) => {
			e.stopPropagation();
			this.togglePause();
		});
		}
		this.draw();
    }


}
