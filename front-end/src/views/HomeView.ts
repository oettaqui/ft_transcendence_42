import { View } from "../app/View";

import { FriendsData } from "../types/FriendData";
import { Friend } from "../types/FriendData";

export class HomeView extends View{
    private currentTab: string = 'all';
    private friendsData: FriendsData;

    constructor(){
        super();
        // Initialize with static data - replace with API calls later
        this.friendsData = this.getStaticFriendsData();
    }
render(): HTMLElement {
    const element = document.createElement('section');
    element.classList.add('bg-[var(--primary)]');
    element.classList.add('w-full');
    element.classList.add('h-full');
    element.classList.add('rounded-4xl');
    element.classList.add('!mt-8');
    element.classList.add('flex'); 
    // element.classList.add('overflow-x-hidden'); 
    element.classList.add('items-center');
    element.classList.add('justify-center');
    // element.classList.add('!gap-5'); // Add gap on mobile
    // element.classList.add('!p-2'); //// Add padding on mobile

    element.innerHTML = `
        <aside class="w-[65%] flex flex-col items-start  !gap-4 !px-4">
            <div class="relative w-[100%] h-full">
                <!-- bg coalition -->
                <div class="bg-[url(/public/assets/Freax_BG.jpg)] bg-cover w-full  min-h-[200px] h-full rounded-3xl !p-8  flex flex-col justify-center !gap-10">
                    <div class="z-[10] flex flex-col sm:flex-row justify-start items-center !gap-4 lg:!gap-8">
                        <div class="relative flex justify-center items-center w-[80px] h-[80px] lg:w-[110px] lg:h-[110px]">
                            <div class="absolute w-[72px] h-[72px] lg:w-[102px] lg:h-[102px] bg-[var(--accent)] rounded-full"></div>
                            <img class="w-[70px] h-[70px] lg:w-[100px] lg:h-[100px] bg-contain bg-no-repeat bg-center rounded-full z-[11] flex justify-center items-center" src="/public/assets/oettaqui.jpeg" />
                        </div>
                        <div class="flex flex-col justify-center items-center sm:items-start text-center sm:text-left">
                            <h2 class="text-xl lg:text-[28px] font-bold">Oussama Ettaqui</h2>
                            <p class="font-light text-xs lg:text-[14px]">oettaqui</p>
                        </div>
                    </div>
                    <div class="level flex flex-col sm:flex-row justify-center items-center !gap-2 lg:!gap-4">
                        <!-- Progress -->
                        <div class="text-2xl lg:text-3xl font-bold">08</div>
                        <div class="flex flex-col items-center sm:items-start justify-center w-full sm:w-auto">
                            <div class="percentage text-xs lg:text-[14px] !mb-1" id="percentageText">97%</div>
                            <div class="progress-bar h-[8px] lg:h-[10px] w-full max-w-[300px] sm:max-w-[400px] lg:w-[600px] bg-[var(--text)] rounded-3xl relative overflow-hidden">
                                <div class="progress-fill h-full rounded-3xl" id="progressFill"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="absolute top-4 lg:top-[90px] right-4 lg:right-[100px] w-auto lg:w-[100px] h-[30px] lg:h-[35px] rounded-xl lg:rounded-3xl flex justify-center items-center">
                    <div class="">
                        <span class="!px-2 lg:!px-4 !py-1 lg:!py-2 rounded-xl bg-[var(--freax)] font-bold text-[10px] lg:text-[12px]">Freax</span>
                    </div>
                </div>
            </div>   
            
            <div class="w-full h-full rounded-3xl bg-[var(--secondary)] flex  justify-center items-center ">
                <div class="border border-[var(--accent)] rounded-2xl flex flex-row justify-between items-center w-[50%] !px-4 !py-6 !ml-15 !gap-4">
                    <canvas id="donutChart" width="200" height="200" ></canvas>
                    <div class="flex flex-col !gap-3 text-left">
                        <div class="flex flex-col">
                            <div class="text-sm">Your Balance</div> 
                            <div id="balanceValue" class="text-[var(--accent)] text-2xl"></div> 
                        </div>
                        <div class="flex flex-col">
                            <div class="text-sm">Your Level</div> 
                            <div id="levelValue" class="text-[var(--accent)] text-2xl"></div> 
                        </div>
                    </div>
                </div>
                
                <div class="flex flex-col !gap-2  !mr-10 !p-4">
                    <div class="flex justify-center items-center !gap-2">
                        <div class="border border-[var(--accent)] rounded-2xl  w-[140px] h-[125px]  flex flex-col justify-center items-center !gap-2 transition-transform duration-300 hover:scale-[1.02]">
                            <div class="opacity-[0.7] text-[14px] text-center">Matches Played</div>
                            <div id="matchesPlayed" class="text-[var(--accent)] text-2xl"></div>
                        </div>
                        <div class="border border-[var(--accent)] rounded-2xl w-[140px] h-[125px] flex flex-col justify-center items-center !gap-2 transition-transform duration-300 hover:scale-[1.02]">
                            <div class="opacity-[0.7] text-[14px] text-center">Friends Count</div>
                            <div id="friendsCount" class="text-[var(--accent)] text-2xl"></div>
                        </div>
                    </div>
                    <div class="flex justify-center items-center !gap-2">
                        <div class="border border-[var(--accent)] rounded-2xl ] w-[140px] h-[125px] flex flex-col justify-center items-center !gap-2 transition-transform duration-300 hover:scale-[1.02]">
                            <div class="opacity-[0.7] text-[14px] text-center ">Global Rank</div>
                            <div id="globalRank" class="text-[var(--accent)] text-2xl"></div>
                        </div>
                        <div class="border border-[var(--accent)] rounded-2xl w-[140px] h-[125px] flex flex-col justify-center items-center !gap-2 transition-transform duration-300 hover:scale-[1.02]">
                            <div class="opacity-[0.7] text-[14px] text-center ">Win Rate</div>
                            <div id="winRate" class="text-[var(--accent)] text-2xl"></div>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
        
        <aside class=" w-[35%] h-[95%] overflow-y-auto overflow-x-hidden rounded-3xl bg-[var(--secondary)] !p-2 friends-and-request !mr-4 !my-4">
            <div class="flex flex-col ">
                <header class="sticky top-0 z-10 flex justify-around !py-2  bg-[var(--secondary)]">
                    <button id="tab-all" class="tab-btn active !text-xs !px-2  !py-1 " data-category="all">All</button>
                    <button id="tab-online" class="tab-btn !text-xs !px-2  !py-1 " data-category="online">Online</button>
                    <button id="tab-requests" class="tab-btn !text-xs !px-2  !py-1 " data-category="requests">Requests</button>
                    <button id="tab-pending" class="tab-btn !text-xs !px-2  !py-1 " data-category="pending">Pending</button>
                </header>

                <!-- Loading state -->
                <div id="friends-loading" class="hidden flex justify-center items-center !py-4 ">
                    <div class="animate-spin rounded-full h-6 w-6 lg:h-8 lg:w-8 border-b-2 border-white"></div>
                </div>

                <!-- Friends List Container -->
                <div id="friends-list" class="flex-1"></div>

                <!-- No Data State -->
                <div id="friends-no-data" class="hidden flex flex-col items-center justify-center text-center gap-3 bg-[var(--primary)] rounded-2xl !p-6 !mt-3">
                    <i class="ti ti-user-off text-2xl  text-[var(--text-secondary)]"></i>
                    <div class="text-xs  font-medium text-[var(--text-secondary)]">No data found here</div>
                </div>
            </div>
        </aside>
    `;

    return element;
}



