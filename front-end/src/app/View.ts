
import { User } from "../types/User";

export abstract class View {
    protected element: HTMLElement | null = null;
    protected eventListeners: Array<{
        element: HTMLElement;
        event: string;
        handler: EventListener;
    }> = [];

    abstract render(user: User | null): HTMLElement;

    protected onMount(): void {
    }

    protected onUnmount(): void {
        this.removeAllEventListeners();
    }

    protected addEventListener(element: HTMLElement, event: string, handler: EventListener): void {
        element.addEventListener(event, handler);
        this.eventListeners.push({ element, event, handler });
    }

    protected removeAllEventListeners(): void {
    
        this.eventListeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        this.eventListeners = [];
    }


    public mount(container: HTMLElement): void {
        this.element = this.render();
        container.appendChild(this.element);
        this.onMount();
    }

    public unMount(): void {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
            this.element.innerHTML = ``;
        }
        this.onUnmount();
    }


    protected add3DTiltEffect(container: HTMLElement): void {
        setTimeout(() => {
            const pongField = container.querySelector('.pong-field1') as HTMLElement;
            
            if (!pongField) return;

        const style = document.createElement('style');
        style.textContent = `
            .pong-field1 {
                transition: transform 0.3s ease-out;
                transform-style: preserve-3d;
                perspective: 1000px;
            }
            .pong-field1::before {
                content: '';
                position: absolute;
                top: 5%;
                left: 5%;
                right: 5%;
                bottom: 5%;
                background: rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                filter: blur(10px);
                z-index: -1;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            .pong-field1:hover::before {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);

        pongField.addEventListener('mousemove', (e) => {
            const rect = pongField.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const xPercent = x / rect.width;
            const yPercent = y / rect.height;
            const rotateY = (xPercent - 0.5) * 10;
            const rotateX = (0.5 - yPercent) * 10;
            
            pongField.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg)
                translateZ(10px)
            `;
        });

        pongField.addEventListener('mouseleave', () => {
            pongField.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
        }, 0);
    }

    protected addParticleEffects(container: HTMLElement): void {
        setTimeout(() => {
            const particlesContainer = container.querySelector('.particles-container') as HTMLElement;
            if (!particlesContainer) return;

            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.cssText = `
                    position: absolute;
                    width: 2px;
                    height: 2px;
                    background: var(--accent);
                    border-radius: 50%;
                    opacity: 0.6;
                    animation: floatParticle ${8 + Math.random() * 4}s ease-in-out infinite;
                    animation-delay: ${Math.random() * 2}s;
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                `;
                particlesContainer.appendChild(particle);
            }
        }, 100);
    }


    

}