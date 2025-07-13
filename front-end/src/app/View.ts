

export abstract class View {
    protected element: HTMLElement | null = null;

    abstract render(): HTMLElement;

    mount(parent: HTMLElement) {
        this.element = this.render();
        parent.appendChild(this.element);
    }

    unmount() {
        if (this.element && this.element.parentElement) {
            this.element.parentElement.removeChild(this.element);
            this.element = null;
        }
    }
}
