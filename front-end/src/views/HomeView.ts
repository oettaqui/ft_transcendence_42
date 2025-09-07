import { View } from "../app/View";

import { FriendsData } from "../types/FriendData";
import { Friend } from "../types/FriendData";
import { ApiService } from "../utils/ApiService";
import { User } from "../types/User";
import { toast } from "../views/ToastNotification";

export class HomeView extends View{
    private API_BASE = 'http://localhost:3000/api';
    private currentTab: string = 'all';
    private friendsData: Promise<FriendsData>;
    // private friendsData: FriendsData = { all: [], online: [], requests: [], pending: [] };
    private apiService = new ApiService(this.API_BASE);
    private user: User | null = null;

    constructor(){
        super();
        this.friendsData = this.getStaticFriendsData();
        // this.initFriendsData();
        
    }

    // private async initFriendsData(): Promise<void> {
    //     this.friendsData = await this.getStaticFriendsData();
    // }

    

    render(user: User | null): HTMLElement { 
        console.log("===========> ",this.friendsData);
        const element = document.createElement('section');
        element.classList.add('bg-[var(--primary)]');
        element.classList.add('w-full');
        element.classList.add('h-[80%]');
        element.classList.add('rounded-4xl');
        element.classList.add('!mt-16');
        element.classList.add('flex');
        element.classList.add('flex-col', 'lg:flex-row'); 
        element.classList.add('items-center', 'lg:items-stretch');
        element.classList.add('justify-between');
        element.classList.add('!gap-4', 'lg:!gap-0');
        element.classList.add('!p-2', 'lg:!p-0');
        if (user){
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
            // console.log(colorTheme);
            // console.log(this.user?.colorTheme);
    

            element.innerHTML = `
                <aside class="w-full h-full lg:w-[67%] flex flex-col  !gap-4 !py-4 lg:!pl-4">
                    <div class="relative w-full h-[40%]  ">
                        <!-- bg coalition -->
                        <div class="${bgUrl} bg-cover w-full min-h-[200px] h-auto lg:h-full rounded-2xl lg:rounded-3xl !p-4 lg:!p-8 flex flex-col justify-center !gap-6 lg:!gap-10">
                            <div class="z-[10] flex flex-col sm:flex-row justify-start items-center !gap-4 lg:!gap-8">
                                <div class="relative flex justify-center items-center w-[70px] h-[70px] sm:w-[80px] sm:h-[80px] lg:w-[110px] lg:h-[110px]">
                                    <div style="background-color: ${colorTheme}" class="absolute w-[62px] h-[62px] sm:w-[72px] sm:h-[72px] lg:w-[102px] lg:h-[102px] rounded-full"></div>
                                    <img class="w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] lg:w-[100px] lg:h-[100px] bg-contain bg-no-repeat bg-center rounded-full z-[11] flex justify-center items-center" src=${this.user?.avatar} />
                                </div>
                                <div class="flex flex-col justify-center items-center sm:items-start text-center sm:text-left">
                                    <h2 class="text-lg sm:text-xl lg:text-[28px] font-bold">${this.user?.firstName} ${this.user?.lastName}</h2>
                                    <p class="font-light text-[10px] sm:text-xs lg:text-[14px]">${this.user?.username}</p>
                                </div>
                            </div>
                            <div class="level flex flex-col sm:flex-row justify-center items-center !gap-2 lg:!gap-4">
                                <!-- Progress -->
                                <div class="text-xl sm:text-2xl lg:text-3xl font-bold">${this.user?.stats.exp}</div>
                                <div class="flex flex-col items-center sm:items-start justify-center w-full sm:w-auto">
                                    <div class="percentage text-[10px] sm:text-xs lg:text-[14px]  !mb-1" id="percentageText">22%</div>
                                    <div class="progress-bar h-[6px] sm:h-[8px] lg:h-[10px] w-full max-w-[250px] sm:max-w-[300px] md:max-w-[400px] lg:w-[600px] bg-[var(--text)] rounded-3xl relative overflow-hidden">
                                        <div class="progress-fill h-full rounded-3xl" style="background-color: ${colorTheme} !important;" id="progressFill"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="absolute top-2 right-2 sm:top-4 sm:right-4 lg:top-[90px] lg:right-[100px] w-auto lg:w-[100px] h-[25px] sm:h-[30px] lg:h-[35px] rounded-lg lg:rounded-3xl flex justify-center items-center">
                            <div class="">
                                <span style="background-color: ${colorTheme}" class="!px-2 lg:!px-4 !py-1 lg:!py-2 rounded-lg lg:rounded-xl  font-bold text-[8px] sm:text-[10px] lg:text-[12px]">${this.user?.coalition}</span>
                            </div>
                        </div>
                    </div>   
                    
                    <div class="w-full h-[100%]  rounded-2xl lg:rounded-3xl bg-[var(--secondary)] flex flex-col lg:flex-row justify-center items-center !gap-4 lg:!gap-0 !p-4 lg:!p-0">
                        <div  style="border-color: ${colorTheme}" class="border  rounded-2xl flex flex-col lg:flex-row justify-between items-center w-full lg:w-[50%] !px-3 lg:!px-4 !py-4 lg:!py-6 lg:!ml-15 !gap-2">
                            <canvas id="donutChart" width="200" height="200" class="sm:w-[180px] sm:h-[180px] lg:w-[200px] lg:h-[200px]"></canvas>
                            <div class="flex flex-row lg:flex-col !gap-3 text-center lg:text-left">
                                <div class="flex flex-col">
                                    <div class="text-xs lg:text-sm">Your Balance</div> 
                                    <div style="color: ${colorTheme}" id="balanceValue" class="text-lg lg:text-2xl"></div> 
                                </div>
                                <div class="flex flex-col">
                                    <div class="text-xs lg:text-sm">Your Level</div> 
                                    <div style="color: ${colorTheme}" id="levelValue" class="text-lg lg:text-2xl"></div> 
                                </div>
                            </div>
                        </div>
                        
                        <div class="flex flex-col !gap-2 lg:!mr-10 !p-2 lg:!p-4 w-full lg:w-auto">
                            <div class="grid grid-cols-2 lg:flex lg:justify-center lg:items-center !gap-2">
                                <div style="border-color: ${colorTheme}" class="border rounded-2xl w-full sm:w-[120px] lg:w-[140px] h-[100px] lg:h-[125px] flex flex-col justify-center items-center !gap-2 transition-transform duration-300 hover:scale-[1.02]">
                                    <div class="opacity-[0.7] text-[11px] lg:text-[14px] text-center">Matches Played</div>
                                    <div style="color: ${colorTheme}" id="matchesPlayed" class="text-lg lg:text-2xl"></div>
                                </div>
                                <div style="border-color: ${colorTheme}" class="border rounded-2xl w-full sm:w-[120px] lg:w-[140px] h-[100px] lg:h-[125px] flex flex-col justify-center items-center !gap-2 transition-transform duration-300 hover:scale-[1.02]">
                                    <div class="opacity-[0.7] text-[11px] lg:text-[14px] text-center">Friends Count</div>
                                    <div style="color: ${colorTheme}" id="friendsCount" class="text-lg lg:text-2xl"></div>
                                </div>
                            </div>
                            <div class="grid grid-cols-2 lg:flex lg:justify-center lg:items-center !gap-2">
                                <div style="border-color: ${colorTheme}" class="border rounded-2xl w-full sm:w-[120px] lg:w-[140px] h-[100px] lg:h-[125px] flex flex-col justify-center items-center !gap-2 transition-transform duration-300 hover:scale-[1.02]">
                                    <div class="opacity-[0.7] text-[11px] lg:text-[14px] text-center">Global Rank</div>
                                    <div style="color: ${colorTheme}" id="globalRank" class="text-lg lg:text-2xl"></div>
                                </div>
                                <div style="border-color: ${colorTheme}" class="border rounded-2xl w-full sm:w-[120px] lg:w-[140px] h-[100px] lg:h-[125px] flex flex-col justify-center items-center !gap-2 transition-transform duration-300 hover:scale-[1.02]">
                                    <div class="opacity-[0.7] text-[11px] lg:text-[14px] text-center">Win Rate</div>
                                    <div style="color: ${colorTheme}" id="winRate" class=" text-lg lg:text-2xl"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
                
                <aside class="w-full lg:w-[30%]  overflow-y-auto overflow-x-hidden rounded-2xl lg:rounded-3xl bg-[var(--secondary)] !p-2 friends-and-request !mr-0 lg:!mr-4 !my-2 lg:!my-4">
                    <div class="flex flex-col h-full">
                        <header class="sticky top-0 z-10 flex justify-between !py-2 bg-[var(--secondary)] rounded-t-2xl lg:rounded-t-3xl">
                            <button id="tab-all" class="tab-btn active !text-[10px] lg:!text-xs !px-2 !py-1" data-category="all">All</button>
                            <button id="tab-online" class="tab-btn !text-[10px] lg:!text-xs !px-2 !py-1" data-category="online">Online</button>
                            <button id="tab-requests" class="tab-btn !text-[10px] lg:!text-xs !px-2 !py-1" data-category="requests">Requests</button>
                            <button id="tab-pending" class="tab-btn !text-[10px] lg:!text-xs !px-2 !py-1" data-category="pending">Pending</button>
                        </header>

                        <!-- Loading state -->
                        <div id="friends-loading" class="hidden flex justify-center items-center !py-4">
                            <div class="animate-spin rounded-full h-5 w-5 lg:h-6 lg:w-6 xl:h-8 xl:w-8 border-b-2 border-white"></div>
                        </div>

                        <!-- Friends List Container -->
                        <div id="friends-list" class="flex-1 !py-2"></div>

                        <!-- No Data State -->
                        <div id="friends-no-data" class="hidden flex flex-col items-center justify-center text-center !gap-2 lg:!gap-3 bg-[var(--primary)] rounded-2xl !p-4 lg:!p-6 !mt-2 lg:!mt-3">
                            <i class="ti ti-user-off text-xl lg:text-2xl text-[var(--text-secondary)]"></i>
                            <div class="text-[10px] lg:text-xs font-medium text-[var(--text-secondary)]">No data found here</div>
                        </div>
                    </div>
                </aside>
            `;

        }
        return element;
    }



