// // types/UserData.ts
// export interface User {
//   id: number;
//   username: string;
//   displayName: string;
//   avatar: string;
//   level: number;
//   experience: number;
//   balance: number;
//   coalition?: string;
//   stats: UserStats;
//   rank: UserRank;
// }

// export interface UserStats {
//   matchesPlayed: number;
//   wins: number;
//   losses: number;
//   winRate: number;
//   friendsCount: number;
// }

// export interface UserRank {
//   global: number;
//   coalition?: number;
// }

// export interface ApiResponse<T> {
//   success: boolean;
//   data: T;
//   message?: string;
//   error?: string;
// }

// // services/UserService.ts
// export class UserService {
//   private static instance: UserService;
//   private baseUrl: string;
//   private currentUser: User | null = null;
//   private isLoading: boolean = false;
//   private cache: Map<string, { data: any; timestamp: number }> = new Map();
//   private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

//   private constructor(baseUrl: string = '/api') {
//     this.baseUrl = baseUrl;
//   }

//   // Singleton pattern for global access
//   public static getInstance(baseUrl?: string): UserService {
//     if (!UserService.instance) {
//       UserService.instance = new UserService(baseUrl);
//     }
//     return UserService.instance;
//   }

//   // Private method to handle HTTP requests with proper error handling
//   private async makeRequest<T>(
//     endpoint: string, 
//     options: RequestInit = {}
//   ): Promise<ApiResponse<T>> {
//     try {
//       const token = this.getAuthToken();
      
//       const config: RequestInit = {
//         headers: {
//           'Content-Type': 'application/json',
//           ...(token && { 'Authorization': `Bearer ${token}` }),
//           ...options.headers,
//         },
//         ...options,
//       };

//       const response = await fetch(`${this.baseUrl}${endpoint}`, config);
      
//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//       }

//       const data = await response.json();
      
//       return {
//         success: true,
//         data,
//       };
//     } catch (error) {
//       console.error(`API Error on ${endpoint}:`, error);
      
//       return {
//         success: false,
//         data: null as any,
//         error: error instanceof Error ? error.message : 'Unknown error occurred',
//       };
//     }
//   }

//   // Get authentication token (implement based on your auth system)
//   private getAuthToken(): string | null {
//     // TODO: Implement based on your authentication system
//     // Examples:
//     // return localStorage.getItem('auth_token');
//     // return sessionStorage.getItem('jwt_token');
//     // return document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || null;
    
//     // For now, returning null - you'll need to implement this
//     return null;
//   }

//   // Cache management
//   private isCacheValid(key: string): boolean {
//     const cached = this.cache.get(key);
//     if (!cached) return false;
    
//     return Date.now() - cached.timestamp < this.CACHE_DURATION;
//   }

//   private getCachedData<T>(key: string): T | null {
//     if (this.isCacheValid(key)) {
//       return this.cache.get(key)?.data || null;
//     }
//     return null;
//   }

//   private setCachedData(key: string, data: any): void {
//     this.cache.set(key, {
//       data,
//       timestamp: Date.now(),
//     });
//   }

//   // Main method to fetch current user
//   public async getCurrentUser(forceRefresh: boolean = false): Promise<User | null> {
//     const cacheKey = 'current_user';
    
//     // Return cached data if available and not forcing refresh
//     if (!forceRefresh) {
//       const cached = this.getCachedData<User>(cacheKey);
//       if (cached) {
//         this.currentUser = cached;
//         return cached;
//       }
//     }

//     // Prevent multiple concurrent requests
//     if (this.isLoading) {
//       // Wait for the current request to complete
//       return new Promise((resolve) => {
//         const checkLoading = () => {
//           if (!this.isLoading) {
//             resolve(this.currentUser);
//           } else {
//             setTimeout(checkLoading, 100);
//           }
//         };
//         checkLoading();
//       });
//     }

//     this.isLoading = true;

//     try {
//       const response = await this.makeRequest<User>('/me');
      
//       if (response.success && response.data) {
//         this.currentUser = response.data;
//         this.setCachedData(cacheKey, response.data);
//         return response.data;
//       } else {
//         console.error('Failed to fetch current user:', response.error);
//         return null;
//       }
//     } catch (error) {
//       console.error('Unexpected error fetching current user:', error);
//       return null;
//     } finally {
//       this.isLoading = false;
//     }
//   }

