"use strict";
// ----------------------------------------------------------------------------
// Copyright (c) 2018,2019 OAX Foundation.
// https://www.oax.org/
// ----------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
class Proof {
    constructor(clientOpeningBalance, clientAddress, hashes, sums, tokenAddress) {
        this.clientOpeningBalance = clientOpeningBalance;
        this.clientAddress = clientAddress;
        this.hashes = hashes;
        this.sums = sums;
        this.tokenAddress = tokenAddress;
    }
    toSol() {
        const proof = {
            clientOpeningBalance: this.clientOpeningBalance.toString(10),
            clientAddress: this.clientAddress,
            hashes: this.hashes,
            sums: this.sums.map(v => v.toString()),
            tokenAddress: this.tokenAddress
        };
        return proof;
    }
    static fromProofOfLiability(proof, leaf, asset) {
        return new this(leaf.sum, leaf.address, proof.map(p => p.hash), proof.map(p => p.sum), asset);
    }
}
exports.Proof = Proof;
class ProofVector {
    constructor(proof1, proof2) {
        this.proof1 = proof1;
        this.proof2 = proof2;
    }
    toSol() {
        const proofVector = {
            proof1: this.proof1.toSol(),
            proof2: this.proof2.toSol()
        };
        return proofVector;
    }
}
exports.ProofVector = ProofVector;
class Lot {
    constructor(amountSign, amount, tokenAddress) {
        this.amountSign = amountSign;
        this.amount = amount;
        this.tokenAddress = tokenAddress;
    }
    toSol() {
        const lot = {
            amountSign: this.amountSign,
            amount: this.amount.toString(10),
            tokenAddress: this.tokenAddress
        };
        return lot;
    }
}
exports.Lot = Lot;
class SummaryParams {
    constructor(round, counter, lot1, lot2) {
        this.round = round;
        this.counter = counter;
        this.lot1 = lot1;
        this.lot2 = lot2;
    }
    toSol() {
        const summary = {
            round: this.round.toString(),
            counter: this.counter.toString(),
            lot1: this.lot1.toSol(),
            lot2: this.lot2.toSol()
        };
        return summary;
    }
}
exports.SummaryParams = SummaryParams;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU21hcnRDb250cmFjdFR5cGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL1NtYXJ0Q29udHJhY3RUeXBlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0VBQStFO0FBQy9FLDBDQUEwQztBQUMxQyx1QkFBdUI7QUFDdkIsK0VBQStFOztBQWdDL0UsTUFBYSxLQUFLO0lBQ2hCLFlBQ1Msb0JBQTRCLEVBQzVCLGFBQXNCLEVBQ3RCLE1BQWdCLEVBQ2hCLElBQWMsRUFDZCxZQUFxQjtRQUpyQix5QkFBb0IsR0FBcEIsb0JBQW9CLENBQVE7UUFDNUIsa0JBQWEsR0FBYixhQUFhLENBQVM7UUFDdEIsV0FBTSxHQUFOLE1BQU0sQ0FBVTtRQUNoQixTQUFJLEdBQUosSUFBSSxDQUFVO1FBQ2QsaUJBQVksR0FBWixZQUFZLENBQVM7SUFDM0IsQ0FBQztJQUVHLEtBQUs7UUFDVixNQUFNLEtBQUssR0FBRztZQUNaLG9CQUFvQixFQUFFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO1lBQzVELGFBQWEsRUFBRSxJQUFJLENBQUMsYUFBYTtZQUNqQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07WUFDbkIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ3RDLFlBQVksRUFBRSxJQUFJLENBQUMsWUFBWTtTQUNoQyxDQUFBO1FBRUQsT0FBTyxLQUFLLENBQUE7SUFDZCxDQUFDO0lBRUQsTUFBTSxDQUFDLG9CQUFvQixDQUN6QixLQUF1QixFQUN2QixJQUFhLEVBQ2IsS0FBbUI7UUFFbkIsT0FBTyxJQUFJLElBQUksQ0FDYixJQUFJLENBQUMsR0FBRyxFQUNSLElBQUksQ0FBQyxPQUFPLEVBQ1osS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFDdEIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFDckIsS0FBSyxDQUNOLENBQUE7SUFDSCxDQUFDO0NBQ0Y7QUFsQ0Qsc0JBa0NDO0FBT0QsTUFBYSxXQUFXO0lBQ3RCLFlBQW1CLE1BQWEsRUFBUyxNQUFhO1FBQW5DLFdBQU0sR0FBTixNQUFNLENBQU87UUFBUyxXQUFNLEdBQU4sTUFBTSxDQUFPO0lBQUcsQ0FBQztJQUVuRCxLQUFLO1FBQ1YsTUFBTSxXQUFXLEdBQUc7WUFDbEIsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFO1lBQzNCLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRTtTQUM1QixDQUFBO1FBRUQsT0FBTyxXQUFXLENBQUE7SUFDcEIsQ0FBQztDQUNGO0FBWEQsa0NBV0M7QUFpQkQsTUFBYSxHQUFHO0lBQ2QsWUFDUyxVQUFtQixFQUNuQixNQUFpQixFQUNqQixZQUFxQjtRQUZyQixlQUFVLEdBQVYsVUFBVSxDQUFTO1FBQ25CLFdBQU0sR0FBTixNQUFNLENBQVc7UUFDakIsaUJBQVksR0FBWixZQUFZLENBQVM7SUFDM0IsQ0FBQztJQUVHLEtBQUs7UUFDVixNQUFNLEdBQUcsR0FBRztZQUNWLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVTtZQUMzQixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO1lBQ2hDLFlBQVksRUFBRSxJQUFJLENBQUMsWUFBWTtTQUNoQyxDQUFBO1FBQ0QsT0FBTyxHQUFHLENBQUE7SUFDWixDQUFDO0NBQ0Y7QUFmRCxrQkFlQztBQUVELE1BQWEsYUFBYTtJQUN4QixZQUNTLEtBQVksRUFDWixPQUFnQixFQUNoQixJQUFTLEVBQ1QsSUFBUztRQUhULFVBQUssR0FBTCxLQUFLLENBQU87UUFDWixZQUFPLEdBQVAsT0FBTyxDQUFTO1FBQ2hCLFNBQUksR0FBSixJQUFJLENBQUs7UUFDVCxTQUFJLEdBQUosSUFBSSxDQUFLO0lBQ2YsQ0FBQztJQUVHLEtBQUs7UUFDVixNQUFNLE9BQU8sR0FBRztZQUNkLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRTtZQUM1QixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUU7WUFDaEMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ3ZCLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtTQUN4QixDQUFBO1FBQ0QsT0FBTyxPQUFPLENBQUE7SUFDaEIsQ0FBQztDQUNGO0FBakJELHNDQWlCQyJ9