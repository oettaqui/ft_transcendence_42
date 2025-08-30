import { Router } from "./Router";
import { View } from "./View";
import { ApiService } from "../utils/ApiService";
import { toast } from "../views/ToastNotification";
import { User } from "../types/User";
import { UserSearch } from "../types/UserSearch";

export class DashboardLayout {
    private view: View;
    private router: Router;
    private element: HTMLElement | null = null;
    private sectionContainer: HTMLElement | null = null;
    private isDropdownOpen = false;
    private readonly API_BASE = "http://localhost:3000/api";
    private apiService = new ApiService(this.API_BASE);
    public user: User | null = null;
    private currentLoadingToastId: string | null = null;
    //search
    private searchResultsContainer: HTMLElement | null = null;
    private searchTimeout: number | null = null;

  protected eventListeners: Array<{
    element: HTMLElement | Document;
    event: string;
    handler: EventListener;
  }> = [];

  constructor(view: View, router: Router) {
    this.view = view;
    this.router = router;
  }


  async mount(container: HTMLElement): Promise<void> {
    if (this.element && this.sectionContainer) {
      this.setChildView(this.view);
      return;
    }

    this.element = await this.render();
    if (!this.element) return;

    container.appendChild(this.element);
    this.sectionContainer = this.element.querySelector(".new-section") as HTMLElement | null;

    this.setupEventListeners();
    this.setupNavigationLinks();
    this.onMount();

   
    this.setChildView(this.view);
  }

  setChildView(newView: View): void {
    if (!this.sectionContainer) {
      console.warn("DashboardLayout: sectionContainer missing; cannot set child view.");
      return;
    }

    if (this.view && typeof this.view.unMount === "function") {
      this.view.unMount();
    }

    this.view = newView;

    this.sectionContainer.innerHTML = "";
    const el = this.view.render(this.user);
    if (el) this.sectionContainer.appendChild(el);

    if (typeof this.view.onMount === "function") {
        this.view.onMount();
    }

    this.updateSidebarActiveStates(window.location.pathname);
  }

  unMount(): void {
   
    this.onUnmount();

    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }

