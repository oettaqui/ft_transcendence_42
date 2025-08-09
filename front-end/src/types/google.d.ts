declare namespace google {
    namespace accounts {
        namespace oauth2 {
            interface TokenClient {
                requestAccessToken(): void;
            }

            interface TokenClientConfig {
                client_id: string;
                scope: string;
                callback: (response: TokenResponse) => void;
                prompt?: string;
                state?: string;
            }

            interface TokenResponse {
                access_token: string;
                expires_in: number;
                error?: string;
                error_description?: string;
                error_uri?: string;
            }

            function initTokenClient(config: TokenClientConfig): TokenClient;
        }

        namespace id {
            interface CredentialResponse {
                credential: string;
                select_by?: string;
                clientId?: string;
            }

            interface InitializeConfig {
                client_id: string;
                callback: (response: CredentialResponse) => void;
                auto_select?: boolean;
                cancel_on_tap_outside?: boolean;
            }

            interface PromptMomentNotification {
                isDisplayMoment: () => boolean;
                isDisplayed: () => boolean;
                isNotDisplayed: () => boolean;
                getNotDisplayedReason: () => string;
                isSkippedMoment: () => boolean;
                getSkippedReason: () => string;
                isDismissedMoment: () => boolean;
                getDismissedReason: () => string;
                getMomentType: () => string;
            }

            function initialize(config: InitializeConfig): void;
            function renderButton(
                parent: HTMLElement,
                options: {
                    type?: 'standard' | 'icon';
                    theme?: 'outline' | 'filled_blue' | 'filled_black';
                    size?: 'large' | 'medium' | 'small';
                    text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
                    shape?: 'rectangular' | 'pill' | 'circle' | 'square';
                    logo_alignment?: 'left' | 'center';
                    width?: string;
                    locale?: string;
                }
            ): void;
            function prompt(
                momentListener?: (notification: PromptMomentNotification) => void
            ): void;
            function disableAutoSelect(): void;
            function storeCredential(credentials: { id: string; password: string }, callback?: () => void): void;
            function cancel(): void;
            function revoke(hint: string, callback?: (response: { successful: boolean; error: string }) => void): void;
        }
    }
}