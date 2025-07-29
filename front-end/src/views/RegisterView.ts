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
                                
                                <!-- Message area for success/error messages -->
                                <div id="register-message" class="w-[400px] text-center"></div>
                                
                                <form class="auth-form flex flex-col items-center justify-center gap-7 " id="registerForm">
                                    <div class="flex flex-col gap-1 w-[400px]"> 
                                        <span class="text-[13px] font-medium">Username:* </span> 
                                        <input type="text" id="register-username" required class="bg-[var(--secondary)] text-[var(--text)] !p-[10px] focus:outline-none rounded-lg border border-transparent  focus:border-[var(--accent)] transition-colors" />
                                    </div>
                                    <div class="flex flex-col gap-1 w-[400px]"> 
                                        <span class="text-[13px] font-medium">Email Address:* </span> 
                                        <input type="email" id="register-email" required class="bg-[var(--secondary)] text-[var(--text)] !p-[10px] focus:outline-none rounded-lg border border-transparent  focus:border-[var(--accent)] transition-colors" />
                                    </div>
                                    <div class="flex flex-col gap-1 w-[400px]"> 
                                        <span class="text-[13px] font-medium">Password:* </span> 
                                        <input type="password" id="register-password" required class="bg-[var(--secondary)] text-[var(--text)] !p-[10px] focus:outline-none rounded-lg border border-transparent  focus:border-[var(--accent)] transition-colors" />
                                    </div>
                                    <div class="flex flex-col gap-1 w-[400px]"> 
                                        <span class="text-[13px] font-medium">Confirm Password:* </span> 
                                        <input type="password" id="register-password-confirm" required class="bg-[var(--secondary)] text-[var(--text)] !p-[10px] focus:outline-none rounded-lg border border-transparent  focus:border-[var(--accent)] transition-colors" />
                                    </div>
                                    
                                    <button type="submit" class="enhanced-btn secondary-btn w-[400px]">
                                        <span class="flex items-center justify-center !mt-1"> Sign Up </span>
                                    </button>
                                    <p class="auth-switch">Already have an account? <a href="/login">Login here</a></p>
                                </form>
                            </div>
                        </div>

                    </div>

                </div>
            </section>

        `;

        this.add3DTiltEffect(element);
        this.addParticleEffects(element);
        return element;
    }

    protected onMount(): void {
        // Set up form handling
        const form = document.querySelector<HTMLFormElement>('#registerForm');
        if (form) {
            this.addEventListener(form, 'submit', this.handleRegister.bind(this));
        }
    }

    private async handleRegister(e: Event): Promise<void> {
        e.preventDefault();
        
        const username = (document.getElementById('register-username') as HTMLInputElement)?.value;
        const email = (document.getElementById('register-email') as HTMLInputElement)?.value;
        const password = (document.getElementById('register-password') as HTMLInputElement)?.value;
        const passwordConfirm = (document.getElementById('register-password-confirm') as HTMLInputElement)?.value;
        const messageDiv = document.getElementById('register-message');
        
        if (!messageDiv) return;
        
        // Clear previous messages
        messageDiv.innerHTML = '';
        
        // Validate password confirmation
        if (password !== passwordConfirm) {
            messageDiv.innerHTML = '<div class="error text-red-500 p-2 rounded bg-red-100">Passwords do not match</div>';
            return;
        }
        
        try {
            const response = await this.apiCall('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ username, email, password })
            });
            
            if (response) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('pending-verification-email', email);
                messageDiv.innerHTML = '<div class="success text-green-500 p-2 rounded bg-green-100">Registration successful! Please check your email to verify your account.</div>';
                
                // Show email verification screen after 2 seconds
                setTimeout(() => {
                    this.showEmailVerification(email);
                }, 2000);
            }
        } catch (error: any) {
            messageDiv.innerHTML = `<div class="error text-red-500 p-2 rounded bg-red-100">Error: ${error.message}</div>`;
        }
    }

    // API call method - you'll need to implement this based on your API structure
    private async apiCall(endpoint: string, options: RequestInit): Promise<any> {
        const baseUrl = 'http://localhost:3001/api'; // Replace with your API base URL
        
        const response = await fetch(`${baseUrl}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'An error occurred');
        }
        
        return data;
    }

    // Email verification method - implement based on your routing system
    private showEmailVerification(email: string): void {
        // This should navigate to your email verification view
        // Replace with your actual routing logic
        console.log('Navigating to email verification for:', email);
        // Example: this.router.navigate('/verify-email');
        window.location.href = '/dashboard';
    }
}