
import {View} from "../app/View"

export class LandingPageView extends View{

    private currentLoadingToastId: string | null = null;
    constructor() {
        super();
    }

    render(): HTMLElement {
        const element = document.createElement('div');
        element.innerHTML = `
            <header class="h-20 py-7 px-0 fixed flex items-center w-[100%] z-[100] bg-[rgba(13, 17, 23, 0.95)] backdrop-blur-md shadow-md">
                <div class="container">
                    <nav class="flex justify-between items-center">
                        <a href="" class="text-3xl font-extrabold tracking-widest text-[color:var(--text)] no-underline"><span class="text-[var(--accent)]">P</span>ING<span class="text-[var(--accent)]">P</span>ONG</a>
                        <div class="flex gap-8">
                            <a class="hidden" href="">Home</a>
                            <a class="hidden" href="">Features</a>
                            <a class="hidden" href="">Tournament</a>
                        </div>
                        <div class="flex gap-4 items-center">
                            <a href="/login" class="enhanced-btn secondary-btn">
                                <span class="flex items-center justify-center !mt-1"> Connexion </span>
                            </a>
                        </div>
                    </nav>
                </div>
            </header>

            <section class="min-h-[90vh] flex items-center pt-[4rem] bg-grid-pattern">
                <div class="container">
                    <div class="flex items-center gap-[4rem]">
                        <div class="flex-1">
                            <div class="flex flex-col justify-between h-[500px]">
                                <h1 class="text-[48px] font-extrabold mb-4">Experience the Classic <span class="text-[var(--accent)]">PONG</span> Game Like Never Before</h1>
                                <p class="text-[18px] mb-8 max-w-[600px] text-[var(--text-secondary)]">
                                    Jump into real-time multiplayer matches, compete in tournaments, and challenge friends in this modern take on the iconic arcade game.
                                </p>
                                <div class="flex gap-[2rem]">
                                    <a href="" class="enhanced-btn primary-btn">
                                        <span class="flex items-center justify-center !mt-1"> Play Now </span>
                                    </a>
                                    <a href="" class="enhanced-btn secondary-btn">
                                        <span class="flex items-center justify-center !mt-1"> Join Tournament </span>
                                    </a>
                                </div>
                            </div>
                        </div>

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
                    </div>
                </div>
            </section>
        
            <section class="marquee-section">
                <div class="marquee-container">
                    <div class="marquee-content">
                        <div class="marquee-item"><span class="text-accent">P</span>ING<span class="text-accent">P</span>ONG</div>
                        <div class="marquee-item"><span class="text-accent">S</span>MASH</div>
                        <div class="marquee-item"><span class="text-accent">S</span>ERVE</div>
                        <div class="marquee-item"><span class="text-accent">P</span>ADDLE</div>
                        <div class="marquee-item"><span class="text-accent">W</span>IN</div>
                        <div class="marquee-item"><span class="text-accent">P</span>LAY</div>
                        
                        <div class="marquee-item"><span class="text-accent">P</span>ING<span class="text-accent">P</span>ONG</div>
                        <div class="marquee-item"><span class="text-accent">S</span>MASH</div>
                        <div class="marquee-item"><span class="text-accent">S</span>ERVE</div>
                        <div class="marquee-item"><span class="text-accent">P</span>ADDLE</div>
                        <div class="marquee-item"><span class="text-accent">W</span>IN</div>
                        <div class="marquee-item"><span class="text-accent">P</span>LAY</div>
                    </div>
                </div>
            </section>
            <section class="features !pt-24 !pb-24">
                <div class="container">
                    <h2 class="section-title text-4xl font-bold !mb-12 text-center">Game Features</h2>
                    <div class="features-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8">
                        <div class="feature-card">
                            <div class="feature-icon">🏆</div>
                            <h3 class="feature-title">Tournament System</h3>
                            <p class="feature-description">Compete against other players in organized tournaments with real-time matchmaking and leaderboards.</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon">👥</div>
                            <h3 class="feature-title">Multiplayer Experience</h3>
                            <p class="feature-description">Play against friends or random opponents in real-time matches with smooth gameplay.</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon">🤖</div>
                            <h3 class="feature-title">AI Opponents</h3>
                            <p class="feature-description">Practice your skills against AI opponents with various difficulty levels to sharpen your gameplay.</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon">💬</div>
                            <h3 class="feature-title">Live Chat</h3>
                            <p class="feature-description">Chat with other players, challenge friends, and build your gaming community.</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon">📊</div>
                            <h3 class="feature-title">Stats Dashboard</h3>
                            <p class="feature-description">Track your performance with detailed statistics, win/loss ratios, and match history.</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon">🎮</div>
                            <h3 class="feature-title">Game Customization</h3>
                            <p class="feature-description">Customize your gameplay experience with different power-ups, themes, and game modes.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section class="cta !pt-24">
                <div class="container flex flex-col items-center justify-center gap-5 !pb-24">
                    <h2 class="cta-title text-4xl font-bold text-center">Ready to Play?</h2>
                    <p class="cta-description text-[var(--text-secondary)] max-w-[600px] !m-auto">
                        Join thousands of players already enjoying the ultimate Pong experience. Sign up now and start climbing the leaderboard!
                    </p>
                    <a href="" class="enhanced-btn primary-btn max-w-[200px]">
                        <span class="flex items-center justify-center !mt-1"> Sign Up Now</a> </span>
                    </a>
                </div>
            </section>
    
            

            <footer class="!pt-12 !pb-10  bg-[var(--primary)]">
                <div class="container  items-center">
                    <p class="text-center">© 2025 Transcendence Pong. All rights reserved.</p>
                </div>
            </footer>
            
            `;
         
            
            this.add3DTiltEffect(element);
            this.addParticleEffects(element);
            return element;
        }



   
}