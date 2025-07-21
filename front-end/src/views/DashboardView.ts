import { View } from "../app/View";
import  { HomeView } from "./HomeView"
import { GameView } from "./GameView";

export class DashboardView extends View {
    private sectionContainer!: HTMLElement;
    private currentView!: View | null;
    constructor() {
        super();
    }

    render (): HTMLElement{
        
        const element = document.createElement('div');
        element.classList.add('.w-[100%]');
        element.classList.add('.h-[100%]');
        element.innerHTML = `
            <div class= "max-w-[100%] !m-auto">
                <header class="h-20 !pt-[20px] w-[100%] fixed z-[100] bg-[rgba(13, 17, 23, 0.95)] backdrop-blur-md shadow-md !px-40">
                    <nav class="flex justify-between items-center">
                        <h1 class="text-3xl font-extrabold tracking-widest text-[color:var(--text)] no-underline"><span class="text-[var(--accent)]">P</span>ING<span class="text-[var(--accent)]">P</span>ONG</h1>
                        <div class=" relative flex itmes-center gap-7">
                             <input 
                                type="text" 
                                class="bg-[var(--secondary)] w-[400px] h-[42px] border border-[var(--accent)] rounded-[8px] !px-2 focus:outline-none  transition-all"
                                placeholder="Search..."
                            />
                            <div class=" rounded-full w-[45px] h-[45px] flex justify-center items-center absolute right-[5px] top-[-2px] "><i class="ti ti-search text-[22px] "></i></div>
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
                    </nav>
                </header>
                
                <main class="flex h-[100vh] !p-24">
                   
                    <aside class="w-[350px] flex flex-col items-start justify-center ">
                        <div class="absolute top-10 right-10 w-20 h-20 bg-accent opacity-10 rounded-full blur-xl animate-pulse"></div>
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

        this.sectionContainer = element.querySelector(
            ".new-section"
        ) as HTMLElement;

        this.handleSubRoute();

        window.addEventListener("popstate", () => this.handleSubRoute());

        element.querySelectorAll("a").forEach(anchor => {
            anchor.addEventListener("click", (e) => {
                const target = e.currentTarget as HTMLAnchorElement;
                if (
                    target.tagName === 'A' &&
                    target.href.startsWith(window.location.origin + "/dashboard")
                ) {
                    e.preventDefault();
                    const path = new URL(target.href).pathname;
                    history.pushState(null, '', path);
                    this.handleSubRoute();
                    this.updateSidebarActiveStates(path);
                }
            });
        });
        return element;
    }

    
   onMount(): void {
        this.addEventListener(window, 'load', () => {
            const navItems = document.querySelectorAll<HTMLElement>('.nav-item-animated');
            navItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                }, index * 100);
            });
        });

        const navLinks = document.querySelectorAll<HTMLElement>('aside nav a');

        navLinks.forEach(link => {
            this.addEventListener(link, 'click', (e: MouseEvent) => {
                e.preventDefault();

                const ripple = document.createElement('div');
                ripple.style.position = 'absolute';
                ripple.style.borderRadius = '50%';
                ripple.style.background = 'rgba(243, 156, 18, 0.6)';
                ripple.style.transform = 'scale(0)';
                ripple.style.animation = 'ripple 600ms linear';
                ripple.style.left = `${e.offsetX - 10}px`;
                ripple.style.top = `${e.offsetY - 10}px`;
                ripple.style.width = ripple.style.height = '20px';

                link.style.position = 'relative';
                link.appendChild(ripple);

                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
        
        const navItems = document.querySelectorAll<HTMLElement>('.nav-item-animated');
        navItems.forEach((item) => {
           
            const textItem = item.querySelector<HTMLElement>('.text-animation');
            const path = window.location.pathname;
            if (!textItem) return;
            const home = document.querySelector('.home');
            const homeParent = document.querySelector('.home-parent');
            
            if (!home || !homeParent) {
                console.log('Element with class .home not found');
                return;
            }
            if (path === "/dashboard") {
                home.classList.add('active-nav');
                homeParent.classList.add('active');
            }
            
            if (!home)
            {
                textItem.style.transition = 'transform 0.3s ease';
                this.addEventListener(item, 'mouseenter', () => {
                    textItem.style.transform = 'translateX(10px)'; 
                });

                this.addEventListener(item, 'mouseleave', () => {
                    textItem.style.transform = 'translateX(0)';
                });
            }
            
          
        });
  


    
    }

    handleSubRoute() {
        const path = window.location.pathname;


        switch (path) {
            case "/dashboard":
                this.currentView = new HomeView();
                break;
            case "/dashboard/game":
                this.currentView = new GameView();
                break;
            default:
                this.currentView = new HomeView();
                break;
        }
        this.sectionContainer.innerHTML = "";
        // this.sectionContainer.appendChild(this.currentView.render());
        this.currentView.mount(this.sectionContainer);
    }

    updateSidebarActiveStates(path: string): void {
        const navItems = document.querySelectorAll<HTMLElement>('.nav-item-animated');

        navItems.forEach((item) => {
            const textItem = item.querySelector<HTMLElement>('.text-animation');
            if (!textItem) return;

            // Reset all
            item.classList.remove('active');
            textItem.classList.remove('active-nav');

            // Determine based on path
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
                // Enable hover animations for non-active items
                textItem.style.transition = 'transform 0.3s ease';
                item.addEventListener('mouseenter', () => {
                    textItem.style.transform = 'translateX(10px)';
                });
                item.addEventListener('mouseleave', () => {
                    textItem.style.transform = 'translateX(0)';
                });
            }
        });
}

    


}

