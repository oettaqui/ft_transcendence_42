import { View } from "../app/View";

export class SettingsView extends View{
    constructor(){
        super()
    }

    render() : HTMLElement{
        const element = document.createElement('section');
        element.classList.add('bg-[var(--primary)]');
        element.classList.add('w-[100%]');
        element.classList.add('h-[100%]');
        element.classList.add('rounded-4xl');
        element.classList.add('!mt-6');
        element.classList.add('flex');
        element.classList.add('items-cente');
        element.classList.add('justify-center');
        element.innerHTML = `
            <div  class="overflow-y-hidden w-[100%] h-[100%] gap-2 !m-auto bg-[rgba(220,219,219,0.08)] backdrop-blur-3xl rounded-4xl border border-white/10">
                <div  class="flex justify-center items-center w-[95%] h-[100%] gap-2 !m-auto">
                    <div class=" h-[85%] w-[40%] rounded-2xl  flex flex-col gap-5 relative ">
                        <h1 class="text-4xl font-bold !p-4">Settings</h1>
                        <div class="flex flex-col gap-8 sticky">
                            <div class="flex items-center gap-3 !pl-4 !py-4 w-[80%] rounded-4xl border border-white/10 bg-[rgba(220,219,219,0.05)]">
                                
                                <img class="w-[50px] h-[50px] rounded-full" src="../../public/assets/oettaqui.jpeg"/>
                                
                                <div class="flex flex-col justify-between">
                                    <div class="text-[14px]">Oussama Ettaqui</div>
                                    <div class="text-[12px] opacity-50">Account settings</div>
                                </div>
                                
                            </div>
                            
                            <div class="h-[2px] w-[80%] bg-[rgba(220,219,219,0.1)]"></div>

                            <div class="flex items-center gap-3 !pl-4 !py-4 w-[80%] rounded-4xl border border-white/10 bg-[rgba(220,219,219,0.05)]">
                                
                                <i class="ti ti-settings text-5xl text-accent"></i>
                                
                                <div class="flex flex-col justify-between">
                                    <div class="text-[14px]">General settings</div>
                                    <div class="text-[12px] opacity-50">Sensitivity, Board color, and more</div>
                                </div>
                                
                            </div>
                            
                        </div>
                        <div class=" absolute right-1 top-10 h-[85%] w-[3px] rounded-4xl !mr-10 bg-[rgba(220,219,219,0.1)]"></div>
                    </div>
                    <div class="h-[95%] w-[70%] border border-white/10 rounded-2xl flex flex-col gap-5 mx-auto">
                        <div class="sticky flex flex-col gap-20">
                            <header class="relative w-full">
                                <img class="w-full h-[150px] object-cover rounded-t-2xl" src="../../public/assets/Freax_BG.jpg" alt="Background"/>
                                
                                <div class="absolute left-1/2 top-17 transform -translate-x-1/2 cursor-pointer profile-image-container">
                                    <div class="relative">
                                        <img class="w-[140px] h-[140px] rounded-full object-cover border-4 border-[var(--accent)] shadow-xl" 
                                            src="../../public/assets/oettaqui.jpeg" 
                                            alt="Profile"/>
                                        <div class="upload-overlay absolute inset-0 rounded-full flex items-center justify-center">
                                            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            </svg>
                                        </div>
                                        <input type="file" id="profileImage" class="hidden" accept="image/*">
                                    </div>
                                </div>
                            </header>
                            
                           <div class="settings-section rounded-4xl border border-white/30 w-[50%] h-[50px] !m-auto flex justify-around items-center">
                                <div class="tab-button active cursor-pointer profile" data-tab="profile">Profile</div>
                                <div class="w-[2px] h-7 bg-[var(--text-secondary)]"></div>
                                <div class="tab-button opacity-30 cursor-pointer security" data-tab="security">Security</div>
                            </div>
                        </div>

                        <!-- New Profile Settings Section -->
                        <div id="profile-form" class="!px-8 !pb-4 !mt-2 overflow-y-auto">
                            <div class="max-w-2xl !mx-auto">
                                <div class="glass-effect rounded-2xl border border-white/10 !p-5">
    
                                    
                                    <form class="!space-y-6">
                                        <!-- First Name and Last Name -->
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <!-- First Name -->
                                            <div class="group">
                                                <label for="firstName" class="block text-sm font-medium text-gray-300 !mb-2 transition-colors">
                                                    First Name
                                                </label>
                                                <div class="relative">
                                                    <input type="text" 
                                                        id="firstName" 
                                                        name="firstName" 
                                                        value="Oussama"
                                                        class="w-full !px-4 !py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[var(--accent)]  transition-all duration-300 hover:border-white/30"
                                                        placeholder="Enter your first name">
                                                    <div class="absolute inset-y-0 right-0 flex items-center !pr-3">
                                                        <svg class="w-5 h-5 text-gray-400 group-focus-within:text-[var(--accent)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Last Name -->
                                            <div class="group">
                                                <label for="lastName" class="block text-sm font-medium text-gray-300 !mb-2 transition-colors">
                                                    Last Name
                                                </label>
                                                <div class="relative">
                                                    <input type="text" 
                                                        id="lastName" 
                                                        name="lastName" 
                                                        value="Ettaqui"
                                                        class="w-full !px-4 !py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[var(--accent)] transition-all duration-300 hover:border-white/30"
                                                        placeholder="Enter your last name">
                                                    <div class="absolute inset-y-0 right-0 flex items-center !pr-3">
                                                        <svg class="w-5 h-5 text-gray-400 group-focus-within:text--[var(--accent)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Profile Image Upload -->
                                        <div class="group">
                                            <label class="block text-sm font-medium text-gray-300 !mb-2">
                                                Profile Image
                                            </label>
                                            <div class="flex items-center !space-x-4">
                                                <div class="flex-shrink-0">
                                                    <img class="w-16 h-16 rounded-full object-cover border-2 border-white/20" 
                                                        src="../../public/assets/oettaqui.jpeg" 
                                                        alt="Current profile" 
                                                        id="previewImage">
                                                </div>
                                                <div class="flex-1">
                                                    <label for="imageUpload" class="cursor-pointer">
                                                        <div class="flex items-center justify-center !px-6 !py-3 border-2 border-dashed border-white/30 rounded-xl hover:border-[var(--accent)] transition-colors duration-300 group">
                                                            <div class="text-center">
                                                                <svg class="!mx-auto h-8 w-8 text-gray-400 group-hover:text-[var(--accent)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                                                </svg>
                                                                <p class="!mt-1 text-sm text-gray-400 transition-colors">
                                                                    <span class="font-medium">Click to upload</span> or drag and drop
                                                                </p>
                                                                <p class="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <input type="file" id="imageUpload" class="hidden" accept="image/*">
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Action Buttons -->
                                        <div class="flex items-center justify-end space-x-4 !pt-6 border-t border-white/10 gap-5">
                                            <button type="button" 
                                                    class="!px-6 !py-3 text-gray-300 bg-white/5 border border-white/20 rounded-xl hover:bg-white/10 hover:border-white/30 transition-all duration-300 font-medium">
                                                Cancel
                                            </button>
                                            <button type="submit" 
                                                    class="!px-8 !py-3 bg-[var(--accent)] text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                                                Save Changes
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>


                        <!-- Security Form -->
                        <div id="security-form" class="hidden !px-8 !pb-4 !mt-2 overflow-y-auto">
                            <div class="max-w-2xl !mx-auto">
                                <div class="glass-effect rounded-2xl border border-white/10 !p-5">
                                    <form class="!space-y-6">
                                        <!-- First two inputs in one row -->
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <!-- Current Password -->
                                            <div class="group">
                                                <label for="currentPassword" class="block text-sm font-medium text-gray-300 !mb-2">
                                                    Current Password
                                                </label>
                                                <input type="password" id="currentPassword" name="currentPassword"
                                                    class="w-full !px-4 !py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[var(--accent)]"
                                                    placeholder="Enter current password">
                                            </div>

                                            <!-- New Password -->
                                            <div class="group">
                                                <label for="newPassword" class="block text-sm font-medium text-gray-300 !mb-2">
                                                    New Password
                                                </label>
                                                <input type="password" id="newPassword" name="newPassword"
                                                    class="w-full !px-4 !py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[var(--accent)]"
                                                    placeholder="Enter new password">
                                            </div>
                                        </div>

                                        <!-- Confirm Password -->
                                        <div class="group">
                                            <label for="confirmPassword" class="block text-sm font-medium text-gray-300 !mb-2">
                                                Confirm Password
                                            </label>
                                            <input type="password" id="confirmPassword" name="confirmPassword"
                                                class="w-full !px-4 !py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[var(--accent)]"
                                                placeholder="Confirm new password">
                                        </div>

                                        <!-- Action Buttons -->
                                        <div class="flex justify-end gap-4 pt-6 border-t border-white/10">
                                            <button type="button"
                                                class="!px-6 !py-3 text-gray-300 bg-white/5 border border-white/20 rounded-xl hover:bg-white/10 hover:border-white/30 transition-all duration-300 font-medium">
                                                Cancel
                                            </button>
                                            <button type="submit"
                                                class="!px-8 !py-3 bg-[var(--accent)] text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                                                Change Password
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        `;
        return element;

    };

