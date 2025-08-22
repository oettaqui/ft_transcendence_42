import { View } from "../app/View";
import { toast } from "./ToastNotification";
import { router } from "../app/router-instance.ts";

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
        authUrl?: string;
        state?: string;
    };
    message?: string;
    error?: string;
}

export class LoginView extends View {
    private API_BASE = 'http://localhost:3000/api';
    private requires2FA = false;
    private pendingLoginData: { email: string; password: string } | null = null;
    private currentLoadingToastId: string | null = null;
    private intraPopup: Window | null = null;

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
                                
                                <form class="auth-form flex flex-col gap-7 w-[450px]" id="loginForm">
                                    <div class="flex flex-col gap-1"> 
                                        <span class="text-[13px] font-medium">Email Address:*</span> 
                                        <input type="email" name="email" required class="bg-[var(--secondary)] text-[var(--text)] !p-[10px] focus:outline-none rounded-lg border border-transparent focus:border-[var(--accent)] transition-colors" />
                                    </div>
                                    <div class="flex flex-col gap-1"> 
                                        <span class="text-[13px] font-medium">Password:*</span> 
                                        <input type="password" name="password" required class="bg-[var(--secondary)] text-[var(--text)] !p-[10px] focus:outline-none rounded-lg border border-transparent focus:border-[var(--accent)] transition-colors" />
                                    </div>
                
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
                                    <button id="custom-google-button" class="flex items-center justify-center gap-3 bg-[var(--secondary)] text-[var(--text)] border border-[var(--text-secondary)] hover:border-[var(--accent)] hover:bg-opacity-80 !py-3 !px-6 rounded-lg transition-all hover:scale-105 hover:cursor-pointer">
                                        <svg class="w-6 h-6" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                        </svg>
                                    </button>
                                    <button id="custom-intra-button" class="flex items-center !w-[74px] h-[50px] justify-center gap-3 bg-[var(--secondary)] text-[var(--text)] border border-[var(--text-secondary)] hover:border-[var(--accent)] hover:bg-opacity-80 !py-3 !px-6 rounded-lg transition-all hover:scale-105 hover:cursor-pointer">
                                        <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 137.6 96.6" fill="#fff" stroke="transparent" width="40" height="32">
                                            <path d="M229.2 443.9h50.7v25.4h25.3v-45.9h-50.6l50.6-50.7h-25.3l-50.7 50.7zM316.1 398.1l25.3-25.4h-25.3z" fill="#fff" transform="translate(-229.2 -372.7)"></path>
                                            <path d="m341.4 398.1-25.3 25.3v25.3h25.3v-25.3l25.4-25.3v-25.4h-25.4zM366.8 423.4l-25.4 25.3h25.4z" fill="#fff" transform="translate(-229.2 -372.7)"></path>
                                        </svg>
                                    </button>
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
        this.setupFormHandler();
        this.setupGoogleAuth();
        this.setupIntraAuth();
    }

    private setupFormHandler(): void {
        const form = document.getElementById('loginForm') as HTMLFormElement;
        if (form) {
            form.addEventListener('submit', this.handleLoginSubmit.bind(this));
        }
    }

    private setupGoogleAuth(): void {
        const googleButton = document.getElementById('custom-google-button');
        if (!googleButton) return;

        googleButton.addEventListener('click', () => {
            this.handleGoogleAuth();
        });
    }

    private async handleGoogleAuth(): Promise<void> {
        toast.dismiss(this.currentLoadingToastId!);
        try {
            this.currentLoadingToastId = toast.show('Loading Google authentication...', {
                type: 'loading',
                duration: 0,
                dismissible: true
            });

            await this.loadGoogleScript();
            
            if (!window.google || !google.accounts || !google.accounts.id) {
                throw new Error('Google API not loaded properly');
            }

            const googleButtonContainer = document.createElement('div');
            // googleButtonContainer.style.position = 'fixed';
            googleButtonContainer.style.visibility = 'hidden';
            googleButtonContainer.style.zIndex = 'unset';
            // googleButtonContainer.style.left = '-1000px';
            // googleButtonContainer.style.top = '-1000px';
            googleButtonContainer.id = 'hidden-google-button';
            document.body.appendChild(googleButtonContainer);

            google.accounts.id.initialize({
                client_id: '394069384301-1b8bqmnv35qkfgk9icofqc5gthofupvk.apps.googleusercontent.com',
                callback: async (response: google.accounts.id.CredentialResponse) => {
                    document.body.removeChild(googleButtonContainer);
                    
                    if (!response.credential) {
                        toast.dismiss(this.currentLoadingToastId!);
                        toast.show('Google authentication failed', {
                            type: 'error',
                            duration: 4000
                        });
                        return;
                    }
                    try {
                        const result = await this.apiCall('/auth/google/verify', {
                            method: 'POST',
                            body: JSON.stringify({ token: response.credential })
                        });

                        if (result.success) {
                            localStorage.setItem('token', result.data!.token);
                            toast.dismiss(this.currentLoadingToastId!);
                            toast.show('Google authentication successful!', {
                                type: 'success',
                                duration: 3000
                            });
                            setTimeout(() => router.navigateTo('/dashboard'), 500);
                        } else {
                            toast.dismiss(this.currentLoadingToastId!);
                            toast.show(`Authentication failed: ${result || 'Unknown error'}`, {
                                type: 'error',
                                duration: 4000
                            });
                        }
                    } catch (error: any) {
                        toast.dismiss(this.currentLoadingToastId!);
                        toast.show(`Authentication failed: ${error.message}`, {
                            type: 'error',
                            duration: 4000
                        });
                    }
                },
                auto_select: false
            });

            google.accounts.id.renderButton(
                googleButtonContainer,
                { 
                    type: 'standard',
                    theme: 'outline',
                    size: 'large',
                    text: 'signin_with',
                    shape: 'rectangular',
                    logo_alignment: 'left'
                }
            );

            const googleButton = googleButtonContainer.querySelector('div[role=button]') as HTMLElement;
            if (googleButton) {
                googleButton.click();
            } else {
                throw new Error('Failed to initialize Google button');
            }
            
        } catch (error: any) {
            toast.dismiss(this.currentLoadingToastId!);
            toast.show(`Google authentication failed: ${error.message}`, {
                type: 'error',
                duration: 4000
            });
        }
    }

    private loadGoogleScript(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (window.google && google.accounts && google.accounts.id) {
                resolve();
                return;
            }

            const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
            if (existingScript) {
                existingScript.addEventListener('load', () => resolve());
                existingScript.addEventListener('error', () => reject(new Error('Failed to load Google API')));
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            
            script.onload = () => {
                const checkInterval = setInterval(() => {
                    if (window.google && google.accounts && google.accounts.id) {
                        clearInterval(checkInterval);
                        resolve();
                    }
                }, 100);
                
                setTimeout(() => {
                    clearInterval(checkInterval);
                    if (!window.google || !google.accounts || !google.accounts.id) {
                        reject(new Error('Google API not available after loading'));
                    }
                }, 5000);
            };
            
            script.onerror = () => reject(new Error('Failed to load Google API'));
            document.head.appendChild(script);
        });
    }

    private async handleLoginSubmit(e: Event): Promise<void> {
        e.preventDefault();

        const formData = this.getFormData();
        const loginBtn = document.getElementById('login-btn') as HTMLButtonElement;
        
        this.currentLoadingToastId = toast.show('Signing in... ', { 
            type: 'loading', 
            duration: 0,
            dismissible: false 
        });

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
                
                if (this.currentLoadingToastId) {
                    setTimeout(() => {
                        toast.show('Login successful!', { 
                        type: 'success', 
                            duration: 4000 
                        });
                    }, 500);
                    toast.dismiss(this.currentLoadingToastId);
                    this.currentLoadingToastId = null;
                }
                
                setTimeout(() => {
                    router.navigateTo('/dashboard');
                }, 500);

            } else if (response.requiresTwoFactor) {
                if (this.currentLoadingToastId) {
                    toast.dismiss(this.currentLoadingToastId);
                    this.currentLoadingToastId = null;
                }

                this.requires2FA = true;
                this.pendingLoginData = { email: formData.email, password: formData.password };
                
                const twoFAGroup = document.getElementById('2fa-input-group') as HTMLDivElement;
                const twoFAInput = document.getElementById('login-2fa-code') as HTMLInputElement;
                
                twoFAGroup.classList.remove('hidden');
                loginBtn.innerHTML = '<span class="flex items-center justify-center !mt-1">Verify Code</span>';
                
                toast.show('Please check your email for the verification code', { 
                    type: 'warning', 
                    duration: 6000 
                });
                
                twoFAInput.focus();
            }

        } catch (error: any) {
            if (this.currentLoadingToastId) {
                toast.dismiss(this.currentLoadingToastId);
                this.currentLoadingToastId = null;
            }

            toast.show(`Login failed: Invalid Email or Password`, { 
                type: 'error', 
                duration: 4000 
            });
            
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

    private setupIntraAuth(): void {
        const intraButton = document.getElementById('custom-intra-button');
        if (!intraButton) return;

        intraButton.addEventListener('click', () => {
            this.handleIntraAuth();
        });
    }
private handleIntraAuthCallback = async (event: MessageEvent): Promise<void> => {
    if (event.origin !== window.location.origin) return;
    
    const { code, state, error } = event.data;
    
    if (error) {
        this.cleanupIntraAuth();
        return;
    }
    
    if (!code) {
        this.cleanupIntraAuth();
        return;
    }
    
    try {
        if (this.currentLoadingToastId) {
            toast.dismiss(this.currentLoadingToastId);
        }
        
        this.currentLoadingToastId = toast.show('Completing Intra sign-in...', {
            type: 'loading',
            duration: 0,
            dismissible: true
        });

        console.log(`Completing id : ${this.currentLoadingToastId}`);

        const response = await this.apiCall('/auth/intra/callback', {
            method: 'POST',
            body: JSON.stringify({ code, state })
        });
        
        if (response.success) {
            // Store token
            localStorage.setItem('token', response.data!.token);

            console.log(`dimiss the completing notice : ${this.currentLoadingToastId}`);
            if (this.currentLoadingToastId) {
                toast.dismiss(this.currentLoadingToastId);
            }
            
            this.cleanupIntraAuth();
            
            setTimeout(() => {
                toast.show('Intra sign-in successful!', {
                    type: 'success',
                    duration: 2000 
                });
                
                setTimeout(() => {
                    router.navigateTo('/dashboard');
                }, 100);
            }, 400);
        } else {
            throw new Error(response.error || 'Intra authentication failed');
        }
    } catch (error: any) {

        if (this.currentLoadingToastId) {
            toast.dismiss(this.currentLoadingToastId);
            this.currentLoadingToastId = null;
        }
        

        setTimeout(() => {
            toast.show(`Intra sign-in failed: ${error.message}`, {
                type: 'error',
                duration: 4000
            });
        }, 400);
        
        this.cleanupIntraAuth();
    }
}
private async handleIntraAuth(): Promise<void> {
    toast.dismiss(this.currentLoadingToastId!);
    try {
        this.currentLoadingToastId = toast.show('Redirecting to Intra 42...', {
            type: 'loading',
            duration: 0,
            dismissible: true
        });
        console.log(`Redirecting id : ${this.currentLoadingToastId}`);
        const response = await this.apiCall('/auth/intra/url');
        console.log(`response = ${response.success}`)
        if (response.success) {
            localStorage.setItem('intra-oauth-state', response.data!.state!);
            
            this.intraPopup = window.open(
                response.data!.authUrl!,
                'intraOAuth',
                'width=500,height=600,scrollbars=yes,resizable=yes'
            );
            
            const checkClosed = setInterval(() => {
                if (this.intraPopup?.closed) {
                    clearInterval(checkClosed);
                    toast.dismiss(this.currentLoadingToastId!);
                    toast.show('Intra sign-in was cancelled', {
                        type: 'error',
                        duration: 4000
                    });
                    this.cleanupIntraAuth();
                }
           }, 20500);
            
            window.addEventListener('message', this.handleIntraAuthCallback);
            
        } else {
            throw new Error(response.error || 'Failed to get Intra authorization URL');
        }
    } catch (error: any) {
        toast.dismiss(this.currentLoadingToastId!);
        toast.show(`Intra sign-in failed: ${error.message}`, {
            type: 'error',
            duration: 4000
        });
    }
}

private cleanupIntraAuth(): void {
    window.removeEventListener('message', this.handleIntraAuthCallback);
    localStorage.removeItem('intra-oauth-state');
    if (this.intraPopup) {
        this.intraPopup.close();
        this.intraPopup = null;
    }
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
                this.logout();
                throw new Error('Invalid data');
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
        router.navigateTo("/login");
    }
}