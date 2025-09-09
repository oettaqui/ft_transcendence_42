
import { toast } from "./ToastNotification";
import { View } from "../app/View";
import { router } from "../app/router-instance.ts";
import { User } from "../types/User";
import { ApiService } from "../utils/ApiService";
import { wsService } from "../utils/WebSocketService";

interface twoFactorformData {
    password: string;
}


interface passwordformData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
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

export class SettingsView extends View{
    private API_BASE = 'http://localhost:3000/api';
    private apiService = new ApiService(this.API_BASE);
    protected user: User | null = null;
    private currentLoadingToastId: string | null = null;
    private wsListeners: (() => void)[] = [];
    constructor(){
        super();
        this.setupWebSocketListeners();
    }

    render(user: User | null) : HTMLElement{
        const element = document.createElement('section');
        element.classList.add('bg-[var(--primary)]');
        element.classList.add('w-[100%]');
        element.classList.add('h-[80%]');
        element.classList.add('rounded-4xl');
        element.classList.add('!mt-16');
        element.classList.add('flex');
        element.classList.add('items-center');
        element.classList.add('justify-center');
        if (user)
            this.user = user;
        const bgClasses = {
                'Bios': 'bg-[url(/public/assets/BiosBG.jpg)]',
                'Freax': 'bg-[url(/public/assets/Freax_BG.jpg)]',
                'Commodore': 'bg-[url(/public/assets/Commodore_BG.jpg)]',
                'Pandora': 'bg-[url(/public/assets/Pandora_BG.jpg)]'
            };

            const bgUrl = bgClasses[user?.coalition] || '';
            const colorClasses ={
                'Bios': 'var(--bios)',
                'Freax': 'var(--freax)',
                'Commodore': 'var(--commodore)',
                'Pandora': 'var(--pandora)',
            }
            const colorTheme = colorClasses[user?.coalition] || ''; 
        element.innerHTML = `
            <div class="overflow-y-hidden w-[100%] h-[100%] !gap-2 !m-auto bg-[rgba(220,219,219,0.08)] backdrop-blur-3xl rounded-4xl border border-white/10">
                <div class="flex justify-center items-center w-[95%] h-[100%] !gap-1 xl:!gap-2 !m-auto">
                    <!-- Left Sidebar -->
                    <div class="h-[85%] w-[35%] md:w-[40%] lg:w-[35%] xl:w-[40%] rounded-2xl flex flex-col !gap-3 md:!gap-5 relative">
                        <h1 class="text-2xl md:text-3xl xl:text-4xl font-bold !p-2 md:!p-4">Settings</h1>
                        <div class="flex flex-col !gap-4 md:!gap-6 xl:!gap-8 sticky">
                            <!-- Profile Card -->
                            <div class="flex items-center !gap-2 md:!gap-3 !pl-2 md:!pl-4 !py-3 md:!py-4 w-[90%] md:w-[80%] rounded-2xl md:rounded-4xl border border-white/10 bg-[rgba(220,219,219,0.05)]">
                                <img class="w-[35px] md:w-[45px] xl:w-[50px] h-[35px] md:h-[45px] xl:h-[50px] rounded-full" src="${this.user?.avatar}" id="img-profile"/>
                                <div class="flex flex-col justify-between">
                                    <div id="full-name" class="text-[11px] md:text-[13px] xl:text-[14px]">${this.user?.firstName} ${this.user?.lastName}</div>
                                    <div class="text-[9px] md:text-[11px] xl:text-[12px] opacity-50">Account settings</div>
                                </div>
                            </div>
                            
                            <!-- Divider -->
                            <div class="h-[2px] w-[90%] md:w-[80%] bg-[rgba(220,219,219,0.1)]"></div>

                            <!-- General Settings Card -->
                            <div class="flex items-center !gap-2 md:!gap-3 !pl-2 md:!pl-4 !py-3 md:!py-4 w-[90%] md:w-[80%] rounded-2xl md:rounded-4xl border border-white/10 bg-[rgba(220,219,219,0.05)]">
                                <i class="ti ti-settings text-3xl md:text-4xl xl:text-5xl text-accent"></i>
                                <div class="flex flex-col justify-between">
                                    <div class="text-[11px] md:text-[13px] xl:text-[14px]">General settings</div>
                                    <div class="text-[9px] md:text-[11px] xl:text-[12px] opacity-50">Sensitivity, Board color, and more</div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Vertical Line -->
                        <div class="absolute right-1 top-8 md:top-10 h-[80%] md:h-[85%] w-[2px] md:w-[3px] rounded-4xl !mr-6 md:!mr-8 xl:!mr-10 bg-[rgba(220,219,219,0.1)]"></div>
                    </div>
                    
                    <!-- Right Content Area -->
                    <div class="h-[95%] w-[65%] md:w-[60%] lg:w-[65%] xl:w-[70%] border border-white/10 rounded-2xl flex flex-col !gap-3 md:!gap-5 mx-auto">
                        <div class="sticky flex flex-col !gap-12 md:!gap-16 xl:!gap-20">
                            <!-- Header with Background and Profile -->
                            <header class="relative w-full">
                                <div class="w-full h-[100px] md:h-[130px] xl:h-[150px] ${bgUrl} bg-cover object-cover rounded-t-2xl"> </div>
                                
                                <div class="absolute left-1/2 top-12 md:top-15 xl:top-17 transform -translate-x-1/2 profile-image-container">
                                    <div class="relative">
                                        <img style="border: 3px solid ${colorTheme}" class="w-[100px] md:w-[120px] xl:w-[140px] h-[100px] md:h-[120px] xl:h-[140px] rounded-full object-cover  shadow-xl" 
                                            src="${this.user?.avatar}" 
                                            alt="Profile"/>
                                    </div>
                                </div>
                            </header>

                            <!-- Tab Navigation -->
                            <div class="settings-section rounded-2xl md:rounded-4xl border border-white/30 w-[100%] md:w-[70%] xl:w-[70%] h-[40px] md:h-[45px] xl:h-[50px] !m-auto flex justify-around items-center">
                                <div class="tab-button active !cursor-pointer text-[10px] md:text-[12px] xl:text-sm profile !px-3 md:!px-5 xl:!px-7 !py-2 rounded-lg md:rounded-xl xl:rounded-2xl" data-tab="profile">Profile</div>
                                <div class="w-[1px] md:w-[2px] h-5 md:h-6 xl:h-7 bg-[var(--text-secondary)]"></div>
                                <div class="tab-button opacity-30 !cursor-pointer text-[10px] md:text-[12px] xl:text-sm security !px-3 md:!px-5 xl:!px-7 !py-2 rounded-lg md:rounded-xl xl:rounded-2xl" data-tab="security">Security</div>
                                <div class="w-[1px] md:w-[2px] h-5 md:h-6 xl:h-7 bg-[var(--text-secondary)]"></div>
                                <div class="tab-button opacity-30 !cursor-pointer text-[10px] md:text-[12px] xl:text-sm game !px-3 md:!px-5 xl:!px-7 !py-2 rounded-lg md:rounded-xl xl:rounded-2xl" data-tab="game">Game</div>
                            </div>
                        </div>

                        <!-- Profile Form -->
                        

                        <div id="profile-form" class="max-h-[300px] !px-4 md:!px-6 xl:!px-8 !pb-4 !mt-2 overflow-y-auto">
                            <div class="max-w-2xl !mx-auto">
                                <div class="glass-effect rounded-2xl border border-white/10 !p-3 md:!p-4 xl:!p-5">
                                    
                                    <form id="profile-update-form" class="!space-y-4 md:!space-y-5 xl:!space-y-6">
                                        
                                        <div class="grid grid-cols-1 md:grid-cols-2 !gap-3 md:!gap-4">
                                            <div class="group">
                                                <label for="firstName" class="block text-[11px] md:text-[12px] xl:text-sm font-medium text-gray-300 !mb-1 md:!mb-2 transition-colors">
                                                    First Name
                                                </label>
                                                <div class="relative">
                                                    <input type="text" id="firstName" name="firstName" value="${this.user?.firstName || ''}" class="text-[11px] md:text-[12px] xl:text-[13px] w-full !px-3 md:!px-4 !py-2 md:!py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[var(--accent)] transition-all duration-300 hover:border-white/30" placeholder="Enter your first name">
                                                    <div class="absolute inset-y-0 right-0 flex items-center !pr-2 md:!pr-3">
                                                        <svg class="w-4 md:w-5 h-4 md:h-5 text-gray-400 group-focus-within:text-[var(--accent)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="group">
                                                <label for="lastName" class="block text-[11px] md:text-[12px] xl:text-sm font-medium text-gray-300 !mb-1 md:!mb-2 transition-colors">
                                                    Last Name
                                                </label>
                                                <div class="relative">
                                                    <input type="text" id="lastName" name="lastName" value="${this.user?.lastName || ''}" class="text-[11px] md:text-[12px] xl:text-[13px] w-full !px-3 md:!px-4 !py-2 md:!py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[var(--accent)] transition-all duration-300 hover:border-white/30" placeholder="Enter your last name">
                                                    <div class="absolute inset-y-0 right-0 flex items-center !pr-2 md:!pr-3">
                                                        <svg class="w-4 md:w-5 h-4 md:h-5 text-gray-400 group-focus-within:text-[var(--accent)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="group">
                                            <label class="block text-[11px] md:text-[12px] xl:text-sm font-medium text-gray-300 !mb-1 md:!mb-2">
                                                Profile Image
                                            </label>
                                            <div class="flex items-center !space-x-3 md:!space-x-4">
                                                <div class="flex-shrink-0">
                                                    <img class="w-12 md:w-14 xl:w-16 h-12 md:h-14 xl:h-16 rounded-full object-cover border-2 border-white/20" src="${this.user?.avatar}" alt="Current profile" id="previewImage">
                                                </div>
                                                <div class="flex-1">
                                                    <label for="imageUpload" class="cursor-pointer">
                                                        <div class="flex items-center justify-center !px-4 md:!px-5 xl:!px-6 !py-2 md:!py-3 border-2 border-dashed border-white/30 rounded-xl hover:border-[var(--accent)] transition-colors duration-300 group">
                                                            <div class="text-center">
                                                                <svg class="!mx-auto h-6 md:h-7 xl:h-8 w-6 md:w-7 xl:w-8 text-gray-400 group-hover:text-[var(--accent)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                                                </svg>
                                                                <p class="!mt-1 text-[10px] md:text-[11px] xl:text-sm text-gray-400 transition-colors">
                                                                    <span class="font-medium">Click to upload</span> or drag and drop
                                                                </p>
                                                                <p class="text-[9px] md:text-[10px] xl:text-xs text-gray-500">PNG, JPG up to 5MB</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <input type="file" id="imageUpload" name="avatar" class="hidden" accept="image/*">
                                                </div>
                                            </div>
                                        </div>

                                        <div class="flex items-center justify-end !space-x-3 md:!space-x-4 !pt-4 md:!pt-5 xl:!pt-6 border-t border-white/10">
                                            <button type="button" class="text-[11px] md:text-[12px] xl:text-sm !px-4 md:!px-5 xl:!px-6 !py-2 md:!py-3 cursor-pointer text-gray-300 bg-white/5 border border-white/20 rounded-xl hover:bg-white/10 hover:border-white/30 transition-all duration-300 font-medium">
                                                Cancel
                                            </button>
                                            <button type="submit" id="save-profile-btn" class="text-[11px] md:text-[12px] xl:text-sm !px-6 md:!px-7 xl:!px-8 !py-2 md:!py-3 bg-[var(--accent)] cursor-pointer text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                                                Save Changes
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                       <!-- Security Form -->
                        <div id="security-form" class="hidden max-h-[300px] !px-4 md:!px-6 xl:!px-8 !pb-4 !mt-2 overflow-y-auto">
                            <div class="max-w-2xl !mx-auto">
                                <!-- Password Change Section -->
                                <div class="glass-effect rounded-2xl border border-white/10 !p-4 md:!p-5 xl:!p-6 !mb-4 md:!mb-5 xl:!mb-6">
                                    <h3 class="text-[13px] md:text-[15px] xl:text-[16px] font-semibold text-white !mb-3 md:!mb-4 flex items-center !gap-3 md:!gap-4">
                                        <svg class="w-5 md:w-6 h-5 md:h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                        </svg>
                                        Change Password
                                    </h3>
                                    <form id="form-update-password" class="!space-y-4 md:!space-y-5 xl:!space-y-6">

                                        <div class="group">
                                            <label for="currentPassword" class="block text-[11px] md:text-[12px] xl:text-sm font-medium text-gray-300 !mb-1 md:!mb-2">
                                                Current Password
                                            </label>
                                            <input type="password" id="currentPassword" name="currentPassword" required
                                                class="placeholder:text-[10px] md:placeholder:text-[11px] xl:placeholder:text-xs w-full !px-3 md:!px-4 !py-2 md:!py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[var(--accent)]"
                                                placeholder="Enter current password" >
                                        </div>

                                        <div class="grid grid-cols-1 md:grid-cols-2 !gap-3 md:!gap-4">
                                            <div class="group">
                                                <label for="newPassword" class="block text-[11px] md:text-[12px] xl:text-sm font-medium text-gray-300 !mb-1 md:!mb-2">
                                                    New Password
                                                </label>
                                                <input type="password" id="newPassword" name="newPassword" required
                                                    class="placeholder:text-[10px] md:placeholder:text-[11px] xl:placeholder:text-xs w-full !px-3 md:!px-4 !py-2 md:!py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[var(--accent)]"
                                                    placeholder="Enter new password">
                                            </div>

                                            <div class="group">
                                                <label for="confirmPassword" class="block text-[11px] md:text-[12px] xl:text-sm font-medium text-gray-300 !mb-1 md:!mb-2">
                                                    Confirm Password
                                                </label>
                                                <input type="password" id="confirmPassword" name="confirmPassword" required
                                                    class="placeholder:text-[10px] md:placeholder:text-[11px] xl:placeholder:text-xs w-full !px-3 md:!px-4 !py-2 md:!py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[var(--accent)]"
                                                    placeholder="Confirm new password" >
                                            </div>
                                        </div>

                                        <div class="flex justify-end !gap-3 md:!gap-4 !pt-4 md:!pt-5 xl:!pt-6 border-t border-white/10">
                                            <button type="button"
                                                class="!px-4 md:!px-5 xl:!px-6 !py-2 md:!py-3 text-[11px] md:text-[12px] xl:text-[14px] cursor-pointer text-gray-300 bg-white/5 border border-white/20 rounded-xl hover:bg-white/10 hover:border-white/30 transition-all duration-300 font-medium">
                                                Cancel
                                            </button>
                                            <button id="update-password" type="button"
                                                class="!px-6 md:!px-7 xl:!px-8 !py-2 md:!py-3 bg-[var(--accent)] cursor-pointer text-[11px] md:text-[12px] xl:text-[14px] text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                                                Save Changes
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                <!-- Email Verification Section -->
                                <div class="glass-effect rounded-2xl border border-white/10 !p-4 md:!p-5 xl:!p-6 !mb-4 md:!mb-5 xl:!mb-6">
                                    <h3 class="text-[13px] md:text-[15px] xl:text-[16px] font-semibold text-white !mb-3 md:!mb-4 flex items-center !gap-3 md:!gap-4">
                                        <svg class="w-5 md:w-6 h-5 md:h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                        </svg>
                                        Email Verification
                                    </h3>
                                    <div class="flex flex-col !gap-3 md:!gap-4 xl:!gap-5">
                                        <div id="verified-email"  class="flex items-center justify-between !p-3 md:!p-4 bg-white/5 rounded-xl border border-white/10">
                                            <div class="flex items-center !gap-3 md:!gap-4">
                                                <div class="flex items-center !gap-3 md:!gap-4">
                                                    <div class="w-2 md:w-3 h-2 md:h-3 bg-green-500 rounded-full animate-pulse"></div>
                                                    <div>
                                                        <p class="text-[11px] md:text-[13px] xl:text-[14px] text-white font-medium">${this.user?.email}</p>
                                                        <p class="text-[10px] md:text-[11px] xl:text-[12px] text-green-400">Verified</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="flex items-center !gap-2 md:!gap-3">
                                                <svg class="w-4 md:w-5 h-4 md:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                                <span class="text-green-400 text-[10px] md:text-[11px] xl:text-[12px] font-medium !mt-[1px]">Verified</span>
                                            </div>
                                        </div>

                                        <div id="not-verified-email" class="flex items-center justify-between !p-3 md:!p-4 bg-white/5 rounded-xl border border-white/10">
                                            <div class="flex items-center !gap-3 md:!gap-4">
                                                <div class="flex items-center !gap-3 md:!gap-4">
                                                    <div class="w-2 md:w-3 h-2 md:h-3 bg-orange-500 rounded-full animate-pulse"></div>
                                                    <div>
                                                        <p class="text-[11px] md:text-[13px] xl:text-[14px] text-white font-medium">${this.user?.email}</p>
                                                        <p class="text-[10px] md:text-[11px] xl:text-[12px] text-orange-400">Not Verified</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="flex items-center !gap-2 md:!gap-3">
                                                <svg class="w-4 md:w-5 h-4 md:h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                                                </svg>
                                                <button id="verify-email-btn" class="hover:cursor-pointer !px-3 md:!px-4 !py-1 md:!py-2 text-[10px] md:text-[11px] xl:text-[12px] text-orange-400 bg-orange-900/20 border border-orange-500/30 rounded-lg hover:bg-orange-950/30 transition-all duration-300 font-medium">
                                                    Verify Email
                                                </button>
                                            </div>
                                        </div>
                                    <div id="provider-authenticated" class="flex items-center justify-between !p-3 md:!p-4 bg-white/5 rounded-xl border border-white/10">
                                        <div class="flex items-center !gap-3 md:!gap-4">
                                            <div class="flex items-center !gap-3 md:!gap-4">
                                                <div class="w-2 md:w-3 h-2 md:h-3 bg-green-500 rounded-full"></div>
                                                <div>
                                                    <p class="text-[11px] md:text-[13px] xl:text-[14px] text-white font-medium">Provider Authentication</p>
                                                    <p class="text-[10px] md:text-[11px] xl:text-[12px] text-green-400">No Email Verification Required</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex items-center !gap-2 md:!gap-3">
                                            <svg class="w-4 md:w-5 h-4 md:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                            </svg>
                                            <span class="!px-3 md:!px-4 !py-1 md:!py-2 text-[10px] md:text-[11px] xl:text-[12px] text-green-400 bg-green-900/20 border border-green-500/30 rounded-lg font-medium">
                                                Authenticated
                                            </span>
                                        </div>
                                    </div>
                                    </div>
                                </div>

                                <!-- Two-Factor Authentication Section -->
                                <div class="glass-effect rounded-2xl border border-white/10 !p-4 md:!p-5 xl:!p-6">
                                    <h3 class="text-[13px] md:text-[15px] xl:text-[16px] font-semibold text-white !mb-3 md:!mb-4 flex items-center !gap-2 md:!gap-3">
                                        <svg class="w-5 md:w-6 h-5 md:h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                        </svg>
                                        Two-Factor Authentication
                                    </h3>

                                    <div class="!space-y-3 md:!space-y-4">
                                        <div class="flex flex-col !gap-3 md:!gap-4 xl:!gap-5">
                                            <!-- 2FA Status -->
                                            <div id="Two-Factor-Active" class="flex items-center justify-between !p-3 md:!p-4 bg-white/5 rounded-xl border border-white/10">
                                                <div class="flex items-center !gap-3 md:!gap-4">
                                                    <div class="flex items-center !gap-2 md:!gap-3">
                                                        <div class="w-2 md:w-3 h-2 md:h-3 bg-green-500 rounded-full animate-pulse"></div>
                                                        <div>
                                                            <p class="text-white text-[11px] md:text-[13px] xl:text-[14px] font-medium">Two-Factor Authentication</p>
                                                            <p class="text-[10px] md:text-[11px] xl:text-[12px] text-green-400">Active & Protected</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="flex items-center !gap-2 md:!gap-3">
                                                    <svg class="w-4 md:w-5 h-4 md:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                    </svg>
                                                    <button id="btn-disable" class="!cursor-pointer !px-3 md:!px-4 !py-1 md:!py-2 text-[10px] md:text-[11px] xl:text-[12px] text-red-400 bg-red-900/20 border border-red-500/30 rounded-lg hover:bg-red-950/30  transition-all duration-300 font-medium text-sm ">
                                                        Disable
                                                    </button>
                                                </div>
                                            </div>
                                            <div id="form-disable-2fa" class="hidden">
                                                <p class="text-red-400"> Enter your password to disable 2FA. This will make your account less secure.</p>
                                                <form id="2fForm">
                                                    <div class="flex flex-col gap-1"> 
                                                        <span class="text-[13px] font-medium">Password:*</span> 
                                                        <input id="disable-2fa-password" type="password" name="password" required class="bg-[var(--secondary)] text-[var(--text)] !p-[10px] focus:outline-none rounded-lg border border-transparent focus:border-[var(--accent)] transition-colors" />
                                                    </div>
                                                    <div class="flex justify-end !gap-3 md:!gap-4 !pt-4 md:!pt-5 xl:!pt-6 border-t border-white/10">
                                                        <button type="button" id="cancel-disable-2fa" class="!px-4 md:!px-5 xl:!px-6 !py-2 md:!py-3 text-[11px] md:text-[12px] xl:text-[14px] cursor-pointer text-gray-300 bg-white/5 border border-white/20 rounded-xl hover:bg-white/10 hover:border-white/30 transition-all duration-300 font-medium">
                                                            Cancel
                                                        </button>
                                                        <button type="button" id="disable-btn-2fa" class="!px-6 md:!px-7 xl:!px-8 !py-2 md:!py-3 bg-[var(--accent)] cursor-pointer text-[11px] md:text-[12px] xl:text-[14px] text-red-400 bg-red-900/20 border border-red-500/30 rounded-lg hover:bg-red-950/30  transition-all duration-300 font-medium text-sm">
                                                            Disable
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                            <div id="Two-Factor-Disabled" class="flex items-center justify-between !p-3 md:!p-4 bg-white/5 rounded-xl border border-white/10">
                                                <div class="flex items-center !gap-3 md:!gap-4">
                                                    <div class="flex items-center !gap-2 md:!gap-3">
                                                        <div class="w-2 md:w-3 h-2 md:h-3 bg-red-500 rounded-full animate-pulse"></div>
                                                        <div>
                                                            <p class="text-white text-[11px] md:text-[13px] xl:text-[14px] font-medium">Two-Factor Authentication</p>
                                                            <p class="text-[10px] md:text-[11px] xl:text-[12px] text-red-400">Disabled & Vulnerable</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="flex items-center !gap-2 md:!gap-3">
                                                    <svg class="w-4 md:w-5 h-4 md:h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                                    </svg>
                                                    <button id="btn-enable" class="!px-3 md:!px-4 !py-1 md:!py-2 text-[10px] md:text-[11px] xl:text-[12px] text-green-400 bg-green-900/20 border border-green-500/30 rounded-lg hover:bg-green-950/30 transition-all duration-300 font-medium !cursor-pointer">
                                                        Enable
                                                    </button>
                                                </div>
                                            </div>
                                        <div id="Two-Factor-Provider" class="flex items-center justify-between !p-3 md:!p-4 bg-white/5 rounded-xl border border-white/10">
                                            <div class="flex items-center !gap-3 md:!gap-4">
                                                <div class="flex items-center !gap-2 md:!gap-3">
                                                    <div class="w-2 md:w-3 h-2 md:h-3 bg-blue-500 rounded-full"></div>
                                                    <div>
                                                        <p class="text-white text-[11px] md:text-[13px] xl:text-[14px] font-medium">Two-Factor Authentication</p>
                                                        <p class="text-[10px] md:text-[11px] xl:text-[12px] text-blue-400">Handled by Provider</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="flex items-center !gap-2 md:!gap-3">
                                                <svg class="w-4 md:w-5 h-4 md:h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                                </svg>
                                                <span class="!px-3 md:!px-4 !py-1 md:!py-2 text-[10px] md:text-[11px] xl:text-[12px] text-blue-400 bg-blue-900/20 border border-blue-500/30 rounded-lg font-medium">
                                                    Protected
                                                </span>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Game Form -->
                        <div id="game-form" class="hidden max-h-[300px] !px-4 md:!px-6 xl:!px-8 !pb-4 !mt-2 overflow-y-auto">
                            <div class="max-w-2xl !mx-auto">
                                <!-- Board Preview Section -->
                                <div class="glass-effect rounded-2xl border border-white/10 !p-4 md:!p-5 xl:!p-6 !mb-4 md:!mb-5 xl:!mb-6">
                                    <h3 class="text-[13px] md:text-[15px] xl:text-[16px] font-semibold text-white !mb-3 md:!mb-4">Board Preview</h3>
                                    <div style="background: ${colorTheme}" id="board-preview" class="w-full h-24 md:h-28 xl:h-32 rounded-xl border-2 border-white/20 relative overflow-hidden ">
                                        <!-- Simple game elements to show context -->
                                        <div class="absolute left-2 md:left-3 xl:left-4 top-1/2 transform -translate-y-1/2 w-1 md:w-2 h-12 md:h-14 xl:h-16 bg-white rounded-sm"></div>
                                        <div class="absolute right-2 md:right-3 xl:right-4 top-1/2 transform -translate-y-1/2 w-1 md:w-2 h-12 md:h-14 xl:h-16 bg-white rounded-sm"></div>
                                        <div class="absolute w-2 md:w-3 h-2 md:h-3 bg-white rounded-full" style="top: 50%; left: 50%; transform: translate(-50%, -50%);"></div>
                                        <div class="absolute left-1/2 top-0 bottom-0 w-px bg-white/50 transform -translate-x-1/2"></div>
                                    </div>
                                </div>

                                <!-- Board Color Settings -->
                                <div class="glass-effect rounded-2xl border border-white/10 !p-4 md:!p-5 xl:!p-6 !mb-4 md:!mb-5 xl:!mb-6">
                                    <h3 class="text-[13px] md:text-[15px] xl:text-[16px] font-semibold text-white !mb-3 md:!mb-4">Choose Board Color</h3>
                                    
                                    <!-- Default Color -->
                                    <div class="!mb-4 md:!mb-5 xl:!mb-6">
                                        <p class="text-[11px] md:text-[12px] xl:text-sm text-gray-300 !mb-2 md:!mb-3">Default Color</p>
                                        <div class="flex flex-wrap !gap-2 md:!gap-3">
                                            <div style="background: ${colorTheme}" class="color-option w-8 md:w-10 xl:w-12 h-8 md:h-10 xl:h-12 rounded-lg md:rounded-xl border-2 border-white/20 ring-white/20 selected cursor-pointer" 
                                                data-color="${colorTheme}" data-name="Default"></div>
                                        </div>
                                    </div>
                                    
                                    <!-- Suggested Colors -->
                                    <div>
                                        <p class="text-[11px] md:text-[12px] xl:text-sm text-gray-300 !mb-2 md:!mb-3">Suggested Colors</p>
                                        <div class="flex flex-wrap !gap-2 md:!gap-3">
                                            <!-- Solid Colors -->
                                            <div class="color-option w-8 md:w-10 xl:w-12 h-8 md:h-10 xl:h-12 rounded-lg md:rounded-xl border-2 border-white/20 cursor-pointer bg-[#3b82f6]" 
                                                data-color="#3b82f6" data-name="Blue"></div>
                                            <div class="color-option w-8 md:w-10 xl:w-12 h-8 md:h-10 xl:h-12 rounded-lg md:rounded-xl border-2 border-white/20 cursor-pointer bg-purple-500" 
                                                data-color="#a855f7" data-name="Purple"></div>
                                            <div class="color-option w-8 md:w-10 xl:w-12 h-8 md:h-10 xl:h-12 rounded-lg md:rounded-xl border-2 border-white/20 cursor-pointer bg-red-500" 
                                                data-color="#ef4444" data-name="Red"></div>
                                            
                                            <!-- Gradient Colors -->
                                            <div class="color-option w-8 md:w-10 xl:w-12 h-8 md:h-10 xl:h-12 rounded-lg md:rounded-xl border-2 border-white/20 cursor-pointer" 
                                                style="background: linear-gradient(45deg, #ff6b6b, #ee5a24)"
                                                data-color="linear-gradient(45deg, #ff6b6b, #ee5a24)" data-name="Sunset"></div>
                                            <div class="color-option w-8 md:w-10 xl:w-12 h-8 md:h-10 xl:h-12 rounded-lg md:rounded-xl border-2 border-white/20 cursor-pointer" 
                                                style="background: linear-gradient(45deg, #667eea, #764ba2)"
                                                data-color="linear-gradient(45deg, #667eea, #764ba2)" data-name="Purple Haze"></div>
                                            <div class="color-option w-8 md:w-10 xl:w-12 h-8 md:h-10 xl:h-12 rounded-lg md:rounded-xl border-2 border-white/20 cursor-pointer" 
                                                style="background: linear-gradient(45deg, #4facfe, #00f2fe)"
                                                data-color="linear-gradient(45deg, #4facfe, #00f2fe)" data-name="Ocean Blue"></div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Action Buttons -->
                                <div class="flex justify-end !gap-3 md:!gap-4 !pt-4 md:!pt-5 xl:!pt-6 border-t border-white/10">
                                    <button type="button" id="reset-board-btn"
                                        class="!px-4 md:!px-5 xl:!px-6 !py-2 md:!py-3 text-[11px] md:text-[12px] xl:text-[14px] text-gray-300 bg-white/5 border border-white/20 rounded-xl hover:bg-white/10 hover:border-white/30 transition-all duration-300 font-medium cursor-pointer">
                                        Reset to Default
                                    </button>
                                    <button type="button" id="save-board-btn"
                                        class="!px-6 md:!px-7 xl:!px-8 !py-2 md:!py-3 bg-[var(--accent)] text-[11px] md:text-[12px] xl:text-[14px] text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer">
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        return element;
    }

    protected onMount(): void {
        this.handleClickProfile();
        const imageUploadInput = document.querySelector<HTMLInputElement>('#imageUpload');

        if (imageUploadInput) {
            this.handleImageUpload(imageUploadInput, 'previewImage');
        } else {
            console.log("One or more input elements were not found!");
        }
        this.setupInputEffects();
        this.setupTabToggle();
        this.VerificationStatus();
        this.setupBoardColorSettings();
        this.setup2fclick();
        this.updatePasswordclick();
        this.setupVerifyEmailbtn();

        this.setupProfileFormSubmit();
    }

    private setupProfileFormSubmit(): void {
        const profileForm = document.getElementById('profile-update-form') as HTMLFormElement;
        if (profileForm) {
            profileForm.addEventListener('submit', (e: Event) => {
                e.preventDefault(); 
                this.handleProfileUpdate(profileForm);
            });
        }
    }

    private async handleProfileUpdate(form: HTMLFormElement): Promise<void> {
        const firstNameInput = form.querySelector('#firstName') as HTMLInputElement;
        const lastNameInput = form.querySelector('#lastName') as HTMLInputElement;
        const avatarInput = form.querySelector('#imageUpload') as HTMLInputElement;

        if(firstNameInput.value.trim() == '' || lastNameInput.value.trim() == '')
        {
            if (firstNameInput.value.trim() == '')
                firstNameInput.value = this.user?.firstName || '';
            if (lastNameInput.value.trim() == '')
                 lastNameInput.value = this.user?.lastName || '';
        }

        const payload: { firstName: string; lastName: string; avatar?: string } = {
            firstName: firstNameInput.value,
            lastName: lastNameInput.value,
        };
        
        const avatarFile = avatarInput.files?.[0];

        const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });

        this.currentLoadingToastId = toast.show('Updating profile...', { type: 'loading', duration: 0 });

        try {
            if (avatarFile) {
                payload.avatar = await toBase64(avatarFile);
            }

            const response = await this.apiService.put('/auth/profile', payload);
            const result = await response.json(); 

            if (result.success) {
                toast.dismiss(this.currentLoadingToastId!);
                toast.show('Profile updated successfully!', { type: 'success' });
                
                if (result.data && result.data.user) {
                    this.user = result.data.user;
                    document.querySelectorAll<HTMLImageElement>('.profile-image-container img, #previewImage').forEach(img => {
                        if (this.user?.avatar) img.src = this.user.avatar;
                        const saveProfileBtn = document.getElementById('save-profile-btn') as HTMLButtonElement;
                        if (saveProfileBtn) {
                            this.showSavedFeedback(saveProfileBtn);
                        }
                    });
                }
            } else {
                 throw new Error(result.error || 'Failed to update profile.');
            }

        } catch (error: any) {
            toast.dismiss(this.currentLoadingToastId!);
            toast.show(`Error: ${error.message}`, { type: 'error' });
        }
        toast.dismiss(this.currentLoadingToastId!);
    }



    private getFormData<T>(formId: string, fields: (keyof T)[]): T {
        const form = document.getElementById(formId) as HTMLFormElement;
        const formData = new FormData(form);
        
        const result = {} as T;
        
        fields.forEach(field => {
            result[field] = formData.get(field as string) as any;
        });
        
        return result;
    }

    private clearFormInputs(formId: string, fieldNames: string[]): void {
        const form = document.getElementById(formId) as HTMLFormElement;
        
        fieldNames.forEach(fieldName => {
            const input = form.querySelector(`[name="${fieldName}"]`) as HTMLInputElement;
            if (input) {
                input.value = '';
            }
    });
}
    
    private updatePasswordclick(): void {
        if(this.user)
        {
            if(this.user.googleId || this.user.intraId)
            {
                const form = document.getElementById('form-update-password') as HTMLFormElement;
                if (form) {
                    Array.from(form.elements).forEach((element: Element) => {
                        (element as HTMLInputElement).disabled = true;
                    });
                }
            }
            else
            {
                const updatePassword = document.getElementById('update-password');
                if (updatePassword)
                {
                    updatePassword.addEventListener('click', () => {
                        this.handleUpdatePassword();
                    });
                }
            }
        }

    }

    private setupVerifyEmailbtn(): void {
        const verifyEmailBtn = document.getElementById('verify-email-btn');
        if (verifyEmailBtn)
        {
            verifyEmailBtn.addEventListener('click', () => {
                this.handleVerifyEmail();
            });
        }

    }

    private async handleUpdatePassword(): Promise<void> {
        toast.dismiss(this.currentLoadingToastId!);
        const formData = this.getFormData<passwordformData>('form-update-password', ['currentPassword','newPassword','confirmPassword']);
        const currentPassword = formData.currentPassword;
        const newPassword = formData.newPassword;
        const confirmPassword = formData.confirmPassword;
        console.log(`currentPassword : ${currentPassword}`);
        console.log(`newPassword : ${newPassword}`);
        console.log(`confirmPassword : ${confirmPassword}`);
        if(newPassword !== confirmPassword)
        {
            toast.dismiss(this.currentLoadingToastId!);
            if(confirmPassword)
            {
                toast.show(`new Password and confirm Password are not matching`, {
                    type: 'error',
                    duration: 4000
                });
            }
            else
            {
                toast.show(`confirm Password is necessary`, {
                    type: 'error',
                    duration: 4000
                });
            }
            this.clearFormInputs('form-update-password', ['newPassword', 'confirmPassword']);
            return ;
        }
        try {
            this.currentLoadingToastId = toast.show('Updating Password...', {
                type: 'loading',
                duration: 0,
                dismissible: true
            });
            const response = await this.apiCall('/auth/password', {
                method: 'PUT',
                body: JSON.stringify({ currentPassword,newPassword })
            });
            
            if (response) {
                toast.dismiss(this.currentLoadingToastId!);
                toast.show('Password Updated successfully!', {
                    type: 'success',
                    duration: 3000
                });
                const updatePasswordBtn = document.getElementById('update-password') as HTMLButtonElement;
                if (updatePasswordBtn) {
                    this.showSavedFeedback(updatePasswordBtn);
                }
                this.clearFormInputs('form-update-password', ['currentPassword', 'newPassword', 'confirmPassword']);
            }
        } catch (error) {
            toast.dismiss(this.currentLoadingToastId!);
            toast.show(`Updating Password: ${error}`, {
                type: 'error',
                duration: 4000
            });
            this.clearFormInputs('form-update-password', ['currentPassword', 'newPassword', 'confirmPassword']);
        }
    }

    private async handleVerifyEmail(): Promise<void> {
        try {
            const token = localStorage.getItem('token');
            
            if (token) {
                const response = await this.apiCall('/auth/resend-verification', {
                    method: 'POST',
                    body: JSON.stringify({ email: this.user?.email })
                });
                
                if (response) {
                    toast.dismiss(this.currentLoadingToastId!);
                    toast.show('Verification email sent! Please check your inbox.', {
                        type: 'info',
                        duration: 3000
                    });
                }
            } else {
                toast.dismiss(this.currentLoadingToastId!);
                toast.show(`Please log in first, then try to resend verification from your dashboard.`, {
                    type: 'error',
                    duration: 4000
                });
            }
        } catch (error) {
            toast.dismiss(this.currentLoadingToastId!);
            toast.show(`Error1: ${error}`, {
                type: 'error',
                duration: 4000
            });
        }
    }
    private setup2fclick(): void {
        const enableButton = document.getElementById('btn-enable');
        const disableButton = document.getElementById('btn-disable');
        const cancelDisable2fa = document.getElementById('cancel-disable-2fa');
        if (enableButton)
        {
            enableButton.addEventListener('click', () => {
                this.handleEnable2f();
            });
        }
        if(disableButton)
        {
            disableButton.addEventListener('click', () => {
                this.display2faprocess();
            });  
        }
        if(cancelDisable2fa && disableButton)
        {
            cancelDisable2fa.addEventListener('click', () => {
                this.hide2faprocess();
            }); 
        }
    }
    private display2faprocess(): void {
        const disableButton = document.getElementById('btn-disable');
        if(disableButton)
        {
            disableButton.classList.add('pointer-events-none');
            disableButton.classList.add('disabled');
            disableButton.classList.add('bg-white/50');
            disableButton.classList.add('text-white');
            const formDisable2FA = document.querySelector('#form-disable-2fa');
            formDisable2FA?.classList.remove('hidden');
            formDisable2FA?.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'end' 
            });
            const disableBtn2fa = document.getElementById('disable-btn-2fa');
            if (disableBtn2fa)
            {
                disableBtn2fa.addEventListener('click', () => {
                    this.handleDisable2f();
                });
            }
        }
    }
    private hide2faprocess(): void {
        const disableButton = document.getElementById('btn-disable');
        if(disableButton)
        {
            disableButton.classList.remove('pointer-events-none');
            disableButton.classList.remove('disabled');
            disableButton.classList.remove('bg-white/50');
            disableButton.classList.remove('text-white');
            const formDisable2FA = document.querySelector('#form-disable-2fa');
            formDisable2FA?.classList.add('hidden');
        }
    }
    private async handleEnable2f(): Promise<void> {
        toast.dismiss(this.currentLoadingToastId!);
        try {
            this.currentLoadingToastId = toast.show('Enabling 2FA...', {
                type: 'loading',
                duration: 0,
                dismissible: true
            });
            const response = await this.apiCall('/auth/2fa/enable', {
                method: 'POST',
                body: JSON.stringify({ method: 'email' })
            });
            
            if (response) {
                toast.dismiss(this.currentLoadingToastId!);
                toast.show('2FA enabled successfully!', {
                    type: 'success',
                    duration: 3000
                });
                if(this.user)
                    this.user.twoFactorEnabled = true;
                this.VerificationStatus();
            }
        } catch (error) {
            toast.dismiss(this.currentLoadingToastId!);
            toast.show(`Enabling 2FA failed ${error}`, {
                type: 'error',
                duration: 4000
            });
        }

    }


    private async handleDisable2f(): Promise<void> {
        toast.dismiss(this.currentLoadingToastId!);
        const formData = this.getFormData<twoFactorformData>('2fForm', ['password']);
        const password = formData.password;
        console.log(`password : ${password}`);
        try {
            this.currentLoadingToastId = toast.show('Disabling 2FA...', {
                type: 'loading',
                duration: 0,
                dismissible: true
            });
            const response = await this.apiCall('/auth/2fa/disable', {
                method: 'POST',
                body: JSON.stringify({ password })
            });
            
            if (response) {
                toast.dismiss(this.currentLoadingToastId!);
                toast.show('2FA disabled successfully!', {
                    type: 'success',
                    duration: 3000
                });
                if(this.user)
                    this.user.twoFactorEnabled = false;
                this.hide2faprocess();
                this.VerificationStatus();
            }
        } catch (error) {
            toast.dismiss(this.currentLoadingToastId!);
            toast.show(`Disabling 2FA failed: ${error}`, {
                type: 'error',
                duration: 4000
            });
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
    protected handleClickProfile(){
        document?.querySelector('.profile-image-container')?.addEventListener('click', function() {
            const profileImageInput = document?.getElementById('profileImage') as HTMLInputElement | null;
            profileImageInput?.click();
        });
    }

    protected handleImageUpload(input: HTMLInputElement, previewId: string): void {
        input.addEventListener('change', function(e) {
            const target = e.target as HTMLInputElement;
            const file = target.files?.[0];
            if (file) {
                const reader = new FileReader();
                
                reader.onload = function(e: ProgressEvent<FileReader>) {
                    const previewElement = document.getElementById(previewId) as HTMLImageElement | null;
                    if (previewElement && e.target?.result) {
                        previewElement.src = e.target.result as string;
                        
                        if (previewId === 'previewImage') {
                            const profileImage = document.querySelector('header img[alt="Profile"]') as HTMLImageElement | null;
                            if (profileImage) {
                                profileImage.src = e.target.result as string;
                            }
                        }
                    }
                };
                
                reader.readAsDataURL(file);
            }
        });
    }

    protected setupInputEffects(): void {
        const inputs = document.querySelectorAll<HTMLInputElement>('input');
        
        const handleFocus = (e: Event) => 
          (e.target as HTMLInputElement).parentElement?.classList.add('scale-105');
        
        const handleBlur = (e: Event) => 
          (e.target as HTMLInputElement).parentElement?.classList.remove('scale-105');
      
        inputs.forEach(input => {
          input.addEventListener('focus', handleFocus);
          input.addEventListener('blur', handleBlur);
        });
    }

    protected VerificationStatus() {
        const twoFactorProvider = document.querySelector('#Two-Factor-Provider');
        const providerAuthenticated = document.querySelector('#provider-authenticated');
        const notVerifiedEmail = document.querySelector('#not-verified-email');
        const verifiedEmail = document.querySelector('#verified-email');
        const twoFactorDisabled = document.querySelector('#Two-Factor-Disabled');
        const twoFactorActive = document.querySelector('#Two-Factor-Active');
        if(this.user)
        {
            if(this.user.googleId || this.user.intraId)
            {
                notVerifiedEmail?.classList.add('hidden');
                verifiedEmail?.classList.add('hidden');
                twoFactorDisabled?.classList.add('hidden');
                twoFactorActive?.classList.add('hidden');
                providerAuthenticated?.classList.remove('hidden');
                twoFactorProvider?.classList.remove('hidden');
            }
            else
            {
                providerAuthenticated?.classList.add('hidden');
                twoFactorProvider?.classList.add('hidden');
                if(this.user.emailVerified)
                {
                    notVerifiedEmail?.classList.add('hidden');
                    verifiedEmail?.classList.remove('hidden');
                }
                else
                {
                    verifiedEmail?.classList.add('hidden');
                    notVerifiedEmail?.classList.remove('hidden');
                }
                if(this.user.twoFactorEnabled)
                {
                    twoFactorDisabled?.classList.add('hidden');
                    twoFactorActive?.classList.remove('hidden');
                }
                else
                {
                    twoFactorActive?.classList.add('hidden');
                    twoFactorDisabled?.classList.remove('hidden');
                }
            }
        }
    }

    protected setupTabToggle() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const profileForm = document.querySelector('#profile-form');
        const securityForm = document.querySelector('#security-form');
        const gameForm = document.querySelector('#game-form');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                tabButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.classList.add('opacity-30');
                });

                button.classList.add('active');
                button.classList.remove('opacity-30');

                profileForm?.classList.add('hidden');
                securityForm?.classList.add('hidden');
                gameForm?.classList.add('hidden');

                const tab = button.getAttribute('data-tab');
                if (tab === 'profile') {
                    profileForm?.classList.remove('hidden');
                } else if (tab === 'security') {
                    securityForm?.classList.remove('hidden');
                } else if (tab === 'game') {
                    gameForm?.classList.remove('hidden');
                }
            });
        });
    }

    private showSavedFeedback(button: HTMLButtonElement, originalText: string = 'Save Changes'): void {
       
        button.textContent = 'Saved!';
        button.classList.add('bg-green-600');
        button.disabled = true;

       
        setTimeout(() => {
            if (button) {
                button.textContent = originalText;
                button.classList.remove('bg-green-600'); 
                button.disabled = false; 
            }
        }, 2000);
    }

    protected setupBoardColorSettings(): void {
        const colorOptions = document.querySelectorAll('.color-option');
        const resetBtn = document.getElementById('reset-board-btn');
        const saveBtn = document.getElementById('save-board-btn');

        let currentColor = '${colorTheme}';

        colorOptions.forEach(option => {
            option.addEventListener('click', () => {
                colorOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                currentColor = option.getAttribute('data-color') || '#16a34a';
                this.updateBoardPreview(currentColor);
            });
        });

        resetBtn?.addEventListener('click', () => {
            currentColor = '#f39c12';
            colorOptions.forEach(opt => {
                opt.classList.remove('selected');
                if (opt.getAttribute('data-color') === currentColor) {
                    opt.classList.add('selected');
                }
            });
            this.updateBoardPreview(currentColor);
        });

        saveBtn?.addEventListener('click', () => {
            saveBtn.textContent = 'Saved!';
            saveBtn.classList.add('bg-green-600');
            
            setTimeout(() => {
                if (saveBtn) {
                    saveBtn.textContent = 'Save Changes';
                    saveBtn.classList.remove('bg-green-600');
                }
            }, 2000);
        });

        this.updateBoardPreview(currentColor);
    }

    protected updateBoardPreview(color: string): void {
        const boardPreview = document.getElementById('board-preview');
        if (!boardPreview) return;
        boardPreview.style.background = color;
    }
    private setupWebSocketListeners(): void {
        // Profile updates
      const profileListener = async (data: any) => {
            if (this.user && data.userId === this.user.id) {
                // Update user profile display if needed
                // this.refreshUserDisplay();
            console.log("ayaaaaah rak alwd 9ahba bdlti profile (dash listener)");
            try {
                this.user = await this.fetchUser();
                this.update_profile_data();
                console.log("User profile updated successfully");
            } catch (error) {
                console.error("Failed to fetch updated user profile:", error);
            }
            }
        };
        wsService.on('profile_updated', profileListener);
        this.wsListeners.push(() => wsService.off('profile_updated', profileListener));
    }

    private async fetchUser(): Promise<User | null> {
        try {
            const response = await this.apiService.get<User>("/auth/me");
            const user = response.data?.user;
            if (user && user.avatar == null) user.avatar = "../../public/assets/default.jpg";
            this.user = user;
            return user;
        } catch (err) {
            console.error("Failed to fetch user:", err);
            return null;
        }
    }
    private update_profile_data(): void
    {
        // full-name
        const imgProfile = document.getElementById("img-profile");
        const fullName = document.getElementById("full-name");
        if(imgProfile)
        {
            imgProfile.setAttribute('src', `${this.user?.avatar}`);
        }
        if(fullName)
        {
            fullName.innerHTML = '';
            fullName.innerHTML = `${this.user?.firstName} ${this.user?.lastName}`;
        }
    }
}