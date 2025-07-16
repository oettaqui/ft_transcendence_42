

export class RegisterView {
    constructor() {}

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

            <section class="min-h-[90vh] flex items-center bg-grid-pattern !pt-24 !pb-24">
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
                                    <div class="flex flex-col gap-1 w-[400px]"> <span class="text-[13px] font-medium">Avatar: </span> <input type="file" required  class="bg-[var(--secondary)] text-[var(--text)] !p-[10px] focus:outline-none rounded-lg border border-transparent  focus:border-[var(--accent)] transition-colors" /></div>
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

    private add3DTiltEffect(container: HTMLElement): void {
            setTimeout(() => {
                const pongField = container.querySelector('.pong-field1') as HTMLElement;
                
                if (!pongField) return;

            const style = document.createElement('style');
            style.textContent = `
                .pong-field1 {
                    transition: transform 0.3s ease-out;
                    transform-style: preserve-3d;
                    perspective: 1000px;
                }
                .pong-field1::before {
                    content: '';
                    position: absolute;
                    top: 5%;
                    left: 5%;
                    right: 5%;
                    bottom: 5%;
                    background: rgba(0, 0, 0, 0.1);
                    border-radius: 8px;
                    filter: blur(10px);
                    z-index: -1;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                .pong-field1:hover::before {
                    opacity: 1;
                }
            `;
            document.head.appendChild(style);

            pongField.addEventListener('mousemove', (e) => {
                const rect = pongField.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const xPercent = x / rect.width;
                const yPercent = y / rect.height;
                const rotateY = (xPercent - 0.5) * 10;
                const rotateX = (0.5 - yPercent) * 10;
                
                pongField.style.transform = `
                    perspective(1000px) 
                    rotateX(${rotateX}deg) 
                    rotateY(${rotateY}deg)
                    translateZ(10px)
                `;
            });

            pongField.addEventListener('mouseleave', () => {
                pongField.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            });
        }, 0);
    }

    private addParticleEffects(container: HTMLElement): void {
        setTimeout(() => {
            const particlesContainer = container.querySelector('.particles-container') as HTMLElement;
            if (!particlesContainer) return;

            
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.cssText = `
                    position: absolute;
                    width: 2px;
                    height: 2px;
                    background: var(--accent);
                    border-radius: 50%;
                    opacity: 0.6;
                    animation: floatParticle ${8 + Math.random() * 4}s ease-in-out infinite;
                    animation-delay: ${Math.random() * 2}s;
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                `;
                particlesContainer.appendChild(particle);
            }
        }, 100);
    }
}
