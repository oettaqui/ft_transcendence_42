
export class LoginView {
    constructor() {}

    render(): HTMLElement {
        if (!document.getElementById('auth-styles')) {
            const style = document.createElement('style');
            style.id = 'auth-styles';
            style.textContent = `
                
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
                .auth-section {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    padding: 2rem;
                    background-color: var(--primary);
                    color: var(--text);
                }
                .auth-container {
                    background-color: var(--secondary);
                    padding: 2rem;
                    border-radius: 12px;
                    max-width: 400px;
                    width: 100%;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
                }
                .auth-title {
                    font-size: 1.8rem;
                    font-weight: 700;
                    text-align: center;
                    margin-bottom: 1.5rem;
                }
                .auth-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .auth-input {
                    padding: 0.8rem;
                    border: 1px solid var(--text-secondary);
                    border-radius: 6px;
                    background: var(--primary);
                    color: var(--text);
                }
                .auth-input:focus {
                    outline: none;
                    border-color: var(--accent);
                    box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2);
                }
                .auth-switch {
                    text-align: center;
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                }
                .auth-switch a {
                    color: var(--accent);
                    text-decoration: none;
                }
                .auth-switch a:hover {
                    text-decoration: underline;
                }
            `;
            document.head.appendChild(style);
        }
        const element = document.createElement('div');

        element.innerHTML = `
            <section class="auth-section">
                <div class="auth-container">
                    <h2 class="auth-title">Login to PINGPONG</h2>
                    <form class="auth-form" id="loginForm">
                        <input type="email" placeholder="Email" required class="auth-input" />
                        <input type="password" placeholder="Password" required class="auth-input" />
                        <button type="submit" class="btn btn-primary">Login</button>
                        <p class="auth-switch">Don't have an account? <a href="/register">Register here</a></p>
                    </form>
                </div>
            </section>
        `;

        // the logic of the login
        console.log('login submitted');
        

        return element;
    }
}
