import { Router } from "./Router";
import { View } from "./View";

export class DashboardLayout {
    private view: View;
    private router: Router;
    private element: HTMLElement | null = null;
    private elementContainer: HTMLElement | null = null;
    private isDropdownOpen: boolean = false;
    // private userState: UserState;
    protected eventListeners: Array<{
        element: HTMLElement;
        event: string;
        handler: EventListener;
    }> = [];

    constructor(view :View, router : Router) {
        
        this.view = view ;
        this.element = null;
        this.router = router;
    }
    render(): HTMLElement | null {
        // Create container with efficient class assignment
        this.elementContainer = document.createElement('div');
        this.elementContainer.classList.add('w-full');
        this.elementContainer.classList.add('max-w-7xl');
        this.elementContainer.classList.add('h-full');
        this.elementContainer.classList.add('!m-auto');
        
        this.elementContainer.innerHTML = `
            <div class="w-full flex justify-center !m-auto">
                <!-- Responsive Header -->
                <header class="h-16 lg:h-20 !pt-4 lg:!pt-5 w-full fixed z-[100] bg-[rgba(13, 17, 23, 0.95)] backdrop-blur-md shadow-md !px-4 lg:!px-40 xl:!px-50 2xl:!px-80">
                    <nav class="flex justify-between items-center h-full">
                        <!-- Logo -->
                        <h1 class="text-xl lg:text-3xl font-extrabold tracking-widest text-[color:var(--text)] no-underline">
                            <span class="text-[var(--accent)]">P</span>ING<span class="text-[var(--accent)]">P</span>ONG
                        </h1>
                        
                        <!-- Search Bar - Hidden on mobile -->
                        <div class="relative hidden md:flex items-center !gap-7">
                            <input 
                                type="text" 
                                class="bg-[var(--secondary)] w-[300px] lg:w-[400px] h-[36px] lg:h-[42px] border border-[var(--accent)] rounded-[8px] !pl-2 !pr-12 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                                placeholder="Search..."
                                aria-label="Search"
                            />
                            <div class="rounded-full w-[40px] h-[40px] lg:w-[45px] lg:h-[45px] flex justify-center items-center absolute right-[5px] top-[-2px] hover:bg-[var(--accent)] hover:text-black transition-all cursor-pointer">
                                <i class="ti ti-search text-lg lg:text-[22px]"></i>
                            </div>
                        </div>
                        
                        <!-- Right Side Navigation -->
                        <div class="flex justify-center items-center !gap-4 lg:!gap-12">
                            <!-- Balance - Hidden on small screens -->
                            <div class="hidden sm:flex items-center justify-end !mt-2 !gap-2">
                                <img class="w-6 h-6 lg:w-8 lg:h-8 rounded-full object-cover !mb-1" src="../../public/assets/qoins.png" alt="Coins" />
                                <div class="flec flex-col justify-center itmes-center">
                                    <div class="text-[8px] opacity-60">Balance</div> 
                                    <div class="text-sm lg:text-[18px] font-bold">500</div>
                                </div>
                            </div>
                            
                            <!-- Notification & Profile -->
                            <div class="relative flex items-end !gap-4 lg:!gap-8 justify-end">
                                <!-- Notification Bell -->
                                <div class="relative flex justify-center items-center">
                                    <i class="ti ti-bell-filled text-2xl lg:text-[34px] font-light text-gray-300 hover:text-white transition-colors cursor-pointer"></i>
                                    <div class="absolute -top-1 -right-1 bg-red-600 rounded-full text-[9px] lg:text-[10px] w-[16px] h-[16px] lg:w-[19px] lg:h-[19px] flex items-center justify-center text-white font-medium">3</div>
                                </div> 
                                
                                <!-- Profile Dropdown -->
                                <div class="relative" id="profileDropdown">
                                    <div class="profil w-[36px] h-[36px] lg:w-[42px] lg:h-[42px] rounded-full flex justify-center items-center cursor-pointer hover:ring-2 hover:ring-[var(--accent)] transition-all duration-200" id="profileTrigger">
                                        <img class="w-[34px] h-[34px] lg:w-[40px] lg:h-[40px] rounded-full object-cover" src="../../public/assets/oettaqui.jpeg" alt="Profile" />
                                    </div>
                                    
                                    <!-- Dropdown Menu -->
                                    <div id="dropdownMenu" class="absolute right-0 top-full !mt-2 w-56 lg:w-64 bg-[var(--secondary)] border border-gray-700 rounded-lg shadow-2xl opacity-0 invisible transform translate-y-2 transition-all duration-200 ease-out z-50">
                                        
                                        <!-- Menu Items -->
                                        <div class="!py-2">
                                            <!-- Profile Option -->
                                            <a href="#" class="flex items-center !px-3 lg:!px-4 !py-2 lg:!py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors group">
                                                <i class="ti ti-user w-4 h-4 lg:w-5 lg:h-5 !mr-3 text-gray-400 group-hover:text-[var(--accent)]"></i>
                                                <span>Profile</span>
                                            </a>
                                            <!-- Analytics Option -->
                                            <a href="#" class="flex items-center !px-3 lg:!px-4 !py-2 lg:!py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors group">
                                                <i class="ti ti-chart-histogram w-4 h-4 lg:w-5 lg:h-5 !mr-3 text-gray-400 group-hover:text-[var(--accent)]"></i>
                                                <span>Analytics</span>
                                            </a>
                                            
                                            <!-- Settings Option -->
                                            <a href="#" class="flex items-center !px-3 lg:!px-4 !py-2 lg:!py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors group">
                                                <i class="ti ti-settings w-4 h-4 lg:w-5 lg:h-5 !mr-3 text-gray-400 group-hover:text-[var(--accent)]"></i>
                                                <span>Settings</span>
                                            </a>
                                            
                                            <!-- Divider -->
                                            <div class="border-t border-gray-700 !my-1"></div>
                                            
                                            <!-- Logout Option -->
                                            <button id="logoutBtn" class="flex items-center !px-3 lg:!px-4 !py-2 lg:!py-3 text-sm text-gray-300 hover:bg-red-600 hover:text-white transition-colors group w-full text-left">
                                                <i class="ti ti-logout w-4 h-4 lg:w-5 lg:h-5 !mr-3 text-gray-400 group-hover:text-white"></i>
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </nav>
                </header>
                
                <!-- Main Content Area -->
                <main class="flex flex-col lg:flex-row justify-between items-center !pt-16 lg:!pt-20 w-full min-h-screen">
                    <!-- Sidebar Navigation -->
                    <aside class="w-full lg:w-[20%] flex flex-col items-start justify-start !p-4 lg:!p-0">
                        <!-- Decorative Element -->
                        <div class="hidden lg:block absolute bottom-20 left-10 w-16 h-16 bg-accent opacity-5 rounded-full blur-2xl animate-bounce"></div>
                        
                        <!-- Navigation Menu -->
                        <nav class="w-full">
                            <ul class="flex flex-row lg:flex-col items-center lg:items-start justify-center lg:justify-start !gap-2 lg:!gap-10 overflow-x-auto lg:overflow-visible">
                                
                                <!-- Home Navigation Item -->
                                <li class="nav-item-animated opacity-0 w-full lg:w-[200px] home-parent flex-shrink-0">
                                    <a href="/dashboard" class="group relative flex items-center justify-center lg:justify-start !px-2 !py-2 text-primary rounded-xl transition-all duration-300 hover:bg-secondary hover-accent-light hover:translate-x-0 lg:hover:translate-x-2 hover:shadow-lg hover-glow overflow-hidden">
                                        <!-- Slide effect -->
                                        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 -translate-x-full group-hover:translate-x-full group-hover:opacity-20 transition-all duration-700"></div>
                                        
                                        <div class="relative z-10 flex flex-col lg:flex-row items-center w-full">
                                            <div class="icon-hover w-10 h-10 lg:w-12 lg:h-12 bg-secondary rounded-lg flex items-center justify-center lg:!mr-4 group-hover:bg-accent transition-all duration-300">
                                                <i class="ti ti-home text-xl lg:text-2xl text-accent group-hover:text-black transition-colors duration-300"></i>
                                            </div>
                                            <span class="home text-animation font-semibold text-xs lg:text-[16px] !mt-1 lg:!mt-0 lg:!pl-[12px] group-hover:text-accent transition-colors duration-300">Home</span>
                                        </div>
                                    </a>
                                </li>

                                <!-- Games Navigation Item -->
                                <li class="nav-item-animated opacity-0 w-full lg:w-[200px] game-parent flex-shrink-0">
                                    <a href="/dashboard/game" class="group relative flex items-center justify-center lg:justify-start !px-2 !py-2 text-primary rounded-xl transition-all duration-300 hover:bg-secondary hover-accent-light hover:transform hover:translate-x-0 lg:hover:translate-x-2 hover:shadow-lg hover-glow overflow-hidden">
                                        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 -translate-x-full group-hover:translate-x-full group-hover:opacity-20 transition-all duration-700"></div>
                                        
                                        <div class="relative z-10 flex flex-col lg:flex-row items-center w-full">
                                            <div class="icon-hover w-10 h-10 lg:w-12 lg:h-12 bg-secondary rounded-lg flex items-center justify-center lg:!mr-4 group-hover:bg-accent transition-all duration-300">
                                                <i class="ti ti-device-gamepad-2 text-xl lg:text-2xl text-accent group-hover:text-black transition-colors duration-300"></i>
                                            </div>
                                            <span class="game text-animation font-semibold text-xs lg:text-[16px] !mt-1 lg:!mt-0 lg:!pl-[12px] group-hover:text-accent transition-colors duration-300">Games</span>
                                        </div>
                                    </a>
                                </li>

                                <!-- Chat Navigation Item -->
                                <li class="nav-item-animated opacity-0 w-full lg:w-[200px] chat flex-shrink-0">
                                    <a href="/dashboard/chat" class="group relative flex items-center justify-center lg:justify-start !px-2 !py-2 text-primary rounded-xl transition-all duration-300 hover:bg-secondary hover-accent-light hover:transform hover:translate-x-0 lg:hover:translate-x-1 hover:shadow-lg hover-glow overflow-hidden">
                                        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 w-[180px] -translate-x-full group-hover:translate-x-full group-hover:opacity-20 transition-all duration-700"></div>
                                        
                                        <div class="relative z-10 flex flex-col lg:flex-row items-center w-full">
                                            <div class="icon-hover w-10 h-10 lg:w-12 lg:h-12 bg-secondary rounded-lg flex items-center justify-center lg:!mr-4 group-hover:bg-accent transition-all duration-300">
                                                <i class="ti ti-message text-xl lg:text-2xl text-accent group-hover:text-black transition-colors duration-300"></i>
                                            </div>
                                            <span class="text-animation font-semibold text-xs lg:text-[16px] !mt-1 lg:!mt-0 lg:!pl-[12px] group-hover:text-accent transition-colors duration-300">Chat</span>
                                        </div>
                                    </a>
                                </li>

                                <!-- Tournament Navigation Item -->
                                <li class="nav-item-animated opacity-0 w-full lg:w-[200px] tournament flex-shrink-0">
                                    <a href="#" class="group relative flex items-center justify-center lg:justify-start !px-2 !py-2 text-primary rounded-xl transition-all duration-300 hover:bg-secondary hover-accent-light hover:transform hover:translate-x-0 lg:hover:translate-x-2 hover:shadow-lg hover-glow overflow-hidden">
                                        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 -translate-x-full group-hover:translate-x-full group-hover:opacity-20 transition-all duration-700"></div>
                                        
                                        <div class="relative z-10 flex flex-col lg:flex-row items-center w-full lg:w-[210px]">
                                            <div class="icon-hover w-10 h-10 lg:w-12 lg:h-12 bg-secondary rounded-lg flex items-center justify-center lg:!mr-4 group-hover:bg-accent transition-all duration-300">
                                                <i class="ti ti-trophy text-xl lg:text-2xl text-accent group-hover:text-black transition-colors duration-300"></i>
                                            </div>
                                            <span class="text-animation font-semibold text-xs lg:text-[16px] !mt-1 lg:!mt-0 lg:!pl-[12px] group-hover:text-accent transition-colors duration-300">Tournament</span>
                                        </div>
                                    </a>
                                </li>

                                <!-- Settings Navigation Item -->
                                <li class="nav-item-animated opacity-0 w-full lg:w-[200px] settings flex-shrink-0">
                                    <a href="/dashboard/settings" class="group relative flex items-center justify-center lg:justify-start !px-2 !py-2 text-primary rounded-xl transition-all duration-300 hover:bg-secondary hover-accent-light hover:transform hover:translate-x-0 lg:hover:translate-x-2 hover:shadow-lg hover-glow overflow-hidden">
                                        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 -translate-x-full group-hover:translate-x-full group-hover:opacity-20 transition-all duration-700"></div>
                                        
                                        <div class="relative z-10 flex flex-col lg:flex-row items-center w-full">
                                            <div class="icon-hover w-10 h-10 lg:w-12 lg:h-12 bg-secondary rounded-lg flex items-center justify-center lg:!mr-4 group-hover:bg-accent transition-all duration-300">
                                                <i class="ti ti-settings text-xl lg:text-2xl text-accent group-hover:text-black transition-colors duration-300"></i>
                                            </div>
                                            <span class="text-animation font-semibold text-xs lg:text-[16px] !mt-1 lg:!mt-0 lg:!pl-[12px] group-hover:text-accent transition-colors duration-300">Settings</span>
                                        </div>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </aside>
                    
                    <!-- Main Content Section -->
                    <div class="new-section w-full lg:w-[80%] !p-4 lg:!p-0">
                        <!-- Content will be inserted here -->
                    </div>
                </main>
            </div>
        `;

        return this.elementContainer;
    }