    public onMount(): void {
        this.animateProgress();
        this.chatWinLose();
        this.animateNumber('balanceValue', 500, 1000);
        this.animateNumber('levelValue', 8.97, 1000, 2);
        this.animateNumber('matchesPlayed', 8, 1000);
        this.animateNumber('friendsCount', 5, 1000);
        this.animateNumber('globalRank', 30, 1000);
        this.animateNumber('winRate', 62.5, 1000, 1);

        // Initialize friends panel
        this.setupTabFiltering();
        this.loadFriendsData('all');
    }

    // ===== FRIENDS PANEL FUNCTIONALITY =====

    private setupTabFiltering(): void {
        const buttons = document.querySelectorAll('.tab-btn');

        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const target = e.target as HTMLButtonElement;
                const category = target.dataset.category;
                
                if (category) {
                    this.switchTab(category);
                }
            });
        });
    }

    private switchTab(category: string): void {
        // Update active tab styling
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`)?.classList.add('active');

        // Load data for the selected tab
        this.currentTab = category;
        this.loadFriendsData(category);
    }

    private async loadFriendsData(category: string): Promise<void> {
        this.showFriendsLoading();

        try {
            let data: Friend[] = [];
            
            // TODO: Replace with actual API calls
            switch(category) {
                case 'all':
                    // data = await this.fetchAllFriends();
                    data = this.friendsData.all;
                    break;
                case 'online':
                    // data = await this.fetchOnlineFriends();
                    data = this.friendsData.online;
                    break;
                case 'requests':
                    // data = await this.fetchFriendRequests();
                    data = this.friendsData.requests;
                    break;
                case 'pending':
                    // data = await this.fetchFriendPending();
                    data = this.friendsData.pending;
                    break;
            }

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 300));
            
            this.renderFriends(data, category);
        } catch (error) {
            console.error('Error loading friends data:', error);
            this.showFriendsNoData();
        }
    }

    private renderFriends(friends: Friend[], category: string): void {
        const container = document.getElementById('friends-list');
        if (!container) return;
        
        if (!friends || friends.length === 0) {
            this.showFriendsNoData();
            return;
        }

        this.hideFriendsLoading();
        this.hideFriendsNoData();

        container.innerHTML = friends.map(friend => {
            return this.renderFriendItem(friend, category);
        }).join('');

        // Bind action events after rendering
        this.bindFriendActionEvents(category);
    }

    private renderFriendItem(friend: Friend, category: string): string {
        switch(category) {
            case 'requests':
                return this.renderRequestItem(friend);
            case 'online':
                return this.renderOnlineItem(friend);
            case 'pending':
                return this.renderPendingItem(friend);
            default:
                return this.renderAllItem(friend);
        }
    }

    private renderRequestItem(friend: Friend): string {
        return `
            <div class="flex items-center justify-between !py-4 rounded-xl hover:bg-[var(--light-hover)] transition !mt-3">
                <div class="flex items-center gap-3">
                    <img src="${friend.avatar}" class="w-10 h-10 rounded-full object-cover" />
                    <div class="flex flex-col">
                        <span class="text-sm font-medium">${friend.name}</span>
                        <span class="text-xs text-[var(--text-secondary)]">Sent you a request</span>
                    </div>
                </div>
                <div class="flex gap-2">
                    <button class="accept-btn text-[var(--success)] w-[30px] h-[30px] rounded-full transition-transform duration-300 hover:scale-115" data-id="${friend.id}">
                        <i class="ti ti-circle-check text-3xl"></i>
                    </button>
                    <button class="reject-btn text-[var(--danger)] w-[30px] h-[30px] transition-transform duration-300 hover:scale-115" data-id="${friend.id}">
                        <i class="ti ti-x text-3xl"></i>
                    </button>
                </div>
            </div>
        `;
    }

    private renderOnlineItem(friend: Friend): string {
        return `
            <div class="flex items-center justify-between !py-3 rounded-xl hover:bg-[var(--light-hover)] transition">
                <div class="flex items-center gap-3">
                    <img src="${friend.avatar}" class="w-10 h-10 rounded-full object-cover" />
                    <div class="flex flex-col">
                        <span class="text-sm font-medium">${friend.name}</span>
                        <span class="flex items-center justify-start gap-3">
                            <span class="block w-[8px] h-[8px] rounded-full bg-[var(--success)]"></span>
                            <span class="block text-xs text-[var(--text-secondary)] !pt-1">Online</span>
                        </span>
                    </div>
                </div>
                <button class="message-btn !mr-4 flex items-center" data-id="${friend.id}">
                    <i class="ti ti-message text-2xl"></i>
                </button>
            </div>
        `;
    }

    private renderPendingItem(friend: Friend): string {
        return `
            <div class="flex items-center justify-between !py-3 rounded-xl hover:bg-[var(--light-hover)] transition !mt-3">
                <div class="flex items-center gap-3">
                    <img src="${friend.avatar}" class="w-10 h-10 rounded-full object-cover">
                    <div>
                        <div class="font-medium text-sm">${friend.name}</div>
                        <div class="text-xs text-[var(--text-secondary)]">Request sent</div>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <span class="text-xs text-[var(--text-secondary)] opacity-70">Pending</span>
                    <button class="cancel-btn text-[var(--danger)] w-[30px] h-[30px] hover:bg-red-600 hover:bg-opacity-20 rounded-full transition" data-id="${friend.id}">
                        <i class="ti ti-x text-2xl"></i>
                    </button>
                </div>
            </div>
        `;
    }

    private renderAllItem(friend: Friend): string {
        return `
            <div class="flex items-center justify-between bg-[var(--primary)] rounded-xl !py-3 !mt-3">
                <div class="flex items-center gap-3">
                    <img src="${friend.avatar}" class="w-10 h-10 rounded-full object-cover">
                    <div>
                        <div class="font-medium text-sm">${friend.name}</div>
                        <div class="text-xs text-[var(--text-secondary)]">${friend.lastSeen}</div>
                    </div>
                </div>
                <button class="message-btn !mr-4 flex items-center" data-id="${friend.id}">
                    <i class="ti ti-message text-2xl"></i>
                </button>
            </div>
        `;
    }

    private bindFriendActionEvents(category: string): void {
        // Accept friend request
        document.querySelectorAll('.accept-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const target = e.currentTarget as HTMLButtonElement;
                const friendId = target.dataset.id;
                console.log('Accept friend request:', friendId);
                
                // TODO: Call API to accept friend request
                // await this.acceptFriendRequest(Number(friendId));
                
                // Refresh the current tab after action
                this.loadFriendsData(this.currentTab);
            });
        });

        // Reject friend request
        document.querySelectorAll('.reject-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const target = e.currentTarget as HTMLButtonElement;
                const friendId = target.dataset.id;
                console.log('Reject friend request:', friendId);
                
                // TODO: Call API to reject friend request
                // await this.rejectFriendRequest(Number(friendId));
                
                // Refresh the current tab after action
                this.loadFriendsData(this.currentTab);
            });
        });

        // Add friend
        document.querySelectorAll('.add-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const target = e.currentTarget as HTMLButtonElement;
                const friendId = target.dataset.id;
                console.log('Add friend:', friendId);
                
                // TODO: Call API to add friend
                // await this.addFriend(Number(friendId));
                
                // Refresh the current tab after action
                this.loadFriendsData(this.currentTab);
            });
        });

        // Message friend
        document.querySelectorAll('.message-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLButtonElement;
                const friendId = target.dataset.id;
                console.log('Message friend:', friendId);
                
                // TODO: Navigate to chat or open chat modal
                // this.openChat(Number(friendId));
            });
        });
    }

    // Loading and No Data states
    private showFriendsLoading(): void {
        document.getElementById('friends-loading')?.classList.remove('hidden');
        document.getElementById('friends-list')!.innerHTML = '';
        document.getElementById('friends-no-data')?.classList.add('hidden');
    }

    private hideFriendsLoading(): void {
        document.getElementById('friends-loading')?.classList.add('hidden');
    }

    private showFriendsNoData(): void {
        this.hideFriendsLoading();
        document.getElementById('friends-list')!.innerHTML = '';
        document.getElementById('friends-no-data')?.classList.remove('hidden');
    }

    private hideFriendsNoData(): void {
        document.getElementById('friends-no-data')?.classList.add('hidden');
    }


    private getStaticFriendsData(): FriendsData {
        return {
            all: [
                {
                    id: 1,
                    name: "Oussama Ettaqui",
                    avatar: "/public/assets/oettaqui.jpeg",
                    lastSeen: "Last seen 2h ago"
                },
                {
                    id: 2,
                    name: "Ahmed Hassan",
                    avatar: "/public/assets/bchokri.jpeg",
                    lastSeen: "Last seen 1d ago"
                }
            ],
            online: [
                {
                    id: 1,
                    name: "Oussama Ettaqui",
                    avatar: "/public/assets/oettaqui.jpeg",
                    status: "online"
                }
            ],
            requests: [
                {
                    id: 5,
                    name: "Badr Chokri",
                    avatar: "/public/assets/bchokri.jpeg"
                }
            ],
            pending: [
                {
                    id: 7,
                    name: "New Friend",
                    avatar: "/public/assets/yakhay.jpeg"
                }
            ]
        };
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




// TODO: Implement these API methods when backend is ready
    /*
    private async fetchAllFriends(): Promise<Friend[]> {
        const response = await fetch('/api/friends/all');
        return response.json();
    }

    private async fetchOnlineFriends(): Promise<Friend[]> {
        const response = await fetch('/api/friends/online');
        return response.json();
    }

    private async fetchFriendRequests(): Promise<Friend[]> {
        const response = await fetch('/api/friends/requests');
        return response.json();
    }

    private async fetchFriendSuggestions(): Promise<Friend[]> {
        const response = await fetch('/api/friends/suggestions');
        return response.json();
    }

    private async acceptFriendRequest(friendId: number): Promise<void> {
        await fetch(`/api/friends/requests/${friendId}/accept`, {
            method: 'POST'
        });
    }

    private async rejectFriendRequest(friendId: number): Promise<void> {
        await fetch(`/api/friends/requests/${friendId}/reject`, {
            method: 'POST'
        });
    }

    private async addFriend(friendId: number): Promise<void> {
        await fetch('/api/friends/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ friendId })
        });
    }

    private openChat(friendId: number): void {
        // Navigate to chat page or trigger chat component
        console.log('Opening chat with friend:', friendId);
    }
*/



//  <aside class="w-[15%] !m-auto overflow-y-auto overflow-x-hidden rounded-l-3xl rounded-bl-3xl bg-[var(--secondary)] !p-4 friends-and-request">
//                         <div class="flex flex-col h-full">
//                             <header class="sticky top-0 z-10 flex justify-around !py-4">
//                                 <button id="tab-all" class="tab-btn active" data-category="all">All</button>
//                                 <button id="tab-online" class="tab-btn" data-category="online">Online</button>
//                                 <button id="tab-requests" class="tab-btn" data-category="requests">Requests</button>
//                                 <button id="tab-pending" class="tab-btn" data-category="pending">Pending</button>
//                             </header>

//                             <!-- Loading state -->
//                             <div id="friends-loading" class="hidden flex justify-center items-center !py-8">
//                                 <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
//                             </div>

//                             <!-- Friends List Container -->
//                             <div id="friends-list" class="flex-1"></div>

//                             <!-- No Data State -->
//                             <div id="friends-no-data" class="hidden flex flex-col items-center justify-center text-center gap-3 bg-[var(--primary)] rounded-2xl !p-6 !mt-3">
//                                 <i class="ti ti-user-off text-4xl text-[var(--text-secondary)]"></i>
//                                 <div class="text-sm font-medium text-[var(--text-secondary)]">No data found here</div>
//                             </div>
//                         </div>
//                     </aside>