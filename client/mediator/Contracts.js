"use strict";
// ----------------------------------------------------------------------------
// Copyright (c) 2018,2019 OAX Foundation.
// https://www.oax.org/
// ----------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
const ContractUtils_1 = require("../libs/ContractUtils");
const BigNumberUtils_1 = require("../libs/BigNumberUtils");
exports.POSDISPUTE1 = 1;
exports.POSDISPUTE2 = 2;
class MediatorAsync {
    constructor(signer, contract) {
        this.contractWithSigner = contract.connect(signer);
        this.contractAddress = this.contractWithSigner.address;
    }
    getContractWrapper() {
        return this.contractWithSigner;
    }
    async getBalance() {
        const contractAddress = await this.contractWithSigner.address;
        return BigNumberUtils_1.D(await this.contractWithSigner.provider.getBalance(contractAddress));
    }
    async commit(root, tokenAddress) {
        return await ContractUtils_1.waitForMining(this.contractWithSigner.functions.commit(root.hash, tokenAddress, root.sum.toString()));
    }
    async isApprovalsSummaryValid(approvSummary, sig, aliceAddress) {
        const res = this.contractWithSigner.functions.isApprovalsSummaryValid(approvSummary.toSol(), sig, aliceAddress);
        return res;
    }
    async initiateWithdrawal(proof, withdrawalAmount) {
        return await ContractUtils_1.waitForMining(this.contractWithSigner.functions.initiateWithdrawal(proof.toSol(), withdrawalAmount.toString()));
    }
    async depositsToken(tokenAddress, amount) {
        return await ContractUtils_1.waitForMining(this.contractWithSigner.functions.depositTokens(tokenAddress, amount.toString()));
    }
    async getCurrentRound() {
        return (await this.contractWithSigner.functions.getCurrentRound()).toNumber();
    }
    async getCurrentQuarter() {
        return (await this.contractWithSigner.functions.getCurrentQuarter()).toNumber();
    }
    async pendingWithdrawals(round, tokenAddress, clientAddress) {
        const res = BigNumberUtils_1.D(await this.contractWithSigner.functions.pendingWithdrawals(round.toString(), tokenAddress, clientAddress));
        return res;
    }
    async isHalted() {
        await ContractUtils_1.waitForMining(this.contractWithSigner.functions.updateHaltedState());
        const res = await this.contractWithSigner.functions.isHalted();
        return res;
    }
    async cancelWithdrawal(proof, summary, sig) {
        return await ContractUtils_1.waitForMining(this.contractWithSigner.functions.cancelWithdrawal(proof.toSol(), summary.toSol(), sig));
    }
    async cancelWithdrawalWithoutSummary(proof, round) {
        return await ContractUtils_1.waitForMining(this.contractWithSigner.functions.cancelWithdrawalWithoutSummary(proof.toSol(), round));
    }
    async deposits(round, tokenAddress, clientAddress) {
        return await this.contractWithSigner.functions.deposits(round, tokenAddress, clientAddress);
    }
    async totalDeposits(round, tokenAddress) {
        return await this.contractWithSigner.functions.totalDeposits(round, tokenAddress);
    }
    async totalDepositsSinceBeginning(tokenAddress) {
        const res = BigNumberUtils_1.D(await this.contractWithSigner.functions.totalDepositsSinceBeginning(tokenAddress));
        return res;
    }
    async totalPendingWithdrawals(round, tokenAddress) {
        const res = BigNumberUtils_1.D(await this.contractWithSigner.functions.totalPendingWithdrawals(round, tokenAddress));
        return res;
    }
    async totalPendingWithdrawalsSinceBeginning(tokenAddress) {
        const res = BigNumberUtils_1.D(await this.contractWithSigner.functions.totalPendingWithdrawalsSinceBeginning(tokenAddress));
        return res;
    }
    async confirmWithdrawal(round, tokenAddress) {
        return await ContractUtils_1.waitForMining(this.contractWithSigner.functions.confirmWithdrawal(round, tokenAddress));
    }
    async totalWithdrawals(round, tokenAddress) {
        return await this.contractWithSigner.functions.totalWithdrawals(round, tokenAddress);
    }
    async totalWithdrawalsSinceBeginning(tokenAddress) {
        const res = BigNumberUtils_1.D(await this.contractWithSigner.functions.totalWithdrawalsSinceBeginning(tokenAddress));
        return res;
    }
    async withdrawals(round, tokenAddress, clientAddress) {
        return await this.contractWithSigner.functions.withdrawals(round, tokenAddress, clientAddress);
    }
    async disputes(clientAddress) {
        return await this.contractWithSigner.functions.disputes(clientAddress);
    }
    async openBalanceDispute(proofVector, summary, sig) {
        return await ContractUtils_1.waitForMining(this.contractWithSigner.functions.openBalanceDispute(proofVector.toSol(), summary.toSol(), sig));
    }
    async closeBalanceDispute(approvalS, sigApprovalS, fillsS, sigFillsS, proofVector, clientAddress) {
        return await ContractUtils_1.waitForMining(this.contractWithSigner.functions.closeBalanceDispute(approvalS.toSol(), sigApprovalS, fillsS.toSol(), sigFillsS, proofVector.toSol(), clientAddress));
    }
    async recoverAllFunds(proof) {
        return await ContractUtils_1.waitForMining(this.contractWithSigner.functions.recoverAllFunds(proof.toSol()));
    }
    async recoverOnChain(tokenAddress) {
        return await ContractUtils_1.waitForMining(this.contractWithSigner.functions.recoverOnChain(tokenAddress));
    }
    async isProofValid(proof, round) {
        return await this.contractWithSigner.functions.isProofValid(proof.toSol(), round);
    }
    // Mock functions
    async setOpenBalanceDisputeCounter(n) {
        return await ContractUtils_1.waitForMining(this.contractWithSigner.setOpenBalanceDisputeCounter(n));
    }
    async openBalanceDisputeCounter() {
        return await this.contractWithSigner.functions.openBalanceDisputeCounter();
    }
    async closeDispute(clientAddress) {
        return await ContractUtils_1.waitForMining(this.contractWithSigner.closeDispute(clientAddress));
    }
    async destroyDispute(clientAddress) {
        return await ContractUtils_1.waitForMining(this.contractWithSigner.functions.destroyDispute(clientAddress));
    }
    async setDisputeSummaryCounter(clientAddress, counter) {
        return await ContractUtils_1.waitForMining(this.contractWithSigner.functions.setDisputeSummaryCounter(clientAddress, counter));
    }
    async setPreviousOpeningBalanceClient(clientAddress, openingBalance, pos) {
        return await ContractUtils_1.waitForMining(this.contractWithSigner.functions.setPreviousOpeningBalanceClient(clientAddress, ContractUtils_1.bigNumberToString(openingBalance), pos));
    }
    async setTotalWithdrawalAmount(round, tokenAddress, amount) {
        return await ContractUtils_1.waitForMining(this.contractWithSigner.functions.setTotalWithdrawalAmount(round, tokenAddress, ContractUtils_1.bigNumberToString(amount)));
    }
    async openingBalances(round, tokenAddress) {
        const res = await this.contractWithSigner.functions.openingBalances(round, tokenAddress);
        return BigNumberUtils_1.D(res);
    }
    async halt() {
        return await ContractUtils_1.waitForMining(this.contractWithSigner.functions.halt());
    }
}
exports.MediatorAsync = MediatorAsync;
class TokenAsync {
    constructor(signer, contract) {
        this.contractWithSigner = contract.connect(signer);
        this.contractAddress = this.contractWithSigner.address;
    }
    async balanceOf(address) {
        const res = await this.contractWithSigner.functions.balanceOf(address);
        return BigNumberUtils_1.D(res);
    }
    async allowance(owner, spender) {
        const res = await this.contractWithSigner.functions.allowance(owner, spender);
        return BigNumberUtils_1.D(res);
    }
    async approve(to, amount) {
        return ContractUtils_1.waitForMining(this.contractWithSigner.functions.approve(to, amount.toString()));
    }
    async withdraw() {
        const txReceipt = await ContractUtils_1.waitForMining(this.contractWithSigner.functions.withdraw());
        const gasUsed = txReceipt.gasUsed.toNumber();
        return gasUsed;
    }
}
exports.TokenAsync = TokenAsync;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udHJhY3RzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL21lZGlhdG9yL0NvbnRyYWN0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0VBQStFO0FBQy9FLDBDQUEwQztBQUMxQyx1QkFBdUI7QUFDdkIsK0VBQStFOztBQUUvRSx5REFBd0U7QUFHeEUsMkRBQTBDO0FBa0I3QixRQUFBLFdBQVcsR0FBRyxDQUFDLENBQUE7QUFDZixRQUFBLFdBQVcsR0FBRyxDQUFDLENBQUE7QUFFNUIsTUFBYSxhQUFhO0lBSXhCLFlBQVksTUFBYyxFQUFFLFFBQWlDO1FBQzNELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ2xELElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQTtJQUN4RCxDQUFDO0lBRUQsa0JBQWtCO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFBO0lBQ2hDLENBQUM7SUFFRCxLQUFLLENBQUMsVUFBVTtRQUNkLE1BQU0sZUFBZSxHQUFHLE1BQU0sSUFBSSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQTtRQUM3RCxPQUFPLGtCQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFBO0lBQzlFLENBQUM7SUFFRCxLQUFLLENBQUMsTUFBTSxDQUFDLElBQWUsRUFBRSxZQUFxQjtRQUNqRCxPQUFPLE1BQU0sNkJBQWEsQ0FDeEIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQ3RDLElBQUksQ0FBQyxJQUFJLEVBQ1QsWUFBWSxFQUNaLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQ3BCLENBQ0YsQ0FBQTtJQUNILENBQUM7SUFFRCxLQUFLLENBQUMsdUJBQXVCLENBQzNC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