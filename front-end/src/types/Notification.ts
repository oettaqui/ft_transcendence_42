export interface Notification {
  id: number;
  userId: number;
  friendId: number;
  friendId_avatar: string | null;
  message: string;
  type: NotificationType;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type NotificationType = 
  | 'friend_request'
  | 'decline_request' 
  | 'accept_request'
  | 'cancel_request'
  | 'game_invite'
  | 'tournament'
  | 'achievement'
  | 'system';
