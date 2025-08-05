import {View} from "../app/View"

interface ApiResponse {
    data?: any;
    message?: string;
}

export class EmailVerificationView extends View {
    private API_BASE = 'http://localhost:3001/api';
    private email: string;

    constructor(email?: string) {
        super();
        this.email = email || this.getEmailFromUrl() || localStorage.getItem('pending-verification-email') || '';
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

            <section class="min-h-[90vh] flex items-center bg-grid-pattern !pt-24">
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
                                <div class="text-center">
                                    <h2 class="text-6xl !mb-[10px] font-extrabold tracking-widest text-[color:var(--text)] no-underline">📧</h2>
                                    <h3 class="text-4xl !mb-[10px] font-extrabold tracking-widest text-[color:var(--text)] no-underline">Check Your Email</h3>
                                    <div class="max-w-[400px] mt-8">
                                        <p class="text-lg text-[var(--text-secondary)] mb-4">
                                            We've sent a verification email to 
                                            <strong id="verification-email" class="text-[var(--accent)]">${this.email}</strong>
                                        </p>
                                        <p class="text-[var(--text-secondary)] mb-8">
                                            Please click the verification link in your email to complete your registration.
                                        </p>
                                        
                                        <div id="verification-message" class="mb-6"></div>
                                        
                                        <button id="resendBtn" class="enhanced-btn secondary-btn w-full mb-4">
                                            <span class="flex items-center justify-center !mt-1"> Resend Verification Email </span>
                                        </button>
                                        
                                        <p class="auth-switch">
                                            <a href="/login">Back to Login</a>
                                        </p>
                                    </div>
                                </div>
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
        this.setupEventHandlers();
    }

    private setupEventHandlers(): void {
        const resendBtn = document.getElementById('resendBtn') as HTMLButtonElement;
        if (resendBtn) {
            resendBtn.addEventListener('click', this.handleResendVerification.bind(this));
        }
    }

    private async handleResendVerification(): Promise<void> {
        const resendBtn = document.getElementById('resendBtn') as HTMLButtonElement;
        const verificationMessage = document.getElementById('verification-message') as HTMLDivElement;

        if (!this.email) {
            this.showVerificationMessage('No email found for verification', 'error');
            return;
        }
        resendBtn.disabled = true;
        const originalText = resendBtn.innerHTML;
        resendBtn.innerHTML = '<span class="flex items-center justify-center !mt-1">Sending...</span>';

        try {
            await this.apiCall('/auth/resend-verification', {
                method: 'POST',
                body: JSON.stringify({ email: this.email })
            });

            this.showVerificationMessage('Verification email sent successfully!', 'success');
        } catch (error: any) {
            this.showVerificationMessage(`Error: ${error.message}`, 'error');
        } finally {
            resendBtn.disabled = false;
            resendBtn.innerHTML = originalText;
        }
    }

    private showVerificationMessage(message: string, type: 'success' | 'error'): void {
        const messageDiv = document.getElementById('verification-message') as HTMLDivElement;
        const className = type === 'success' 
            ? 'text-green-500 bg-green-50 border-green-200' 
            : 'text-red-500 bg-red-50 border-red-200';
        messageDiv.innerHTML = `<div class="${className} p-3 rounded-lg border">${message}</div>`;
    }

    private getEmailFromUrl(): string | null {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('email');
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

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            return data;
        } catch (error) {
            throw error;
        }
    }

    private logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('pending-verification-email');
        window.location.href = '/login';
    }
}