    mount(container : HTMLElement): void {
        this.element = this.render();
        if (!this.element) return;
        container.innerHTML = "";
        const sectionContainer = this.element.querySelector(
            ".new-section"
        ) as HTMLElement;
        
        container.appendChild(this.element);
        if (this.view)
        {
            
            sectionContainer.appendChild(this.view.render());
            this.view.onMount();
        }
        
        this.setupEventListeners();
        this.setupNavigationLinks();
        this.onMount();
  }




  private setupDropdownEventListeners(): void {
        if (!this.element) return;

        const profileTrigger = this.element.querySelector('#profileTrigger') as HTMLElement;
        const dropdownMenu = this.element.querySelector('#dropdownMenu') as HTMLElement;
        const profileDropdown = this.element.querySelector('#profileDropdown') as HTMLElement;
        const logoutBtn = this.element.querySelector('#logoutBtn') as HTMLButtonElement;

        if (profileTrigger && dropdownMenu) {
            // Toggle dropdown on profile click
            const profileClickHandler = (e: Event) => {
                e.stopPropagation();
                this.toggleDropdown();
            };
            this.addEventListener(profileTrigger, 'click', profileClickHandler);

            // Close dropdown when clicking outside
            const documentClickHandler = (e: Event) => {
                if (!profileDropdown.contains(e.target as Node)) {
                    this.closeDropdown();
                }
            };
            this.addEventListener(document, 'click', documentClickHandler);

            // Close dropdown on escape key
            const keydownHandler = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    this.closeDropdown();
                }
            };
            this.addEventListener(document, 'keydown', keydownHandler);

