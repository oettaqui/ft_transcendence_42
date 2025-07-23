import { View } from "../app/View";


export class HomeView extends View{
    
    constructor(){
        super()
    }
    render (): HTMLElement{
        
        const element = document.createElement('section');
        element.classList.add('bg-[var(--primary)]');
        element.classList.add('w-[100%]');
        element.classList.add('h-[100%]');
        element.classList.add('rounded-4xl');
        element.classList.add('!mt-[24px]');
        element.classList.add('flex');
        element.classList.add('items-cente');
        element.innerHTML = `
                    <aside class="flex flex-col justify-between w-[70%] h-[95%] gap-10 !m-auto ">
                        <div class="w-full h-[70%] relative">
                            <!-- bg coalition -->
                            <div class=" bg-[url(/public/assets/Freax_BG.jpg)] bg-cover w-full h-full rounded-3xl !p-4 !pl-10 flex flex-col justify-center gap-10" >
                                <div class="z-[10] flex justify-start items-center gap-8">
                                    <div class="relative flex justify-center items-center w-[110px] h-[110px]">
                                        <div class="absolute w-[102px] h-[102px] bg-[var(--accent)] rounded-full"> </div>
                                        <img class="w-[100px] h-[100px] bg-contain bg-no-repeat bg-center  rounded-full z-[11] flex justify-center items-center" src="/public/assets/oettaqui.jpeg" />
                                    </div>
                                    <div class="flex flex-col justify-center items-start">
                                        <h2 class="text-[28px] font-bold"> Oussama Ettaqui </h2>
                                        <p class="font-light text-[14px]">oettaqui</p>
                                    </div>
                                </div>
                                <div class="level flex justify-start items-center gap-4">
                                    <!-- Progress -->
                                    <div class="text-3xl font-bold">08</div>
                                    <div class="flex flex-col items-start justify-center !mb-8">
                                        <div class="percentage text-[14px]" id="percentageText">97%</div>
                                        <div class="progress-bar h-[10px] w-[400px] bg-[var(--text)] rounded-3xl relative overflow-hidden">
                                            <div class="progress-fill h-full rounded-3xl" id="progressFill"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="absolute top-[50px] right-[100px] w-[100px] h-[35px] rounded-3xl bg-[#333333] flex justify-center items-center">
                                <!-- location -->
                                <div class="flex justify-center items-center gap-2">
                                    <div class="w-[10px] h-[10px] bg-[var(--success)] rounded-full"></div>
                                    <div class="text-[12px] font-light">c3r4p9</div>
                                </div>
                                    <div class="absolute top-[140px]">
                                        <span class="!px-4 !py-2 rounded-xl bg-[var(--freax)] font-bold text-[12px]"> Freax </span>
                                        
                                    </div>
                            </div>
                        </div>
                        <div class="w-[100%] h-[100%] rounded-3xl bg-[var(--secondary)]">
                                
                        </div>
                    </aside>
                    <aside class="w-[25%] h-[95%] !m-auto overflow-y-auto  rounded-l-3xl rounded-bl-3xl bg-[var(--secondary)] !p-4 friends-and-request">
                        <div class="flex flex-col h-full ">


                            <header class="sticky top-0 z-10 flex justify-around !py-4 ">
                                <button id="tab-online" class="tab-btn active">Online</button>
                                <button id="tab-all" class="tab-btn">All</button>
                                <button id="tab-requests" class="tab-btn">Requests</button>
                                <button id="tab-suggestions" class="tab-btn">Suggestions</button>
                            </header>

                            <!-- items -->
                            <!--
                            <div class="friends-list flex-1 overflow-y-auto overflow-x-hidden !pt-4 flex flex-col gap-3 w-full">
                                <div class="flex items-center justify-between border border-[var(--border)] !px-4 !py-3 rounded-full w-[350px] hover:bg-[var(--light-hover)] transition-colors">
                                    <div class="flex items-center gap-3 min-w-0">
                                        <img class="w-12 h-12 rounded-full object-cover" src="../../public/assets/yakhay.jpeg"/>
                                        <div class="flex flex-col min-w-0">
                                            <div class="text-sm font-medium truncate">Yassin Khay</div>
                                            <div class="text-xs font-light text-[var(--text-secondary)] truncate">2400PX</div>
                                        </div>

                                    </div>
                                
                                    <div class="">
                                        <i class="ti ti-message text-3xl "></i>
                                    </div>
                                </div>

                                 <div class="flex items-center justify-between border border-[var(--border)] !px-4 !py-3 rounded-full  w-[350px] hover:bg-[var(--light-hover)] transition-colors">
                                    <div class="flex items-center gap-3 min-w-0">
                                        <img class="w-12 h-12 rounded-full object-cover" src="../../public/assets/bchokri.jpeg"/>
                                        <div class="flex flex-col min-w-0">
                                            <div class="text-sm font-medium truncate">Badr Chokri</div>
                                            <div class="text-xs font-light text-[var(--text-secondary)] truncate">1200PX</div>
                                        </div>
                                    </div>
                                    
                                    <div class="">
                                        <i class="ti ti-message text-3xl "></i>
                                    </div>
                                </div>
    
                         
                           
                                 <div class="flex items-center justify-between border border-[var(--border)] !px-4 !py-3 rounded-full  w-[350px] hover:bg-[var(--light-hover)] transition-colors">
                                    <div class="flex items-center gap-3 min-w-0">
                                        <img class="w-12 h-12 rounded-full object-cover" src="../../public/assets/oettaqui.jpeg"/>
                                        <div class="flex flex-col min-w-0">
                                            <div class="text-sm font-medium truncate">Oussama Ettaqui</div>
                                            <div class="text-xs font-light text-[var(--text-secondary)] truncate">1200PX</div>
                                        </div>
                                    </div>
                                    
                                    <div class="">
                                        <i class="ti ti-message text-3xl "></i>
                                    </div>
                                </div>

                            </div>
                            -->
                             <!-- request -->
                            <div class="flex items-center justify-between !p-3 rounded-xl hover:bg-[var(--light-hover)] transition !mt-3">
                                <div class="flex items-center gap-3">
                                    <img src="/public/assets/bchokri.jpeg" class="w-10 h-10 rounded-full object-cover" />
                                    <div class="flex flex-col">
                                    <span class="text-sm font-medium">Badr Chokri</span>
                                    <span class="text-xs text-[var(--text-secondary)]">Sent you a request</span>
                                    </div>
                                </div>
                                <div class="flex gap-2">
                                    <button class="bg-green-500 text-white w-[30px] h-[30px] rounded-full hover:bg-green-600 transition">
                                        <i class="ti ti-check"></i>
                                    </button>
                                    <button class="bg-red-500 text-white w-[30px] h-[30px] rounded-full hover:bg-red-600 transition">
                                        <i class="ti ti-x"></i>
                                    </button>
                                </div>
                            </div>
                            <!-- online -->
                            <div class="flex items-center justify-between !p-3 rounded-xl hover:bg-[var(--light-hover)] transition">
                                <div class="flex items-center gap-3">
                                    <img src="/public/assets/oettaqui.jpeg" class="w-10 h-10 rounded-full object-cover" />
                                    <div class="flex flex-col">
                                    <span class="text-sm font-medium">Oussama Ettaqui</span>
                                    <span class="flex items-center justify-start gap-3">
                                        <span class="block w-[8px] h-[8px] rounded-full bg-[var(--success)]"></span>
                                        <span class="block text-xs text-[var(--text-secondary)] !pt-1">Online</span></span>
                                    </div>
                                </div>
                                <button class=" !mr-4 flex items-center">
                                    <i class="ti ti-message text-2xl"></i>
                                </button>
                            </div>
                            <!-- all -->
                            <div class="flex items-center justify-between bg-[var(--primary)] rounded-xl !p-3">
                                <div class="flex items-center gap-3">
                                    <img src="/public/assets/oettaqui.jpeg" class="w-10 h-10 rounded-full object-cover">
                                    <div>
                                    <div class="font-medium text-sm">Oussama Ettaqui</div>
                                    <div class="text-xs text-[var(--text-secondary)]">Last seen 2h ago</div>
                                    </div>
                                </div>
                                <button class=" !mr-4 flex items-center">
                                    <i class="ti ti-message text-2xl"></i>
                                </button>
                            </div>

                            <!-- suggestion -->

                            <div class="flex items-center justify-between bg-[var(--primary)] rounded-xl !p-3 !mt-3">
                                <div class="flex items-center gap-3">
                                    <img src="/public/assets/yakhay.jpeg" class="w-10 h-10 rounded-full object-cover">
                                    <div>
                                    <div class="font-medium text-sm">New Friend</div>
                                    <div class="text-xs text-[var(--text-secondary)]">Suggested</div>
                                    </div>
                                </div>
                                <button class="bg-[var(--accent)] text-black rounded-md !px-2 !py-1 text-[12px]">Add</button>
                            </div>

                            <!-- No data found -->
                            <div class="flex flex-col items-center justify-center text-center gap-3 bg-[var(--primary)] rounded-2xl !p-6 !mt-3">
                                <i class="ti ti-user-off text-4xl text-[var(--text-secondary)]"></i>
                                <div class="text-sm font-medium text-[var(--text-secondary)]">No data found here</div>
                            </div>


                            
                        </div>
                    </aside>
                    `;

        return element;

    }

    public onMount(): void {
        this.animateProgress();
        
    }
   
    
    
    animateProgress(): void {
        const percentageElement = document.getElementById('percentageText');
        const progressFillElement = document.getElementById('progressFill');
        
        if (!percentageElement || !progressFillElement) {
            console.error('Progress elements not found');
            return;
        }
        

        const targetPercentage = parseInt(percentageElement.textContent || '0');
        
  
        percentageElement.textContent = '0%';
        progressFillElement.style.width = '0%';
        
        
        setTimeout(() => {
            progressFillElement.style.width = targetPercentage + '%';
            
           
            this.animateCounter(0, targetPercentage, 2000, (value: number) => {
                percentageElement.textContent = Math.round(value) + '%';
            });
        }, 100);
    }

    animateCounter(start: number, end: number, duration: number, callback: (value: number) => void): void {
        const startTime = performance.now();
        
        const update = () => {
            const currentTime = performance.now();
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = start + (end - start) * easeOutProgress;
            
            callback(currentValue);
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };
        
        requestAnimationFrame(update);
    }

   

};