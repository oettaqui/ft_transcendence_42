import { View } from "../app/View";

export class GameView extends View{
    
    constructor(){
        super()
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
       <main class="w-[100%] h-[100%] !gap-2 !m-auto flex flex-col  !pt-8">
           <div class="text-center animate-fade-in">
                <h1 class="text-4xl font-extrabold text-white leading-tight tracking-wide">
                    Every 
                    <span class="inline-block !pb-1 border-[var(--accent)]">Champion</span> 
                    Starts With a 
                    <span class="inline-block text-[var(--accent)] drop-shadow-md animate-bounce-short">Click</span>
                </h1>
                <p class="text-gray-300 text-lg !mt-2 opacity-90 tracking-wide">
                    Your Journey to Glory Begins Now
                </p>
            </div>
            
            <div class="relative flex items-center justify-center !p-8 h-full">
                <button id="scroll-left-btn" class="absolute left-0 z-10 !p-3 text-white bg-[var(--accent)] rounded-full shadow-lg hover:bg-[var(--accent)]/80 transition-all duration-200">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                </button>
                
                <div id="card-container" class="flex overflow-x-hidden snap-x snap-mandatory !gap-8 h-[400px] !mx-6 hide-scrollbar">
                    <a href="/dashboard/game/localgame" class="game-card relative  ">
                        <div class="absolute w-18 h-18 top-0 bg-[var(--accent)] triangle z-20"></div>
                        <div class="absolute w-9 h-9 top-[12px] left-[10px] bg-[var(--secondary)] triangle z-30"></div>
                        <div class="flex justify-center items-center w-[300px] h-full bg-[var(--accent)] shap relative overflow-hidden">
                            <div class="flex justify-center items-center w-[280px] h-[75%] shap bg-[var(--secondary)]">
                                <img class="bg-center bg-cover w-[260px] h-[94%] shap" 
                                    src="../../public/assets/localGame.webp"
                                    alt="Local Game"/>
                            </div>
                            <div class="info-bar absolute bottom-0 left-0 right-0 h-[200px] bg-[var(--secondary)]/90 text-white !p-6 flex flex-col justify-end !pb-15">
                                <div class="flex items-end justify-between !mb-5">
                                    <div class="flex flex-col !m-auto">
                                        <div class="text-lg font-bold !mb-1 text-[var(--accent)] tracking-[3px]">Local Multiplayer</div>
                                    </div>
                                </div>
                                <div class="flex !gap-3">
                                    <button class="flex-1 bg-[var(--text)] hover:bg-[var(--accent)] text-[var(--secondary)] hover:text-white !py-3 !px-6 rounded-lg font-semibold text-sm transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center !gap-2">
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M8 5v10l8-5-8-5z"/>
                                        </svg>
                                        Play Now
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="absolute w-18 h-18 bottom-0 left-[230px] bg-[var(--accent)] inverted-triangle z-20"></div>
                        <div class="absolute w-9 h-9 bottom-[10px] left-[253px] bg-[var(--secondary)] inverted-triangle z-30"></div>
                    </a>

                    <div  class="game-card relative">
                        <div class="absolute w-18 h-18 top-0 bg-[var(--accent)] triangle z-20"></div>
                        <div class="absolute w-9 h-9 top-[12px] left-[10px] bg-[var(--secondary)] triangle z-30"></div>
                        <div class="flex justify-center items-center w-[300px] h-full bg-[var(--accent)] shap relative overflow-hidden">
                            <div class="flex justify-center items-center w-[280px] h-[75%] shap bg-[var(--secondary)]">
                                <img class="bg-center bg-cover w-[260px] h-[94%] shap" 
                                    src="../../public/assets/PlayWithAI_1.png"
                                    alt="Play with AI"/>
                            </div>
                            <div class="info-bar absolute bottom-0 left-0 right-0 h-[200px] bg-[var(--secondary)]/90 text-white !p-6 flex flex-col justify-end !pb-15">
                                <div class="flex items-end justify-between !mb-5">
                                    <div class="flex flex-col !m-auto">
                                        <div class="text-lg font-bold !mb-1 text-[var(--accent)] tracking-[3px]">Play with AI</div>
                                    </div>
                                </div>
                                <div class="flex !gap-3">
                                    <button class="flex-1 bg-[var(--text)] hover:bg-[var(--accent)] text-[var(--secondary)] hover:text-white !py-3 !px-6 rounded-lg font-semibold text-sm transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center !gap-2">
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M8 5v10l8-5-8-5z"/>
                                        </svg>
                                        Play Now
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="absolute w-18 h-18 bottom-0 left-[230px] bg-[var(--accent)] inverted-triangle z-20"></div>
                        <div class="absolute w-9 h-9 bottom-[10px] left-[253px] bg-[var(--secondary)] inverted-triangle z-30"></div>
                    </div>

                    <div class="game-card relative">
                        <div class="absolute w-18 h-18 top-0 bg-[var(--accent)] triangle z-20"></div>
                        <div class="absolute w-9 h-9 top-[12px] left-[10px] bg-[var(--secondary)] triangle z-30"></div>
                        <div class="flex justify-center items-center w-[300px] h-full bg-[var(--accent)] shap relative overflow-hidden">
                            <div class="flex justify-center items-center w-[280px] h-[75%] shap bg-[var(--secondary)]">
                                <img class="bg-center bg-cover w-[260px] h-[94%] shap" 
                                    src="../../public/assets/remote_1.png"
                                    alt="Remote Game"/>
                            </div>
                            <div class="info-bar absolute bottom-0 left-0 right-0 h-[200px] bg-[var(--secondary)]/90 text-white !p-6 flex flex-col justify-end !pb-15">
                                <div class="flex items-end justify-between !mb-5">
                                    <div class="flex flex-col !m-auto">
                                        <div class="text-lg font-bold !mb-1 text-[var(--accent)] tracking-[3px]">Remote Game</div>
                                    </div>
                                </div>
                                <div class="flex !gap-3">
                                    <button class="flex-1 bg-[var(--text)] hover:bg-[var(--accent)] text-[var(--secondary)] hover:text-white !py-3 !px-6 rounded-lg font-semibold text-sm transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center !gap-2">
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M8 5v10l8-5-8-5z"/>
                                        </svg>
                                        Play Now
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="absolute w-18 h-18 bottom-0 left-[230px] bg-[var(--accent)] inverted-triangle z-20"></div>
                        <div class="absolute w-9 h-9 bottom-[10px] left-[253px] bg-[var(--secondary)] inverted-triangle z-30"></div>
                    </div>

                    <div class="game-card relative">
                        <div class="absolute w-18 h-18 top-0 bg-[var(--accent)] triangle z-20"></div>
                        <div class="absolute w-9 h-9 top-[12px] left-[10px] bg-[var(--secondary)] triangle z-30"></div>
                        <div class="flex justify-center items-center w-[300px] h-full bg-[var(--accent)] shap relative overflow-hidden">
                            <div class="flex justify-center items-center w-[280px] h-[75%] shap bg-[var(--secondary)]">
                                <img class="bg-center bg-cover w-[260px] h-[94%] shap" 
                                    src="../../public/assets/multiplayer_1.png"
                                    alt="Multiplayer Game"/>
                            </div>
                            <div class="info-bar absolute bottom-0 left-0 right-0 h-[200px] bg-[var(--secondary)]/90 text-white !p-6 flex flex-col justify-end !pb-15">
                                <div class="flex items-end justify-between !mb-5">
                                    <div class="flex flex-col !m-auto">
                                        <div class="text-lg font-bold !mb-1 text-[var(--accent)] tracking-[3px]">Multiplayer Game</div>
                                    </div>
                                </div>
                                <div class="flex !gap-3">
                                    <button class="flex-1 bg-[var(--text)] hover:bg-[var(--accent)] text-[var(--secondary)] hover:text-white !py-3 !px-6 rounded-lg font-semibold text-sm transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center !gap-2">
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M8 5v10l8-5-8-5z"/>
                                        </svg>
                                        Play Now
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="absolute w-18 h-18 bottom-0 left-[230px] bg-[var(--accent)] inverted-triangle z-20"></div>
                        <div class="absolute w-9 h-9 bottom-[10px] left-[253px] bg-[var(--secondary)] inverted-triangle z-30"></div>
                    </div>
                </div>

                <button id="scroll-right-btn" class="absolute right-0 z-10 !p-3 text-white bg-[var(--accent)] rounded-full shadow-lg hover:bg-[var(--accent)]/80 transition-all duration-200">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </button>
            </div>
        </main>
    `;

    return element;
}

    onMount(): void {
       this.setupCardScroll();
    }
    
    private setupCardScroll(): void {
        const cardContainer = document.getElementById('card-container');
        const scrollLeftBtn = document.getElementById('scroll-left-btn');
        const scrollRightBtn = document.getElementById('scroll-right-btn');

        if (!cardContainer || !scrollLeftBtn || !scrollRightBtn) {
            console.error('Card container or scroll buttons not found.');
            return;
        }

        const card = cardContainer.querySelector('.game-card') as HTMLElement;
        if (!card) {
            console.error('Game card not found.');
            return;
        }

        const scrollAmount = card.offsetWidth + 100; // card width + !gap-8 (32px)

        scrollRightBtn.addEventListener('click', () => {
            cardContainer.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });

        scrollLeftBtn.addEventListener('click', () => {
            cardContainer.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });
    }

}