//   // Get current user synchronously (returns cached data or null)
//   public getCurrentUserSync(): User | null {
//     return this.currentUser;
//   }

//   // Check if user is currently loading
//   public isUserLoading(): boolean {
//     return this.isLoading;
//   }

//   // Update user data (for when user stats change)
//   public updateCurrentUser(updates: Partial<User>): void {
//     if (this.currentUser) {
//       this.currentUser = { ...this.currentUser, ...updates };
//       this.setCachedData('current_user', this.currentUser);
//     }
//   }

//   // Clear user data (for logout)
//   public clearCurrentUser(): void {
//     this.currentUser = null;
//     this.cache.clear();
//   }

//   // Additional utility methods
//   public async refreshUserStats(): Promise<UserStats | null> {
//     const user = await this.getCurrentUser(true);
//     return user?.stats || null;
//   }

//   // Method to update specific user stats without full reload
//   public async updateUserStats(newStats: Partial<UserStats>): Promise<boolean> {
//     if (!this.currentUser) return false;

//     try {
//       const response = await this.makeRequest<UserStats>('/me/stats', {
//         method: 'PATCH',
//         body: JSON.stringify(newStats),
//       });

//       if (response.success) {
//         this.currentUser.stats = { ...this.currentUser.stats, ...response.data };
//         this.setCachedData('current_user', this.currentUser);
//         return true;
//       }
//       return false;
//     } catch {
//       return false;
//     }
//   }
// }

// // utils/UserHelpers.ts - Utility functions for user data
// export class UserHelpers {
//   static calculateWinRate(wins: number, losses: number): number {
//     const total = wins + losses;
//     return total > 0 ? Math.round((wins / total) * 100) : 0;
//   }

//   static formatLevel(level: number): string {
//     return level.toFixed(2);
//   }

//   static getProgressPercentage(experience: number): number {
//     // Assuming each level needs 1000 XP, adjust based on your game logic
//     return Math.round((experience % 1000) / 10);
//   }

//   static formatBalance(balance: number): string {
//     return balance.toLocaleString();
//   }

//   static getCoalitionBadgeClass(coalition?: string): string {
//     // Return appropriate CSS class based on coalition
//     switch (coalition?.toLowerCase()) {
//       case 'freax':
//         return 'bg-[var(--freax)]';
//       case 'assembly':
//         return 'bg-[var(--assembly)]';
//       case 'order':
//         return 'bg-[var(--order)]';
//       case 'federation':
//         return 'bg-[var(--federation)]';
//       default:
//         return 'bg-[var(--accent)]';
//     }
//   }
// }






// ============================================================================================================================





// import { View } from "../app/View";
// import { FriendsData } from "../types/FriendData";
// import { Friend } from "../types/FriendData";
// import { User } from "../types/UserData";
// import { UserService } from "../services/UserService";
// import { UserHelpers } from "../utils/UserHelpers";

// export class HomeView extends View {
//     private currentTab: string = 'all';
//     private friendsData: FriendsData;
//     private userService: UserService;
//     private currentUser: User | null = null;
//     private isLoadingUser: boolean = false;

//     constructor() {
//         super();
//         // Initialize user service
//         this.userService = UserService.getInstance();
        
//         // Initialize with static data - replace with API calls later
//         this.friendsData = this.getStaticFriendsData();
//     }

//     render(): HTMLElement {
//         const element = document.createElement('section');
//         element.classList.add('bg-[var(--primary)]');
//         element.classList.add('w-[100%]');
//         element.classList.add('h-[100%]');
//         element.classList.add('rounded-4xl');
//         element.classList.add('!mt-[24px]');
//         element.classList.add('flex');
//         element.classList.add('items-center');
        
//         element.innerHTML = `
//             <aside class="flex flex-col justify-between w-[70%] h-[95%] gap-10 !m-auto">
//                 <div class="w-full h-[70%] relative">
//                     <!-- User Profile Section -->
//                     <div class="bg-[url(/public/assets/Freax_BG.jpg)] bg-cover w-full h-full rounded-3xl !p-4 !pl-10 flex flex-col justify-center gap-10">
                        
//                         <!-- Loading State for User Profile -->
//                         <div id="user-loading" class="hidden flex justify-center items-center h-full">
//                             <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
//                         </div>
                        
