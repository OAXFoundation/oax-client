"use strict";
// ----------------------------------------------------------------------------
// Copyright (c) 2018,2019 OAX Foundation.
// https://www.oax.org/
// ----------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
const ContractUtils_1 = require("../libs/ContractUtils");
const BigNumberUtils_1 = require("../libs/BigNumberUtils");
const bignumber_js_1 = require("bignumber.js");
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
        return await ContractUtils_1.waitForMining(this.contractWithSigner.functions.commit(root.hash, tokenAddress, root.sum.toString(10)));
    }
    async isApprovalsSummaryValid(approvSummary, sig, aliceAddress) {
        const res = this.contractWithSigner.functions.isApprovalsSummaryValid(approvSummary.toSol(), sig, aliceAddress);
        return res;
    }
    async initiateWithdrawal(proof, withdrawalAmount) {
        return await ContractUtils_1.waitForMining(this.contractWithSigner.functions.initiateWithdrawal(proof.toSol(), withdrawalAmount.toString(10)));
    }
    async depositsToken(tokenAddress, amount) {
        return await ContractUtils_1.waitForMining(this.contractWithSigner.functions.depositTokens(tokenAddress, bignumber_js_1.BigNumber.isBigNumber(amount) ? amount.toString(10) : amount.toString()));
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
    async roundSize() {
        const res = await this.contractWithSigner.functions.roundSize();
        return BigNumberUtils_1.D(res);
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
        return ContractUtils_1.waitForMining(this.contractWithSigner.functions.approve(to, amount.toString(10)));
    }
    async withdraw() {
        const txReceipt = await ContractUtils_1.waitForMining(this.contractWithSigner.functions.withdraw());
        const gasUsed = txReceipt.gasUsed.toNumber();
        return gasUsed;
    }
}
exports.TokenAsync = TokenAsync;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udHJhY3RzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL21lZGlhdG9yL0NvbnRyYWN0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0VBQStFO0FBQy9FLDBDQUEwQztBQUMxQyx1QkFBdUI7QUFDdkIsK0VBQStFOztBQUUvRSx5REFBd0U7QUFHeEUsMkRBQTBDO0FBQzFDLCtDQUF3QztBQWlCM0IsUUFBQSxXQUFXLEdBQUcsQ0FBQyxDQUFBO0FBQ2YsUUFBQSxXQUFXLEdBQUcsQ0FBQyxDQUFBO0FBRTVCLE1BQWEsYUFBYTtJQUl4QixZQUFZLE1BQWMsRUFBRSxRQUFpQztRQUMzRCxJQUFJLENBQUMsa0JBQWtCLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUNsRCxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUE7SUFDeEQsQ0FBQztJQUVELGtCQUFrQjtRQUNoQixPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQTtJQUNoQyxDQUFDO0lBRUQsS0FBSyxDQUFDLFVBQVU7UUFDZCxNQUFNLGVBQWUsR0FBRyxNQUFNLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUE7UUFDN0QsT0FBTyxrQkFBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQTtJQUM5RSxDQUFDO0lBRUQsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFlLEVBQUUsWUFBcUI7UUFDakQsT0FBTyxNQUFNLDZCQUFhLENBQ3hCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUN0QyxJQUFJLENBQUMsSUFBSSxFQUNULFlBQVksRUFDWixJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FDdEIsQ0FDRixDQUFBO0lBQ0gsQ0FBQztJQUVE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