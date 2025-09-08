import { View } from "../app/View";
import { User } from "../types/User";
export class GameView extends View{
    private user: User | null = null;
    constructor(){
        super()
    }
    
render(user: User | null): Promise<HTMLElement | null> {
    this.user = user;
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
    
        const colorClasses ={
            'Bios': 'var(--bios)',
            'Freax': 'var(--freax)',
            'Commodore': 'var(--commodore)',
            'Pandora': 'var(--pandora)',
        }
        const colorTheme = colorClasses[this.user?.coalition] || ''; 
    
    element.innerHTML = `
       <main class="w-[100%] h-[100%] !gap-2 !m-auto flex flex-col  !pt-8">
           <div class="text-center animate-fade-in">
                <h1 class="text-4xl font-extrabold text-white leading-tight tracking-wide">
                    Every 
                    <span class="inline-block !pb-1 border-[var(--accent)]">Champion</span> 
                    Starts With a 
                    <span style="color: ${colorTheme}" class="inline-block  drop-shadow-md animate-bounce-short">Click</span>
                </h1>
                <p class="text-gray-300 text-lg !mt-2 opacity-90 tracking-wide">
                    Your Journey to Glory Begins Now
                </p>
            </div>
            
            <div class="relative flex items-center justify-center !p-8 h-full">
               
                
                <div id="card-container" class="grid grid-cols-3  overflow-x-hidden snap-x snap-mandatory !gap-6 h-[400px]  hide-scrollbar">
                    <div class="game-card relative ">
                        <div style="background-color: ${colorTheme}" class="absolute w-18 h-18 top-0 triangle z-20"></div>
                        <div class="absolute w-9 h-9 top-[12px] left-[10px] bg-[var(--secondary)] triangle z-30"></div>
                        <div style="background-color: ${colorTheme}" class="flex justify-center items-center w-[300px] h-full  shap relative overflow-hidden">
                            <div class="flex justify-center items-center w-[280px] h-[75%] shap bg-[var(--secondary)]">
                                <img class="bg-center bg-cover w-[260px] h-[94%] shap" 
                                    src="../../public/assets/localGame.webp"
                                    alt="Local Game"/>
                            </div>
                            <div class="info-bar absolute bottom-0 left-0 right-0 h-[200px] bg-[var(--secondary)]/90 text-white !p-6 flex flex-col justify-end !pb-15">
                                <div class="flex items-end justify-between !mb-5">
                                    <div class="flex flex-col !m-auto">
                                        <div style="color: ${colorTheme}" class="text-lg font-bold !mb-1  tracking-[3px]">Local Multiplayer</div>
                                    </div>
                                </div>
                                <div class="flex !gap-3">
                                    <a href="/dashboard/game/localgame" class="flex-1 bg-[var(--text)] dynamic-hover-bg text-[var(--secondary)] hover:text-white !py-3 !px-6 rounded-lg font-semibold text-sm transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center !gap-2" style="--hover-color: ${colorTheme};">
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M8 5v10l8-5-8-5z"/>
                                        </svg>
                                        Play Now
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div style="background-color: ${colorTheme}" class="absolute w-18 h-18 bottom-0 left-[230px] inverted-triangle z-20"></div>
                        <div class="absolute w-9 h-9 bottom-[10px] left-[253px] bg-[var(--secondary)] inverted-triangle z-30"></div>
                    </div>

                    <div class="game-card relative ">
                        <div style="background-color: ${colorTheme}" class="absolute w-18 h-18 top-0  triangle z-20"></div>
                        <div class="absolute w-9 h-9 top-[12px] left-[10px] bg-[var(--secondary)] triangle z-30"></div>
                        <div style="background-color: ${colorTheme}" class="flex justify-center items-center w-[300px] h-full  shap relative overflow-hidden">
                            <div class="flex justify-center items-center w-[280px] h-[75%] shap bg-[var(--secondary)]">
                                <img class="bg-center bg-cover w-[260px] h-[94%] shap" 
                                    src="../../public/assets/PlayWithAI_1.png"
                                    alt="Play with AI"/>
                            </div>
                            <div class="info-bar absolute bottom-0 left-0 right-0 h-[200px] bg-[var(--secondary)]/90 text-white !p-6 flex flex-col justify-end !pb-15">
                                <div class="flex items-end justify-between !mb-5">
                                    <div class="flex flex-col !m-auto">
                                        <div style="color: ${colorTheme}" class="text-lg font-bold !mb-1  tracking-[3px]">Play with AI</div>
                                    </div>
                                </div>
                                <div class="flex !gap-3">
                                    <a href="/dashboard/game/gamewithIA" class="flex-1 bg-[var(--text)] dynamic-hover-bg text-[var(--secondary)] hover:text-white !py-3 !px-6 rounded-lg font-semibold text-sm transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center !gap-2" style="--hover-color: ${colorTheme};">
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M8 5v10l8-5-8-5z"/>
                                        </svg>
                                        Play Now
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div style="background-color: ${colorTheme}" class="absolute w-18 h-18 bottom-0 left-[230px]  inverted-triangle z-20"></div>
                        <div class="absolute w-9 h-9 bottom-[10px] left-[253px] bg-[var(--secondary)] inverted-triangle z-30"></div>
                    </div>

                    <div class="game-card relative ">
                        <div style="background-color: ${colorTheme}" class="absolute w-18 h-18 top-0  triangle z-20"></div>
                        <div class="absolute w-9 h-9 top-[12px] left-[10px] bg-[var(--secondary)] triangle z-30"></div>
                        <div style="background-color: ${colorTheme}" class="flex justify-center items-center w-[300px] h-full  shap relative overflow-hidden">
                            <div class="flex justify-center items-center w-[280px] h-[75%] shap bg-[var(--secondary)]">
                                <img class="bg-center bg-cover w-[260px] h-[94%] shap" 
                                    src="../../public/assets/remote_1.png"
                                    alt="Remote Game"/>
                            </div>
                            <div class="info-bar absolute bottom-0 left-0 right-0 h-[200px] bg-[var(--secondary)]/90 text-white !p-6 flex flex-col justify-end !pb-15">
                                <div class="flex items-end justify-between !mb-5">
                                    <div class="flex flex-col !m-auto">
                                        <div style="color: ${colorTheme}" class="text-lg font-bold !mb-1  tracking-[3px]">Remote Game</div>
                                    </div>
                                </div>
                                <div class="flex !gap-3">
                                    <button class="flex-1 bg-[var(--text)] dynamic-hover-bg text-[var(--secondary)] hover:text-white !py-3 !px-6 rounded-lg font-semibold text-sm transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center !gap-2" style="--hover-color: ${colorTheme};">
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M8 5v10l8-5-8-5z"/>
                                        </svg>
                                        Play Now
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div style="background-color: ${colorTheme}" class="absolute w-18 h-18 bottom-0 left-[230px]  inverted-triangle z-20"></div>
                        <div class="absolute w-9 h-9 bottom-[10px] left-[253px] bg-[var(--secondary)] inverted-triangle z-30"></div>
                    </div>

                    
                
            </div>
        </main>
    `;

    return element;
}

    onMount(): void {
        console.log("Game View Mounted");
    }
    
    

}