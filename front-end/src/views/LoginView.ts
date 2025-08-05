import {View} from "../app/View"

interface LoginFormData {
    email: string;
    password: string;
    twoFactorCode?: string;
}

interface ApiResponse {
    success?: boolean;
    requiresTwoFactor?: boolean;
    data?: {
        token: string;
        user?: any;
    };
    message?: string;
}

export class LoginView extends View {
    private API_BASE = 'http://localhost:3001/api';
    private requires2FA = false;
    private pendingLoginData: { email: string; password: string } | null = null;

    constructor() {
        super();
    }

    render(): HTMLElement {
        const element = document.createElement('div');

        element.innerHTML = `
           <header class="h-20 fixed flex items-center w-[100%] z-[100] bg-[rgba(13, 17, 23, 0.95)] backdrop-blur-md shadow-md">
                <div class="container">
                    <nav class="flex justify-between items-center">
                        <a href="/" class="text-3xl font-extrabold tracking-widest text-[color:var(--text)] no-underline"><span class="text-[var(--accent)]">P</span>ING<span class="text-[var(--accent)]">P</span>ONG</a>
                    
                    </nav>
                </div>
            </header>

            <section class="min-h-[90vh] flex items-center bg-grid-pattern !pt-28">
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
                                <h2 class="text-6xl !mb-[10px] font-extrabold tracking-widest text-[color:var(--text)] no-underline"><span class="text-[var(--accent)]">P</span>ING<span class="text-[var(--accent)]">P</span>ONG</h2>
                                <p class="uppercase !mb-[10px] text-2xl max-w-[300px] text-center text-[var(--text-secondary)]"> Sign In to your account</p>
                                
                                <!-- Message container for success/error messages -->
                                <div id="login-message" class="w-[450px] text-center"></div>
                                
                                <form class="auth-form flex flex-col gap-7 w-[450px]" id="loginForm">
                                    <div class="flex flex-col gap-1"> 
                                        <span class="text-[13px] font-medium">Email Address:*</span> 
                                        <input type="email" name="email" required class="bg-[var(--secondary)] text-[var(--text)] !p-[10px] focus:outline-none rounded-lg border border-transparent focus:border-[var(--accent)] transition-colors" />
                                    </div>
                                    <div class="flex flex-col gap-1"> 
                                        <span class="text-[13px] font-medium">Password:*</span> 
                                        <input type="password" name="password" required class="bg-[var(--secondary)] text-[var(--text)] !p-[10px] focus:outline-none rounded-lg border border-transparent focus:border-[var(--accent)] transition-colors" />
                                    </div>
                                    
                                    <!-- 2FA Input (initially hidden) -->
                                    <div class="flex flex-col gap-1 hidden" id="2fa-input-group"> 
                                        <span class="text-[13px] font-medium">Verification Code:*</span> 
                                        <input type="text" name="twoFactorCode" id="login-2fa-code" class="bg-[var(--secondary)] text-[var(--text)] !p-[10px] focus:outline-none rounded-lg border border-transparent focus:border-[var(--accent)] transition-colors" placeholder="Enter 6-digit code" />
                                    </div>
                                    
                                    <button type="submit" class="enhanced-btn secondary-btn" id="login-btn">
                                        <span class="flex items-center justify-center !mt-1"> Sign In </span>
                                    </button>
                                    <p class="auth-switch">Don't have an account? <a href="/register" class="">Register here</a></p>
                                </form>
                                <div class="flex justify-between items-center gap-6 w-[450px]">
                                    <span class="block flex-1 h-0.5 bg-[var(--text-secondary)] rounded-2xl"></span>
                                    <span class="block text-[var(--text-secondary)] text-sm px-4">OR</span>
                                    <span class="block flex-1 h-0.5 bg-[var(--text-secondary)] rounded-2xl"></span>
                                </div>

                                <div class="flex items-center justify-center gap-4 w-[450px]">
                                    <!-- Google OAuth Button -->
                                    <a href="/auth/google" class="flex items-center justify-center gap-3 bg-[var(--secondary)] text-[var(--text)] border border-[var(--text-secondary)] hover:border-[var(--accent)] hover:bg-opacity-80 !py-3 !px-6 rounded-lg transition-all hover:scale-105">
                                        <svg class="w-6 h-6" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                        </svg>
                                    </a>
                                    
                                    <!-- GitHub OAuth Button -->
                                    <a href="#" class="flex items-center justify-center gap-3 bg-[var(--secondary)] text-[var(--text)] border border-[var(--text-secondary)] hover:border-[var(--accent)] hover:bg-opacity-80 !py-3 !px-6 rounded-lg transition-all hover:scale-105">
                                    <svg class="w-6 h-6" viewBox="0 0 24 24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 .296c-6.63 0-12 5.373-12 12 0 5.303 
                                                3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 
                                                0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61 
                                                -.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.729.083-.729 
                                                1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.807 1.305 
                                                3.495.998.108-.776.418-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 
                                                0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 
                                                0 0 1.005-.322 3.3 1.23a11.52 11.52 0 013.005-.405 
                                                c1.02.005 2.045.138 3.005.405 2.28-1.552 3.285-1.23 
                                                3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 
                                                1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 
                                                5.92.435.372.81 1.102.81 2.222 0 1.606-.015 
                                                2.896-.015 3.286 0 .315.21.694.825.576C20.565 
                                                22.092 24 17.592 24 12.296c0-6.627-5.373-12-12-12z"/>
                                    </svg>
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

    protected onMount(): void {
        this.setupFormHandler();
    }

    private setupFormHandler(): void {
        const form = document.getElementById('loginForm') as HTMLFormElement;
        if (form) {
            form.addEventListener('submit', this.handleLoginSubmit.bind(this));
        }
    }

    private async handleLoginSubmit(e: Event): Promise<void> {
        e.preventDefault();

        const formData = this.getFormData();
        const messageDiv = document.getElementById('login-message') as HTMLDivElement;
        const loginBtn = document.getElementById('login-btn') as HTMLButtonElement;
        this.showMessage('Signing in...', 'loading');

        try {
            const requestBody: any = {
                email: formData.email,
                password: formData.password
            };
            if (formData.twoFactorCode) {
                requestBody.twoFactorCode = formData.twoFactorCode;
            }

            const response = await this.apiCall('/auth/login', {
                method: 'POST',
                body: JSON.stringify(requestBody)
            });

            if (response.success) {
                localStorage.setItem('token', response.data!.token);
                this.showMessage('Login successful!', 'success');
                
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1000);

            } else if (response.requiresTwoFactor) {
                this.requires2FA = true;
                this.pendingLoginData = { email: formData.email, password: formData.password };
                
                const twoFAGroup = document.getElementById('2fa-input-group') as HTMLDivElement;
                const twoFAInput = document.getElementById('login-2fa-code') as HTMLInputElement;
                
                twoFAGroup.classList.remove('hidden');
                loginBtn.innerHTML = '<span class="flex items-center justify-center !mt-1">Verify Code</span>';
                
                this.showMessage('Please check your email for the verification code', 'warning');
                twoFAInput.focus();
            }

        } catch (error: any) {
            this.showMessage(`Error: ${error.message}`, 'error');
            
            if (this.requires2FA) {
                this.reset2FAState();
            }
        }
    }

    private getFormData(): LoginFormData {
        const form = document.getElementById('loginForm') as HTMLFormElement;
        const formData = new FormData(form);
        
        return {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            twoFactorCode: formData.get('twoFactorCode') as string || undefined
        };
    }

    private showMessage(message: string, type: 'success' | 'error' | 'warning' | 'loading'): void {
        const messageDiv = document.getElementById('login-message') as HTMLDivElement;
        let className = '';
        
        switch (type) {
            case 'success':
                className = 'text-green-500 bg-green-50 border-green-200';
                break;
            case 'error':
                className = 'text-red-500 bg-red-50 border-red-200';
                break;
            case 'warning':
                className = 'text-yellow-600 bg-yellow-50 border-yellow-200';
                break;
            case 'loading':
                className = 'text-blue-500 bg-blue-50 border-blue-200';
                break;
        }
        
        messageDiv.innerHTML = `<div class="${className} p-3 rounded-lg border">${message}</div>`;
    }

    private reset2FAState(): void {
        this.requires2FA = false;
        this.pendingLoginData = null;
        
        const twoFAGroup = document.getElementById('2fa-input-group') as HTMLDivElement;
        const loginBtn = document.getElementById('login-btn') as HTMLButtonElement;
        const twoFAInput = document.getElementById('login-2fa-code') as HTMLInputElement;
        
        twoFAGroup.classList.add('hidden');
        loginBtn.innerHTML = '<span class="flex items-center justify-center !mt-1">Sign In</span>';
        twoFAInput.value = '';
    }

    private async apiCall(endpoint: string, options: RequestInit = {}): Promise<ApiResponse> {
        const token = localStorage.getItem('token');
        const config: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
            ...options
        };

        try {
            const response = await fetch(`${this.API_BASE}${endpoint}`, config);

            if (response.status === 401) {
                alert('Session expired. Please log in again.');
                this.logout();
                throw new Error('Session expired');
            }

            const data = await response.json();

            if (!response.ok && !data.requiresTwoFactor) {
                throw new Error(data.error || 'Something went wrong');
            }

            return data;
        } catch (error) {
            throw error;
        }
    }

    private logout(): void {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }
}