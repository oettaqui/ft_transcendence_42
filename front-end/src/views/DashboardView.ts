import { View } from "../app/View";


export class DashboardView extends View {
    private li: HTMLElement | null = null;
    private event: string | null = null;
    private handler: EventListener | null = null;
    constructor() {
        super();
    }

    render (): HTMLElement{
        
        const element = document.createElement('div');
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
                   
                    <aside class="w-[300px] flex flex-col items-center justify-center  gap-52">
                        <div class="absolute top-10 right-10 w-20 h-20 bg-accent opacity-10 rounded-full blur-xl animate-pulse"></div>
                        <div class="absolute bottom-20 left-10 w-16 h-16 bg-accent opacity-5 rounded-full blur-2xl animate-bounce"></div>
                        
                    

                        <!-- Navigation -->
                        <nav class="">
                            <ul class="flex flex-col itmes-center justify-center gap-10 ">
                                <li class=" nav-item-animated opacity-0">
                                    <a href="#" class="group relative flex items-center !px-2 !py-2 text-primary rounded-xl transition-all duration-300 hover:bg-secondary hover-accent-light hover:transform hover:translate-x-2 hover:shadow-lg hover-glow overflow-hidden">
                                        <!-- Slide effect -->
                                        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 -translate-x-full group-hover:translate-x-full group-hover:opacity-20 transition-all duration-700"></div>
                                        
                                        <div class="relative z-10 flex items-center w-full">
                                            <div class="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mr-4 group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
                                                <i class="ti ti-home text-2xl text-accent group-hover:text-black transition-colors duration-300"></i>
                                            </div>
                                            <span class="text-animation font-semibold !pl-[12px] text-lg group-hover:text-accent transition-colors duration-300">Home</span>
                                            
                                        </div>
                                    </a>
                                </li>

                                <li class="nav-item-animated opacity-0">
                                    <a href="#" class="group relative flex items-center !px-2 !py-2 text-primary rounded-xl transition-all duration-300 hover:bg-secondary hover-accent-light hover:transform hover:translate-x-2 hover:shadow-lg hover-glow overflow-hidden">
                                        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 -translate-x-full group-hover:translate-x-full group-hover:opacity-20 transition-all duration-700"></div>
                                        
                                        <div class="relative z-10 flex items-center w-full">
                                            <div class="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mr-4 group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
                                                <i class="ti ti-device-gamepad-2 text-2xl text-accent group-hover:text-black transition-colors duration-300"></i>
                                            </div>
                                            <span class="text-animation font-semibold !pl-[12px] text-lg group-hover:text-accent transition-colors duration-300">Games</span>
                                        
                                        </div>
                                    </a>
                                </li>

                                <li class="nav-item-animated opacity-0">
                                    <a href="#" class="group relative flex items-center !px-2 !py-2 text-primary rounded-xl transition-all duration-300 hover:bg-secondary hover-accent-light hover:transform hover:translate-x-2 hover:shadow-lg hover-glow overflow-hidden">
                                        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 -translate-x-full group-hover:translate-x-full group-hover:opacity-20 transition-all duration-700"></div>
                                        
                                        <div class="relative z-10 flex items-center w-full">
                                            <div class="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mr-4 group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
                                                <i class="ti ti-message text-2xl text-accent group-hover:text-black transition-colors duration-300"></i>
                                            </div>
                                            <span class="text-animation font-semibold !pl-[12px] text-lg group-hover:text-accent transition-colors  duration-300">Chat</span>
                                        
                                        </div>
                                    </a>
                                </li>

                                <li class="nav-item-animated opacity-0">
                                    <a href="#" class="group relative flex items-center !px-2 !py-2 text-primary rounded-xl transition-all duration-300 hover:bg-secondary hover-accent-light hover:transform hover:translate-x-2 hover:shadow-lg hover-glow overflow-hidden">
                                        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 -translate-x-full group-hover:translate-x-full group-hover:opacity-20 transition-all duration-700"></div>
                                        
                                        <div class="relative z-10 flex items-center w-[210px]">
                                            <div class="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mr-4 group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
                                                <i class="ti ti-trophy text-2xl text-accent group-hover:text-black transition-colors duration-300"></i>
                                            </div>
                                            <span class="text-animation font-semibold !pl-[12px] text-lg group-hover:text-accent transition-colors duration-300">Tournament</span>
                                            
                                        </div>
                                    </a>
                                </li>

                                <li class="nav-item-animated opacity-0">
                                    <a href="#" class="group relative flex items-center !px-2 !py-2 text-primary rounded-xl transition-all duration-300 hover:bg-secondary hover-accent-light hover:transform hover:translate-x-2 hover:shadow-lg hover-glow overflow-hidden">
                                        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 -translate-x-full group-hover:translate-x-full group-hover:opacity-20 transition-all duration-700"></div>
                                        
                                        <div class="relative z-10 flex items-center w-full">
                                            <div class="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mr-4 group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
                                                <i class="ti ti-settings text-2xl text-accent group-hover:text-black transition-colors duration-300"></i>
                                            </div>
                                            <span class="text-animation font-semibold !pl-[12px] text-lg group-hover:text-accent transition-colors duration-300">Settings</span>
                                        
                                        </div>
                                    </a>
                                </li>
                            </ul>
                        </nav>

                    
                    </aside>
                    <section class=" bg-[var(--secondary)] w-[100%] h-[100%] rounded-4xl !pt-24">
                    </section>

                </main>
                
            </div>
        `;
        return element;
    }

    
   onMount(): void {
        // Animate nav items on load
        this.addEventListener(window, 'load', () => {
            const navItems = document.querySelectorAll<HTMLElement>('.nav-item-animated');
            navItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                }, index * 100);
            });
        });

        // Add ripple effect on nav link clicks
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
         // Add smooth move-to-right on hover for nav items
    const navItems = document.querySelectorAll<HTMLElement>('.nav-item-animated');
     navItems.forEach(item => {
        // Select .text-animation inside this item
        const textItem = item.querySelector<HTMLElement>('.text-animation');
        if (!textItem) return;

        // Add transition for smooth movement
        textItem.style.transition = 'transform 0.3s ease';

        this.addEventListener(item, 'mouseenter', () => {
            textItem.style.transform = 'translateX(10px)'; // move right 80px on hover
        });

        this.addEventListener(item, 'mouseleave', () => {
            textItem.style.transform = 'translateX(0)'; // reset on hover out
        });
    });

    }
    
}


// <i class="ti ti-bell text-4xl font-light text-[var(--accent)]"></i>

//  <aside class="w-[300px] flex flex-col items-center justify-center  gap-52  ">
                
                        
//                         <nav class="">
//                             <div class="">
//                                 <ul class="flex flex-col itmes-center justify-center gap-10">
//                                     <li>
//                                         <a href="#" class="flex items-cente justify-start !px-3 !py-2 text-[var(--text)] rounded-lg hover:bg-[var(--accent)] transition-colors">
                                           
//                                            <div class="flex items-center gap-6"> <i class="ti ti-home text-4xl text-center"></i> <div class="font-bold text-[18px]" > Home</div> </div>
//                                         </a>
//                                     </li>
//                                     <li>
//                                         <a href="#" class="flex items-cente justify-start !px-3 !py-2 text-[var(--text)] rounded-lg hover:bg-[var(--accent)] transition-colors">
//                                            <div class="flex items-center gap-6"> <i class="ti ti-device-gamepad-2 text-4xl text-center"></i> <div class="font-bold text-[18px]" > Game</div> </div>
//                                         </a>
//                                     </li>
                                   
//                                     <li>
//                                         <a href="#" class="flex items-center justify-start !px-3 !py-2 text-[var(--text)] rounded-lg hover:bg-[var(--accent)] transition-colors">
                                           
//                                            <div class="flex items-center gap-6"> <i class="ti ti-message text-4xl text-center"></i> <div class="font-bold text-[18px]" > Chat</div> </div>
                                            
//                                         </a>
//                                     </li>
//                                     <li>
//                                         <a href="#" class="flex items-center justify-start !px-3 !py-2 text-[var(--text)] rounded-lg hover:bg-[var(--accent)] transition-colors">
                                           
//                                            <div class="flex items-center gap-6"> <i class="ti ti-laurel-wreath-1  text-4xl text-center"></i> <div class="font-bold text-[18px]" > Tournament</div> </div>
                                            
//                                         </a>
//                                     </li>
//                                     <li>
//                                         <a href="#" class="flex items-center justify-start !px-3 !py-2 text-[var(--text)] rounded-lg hover:bg-[var(--accent)] transition-colors">
//                                             <div class="flex items-center gap-6"> <i class="ti ti-settings text-4xl text-center"></i> <div class="font-bold text-[18px]" > Settings</div> </div>
                                            
//                                         </a>
//                                     </li>
//                                 </ul>
//                             </div>
//                         </nav>
//                     </aside>



// window.addEventListener('load', function() {
//             const navItems = document.querySelectorAll('.nav-item-animated');
//             navItems.forEach((item, index) => {
//                 setTimeout(() => {
//                     item.style.opacity = '1';
//                 }, index * 100);
//             });
//         });

//         // Add interactive click effects
//         document.querySelectorAll('nav a').forEach(link => {
//             link.addEventListener('click', function(e) {
//                 e.preventDefault();
                
//                 // Create ripple effect
//                 const ripple = document.createElement('div');
//                 ripple.style.position = 'absolute';
//                 ripple.style.borderRadius = '50%';
//                 ripple.style.background = 'rgba(243, 156, 18, 0.6)';
//                 ripple.style.transform = 'scale(0)';
//                 ripple.style.animation = 'ripple 600ms linear';
//                 ripple.style.left = e.offsetX - 10 + 'px';
//                 ripple.style.top = e.offsetY - 10 + 'px';
//                 ripple.style.width = ripple.style.height = '20px';
                
//                 this.appendChild(ripple);
                
//                 setTimeout(() => {
//                     ripple.remove();
//                 }, 600);
//             });
//         });