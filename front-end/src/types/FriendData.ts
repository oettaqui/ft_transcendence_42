export interface Friend {
    id: number;
    name: string;
    avatar: string;
    lastSeen?: string;
    status?: string;
}

export interface FriendsData {
    all: Friend[];
    online: Friend[];
    requests: Friend[];
    pending: Friend[];
}