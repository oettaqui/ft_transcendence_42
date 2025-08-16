interface ToastOptions {
    type: 'success' | 'error' | 'warning' | 'loading' | 'info';
    duration?: number;
    dismissible?: boolean;
}

interface Toast {
    id: string;
    message: string;
    type: ToastOptions['type'];
    duration: number;
    dismissible: boolean;
    timeoutId?: number;
}

export class ToastNotification {
    private static instance: ToastNotification;
    private container: HTMLElement;
    private toasts: Map<string, Toast> = new Map();

    private constructor() {
        this.container = this.createContainer();
        document.body.appendChild(this.container);
    }

    static getInstance(): ToastNotification {
        if (!ToastNotification.instance) {
            ToastNotification.instance = new ToastNotification();
        }
        return ToastNotification.instance;
    }

    private createContainer(): HTMLElement {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = `
            fixed top-4 right-1/4 z-[99999] flex flex-col gap-3 max-w-sm w-full
            pointer-events-none
        `.trim();
        
        // Add inline styles to ensure proper positioning
        container.style.position = 'fixed';
        container.style.top = '1rem';
        container.style.right = '20%';
        container.style.zIndex = '99999';
        container.style.maxWidth = '24rem';
        container.style.width = '100%';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '0.75rem';
        container.style.pointerEvents = 'none';
        
        // Add custom styles for animations
        const style = document.createElement('style');
        style.textContent = `
            #toast-container {
                position: fixed !important;
                top: 1rem !important;
                right: 25% !important;
                z-index: 99999 !important;
                max-width: 24rem !important;
                width: 19rem !important;
                min-width: 20rem !important;
                display: flex !important;
                flex-direction: column !important;
                gap: 0.75rem !important;
                pointer-events: none !important;
            }
            
            @media (max-width: 640px) {
                #toast-container {
                    left: 1rem !important;
                    right: 1rem !important;
                    max-width: calc(100vw - 2rem) !important;
                    min-width: auto !important;
                }
            }
            
            .toast-item {
                pointer-events: auto !important;
                position: relative !important;
                width: 100% !important;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            .toast-enter {
                animation: slideInRight 0.3s ease-out forwards;
            }
            
            .toast-exit {
                animation: slideOutRight 0.3s ease-in forwards;
            }
            
            .toast-progress-bar {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: rgba(255, 255, 255, 0.7);
                transition: width linear;
            }
            
            .loading-spinner {
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-top: 2px solid white;
                border-radius: 50%;
                width: 16px;
                height: 16px;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        return container;
    }

    show(message: string, options: ToastOptions = { type: 'info' }): string {
        const id = this.generateId();
        const toast: Toast = {
            id,
            message,
            type: options.type,
            duration: options.duration ?? (options.type === 'loading' ? 0 : 5000),
            dismissible: options.dismissible ?? true
        };

        this.toasts.set(id, toast);
        const element = this.createToastElement(toast);
        this.container.appendChild(element);

        // Trigger enter animation
        requestAnimationFrame(() => {
            element.classList.add('toast-enter');
        });

        // Auto-dismiss if duration is set
        if (toast.duration > 0) {
            this.startProgressBar(element, toast.duration);
            toast.timeoutId = window.setTimeout(() => {
                this.dismiss(id);
            }, toast.duration);
        }
        return id;
    }

    private createToastElement(toast: Toast): HTMLElement {
        const element = document.createElement('div');
        element.id = `toast-${toast.id}`;
        element.className = `
            toast-item relative bg-opacity-95 backdrop-blur-sm 
            rounded-lg shadow-lg border !p-4 flex items-start gap-3 min-h-[60px]
            transform translate-x-full opacity-0
            ${this.getTypeClasses(toast.type)}
        `.trim();

        // Add inline styles for extra security
        element.style.pointerEvents = 'auto';
        element.style.position = 'relative';
        element.style.width = '100%';
        element.style.transform = 'translateX(100%)';
        element.style.opacity = '0';

        const icon = this.getIcon(toast.type);
        const dismissButton = toast.dismissible ? this.createDismissButton(toast.id) : '';
        const progressBar = toast.duration > 0 ? '<div class="toast-progress-bar" style="width: 100%"></div>' : '';

        element.innerHTML = `
            <div class="flex-shrink-0 !mt-0.5">
                ${icon}
            </div>
            <div class="flex-1 text-sm font-medium leading-relaxed">
                ${toast.message}
            </div>
            ${dismissButton}
            ${progressBar}
        `;

        if (toast.dismissible) {
            const closeBtn = element.querySelector('.toast-dismiss');
            closeBtn?.addEventListener('click', () => this.dismiss(toast.id));
        }

        return element;
    }

    private getTypeClasses(type: ToastOptions['type']): string {
        const baseClasses = 'text-white';
        
        switch (type) {
            case 'success':
                return `${baseClasses} bg-green-400 border-green-500`;
            case 'error':
                return `${baseClasses} bg-red-400 border-red-500`;
            case 'warning':
                return `${baseClasses} bg-yellow-400 border-yellow-500`;
            case 'loading':
                return `${baseClasses} bg-blue-400 border-blue-500`;
            case 'info':
            default:
                return `${baseClasses} bg-gray-400 border-gray-500`;
        }
    }

    private getIcon(type: ToastOptions['type']): string {
        switch (type) {
            case 'success':
                return `
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                `;
            case 'error':
                return `
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                    </svg>
                `;
            case 'warning':
                return `
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    </svg>
                `;
            case 'loading':
                return `<div class="loading-spinner"></div>`;
            case 'info':
            default:
                return `
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                    </svg>
                `;
        }
    }

    private createDismissButton(toastId: string): string {
        return `
            <button class="toast-dismiss flex-shrink-0 !p-1 hover:bg-black hover:bg-opacity-20 rounded transition-colors" 
                    aria-label="Dismiss notification">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
            </button>
        `;
    }

    private startProgressBar(element: HTMLElement, duration: number): void {
        const progressBar = element.querySelector('.toast-progress-bar') as HTMLElement;
        if (progressBar) {
            progressBar.style.width = '100%';
            // Start the animation after a small delay
            setTimeout(() => {
                progressBar.style.width = '0%';
                progressBar.style.transition = `width ${duration}ms linear`;
            }, 50);
        }
    }

    dismiss(id: string): void {
        const toast = this.toasts.get(id);
        if (!toast) return;

        const element = document.getElementById(`toast-${id}`);
        if (!element) return;

        // Clear timeout if exists
        if (toast.timeoutId) {
            clearTimeout(toast.timeoutId);
        }

        // Add exit animation
        element.classList.remove('toast-enter');
        element.classList.add('toast-exit');

        // Remove after animation
        setTimeout(() => {
            element.remove();
            this.toasts.delete(id);
        }, 300);
    }

    // Update existing toast (useful for loading states)
    update(id: string, message: string, options: Partial<ToastOptions> = {}): void {
        const toast = this.toasts.get(id);
        if (!toast) return;

        const element = document.getElementById(`toast-${id}`);
        if (!element) return;

        // Update toast data
        toast.message = message;
        if (options.type) toast.type = options.type;
        if (options.duration !== undefined) toast.duration = options.duration;
        if (options.dismissible !== undefined) toast.dismissible = options.dismissible;

        // Clear existing timeout
        if (toast.timeoutId) {
            clearTimeout(toast.timeoutId);
            toast.timeoutId = undefined;
        }

        // Update element
        element.className = `
            relative pointer-events-auto bg-opacity-95 backdrop-blur-sm 
            rounded-lg shadow-lg border !p-4 flex items-start gap-3 min-h-[60px]
            ${this.getTypeClasses(toast.type)}
        `.trim();

        const icon = this.getIcon(toast.type);
        const dismissButton = toast.dismissible ? this.createDismissButton(toast.id) : '';
        const progressBar = toast.duration > 0 ? '<div class="toast-progress-bar" style="width: 100%"></div>' : '';

        element.innerHTML = `
            <div class="flex-shrink-0 mt-0.5">
                ${icon}
            </div>
            <div class="flex-1 text-sm font-medium leading-relaxed">
                ${toast.message}
            </div>
            ${dismissButton}
            ${progressBar}
        `;

        
        if (toast.dismissible) {
            const closeBtn = element.querySelector('.toast-dismiss');
            closeBtn?.addEventListener('click', () => this.dismiss(toast.id));
        }

        
        if (toast.duration > 0) {
            this.startProgressBar(element, toast.duration);
            toast.timeoutId = window.setTimeout(() => {
                this.dismiss(id);
            }, toast.duration);
        }
    }

    // Clear all toasts
    clearAll(): void {
        this.toasts.forEach((_, id) => this.dismiss(id));
    }

    private generateId(): string {
        return Math.random().toString(36).substr(2, 9);
    }
}

// Export singleton instance for easy access
export const toast = ToastNotification.getInstance();