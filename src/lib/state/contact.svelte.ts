class ContactMenu {
    open = $state(false);

    toggle() {
        this.open = !this.open;
    }

    close() {
        this.open = false;
    }

    openMenu() {
        this.open = true;
    }
}

export const contactMenu = new ContactMenu();
