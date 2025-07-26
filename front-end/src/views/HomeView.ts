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
                                <div class="level flex justify-center items-center gap-4">
                                    <!-- Progress -->
                                    <div class="text-3xl font-bold">08</div>
                                    <div class="flex flex-col items-start justify-center !mb-8">
                                        <div class="percentage text-[14px]" id="percentageText">97%</div>
                                        <div class="progress-bar h-[10px] w-[600px] bg-[var(--text)] rounded-3xl relative overflow-hidden">
                                            <div class="progress-fill h-full rounded-3xl" id="progressFill"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="absolute top-[90px] right-[100px] w-[100px] h-[35px] rounded-3xlflex justify-center items-center">
                                    <div class="">
                                        <span class="!px-4 !py-2 rounded-xl bg-[var(--freax)] font-bold text-[12px]"> Freax </span>
                                    </div>
                            </div>
                        </div>   
                        <div class="w-[100%] h-[100%] rounded-3xl bg-[var(--secondary)] flex justify-center items-center gap-16 ">

                            <div class="border border-[var(--accent)] rounded-3xl flex justify-between items-center w-[50%] !pr-8 !ml-6">
                                <canvas id="donutChart" width="300" height="300"></canvas>
                                <div class="flex flex-col gap-6">
                                    <div class="flex flex-col">
                                        <div>Your Balance</div> 
                                        <div id="balanceValue" class="text-[var(--accent)] text-2xl"></div> 
                                    </div>
                                    <div class="flex flex-col">
                                        <div>Your Level</div> 
                                        <div id="levelValue" class="text-[var(--accent)] text-2xl"></div> 
                                    </div>
                                </div>
                                
                            </div>
                            <div class="flex flex-col gap-10 !mr-8">
                                <div class="flex justify-center items-center gap-8 ">
                                    <div class="border border-[var(--accent)] rounded-2xl w-[200px] h-[125px]  flex flex-col justify-center items-center gap-2
                                        transition-transform duration-300 hover:scale-[1.03]">
                                        <div class=" opacity-[0.7]">Matches Played</div>
                                        <div id="matchesPlayed" class=" text-[var(--accent)] text-2xl"></div>
                                    </div>
                                    <div class="border border-[var(--accent)] rounded-2xl w-[200px] h-[125px] flex flex-col justify-center items-center gap-2
                                        transition-transform duration-300 hover:scale-[1.03]">
                                        <div class=" opacity-[0.7]">Friends Count</div>
                                        <div id="friendsCount" class=" text-[var(--accent)] text-2xl"></div>
                                    </div>
                                </div>
                                <div class="flex justify-center items-center gap-8">
                                    <div class="border border-[var(--accent)] rounded-2xl w-[200px] h-[125px] flex flex-col justify-center items-center gap-2
                                        transition-transform duration-300 hover:scale-[1.03]">
                                        <div class="opacity-[0.7] ">Global Rank</div>
                                        <div id="globalRank" class="text-[var(--accent)] text-2xl"></div>
                                    </div>
                                    <div class="border border-[var(--accent)] rounded-2xl w-[200px] h-[125px] flex flex-col justify-center items-center gap-2
                                        transition-transform duration-300 hover:scale-[1.03]">
                                        <div class="opacity-[0.7] ">Win Rate</div>
                                        <div id="winRate" class="text-[var(--accent)] text-2xl"></div>
                                    </div>
                                    
                                    
                                </div>
                            </div>
                                
                        </div>
                    </aside>
                    <aside class="w-[25%] h-[95%] !m-auto overflow-y-auto overflow-x-hidden rounded-l-3xl rounded-bl-3xl bg-[var(--secondary)] !p-4 friends-and-request">
                        <div class="flex flex-col h-full ">


                            <header class="sticky top-0 z-10 flex justify-around !py-4 ">
                                <button id="tab-online" class="tab-btn active">Online</button>
                                <button id="tab-all" class="tab-btn">All</button>
                                <button id="tab-requests" class="tab-btn">Requests</button>
                                <button id="tab-suggestions" class="tab-btn">Suggestions</button>
                            </header>

                           
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
                                    <button class= text-[var(--success)] w-[30px] h-[30px] rounded-full hover:bg-green-600 transition">
                                        
                                        <i class="ti ti-circle-check text-3xl"></i>
                                    </button>
                                    <button class= text-[var(--danger)] w-[30px] h-[30px] hover:bg-red-600 transition">
                                        <i class="ti ti-x text-3xl"></i>
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
        this.chatWinLose();
        this.animateNumber('balanceValue', 500, 1000); // Balance to 500
        this.animateNumber('levelValue', 8.97, 1000, 2); // Level to 8.97 with 2 decimals
        this.animateNumber('matchesPlayed', 8, 1000); // Matches palyed
        this.animateNumber('friendsCount', 5, 1000); // Friends count
        this.animateNumber('globalRank', 30, 1000); // Global rank
        this.animateNumber('winRate', 62.5, 1000, 1); // Win Rate wins / matches_played * 100
        
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


chatWinLose() {
    const canvas = document.getElementById('donutChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 100;
    const innerRadius = 80;

    const data = [
        { label: 'Win', value: 5, color: '#f39c12' },
        { label: 'Lose', value: 3, color: '#f39d1267' }
    ];
    const total = data.reduce((sum, item) => sum + item.value, 0);

    let currentProgress = 0;
    const animationSpeed = 0.01;

    const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let startAngle = -0.5 * Math.PI;
        let animatedValue = total * currentProgress;
        let remainingValue = animatedValue;

        for (const item of data) {
            const itemValue = Math.min(item.value, remainingValue);
            const sliceAngle = (itemValue / total) * 2 * Math.PI;

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = item.color;
            ctx.fill();

            startAngle += sliceAngle;
            remainingValue -= itemValue;
            if (remainingValue <= 0) break;
        }

        // Inner circle (donut hole)
        ctx.beginPath();
        ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
        ctx.fillStyle = '#2e2e2e';
        ctx.fill();

        
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Orbitron';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Win: 5', centerX, centerY - 12);
        ctx.fillText('Lose: 3', centerX, centerY + 12);

        if (currentProgress < 1) {
            currentProgress += animationSpeed;
            requestAnimationFrame(draw);
        }
    };

    draw();
}


animateNumber(elementId: string, targetValue: number, duration: number = 1000, decimals: number = 0) {
    const el = document.getElementById(elementId);
    if (!el) return;

    const start = performance.now();
    const initialValue = 0;

    const animate = (timestamp: number) => {
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        const currentValue = initialValue + (targetValue - initialValue) * progress;

        el.textContent = currentValue.toFixed(decimals);

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    };

    requestAnimationFrame(animate);
}


};