//                         <!-- User Profile Content -->
//                         <div id="user-profile" class="z-[10] flex justify-start items-center gap-8">
//                             <div class="relative flex justify-center items-center w-[110px] h-[110px]">
//                                 <div class="absolute w-[102px] h-[102px] bg-[var(--accent)] rounded-full"></div>
//                                 <img id="user-avatar" class="w-[100px] h-[100px] bg-contain bg-no-repeat bg-center rounded-full z-[11] flex justify-center items-center" src="/public/assets/default-avatar.png" />
//                             </div>
//                             <div class="flex flex-col justify-center items-start">
//                                 <h2 id="user-display-name" class="text-[28px] font-bold">Loading...</h2>
//                                 <p id="user-username" class="font-light text-[14px]">@username</p>
//                             </div>
//                         </div>
                        
//                         <!-- Progress Section -->
//                         <div class="level flex justify-center items-center gap-4">
//                             <div id="user-level" class="text-3xl font-bold">00</div>
//                             <div class="flex flex-col items-start justify-center !mb-8">
//                                 <div class="percentage text-[14px]" id="percentageText">0%</div>
//                                 <div class="progress-bar h-[10px] w-[600px] bg-[var(--text)] rounded-3xl relative overflow-hidden">
//                                     <div class="progress-fill h-full rounded-3xl" id="progressFill"></div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
                    
//                     <!-- Coalition Badge -->
//                     <div class="absolute top-[90px] right-[100px] w-[100px] h-[35px] rounded-3xl flex justify-center items-center">
//                         <div id="coalition-badge" class="hidden">
//                             <span id="coalition-text" class="!px-4 !py-2 rounded-xl font-bold text-[12px]">Coalition</span>
//                         </div>
//                     </div>
//                 </div>   
                
//                 <!-- Stats Section -->
//                 <div class="w-[100%] h-[100%] rounded-3xl bg-[var(--secondary)] flex justify-center items-center gap-16">
//                     <div class="border border-[var(--accent)] rounded-3xl flex justify-between items-center w-[50%] !pr-8 !ml-6">
//                         <canvas id="donutChart" width="300" height="300"></canvas>
//                         <div class="flex flex-col gap-6">
//                             <div class="flex flex-col">
//                                 <div>Your Balance</div> 
//                                 <div id="balanceValue" class="text-[var(--accent)] text-2xl">0</div> 
//                             </div>
//                             <div class="flex flex-col">
//                                 <div>Your Level</div> 
//                                 <div id="levelValue" class="text-[var(--accent)] text-2xl">0.00</div> 
//                             </div>
//                         </div>
//                     </div>
                    
//                     <div class="flex flex-col gap-10 !mr-8">
//                         <div class="flex justify-center items-center gap-8">
//                             <div class="border border-[var(--accent)] rounded-2xl w-[200px] h-[125px] flex flex-col justify-center items-center gap-2 transition-transform duration-300 hover:scale-[1.03]">
//                                 <div class="opacity-[0.7]">Matches Played</div>
//                                 <div id="matchesPlayed" class="text-[var(--accent)] text-2xl">0</div>
//                             </div>
//                             <div class="border border-[var(--accent)] rounded-2xl w-[200px] h-[125px] flex flex-col justify-center items-center gap-2 transition-transform duration-300 hover:scale-[1.03]">
//                                 <div class="opacity-[0.7]">Friends Count</div>
//                                 <div id="friendsCount" class="text-[var(--accent)] text-2xl">0</div>
//                             </div>
//                         </div>
//                         <div class="flex justify-center items-center gap-8">
//                             <div class="border border-[var(--accent)] rounded-2xl w-[200px] h-[125px] flex flex-col justify-center items-center gap-2 transition-transform duration-300 hover:scale-[1.03]">
//                                 <div class="opacity-[0.7]">Global Rank</div>
//                                 <div id="globalRank" class="text-[var(--accent)] text-2xl">0</div>
//                             </div>
//                             <div class="border border-[var(--accent)] rounded-2xl w-[200px] h-[125px] flex flex-col justify-center items-center gap-2 transition-transform duration-300 hover:scale-[1.03]">
//                                 <div class="opacity-[0.7]">Win Rate</div>
//                                 <div id="winRate" class="text-[var(--accent)] text-2xl">0%</div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </aside>

