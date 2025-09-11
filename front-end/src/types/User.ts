interface UserStats {
  userId: number;
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  rankingPoints: number;
  userRank: number;
  coins: number;
  exp: number;
  bestScore: number;
  winRate: number;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  coalition: string;
  avatar: string;
  colorTheme: string;
  email: string;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
  emailVerified: number; 
  twoFactorEnabled: boolean;
  googleId:number,
  intraId:number,
  stats: UserStats;


  is_friend?: boolean;
  pending_flag?: boolean;
  sent_flag?: boolean;
}