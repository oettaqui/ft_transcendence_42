export interface Friend {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    avatar: string;
    lastLogin?: string;
    status?: string;
    is_friend?:boolean
}

export interface FriendsData {
    all: Friend[];
    online: Friend[];
    requests: Friend[];
    pending: Friend[];
}