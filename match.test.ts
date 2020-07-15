import { expect } from 'chai';
import Match from './match';

let match: Match;

beforeEach(() => {
    match = new Match('player 1', 'player 2');
})

describe('match', () => {

    it('should increment games when one player has won 4 points in a row', () => {
        match['player1'].points = 3
        
        match.pointWonBy('player 1')

        const score = match.score()

        expect(score).to.eql('1 - 0')
    });

    it('should show game points when in mid game', () => {
        match['player1'].points = 2
        match['player2'].points = 1

        const score = match.score()

        expect(score).to.eql('0 - 0, 30 - 15')
    });

    it('should show advantage to correct player', () => {
        match['player1'].points = 3
        match['player2'].points = 3
        match['deuce'] = true

        match.pointWonBy('player 1')

        const score = match.score()

        expect(score).to.eql('0 - 0, Advantage player 1')
    });

    it('should still be in progress if games are 6 - 5', () => {
        match['player1'].games = 6
        match['player2'].games = 5

        match.pointWonBy('player 1')

        const score = match.score()

        expect(score).to.eql('6 - 5, 15 - 0')
    });

    it('should go to tie breaker if 6 - 6', () => {
        match['player1'].games = 6
        match['player2'].games = 5
        match['player2'].points = 3

        match.pointWonBy('player 2')

        expect(match['tieBreaker']).to.eql(true)
    });

    it('should still be in tie breaker if points are 7-7', () => {
        match['tieBreaker'] = true
        match['player1'].tieBreakerPoints = 7
        match['player1'].games = 6
        match['player2'].tieBreakerPoints = 7
        match['player2'].games = 6

        match.pointWonBy('player 2')
        
        const score = match.score()

        expect(score).to.eql('6 - 6, 7 - 8')
    });
    
    it('should set the winner once tie breaker has been one', () => {
        match['tieBreaker'] = true
        match['player1'].tieBreakerPoints = 7
        match['player1'].games = 6
        match['player2'].tieBreakerPoints = 8
        match['player2'].games = 6

        match.pointWonBy('player 2')
        
        const score = match.score()

        expect(score).to.eql('6 - 7, 7 - 9')
        expect(match['winner'].name).to.eql('player 2')
    });

    it('should set the winner if player has got 6 games and difference is greater than 2', () => {
        match['player1'].games = 3
        match['player2'].points = 3
        match['player2'].games = 5

        match.pointWonBy('player 2')
        
        const score = match.score()

        expect(score).to.eql('3 - 6')
        expect(match['winner'].name).to.eql('player 2')
    });
});