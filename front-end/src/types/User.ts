export interface User{
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    avatar: string;
    // level: number;
    // exp: number;
    // balance: number;
    // coalition?: string;
    // stats: UserStats;
    // rank?: UserRank;
}


export interface UserStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  winRate: number;
  friendsCount: number;
}


export interface UserRank {
  global: number;
  coalition?: number;
}