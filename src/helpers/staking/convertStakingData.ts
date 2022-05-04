import { BigNumber } from 'bignumber.js';
import zipWith from 'lodash/zipWith';
import moment from 'moment';

interface Params {
  dates: string[];
  stakedAmounts: string[];
  unstakedAmounts: string[];
  rewards: string[];
}

export const convertStakingData = ({ dates, stakedAmounts, rewards, unstakedAmounts }: Params) => {
  if (dates[0] !== '') {
    return zipWith(dates, stakedAmounts, unstakedAmounts, rewards, (date, stakedAmount, unstakedAmount, reward) => {
      return {
        stakeDate: date,
        stakedAmount: new BigNumber(stakedAmount).div(1e18).toString(),
        unstakedAmount: new BigNumber(unstakedAmount).div(1e18).toString(),
        stakingTime: moment()
          .diff(moment(Number(date) * 1000), 'days')
          .toString(),
        reward: new BigNumber(reward).div(1e18).toString(),
      };
    }).map((item, index) => {
      return {
        ...item,
        id: index,
      };
    });
  }
  return [];
};