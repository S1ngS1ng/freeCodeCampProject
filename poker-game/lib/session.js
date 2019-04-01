export default class Session {
    constructor(
        user = 'Ninja Cat'
    ) {
        this.user = user;
        this.cash = 100;
    }

    end() {
        this.isRunning = false;
    }

    refill(amount = 100) {
        this.cash += amount;
    }
}

