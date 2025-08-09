import { View } from "../app/View";

export class GameView extends View{
    
    constructor(){
        super()
    }
    
    render(): HTMLElement{
        const element = document.createElement('section');
        element.classList.add('bg-[var(--primary)]');
        element.classList.add('w-[100%]');
        element.classList.add('h-[100%]');
        element.classList.add('rounded-4xl');
        element.classList.add('!mt-[24px]');
        element.classList.add('flex');
        element.classList.add('items-center');
        
        element.innerHTML = `
            <main class="overflow-y-auto w-[100%] h-[100%] gap-2 !m-auto bg-[rgba(220,219,219,0.08)] backdrop-blur-3xl rounded-4xl border border-white/10 p-8">
               <div class="text-center !mt-17 animate-fade-in">
                    <h1 class="text-5xl font-extrabold text-white leading-tight tracking-wide">
                        Every 
                        <span class="inline-block !pb-1  border-[var(--accent)]">Champion</span> 
                        Starts With a 
                        <span class="inline-block text-[var(--accent)] drop-shadow-md  animate-bounce-short">Click</span>
                    </h1>
                    <p class="text-gray-300 text-lg !mt-5 opacity-90 tracking-wide">
                        Your Journey to Glory Begins Now
                    </p>
                </div>
                <div class="h-[60%] !mt-16 !px-8 flex justify-center gap-8 ">
                    <!-- Local Game -->
                    
                    <div class="game-card relative">
                        <div class="absolute w-18 h-18 top-0 bg-[var(--accent)] triangle z-20"></div>
                        <div class="absolute w-9 h-9 top-[12px] left-[10px] bg-[var(--secondary)] triangle z-30"></div>
                        
                        <!-- Main Card Container -->
                        <div class="flex justify-center items-center w-[300px] h-full bg-[var(--accent)] shap relative overflow-hidden">
                            <!-- Inner Container -->
                            <div class="flex justify-center items-center w-[280px] h-[75%] shap bg-[var(--secondary)]">
                                <!-- Game Image -->
                                <img class="bg-center bg-cover w-[260px] h-[94%] shap" 
                                    src="../../public/assets/localGame.webp"
                                    alt="Local Game"/>
                            </div>
                            
                           <!-- Info Bar (slides up from bottom) -->
                            <div class="info-bar absolute bottom-0 left-0 right-0 h-[200px] bg-[var(--secondary)]/90  text-white !p-6 flex flex-col justify-end !pb-15">
                                <!-- Game Info Section -->
                                <div class="flex items-end justify-between !mb-5 ">
                                    <div class="flex flex-col !m-auto">
                                        <div class="text-lg font-bold !mb-1 text-[var(--accent)] tracking-[3px]">Local Multiplayer</div>
                                        
                                    </div>
                                    
                                </div>
                                
                                <!-- Action Buttons -->
                                <div class="flex gap-3">
                                    <button class="flex-1 bg-[var(--text)] hover:bg-[var(--accent)] text-[var(--secondary)] hover:text-white !py-3 !px-6 rounded-lg font-semibold text-sm transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2">
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

                    <!-- With AI Game -->
                    <div class="game-card relative">
                        <div class="absolute w-18 h-18 top-0 bg-[var(--accent)] triangle z-20"></div>
                        <div class="absolute w-9 h-9 top-[12px] left-[10px] bg-[var(--secondary)] triangle z-30"></div>
                        
                        <!-- Main Card Container -->
                        <div class="flex justify-center items-center w-[300px] h-full bg-[var(--accent)] shap relative overflow-hidden">
                            <!-- Inner Container -->
                            <div class="flex justify-center items-center w-[280px] h-[75%] shap bg-[var(--secondary)]">
                                <!-- Game Image -->
                                <img class="bg-center bg-cover w-[260px] h-[94%] shap" 
                                    src="../../public/assets/PlayWithAI_1.png"
                                    alt="Local Game"/>
                            </div>
                            
                           <!-- Info Bar (slides up from bottom) -->
                            <div class="info-bar absolute bottom-0 left-0 right-0 h-[200px] bg-[var(--secondary)]/90  text-white !p-6 flex flex-col justify-end !pb-15">
                                <!-- Game Info Section -->
                                <div class="flex items-end justify-between !mb-5 ">
                                    <div class="flex flex-col !m-auto">
                                        <div class="text-lg font-bold !mb-1 text-[var(--accent)] tracking-[3px]">Play with AI</div>
                                        
                                    </div>
                                    
                                </div>
                                
                                <!-- Action Buttons -->
                                <div class="flex gap-3">
                                    <button class="flex-1 bg-[var(--text)] hover:bg-[var(--accent)] text-[var(--secondary)] hover:text-white !py-3 !px-6 rounded-lg font-semibold text-sm transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2">
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

                    <!-- Remote Game -->
                    <div class="game-card relative">
                        <div class="absolute w-18 h-18 top-0 bg-[var(--accent)] triangle z-20"></div>
                        <div class="absolute w-9 h-9 top-[12px] left-[10px] bg-[var(--secondary)] triangle z-30"></div>
                        
                        <!-- Main Card Container -->
                        <div class="flex justify-center items-center w-[300px] h-full bg-[var(--accent)] shap relative overflow-hidden">
                            <!-- Inner Container -->
                            <div class="flex justify-center items-center w-[280px] h-[75%] shap bg-[var(--secondary)]">
                                <!-- Game Image -->
                                <img class="bg-center bg-cover w-[260px] h-[94%] shap" 
                                    src="../../public/assets/remote_1.png"
                                    alt="Local Game"/>
                            </div>
                            
                           <!-- Info Bar (slides up from bottom) -->
                            <div class="info-bar absolute bottom-0 left-0 right-0 h-[200px] bg-[var(--secondary)]/90  text-white !p-6 flex flex-col justify-end !pb-15">
                                <!-- Game Info Section -->
                                <div class="flex items-end justify-between !mb-5 ">
                                    <div class="flex flex-col !m-auto">
                                        <div class="text-lg font-bold !mb-1 text-[var(--accent)] tracking-[3px]">Remote Game</div>
                                        
                                    </div>
                                    
                                </div>
                                
                                <!-- Action Buttons -->
                                <div class="flex gap-3">
                                    <button class="flex-1 bg-[var(--text)] hover:bg-[var(--accent)] text-[var(--secondary)] hover:text-white !py-3 !px-6 rounded-lg font-semibold text-sm transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2">
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

                    <!-- Multiplayer Game -->
                    <div class="game-card relative">
                        <div class="absolute w-18 h-18 top-0 bg-[var(--accent)] triangle z-20"></div>
                        <div class="absolute w-9 h-9 top-[12px] left-[10px] bg-[var(--secondary)] triangle z-30"></div>
                        
                        <!-- Main Card Container -->
                        <div class="flex justify-center items-center w-[300px] h-full bg-[var(--accent)] shap relative overflow-hidden">
                            <!-- Inner Container -->
                            <div class="flex justify-center items-center w-[280px] h-[75%] shap bg-[var(--secondary)]">
                                <!-- Game Image -->
                                <img class="bg-center bg-cover w-[260px] h-[94%] shap" 
                                    src="../../public/assets/multiplayer_1.png"
                                    alt="Local Game"/>
                            </div>
                            
                           <!-- Info Bar (slides up from bottom) -->
                            <div class="info-bar absolute bottom-0 left-0 right-0 h-[200px] bg-[var(--secondary)]/90  text-white !p-6 flex flex-col justify-end !pb-15">
                                <!-- Game Info Section -->
                                <div class="flex items-end justify-between !mb-5 ">
                                    <div class="flex flex-col !m-auto">
                                        <div class="text-lg font-bold !mb-1 text-[var(--accent)] tracking-[3px]">Multiplayer Game</div>
                                        
                                    </div>
                                    
                                </div>
                                
                                <!-- Action Buttons -->
                                <div class="flex gap-3">
                                    <button class="flex-1 bg-[var(--text)] hover:bg-[var(--accent)] text-[var(--secondary)] hover:text-white !py-3 !px-6 rounded-lg font-semibold text-sm transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2">
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
            </main>
        `;

        return element;
    }

    onMount(): void {
       
    }
    
 
}