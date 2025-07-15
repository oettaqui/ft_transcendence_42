

//         .features {
//             padding: 6rem 0;
//             background-color: var(--secondary);
//         }

//         .section-title {
//             font-size: 2.5rem;
//             font-weight: 700;
//             margin-bottom: 3rem;
//             text-align: center;
//         }

//         .features-grid {
//             display: grid;
//             grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
//             gap: 2rem;
//         }

//         .feature-card {
//             background-color: var(--primary);
//             border-radius: 12px;
//             padding: 2rem;
//             transition: transform 0.3s ease, box-shadow 0.3s ease;
//             border: 1px solid rgba(0, 0, 0, 0.05);
//             box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
//         }

//         body.dark-mode .feature-card {
//             border: 1px solid rgba(255, 255, 255, 0.05);
//             box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
//         }

//         .feature-card:hover {
//             transform: translateY(-10px);
//             box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
//         }

//         body.dark-mode .feature-card:hover {
//             box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
//         }

//         .feature-icon {
//             font-size: 2rem;
//             margin-bottom: 1rem;
//             color: var(--accent);
//         }

//         .feature-title {
//             font-size: 1.5rem;
//             font-weight: 600;
//             margin-bottom: 1rem;
//         }

//         .feature-description {
//             color: var(--text-secondary);
//         }

//         .cta {
//             padding: 6rem 0;
//             text-align: center;
//         }

//         .cta-title {
//             font-size: 2.5rem;
//             font-weight: 700;
//             margin-bottom: 1.5rem;
//         }

//         .cta-description {
//             color: var(--text-secondary);
//             max-width: 600px;
//             margin: 0 auto 2rem;
//         }

//         .glowing-effect {
//             position: absolute;
//             width: 200px;
//             height: 200px;
//             background: var(--accent);
//             border-radius: 50%;
//             filter: blur(100px);
//             opacity: 0.1;
//             z-index: -1;
//         }

//         body.dark-mode .glowing-effect {
//             opacity: 0.15;
//         }

//         .effect-1 {
//             top: 20%;
//             left: 10%;
//         }

//         .effect-2 {
//             bottom: 20%;
//             right: 10%;
//             background: var(--success);
//         }

//         footer {
//             background-color: var(--secondary);
//             padding: 3rem 0;
//             text-align: center;
//             color: var(--text-secondary);
//         }

//         .footer-links {
//             display: flex;
//             justify-content: center;
//             gap: 2rem;
//             margin-bottom: 2rem;
//         }

//         .footer-links a {
//             color: var(--text);
//             text-decoration: none;
//         }

//         .footer-links a:hover {
//             color: var(--accent);
//         }

//         @media (max-width: 768px) {
//             .hero-content {
//                 flex-direction: column;
//             }

//             .hero-title {
//                 font-size: 2.5rem;
//             }

//             .nav-links {
//                 display: none;
//             }
//         }
//             `;
//             document.head.appendChild(style);
//         }

//         const element = document.createElement('div');
//         element.innerHTML = `
//             <div class="glowing-effect effect-1"></div>
//             <div class="glowing-effect effect-2"></div>

//             <header>
//                 <div class="container">
//                     <nav>
//                         <a href="#" class="logo">PINGPONG</a>
//                         <div class="nav-links">
//                             <a href="">Home</a>
//                             <a href="">Features</a>
//                             <a href="">Tournament</a>
//                             <a href="">Leaderboard</a>
//                         </div>
//                         <div class="auth-buttons">
//                             <button class="btn btn-outline"> <a href="/login">Login</a></button>
//                             <button class="btn btn-primary"><a href="/register">Sign Up</a></button>
//                             <button class="theme-toggle" id="themeToggle">🌓</button>
//                         </div>
//                     </nav>
//                 </div>
//             </header>

//             <section class="hero">
//                 <div class="container">
//                     <div class="hero-content">
//                         <div class="hero-text">
//                             <h1 class="hero-title">Experience the Classic <span>PONG</span> Game Like Never Before</h1>
//                             <p class="hero-description">
//                                 Jump into real-time multiplayer matches, compete in tournaments, and challenge friends in this modern take on the iconic arcade game.
//                             </p>
//                             <div class="hero-buttons">
//                                 <button class="btn btn-primary">Play Now</button>
//                                 <button class="btn btn-outline">Join Tournament</button>
//                             </div>
//                         </div>
//                         <div class="hero-visual">
//                             <div class="pong-game">
//                                 <div class="pong-field">
//                                     <div class="center-line"></div>
//                                     <div class="score">
//                                         <div class="player-1-score">4</div>
//                                         <div class="player-2-score">2</div>
//                                     </div>
//                                     <div class="paddle paddle-left"></div>
//                                     <div class="paddle paddle-right"></div>
//                                     <div class="ball"></div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             <section class="features">
//                 <div class="container">
//                     <h2 class="section-title">Game Features</h2>
//                     <div class="features-grid">
//                         <div class="feature-card">
//                             <div class="feature-icon">🏆</div>
//                             <h3 class="feature-title">Tournament System</h3>
//                             <p class="feature-description">Compete against other players in organized tournaments with real-time matchmaking and leaderboards.</p>
//                         </div>
//                         <div class="feature-card">
//                             <div class="feature-icon">👥</div>
//                             <h3 class="feature-title">Multiplayer Experience</h3>
//                             <p class="feature-description">Play against friends or random opponents in real-time matches with smooth gameplay.</p>
//                         </div>
//                         <div class="feature-card">
//                             <div class="feature-icon">🤖</div>
//                             <h3 class="feature-title">AI Opponents</h3>
//                             <p class="feature-description">Practice your skills against AI opponents with various difficulty levels to sharpen your gameplay.</p>
//                         </div>
//                         <div class="feature-card">
//                             <div class="feature-icon">💬</div>
//                             <h3 class="feature-title">Live Chat</h3>
//                             <p class="feature-description">Chat with other players, challenge friends, and build your gaming community.</p>
//                         </div>
//                         <div class="feature-card">
//                             <div class="feature-icon">📊</div>
//                             <h3 class="feature-title">Stats Dashboard</h3>
//                             <p class="feature-description">Track your performance with detailed statistics, win/loss ratios, and match history.</p>
//                         </div>
//                         <div class="feature-card">
//                             <div class="feature-icon">🎮</div>
//                             <h3 class="feature-title">Game Customization</h3>
//                             <p class="feature-description">Customize your gameplay experience with different power-ups, themes, and game modes.</p>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             <section class="cta">
//                 <div class="container">
//                     <h2 class="cta-title">Ready to Play?</h2>
//                     <p class="cta-description">
//                         Join thousands of players already enjoying the ultimate Pong experience. Sign up now and start climbing the leaderboard!
//                     </p>
//                     <button class="btn btn-primary"><a href="/login">Sign Up Now</a></button>
//                 </div>
//             </section>