    protected onMount(): void {
        this.handleClickProfile();
        const profileImageInput = document.querySelector<HTMLInputElement>('#profileImage');
        const imageUploadInput = document.querySelector<HTMLInputElement>('#imageUpload');

        if (profileImageInput && imageUploadInput) {
        this.handleImageUpload(profileImageInput, 'previewImage');
        this.handleImageUpload(imageUploadInput, 'previewImage');
        } else {
        console.error("One or more input elements were not found!");
        }
        this.setupInputEffects();

        this.setupTabToggle();
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

    protected setupTabToggle() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const profileForm = document.querySelector('#profile-form');
        const securityForm = document.querySelector('#security-form');
        const securityBtn = document.querySelector('.security');
        const profileBtn = document.querySelector('.profile');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                tabButtons.forEach(btn => btn.classList.remove('active', 'opacity-100'));
                button.classList.add('active');
                button.classList.remove('opacity-30');

                const tab = button.getAttribute('data-tab');
                if (tab === 'profile') {
                    profileForm?.classList.remove('hidden');
                    securityForm?.classList.add('hidden');
                    profileBtn?.classList.add('active');
                    profileBtn?.classList.remove('unactive');
                    securityBtn?.classList.remove('active');
                    securityBtn?.classList.add('unactive');
                } else if (tab === 'security') {
                    profileForm?.classList.add('hidden');
                    securityForm?.classList.remove('hidden');
                    securityBtn?.classList.add('active');
                    securityBtn?.classList.remove('unactive');
                    profileBtn?.classList.remove('active');
                    profileBtn?.classList.add('unactive');
                }
            });
        });
    }
    

    

};