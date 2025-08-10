export interface User{
    id: number;
    username: string;
    firstname: string;
    lastname: string;
    avatar: string;
    level: number;
    exp: number;
    balance: number;
    coalition?: string;
    stats: UserStats;
    rank?: UserRank;
}


export interface UserStats {
  matchesPlayed: number;
  wins: number;
  losses: number;
  winRate: number;
  friendsCount: number;
}


export interface UserRank {
  global: number;
  coalition?: number;
}