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
            sums: this.sums.map(v => v.toString(10)),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU21hcnRDb250cmFjdFR5cGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL1NtYXJ0Q29udHJhY3RUeXBlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0VBQStFO0FBQy9FLDBDQUEwQztBQUMxQyx1QkFBdUI7QUFDdkIsK0VBQStFOztBQWdDL0UsTUFBYSxLQUFLO0lBQ2hCLFlBQ1Msb0JBQTRCLEVBQzVCLGFBQXNCLEVBQ3RCLE1BQWdCLEVBQ2hCLElBQWMsRUFDZCxZQUFxQjtRQUpyQix5QkFBb0IsR0FBcEIsb0JBQW9CLENBQVE7UUFDNUIsa0JBQWEsR0FBYixhQUFhLENBQVM7UUFDdEIsV0FBTSxHQUFOLE1BQU0sQ0FBVTtRQUNoQixTQUFJLEdBQUosSUFBSSxDQUFVO1FBQ2QsaUJBQVksR0FBWixZQUFZLENBQVM7SUFDM0IsQ0FBQztJQUVHLEtBQUs7UUFDVixNQUFNLEtBQUssR0FBRztZQUNaLG9CQUFvQixFQUFFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO1lBQzVELGFBQWEsRUFBRSxJQUFJLENBQUMsYUFBYTtZQUNqQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07WUFDbkIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN4QyxZQUFZLEVBQUUsSUFBSSxDQUFDLFlBQVk7U0FDaEMsQ0FBQTtRQUVELE9BQU8sS0FBSyxDQUFBO0lBQ2QsQ0FBQztJQUVELE1BQU0sQ0FBQyxvQkFBb0IsQ0FDekIsS0FBdUIsRUFDdkIsSUFBYSxFQUNiLEtBQW1CO1FBRW5CLE9BQU8sSUFBSSxJQUFJLENBQ2IsSUFBSSxDQUFDLEdBQUcsRUFDUixJQUFJLENBQUMsT0FBTyxFQUNaLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQ3RCLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQ3JCLEtBQUssQ0FDTixDQUFBO0lBQ0gsQ0FBQztDQUNGO0FBbENELHNCQWtDQztBQU9ELE1BQWEsV0FBVztJQUN0QixZQUFtQixNQUFhLEVBQVMsTUFBYTtRQUFuQyxXQUFNLEdBQU4sTUFBTSxDQUFPO1FBQVMsV0FBTSxHQUFOLE1BQU0sQ0FBTztJQUFHLENBQUM7SUFFbkQsS0FBSztRQUNWLE1BQU0sV0FBVyxHQUFHO1lBQ2xCLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRTtZQUMzQixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUU7U0FDNUIsQ0FBQTtRQUVELE9BQU8sV0FBVyxDQUFBO0lBQ3BCLENBQUM7Q0FDRjtBQVhELGtDQVdDO0FBaUJELE1BQWEsR0FBRztJQUNkLFlBQ1MsVUFBbUIsRUFDbkIsTUFBaUIsRUFDakIsWUFBcUI7UUFGckIsZUFBVSxHQUFWLFVBQVUsQ0FBUztRQUNuQixXQUFNLEdBQU4sTUFBTSxDQUFXO1FBQ2pCLGlCQUFZLEdBQVosWUFBWSxDQUFTO0lBQzNCLENBQUM7SUFFRyxLQUFLO1FBQ1YsTUFBTSxHQUFHLEdBQUc7WUFDVixVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVU7WUFDM0IsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQztZQUNoQyxZQUFZLEVBQUUsSUFBSSxDQUFDLFlBQVk7U0FDaEMsQ0FBQTtRQUNELE9BQU8sR0FBRyxDQUFBO0lBQ1osQ0FBQztDQUNGO0FBZkQsa0JBZUM7QUFFRCxNQUFhLGFBQWE7SUFDeEIsWUFDUyxLQUFZLEVBQ1osT0FBZ0IsRUFDaEIsSUFBUyxFQUNULElBQVM7UUFIVCxVQUFLLEdBQUwsS0FBSyxDQUFPO1FBQ1osWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUNoQixTQUFJLEdBQUosSUFBSSxDQUFLO1FBQ1QsU0FBSSxHQUFKLElBQUksQ0FBSztJQUNmLENBQUM7SUFFRyxLQUFLO1FBQ1YsTUFBTSxPQUFPLEdBQUc7WUFDZCxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUU7WUFDNUIsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFO1lBQ2hDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUN2QixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7U0FDeEIsQ0FBQTtRQUNELE9BQU8sT0FBTyxDQUFBO0lBQ2hCLENBQUM7Q0FDRjtBQWpCRCxzQ0FpQkMifQ==