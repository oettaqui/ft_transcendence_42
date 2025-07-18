import { View } from "../app/View";


export class DashboardView extends View {
    constructor() {
        super();
    }

    render (): HTMLElement{
        const element = document.createElement('div');
        element.innerHTML = `
            <div class= "max-w-[90%] !m-auto">
                <main class="flex h-[100vh] !p-24">
                    <aside class="w-[100px] flex flex-col items-center  gap-52  ">
                        <div class="">
                            <h1 class="text-4xl font-bold text-[var(--accent)]">P</h1>
                        </div>
                        
                        <nav class="">
                            <div class="">
                                <ul class="flex flex-col itmes-center justify-center gap-10">
                                    <li>
                                        <a href="#" class="flex items-cente justify-center !px-3 !py-2 text-[var(--text)] rounded-lg hover:bg-[var(--accent)] transition-colors">
                                            <svg class="w-8 h-8 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                                            </svg>
                                            
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" class="flex items-cente justify-center !px-3 !py-2 text-[var(--text)] rounded-lg hover:bg-[var(--accent)] transition-colors">
                                            <svg class="w-8 h-8 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                                            </svg>
                                            
                                        </a>
                                    </li>
                                   
                                    <li>
                                        <a href="#" class="flex items-center justify-center !px-3 !py-2 text-[var(--text)] rounded-lg hover:bg-[var(--accent)] transition-colors">
                                            <svg class="w-8 h-8 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                                            </svg>
                                            
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" class="flex items-center justify-center !px-3 !py-2 text-[var(--text)] rounded-lg hover:bg-[var(--accent)] transition-colors">
                                            <svg class="w-8 h-8 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                            </svg>
                                            
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" class="flex items-center justify-center !px-3 !py-2 text-[var(--text)] rounded-lg hover:bg-[var(--accent)] transition-colors">
                                            <svg class="w-8 h-8 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            </svg>
                                            
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                    </aside>
 
                </main>
            </div>
        `;
        return element;
    }

}

//  <!-- Main Content Area -->
//         <section class="flex-1 overflow-y-auto">
//             <!-- Header -->
//             <header class="bg-white shadow-sm border-b border-gray-200 !px-6 !py-4">
//                 <div class="flex justify-between items-center">
//                     <h2 class="text-2xl font-semibold text-gray-800">Welcome Back</h2>
//                     <div class="flex items-center space-x-4">
//                         <button class="!p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100">
//                             <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5z"></path>
//                                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 19h16"></path>
//                                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 15h16"></path>
//                                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 11h16"></path>
//                             </svg>
//                         </button>
//                         <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
//                             <span class="text-white text-sm font-medium">JD</span>
//                         </div>
//                     </div>
//                 </div>
//             </header>

//             <!-- Content Area -->
//             <div class="!p-6">
//                 <!-- Stats Cards -->
//                 <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 !mb-8">
//                     <div class="bg-white !p-6 rounded-lg shadow-sm border border-gray-200">
//                         <div class="flex items-center justify-between">
//                             <div>
//                                 <p class="text-sm text-gray-600">Total Users</p>
//                                 <p class="text-2xl font-bold text-gray-900">1,234</p>
//                             </div>
//                             <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
//                                 <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
//                                 </svg>
//                             </div>
//                         </div>
//                     </div>

//                     <div class="bg-white !p-6 rounded-lg shadow-sm border border-gray-200">
//                         <div class="flex items-center justify-between">
//                             <div>
//                                 <p class="text-sm text-gray-600">Revenue</p>
//                                 <p class="text-2xl font-bold text-gray-900">$45,678</p>
//                             </div>
//                             <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
//                                 <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
//                                 </svg>
//                             </div>
//                         </div>
//                     </div>

//                     <div class="bg-white !p-6 rounded-lg shadow-sm border border-gray-200">
//                         <div class="flex items-center justify-between">
//                             <div>
//                                 <p class="text-sm text-gray-600">Orders</p>
//                                 <p class="text-2xl font-bold text-gray-900">890</p>
//                             </div>
//                             <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
//                                 <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
//                                 </svg>
//                             </div>
//                         </div>
//                     </div>

//                     <div class="bg-white !p-6 rounded-lg shadow-sm border border-gray-200">
//                         <div class="flex items-center justify-between">
//                             <div>
//                                 <p class="text-sm text-gray-600">Growth</p>
//                                 <p class="text-2xl font-bold text-gray-900">+12%</p>
//                             </div>
//                             <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
//                                 <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
//                                 </svg>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 <!-- Content Sections -->
//                 <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                     <!-- Recent Activity -->
//                     <div class="bg-white !p-6 rounded-lg shadow-sm border border-gray-200">
//                         <h3 class="text-lg font-semibold text-gray-900 !mb-4">Recent Activity</h3>
//                         <div class="space-y-4">
//                             <div class="flex items-center space-x-3">
//                                 <div class="w-2 h-2 bg-green-500 rounded-full"></div>
//                                 <p class="text-sm text-gray-700">New user registered</p>
//                                 <span class="text-xs text-gray-500 !ml-auto">2 min ago</span>
//                             </div>
//                             <div class="flex items-center space-x-3">
//                                 <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
//                                 <p class="text-sm text-gray-700">Order #1234 completed</p>
//                                 <span class="text-xs text-gray-500 !ml-auto">5 min ago</span>
//                             </div>
//                             <div class="flex items-center space-x-3">
//                                 <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
//                                 <p class="text-sm text-gray-700">Payment received</p>
//                                 <span class="text-xs text-gray-500 !ml-auto">10 min ago</span>
//                             </div>
//                         </div>
//                     </div>

//                     <!-- Quick Actions -->
//                     <div class="bg-white !p-6 rounded-lg shadow-sm border border-gray-200">
//                         <h3 class="text-lg font-semibold text-gray-900 !mb-4">Quick Actions</h3>
//                         <div class="grid grid-cols-2 gap-4">
//                             <button class="!p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
//                                 <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center !mb-2">
//                                     <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
//                                     </svg>
//                                 </div>
//                                 <p class="text-sm font-medium text-gray-900">Add User</p>
//                             </button>
//                             <button class="!p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
//                                 <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center !mb-2">
//                                     <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
//                                     </svg>
//                                 </div>
//                                 <p class="text-sm font-medium text-gray-900">Create Report</p>
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//                                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
//                                     </svg>
//                                 </div>
//                                 <p class="text-sm font-medium text-gray-900">Create Report</p>
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </section>