export default class Match {
    private player1: IPlayer
    private player2: IPlayer;
    private deuce: boolean;
    private tieBreaker: boolean;
    private winner: IPlayer;

    private gamePoints = {
        0: 0,
        1: 15,
        2: 30,
        3: 40
    }

    constructor(player1Name: string, player2Name: string) {
        this.player1 = {
            name: player1Name,
            games: 0,
            points: 0,
            advantage: false,
            tieBreakerPoints: 0
        };
        this.player2 = {
            name: player2Name,
            games: 0,
            points: 0,
            advantage: false,
            tieBreakerPoints: 0
        }
    }

    public pointWonBy(player: string) {
        if (player !== this.player1.name && player !== this.player2.name) {
            return console.log('Player name does not match either of the current players')
        }
        if (!this.winner) {
            return player === this.player1.name
                ? this.addPoint(this.player1, this.player2)
                : this.addPoint(this.player2, this.player1)
        }
        const loser = this.winner.name === this.player1.name ? this.player2 : this.player1;
        return console.log(`${this.winner.name} has won the set with a final score of ${this.winner.games} - ${loser.games}. Please start a new game.`)
    }

    public score() {
        if (this.tieBreaker && (this.player1.tieBreakerPoints || this.player2.tieBreakerPoints)) {
            return `${this.player1.games} - ${this.player2.games}, ${this.player1.tieBreakerPoints} - ${this.player2.tieBreakerPoints}`
        }
        if (this.deuce) {
            if (!this.player1.advantage && !this.player2.advantage) {
                return `${this.player1.games} - ${this.player2.games}, Deuce`
            }
            if (this.player1.advantage) {
                return `${this.player1.games} - ${this.player2.games}, Advantage ${this.player1.name}`
            }
            return `${this.player1.games} - ${this.player2.games}, Advantage ${this.player2.name}`
        }

        if (this.player1.points || this.player2.points) {
            return `${this.player1.games} - ${this.player2.games}, ${this.gamePoints[this.player1.points]} - ${this.gamePoints[this.player2.points]}`
        }
        return `${this.player1.games} - ${this.player2.games}`
    }

    private addPoint(player: IPlayer, opponent: IPlayer) {
        if (this.tieBreaker) {
            return this.incrementTieBreaker(player, opponent)
        }
        if (!this.deuce) {
            if (player.points === 3) {
                return this.incrementGame(player, opponent)
            }
            if (player.points === 2 && opponent.points === 3) {
                this.deuce = true
            }
            return player.points++
        }

        if (player.advantage) {
            return this.incrementGame(player, opponent)
        }
        if (opponent.advantage) {
            return opponent.advantage = false
        }
        return player.advantage = true
    }

    private incrementGame(player: IPlayer, opponent: IPlayer) {
        player.games++
        this.resetpoints([player, opponent])

        if (player.games >= 6) {
            if ((player.games - opponent.games) >= 2) {
                return this.setWinner(player)
            }
            return player.games === 6 && opponent.games === 6 ? this.tieBreaker = true : null;
        }
    }

    private resetpoints(players: IPlayer[]) {
        players.forEach(player => {
            player.points = 0;
            player.advantage = false;
        })
        this.deuce = false;
    }

    private incrementTieBreaker(player: IPlayer, opponent: IPlayer) {
        player.tieBreakerPoints++;
        if (player.tieBreakerPoints >= 7 && player.tieBreakerPoints - opponent.tieBreakerPoints >= 2) {
            player.games++
            this.setWinner(player)
        }
    }

    private setWinner(player: IPlayer) {
        console.log(`${player.name} has won the set!`);
        return this.winner = player;
    }
}

interface IPlayer {
    name: string;
    games: number;
    points: number;
    advantage: boolean;
    tieBreakerPoints: number;
}