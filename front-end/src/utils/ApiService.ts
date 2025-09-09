
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
        console.log("Response Get => ", response);
        return response.json() as Promise<T>;
    }


    async post(endpoint: string, body: object): Promise<Response> {
        const token = localStorage.getItem('token');

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        // headers: {
        //     'Content-Type': 'application/json',
        //     'Authorization': `Bearer ${token}`
        // },
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(body)
        });

        if (!response.ok) {
       
        throw new Error(`HTTP error: ${response.status}`);
        }
        console.log("Response Post => ", response);
        return response;
  }
  async delete(endpoint: string): Promise<Response> {
        const token = localStorage.getItem('token');

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        console.log("Response Delete => ", response);
        return response;
    }

    async put(endpoint: string, body: object): Promise<Response> {
        const token = localStorage.getItem('token');

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error: ${response.status}`);
        }
        
        console.log("Response Put => ", response);
        return response;
    }


}