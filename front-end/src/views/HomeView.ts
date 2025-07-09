


// export class HomeView{
//     constructor() {
//     }

//     render() {
//         const element = document.createElement("div");
//         element.innerHTML = `
//          <div class="glowing-effect effect-1"></div>
//     <div class="glowing-effect effect-2"></div>

//     <header>
//         <div class="container">
//             <nav>
//                 <a href="#" class="logo">PINGPONG</a>
//                 <div class="nav-links">
//                     <a href="#">Home</a>
//                     <a href="#">Features</a>
//                     <a href="#">Tournament</a>
//                     <a href="#">Leaderboard</a>
//                 </div>
//                 <div class="auth-buttons">
//                     <button class="btn btn-outline">Login</button>
//                     <button class="btn btn-primary">Sign Up</button>
//                     <button class="theme-toggle" id="themeToggle">🌓</button>
//                 </div>
//             </nav>
//         </div>
//     </header>

//     <section class="hero">
//         <div class="container">
//             <div class="hero-content">
//                 <div class="hero-text">
//                     <h1 class="hero-title">Experience the Classic <span>PONG</span> Game Like Never Before</h1>
//                     <p class="hero-description">
//                         Jump into real-time multiplayer matches, compete in tournaments, and challenge friends in this modern take on the iconic arcade game.
//                     </p>
//                     <div class="hero-buttons">
//                         <button class="btn btn-primary">Play Now</button>
//                         <button class="btn btn-outline">Join Tournament</button>
//                     </div>
//                 </div>
//                 <div class="hero-visual">
//                     <div class="pong-game">
//                         <div class="pong-field">
//                             <div class="center-line"></div>
//                             <div class="score">
//                                 <div class="player-1-score">4</div>
//                                 <div class="player-2-score">2</div>
//                             </div>
//                             <div class="paddle paddle-left"></div>
//                             <div class="paddle paddle-right"></div>
//                             <div class="ball"></div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </section>

//     <section class="features">
//         <div class="container">
//             <h2 class="section-title">Game Features</h2>
//             <div class="features-grid">
//                 <div class="feature-card">
//                     <div class="feature-icon">🏆</div>
//                     <h3 class="feature-title">Tournament System</h3>
//                     <p class="feature-description">Compete against other players in organized tournaments with real-time matchmaking and leaderboards.</p>
//                 </div>
//                 <div class="feature-card">
//                     <div class="feature-icon">👥</div>
//                     <h3 class="feature-title">Multiplayer Experience</h3>
//                     <p class="feature-description">Play against friends or random opponents in real-time matches with smooth gameplay.</p>
//                 </div>
//                 <div class="feature-card">
//                     <div class="feature-icon">🤖</div>
//                     <h3 class="feature-title">AI Opponents</h3>
//                     <p class="feature-description">Practice your skills against AI opponents with various difficulty levels to sharpen your gameplay.</p>
//                 </div>
//                 <div class="feature-card">
//                     <div class="feature-icon">💬</div>
//                     <h3 class="feature-title">Live Chat</h3>
//                     <p class="feature-description">Chat with other players, challenge friends, and build your gaming community.</p>
//                 </div>
//                 <div class="feature-card">
//                     <div class="feature-icon">📊</div>
//                     <h3 class="feature-title">Stats Dashboard</h3>
//                     <p class="feature-description">Track your performance with detailed statistics, win/loss ratios, and match history.</p>
//                 </div>
//                 <div class="feature-card">
//                     <div class="feature-icon">🎮</div>
//                     <h3 class="feature-title">Game Customization</h3>
//                     <p class="feature-description">Customize your gameplay experience with different power-ups, themes, and game modes.</p>
//                 </div>
//             </div>
//         </div>
//     </section>

//     <section class="cta">
//         <div class="container">
//             <h2 class="cta-title">Ready to Play?</h2>
//             <p class="cta-description">
//                 Join thousands of players already enjoying the ultimate Pong experience. Sign up now and start climbing the leaderboard!
//             </p>
//             <button class="btn btn-primary">Sign Up Now</button>
//         </div>
//     </section>

//     <footer>
//         <div class="container">
//             <div class="footer-links">
//                 <a href="#">About Us</a>
//                 <a href="#">Privacy Policy</a>
//                 <a href="#">Terms of Service</a>
//                 <a href="#">Contact</a>
//             </div>
//             <p>© 2025 Transcendence Pong. All rights reserved.</p>
//         </div>
//     </footer>
//         `;
//         return element;
//     }

// }

export class HomeView {
    constructor() {}

