
import {View} from "../app/View"

export class RegisterView extends View {
    constructor() {
        super();
    }

    render(): HTMLElement {
       
        const element = document.createElement('div');

        element.innerHTML = `
           <header class="h-20 py-7 px-0 fixed flex items-center w-[100%] z-[100] bg-[rgba(13, 17, 23, 0.95)] backdrop-blur-md shadow-md">
                <div class="container">
                    <nav class="flex justify-between items-center">
                        <a href="/" class="text-3xl font-extrabold tracking-widest text-[color:var(--text)] no-underline"><span class="text-[var(--accent)]">P</span>ING<span class="text-[var(--accent)]">P</span>ONG</a>
                    
                    </nav>
                </div>
            </header>

            <section class="min-h-[90vh] flex items-center bg-grid-pattern !pt-28 !pb-24">
                <div class="container">
                    <div class="flex items-center gap-[4rem]">

                     <div class="flex-1 relative">
                            <div class="pong-field1 w-[100%] aspect-[4/3] bg-[var(--secondary)] relative overflow-hidden border border-[rgba(0,0,0,0.1)] shadow-[0_0_40px_rgba(243,156,18,0.1)] rounded-[12px]">
                                <div class="pong-field w-[100%] h-[100%] relative">
                                    <div class="particles-container absolute inset-0 pointer-events-none z-[0]"></div>
                                    
                                    <div class="center-line absolute top-0 left-[50%] w-[8px] h-[100%] bg-[rgba(204,204,204,0.1)] z-[1] -translate-x-1/2"></div>
                                    <div class="score absolute top-[20px] w-[100%] flex justify-center gap-[100px] text-4xl z-[2] text-[var(--text-secondary)]">
                                        <div class="player-1-score">5</div>
                                        <div class="player-2-score">1</div>
                                    </div>
                                    <div class="paddle paddle-left left-[20px] -translate-y-1/2 animated-paddle"></div>
                                    <div class="paddle paddle-right right-[20px] -translate-y-1/2 animated-paddle"></div>
                                    <div class="ball pulsing-ball absolute w-[20px] h-[20px] bg-[var(--accent)] rounded-[50%]  top-1/2 left-[52%] -translate-x-1/2 -translate-y-1/2 shadow-[0_0_15px_rgba(243,156,18,0.4)]"></div>
                                </div>
                            </div>
                        </div>
            
                        <div class="flex-1">
                            <div class="flex flex-col justify-center items-center gap-8"> 
                                <h2  class="text-6xl !mb-[10px] font-extrabold tracking-widest text-[color:var(--text)] no-underline"><span class="text-[var(--accent)]">P</span>ING<span class="text-[var(--accent)]">P</span>ONG</h2>
                                <p class="uppercase !mb-[10px] text-2xl max-w-[300px] text-center text-[var(--text-secondary)]"> Ready to Play? Sign Up!</p>
                                <form class="auth-form flex flex-col items-center justify-center gap-7 " id="loginForm">
                                    <div class="flex flex-col gap-1 w-[400px]"> <span class="text-[13px] font-medium">Username:* </span> <input type="text" required  class="bg-[var(--secondary)] text-[var(--text)] !p-[10px] focus:outline-none rounded-lg border border-transparent  focus:border-[var(--accent)] transition-colors" /></div>
                                    <div class="flex flex-col gap-1 w-[400px]"> <span class="text-[13px] font-medium">Email Address:* </span> <input type="email" required  class="bg-[var(--secondary)] text-[var(--text)] !p-[10px] focus:outline-none rounded-lg border border-transparent  focus:border-[var(--accent)] transition-colors" /></div>
                                    <div class="flex flex-col gap-1 w-[400px]"> <span class="text-[13px] font-medium">Password:* </span> <input type="password" required  class="bg-[var(--secondary)] text-[var(--text)] !p-[10px] focus:outline-none rounded-lg border border-transparent  focus:border-[var(--accent)] transition-colors" /></div>
                                    <div class="flex flex-col gap-1 w-[400px]"> <span class="text-[13px] font-medium">Confirm Password:* </span> <input type="password" required  class="bg-[var(--secondary)] text-[var(--text)] !p-[10px] focus:outline-none rounded-lg border border-transparent  focus:border-[var(--accent)] transition-colors" /></div>
                                    
                                    <a href="" class="enhanced-btn secondary-btn w-[400px]">
                                        <span class="flex items-center justify-center !mt-1"> Sing Up </span>
                                    </a>
                                    <p class="auth-switch">Already have an account? <a href="/login">Login here</a></p>
                                </form>
                               
                               

                            </div>
                        </div>


                    </div>

                </div>
            </section>

        `;

        
        console.log('register submitted');
        
        this.add3DTiltEffect(element);
        this.addParticleEffects(element);
        return element;
    }

   
}
