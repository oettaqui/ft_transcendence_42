interface WebSocketEventData {
    type: string;
    data: any;
    timestamp: string;
}

export class WebSocketService {
    private ws: WebSocket | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private eventListeners: Map<string, Function[]> = new Map();
    private WS_BASE = 'ws://localhost:3000';

    constructor() {
        if (localStorage.getItem('token')) {
            this.connect();
        }
    }

    connect(): void {
        const token = localStorage.getItem('token');
        if (!token) return;

        this.ws = new WebSocket(`${this.WS_BASE}/ws?token=${token}`);
        
        this.ws.onopen = () => {
            console.log('WebSocket connected');
            this.reconnectAttempts = 0;
        };

        this.ws.onmessage = (event) => {
            const message: WebSocketEventData = JSON.parse(event.data);
            this.handleEvent(message);
        };

        this.ws.onclose = () => {
            if (this.reconnectAttempts < this.maxReconnectAttempts) {
                setTimeout(() => {
                    this.reconnectAttempts++;
                    this.connect();
                }, 3000);
            }
        };
    }

    private handleEvent(event: WebSocketEventData): void {
        const listeners = this.eventListeners.get(event.type) || [];
        listeners.forEach(callback => callback(event.data));
    }

    on(eventType: string, callback: Function): void {
        if (!this.eventListeners.has(eventType)) {
            this.eventListeners.set(eventType, []);
        }
        this.eventListeners.get(eventType)!.push(callback);
    }

    off(eventType: string, callback: Function): void {
        const listeners = this.eventListeners.get(eventType) || [];
        const index = listeners.indexOf(callback);
        if (index > -1) {
            listeners.splice(index, 1);
        }
    }

    disconnect(): void {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
}

export const wsService = new WebSocketService();