    render(): HTMLElement {
        // Inject styles once if not already present
        if (!document.getElementById('home-view-styles')) {
            const style = document.createElement('style');
            style.id = 'home-view-styles';
            style.textContent = `
                * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Inter', 'Roboto', sans-serif;
            transition: background-color 0.3s, color 0.3s, border-color 0.3s;
        }

        :root {
            /* Light Mode Colors */
            --primary-light: #ffffff;
            --secondary-light: #f5f5f5;
            --accent-light: #1a73e8;
            --text-light: #202124;
            --text-secondary-light: #5f6368;
            --success-light: #34a853;
            --danger-light: #ea4335;

            /* Dark Mode Colors */
            --primary-dark: #0d1117;
            --secondary-dark: #161b22;
            --accent-dark: #58a6ff;
            --text-dark: #e6edf3;
            --text-secondary-dark: #8b949e;
            --success-dark: #3fb950;
            --danger-dark: #f85149;

            /* Default to light mode */
            --primary: var(--primary-light);
            --secondary: var(--secondary-light);
            --accent: var(--accent-light);
            --text: var(--text-light);
            --text-secondary: var(--text-secondary-light);
            --success: var(--success-light);
            --danger: var(--danger-light);
        }

        body {
            background-color: var(--primary);
            color: var(--text);
            line-height: 1.6;
        }

        body.dark-mode {
            --primary: var(--primary-dark);
            --secondary: var(--secondary-dark);
            --accent: var(--accent-dark);
            --text: var(--text-dark);
            --text-secondary: var(--text-secondary-dark);
            --success: var(--success-dark);
            --danger: var(--danger-dark);
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
        }

        header {
            padding: 1.5rem 0;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 100;
            background-color: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        body.dark-mode header {
            background-color: rgba(13, 17, 23, 0.95);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            font-size: 1.8rem;
            font-weight: 800;
            letter-spacing: 2px;
            color: var(--text);
            text-decoration: none;
        }

        .nav-links {
            display: flex;
            gap: 2rem;
        }

        .nav-links a {
            color: var(--text);
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s;
        }

        .nav-links a:hover {
            color: var(--accent);
        }

        .auth-buttons {
            display: flex;
            gap: 1rem;
            align-items: center;
        }

        .btn {
            padding: 0.6rem 1.2rem;
            border-radius: 6px;
            border: none;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .btn-outline {
            background: transparent;
            border: 1px solid var(--accent);
            color: var(--accent);
        }

        .btn-outline:hover {
            background: rgba(88, 166, 255, 0.1);
        }

        .btn-primary {
            background: var(--accent);
            color: white;
        }

        .btn-primary:hover {
            background: #1765d1;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }

        body.dark-mode .btn-primary:hover {
            background: #4393e6;
        }

        .theme-toggle {
            background: none;
            border: none;
            color: var(--text);
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0.5rem;
            margin-left: 1rem;
        }

        .hero {
            min-height: 100vh;
            display: flex;
            align-items: center;
            padding-top: 4rem;
        }

        .hero-content {
            display: flex;
            align-items: center;
            gap: 4rem;
        }

        .hero-text {
            flex: 1;
        }

        .hero-title {
            font-size: 3.5rem;
            font-weight: 800;
            margin-bottom: 1.5rem;
            line-height: 1.2;
        }

        .hero-title span {
            color: var(--accent);
        }

        .hero-description {
            font-size: 1.2rem;
            color: var(--text-secondary);
            margin-bottom: 2rem;
            max-width: 600px;
        }

        .hero-buttons {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
        }

        .hero-visual {
            flex: 1;
            position: relative;
        }

        .pong-game {
            width: 100%;
            aspect-ratio: 4/3;
            background-color: var(--secondary);
            border-radius: 12px;
            position: relative;
            overflow: hidden;
            box-shadow: 0 0 40px rgba(26, 115, 232, 0.1);
            border: 1px solid rgba(0, 0, 0, 0.1);
        }

        body.dark-mode .pong-game {
            box-shadow: 0 0 40px rgba(88, 166, 255, 0.2);
            border: 1px solid rgba(88, 166, 255, 0.1);
        }

        .pong-field {
            width: 100%;
            height: 100%;
            position: relative;
        }

        .center-line {
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 6px;
            height: 100%;
            background: rgba(0, 0, 0, 0.1);
            z-index: 1;
        }

        body.dark-mode .center-line {
            background: rgba(255, 255, 255, 0.1);
        }

        .paddle {
            position: absolute;
            width: 16px;
            height: 100px;
            background-color: var(--text);
            border-radius: 6px;
        }

        .paddle-left {
            left: 20px;
            top: 50%;
            transform: translateY(-50%);
        }

        .paddle-right {
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
        }

        .ball {
            position: absolute;
            width: 20px;
            height: 20px;
            background-color: var(--accent);
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            box-shadow: 0 0 15px rgba(26, 115, 232, 0.4);
        }

        body.dark-mode .ball {
            box-shadow: 0 0 15px rgba(88, 166, 255, 0.6);
        }

        .score {
            position: absolute;
            top: 20px;
            width: 100%;
            display: flex;
            justify-content: center;
            gap: 100px;
            font-size: 2.5rem;
            font-weight: 700;
            z-index: 2;
            color: rgba(0, 0, 0, 0.2);
        }

        body.dark-mode .score {
            color: rgba(255, 255, 255, 0.3);
        }

        .features {
            padding: 6rem 0;
            background-color: var(--secondary);
        }

        .section-title {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 3rem;
            text-align: center;
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }

        .feature-card {
            background-color: var(--primary);
            border-radius: 12px;
            padding: 2rem;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border: 1px solid rgba(0, 0, 0, 0.05);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        body.dark-mode .feature-card {
            border: 1px solid rgba(255, 255, 255, 0.05);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        .feature-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        body.dark-mode .feature-card:hover {
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .feature-icon {
            font-size: 2rem;
            margin-bottom: 1rem;
            color: var(--accent);
        }

        .feature-title {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1rem;
        }

        .feature-description {
            color: var(--text-secondary);
        }

        .cta {
            padding: 6rem 0;
            text-align: center;
        }

        .cta-title {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 1.5rem;
        }

        .cta-description {
            color: var(--text-secondary);
            max-width: 600px;
            margin: 0 auto 2rem;
        }

        .glowing-effect {
            position: absolute;
            width: 200px;
            height: 200px;
            background: var(--accent);
            border-radius: 50%;
            filter: blur(100px);
            opacity: 0.1;
            z-index: -1;
        }

        body.dark-mode .glowing-effect {
            opacity: 0.15;
        }

        .effect-1 {
            top: 20%;
            left: 10%;
        }

        .effect-2 {
            bottom: 20%;
            right: 10%;
            background: var(--success);
        }

        footer {
            background-color: var(--secondary);
            padding: 3rem 0;
            text-align: center;
            color: var(--text-secondary);
        }

        .footer-links {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-bottom: 2rem;
        }

        .footer-links a {
            color: var(--text);
            text-decoration: none;
        }

        .footer-links a:hover {
            color: var(--accent);
        }

        @media (max-width: 768px) {
            .hero-content {
                flex-direction: column;
            }

            .hero-title {
                font-size: 2.5rem;
            }

            .nav-links {
                display: none;
            }
        }
            `;
            document.head.appendChild(style);
        }

        const element = document.createElement('div');
        element.innerHTML = `
            <div class="glowing-effect effect-1"></div>
            <div class="glowing-effect effect-2"></div>

            <header>
                <div class="container">
                    <nav>
                        <a href="#" class="logo">PINGPONG</a>
                        <div class="nav-links">
                            <a href="">Home</a>
                            <a href="">Features</a>
                            <a href="">Tournament</a>
                            <a href="">Leaderboard</a>
                        </div>
                        <div class="auth-buttons">
                            <button class="btn btn-outline"> <a href="/login">Login</a></button>
                            <button class="btn btn-primary"><a href="/login">Sign Up</a></button>
                            <button class="theme-toggle" id="themeToggle">🌓</button>
                        </div>
                    </nav>
                </div>
            </header>

            <section class="hero">
                <div class="container">
                    <div class="hero-content">
                        <div class="hero-text">
                            <h1 class="hero-title">Experience the Classic <span>PONG</span> Game Like Never Before</h1>
                            <p class="hero-description">
                                Jump into real-time multiplayer matches, compete in tournaments, and challenge friends in this modern take on the iconic arcade game.
                            </p>
                            <div class="hero-buttons">
                                <button class="btn btn-primary">Play Now</button>
                                <button class="btn btn-outline">Join Tournament</button>
                            </div>
                        </div>
                        <div class="hero-visual">
                            <div class="pong-game">
                                <div class="pong-field">
                                    <div class="center-line"></div>
                                    <div class="score">
                                        <div class="player-1-score">4</div>
                                        <div class="player-2-score">2</div>
                                    </div>
                                    <div class="paddle paddle-left"></div>
                                    <div class="paddle paddle-right"></div>
                                    <div class="ball"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="features">
                <div class="container">
                    <h2 class="section-title">Game Features</h2>
                    <div class="features-grid">
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

            <section class="cta">
                <div class="container">
                    <h2 class="cta-title">Ready to Play?</h2>
                    <p class="cta-description">
                        Join thousands of players already enjoying the ultimate Pong experience. Sign up now and start climbing the leaderboard!
                    </p>
                    <button class="btn btn-primary"><a href="/login">Sign Up Now</a></button>
                </div>
            </section>

            <footer>
                <div class="container">
                    <div class="footer-links">
                        <a href="">About Us</a>
                        <a href="">Privacy Policy</a>
                        <a href="">Terms of Service</a>
                        <a href="">Contact</a>
                    </div>
                    <p>© 2025 Transcendence Pong. All rights reserved.</p>
                </div>
            </footer>
        `;

        // Theme toggle logic
        const themeToggle = element.querySelector('#themeToggle') as HTMLButtonElement;
        const body = document.body;

        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            body.classList.add('dark-mode');
            themeToggle.textContent = '☀️';
        }

        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            themeToggle.textContent = isDark ? '☀️' : '🌓';
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });

        return element;
    }
}
