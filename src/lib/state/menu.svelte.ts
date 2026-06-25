class MobileMenu {
    open = $state(false);

    toggle() {
        this.open = !this.open;
    }

    close() {
        this.open = false;
    }
}

export const mobileMenu = new MobileMenu();