//             <aside class="w-[25%] h-[95%] !m-auto overflow-y-auto overflow-x-hidden rounded-l-3xl rounded-bl-3xl bg-[var(--secondary)] !p-4 friends-and-request">
//                 <div class="flex flex-col h-full">
//                     <header class="sticky top-0 z-10 flex justify-around !py-4">
//                         <button id="tab-all" class="tab-btn active" data-category="all">All</button>
//                         <button id="tab-online" class="tab-btn" data-category="online">Online</button>
//                         <button id="tab-requests" class="tab-btn" data-category="requests">Requests</button>
//                         <button id="tab-pending" class="tab-btn" data-category="pending">Pending</button>
//                     </header>

//                     <!-- Loading state -->
//                     <div id="friends-loading" class="hidden flex justify-center items-center !py-8">
//                         <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
//                     </div>

//                     <!-- Friends List Container -->
//                     <div id="friends-list" class="flex-1"></div>

//                     <!-- No Data State -->
//                     <div id="friends-no-data" class="hidden flex flex-col items-center justify-center text-center gap-3 bg-[var(--primary)] rounded-2xl !p-6 !mt-3">
//                         <i class="ti ti-user-off text-4xl text-[var(--text-secondary)]"></i>
//                         <div class="text-sm font-medium text-[var(--text-secondary)]">No data found here</div>
//                     </div>
//                 </div>
//             </aside>
//         `;

//         return element;
//     }

//     public async onMount(): Promise<void> {
//         // Load user data first
//         await this.loadUserData();
        
//         // Initialize friends panel
//         this.setupTabFiltering();
//         this.loadFriendsData('all');
//     }

//     // ===== USER DATA FUNCTIONALITY =====

//     private async loadUserData(): Promise<void> {
//         this.showUserLoading();
        
//         try {
//             this.currentUser = await this.userService.getCurrentUser();
            
//             if (this.currentUser) {
//                 this.renderUserProfile(this.currentUser);
//                 this.animateUserStats(this.currentUser);
//             } else {
//                 console.error('Failed to load user data');
//                 this.showUserError();
//             }
//         } catch (error) {
//             console.error('Error loading user data:', error);
//             this.showUserError();
//         } finally {
//             this.hideUserLoading();
//         }
//     }

//     private renderUserProfile(user: User): void {
//         // Update user profile elements
//         const avatarEl = document.getElementById('user-avatar') as HTMLImageElement;
//         const displayNameEl = document.getElementById('user-display-name');
//         const usernameEl = document.getElementById('user-username');
        
//         if (avatarEl) avatarEl.src = user.avatar || '/public/assets/default-avatar.png';
//         if (displayNameEl) displayNameEl.textContent = user.displayName;
//         if (usernameEl) usernameEl.textContent = `@${user.username}`;

//         // Update coalition badge if present
//         if (user.coalition) {
//             const coalitionBadgeEl = document.getElementById('coalition-badge');
//             const coalitionTextEl = document.getElementById('coalition-text');
            
//             if (coalitionBadgeEl && coalitionTextEl) {
//                 coalitionTextEl.textContent = user.coalition;
//                 coalitionTextEl.className = `!px-4 !py-2 rounded-xl font-bold text-[12px] ${UserHelpers.getCoalitionBadgeClass(user.coalition)}`;
//                 coalitionBadgeEl.classList.remove('hidden');
//             }
//         }

//         // Update progress percentage
//         const progressPercentage = UserHelpers.getProgressPercentage(user.experience);
//         const percentageEl = document.getElementById('percentageText');
//         if (percentageEl) {
//             percentageEl.textContent = `${progressPercentage}%`;
//         }
//     }

//     private animateUserStats(user: User): void {
//         // Animate progress bar
//         this.animateProgress(UserHelpers.getProgressPercentage(user.experience));
        
//         // Animate win/lose chart
//         this.chatWinLose(user.stats.wins, user.stats.losses);
        
//         // Animate numbers
//         this.animateNumber('balanceValue', user.balance, 1000, 0, UserHelpers.formatBalance(user.balance));
//         this.animateNumber('levelValue', user.level, 1000, 2, UserHelpers.formatLevel(user.level));
//         this.animateNumber('matchesPlayed', user.stats.matchesPlayed, 1000);
//         this.animateNumber('friendsCount', user.stats.friendsCount, 1000);
//         this.animateNumber('globalRank', user.rank.global, 1000);
//         this.animateNumber('winRate', user.stats.winRate, 1000, 1, `${user.stats.winRate}%`);
        