    public onMount(): void {
        if (this.user){

            this.animateProgress();
            this.chatWinLose();
            this.animateNumber('balanceValue', this.user?.stats.coins, 1000);
            this.animateNumber('levelValue', this.user?.stats.exp, 1000, 2);
            this.animateNumber('matchesPlayed', this.user?.stats.gamesPlayed, 1000);
            this.animateNumber('friendsCount', 5, 1000);
            this.animateNumber('globalRank', this.user?.stats.userRank, 1000);
            this.animateNumber('winRate', this.user?.stats.winRate, 1000, 1);
    
           
            this.setupTabFiltering();
            this.loadFriendsData('all');
        }
       
    }

    

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
        
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`)?.classList.add('active');

        
        this.currentTab = category;
        this.loadFriendsData(category);
    }

    // private async loadFriendsData(category: string): Promise<void> {
    //     this.showFriendsLoading();

    //     try {
    //         let data: Friend[] = [];
            
            
    //         switch(category) {
    //             case 'all':
                    
    //                 data = this.friendsData.all;
    //                 console.log(data);
    //                 break;
    //             case 'online':
                    
    //                 data = this.friendsData.online;
    //                 break;
    //             case 'requests':
                   
    //                 data = this.friendsData.requests;
    //                 break;
    //             case 'pending':
                    
    //                 data = this.friendsData.pending;
    //                 break;
    //         }

            
    //         await new Promise(resolve => setTimeout(resolve, 300));
            
    //         this.renderFriends(data, category);
    //     } catch (error) {
    //         console.error('Error loading friends data:', error);
    //         this.showFriendsNoData();
    //     }
    // }

    private async loadFriendsData(category: string): Promise<void> {
        this.showFriendsLoading();

        try {
            const resolvedData = await this.friendsData;
            let data: Friend[] = [];

            switch (category) {
            case 'all':
                data = resolvedData.all;
                break;
            case 'online':
                data = resolvedData.online;
                break;
            case 'requests':
                data = resolvedData.requests;
                break;
            case 'pending':
                data = resolvedData.pending;
                break;
            }

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

        
        this.bindFriendActionEvents(category);
    }

    private renderFriendItem(friend: Friend, category: string): string {
        if (!friend) return '';
        if (!friend.avatar){
            friend.avatar = "../../public/assets/default.jpg";
        }
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
                        <span class="text-sm font-medium">${friend.username} </span>
                        <span class="text-xs text-[var(--text-secondary)]">Sent you a request</span>
                    </div>
                </div>
                <div class="flex gap-2">
                    <button class="accept-btn text-[var(--success)] w-[30px] h-[30px] rounded-full transition-transform duration-300 hover:scale-115" data-id="${friend.id}">
                        <i class="ti ti-circle-check text-3xl"></i>
                    </button>
                    <button class="decline-btn text-[var(--danger)] w-[30px] h-[30px] transition-transform duration-300 hover:scale-115" data-id="${friend.id}">
                        <i class="ti ti-x text-3xl"></i>
                    </button>
                </div>
            </div>
        `;
    }

    private renderOnlineItem(friend: Friend): string {
        return `
            <div class="flex items-center justify-between !py-4 rounded-xl hover:bg-[var(--light-hover)] transition !mt-3">
                <div class="flex items-center gap-3">
                    <img src="${friend.avatar}" class="w-10 h-10 rounded-full object-cover" />
                    <div class="flex flex-col">
                        <span class="text-sm font-medium">${friend.username}</span>
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
            <div class="flex items-center justify-between !py-3 !px-2 rounded-xl hover:bg-[var(--light-hover)] transition !mt-3">
                <div class="flex items-center gap-3">
                    <img src="${friend.avatar}" class="w-10 h-10 rounded-full object-cover">
                    <div>
                        <div class="font-medium text-sm">${friend.username}</div>
                        <div class="text-xs text-[var(--text-secondary)]">Request sent</div>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <span class="text-xs text-[var(--text-secondary)] opacity-70">Pending</span>
                    <button class="cancel-btn text-[var(--danger)] w-[30px] h-[30px] transition-transform duration-300 hover:scale-115" data-id="${friend.id}">
                        <i class="ti ti-x text-3xl"></i>
                    </button>
                </div>
            </div>
        `;
    }

    private renderAllItem(friend: Friend): string {
        return `
            <div class="flex items-center justify-between bg-[var(--primary)] rounded-xl !py-3 !mt-3">
                <div class="flex items-center gap-3 !px-2">
                    <img src="${friend.avatar}" class="w-10 h-10 rounded-full object-cover">
                    <div>
                        <div class="font-medium text-sm">${friend.username}</div>
                        <!-- <div class="text-xs text-[var(--text-secondary)]">${friend.lastLogin}</div> -->
                    </div>
                </div>
                <button class="message-btn !mr-4 flex items-center" data-id="${friend.id}">
                    <i class="ti ti-message text-2xl"></i>
                </button>
            </div>
        `;
    }

    


    private bindFriendActionEvents(category: string): void {
    
        document.querySelectorAll('.accept-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const target = e.currentTarget as HTMLButtonElement;
                const friendId = target.dataset.id;
                if (!friendId) return;

                try {
                    const response = await this.apiService.post('/friends/accept', { friendId: parseInt(friendId, 10) });
                    const result = await response.json();

                    if (response.ok) {
                        toast.show(result.data.message, { type: 'success' });
                        this.loadFriendsData("all");
                    } else {
                        toast.show(result.error || 'Could not accept request.', { type: 'error' });
                    }
                } catch (error) {
                    console.error('Failed to accept friend request:', error);
                    toast.show('An unexpected network error occurred.', { type: 'error' });
                }
            });
        });

        document.querySelectorAll('.decline-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const target = e.currentTarget as HTMLButtonElement;
                const friendId = target.dataset.id;
                if (!friendId) return;

                try {
                    const response = await this.apiService.post('/friends/decline', { friendId: parseInt(friendId, 10) });
                    
                    if (response.ok) {
                        toast.show('Request declined.', { type: 'success' });
                        this.loadFriendsData("requests");
                    } else {
                        const errorData = await response.json();
                        toast.show(errorData.error || 'Could not decline request.', { type: 'error' });
                    }
                } catch (error) {
                    console.error('Failed to decline friend request:', error);
                    toast.show('An unexpected network error occurred.', { type: 'error' });
                }
            });
        });

        document.querySelectorAll('.cancel-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const target = e.currentTarget as HTMLButtonElement;
                const friendId = target.dataset.id;
                if (!friendId) return;

                try {
                    const response = await this.apiService.delete(`/friends/request/${friendId}`);
                    
                    if (response.ok) {
                        toast.show('Request cancelled.', { type: 'success' });
                        this.loadFriendsData("pending");
                    } else {
                        const errorData = await response.json();
                        toast.show(errorData.error || 'Could not cancel request.', { type: 'error' });
                    }
                } catch (error) {
                    console.error('Failed to cancel friend request:', error);
                    toast.show('An unexpected network error occurred.', { type: 'error' });
                }
            });
        });

        
        document.querySelectorAll('.message-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLButtonElement;
                const friendId = target.dataset.id;
                console.log('Message friend:', friendId);
                
            });
        });
    }

   
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


    private async getStaticFriendsData(): Promise<FriendsData> {
        return {
            all: await this.getAllFriends(),
            online: await this.getOnlineFriends(),
            requests: await this.getRequests(),
            pending: await this.getPanding()
            // all: [
            //     {
            //         id: 1,
            //         name: "Oussama Ettaqui",
            //         avatar: "/public/assets/oettaqui.jpeg",
            //         lastSeen: "Last seen 2h ago"
            //     },
            //     {
            //         id: 2,
            //         name: "Ahmed Hassan",
            //         avatar: "/public/assets/bchokri.jpeg",
            //         lastSeen: "Last seen 1d ago"
            //     }
            // ],
            // online: [
            //     {
            //         id: 1,
            //         name: "Oussama Ettaqui",
            //         avatar: "/public/assets/oettaqui.jpeg",
            //         status: "online"
            //     }
            // ],
            // requests: [
            //     {
            //         id: 5,
            //         name: "Badr Chokri",
            //         avatar: "/public/assets/bchokri.jpeg"
            //     }
            // ],
            // pending: [
            //     {
            //         id: 7,
            //         name: "New Friend",
            //         avatar: "/public/assets/yakhay.jpeg"
            //     }
            // ]
        };
    }
    private async getOnlineFriends(): Promise<Friend[]> {
    try {
        const allFriends = await this.getAllFriends();
        
        const onlineFriends = allFriends.filter(friend => friend.isOnline === true);

        console.log('Fetched online friends:', onlineFriends);
        return onlineFriends;
    } catch (error) {
        console.error('Error fetching online friends:', error);
        return [];
    }
}
    private async getAllFriends(): Promise<Friend[]> {
        try {
            const response = await this.apiService.get<Friend[]>('/friends');
            console.log('Fetched all friends:', response.data?.friends);
            return response.data?.friends;
        } catch (error) {
            console.error('Error fetching friends:', error);
            return [];
        }
    }

    private async getPanding(): Promise<Friend[]> {
        try {
            const response = await this.apiService.get<Friend[]>('/friends/requests/sent');
            console.log('Fetched friends Panding:', response.data?.requests || []);
            return response.data?.requests ;
        } catch (error) {
            console.error('Error fetching friends:', error);
            return [];
        }
    }
    private async getRequests(): Promise<Friend[]> {
        try {
            const response = await this.apiService.get<Friend[]>('/friends/requests/pending');
            console.log('Fetched friends request:', response.data?.requests || []);
            return response.data?.requests || [];
        } catch (error) {
            console.error('Error fetching request:', error);
            return [];
        }
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
        { label: 'Win', value: this.user?.stats.gamesWon, color: this.user?.colorTheme },
        { label: 'Lose', value: this.user?.stats.gamesLost, color: '#ffffff' }
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

        ctx.beginPath();
        ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
        ctx.fillStyle = '#3e3e3e';
        ctx.fill();

        
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Orbitron';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`Win: ${this.user?.stats.gamesWon}`, centerX, centerY - 12);
        ctx.fillText(`Lose: ${this.user?.stats.gamesLost}`, centerX, centerY + 12);

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


