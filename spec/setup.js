// Vuetify components observe their size, which jsdom doesn't implement
class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
}

globalThis.ResizeObserver = globalThis.ResizeObserver || ResizeObserverStub;

// As index.html does, so FrAppShell names the window as it does in the
// browser: after this, not after its own title
document.title = 'Voracious Appetite';