//         // Update level display
//         document.getElementById('user-level')!.textContent = Math.floor(user.level).toString().padStart(2, '0');
//     }

//     private showUserLoading(): void {
//         document.getElementById('user-loading')?.classList.remove('hidden');
//         document.getElementById('user-profile')?.classList.add('hidden');
//     }

//     private hideUserLoading(): void {
//         document.getElementById('user-loading')?.classList.add('hidden');
//         document.getElementById('user-profile')?.classList.remove('hidden');
//     }

//     private showUserError(): void {
//         // Fallback to default/static data
//         const displayNameEl = document.getElementById('user-display-name');
//         const usernameEl = document.getElementById('user-username');
        
//         if (displayNameEl) displayNameEl.textContent = 'Error Loading';
//         if (usernameEl) usernameEl.textContent = '@error';
        
//         // Still animate with fallback data
//         this.animateProgress();
//         this.chatWinLose();
//         this.animateNumber('balanceValue', 500, 1000);
//         this.animateNumber('levelValue', 8.97, 1000, 2);
//         this.animateNumber('matchesPlayed', 8, 1000);
//         this.animateNumber('friendsCount', 5, 1000);
//         this.animateNumber('globalRank', 30, 1000);
//         this.animateNumber('winRate', 62.5, 1000, 1);
//     }

//     // ===== FRIENDS PANEL FUNCTIONALITY (unchanged) =====
    
//     private setupTabFiltering(): void {
//         const buttons = document.querySelectorAll('.tab-btn');

//         buttons.forEach(button => {
//             button.addEventListener('click', (e) => {
//                 const target = e.target as HTMLButtonElement;
//                 const category = target.dataset.category;
                
//                 if (category) {
//                     this.switchTab(category);
//                 }
//             });
//         });
//     }

//     private switchTab(category: string): void {
//         document.querySelectorAll('.tab-btn').forEach(btn => {
//             btn.classList.remove('active');
//         });
//         document.querySelector(`[data-category="${category}"]`)?.classList.add('active');

//         this.currentTab = category;
//         this.loadFriendsData(category);
//     }

//     private async loadFriendsData(category: string): Promise<void> {
//         this.showFriendsLoading();

//         try {
//             let data: Friend[] = [];
            
//             switch(category) {
//                 case 'all':
//                     data = this.friendsData.all;
//                     break;
//                 case 'online':
//                     data = this.friendsData.online;
//                     break;
//                 case 'requests':
//                     data = this.friendsData.requests;
//                     break;
//                 case 'pending':
//                     data = this.friendsData.pending;
//                     break;
//             }

//             await new Promise(resolve => setTimeout(resolve, 300));
            
//             this.renderFriends(data, category);
//         } catch (error) {
//             console.error('Error loading friends data:', error);
//             this.showFriendsNoData();
//         }
//     }

//     private renderFriends(friends: Friend[], category: string): void {
//         const container = document.getElementById('friends-list');
//         if (!container) return;
        
//         if (!friends || friends.length === 0) {
//             this.showFriendsNoData();
//             return;
//         }

//         this.hideFriendsLoading();
//         this.hideFriendsNoData();

//         container.innerHTML = friends.map(friend => {
//             return this.renderFriendItem(friend, category);
//         }).join('');

//         this.bindFriendActionEvents(category);
//     }

//     private renderFriendItem(friend: Friend, category: string): string {
//         switch(category) {
//             case 'requests':
//                 return this.renderRequestItem(friend);
//             case 'online':
//                 return this.renderOnlineItem(friend);
//             case 'pending':
//                 return this.renderPendingItem(friend);
//             default:
//                 return this.renderAllItem(friend);
//         }
//     }

