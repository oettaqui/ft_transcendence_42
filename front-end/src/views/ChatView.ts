import { View } from "../app/View";


export class ChatView extends View{
    
    constructor(){
        super()
    }
    render (): HTMLElement{
        
        const element = document.createElement('section');
        element.classList.add(
        'bg-[var(--primary)]',
        'rounded-4xl',
        'w-full',
        'h-[82%]',
        '!mt-16',
        'flex',
        'flex-col',
        'lg:flex-row',
        'items-center',
        'lg:items-stretch',
        'justify-between',
        
       
        // 'overflow-hidden'
    );

        element.innerHTML = `
                <div  class="overflow-y-hidden flex justify-center items-center w-full gap-6 bg-[rgba(220,219,219,0.08)] backdrop-blur-3xl rounded-4xl border border-white/10 !px-4">

                    <div  class="flex justify-center items-center w-[100%] h-[90%] gap-2 !m-auto !py-4">
                        <!-- start section 1 -->
                        <div class=" h-[95%] w-[28%] rounded-2xl !mt-10 flex flex-col gap-5">
                            <div class="flex flex-col gap-10 sticky">
                                <div class="flex items-center gap-3">
                                    <div class="relative">
                                        <img class="w-[50px] h-[50px] rounded-full" src="../../public/assets/oettaqui.jpeg"/>
                                        <div class="absolute w-[10px] h-[10px] rounded-full bg-[var(--success)] top-1 left-10"> </div>
                                    </div>
                                    <div class="flex flex-col justify-between ">
                                        <div class="text-[12px]">Oussama Ettaqui</div>
                                        <div class="text-[12px] opacity-50">Available</div>
                                    </div>
                                    
                                </div>
                                
                                <div class="relative flex items-center gap-7">
                                    <input 
                                        type="text" 
                                        class="bg-[var(--secondary)] w-[250px] h-[40px] border border-[var(--accent)] rounded-[8px] !pl-2 !pr-12 focus:outline-none transition-all"
                                        placeholder="Search..."
                                    />
                                    <div class="rounded-full w-[45px] h-[45px] flex justify-center items-center absolute right-[50px] top-[-3px]">
                                        <i class="ti ti-search text-[22px]"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="overflow-y-auto flex flex-col gap-3 ">
                                <!-- itme 1 -->
                                <div class="unreaded-message w-[95%] relative rounded-3xl ">
                                    
                                    <div class="flex items-center justify-between backdrop-blur-3xl rounded-3xl border border-white/5 !p-3">
                                        <div class="flex items-center gap-3">
                                            <div class="relative">
                                                <img src="/public/assets/yakhay.jpeg" class="w-10 h-10 rounded-full object-cover">
                                                <div class="absolute w-[10px] h-[10px] bg-[var(--success)] rounded-full top-[70%] right-0"></div>
                                            </div>
                                            <div>
                                                <div class="flex justify-center itmes-center gap-4">
                                                    <div class="font-medium text-sm">Yassin Khay</div>
                                                    <div class="font-medium text-[10px] opacity-50">-</div>
                                                    <div class="font-medium text-[10px] opacity-50">4h</div>
                                                </div>
                                                <div class="font-medium text-[10px] opacity-50">New message</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- itme 2 -->
                                <div class="unreaded-message w-[95%] relative rounded-3xl">
                                    
                                    <div class="flex items-center justify-between backdrop-blur-3xl rounded-3xl border border-white/5 !p-3">
                                        <div class="flex items-center gap-3">
                                            <div class="relative">
                                                <img src="/public/assets/bchokri.jpeg" class="w-10 h-10 rounded-full object-cover">
                                                <div class="absolute w-[10px] h-[10px] bg-[var(--success)] rounded-full top-[70%] right-0"></div>
                                            </div>
                                            <div>
                                                <div class="flex justify-center items-center gap-4">
                                                    <div class="font-medium text-sm">Badr Chokri</div>
                                                    <div class="font-medium text-[10px] opacity-50">-</div>
                                                    <div class="font-medium text-[10px] opacity-50">24min</div>
                                                </div>
                                                <div class="font-medium text-[10px] opacity-50">New message </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        <!-- end section 1 -->
                        
                        </div>
                        <!-- start section 2 -->
                        <div class="chat backdrop-blur-3xl rounded-4xl border border-white/5 w-[40%]  flex flex-col justify-center items-center bg-[rgba(220,219,219,0.05)] !my-4">
                            <div class="flex flex-col h-[530px]">
                            <!-- header -->
                                <div class="!py-2 w-[95%] !mt-2 bg-[var(--secondary)] !m-auto border border-white/25 rounded-4xl">
                                    <div class="flex items-center gap-3 relative !ml-2">
                                        <img class="w-[43px] h-[43px] rounded-full object-cover !ml-2 !mt-1" src="../../public/assets/yakhay.jpeg"/>
                                        <div class="flex flex-col  itmes-center gap-1 !mt-1">
                                            <div class="font-medium text-sm">Yassin Khay</div>
                                            <div class="font-medium text-[10px] opacity-50">Last seen at 14:50 PM</div>
                                        </div>
                                        <div class="absolute right-5 rotate-90 text-2xl cursor-pointer">...</div>
                                    </div>
                                </div>
                                <!-- chat-messages -->
                                <div class="chat-messages flex  overflow-y-auto !p-4 !mt-4">
                                    <!-- Demo Messages -->
                                    <div class="flex flex-col gap-3">
                                        <!-- Received Message -->
                                        <div class="flex items-start gap-2">
                                            <img class="w-8 h-8 rounded-full object-cover flex-shrink-0" src="../../public/assets/yakhay.jpeg" alt="Profile"/>
                                            <div class="bg-white/10 backdrop-blur-sm rounded-2xl rounded-tl-sm !px-4 !py-2 max-w-[70%]">
                                                <p class="text-white text-sm">Hey! How are you doing today?</p>
                                                <span class="text-white/50 text-xs">2:30 PM</span>
                                            </div>
                                        </div>

                                        <!-- Sent Message -->
                                        <div class="flex items-start gap-2 justify-end">
                                            <div class="bg-[var(--accent)] backdrop-blur-sm rounded-2xl rounded-tr-sm !px-4 !py-2 max-w-[70%]">
                                                <p class="text-white text-sm">I'm doing great! Just working on some new projects. What about you?</p>
                                                <span class="text-white/70 text-xs">2:32 PM</span>
                                            </div>
                                        </div>

                                        <!-- Received Message -->
                                        <div class="flex items-start gap-2">
                                            <img class="w-8 h-8 rounded-full object-cover flex-shrink-0" src="../../public/assets/yakhay.jpeg" alt="Profile"/>
                                            <div class="bg-white/10 backdrop-blur-sm rounded-2xl rounded-tl-sm !px-4 !py-2 max-w-[70%]">
                                                <p class="text-white text-sm">That sounds exciting! I've been learning some new programming languages lately.</p>
                                                <span class="text-white/50 text-xs">2:35 PM</span>
                                            </div>
                                        </div>

                                        <!-- Sent Message -->
                                        <div class="flex items-start gap-2 justify-end">
                                            <div class="bg-[var(--accent)] backdrop-blur-sm rounded-2xl rounded-tr-sm !px-4 !py-2 max-w-[70%]">
                                                <p class="text-white text-sm">Nice! Which ones are you focusing on?</p>
                                                <span class="text-white/70 text-xs">2:36 PM</span>
                                            </div>
                                        </div>

                                        <!-- Received Message -->
                                        <div class="flex items-start gap-2">
                                            <img class="w-8 h-8 rounded-full object-cover flex-shrink-0" src="../../public/assets/yakhay.jpeg" alt="Profile"/>
                                            <div class="bg-white/10 backdrop-blur-sm rounded-2xl rounded-tl-sm !px-4 !py-2 max-w-[70%]">
                                                <p class="text-white text-sm">Hey! How are you doing today?</p>
                                                <span class="text-white/50 text-xs">2:30 PM</span>
                                            </div>
                                        </div>

                                        <!-- Sent Message -->
                                        <div class="flex items-start gap-2 justify-end">
                                            <div class="bg-[var(--accent)] backdrop-blur-sm rounded-2xl rounded-tr-sm !px-4 !py-2 max-w-[70%]">
                                                <p class="text-white text-sm">I'm doing great! Just working on some new projects. What about you?</p>
                                                <span class="text-white/70 text-xs">2:32 PM</span>
                                            </div>
                                        </div>

                                        <!-- Received Message -->
                                        <div class="flex items-start gap-2">
                                            <img class="w-8 h-8 rounded-full object-cover flex-shrink-0" src="../../public/assets/yakhay.jpeg" alt="Profile"/>
                                            <div class="bg-white/10 backdrop-blur-sm rounded-2xl rounded-tl-sm !px-4 !py-2 max-w-[70%]">
                                                <p class="text-white text-sm">That sounds exciting! I've been learning some new programming languages lately.</p>
                                                <span class="text-white/50 text-xs">2:35 PM</span>
                                            </div>
                                        </div>

                                        <!-- Sent Message -->
                                        <div class="flex items-start gap-2 justify-end">
                                            <div class="bg-[var(--accent)] backdrop-blur-sm rounded-2xl rounded-tr-sm !px-4 !py-2 max-w-[70%]">
                                                <p class="text-white text-sm">Nice! Which ones are you focusing on?</p>
                                                <span class="text-white/70 text-xs">2:36 PM</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- input -->

                                <div class="!p-4">
                                    <div class="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full !px-4 !py-2 border border-white/20">
                                        <input 
                                            type="text" 
                                            placeholder="Type a message..." 
                                            class="flex-1 bg-transparent text-white placeholder-white/50 outline-none text-sm !py-2"
                                            
                                            id="messageInput"
                                        />
                                        <button class="text-[var(--accent)] hover:text-[var(--accent-hover)] cursor-pointer transition-colors">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                            </div>

                        </div>
                    <!-- end section 3-->
                    
                       <div class="w-[30%] h-full flex flex-col items-center gap-3 max-h-[100%]">
                            <div class="text-center text-white text-lg font-semibold glass-effect !px-6 !py-5 rounded-2xl modern-shadow header-hover border border-white/10">
                                <div class="flex items-center justify-center gap-3">
                                    <i class="ti ti-history text-xl text-blue-400"></i>
                                    <span>Matches History</span>
                                </div>
                            </div>
                                <div class="list-history-cards flex flex-col items-center justify-start overflow-y-auto gap-4  ">

                                    <!-- item-1 -->
                                    <div class="card-hover !px-2 bg-gradient-to-br from-[var(--secondary)] to-[var(--primary)] backdrop-blur-lg rounded-2xl border border-white/10 !p-4 w-[250px] h-20">
                                        <div class="flex items-center justify-between h-full">
                                            
                                            <div class="winner-side flex items-center space-x-3">
                                                <img src="../../public/assets/oettaqui.jpeg" 
                                                    alt="Player 1" 
                                                    class="player-image w-12 h-12 rounded-full object-cover border-3">
                                
                                            </div>
                                            
                                            <div class="flex items-center space-x-4">
                                                <div class="winner-gradient text-white text-xl font-bold w-8 h-8 rounded-lg flex items-center justify-center">
                                                    3
                                                </div>
                                                
                                                <div class="vs-glow text-white text-lg font-bold tracking-wider !px-2">
                                                    VS
                                                </div>
                                                
                                                <div class="loser-gradient text-white text-xl font-bold w-8 h-8 rounded-lg flex items-center justify-center">
                                                    1
                                                </div>
                                            </div>
                                            
                                            <div class="loser-side flex items-center space-x-3">
                                                
                                                <img src="../../public/assets/yakhay.jpeg" 
                                                    alt="Player 2" 
                                                    class="player-image w-12 h-12 rounded-full object-cover border-3">
                                            </div>
                                            
                                        </div>
                                    </div>
                                     <!-- item-2 -->
                                    <div class="card-hover !px-2 bg-gradient-to-br from-[var(--secondary)] to-[var(--primary)] backdrop-blur-lg rounded-2xl border border-white/10 !p-4 w-[250px] h-20">
                                        <div class="flex items-center justify-between h-full">
                                            
                                            <div class="winner-side flex items-center space-x-3">
                                                <img src="../../public/assets/oettaqui.jpeg" 
                                                    alt="Player 1" 
                                                    class="player-image w-12 h-12 rounded-full object-cover border-3">
                                
                                            </div>
                                            
                                            <div class="flex items-center space-x-4">
                                                <div class="winner-gradient text-white text-xl font-bold w-8 h-8 rounded-lg flex items-center justify-center">
                                                    3
                                                </div>
                                                
                                                <div class="vs-glow text-white text-lg font-bold tracking-wider !px-2">
                                                    VS
                                                </div>
                                                
                                                <div class="loser-gradient text-white text-xl font-bold w-8 h-8 rounded-lg flex items-center justify-center">
                                                    1
                                                </div>
                                            </div>
                                            
                                            <div class="loser-side flex items-center space-x-3">
                                                
                                                <img src="../../public/assets/yakhay.jpeg" 
                                                    alt="Player 2" 
                                                    class="player-image w-12 h-12 rounded-full object-cover border-3">
                                            </div>
                                            
                                        </div>
                                    </div>
                                     <!-- item-3 -->
                                    <div class="card-hover !px-2 bg-gradient-to-br from-[var(--secondary)] to-[var(--primary)] backdrop-blur-lg rounded-2xl border border-white/10 !p-4 w-[250px] h-20">
                                        <div class="flex items-center justify-between h-full">
                                            
                                            <div class="winner-side flex items-center space-x-3">
                                                <img src="../../public/assets/oettaqui.jpeg" 
                                                    alt="Player 1" 
                                                    class="player-image w-12 h-12 rounded-full object-cover border-3">
                                
                                            </div>
                                            
                                            <div class="flex items-center space-x-4">
                                                <div class="winner-gradient text-white text-xl font-bold w-8 h-8 rounded-lg flex items-center justify-center">
                                                    3
                                                </div>
                                                
                                                <div class="vs-glow text-white text-lg font-bold tracking-wider !px-2">
                                                    VS
                                                </div>
                                                
                                                <div class="loser-gradient text-white text-xl font-bold w-8 h-8 rounded-lg flex items-center justify-center">
                                                    1
                                                </div>
                                            </div>
                                            
                                            <div class="loser-side flex items-center space-x-3">
                                                
                                                <img src="../../public/assets/yakhay.jpeg" 
                                                    alt="Player 2" 
                                                    class="player-image w-12 h-12 rounded-full object-cover border-3">
                                            </div>
                                            
                                        </div>
                                    </div>
                                     <!-- item-4 -->
                                    <div class="card-hover !px-2 bg-gradient-to-br from-[var(--secondary)] to-[var(--primary)] backdrop-blur-lg rounded-2xl border border-white/10 !p-4 w-[250px] h-20">
                                        <div class="flex items-center justify-between h-full">
                                            
                                            <div class="winner-side flex items-center space-x-3">
                                                <img src="../../public/assets/oettaqui.jpeg" 
                                                    alt="Player 1" 
                                                    class="player-image w-12 h-12 rounded-full object-cover border-3">
                                
                                            </div>
                                            
                                            <div class="flex items-center space-x-4">
                                                <div class="winner-gradient text-white text-xl font-bold w-8 h-8 rounded-lg flex items-center justify-center">
                                                    3
                                                </div>
                                                
                                                <div class="vs-glow text-white text-lg font-bold tracking-wider !px-2">
                                                    VS
                                                </div>
                                                
                                                <div class="loser-gradient text-white text-xl font-bold w-8 h-8 rounded-lg flex items-center justify-center">
                                                    1
                                                </div>
                                            </div>
                                            
                                            <div class="loser-side flex items-center space-x-3">
                                                
                                                <img src="../../public/assets/yakhay.jpeg" 
                                                    alt="Player 2" 
                                                    class="player-image w-12 h-12 rounded-full object-cover border-3">
                                            </div>
                                            
                                        </div>
                                    </div>
                                    <!-- item-5 -->
                                    <div class="card-hover !px-2 bg-gradient-to-br from-[var(--secondary)] to-[var(--primary)] backdrop-blur-lg rounded-2xl border border-white/10 !p-4 w-[250px] h-20">
                                        <div class="flex items-center justify-between h-full">
                                            
                                            <div class="winner-side flex items-center space-x-3">
                                                <img src="../../public/assets/oettaqui.jpeg" 
                                                    alt="Player 1" 
                                                    class="player-image w-12 h-12 rounded-full object-cover border-3">
                                
                                            </div>
                                            
                                            <div class="flex items-center space-x-4">
                                                <div class="winner-gradient text-white text-xl font-bold w-8 h-8 rounded-lg flex items-center justify-center">
                                                    3
                                                </div>
                                                
                                                <div class="vs-glow text-white text-lg font-bold tracking-wider !px-2">
                                                    VS
                                                </div>
                                                
                                                <div class="loser-gradient text-white text-xl font-bold w-8 h-8 rounded-lg flex items-center justify-center">
                                                    1
                                                </div>
                                            </div>
                                            
                                            <div class="loser-side flex items-center space-x-3">
                                                
                                                <img src="../../public/assets/yakhay.jpeg" 
                                                    alt="Player 2" 
                                                    class="player-image w-12 h-12 rounded-full object-cover border-3">
                                            </div>
                                            
                                        </div>
                                        
                                    </div>


                                    <!-- item-5 -->
                                    <div class="card-hover !px-2 bg-gradient-to-br from-[var(--secondary)] to-[var(--primary)] backdrop-blur-lg rounded-2xl border border-white/10 !p-4 w-[250px] h-20">
                                        <div class="flex items-center justify-between h-full">
                                            
                                            <div class="winner-side flex items-center space-x-3">
                                                <img src="../../public/assets/oettaqui.jpeg" 
                                                    alt="Player 1" 
                                                    class="player-image w-12 h-12 rounded-full object-cover border-3">
                                
                                            </div>
                                            
                                            <div class="flex items-center space-x-4">
                                                <div class="winner-gradient text-white text-xl font-bold w-8 h-8 rounded-lg flex items-center justify-center">
                                                    3
                                                </div>
                                                
                                                <div class="vs-glow text-white text-lg font-bold tracking-wider !px-2">
                                                    VS
                                                </div>
                                                
                                                <div class="loser-gradient text-white text-xl font-bold w-8 h-8 rounded-lg flex items-center justify-center">
                                                    1
                                                </div>
                                            </div>
                                            
                                            <div class="loser-side flex items-center space-x-3">
                                                
                                                <img src="../../public/assets/yakhay.jpeg" 
                                                    alt="Player 2" 
                                                    class="player-image w-12 h-12 rounded-full object-cover border-3">
                                            </div>
                                            
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    
                    
                    </div>
                `;

        return element;

    }

