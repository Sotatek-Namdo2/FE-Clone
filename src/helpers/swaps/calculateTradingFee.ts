import { Token } from '@traderjoe-xyz/sdk';
import { BigNumber } from 'bignumber.js';
import { formatPercent } from 'helpers/formatPrice';

export const calculateTradingFee = (amount: string, token: Token, isExactInput: boolean, sell0xbTax: string) => {
  if (isExactInput) {
    // calculate swap fee
    const oxbFee = new BigNumber(amount).div(`1e${token.decimals}`).multipliedBy(0.1).div(100);
    const amountAfterMinusOxbFee = new BigNumber(amount).div(`1e${token.decimals}`).minus(oxbFee);

    // calculate sell 0xb fee
    let sell0xbFee = '0';
    if (token.address === String(process.env.REACT_APP_CONTRACT_ADDRESS)) {
      sell0xbFee = new BigNumber(amountAfterMinusOxbFee).multipliedBy(sell0xbTax).div(100).toString();
    }
    const amountAfterMinusTaxFee = new BigNumber(amountAfterMinusOxbFee).minus(sell0xbFee);

    const traderJoeFee = amountAfterMinusTaxFee.multipliedBy(0.3).div(100);
    const result = formatPercent(oxbFee.plus(traderJoeFee).plus(sell0xbFee).toString(), 6, 0);
    return Number(result) > 0.000001 ? result : '<0.000001';
  } else {
    const tradingFee = new BigNumber(amount).div(`1e${token.decimals}`).multipliedBy(0.4).div(100);
    const result = formatPercent(tradingFee.toString(), 6, 0);
    return Number(result) > 0.000001 ? result : '<0.000001';
  }
};