//     private renderRequestItem(friend: Friend): string {
//         return `
//             <div class="flex items-center justify-between !p-3 rounded-xl hover:bg-[var(--light-hover)] transition !mt-3">
//                 <div class="flex items-center gap-3">
//                     <img src="${friend.avatar}" class="w-10 h-10 rounded-full object-cover" />
//                     <div class="flex flex-col">
//                         <span class="text-sm font-medium">${friend.name}</span>
//                         <span class="text-xs text-[var(--text-secondary)]">Sent you a request</span>
//                     </div>
//                 </div>
//                 <div class="flex gap-2">
//                     <button class="accept-btn text-[var(--success)] w-[30px] h-[30px] rounded-full transition-transform duration-300 hover:scale-115" data-id="${friend.id}">
//                         <i class="ti ti-circle-check text-3xl"></i>
//                     </button>
//                     <button class="reject-btn text-[var(--danger)] w-[30px] h-[30px] transition-transform duration-300 hover:scale-115" data-id="${friend.id}">
//                         <i class="ti ti-x text-3xl"></i>
//                     </button>
//                 </div>
//             </div>
//         `;
//     }

//     private renderOnlineItem(friend: Friend): string {
//         return `
//             <div class="flex items-center justify-between !p-3 rounded-xl hover:bg-[var(--light-hover)] transition">
//                 <div class="flex items-center gap-3">
//                     <img src="${friend.avatar}" class="w-10 h-10 rounded-full object-cover" />
//                     <div class="flex flex-col">
//                         <span class="text-sm font-medium">${friend.name}</span>
//                         <span class="flex items-center justify-start gap-3">
//                             <span class="block w-[8px] h-[8px] rounded-full bg-[var(--success)]"></span>
//                             <span class="block text-xs text-[var(--text-secondary)] !pt-1">Online</span>
//                         </span>
//                     </div>
//                 </div>
//                 <button class="message-btn !mr-4 flex items-center" data-id="${friend.id}">
//                     <i class="ti ti-message text-2xl"></i>
//                 </button>
//             </div>
//         `;
//     }

//     private renderPendingItem(friend: Friend): string {
//         return `
//             <div class="flex items-center justify-between !p-3 rounded-xl hover:bg-[var(--light-hover)] transition !mt-3">
//                 <div class="flex items-center gap-3">
//                     <img src="${friend.avatar}" class="w-10 h-10 rounded-full object-cover">
//                     <div>
//                         <div class="font-medium text-sm">${friend.name}</div>
//                         <div class="text-xs text-[var(--text-secondary)]">Request sent</div>
//                     </div>
//                 </div>
//                 <div class="flex items-center gap-2">
//                     <span class="text-xs text-[var(--text-secondary)] opacity-70">Pending</span>
//                     <button class="cancel-btn text-[var(--danger)] w-[30px] h-[30px] hover:bg-red-600 hover:bg-opacity-20 rounded-full transition" data-id="${friend.id}">
//                         <i class="ti ti-x text-2xl"></i>
//                     </button>
//                 </div>
//             </div>
//         `;
//     }

//     private renderAllItem(friend: Friend): string {
//         return `
//             <div class="flex items-center justify-between bg-[var(--primary)] rounded-xl !p-3 !mt-3">
//                 <div class="flex items-center gap-3">
//                     <img src="${friend.avatar}" class="w-10 h-10 rounded-full object-cover">
//                     <div>
//                         <div class="font-medium text-sm">${friend.name}</div>
//                         <div class="text-xs text-[var(--text-secondary)]">${friend.lastSeen}</div>
//                     </div>
//                 </div>
//                 <button class="message-btn !mr-4 flex items-center" data-id="${friend.id}">
//                     <i class="ti ti-message text-2xl"></i>
//                 </button>
//             </div>
//         `;
//     }

//     private bindFriendActionEvents(category: string): void {
//         document.querySelectorAll('.accept-btn').forEach(btn => {
//             btn.addEventListener('click', async (e) => {
//                 const target = e.currentTarget as HTMLButtonElement;
//                 const friendId = target.dataset.id;
//                 console.log('Accept friend request:', friendId);
//                 this.loadFriendsData(this.currentTab);
//             });
//         });

//         document.querySelectorAll('.reject-btn').forEach(btn => {
//             btn.addEventListener('click', async (e) => {
//                 const target = e.currentTarget as HTMLButtonElement;
//                 const friendId = target.dataset.id;
//                 console.log('Reject friend request:', friendId);
//                 this.loadFriendsData(this.currentTab);
//             });
//         });

//         document.querySelectorAll('.add-btn').forEach(btn => {
//             btn.addEventListener('click', async (e) => {
//                 const target = e.currentTarget as HTMLButtonElement;
//                 const