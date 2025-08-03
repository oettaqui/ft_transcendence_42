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
        
        
    }

    
    // public mount(){
    //     // const el = this.render();
    //     this.onMount();
    //     // return el;
    // }

    

};