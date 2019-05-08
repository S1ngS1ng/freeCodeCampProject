export default class Session {
    public user: string;
    public cash: number;

    constructor(
        user = 'Ninja Cat'
    ) {
        this.user = user;
        this.cash = 100;
    }
}

