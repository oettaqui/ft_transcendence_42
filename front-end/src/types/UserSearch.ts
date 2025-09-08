export interface UserSearch {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  avatar: string;
  isOnline: boolean; 
  lastLogin: string;
  is_friend: boolean; 
  pending_flag: boolean;
  sent_flag: boolean;
}