//             <footer>
//                 <div class="container">
//                     <div class="footer-links">
//                         <a href="">About Us</a>
//                         <a href="">Privacy Policy</a>
//                         <a href="">Terms of Service</a>
//                         <a href="">Contact</a>
//                     </div>
//                     <p>© 2025 Transcendence Pong. All rights reserved.</p>
//                 </div>
//             </footer>
//         `;

        
//         const themeToggle = element.querySelector('#themeToggle') as HTMLButtonElement;
//         const body = document.body;

//         const savedTheme = localStorage.getItem('theme');
//         const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
//         if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
//             body.classList.add('dark-mode');
//             themeToggle.textContent = '☀️';
//         }

//         themeToggle.addEventListener('click', () => {
//             body.classList.toggle('dark-mode');
//             const isDark = body.classList.contains('dark-mode');
//             themeToggle.textContent = isDark ? '☀️' : '🌓';
//             localStorage.setItem('theme', isDark ? 'dark' : 'light');
//         });

//         return element;
//     }
// }



export class HomeView {
    constructor() {}

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

            <section class="cta !pt-24  bg-[var(--primary)]">
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
    
            <section class="!pt-24 !pb-24">
                <div class="container">
                    <h2 class="text-4xl font-bold text-center !mb-4">The Minds Behind the Code</h2>
                    <p class="text-[16px] text-center max-w-[500px] text-[var(--text-secondary)] !mx-auto !mb-16">
                        The passionate team who transformed ideas into digital reality
                    </p>

                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div class="group relative bg-[var(--primary)] backdrop-blur-sm rounded-xl !p-6 border border-white/10 hover:border-[var(--accent)] transition-all duration-300 hover:-translate-y-2">
                            <div class=" ">
                                <div class="w-32 h-32 !mx-auto !mb-6 overflow-hidden rounded-full border-2 border-white/20 group-hover:bg-[var(--accent)]">
                                    <img src="/assets/Ettaqui_1.png" alt="Team Member" class="w-full h-full object-cover">
                                </div>
                            </div>
                            <h3 class="text-xl font-semibold text-center">Oussama Ettaqui</h3>
                            <p class="text-[var(--accent)] text-center !mt-3">Frontend</p>
                            
                        </div>

                        <div class="group relative bg-[var(--primary)] backdrop-blur-sm rounded-xl !p-6 border border-white/10 hover:border-[var(--accent)] transition-all duration-300 hover:-translate-y-2">
                            <div class="w-32 h-32 !mx-auto !mb-6 overflow-hidden rounded-full border-2 border-white/20 group-hover:bg-[var(--accent)]">
                                <img src="/assets/Ettaqui_1.png" alt="Team Member" class="w-full h-full object-cover">
                            </div>
                            <h3 class="text-xl font-semibold text-center">Oussama Ettaqui</h3>
                            <p class="text-[var(--accent)] text-center !mt-3">Backend</p>
                            
                        </div>

                        <div class="group relative bg-[var(--primary)] backdrop-blur-sm rounded-xl !p-6 border border-white/10 hover:border-[var(--accent)] transition-all duration-300 hover:-translate-y-2">
                            <div class="w-32 h-32 !mx-auto !mb-6 overflow-hidden rounded-full border-2 border-white/20 group-hover:bg-[var(--accent)]">
                                <img src="/assets/Ettaqui_1.png" alt="Team Member" class="w-full h-full object-cover">
                            </div>
                            <h3 class="text-xl font-semibold text-center">Oussama Ettaqui</h3>
                            <p class="text-[var(--accent)] text-center !mt-3">Security</p>
                           
                        </div>


                        <div class="group relative bg-[var(--primary)] backdrop-blur-sm rounded-xl !p-6 border border-white/10 hover:border-[var(--accent)] transition-all duration-300 hover:-translate-y-2">
                            <div class="w-32 h-32 !mx-auto !mb-6 overflow-hidden rounded-full border-2 border-white/20 group-hover:bg-[var(--accent)]">
                                <img src="/assets/Ettaqui_1.png" alt="Team Member" class="w-full h-full object-cover">
                            </div>
                            <h3 class="text-xl font-semibold text-center">Oussama Ettaqui</h3>
                            <p class="text-[var(--accent)] text-center !mt-3">Web Socket</p>
                           
                        </div>

                    </div>
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