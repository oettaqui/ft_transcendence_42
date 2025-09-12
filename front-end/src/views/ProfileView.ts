

import { View } from "../app/View";
import { User } from "../types/User";
import { ApiService } from "../utils/ApiService";
import { toast } from "./ToastNotification";

type Match = {
  opponent: { username: string; avatar: string; };
  userScore: number; opponentScore: number; result: 'Win' | 'Loss';
};

type TopPlayer = {
  rank: number;
  username:string;
  avatar: string;
  score: number;
};

type GlobalPlayer = {
    rank: number;
    username: string;
    avatar: string;
    score: number;
};

export class ProfileView extends View {
  private element: HTMLElement | null = null;
  private userId: string;
  private apiService = new ApiService("http://localhost:3000/api");
  private loggedInUser: User | null = null;
  private profileUser: User | null = null; 
  private wsListeners: (() => void)[] = [];

  constructor(params: { id: string }) {
    super(params);
    this.userId = params.id;
    document.title = "Profile";
  }

  render(user: User | null): HTMLElement { 
    this.loggedInUser = user || null;
    const container = document.createElement("div");
    container.className = "bg-[var(--primary)] w-full h-[80%] rounded-4xl !mt-16 flex flex-col lg:flex-row items-center lg:items-stretch justify-between !gap-4 lg:!gap-0 !p-2 lg:!p-0";
    container.innerHTML = `<div class="flex justify-center items-center h-full w-full"><div class="loader"></div><p class="!mt-4 !ml-4 text-lg text-gray-400">Loading Profile...</p></div>`;
    this.element = container;
    return this.element;
  }

  async onMount(): Promise<void> {
    if (!this.userId) {
      toast.show("User ID is missing.", { type: "error" });
      return;
    }
    await this.fetchAndRenderProfile();
  }

  unMount(): void {
    this.wsListeners.forEach(remover => remover());
    this.wsListeners = [];
    this.element = null;
  }

  private async fetchMatchHistory(): Promise<Match[]> {
    await new Promise(resolve => setTimeout(resolve, 500)); 
    return [
        { opponent: { username: 'oettaqui', avatar: '/public/assets/oettaqui.jpeg' }, userScore: 10, opponentScore: 5, result: 'Win' },
        { opponent: { username: 'bchokri', avatar: '/public/assets/bchokri.jpeg' }, userScore: 7, opponentScore: 10, result: 'Loss' },
        { opponent: { username: 'yakhay', avatar: '/public/assets/yakhay.jpeg' }, userScore: 10, opponentScore: 8, result: 'Win' },
    ];
  }


