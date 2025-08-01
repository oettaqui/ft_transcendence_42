import { View } from "../app/View";


export class GameView extends View{
    
    constructor(){
        super()
    }
    render (): HTMLElement{
        
        const element = document.createElement('section');
        element.classList.add('bg-[var(--primary)]');
        element.classList.add('w-[100%]');
        element.classList.add('h-[100%]');
        element.classList.add('rounded-4xl');
        element.classList.add('!mt-[24px]');
        element.classList.add('flex');
        element.classList.add('items-cente');
        element.innerHTML = `
                    <aside class="flex flex-col justify-between w-[70%] h-[95%] gap-10 !m-auto ">
                        <div class="w-full h-[70%] bg-[var(--secondary)]">
                            <!-- bg coalition -->
                            
                            
                        </div>
                        <div class="w-[100%] h-[100%] rounded-3xl bg-[var(--secondary)]">
                                
                        </div>
                    </aside>
                    <aside class="w-[25%] h-[95%] !m-auto overflow-y-auto rounded-3xl bg-[var(--secondary)] !p-4">
                        <div class="space-y-4">
                            
                        </div>
                    </aside>
                    `;

        return element;

    }

    onMount(): void {
        this.animateProgress();
    }

    
    // public mount(){
    //     // const el = this.render();
    //     this.onMount();
    //     // return el;
    // }

    animateProgress(): void {
        const percentageElement = document.getElementById('percentageText');
        const progressFillElement = document.getElementById('progressFill');
        
        if (!percentageElement || !progressFillElement) {
            console.error('Progress elements not found');
            return;
        }
        

        const targetPercentage = parseInt(percentageElement.textContent || '0');
        
  
        percentageElement.textContent = '0%';
        progressFillElement.style.width = '0%';
        
        
        setTimeout(() => {
            progressFillElement.style.width = targetPercentage + '%';
            
           
            this.animateCounter(0, targetPercentage, 2000, (value: number) => {
                percentageElement.textContent = Math.round(value) + '%';
            });
        }, 100);
    }

    animateCounter(start: number, end: number, duration: number, callback: (value: number) => void): void {
        const startTime = performance.now();
        
        const update = () => {
            const currentTime = performance.now();
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = start + (end - start) * easeOutProgress;
            
            callback(currentValue);
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };
        
        requestAnimationFrame(update);
    }

};