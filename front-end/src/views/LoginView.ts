
import {View} from "../app/View"

export class LoginView extends View{
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

            <section class="min-h-[90vh] flex items-center  bg-grid-pattern">
                <div class="container">
                    <div class="flex items-center gap-[4rem]">

                        <div class="flex-1 relative">
                            <div class="pong-field1 w-[100%] aspect-[4/3] bg-[var(--secondary)] relative overflow-hidden border border-[rgba(0,0,0,0.1)] shadow-[0_0_40px_rgba(243,156,18,0.1)] rounded-[12px]">
                                <div class="pong-field w-[100%] h-[100%] relative">
                                    <!-- Particle effects container -->
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
                                <p class="uppercase !mb-[10px] text-2xl max-w-[300px] text-center text-[var(--text-secondary)]"> Sing In to you account</p>
                                <form class="auth-form flex flex-col gap-7" id="loginForm">
                                    <div class="flex flex-col gap-1"> <span class="text-[13px] font-medium">Email Address:* </span> <input type="email" required  class="bg-[var(--secondary)] text-[var(--text)] !p-[10px] focus:outline-none rounded-lg border border-transparent  focus:border-[var(--accent)] transition-colors" /></div>
                                    <div class="flex flex-col gap-1"> <span class="text-[13px] font-medium">Password:* </span> <input type="password" required  class="bg-[var(--secondary)] text-[var(--text)] !p-[10px] focus:outline-none rounded-lg border border-transparent  focus:border-[var(--accent)] transition-colors" /></div>
                                    
                                    <a href="" class="enhanced-btn secondary-btn">
                                        <span class="flex items-center justify-center !mt-1"> Sing In </span>
                                    </a>
                                    <p class="auth-switch ">Don't have an account? <a href="/register" class="">Register here</a></p>
                                </form>
                                <div class="flex justify-between items-center gap-6">
                                    <span class="block  w-[130px] h-0.5 bg-[var(--text-secondary)] rounded-2xl"></span>
                                    <span class="block text-[var(--text-secondary)] text-sm">OR</span>
                                    <span class="block w-[130px] h-0.5 bg-[var(--text-secondary)] rounded-2xl"></span>
                                </div>

                                <div class="flex items-center justify-center gap-4 w-full">
                                    <!-- Google OAuth Button -->
                                    <a href="/auth/google" class="flex items-center justify-center gap-3 bg-[var(--secondary)] text-[var(--text)] border border-[var(--text-secondary)] hover:border-[var(--accent)]  hover:bg-opacity-80 !py-3 !px-6 rounded-lg transition-all hover:scale-105">
                                        <svg class="w-6 h-6" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                        </svg>
                                    </a>
                                    
                                    <!-- 42 Intra OAuth Button -->
                                    <a href="/auth/42" 
                                        class=" w-[70px] h-[50px]
                                            flex items-center justify-center gap-3 
                                            border border-[var(--text-secondary)] 
                                            hover:border-[var(--accent)] hover:bg-opacity-80 !py-3 !px-6 
                                            rounded-lg transition-all hover:scale-105 bg-[url('../../public/assets/Intra-icon.png')] 
                                            bg-no-repeat bg-center bg-[length:70px_70px]">
                                    </a>
                                    
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </section>

        `;

        
        console.log('login submitted');
        
        this.add3DTiltEffect(element);
        this.addParticleEffects(element);
        return element;
    }

    
}


// protected onMount(): void {
//         // Set up form handling
//         const form = this.querySelector<HTMLFormElement>('#loginForm');
//         if (form) {
//             this.addEventListener(form, 'submit', this.handleLogin.bind(this));
//         }

//         // Add visual effects
//         this.add3DTiltEffect('.pong-field1');
//         this.addParticleEffects(this.element!);
//     }

//     private handleLogin(e: Event): void {
//         e.preventDefault();
//         const formData = this.getFormData('#loginForm');
//         if (formData && this.validateForm('#loginForm')) {
//             console.log('Login submitted', formData);
//             // Handle login logic here
//         }
//     }