    public onMount(): void {
       
        this.setupTabFiltering()
        
    }
   
    
    
    

private setupTabFiltering(): void {
    const buttons = document.querySelectorAll('.tab-btn');
    const items = document.querySelectorAll('[data-category]');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // const selected = button.textContent?.toLowerCase();

            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            
        });
    });

}


};






    // render (): HTMLElement{
        
    //     const element = document.createElement('section');
    //     element.classList.add('bg-[var(--primary)]');
    //     element.classList.add('w-[100%]');
    //     element.classList.add('h-[80%]');
    //     element.classList.add('rounded-4xl');
    //     element.classList.add('!mt-[24px]');
    //     element.classList.add('flex');
    //     element.classList.add('items-cente');

    //     element.innerHTML = `
    //                 <div  class="overflow-y-hidden w-full h-full gap-2 !m-auto bg-[rgba(220,219,219,0.08)] backdrop-blur-3xl rounded-4xl border border-white/10">
    //                     <div  class="flex justify-center items-center w-[95%] h-[100%] gap-2 !m-auto">
                            // <div class=" h-[95%] w-[65%] rounded-2xl !mt-10 flex flex-col gap-5">
                            //     <div class="flex flex-col gap-10 sticky">
                            //         <div class="flex items-center gap-3">
                            //             <div class="relative">
                            //                 <img class="w-[50px] h-[50px] rounded-full" src="../../public/assets/oettaqui.jpeg"/>
                            //                 <div class="absolute w-[10px] h-[10px] rounded-full bg-[var(--success)] top-1 left-10"> </div>
                            //             </div>
                            //             <div class="flex flex-col justify-between ">
                            //                 <div class="text-[12px]">Oussama Ettaqui</div>
                            //                 <div class="text-[12px] opacity-50">Available</div>
                            //             </div>
                                        
                            //         </div>
                                    
                            //         <div class="relative flex items-center gap-7">
                            //             <input 
                            //                 type="text" 
                            //                 class="bg-[var(--secondary)] w-[350px] h-[40px] border border-[var(--accent)] rounded-[8px] !pl-2 !pr-12 focus:outline-none transition-all"
                            //                 placeholder="Search..."
                            //             />
                            //             <div class="rounded-full w-[45px] h-[45px] flex justify-center items-center absolute right-[60px] top-[-3px]">
                            //                 <i class="ti ti-search text-[22px]"></i>
                            //             </div>
                            //         </div>
                            //     </div>
                                // <!-- itme 1 -->
                                // <div class="overflow-y-auto flex flex-col gap-3">
                                //     <div class="w-[90%]  relative ">
                                //         <div class="absolute text-[11px] min-w-[20px] h-[20px] px-[6px] bg-[var(--accent)] text-black rounded-full right-3 top-5 flex justify-center items-center">
                                //             <span class="leading-none whitespace-nowrap text-[var(--text)]">2</span>
                                //         </div>
                                //         <div class="flex items-center justify-between backdrop-blur-3xl rounded-3xl border border-white/5 !p-3">
                                //             <div class="flex items-center gap-3">
                                //                 <div class="relative">
                                //                     <img src="/public/assets/yakhay.jpeg" class="w-10 h-10 rounded-full object-cover">
                                //                     <div class="absolute w-[10px] h-[10px] bg-[var(--success)] rounded-full top-[70%] right-0"></div>
                                //                 </div>
                                //                 <div>
                                //                     <div class="flex justify-center itmes-center gap-4">
                                //                         <div class="font-medium text-sm">Yassin Khay</div>
                                //                         <div class="font-medium text-[10px] opacity-50">-</div>
                                //                         <div class="font-medium text-[10px] opacity-50">4h</div>
                                //                     </div>
                                //                     <div class="font-medium text-[10px] opacity-50">Wesh a bro !</div>
                                //                 </div>
                                //             </div>
                                //         </div>
                                //     </div>
                                //     <!-- itme 2 -->
                                //     <div class="w-[90%] relative">
                                //     <div class="absolute text-[11px] min-w-[20px] h-[20px] px-[6px] bg-[var(--accent)] rounded-full right-3 top-5 flex justify-center items-center">
                                //             <span class="leading-none whitespace-nowrap text-[var(--text)]">1</span>
                                //         </div>
                                //         <div class="flex items-center justify-between backdrop-blur-3xl rounded-3xl border border-white/5 !p-3">
                                //             <div class="flex items-center gap-3">
                                //                 <div class="relative">
                                //                     <img src="/public/assets/bchokri.jpeg" class="w-10 h-10 rounded-full object-cover">
                                //                     <div class="absolute w-[10px] h-[10px] bg-[var(--success)] rounded-full top-[70%] right-0"></div>
                                //                 </div>
                                //                 <div>
                                //                     <div class="flex justify-center itmes-center gap-4">
                                //                         <div class="font-medium text-sm">Badr Chokri</div>
                                //                         <div class="font-medium text-[10px] opacity-50">-</div>
                                //                         <div class="font-medium text-[10px] opacity-50">24min</div>
                                //                     </div>
                                //                     <div class="font-medium text-[10px] opacity-50">Dakchi ra ghadi mzyan </div>
                                //                 </div>
                                //             </div>
                                //         </div>
                                //     </div>

                                    

    //                             </div>
    //                         </div>
                            // <div class="chat backdrop-blur-3xl rounded-4xl border border-white/5 h-[95%] w-[95%]">
                            //     <div class="flex flex-col h-full">
                            //     <!-- header -->
                            //         <div class="!py-2 w-[95%] !mt-2 bg-[var(--secondary)] !m-auto border border-white/25 rounded-4xl">
                            //             <div class="flex items-center gap-3 relative !ml-2">
                            //                 <img class="w-[43px] h-[43px] rounded-full object-cover !ml-2 !mt-1" src="../../public/assets/yakhay.jpeg"/>
                            //                 <div class="flex flex-col  itmes-center gap-1 !mt-1">
                            //                     <div class="font-medium text-sm">Yassin Khay</div>
                            //                     <div class="font-medium text-[10px] opacity-50">Last seen at 14:50 PM</div>
                            //                 </div>
                            //                 <div class="absolute right-5 rotate-90 text-2xl cursor-pointer">...</div>
                            //             </div>
                            //         </div>
                            //         <!-- chat-messages -->
                            //         <div class="chat-messages flex  overflow-y-auto  !p-4 h-[calc(95vh-120px)] !mt-4">
                            //             <!-- Demo Messages -->
                            //             <div class="flex flex-col gap-3">
                            //                 <!-- Received Message -->
                            //                 <div class="flex items-start gap-2">
                            //                     <img class="w-8 h-8 rounded-full object-cover flex-shrink-0" src="../../public/assets/yakhay.jpeg" alt="Profile"/>
                            //                     <div class="bg-white/10 backdrop-blur-sm rounded-2xl rounded-tl-sm !px-4 !py-2 max-w-[70%]">
                            //                         <p class="text-white text-sm">Hey! How are you doing today?</p>
                            //                         <span class="text-white/50 text-xs">2:30 PM</span>
                            //                     </div>
                            //                 </div>

                            //                 <!-- Sent Message -->
                            //                 <div class="flex items-start gap-2 justify-end">
                            //                     <div class="bg-[var(--accent)] backdrop-blur-sm rounded-2xl rounded-tr-sm !px-4 !py-2 max-w-[70%]">
                            //                         <p class="text-white text-sm">I'm doing great! Just working on some new projects. What about you?</p>
                            //                         <span class="text-white/70 text-xs">2:32 PM</span>
                            //                     </div>
                            //                 </div>

                            //                 <!-- Received Message -->
                            //                 <div class="flex items-start gap-2">
                            //                     <img class="w-8 h-8 rounded-full object-cover flex-shrink-0" src="../../public/assets/yakhay.jpeg" alt="Profile"/>
                            //                     <div class="bg-white/10 backdrop-blur-sm rounded-2xl rounded-tl-sm !px-4 !py-2 max-w-[70%]">
                            //                         <p class="text-white text-sm">That sounds exciting! I've been learning some new programming languages lately.</p>
                            //                         <span class="text-white/50 text-xs">2:35 PM</span>
                            //                     </div>
                            //                 </div>

                            //                 <!-- Sent Message -->
                            //                 <div class="flex items-start gap-2 justify-end">
                            //                     <div class="bg-[var(--accent)] backdrop-blur-sm rounded-2xl rounded-tr-sm !px-4 !py-2 max-w-[70%]">
                            //                         <p class="text-white text-sm">Nice! Which ones are you focusing on?</p>
                            //                         <span class="text-white/70 text-xs">2:36 PM</span>
                            //                     </div>
                            //                 </div>

                            //                 <!-- Received Message -->
                            //                 <div class="flex items-start gap-2">
                            //                     <img class="w-8 h-8 rounded-full object-cover flex-shrink-0" src="../../public/assets/yakhay.jpeg" alt="Profile"/>
                            //                     <div class="bg-white/10 backdrop-blur-sm rounded-2xl rounded-tl-sm !px-4 !py-2 max-w-[70%]">
                            //                         <p class="text-white text-sm">Hey! How are you doing today?</p>
                            //                         <span class="text-white/50 text-xs">2:30 PM</span>
                            //                     </div>
                            //                 </div>

                            //                 <!-- Sent Message -->
                            //                 <div class="flex items-start gap-2 justify-end">
                            //                     <div class="bg-[var(--accent)] backdrop-blur-sm rounded-2xl rounded-tr-sm !px-4 !py-2 max-w-[70%]">
                            //                         <p class="text-white text-sm">I'm doing great! Just working on some new projects. What about you?</p>
                            //                         <span class="text-white/70 text-xs">2:32 PM</span>
                            //                     </div>
                            //                 </div>

                            //                 <!-- Received Message -->
                            //                 <div class="flex items-start gap-2">
                            //                     <img class="w-8 h-8 rounded-full object-cover flex-shrink-0" src="../../public/assets/yakhay.jpeg" alt="Profile"/>
                            //                     <div class="bg-white/10 backdrop-blur-sm rounded-2xl rounded-tl-sm !px-4 !py-2 max-w-[70%]">
                            //                         <p class="text-white text-sm">That sounds exciting! I've been learning some new programming languages lately.</p>
                            //                         <span class="text-white/50 text-xs">2:35 PM</span>
                            //                     </div>
                            //                 </div>

                            //                 <!-- Sent Message -->
                            //                 <div class="flex items-start gap-2 justify-end">
                            //                     <div class="bg-[var(--accent)] backdrop-blur-sm rounded-2xl rounded-tr-sm !px-4 !py-2 max-w-[70%]">
                            //                         <p class="text-white text-sm">Nice! Which ones are you focusing on?</p>
                            //                         <span class="text-white/70 text-xs">2:36 PM</span>
                            //                     </div>
                            //                 </div>
                            //             </div>
                            //         </div>
                            //         <!-- input -->

                            //         <div class="!p-4">
                            //             <div class="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full !px-4 !py-2 border border-white/20">
                            //                 <input 
                            //                     type="text" 
                            //                     placeholder="Type a message..." 
                            //                     class="flex-1 bg-transparent text-white placeholder-white/50 outline-none text-sm !py-2"
                                              
                            //                     id="messageInput"
                            //                 />
                            //                 <button class="text-[var(--accent)] hover:text-[var(--accent-hover)] cursor-pointer transition-colors">
                            //                     <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            //                         <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                            //                     </svg>
                            //                 </button>
                            //             </div>
                            //         </div>

                            //     </div>

                            // </div>
                            // <div class="backdrop-blur-3xl rounded-4xl border border-white/10 h-[95%] w-[60%]  flex flex-col gap-6">
                            //     <div class="stiky flex flex-col gap-15">
                            //         <header class="relative w-full">
                            //             <img class="w-full h-[150px] object-cover rounded-t-4xl" src="../../public/assets/Freax_BG.jpg" alt="Background"/>
                                        
                            //             <div class="absolute left-1/2 top-22 transform -translate-x-1/2 cursor-pointer">
                            //                 <img class="w-[100px] h-[100px] rounded-full object-cover" 
                            //                     src="../../public/assets/yakhay.jpeg" 
                            //                     alt="Profile"/>
                            //             </div>
                            //         </header>
                            //         <div class="rounded-4xl border border-white/30 w-[70%] h-[50px] !m-auto  flex justify-around items-center">
                            //             <i class="ti ti-user-cancel text-3xl font-light text-[var(--text-secondary)] cursor-pointer hover:text-[var(--danger)]"></i>
                            //             <div class="w-[2px] h-7 bg-[var(--text-secondary)]"></div>
                            //             <i class="ti ti-device-gamepad-2 text-3xl font-light text-[var(--text-secondary)] cursor-pointer hover:text-[var(--accent)]"></i>
                            //         </div>
                            //     </div>
                                // <div class="flex-1 flex flex-col items-center gap-3 min-h-0">
                                //     <div class="text-center text-white text-lg font-semibold">Matches history</div>
                                //         <div class="list-history-cards flex flex-col items-center overflow-y-auto gap-4 !pr-2 ">
                                        // <!-- item-1 -->
                                        // <div class="card-hover !px-2 bg-gradient-to-br from-[var(--secondary)] to-[var(--primary)] backdrop-blur-lg rounded-2xl border border-white/10 !p-4 w-80 h-24">
                                        //     <div class="flex items-center justify-between h-full">
                                                
                                        //         <div class="winner-side flex items-center space-x-3">
                                        //             <img src="../../public/assets/oettaqui.jpeg" 
                                        //                 alt="Player 1" 
                                        //                 class="player-image w-12 h-12 rounded-full object-cover border-3">
                                    
                                        //         </div>
                                                
                                        //         <div class="flex items-center space-x-4">
                                        //             <div class="winner-gradient text-white text-xl font-bold w-8 h-8 rounded-lg flex items-center justify-center">
                                        //                 3
                                        //             </div>
                                                    
                                        //             <div class="vs-glow text-white text-lg font-bold tracking-wider !px-2">
                                        //                 VS
                                        //             </div>
                                                    
                                        //             <div class="loser-gradient text-white text-xl font-bold w-8 h-8 rounded-lg flex items-center justify-center">
                                        //                 1
                                        //             </div>
                                        //         </div>
                                                
                                        //         <div class="loser-side flex items-center space-x-3">
                                                    
                                        //             <img src="../../public/assets/yakhay.jpeg" 
                                        //                 alt="Player 2" 
                                        //                 class="player-image w-12 h-12 rounded-full object-cover border-3">
                                        //         </div>
                                                
                                        //     </div>
                                        // </div>
                            //             <!-- item-2 -->

                            //              <div class="card-hover !px-2 bg-gradient-to-br from-[var(--secondary)] to-[var(--primary)] backdrop-blur-lg rounded-2xl border border-white/10 !p-4 w-80 h-24">
                            //                 <div class="flex items-center justify-between h-full">
                                                
                            //                     <div class="loser-side flex items-center space-x-3">
                            //                         <img src="../../public/assets/oettaqui.jpeg" 
                            //                             alt="Player 1" 
                            //                             class="player-image w-12 h-12 rounded-full object-cover border-3">
                                    
                            //                     </div>
                                                
                            //                     <div class="flex items-center space-x-4">
                            //                         <div class="loser-gradient text-white text-xl font-bold w-8 h-8 rounded-lg flex items-center justify-center">
                            //                             2
                            //                         </div>
                                                    
                            //                         <div class="vs-glow text-white text-lg font-bold tracking-wider !px-2">
                            //                             VS
                            //                         </div>
                                                    
                            //                         <div class="winner-gradient text-white text-xl font-bold w-8 h-8 rounded-lg flex items-center justify-center">
                            //                             3
                            //                         </div>
                            //                     </div>
                                                
                            //                     <div class="winner-side flex items-center space-x-3">
                                                    
                            //                         <img src="../../public/assets/yakhay.jpeg" 
                            //                             alt="Player 2" 
                            //                             class="player-image w-12 h-12 rounded-full object-cover border-3">
                            //                     </div>
                                                
                            //                 </div>
                            //             </div>

                            //              <!-- item-3 -->

                            //              <div class="card-hover !px-2 bg-gradient-to-br from-[var(--secondary)] to-[var(--primary)] backdrop-blur-lg rounded-2xl border border-white/10 !p-4 w-80 h-24">
                            //                 <div class="flex items-center justify-between h-full">
                                                
                            //                     <div class="winner-side flex items-center space-x-3">
                            //                         <img src="../../public/assets/oettaqui.jpeg" 
                            //                             alt="Player 1" 
                            //                             class="player-image w-12 h-12 rounded-full object-cover border-3">
                                    
                            //                     </div>
                                                
                            //                     <div class="flex items-center space-x-4">
                            //                         <div class="winner-gradient text-white text-xl font-bold w-8 h-8 rounded-lg flex items-center justify-center">
                            //                             3
                            //                         </div>
                                                    
                            //                         <div class="vs-glow text-white text-lg font-bold tracking-wider !px-2">
                            //                             VS
                            //                         </div>
                                                    
                            //                         <div class="loser-gradient text-white text-xl font-bold w-8 h-8 rounded-lg flex items-center justify-center">
                            //                             1
                            //                         </div>
                            //                     </div>
                                                
                            //                     <div class="loser-side flex items-center space-x-3">
                                                    
                            //                         <img src="../../public/assets/yakhay.jpeg" 
                            //                             alt="Player 2" 
                            //                             class="player-image w-12 h-12 rounded-full object-cover border-3">
                            //                     </div>
                                                
                            //                 </div>
                            //             </div>
                            //              <!-- item-4 -->

                            //              <div class="card-hover !px-2 bg-gradient-to-br from-[var(--secondary)] to-[var(--primary)] backdrop-blur-lg rounded-2xl border border-white/10 !p-4 w-80 h-24">
                            //                 <div class="flex items-center justify-between h-full">
                                                
                            //                     <div class="loser-side flex items-center space-x-3">
                            //                         <img src="../../public/assets/oettaqui.jpeg" 
                            //                             alt="Player 1" 
                            //                             class="player-image w-12 h-12 rounded-full object-cover border-3">
                                    
                            //                     </div>
                                                
                            //                     <div class="flex items-center space-x-4">
                            //                         <div class="loser-gradient text-white text-xl font-bold w-8 h-8 rounded-lg flex items-center justify-center">
                            //                             3
                            //                         </div>
                                                    
                            //                         <div class="vs-glow text-white text-lg font-bold tracking-wider !px-2">
                            //                             VS
                            //                         </div>
                                                    
                            //                         <div class="winner-gradient text-white text-xl font-bold w-8 h-8 rounded-lg flex items-center justify-center">
                            //                             4
                            //                         </div>
                            //                     </div>
                                                
                            //                     <div class="winner-side flex items-center space-x-3">
                                                    
                            //                         <img src="../../public/assets/yakhay.jpeg" 
                            //                             alt="Player 2" 
                            //                             class="player-image w-12 h-12 rounded-full object-cover border-3">
                            //                     </div>
                                                
                            //                 </div>
                            //             </div>
                            //              <!-- item-5 -->

                            //              <div class="card-hover !px-2 bg-gradient-to-br from-[var(--secondary)] to-[var(--primary)] backdrop-blur-lg rounded-2xl border border-white/10 !p-4 w-80 h-24">
                            //                 <div class="flex items-center justify-between h-full">
                                                
                            //                     <!-- Winner Side (Left Player) -->
                            //                     <div class="winner-side flex items-center space-x-3">
                            //                         <img src="../../public/assets/oettaqui.jpeg" 
                            //                             alt="Player 1" 
                            //                             class="player-image w-12 h-12 rounded-full object-cover border-3">
                                    
                            //                     </div>
                                                
                            //                     <div class="flex items-center space-x-4">
                            //                         <div class="winner-gradient text-white text-xl font-bold w-8 h-8 rounded-lg flex items-center justify-center">
                            //                             3
                            //                         </div>
                                                    
                            //                         <div class="vs-glow text-white text-lg font-bold tracking-wider !px-2">
                            //                             VS
                            //                         </div>
                                                    
                            //                         <div class="loser-gradient text-white text-xl font-bold w-8 h-8 rounded-lg flex items-center justify-center">
                            //                             1
                            //                         </div>
                            //                     </div>
                                                
                            //                     <div class="loser-side flex items-center space-x-3">
                                                    
                            //                         <img src="../../public/assets/yakhay.jpeg" 
                            //                             alt="Player 2" 
                            //                             class="player-image w-12 h-12 rounded-full object-cover border-3">
                            //                     </div>
                                                
                            //                 </div>
                            //             </div>
                            //             <!-- item-6 -->

                            //              <div class="card-hover !px-2 bg-gradient-to-br from-[var(--secondary)] to-[var(--primary)] backdrop-blur-lg rounded-2xl border border-white/10 !p-4 w-80 h-24">
                            //                 <div class="flex items-center justify-between h-full">
                                                
                            //                     <div class="loser-side flex items-center space-x-3">
                            //                         <img src="../../public/assets/oettaqui.jpeg" 
                            //                             alt="Player 1" 
                            //                             class="player-image w-12 h-12 rounded-full object-cover border-3">
                                    
                            //                     </div>
                                                
                            //                     <div class="flex items-center space-x-4">
                            //                         <div class="loser-gradient text-white text-xl font-bold w-8 h-8 rounded-lg flex items-center justify-center">
                            //                             2
                            //                         </div>
                                                    
                            //                         <div class="vs-glow text-white text-lg font-bold tracking-wider !px-2">
                            //                             VS
                            //                         </div>
                                                    
                            //                         <div class="winner-gradient text-white text-xl font-bold w-8 h-8 rounded-lg flex items-center justify-center">
                            //                             5
                            //                         </div>
                            //                     </div>
                                                
                            //                     <div class="loser-side flex items-center space-x-3">
                                                    
                            //                         <img src="../../public/assets/yakhay.jpeg" 
                            //                             alt="Player 2" 
                            //                             class="player-image w-12 h-12 rounded-full object-cover border-3">
                            //                     </div>
                                                
                            //                 </div>
                            //             </div>
                            //             <!-- end itmes-->


                            //         </div>
                            //     </div>
                                 
         
                            // </div>



                            
    //                     </div>
    //                 </div>
    //                 `;

    //     return element;

    // }