import { View } from "../app/View";

export class TournamentView extends View{
    
    constructor(){
        super()
    }
    
   render(): HTMLElement {
    const element = document.createElement('section');
    element.classList.add(
        'bg-[rgba(220,219,219,0.08)]',
        'backdrop-blur-3xl',
        'rounded-4xl',
        'border',
        'border-white/10',
        'w-full',
        'h-[80%]',
        '!mt-16',
        'flex',
        'flex-col',
        'lg:flex-row',
        'items-center',
        'lg:items-stretch',
        'justify-between',
        '!gap-8',
        'lg:!gap-0',
        '!p-2',
        'lg:!p-2',
        'overflow-hidden'
    );
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% {
                transform: translateY(0px);
            }
            50% {
                transform: translateY(-20px);
            }
        }
        
        .floating-button {
            animation: float 2s ease-in-out infinite;
        }
        
        /* Alternative bounce animation */
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
                transform: translateY(0);
            }
            40% {
                transform: translateY(-15px);
            }
            60% {
                transform: translateY(-8px);
            }
        }
        
        .bouncing-button {
            animation: bounce 2s infinite;
        }
        
        /* Smooth sine wave animation */
        @keyframes wave {
            0% {
                transform: translateY(0px);
            }
            25% {
                transform: translateY(-15px);
            }
            50% {
                transform: translateY(0px);
            }
            75% {
                transform: translateY(-10px);
            }
            100% {
                transform: translateY(0px);
            }
        }
        
        .wave-button {
            animation: wave 3s ease-in-out infinite;
        }
    `;
    document.head.appendChild(style);

    element.innerHTML =`
        <div class="flex justify-center items-center w-[100%] h-[100%]">
            <div class="!px-4 !py-4 bg-[var(--accent)]  rounded-2xl floating-button cursor-pointer hover:scale-102 transition-transform">
                Start a tournament
            </div>
        </div>
        `

        return element;
    }

}