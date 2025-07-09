
export class RegisterView {
    constructor() {}

    render(): HTMLElement {
        if (!document.getElementById('auth-styles')) {
            const style = document.createElement('style');
            style.id = 'auth-styles';
            style.textContent = `
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
                    <h2 class="auth-title">Create Your PINGPONG Account</h2>
                    <form class="auth-form" id="registerForm">
                        <input type="text" placeholder="Username" required class="auth-input" />
                        <input type="email" placeholder="Email" required class="auth-input" />
                        <input type="password" placeholder="Password" required class="auth-input" />
                        <input type="password" placeholder="Confirm Password" required class="auth-input" />
                        <button type="submit" class="btn btn-primary">Register</button>
                        <p class="auth-switch">Already have an account? <a href="/login">Login here</a></p>
                    </form>
                </div>
            </section>
        `;

        // the logic of the registration
        console.log('Registration submitted');

        return element;
    }
}
