
import { Router } from "./Router";
import { View } from "./View";

export class DashboardLayout {
    private view: View;
    private router: Router;
    private element: HTMLElement | null = null;
    private elementContainer: HTMLElement | null = null;
    // private userState: UserState;
    protected eventListeners: Array<{
        element: HTMLElement;
        event: string;
        handler: EventListener;
    }> = [];

    constructor(view :View, router : Router) {
        
        this.view = view ;
        this.element = null;
        // this.userState = userState;
        this.router = router;
    }

   render(): HTMLElement | null {
        this.elementContainer = document.createElement('div');
         this.elementContainer.classList.add('w-[100%]');
         this.elementContainer.classList.add('h-[100%]');
         this.elementContainer.innerHTML = `
            <div class= "max-w-[100%] !m-auto">
                <header class="h-20 !pt-[20px] w-[100%] fixed z-[100] bg-[rgba(13, 17, 23, 0.95)] backdrop-blur-md shadow-md !px-40">
                    <nav class="flex justify-between items-center">
                        <h1 class="text-3xl font-extrabold tracking-widest text-[color:var(--text)] no-underline"><span class="text-[var(--accent)]">P</span>ING<span class="text-[var(--accent)]">P</span>ONG</h1>
                        <div class="relative flex items-center gap-7">
                            <input 
                                type="text" 
                                class="bg-[var(--secondary)] w-[400px] h-[42px] border border-[var(--accent)] rounded-[8px] !pl-2 !pr-12 focus:outline-none transition-all"
                                placeholder="Search..."
                            />
                            <div class="rounded-full w-[45px] h-[45px] flex justify-center items-center absolute right-[5px] top-[-2px]">
                                <i class="ti ti-search text-[22px]"></i>
                            </div>
                        </div>
                        <div class="flex items-center gap-6">
                            <div class="bg-[var(--secondary)] !px-4 !py-2 rounded-2xl flex items-center gap-2">
                                <img class="w-10 h-10 rounded-full object-cover" src="../../public/assets/qoins.png"  /> 
                                <div class="text-[16px] font-medium">1200</div>
                            </div>
                            <div class="relative flex items-end gap-8">
                                <i class="ti ti-bell-filled text-[32px] font-light text-[var(--text)]"></i>
                                <div class="absolute top-[8px] left-[18px] bg-red-700 rounded-full text-[14px] w-[14px] h-[12px] text-center z-[10] "></div>
                                <!-- Profil -->
                                <div >
                                    <div class="profil w-[45px] h-[45px] rounded-full bg-[var(--text-secondary)] flex justify-center items-center">
                                        <img class="w-[40px] h-[40px] rounded-full" src="../../public/assets/oettaqui.jpeg" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </nav>
                </header>
                
                <main class="flex h-[100vh] !p-24">
                   
                    <aside class="w-[350px] flex flex-col items-start justify-center ">
                        <div class="absolute bottom-20 left-10 w-16 h-16 bg-accent opacity-5 rounded-full blur-2xl animate-bounce"></div>
                        

                        <!-- Navigation -->
                        <nav class="">
                            <ul class="flex flex-col itmes-center justify-center gap-10 ">
                                <li class="nav-item-animated opacity-0 home-parent 1">
                                    <a href="/dashboard" class="group relative flex items-center !px-2 !py-2 text-primary rounded-xl transition-all duration-300 hover:bg-secondary hover-accent-light  hover:translate-x-2 hover:shadow-lg hover-glow overflow-hidden">
                                        <!-- Slide effect -->
                                        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 -translate-x-full group-hover:translate-x-full group-hover:opacity-20 transition-all duration-700"></div>
                                        
                                        <div class="relative z-10 flex items-center w-full">
                                            <div class="icon-hover w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mr-4 group-hover:bg-accent transition-all duration-300">
                                                <i class="ti ti-home text-2xl text-accent group-hover:text-black transition-colors duration-300"></i>
                                            </div>
                                            <span class="home text-animation font-semibold !pl-[12px] text-lg group-hover:text-accent transition-colors duration-300">Home</span>
                                            
                                        </div>
                                    </a>
                                </li>

                                <li class="nav-item-animated opacity-0 game-parent 1">
                                    <a href="/dashboard/game" class="group relative flex items-center !px-2 !py-2 text-primary rounded-xl transition-all duration-300 hover:bg-secondary hover-accent-light hover:transform hover:translate-x-2 hover:shadow-lg hover-glow overflow-hidden">
                                        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 -translate-x-full group-hover:translate-x-full group-hover:opacity-20 transition-all duration-700"></div>
                                        
                                        <div class="relative z-10 flex items-center w-full">
                                            <div class="icon-hover w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mr-4 group-hover:bg-accent transition-all duration-300">
                                                <i class="ti ti-device-gamepad-2 text-2xl text-accent group-hover:text-black transition-colors duration-300"></i>
                                            </div>
                                            <span class="game text-animation font-semibold !pl-[12px] text-lg group-hover:text-accent transition-colors duration-300">Games</span>
                                        
                                        </div>
                                    </a>
                                </li>

                                <li class="nav-item-animated opacity-0 chat 1">
                                    <a href="#" class="group relative flex items-center !px-2 !py-2 text-primary rounded-xl transition-all duration-300 hover:bg-secondary hover-accent-light hover:transform hover:translate-x-2 hover:shadow-lg hover-glow overflow-hidden">
                                        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 -translate-x-full group-hover:translate-x-full group-hover:opacity-20 transition-all duration-700"></div>
                                        
                                        <div class="relative z-10 flex items-center w-full">
                                            <div class="icon-hover w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mr-4 group-hover:bg-accent transition-all duration-300">
                                                <i class="ti ti-message text-2xl text-accent group-hover:text-black transition-colors duration-300"></i>
                                            </div>
                                            <span class="text-animation font-semibold !pl-[12px] text-lg group-hover:text-accent transition-colors  duration-300">Chat</span>
                                        
                                        </div>
                                    </a>
                                </li>

                                <li class="nav-item-animated opacity-0 tournament 1">
                                    <a href="#" class="group relative flex items-center !px-2 !py-2 text-primary rounded-xl transition-all duration-300 hover:bg-secondary hover-accent-light hover:transform hover:translate-x-2 hover:shadow-lg hover-glow overflow-hidden">
                                        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 -translate-x-full group-hover:translate-x-full group-hover:opacity-20 transition-all duration-700"></div>
                                        
                                        <div class="relative z-10 flex items-center w-[210px]">
                                            <div class="icon-hover w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mr-4 group-hover:bg-accent transition-all duration-300">
                                                <i class="ti ti-trophy text-2xl text-accent group-hover:text-black transition-colors duration-300"></i>
                                            </div>
                                            <span class="text-animation font-semibold !pl-[12px] text-lg group-hover:text-accent transition-colors duration-300">Tournament</span>
                                            
                                        </div>
                                    </a>
                                </li>

                                <li class="nav-item-animated opacity-0 settings">
                                    <a href="#" class="group relative flex items-center !px-2 !py-2 text-primary rounded-xl transition-all duration-300 hover:bg-secondary hover-accent-light hover:transform hover:translate-x-2 hover:shadow-lg hover-glow overflow-hidden">
                                        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 -translate-x-full group-hover:translate-x-full group-hover:opacity-20 transition-all duration-700"></div>
                                        
                                        <div class="relative z-10 flex items-center w-full">
                                            <div class="icon-hover w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mr-4 group-hover:bg-accent transition-all duration-300">
                                                <i class="ti ti-settings text-2xl text-accent group-hover:text-black transition-colors duration-300"></i>
                                            </div>
                                            <span class="text-animation font-semibold !pl-[12px] text-lg group-hover:text-accent transition-colors duration-300">Settings</span>
                                        
                                        </div>
                                    </a>
                                </li>
                            </ul>
                        </nav>

                    
                    </aside>
                    
                    <div class="new-section w-full h-full">
                        
                    </div>

                </main>
                
            </div>
        `;
       

        return  this.elementContainer;

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
        
        // this.setupEventListeners();
        this.setupNavigationLinks();
        this.onMount();
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





    // protected add3DTiltEffect(container: HTMLElement): void {}
    // protected addParticleEffects(container: HTMLElement): void {}
};