// Main app logic
// Initializes state, renders the initial view, manages mounting/unmounting

export function App(root: HTMLElement) {
    // Clear previous content if re-rendering
    root.innerHTML = '';

    // Create landing container
    const container = document.createElement('div');
    container.className = 'flex flex-col items-center justify-center min-h-screen bg-gray-100';

    // Heading
    const heading = document.createElement('h1');
    heading.textContent = '🚀 Welcome to Your TypeScript + Tailwind SPA!';
    heading.className = 'text-3xl font-bold mb-4 text-gray-800';

    // Subheading
    const subheading = document.createElement('p');
    subheading.textContent = 'This is your landing page, clean and ready to extend.';
    subheading.className = 'text-lg text-gray-600 mb-8 text-center max-w-md';

    // Button Example
    const button = document.createElement('button');
    button.textContent = 'Get Started';
    button.className = 'px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition';

    button.addEventListener('click', () => {
        alert('You clicked Get Started!');
        // Future: Navigate to another route or load additional component
    });

    // Append to container
    container.appendChild(heading);
    container.appendChild(subheading);
    container.appendChild(button);

    // Append container to root
    root.appendChild(container);
}