            // Prevent dropdown from closing when clicking inside it
            const dropdownClickHandler = (e: Event) => {
                e.stopPropagation();
            };
            this.addEventListener(dropdownMenu, 'click', dropdownClickHandler);
        }

        if (logoutBtn) {
            const logoutHandler = (e: Event) => {
                e.preventDefault();
                this.handleLogout();
            };
            console.log("Attaching logout event listener");
            this.addEventListener(logoutBtn, 'click', logoutHandler);
        }
    }

    private toggleDropdown(): void {
        if (!this.element) return;
        
        const dropdownMenu = this.element.querySelector('#dropdownMenu') as HTMLElement;
        if (!dropdownMenu) return;

        this.isDropdownOpen = !this.isDropdownOpen;
        
        if (this.isDropdownOpen) {
            dropdownMenu.classList.remove('opacity-0', 'invisible', 'translate-y-2');
            dropdownMenu.classList.add('opacity-100', 'visible', 'translate-y-0');
        } else {
            dropdownMenu.classList.add('opacity-0', 'invisible', 'translate-y-2');
            dropdownMenu.classList.remove('opacity-100', 'visible', 'translate-y-0');
        }
    }

    private closeDropdown(): void {
        if (!this.element || !this.isDropdownOpen) return;
        
        const dropdownMenu = this.element.querySelector('#dropdownMenu') as HTMLElement;
        if (!dropdownMenu) return;

        this.isDropdownOpen = false;
        dropdownMenu.classList.add('opacity-0', 'invisible', 'translate-y-2');
        dropdownMenu.classList.remove('opacity-100', 'visible', 'translate-y-0');
    }

    private handleLogout(): void {
        this.closeDropdown();
        
        console.log('Logging out...');
        
       
        this.router.navigateTo('/');
    }

    private setupEventListeners(): void {
        this.setupDropdownEventListeners();


    }

  updateSidebarActiveStates(path: string): void {
    if (!this.element) return;

    const navItems = this.element.querySelectorAll<HTMLElement>('.nav-item-animated');

    navItems.forEach((item) => {
        const textItem = item.querySelector<HTMLElement>('.text-animation');
        if (!textItem) return;

        item.classList.remove('active');
        textItem.classList.remove('active-nav');

        if (path === "/dashboard" && item.classList.contains('home-parent')) {
            item.classList.add('active');
            const homeText = item.querySelector('.home');
            if (homeText) homeText.classList.add('active-nav');
        }
        else if (path === "/dashboard/game" && item.classList.contains('game-parent')) {
            item.classList.add('active');
            const gameText = item.querySelector('.game');
            if (gameText) gameText.classList.add('active-nav');
        }
        else {
            if (!item.hasAttribute('data-hover-attached')) {
                textItem.style.transition = 'transform 0.3s ease';
                item.addEventListener('mouseenter', () => {
                    textItem.style.transform = 'translateX(10px)';
                });
                item.addEventListener('mouseleave', () => {
                    textItem.style.transform = 'translateX(0)';
                });
                item.setAttribute('data-hover-attached', 'true');
            }
        }
    });
}


    setupNavigationLinks(): void {
        if (!this.element) return;

        const links = this.element.querySelectorAll<HTMLAnchorElement>('a[href^="/"]');

        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const path = link.getAttribute('href');
                if (path) {
                    this.router.navigateTo(path);
                }
            });
        });
    }
    onMount(): void{
        const path = window.location.pathname;
        this.updateSidebarActiveStates(path);

    }

    unMount(): void {
        if (this.element && this.element.parentNode) {
            
            this.element.parentNode.removeChild(this.element);
        }
        this.onUnmount();
    }


    protected addEventListener(element: HTMLElement, event: string, handler: EventListener): void {
        element.addEventListener(event, handler);
        this.eventListeners.push({ element, event, handler });
    }

    protected removeAllEventListeners(): void {
    
        this.eventListeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        this.eventListeners = [];
    }

    protected onUnmount(): void {
        this.removeAllEventListeners();
    }


};