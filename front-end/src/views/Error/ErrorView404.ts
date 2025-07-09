
export class ErrorView404 {
    constructor() {}

    render(): HTMLElement {
       
        const element = document.createElement('div');

        element.innerHTML = `
            <section class="bg-red-500">
                <div class="">
                    <h1 class="">404 Page not found</h1>
                </div>
            </section>
        `;

        

        return element;
    }
}