    this.element = null;
    this.sectionContainer = null;
  }

  private async render(): Promise<HTMLElement | null> {
    this.checkVerificationEmail();
    this.user = await this.fetchUser();
    if (!this.user) {
      if (localStorage.getItem("token")) localStorage.removeItem("token");
      this.router.navigateTo("/login");
      return null;
    }
    else {
      if (this.user?.avatar === null)
          this.user.avatar = "../../public/assets/default.jpg";
    }

    const container = document.createElement("div");
    container.classList.add("w-full", "max-w-7xl", "h-full", "!m-auto");

    container.innerHTML = `
      <div class="w-full flex justify-center !m-auto">
        <!-- Responsive Header -->
        <header class="h-16 lg:h-20 !pt-4 lg:!pt-5 w-full fixed z-[100] bg-[rgba(13, 17, 23, 0.95)] backdrop-blur-md shadow-md !px-4 lg:!px-20 xl:!px-30 2xl:!px-80">
          <nav class="flex justify-between items-center h-full">
            <!-- Logo -->
            <h1 class="text-xl lg:text-3xl font-extrabold tracking-widest text-[color:var(--text)] no-underline">
              <span class="text-[var(--accent)]">P</span>ING<span class="text-[var(--accent)]">P</span>ONG
            </h1>

            <!-- Search Bar - Hidden on mobile -->
            <div class="relative hidden md:flex items-center !gap-7">
              <input type="text" class="bg-[var(--secondary)] w-[300px] lg:w-[400px] h-[36px] lg:h-[42px] border border-[var(--accent)] rounded-[8px] !pl-6 !pr-12 focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all" placeholder="Search..." aria-label="Search" />
              <div class="rounded-full w-[38px] h-[38px] lg:w-[38px] lg:h-[38px] flex justify-center items-center absolute right-[5px] top-[2px] hover:bg-[var(--accent)] hover:text-white transition-all cursor-pointer">
                <i class="ti ti-search text-lg lg:text-[18px]"></i>
              </div>
            </div>

            <!-- Right Side Navigation -->
            <div class="flex justify-center items-center !gap-4 lg:!gap-12">
              <div class="hidden sm:flex items-center justify-end !mt-2 !gap-2">
                <img class="w-6 h-6 lg:w-8 lg:h-8 rounded-full object-cover !mb-1" src="../../public/assets/qoins.png" alt="Coins" />
                <div class="flec flex-col justify-center itmes-center">
                  <div class="text-[8px] opacity-60">Balance</div>
                  <div class="text-sm lg:text-[18px] font-bold">${this.user?.stats.coins}</div>
                </div>
              </div>

              <!-- Notification & Profile -->
              <div class="relative flex items-end !gap-4 lg:!gap-8 justify-end">
                <div class="relative flex justify-center items-center">
                  <i class="ti ti-bell-filled text-2xl lg:text-[34px] font-light text-gray-300 hover:text-white transition-colors cursor-pointer"></i>
                  <div class="absolute -top-1 -right-1 bg-red-600 rounded-full text-[9px] lg:text-[10px] w-[16px] h-[16px] lg:w-[19px] lg:h-[19px] flex items-center justify-center text-white font-medium">3</div>
                </div>

                <div class="relative" id="profileDropdown">
                  <div class="profil w-[36px] h-[36px] lg:w-[42px] lg:h-[42px] rounded-full flex justify-center items-center cursor-pointer hover:ring-2  hover:ring-[var(--accent)] transition-all duration-200" id="profileTrigger">
                    <img class="w-[34px] h-[34px] lg:w-[40px] lg:h-[40px] rounded-full object-cover" src=${this.user?.avatar } />
                  </div>
                  <div id="dropdownMenu" class="absolute right-0 top-full !mt-2 w-56 lg:w-64 bg-[var(--secondary)] border border-gray-700 rounded-lg shadow-2xl opacity-0 invisible transform translate-y-2 transition-all duration-200 ease-out z-50">
                    <div class="!py-2">
                      <a href="/dashboard/profile/${this.user?.id}" class="flex items-center !px-3 lg:!px-4 !py-2 lg:!py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors group">
                        <i class="ti ti-user w-4 h-4 lg:w-5 lg:h-5 !mr-3 text-gray-400 group-hover:text-[var(--accent)]"></i>
                        <span>Profile</span>
                      </a>
                      <a href="#" class="flex items-center !px-3 lg:!px-4 !py-2 lg:!py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors group">
                        <i class="ti ti-chart-histogram w-4 h-4 lg:w-5 lg:h-5 !mr-3 text-gray-400 group-hover:text-[var(--accent)]"></i>
                        <span>Analytics</span>
                      </a>
                      <a href="#" class="flex items-center !px-3 lg:!px-4 !py-2 lg:!py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors group">
                        <i class="ti ti-settings w-4 h-4 lg:w-5 lg:h-5 !mr-3 text-gray-400 group-hover:text-[var(--accent)]"></i>
                        <span>Settings</span>
                      </a>
                      <div class="border-t border-gray-700 !my-1"></div>
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

        <main class="flex flex-col lg:flex-row justify-between items-center !pt-16 lg:!pt-20 w-full min-h-screen">
          <aside class="w-full lg:w-[20%] flex flex-col items-start justify-start !p-4 lg:!p-0">
            <nav class="w-full">
              <ul class="flex flex-row lg:flex-col items-center lg:items-start justify-center lg:justify-start !gap-2 lg:!gap-6 overflow-x-auto lg:overflow-visible">
                <li class="nav-item-animated opacity-0 w-full lg:w-[220px] home-parent flex-shrink-0">
                  <a href="/dashboard" class="group relative flex items-center justify-center lg:justify-start !px-2 !py-2 text-primary rounded-xl transition-all duration-300 hover:bg-secondary">
                    <div class="relative z-10 flex flex-col lg:flex-row items-center w-full">
                      <div class="icon-hover w-10 h-10 lg:w-12 lg:h-12 bg-secondary rounded-lg flex items-center justify-center lg:!mr-4">
                        <i class="ti ti-home text-xl lg:text-2xl text-accent"></i>
                      </div>
                      <span class="home text-animation font-semibold text-xs lg:text-[16px] !mt-1 lg:!mt-0 lg:!pl-[8px]">Home</span>
                    </div>
                  </a>
                </li>
                <li class="nav-item-animated opacity-0 w-full lg:w-[220px] game-parent flex-shrink-0">
                  <a href="/dashboard/game" class="group relative flex items-center justify-center lg:justify-start !px-2 !py-2 text-primary rounded-xl transition-all duration-300 hover:bg-secondary">
                    <div class="relative z-10 flex flex-col lg:flex-row items-center w-full">
                      <div class="icon-hover w-10 h-10 lg:w-12 lg:h-12 bg-secondary rounded-lg flex items-center justify-center lg:!mr-4">
                        <i class="ti ti-device-gamepad-2 text-xl lg:text-2xl text-accent"></i>
                      </div>
                      <span class="game text-animation font-semibold text-xs lg:text-[16px] !mt-1 lg:!mt-0 lg:!pl-[8px]">Games</span>
                    </div>
                  </a>
                </li>
                <li class="nav-item-animated opacity-0 w-full lg:w-[220px] chat-parent flex-shrink-0">
                  <a href="/dashboard/chat" class="group relative flex items-center justify-center lg:justify-start !px-2 !py-2 text-primary rounded-xl transition-all duration-300 hover:bg-secondary">
                    <div class="relative z-10 flex flex-col lg:flex-row items-center w-full">
                      <div class="icon-hover w-10 h-10 lg:w-12 lg:h-12 bg-secondary rounded-lg flex items-center justify-center lg:!mr-4">
                        <i class="ti ti-message text-xl lg:text-2xl text-accent"></i>
                      </div>
                      <span class="chat text-animation font-semibold text-xs lg:text-[16px] !mt-1 lg:!mt-0 lg:!pl-[8px]">Chat</span>
                    </div>
                  </a>
                </li>
                <li class="nav-item-animated opacity-0 w-full lg:w-[220px] tournament-parent flex-shrink-0">
                  <a href="/dashboard/tournament" class="group relative flex items-center justify-center lg:justify-start !px-2 !py-2 text-primary rounded-xl transition-all duration-300 hover:bg-secondary">
                    <div class="relative z-10 flex flex-col lg:flex-row items-center w-full lg:w-[210px]">
                      <div class="icon-hover w-10 h-10 lg:w-12 lg:h-12 bg-secondary rounded-lg flex items-center justify-center lg:!mr-4">
                        <i class="ti ti-trophy text-xl lg:text-2xl text-accent"></i>
                      </div>
                      <span class="tournament text-animation font-semibold text-xs lg:text-[16px] !mt-1 lg:!mt-0 lg:!pl-[8px]">Tournament</span>
                    </div>
                  </a>
                </li>
                <li class="nav-item-animated opacity-0 w-full lg:w-[220px] settings-parent flex-shrink-0">
                  <a href="/dashboard/settings" class="group relative flex items-center justify-center lg:justify-start !px-2 !py-2 text-primary rounded-xl transition-all duration-300 hover:bg-secondary">
                    <div class="relative z-10 flex flex-col lg:flex-row items-center w-full">
                      <div class="icon-hover w-10 h-10 lg:w-12 lg:h-12 bg-secondary rounded-lg flex items-center justify-center lg:!mr-4">
                        <i class="ti ti-settings text-xl lg:text-2xl text-accent"></i>
                      </div>
                      <span class="settings text-animation font-semibold text-xs lg:text-[16px] !mt-1 lg:!mt-0 lg:!pl-[8px]">Settings</span>
                    </div>
                  </a>
                </li>
              </ul>
            </nav>
          </aside>

          <!-- Main Content Section -->
          <div class="new-section w-full h-[100%] lg:w-[80%] !p-4 lg:!p-0"></div>
        </main>
      </div>
    `;

    return container;
  }

  private async fetchUser(): Promise<User | null> {
    try {
      const response = await this.apiService.get<User>("/auth/me");
      const user = response.data?.user;
      if (user && user.avatar == null) user.avatar = "../../public/assets/default.jpg";
      this.user = user;
      return user;
    } catch (err) {
      console.error("Failed to fetch user:", err);
      return null;
    }
  }
  private async fetchUsersSearch(query: string): Promise<void> {
    console.log("Searching for users with query:", query);
    try {
      const response = await this.apiService.get<void>(`/friends/search?search_value=${encodeURIComponent(query)}`);
      const users: UserSearch[] = response.data?.users || [];
        console.log("Search results:", users);
        this.renderSearchResults(users);
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  }

  private renderSearchResults(users: UserSearch[]): void {
    if (!this.searchResultsContainer) return;

    if (users.length === 0) {
        this.searchResultsContainer.innerHTML = `<div class="!py-4 !px-6 text-gray-400 text-sm">No users found</div>`;
        this.searchResultsContainer.style.display = "block";
        return;
    }

    this.searchResultsContainer.innerHTML = users.map(user => `
        <div class="w-full border-b border-gray-700 last:border-0 !px-3 !py-2 hover:bg-gray-700 transition-colors flex items-center justify-between cursor-pointer">
    
        <a class="flex items-center gap-3 w-full  !transform-none !transition-none" href="/dashboard/profile/${user.id}">
            <div class="relative">
            <img src="${user.avatar || "../../public/assets/default.jpg"}" 
                class="w-10 h-10 rounded-full object-cover"/>
            ${user.isOnline 
                ? `<span class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-800 rounded-full"></span>` 
                : ""
            }
            </div>
            <div class="flex flex-col  ">
                <span class="!text-white font-semibold  hover:!text-white ">${user.username}</span>
            </div>
        </a>

            <!-- the check will be on the fild isFriend not on the isOnline -->
        <div>
            ${user.is_friend 
            ? `<button class="!px-3 !py-1 text-xs rounded-md border border-[var(--accent)] text-[var(--accent)] font-semibold hover:bg-[var(--accent)] hover:text-white transition cursor-pointer">
                <i class="ti ti-message text-xl lg:text-2xl text-white"></i>
            </button>` 
            : `<button class="!px-3 !py-1 text-xs rounded-md border border-[var(--accent)] text-[var(--accent)] font-semibold hover:bg-[var(--accent)] hover:text-white transition cursor-pointer">
                <i class="ti ti-users-plus text-xl lg:text-2xl text-white"></i>
            </button>`}
        </div>

    </div>
    `).join("");

    this.searchResultsContainer.style.display = "block";
    }
  private checkVerificationEmail(): void {
    const path = window.location.pathname;
    if (path.startsWith("/verify-email/")) {
      const emailToken = path.split("/verify-email/")[1];
      if (emailToken) this.verifyEmailToken(emailToken);
    }
    const urlParams = new URLSearchParams(window.location.search);
    const queryToken = urlParams.get("token");
    if (queryToken) this.verifyEmailToken(queryToken);
  }

  private async verifyEmailToken(token: string) {
    try {
      const response = await fetch(`${this.API_BASE}/auth/verify-email/${token}`);
      const data = await response.json();
      toast.dismiss(this.currentLoadingToastId!);
      if (data.success) {
        toast.show("Email verified successfully! You can now enable two-factor authentication.", { type: "success", duration: 3000 });
        if (!localStorage.getItem("token")) this.router.navigateTo("/login");
      } else {
        toast.show(`Email verification failed: ${data.error}`, { type: "error", duration: 4000 });
        this.router.navigateTo("/login");
      }
    } catch (error) {
      console.error("Email verification error:", error);
      toast.dismiss(this.currentLoadingToastId!);
      toast.show("Email verification failed. Please try again.", { type: "error", duration: 4000 });
      this.router.navigateTo("/login");
    }
  }


  private setupDropdownEventListeners(): void {
    if (!this.element) return;

    const profileTrigger = this.element.querySelector('#profileTrigger') as HTMLElement | null;
    const dropdownMenu  = this.element.querySelector('#dropdownMenu') as HTMLElement | null;
    const profileDropdown = this.element.querySelector('#profileDropdown') as HTMLElement | null;
    const logoutBtn = this.element.querySelector('#logoutBtn') as HTMLButtonElement | null;

    if (profileTrigger && dropdownMenu && profileDropdown) {
      const profileClickHandler = (e: Event) => { e.stopPropagation(); this.toggleDropdown(); };
      this.addEventListener(profileTrigger, 'click', profileClickHandler);

      const documentClickHandler = (e: Event) => {
        if (!profileDropdown.contains(e.target as Node)) this.closeDropdown();
      };
      this.addEventListener(document, 'click', documentClickHandler);

      const keydownHandler = (e: KeyboardEvent) => { if (e.key === 'Escape') this.closeDropdown(); };
      this.addEventListener(document, 'keydown', keydownHandler);

      const dropdownClickHandler = (e: Event) => { e.stopPropagation(); };
      this.addEventListener(dropdownMenu, 'click', dropdownClickHandler);
    }

    if (logoutBtn) {
      const logoutHandler = (e: Event) => { e.preventDefault(); this.handleLogout(); };
      this.addEventListener(logoutBtn, 'click', logoutHandler);
    }
  }

  private toggleDropdown(): void {
    if (!this.element) return;
    const dropdownMenu = this.element.querySelector('#dropdownMenu') as HTMLElement | null;
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
    const dropdownMenu = this.element.querySelector('#dropdownMenu') as HTMLElement | null;
    if (!dropdownMenu) return;
    this.isDropdownOpen = false;
    dropdownMenu.classList.add('opacity-0', 'invisible', 'translate-y-2');
    dropdownMenu.classList.remove('opacity-100', 'visible', 'translate-y-0');
  }

  private async logout() {
    try {
      const response = await this.apiService.post('/auth/logout', {});
      if (response.ok) {
        localStorage.removeItem('token');
        console.log('Logged out successfully and token removed!');
      } else {
        const errorData = await response.json();
        console.error('Logout failed:', errorData.message);
      }
    } catch (error) {
      console.error('An error occurred during logout:', error);
    }
  }

  private handleLogout(): void {
    this.closeDropdown();
    this.logout();
    if (localStorage.getItem('token')) localStorage.removeItem('token');
    this.router.navigateTo('/');
  }

  private setupEventListeners(): void {
    this.setupDropdownEventListeners();
    this.setupSearchBarEvent();
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
        item.querySelector('.home')?.classList.add('active-nav');
      } else if (path === "/dashboard/game" && item.classList.contains('game-parent')) {
        item.classList.add('active');
        item.querySelector('.game')?.classList.add('active-nav');
      } else if (path === "/dashboard/chat" && item.classList.contains('chat-parent')) {
        item.classList.add('active');
        item.querySelector('.chat')?.classList.add('active-nav');
      } else if ((path === "/dashboard/tournament" || path === "/dashboard/tounament") && item.classList.contains('tournament-parent')) {
        item.classList.add('active');
        item.querySelector('.tournament')?.classList.add('active-nav');
      } else if (path === "/dashboard/settings" && item.classList.contains('settings-parent')) {
        item.classList.add('active');
        item.querySelector('.settings')?.classList.add('active-nav');
      } else {
        if (!item.hasAttribute('data-hover-attached')) {
          textItem.style.transition = 'transform 0.3s ease';
          item.addEventListener('mouseenter', () => { textItem.style.transform = 'translateX(10px)'; });
          item.addEventListener('mouseleave', () => { textItem.style.transform = 'translateX(0)'; });
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
        if (path) this.router.navigateTo(path);
      });
    });
  }

  onMount(): void {
    this.updateSidebarActiveStates(window.location.pathname);
  }

  protected addEventListener(element: HTMLElement | Document, event: string, handler: EventListener): void {
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

  private setupSearchBarEvent(): void {
    if (!this.element) return;

    const searchInput = this.element.querySelector<HTMLInputElement>('input[placeholder="Search..."]');
    if (!searchInput) return;

    this.searchResultsContainer = document.createElement("div");
    this.searchResultsContainer.className = `
        absolute top-full left-0 !mt-2 w-full bg-[var(--secondary)] border border-gray-700 z-50 max-h-[280px] overflow-y-auto
    `;
    this.searchResultsContainer.style.display = "none";
    searchInput.parentElement?.appendChild(this.searchResultsContainer);

    const inputHandler = (e: Event) => {
        const value = (e.target as HTMLInputElement).value.trim();

        if (this.searchTimeout) clearTimeout(this.searchTimeout);

        if (value.length >= 2) {
        this.searchTimeout = window.setTimeout(() => {
            this.fetchUsersSearch(value);
        }, 300);
        } else {
        if (this.searchResultsContainer) {
            this.searchResultsContainer.innerHTML = "";
            this.searchResultsContainer.style.display = "none";
        }
        }
    };

    this.addEventListener(searchInput, "input", inputHandler);
}


}