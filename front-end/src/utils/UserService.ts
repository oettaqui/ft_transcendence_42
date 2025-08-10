
import {User} from "../types/User"

export class UserService {
    private static instance: UserService;
    private baseUrl?: string;
    private currentUser: User | null = null;

    private constructor(baseUrl: string = '/api') {
        this.baseUrl = baseUrl;
    }


}