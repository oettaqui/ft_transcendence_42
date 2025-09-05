import { View } from "../../app/View";
import { User } from "../../types/User";

export class GameWithAiView extends View {
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
    private timerPaused: boolean = false;

    private user: User | null = null;
    private level: 'medium' | 'hard' | null = null;

    constructor() {
        super();
        this.dx = 2;
        this.dy = 2;
        this.rayon = 10;
        this.score = [0, 0]; // score[0] is AI, score[1] is Player
        this.startFlag = false;
        this.winnerFlag = false;
        this.paused = false;
    }

    private resetBallSpeed() {
        this.dx = 2;
        this.dy = 2;
    }

    private checkRoundEnd(): boolean {
        const scoreDiff = Math.abs(this.score[0] - this.score[1]);
        if (this.currentRound >= this.maxRounds || (scoreDiff >= 2 && Math.max(this.score[0], this.score[1]) > 2)) {
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
		wrap.style.left = '50%';
		wrap.style.top = '45%';
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

    public render(user: User | null): HTMLElement {
        this.user = user;
        if (this.user && !this.user.avatar) {
            this.user.avatar = "../../../public/assets/default.jpg";
        }

        const element = document.createElement('section');
        element.className = 'bg-[var(--secondary)] rounded-4xl border border-white/10 w-full h-[80%] !mt-16 flex flex-col lg:flex-row items-center lg:items-stretch justify-between lg:!gap-0 !p-2 overflow-hidden';
        
        element.innerHTML = `
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

        <div id="player-showcase" class="hidden relative w-full h-full flex items-center justify-center">
            <div class="relative z-10 flex flex-col items-center w-full h-full justify-center !mt-8">
                <div class="flex flex-col lg:flex-row items-center gap-12 !mt-4">
                    <div class="relative group w-[350px] !p-6 flex flex-col justify-center items-center">
                        <img src="../../public/assets/ai.jpg" alt="AI" class="w-32 h-32 !mb-4 rounded-full border-4 border-[var(--accent)] object-cover shadow-lg">
                        <div class="text-3xl font-bold text-white/80">AI Bot</div>
                    </div>
                    <div class="relative flex flex-col items-center">
                        <div class="relative w-24 h-24 flex items-center justify-center">
                            <div class="absolute text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-amber-400 drop-shadow-2xl">VS</div>
                        </div>
                    </div>
                    <div class="relative group w-[350px] !p-6 flex flex-col justify-center items-center">
                        <img src="${this.user?.avatar}" alt="Player" class="w-32 h-32 !mb-4 rounded-full border-4 border-[var(--accent)] object-cover shadow-lg">
                        <div class="text-3xl font-bold text-white/80">${this.user?.username}</div>
                    </div>
                </div>
                <div role="status" class="flex justify-center items-center !mt-10">
                    <svg aria-hidden="true" class="w-12 h-12 text-gray-200 animate-spin fill-amber-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
                </div>
            </div>
        </div>

        <div id="game-view" class="hidden flex-col items-center justify-between gap-2 w-[88%] h-full !m-auto ">
            <div class="relative">
                 <div class="w-[100px] h-[100px] absolute top-[-18px] right-[415px] !m-2 flex flex-col items-center bg-[var(--accent)] !pr-4 !pt-3  shadow-lg backdrop-blur-md" style="clip-path: polygon(99% 0, 50% 51%, 0 100%,0 0%);">
                    <span class="text-[10px] font-black text-[var(--secondary)] !ml-2 tracking-widest uppercase">Round</span>
                    <span id="round-display" class="text-xl font-bold text-[var(--secondary)] drop-shadow-md ">1</span>
                </div>
            </div>
            <div class="w-full h-[15%] flex items-center justify-between !px-6 rounded-2xl border border-white/20 shadow-lg backdrop-blur-md !mt-5">
                <div class="flex flex-col items-center text-white w-[20%]">
                    <div class="flex items-center gap-2">
                        <img src="../../public/assets/ai.jpg" alt="AI" class="w-8 h-8 rounded-full border-2 border-[var(--accent)] object-cover">
                        <span class="text-lg font-semibold tracking-wide">AI</span>
                    </div>
                    <span id="score-left" class="text-3xl font-black text-amber-400 drop-shadow-lg">${this.score[0]}</span>
                </div>
                <div class="flex flex-col items-center w-[20%] gap-2">
                    <span id="timer" class="text-2xl font-mono text-green-400 drop-shadow-md">00:00</span>
                    <button id="pause-btn" aria-label="Pause" class="opacity-0 !px-2 !py-1 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center">
                        <i id="pause-icon" class="ti ti-player-pause-filled text-2xl"></i>
                    </button>
                </div>
                <div class="flex flex-col items-center text-white w-[20%]">
                    <div class="flex items-center gap-2">
                         <span class="text-lg font-semibold tracking-wide">${this.user?.username}</span>
                        <img src="${this.user?.avatar}" alt="Player" class="w-8 h-8 rounded-full border-2 border-[var(--accent)] object-cover">
                    </div>
                    <span id="score-right" class="text-3xl font-black text-amber-400 drop-shadow-lg">${this.score[1]}</span>
                </div>
            </div>
            
            <div id="game" class="relative w-full h-[70%] flex items-center justify-center !mb-10">
                <canvas id="canvas" class="border-2 border-white/20 rounded-xl  h-full w-full opacity-50" style="background: rgb(243, 156, 18);"></canvas>
                <div id="play-button-container" class="absolute inset-0 flex items-center justify-center">
                    <button id="play-button" class="enhanced-btn secondary-btn !cursor-pointer">
                         <span class="flex items-center justify-center !mt-1 text-2xl"> PLAY <i class="ti ti-player-play-filled !pb-1 !pl-4 text-3xl"></i></span>
                    </button>
                </div>
                <div id="pause-game-icon" class="absolute hidden border-white bg-white/20 rounded-xl">
                    <i class="ti ti-player-pause-filled text-8xl text-white/80 drop-shadow-2xl"></i>
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

        this.xPaddleLeft = 0;
        this.yPaddleLeft = this.canvas.height / 2 - 50;
        this.xPaddleRight = this.canvas.width - 10;
        this.yPaddleRight = this.canvas.height / 2 - 50;

        this.scoreLeftElement = element.querySelector('#score-left');
        this.scoreRightElement = element.querySelector('#score-right');
        this.TimerElement = element.querySelector('#timer');
        this.roundElement = element.querySelector('#round-display');
        this.textWiner = element.querySelector("#end-game");

        return element;
    }

    private resetBall(resetPaddles: boolean) {
        if (!this.canvas) return;
        this.x = this.canvas.width / 2;
        this.y = this.canvas.height / 2;

        this.dx = (Math.random() < 0.5 ? -1 : 1) * 2;
        this.dy = (Math.random() < 0.5 ? -1 : 1) * 2;

        if (resetPaddles) {
            this.yPaddleLeft = this.canvas.height / 2 - 50;
            this.yPaddleRight = this.canvas.height / 2 - 50;
        }
    }

    private UpdateScore() {
        if (!this.scoreLeftElement || !this.scoreRightElement) return;
        this.scoreLeftElement.textContent = this.score[0].toString();
        this.scoreRightElement.textContent = this.score[1].toString();
    }
    
    private UpdateRoundDisplay() {
        if (this.roundElement) {
            this.roundElement.textContent = this.currentRound.toString();
        }
    }
    
    private AnimationGoal() {
        this.ensureRoundStyles(); 

   
        document.getElementById('goal-msg')?.remove();

    
        const wrap = document.createElement('div');
        wrap.id = 'goal-msg';
        wrap.style.position = 'absolute';
        wrap.style.left = '50%';
        wrap.style.top = '50%';
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

   
    private resetGame() {
        // 1. Stop all active game loops
       
        this.stopTimer();
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }

        // 2. Reset all game state variables to their defaults
        this.score = [0, 0];
        this.currentRound = 1;
        this.startFlag = false;
        this.winnerFlag = false;
        this.paused = false;
        this.level = null; // Important: Clear the selected level
        this.countdownElements.forEach(element => element.remove());
        this.countdownElements = [];
        // 3. Reset the displayed scores, round, and timer on the UI
        this.UpdateScore();
        this.UpdateRoundDisplay();
        if (this.TimerElement) {
            this.TimerElement.textContent = "00:00";
        }

        // 4. Reset the ball and paddle positions
        this.resetBall(true);

        // 5. Hide the game screen and show the level selection screen
        const gameView = document.getElementById("game-view");
        // const game = document.getElementById("game");
        const levelSelection = document.getElementById("level-selection");
        document.getElementById('winner-msg')?.remove(); // Remove the winner message card

        gameView?.classList.add("hidden");
        // gameView?.classList.remove("flex");
        levelSelection?.classList.remove("hidden");

        // 6. Restore the "Play" button and canvas opacity for the next game
        document.getElementById('play-button-container')?.classList.remove('hidden');
        this.canvas?.classList.add('opacity-50');
    }

    private DisplayWiner() {
        const parent = this.canvas?.parentElement;
        if (!parent) return;

        // Make sure the CSS animations are loaded
        this.ensureRoundStyles(); 
        document.getElementById('winner-msg')?.remove();

        // Determine the winner's name and the correct score display
        const winnerName = this.score[1] > this.score[0] ? `${this.user?.username || 'Player'} WINS!` : 'AI WINS!';
        const scoreText = `${this.score[1]} - ${this.score[0]}`; // Player score first

        // Create the main wrapper with animations
        const wrap = document.createElement('div');
        wrap.id = 'winner-msg';
        Object.assign(wrap.style, {
            position: 'absolute',
            left: '50%', 
            top: '45%',  
            transform: 'translate(-50%, -50%)',
            zIndex: '200',
            pointerEvents: 'none',
            animation: 'roundPop 600ms cubic-bezier(0.68,-0.55,0.27,1.55) forwards'
        });

        // Create the card element
        const card = document.createElement('div');
        Object.assign(card.style, {
            position: 'relative',
            padding: '22px 40px',
            borderRadius: '24px',
            textAlign: 'center',
            background: 'linear-gradient(180deg, rgba(0,0,0,.65), rgba(0,0,0,.4))',
            backdropFilter: 'blur(6px)',
            border: '2px solid rgba(50,255,100,0.8)',
            boxShadow: '0 12px 50px rgba(0,0,0,.35), 0 0 30px rgba(50,255,100,.55)',
            animation: 'badgeGlow 1600ms ease-in-out 200ms 1'
        });

        // Create the background glow effect
        const glow = document.createElement('div');
        Object.assign(glow.style, {
            position: 'absolute',
            inset: '-6px',
            borderRadius: '28px',
            background: 'linear-gradient(90deg, rgba(50,255,100,.25), rgba(0,255,120,.5), rgba(0,255,200,.3))',
            filter: 'blur(12px)',
            opacity: '0.9',
            zIndex: '-1'
        });

        // Create the sweeping shine effect
        const shine = document.createElement('div');
        Object.assign(shine.style, {
            position: 'absolute',
            top: '0', left: '-10%',
            width: '10%', height: '100%',
            transform: 'skewX(-20deg)',
            background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.22) 50%, rgba(255,255,255,0) 100%)',
            animation: 'shineSweep 1100ms ease-out 300ms 1',
            pointerEvents: 'none'
        });

        // Create the main title (e.g., "Player WINS!")
        const title = document.createElement('div');
        title.textContent = winnerName;
        Object.assign(title.style, {
            fontFamily: 'inherit',
            fontWeight: '900',
            letterSpacing: '4px',
            fontSize: '48px',
            lineHeight: '1',
            color: '#fff',
            textShadow: '0 2px 0 rgba(0,0,0,.45), 0 0 14px rgba(50,255,100,.85), 0 0 32px rgba(0,255,140,.55)'
        });

        // Create the subtitle (the score)
        const sub = document.createElement('div');
        sub.textContent = scoreText;
        Object.assign(sub.style, {
            marginTop: '8px',
            fontWeight: '800',
            letterSpacing: '3px',
            fontSize: '20px',
            color: 'rgba(255,255,255,.85)',
            textShadow: '0 1px 0 rgba(0,0,0,.5)'
        });
        
        // Assemble the card and add it to the page
        card.append(shine, title, sub);
        wrap.append(glow, card);
        parent.appendChild(wrap);

        // Set game state flags
        this.startFlag = false;
        this.winnerFlag = true;
    
        // Set the timeout to reset the game
        setTimeout(() => {
            this.resetGame();
        }, 4000);
    }
    
    private FormatTime(seconds: number): string {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    private Timer() {
        if (!this.TimerElement) return;

        // Define speed increase based on difficulty
        const speedMultiplier = this.level === 'hard' ? 1.04 : 1.02;
        const maxSpeed = 15;
        
        let elapsedSeconds = 0;
        this.TimerElement.textContent = this.FormatTime(elapsedSeconds);

        this.timerInterval = setInterval(() => {
            if (this.startFlag && !this.timerPaused) {
                elapsedSeconds++;
                this.TimerElement.textContent = this.FormatTime(elapsedSeconds);

                // Increase ball speed over time, respecting the max speed
                const currentSpeed = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
                if (currentSpeed < maxSpeed) {
                    this.dx *= speedMultiplier;
                    this.dy *= speedMultiplier;
                }
            }
        }, 1000);
    }
    

    private pauseTimer() { this.timerPaused = true; }
    private resumeTimer() { this.timerPaused = false; }
    private stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        this.timerPaused = false;
    }

    private pauseGame() {
        if (this.paused || !this.startFlag) return;
        this.paused = true;
        this.pauseTimer();
        if (this.rafId !== null) cancelAnimationFrame(this.rafId);
        this.rafId = null;

        const icon = document.getElementById('pause-icon');
        if (icon) icon.className = 'ti ti-player-play-filled text-2xl';
        document.getElementById('pause-game-icon')?.classList.remove('hidden');
        this.canvas?.classList.add('opacity-60');
    }

    private resumeGame() {
        if (!this.paused) return;
        this.paused = false;
        this.resumeTimer();
        this.rafId = requestAnimationFrame(() => this.draw());

        const icon = document.getElementById('pause-icon');
        if (icon) icon.className = 'ti ti-player-pause-filled text-2xl';
        document.getElementById('pause-game-icon')?.classList.add('hidden');
        this.canvas?.classList.remove('opacity-60');
    }
    
    private togglePause() {
        if (this.paused) this.resumeGame();
        else this.pauseGame();
    }

    private handleGoal() {
        this.startFlag = false;
        this.pauseTimer();
        document.getElementById("pause-btn")?.classList.add("opacity-0");
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
                    this.startFlag = true;
                    this.resetBall(true);
                    this.resumeTimer();
                    document.getElementById("pause-btn")?.classList.remove("opacity-0");
                }, 2500);
            }
        }, 1200);
    }

    private moveBall(){
        if (!this.canvas || this.x === null || this.y === null || this.yPaddleLeft === null || this.yPaddleRight === null) return;
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
    
    private moveAiPaddle() {
        if (!this.canvas || this.x === null || this.y === null || this.yPaddleLeft === null) return;

        // On hard, AI reacts as soon as the ball crosses the center.
        const detectionRange = this.level === 'hard' ? this.canvas.width : this.canvas.width / 3;
        
        // AI only moves if the ball is coming towards it and is in its detection range
        if (this.dx < 0 && this.x < detectionRange) {
            const paddleCenter = this.yPaddleLeft + 50;
            const targetY = this.y;

            // BEST PRACTICE: Define AI parameters based on level
            // Hard: Faster speed and a tiny dead-zone for high precision.
            // Medium: Slower speed and a larger dead-zone, making it more human-like.
            const speed = this.level === 'hard' ? 6.5 : 3.5;
            const deadZone = this.level === 'hard' ? 5 : 10;

            if (paddleCenter < targetY - deadZone) {
                this.yPaddleLeft += speed;
            } else if (paddleCenter > targetY + deadZone) {
                this.yPaddleLeft -= speed;
            }
        }
        
        // Clamp paddle position to stay within canvas bounds
        if (this.yPaddleLeft < 0) {
            this.yPaddleLeft = 0;
        }
        if (this.yPaddleLeft > this.canvas.height - 100) {
            this.yPaddleLeft = this.canvas.height - 100;
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
        if (this.paused || !this.ctx || !this.canvas || this.x === null || this.y === null || this.xPaddleLeft === null || this.yPaddleLeft === null || this.xPaddleRight === null || this.yPaddleRight === null) {
            return;
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Center circle design
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

        // Draw ball with shadow
        this.ctx.beginPath();
        this.ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        this.ctx.shadowBlur = 15;
        this.ctx.shadowOffsetX = -this.dx * 2;
        this.ctx.shadowOffsetY = -this.dy * 2;
        this.ctx.arc(this.x, this.y, this.rayon, 0, Math.PI * 2);
        this.ctx.fillStyle = "white";
        this.ctx.fill();
        this.ctx.shadowColor = "transparent"; // Reset shadow

        if (this.startFlag) {
            this.canvas?.classList.remove('opacity-50');
            this.moveBall();
            this.moveAiPaddle();
        }else {
            this.moveBallHori();
        }

        // Draw paddles
        this.ctx.fillStyle = "white";
        this.ctx.beginPath();
        this.ctx.roundRect(this.xPaddleLeft, this.yPaddleLeft, 10, 100, 5);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.roundRect(this.xPaddleRight, this.yPaddleRight, 10, 100, 5);
        this.ctx.fill();

        this.rafId = requestAnimationFrame(() => this.draw());
    }

    private createCountdownElements() {
        const container = this.canvas?.parentElement;
        if (!container) return;
        this.countdownElements.forEach(el => el.remove());
        this.countdownElements = [];
        const items = ['3', '2', '1', 'GO!'];
        items.forEach((text) => {
            const countEl = document.createElement('div');
            // countEl.textContent = text;
            // Object.assign(countEl.style, { position: 'absolute', transform: 'translate(-50%, -50%) scale(0)', top: '55.4%' , left: '', fontSize: '90px', fontWeight: '900', color: '#fff', textShadow: '0 4px 10px rgba(0,0,0,0.5)', zIndex: '100', opacity: '0', transition: 'all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)' });
            if (text === 'GO!') {
				countEl.textContent = 'GO!';
				countEl.style.position = 'absolute';
				countEl.style.left = `51%`;
			} else{
				countEl.textContent = text;
				countEl.style.position = 'absolute';
				countEl.style.left = `50%`;
			}

			countEl.style.top = '46%';
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
        });
    }

    private startCountdown() {
        if (!this.canvas) return;
        this.createCountdownElements();
        let count = 0;
        this.countdownInterval = window.setInterval(() => {
            if (count < this.countdownElements.length) {
                this.showCountdownNumber(count);
                count++;
            } else {
                clearInterval(this.countdownInterval!);
                this.countdownInterval = null;
                this.startFlag = true;
                this.resumeTimer();
                this.resetBall(true);
                document.getElementById("pause-btn")?.classList.remove("opacity-0");
            }
        }, 1000);
    }
    
    private showCountdownNumber(index: number) {
        if (index > 0) { // Hide previous number
            const prevEl = this.countdownElements[index - 1];
            if (prevEl) {
                prevEl.style.opacity = '0';
                prevEl.style.transform = 'translate(-50%, -50%) scale(2)';
            }
        }
        const el = this.countdownElements[index];
        if (el) {
            el.style.opacity = '1';
            el.style.transform = 'translate(-50%, -50%) scale(1)';
            setTimeout(() => { // Prepare for exit animation
                 if (index === this.countdownElements.length - 1) { // If it's "GO!"
                    el.style.opacity = '0';
                    el.style.transform = 'translate(-50%, -50%) scale(2)';
                 }
            }, 800);
        }
    }
    
    onMount(): void {
        const levelMediumBtn = document.getElementById("level-medium");
        const levelHardBtn = document.getElementById("level-hard");
        const levelSelection = document.getElementById("level-selection");
        const playerShowcase = document.getElementById("player-showcase");
        const gameView = document.getElementById("game-view");
        const playButton = document.getElementById("play-button");
        const pauseBtn = document.getElementById("pause-btn");
        const handleLevelSelect = (selectedLevel: 'medium' | 'hard') => {
            this.level = selectedLevel;
            levelSelection?.classList.add("hidden");
            playerShowcase?.classList.remove("hidden");
            
            setTimeout(() => {
                playerShowcase?.classList.add("hidden");
                gameView?.classList.remove("hidden");
                gameView?.classList.add("flex");
                this.rafId = requestAnimationFrame(() => this.draw());
                // this.draw(); // Initial draw to show the game state
            }, 3000); // 3-second showcase
        };
        
        levelMediumBtn?.addEventListener("click", () => handleLevelSelect('medium'));
        levelHardBtn?.addEventListener("click", () => handleLevelSelect('hard'));
        playButton?.parentElement?.classList.remove('hidden');
        playButton?.classList.remove('hidden');
        playButton?.classList.add('z-100000');
        
        playButton?.addEventListener("click", () => {
            playButton.parentElement?.classList.add('hidden'); // Hide the button container
            // this.canvas?.classList.remove('opacity-50');
            // console.log("Game started at level:", this.level);
            this.Timer(); // Start the timer logic
            this.pauseTimer(); // Keep it paused until countdown finishes
            this.startCountdown();
        });
        
        pauseBtn?.addEventListener("click", (e) => {
            e.stopPropagation();
            this.togglePause();
        });

        document.addEventListener('keydown', (event: KeyboardEvent) => {
            if (this.yPaddleRight === null || !this.canvas) return;
            const moveSpeed = 20;
            switch (event.key) {
                case 'ArrowUp':
                    if (this.yPaddleRight > 0) this.yPaddleRight -= moveSpeed;
                    break;
                case 'ArrowDown':
                    if (this.yPaddleRight < this.canvas.height - 100) this.yPaddleRight += moveSpeed;
                    break;
            }
        });
    }
}