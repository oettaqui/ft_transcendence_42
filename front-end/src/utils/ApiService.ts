
export class ApiService {
    private baseUrl?: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async get<T>(endpoint: string): Promise<T> {
        const token = localStorage.getItem("token");
        console.log("Using token:", token);

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
            }
        });
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        return response.json() as Promise<T>;
    }


    async post(endpoint: string, body: object): Promise<Response> {
        const token = localStorage.getItem('token');

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
        });

        if (!response.ok) {
       
        throw new Error(`HTTP error: ${response.status}`);
        }
        console.log("Responce => ", response);
        return response;
  }


}