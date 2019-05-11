export default class Session {
    user: string;
    cash: number;

    constructor() {
        this.user = null;
        this.cash = 0;
    }

    clear(): void {
        this.user = null;
        this.cash = 0;
    }

    init(userName: string = 'Ninja Cat'): void {
        this.user = userName;
        this.cash = 100;
    }

    isSessionActive(): boolean {
        return this.user !== '';
    }

    setCash(amount: number): void {
        this.cash = amount;
    }

}