  private async fetchTopPlayers(): Promise<TopPlayer[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      { rank: 1, username: 'yakhay', avatar: '/public/assets/yakhay.jpeg', score: 2500 },
      { rank: 2, username: 'oettaqui', avatar: '/public/assets/oettaqui.jpeg', score: 2350 },
      { rank: 3, username: 'bchokri', avatar: '/public/assets/bchokri.jpeg', score: 2100 },
    ];
  }

   // NEW: Fetch data for the global ranking chart
  private async fetchGlobalRanking(): Promise<GlobalPlayer[]> {
      await new Promise(resolve => setTimeout(resolve, 600)); // Simulate network delay
      return [
        { rank: 1, username: 'yakhay', avatar: '/public/assets/yakhay.jpeg', score: 2500 },
        { rank: 2, username: 'oettaqui', avatar: '/public/assets/oettaqui.jpeg', score: 2350 },
        { rank: 3, username: 'bchokri', avatar: '/public/assets/bchokri.jpeg', score: 2100 },
        { rank: 4, username: 'user_404', avatar: '/public/assets/default.jpg', score: 1980 },
        { rank: 5, username: 'gamer_x', avatar: '/public/assets/default.jpg', score: 1850 },
        { rank: 6, username: 'ping_master', avatar: '/public/assets/default.jpg', score: 1700 },
      ];
  }

  private async fetchAndRenderProfile(): Promise<void> {
    try {
      // Fetch top players along with other data
      const [profileResponse, matchHistory, topPlayers] = await Promise.all([
        this.apiService.get<{ user: User }>(`/users/profile/${this.userId}`),
        this.fetchMatchHistory(),
        this.fetchTopPlayers()
      ]);
      
      this.profileUser = profileResponse.user;

      if (!this.profileUser) { throw new Error("User not found."); }
      
      this.updateDOMWithUserData(this.profileUser);
      this.renderMatchHistory(matchHistory);
      const colorClasses = {
        'Bios': 'var(--bios)', 'Freax': 'var(--freax)', 'Commodore': 'var(--commodore)', 'Pandora': 'var(--pandora)'
      };
      const colorTheme = colorClasses[this.profileUser.coalition] || '';
      const isOwnProfile = this.loggedInUser && this.profileUser.id === this.loggedInUser.id;

      if (isOwnProfile) {
        const topPlayers = await this.fetchTopPlayers();
        this.renderTopPlayers(topPlayers, colorTheme);
      } else {
        const globalRanking = await this.fetchGlobalRanking();
        this.renderGlobalRanking(globalRanking, colorTheme);
      }
      // === END OF LOGIC CHANGE ===

    } catch (error) {
      console.error("Failed to fetch profile data:", error);
      toast.show(error.message || "Could not load profile.", { type: 'error' });
      if (this.element) {
        this.element.innerHTML = `<div class="w-full h-full flex justify-center items-center text-center text-red-500 !p-8 text-2xl">Failed to load profile or profile not found.</div>`;
      }
    }
  }

  



  
  private updateDOMWithUserData(user: User): void {
    if (!this.element) return;
        const bgClasses = {
        'Bios': 'bg-[url(/public/assets/BiosBG.jpg)]', 'Freax': 'bg-[url(/public/assets/Freax_BG.jpg)]',
        'Commodore': 'bg-[url(/public/assets/Commodore_BG.jpg)]', 'Pandora': 'bg-[url(/public/assets/Pandora_BG.jpg)]'
    };
    const colorClasses = {
        'Bios': 'var(--bios)', 'Freax': 'var(--freax)', 'Commodore': 'var(--commodore)', 'Pandora': 'var(--pandora)'
    };
    const bgUrl = bgClasses[user.coalition] || '';
    const colorTheme = colorClasses[user.coalition] || '';
    



    this.element.innerHTML = `
      <aside class="w-full h-full lg:w-[67%] flex flex-col !gap-4 !py-4 lg:!pl-4">
        <div class="relative w-full h-[40%]">
            <div class="${bgUrl} bg-cover w-full min-h-[200px] h-auto lg:h-full rounded-2xl lg:rounded-3xl !p-4 lg:!p-8 flex flex-col justify-center !gap-6 lg:!gap-10">
                <div class="z-[10] flex flex-col sm:flex-row justify-start items-center !gap-4 lg:!gap-8">
                    <div class="relative flex justify-center items-center w-[70px] h-[70px] sm:w-[80px] sm:h-[80px] lg:w-[110px] lg:h-[110px]">
                        <div style="background-color: ${colorTheme}" class="absolute w-[62px] h-[62px] sm:w-[72px] sm:h-[72px] lg:w-[102px] lg:h-[102px] rounded-full"></div>
                        <img class="w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] lg:w-[100px] lg:h-[100px] bg-contain bg-no-repeat bg-center rounded-full z-[11]" src="${user.avatar || '../../public/assets/default.jpg'}" />
                    </div>
                    <div class="flex flex-col justify-center items-center sm:items-start text-center sm:text-left">
                        <h2 class="text-lg sm:text-xl lg:text-[28px] font-bold">${user.firstName} ${user.lastName}</h2>
                        <p class="font-light text-[10px] sm:text-xs lg:text-[14px] !mb-1">@${user.username}</p>
                        <div class="!mt-3" id="action-button-container"></div>
                    </div>
                </div>
                <div class="level flex flex-col sm:flex-row justify-center items-center !gap-2 lg:!gap-4">
                    <div class="text-xl sm:text-2xl lg:text-3xl font-bold">${user.stats.exp}</div>
                    <div class="flex flex-col items-center sm:items-start justify-center w-full sm:w-auto">
                        <div class="percentage text-[10px] sm:text-xs lg:text-[14px] !mb-1" id="percentageText">22%</div>
                        <div class="progress-bar h-[6px] sm:h-[8px] lg:h-[10px] w-full max-w-[250px] sm:max-w-[300px] md:max-w-[400px] lg:w-[600px] bg-[var(--text)] rounded-3xl relative overflow-hidden">
                            <div class="progress-fill h-full rounded-3xl" style="background-color: ${colorTheme} !important;" id="progressFill"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="absolute top-2 right-2 sm:top-4 sm:right-4 w-auto h-[25px] sm:h-[30px] rounded-lg flex justify-center items-center">
                <div><span style="background-color: ${colorTheme}" class="!px-2 lg:!px-4 !py-1 lg:!py-2 rounded-lg lg:rounded-xl font-bold text-[8px] sm:text-[10px] lg:text-[12px]">${user.coalition}</span></div>
            </div>
        </div>   
        <div class="w-full h-[100%] rounded-2xl lg:rounded-3xl bg-[var(--secondary)] flex flex-col lg:flex-row justify-center items-center !gap-4 lg:!gap-0 !p-4 lg:!p-0">
            <div id="chart" style="border-color: ${colorTheme}" class="border rounded-2xl flex flex-col lg:flex-row justify-between items-center w-full lg:w-[50%] !px-3 lg:!px-4 !py-4 lg:!py-6 lg:!ml-15 !gap-2">
                <canvas id="donutChart" width="200" height="200" class="sm:w-[180px] sm:h-[180px] lg:w-[200px] lg:h-[200px]"></canvas>
                <div class="flex flex-row lg:flex-col !gap-3 text-center lg:text-left">
                    <div class="flex flex-col"><div class="text-xs lg:text-sm">Balance</div> <div style="color: ${colorTheme}" id="balanceValue" class="text-lg lg:text-2xl"></div></div>
                    <div class="flex flex-col"><div class="text-xs lg:text-sm">Level</div> <div style="color: ${colorTheme}" id="levelValue" class="text-lg lg:text-2xl"></div></div>
                </div>
            </div>
            <div id="dynamic-ranking-container" class="flex flex-col justify-center items-center w-full lg:w-[50%] h-full !p-4 lg:!ml-4">
                 <div class="loader"></div>
            </div>
            <div id="top-players-container" class="w-[80%]"></div>
      </aside>
      <aside id="match-history-container" class="w-full lg:w-[30%] overflow-y-auto overflow-x-hidden rounded-2xl lg:rounded-3xl bg-[var(--secondary)] !p-4 !mr-0 lg:!mr-4 !my-2 lg:!my-4">
        <div class="flex justify-center items-center h-full"><div class="loader"></div></div>
      </aside>
    `;

    this.animateProgress();
    const isOwnProfile = this.loggedInUser && this.profileUser?.id === this.loggedInUser.id;
    if (isOwnProfile)
    {
      const chart = document.querySelector("#chart");
      const ranking = document.querySelector("#dynamic-ranking-container");
      if (chart || ranking) {
          chart?.classList.add("hidden");
          ranking?.classList.add("hidden");
      }
    }else{
      const topRank = document.querySelector("#top-players-container");
      if (topRank)
          topRank?.classList.add("hidden");
      this.chatWinLose(user, colorTheme);
      this.animateNumber('balanceValue', user.stats.coins);
      this.animateNumber('levelValue', user.stats.exp, 1000, 2);

    }
  
  }


  // NEW: Renders the scrollable global ranking list
  private renderGlobalRanking(players: GlobalPlayer[], coalitionColor: string): void {
      const container = document.getElementById('dynamic-ranking-container');
      if (!container) return;

      const playersHtml = players.map(player => `
          <div class="flex items-center justify-between bg-[var(--primary)] rounded-lg !px-2 !py-2 !mb-2 w-full max-w-sm ">
              <div class="flex items-center !gap-3">
                  <span style="color: ${coalitionColor}" class="font-bold text-lg w-6 text-center">#${player.rank}</span>
                  <img src="${player.avatar}" class="w-10 h-10 rounded-full object-cover">
                  <span class="font-medium text-sm">${player.username}</span>
              </div>
              <span class="text-[10px] opacity-80">${player.score}</span>
          </div>
      `).join('');

      container.innerHTML = `
          <h3 class="text-lg font-bold !mb-3 text-center w-full" style="color: ${coalitionColor}">Global Ranking</h3>
          <div class="flex flex-col items-center w-full h-[220px] overflow-y-auto">
              ${playersHtml}
          </div>
      `;
  }

  // New method to render the top 3 players as a podium
  private renderTopPlayers(players: TopPlayer[], coalitionColor: string): void {
    const container = document.getElementById('top-players-container');
    if (!container || players.length < 3) {
      if (container) container.innerHTML = '<p class="text-center text-gray-400">Not enough data for a podium.</p>';
      return;
    }

    const [first, second, third] = players;

    container.innerHTML = `
      <h3 class="text-lg font-bold !mt-6 text-center" style="color: ${coalitionColor}">Top Players</h3>
      <div class="flex justify-around items-end w-full h-full max-w-[70%] !mx-auto !pt-4 gap-8">
        
        <div class="order-2 text-center w-1/3">
          <div class="flex flex-col items-center relative">
            <span class="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-400 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">2</span>
            <img src="${second.avatar}" class="w-14 h-14 lg:w-16 lg:h-16 rounded-full object-cover border-4 border-gray-400">
            <p class="font-bold text-sm truncate !mt-1">${second.username}</p>
            <p class="text-xs opacity-80" style="color: ${coalitionColor}">${second.score} pts</p>
          </div>
          <div class="bg-gray-500/50 !mt-2 h-[60px] rounded-t-lg"></div>
        </div>

        <div class="order-1 text-center w-1/3">
          <div class="flex flex-col items-center relative">
          <span class="absolute -top-4 text-2xl">👑</span>
            <img src="${first.avatar}" class="w-16 h-16 lg:w-20 lg:h-20 rounded-full object-cover border-4 border-yellow-400">
            <p class="font-bold text-md truncate !mt-1">${first.username}</p>
            <p class="text-sm opacity-90" style="color: ${coalitionColor}">${first.score} pts</p>
          </div>
          <div class="bg-yellow-500/50 !mt-2 h-[90px] rounded-t-lg"></div>
        </div>
        
        <div class="order-3 text-center w-1/3">
          <div class="flex flex-col items-center relative">
            <span class="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-400 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">3</span>
            <img src="${third.avatar}" class="w-12 h-12 lg:w-14 lg:h-14 rounded-full object-cover border-4 border-orange-400">
            <p class="font-bold text-xs truncate !mt-1">${third.username}</p>
            <p class="text-xs opacity-70" style="color: ${coalitionColor}">${third.score} pts</p>
          </div>
          <div class="bg-orange-500/50 !mt-2 h-[40px] rounded-t-lg"></div>
        </div>
      </div>
    `;
  }

  

  private renderMatchHistory(matches: Match[]): void {
    const container = document.getElementById('match-history-container');
    if (!container) return;
    const listHtml = matches.map(match => {
        const resultColor = match.result === 'Win' ? 'text-green-400' : 'text-red-400';
        const resultBorder = match.result === 'Win' ? 'border-green-400' : 'border-red-400';
        return `
          <div class="flex items-center justify-between bg-[var(--primary)] rounded-xl !p-3 !mb-3">
              <div class="flex items-center !gap-3">
                  <img src="${match.opponent.avatar}" class="w-10 h-10 rounded-full object-cover">
                  <div>
                      <div class="font-medium text-sm">vs ${match.opponent.username}</div>
                      <div class="text-xs text-gray-400">Score: ${match.userScore} - ${match.opponentScore}</div>
                  </div>
              </div>
              <div class="text-right">
                <span class="font-bold text-sm ${resultColor} border ${resultBorder} !px-2 !py-1 rounded-md">${match.result.toUpperCase()}</span>
              </div>
          </div>
        `;
    }).join('');
    container.innerHTML = `<h2 class="text-lg font-bold !mb-4 sticky top-0  text-center !py-2">Match History</h2><div class="flex flex-col">${listHtml}</div>`;
  }

  animateProgress(): void {
    const el = document.getElementById('percentageText');
    const fill = document.getElementById('progressFill');
    if(!el || !fill) return;
    const target = parseInt(el.textContent || '0');
    el.textContent = '0%';
    fill.style.width = '0%';
    setTimeout(() => {
        fill.style.width = target + '%';
        this.animateCounter(0, target, 2000, val => el.textContent = `${Math.round(val)}%`);
    }, 100);
  }
  animateCounter(start: number, end: number, duration: number, cb: (v: number) => void): void {
    const st = performance.now();
    const update = () => {
        const ct = performance.now();
        const elapsed = ct - st;
        const p = Math.min(elapsed / duration, 1);
        const ep = 1 - Math.pow(1 - p, 3);
        cb(start + (end-start)*ep);
        if(p<1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  chatWinLose(user: User, color: string): void {
    const canvas = document.getElementById('donutChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const [w, h, r, ir] = [canvas.width, canvas.height, 100, 80];
    const data = [{ v: user.stats.gamesWon, c: color }, { v: user.stats.gamesLost, c: '#fff' }];
    const total = data.reduce((s, i) => s + i.v, 0) || 1;
    let p = 0;
    const draw = () => {
        ctx.clearRect(0, 0, w, h);
        let sa = -0.5*Math.PI;
        for (const item of data) {
            const slice = (item.v/total)*2*Math.PI*p;
            ctx.beginPath();
            ctx.moveTo(w/2, h/2);
            ctx.arc(w/2, h/2, r, sa, sa+slice);
            ctx.closePath();
            ctx.fillStyle = item.c;
            ctx.fill();
            sa += slice;
        }
        ctx.beginPath();
        ctx.arc(w/2, h/2, ir, 0, 2*Math.PI);
        ctx.fillStyle = '#3e3e3e';
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = '20px Orbitron';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`Win: ${user.stats.gamesWon}`, w/2, h/2-12);
        ctx.fillText(`Lose: ${user.stats.gamesLost}`, w/2, h/2+12);
        if (p < 1) {
            p = Math.min(p + 0.02, 1);
            requestAnimationFrame(draw);
        }
    };
    draw();
  }
  animateNumber(id: string, target: number, dur=1000, dec=0): void {
    const el = document.getElementById(id);
    if (!el) return;
    const start = performance.now();
    const animate = (ts: number) => {
        const elapsed = ts - start;
        const p = Math.min(elapsed/dur, 1);
        const val = 0 + (target-0)*p;
        el.textContent = val.toFixed(dec) + (id==='winRate'?'%':'');
        if(p<1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }

}