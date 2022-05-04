import React, { useEffect, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Box, BoxProps, Button, ButtonProps, Grid, Tooltip, TooltipProps, tooltipClasses } from '@mui/material';

import PaginationCustom from './Pagination';
import { ReactComponent as WarnIcon } from 'assets/images/ic-warn-circle.svg';
import { ReactComponent as WarnDarkIcon } from 'assets/images/ic-warn-circle-dark.svg';
import { stakeItem } from 'services/staking';
import moment from 'moment';
import { formatForNumberLessThanCondition } from 'helpers/formatForNumberLessThanCondition';
import { formatPercent } from 'helpers/formatPrice';
import { useWeb3React } from '@web3-react/core';

interface Props {
  title?: string;
  onClaim: (index: any) => void;
  onUnstake: (index: any) => void;
  data: stakeItem[];
}

const Wrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  background: theme.palette.mode === 'light' ? '#FFFFFF' : '#171717',
  border: '1px solid rgba(41, 50, 71, 0.12)',
  boxSizing: 'border-box',
  boxShadow: '0px 2px 30px rgba(56, 100, 255, 0.03)',
  borderRadius: '9px',
}));

// const ButtonClaimAll = styled(Button)<ButtonProps>(() => ({
//   fontFamily: 'Poppins',
//   fontStyle: 'normal',
//   fontWeight: '500',
//   fontSize: '21px',
//   lineHeight: '32px',
//   textAlign: 'center',
//   background: '#3864FF',
//   color: '#fff',
//   textTransform: 'capitalize',
//   height: '51px',
//   borderRadius: '15px',
//   boxShadow: 'none',
//   padding: '6px 10px',
//   width: '206px',
//   margin: '0 auto',
//   display: 'block',

//   '&:disabled': {
//     background: 'rgba(56, 100, 255, 0.16)',
//     color: '#fff',
//   },

//   '&:hover': {
//     background: '#1239C4',
//     color: '#fff',
//     outline: 'none',
//     boxShadow: 'none',
//   },
// }));

const ButtonStake = styled(Button)<ButtonProps>(() => ({
  fontFamily: 'Poppins',
  fontStyle: 'normal',
  fontWeight: '500',
  fontSize: '21px',
  lineHeight: '32px',
  textAlign: 'center',
  color: '#3864FF',
  textTransform: 'capitalize',
  border: '1px solid #3864FF',
  height: '51px',
  width: '120px',
  borderRadius: '15px',

  '&:hover': {
    background: '#3864FF',
    borderColor: '#3864FF',
    color: '#fff',
  },

  '@media(max-width: 320px)': {
    width: 'auto',
    fontSize: '18px',
  },
}));

const ButtonClaim = styled(Button)<ButtonProps>(() => ({
  fontFamily: 'Poppins',
  fontStyle: 'normal',
  fontWeight: '500',
  fontSize: '21px',
  lineHeight: '32px',
  textAlign: 'center',
  background: '#3864FF',
  color: '#fff',
  textTransform: 'capitalize',
  height: '51px',
  width: '120px',
  borderRadius: '15px',
  boxShadow: 'none',
  marginLeft: '36px',

  '&:disabled': {
    background: 'rgba(56, 100, 255, 0.16)',
    color: '#fff',
  },

  '&:hover': {
    background: '#1239C4',
    color: '#fff',
    outline: 'none',
    boxShadow: 'none',
  },

  '@media(max-width: 320px)': {
    marginLeft: '15px',
    width: 'auto',
    fontSize: '18px',
  },
}));

const CardItem = styled(Box)<BoxProps>(() => ({
  width: '100%',
  borderBottom: '0.586653px solid rgba(41, 50, 71, 0.09)',
  padding: '40px',
  boxSizing: 'border-box',
  textAlign: 'center',

  '@media(max-width: 320px)': {
    padding: '30px 24px',
  },
}));

const Detail = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  textAlign: 'center',
  marginBottom: '40px',

  h4: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '14px',
    lineHeight: '17px',
    letterSpacing: '0.025em',
    textTransform: 'uppercase',
    color: theme.palette.mode === 'light' ? 'rgba(41, 50, 71, 0.7)' : 'rgba(255, 255, 255, 0.7)',
    margin: '0 auto 18px',
  },

  h3: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '16px',
    lineHeight: '19px',
    letterSpacing: '0.025em',
    color: theme.palette.mode === 'light' ? '#293247' : '#fff',
    margin: '0',
  },
}));

const ViewPagination = styled(Box)<BoxProps>(() => ({
  width: '100%',
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  padding: '36px 0 47px',
}));

// const ListAction = styled(Box)<BoxProps>(() => ({
//   padding: '24px',
//   boxSizing: 'border-box',
//   borderBottom: '0.586653px solid rgba(41, 50, 71, 0.09)',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
// }));

const TooltipCustom = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.mode === 'light' ? '#e4e4e4' : '#000',
    top: '5px !important',

    ['&::before']: {
      boxShadow: '0px 1px 7px rgba(0, 0, 0, 0.08)',
      backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#3E3E3E',
    },
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#3E3E3E',
    boxShadow: '0px 1px 7px rgba(0, 0, 0, 0.08)',
    color: theme.palette.mode === 'light' ? '#293247' : '#fff',
    fontFamily: 'Poppins',
    fontWeight: 'normal',
    fontSize: '12px',
    lineHeight: '22px',
    borderRadius: '7px',
    padding: '2px 10px',
    maxWidth: '245px',
  },
  zIndex: 1200,
}));

const ListMyStake: React.FC<Props> = ({ onClaim, onUnstake, data }) => {
  const theme = useTheme();
  const { account } = useWeb3React();

  const [records, setRecords] = useState(data.slice(0, 5));
  const [pagination, setPagination] = useState({
    limit: 5,
    index: 0,
  });
  const [openTooltip, setOpenTooltip] = useState<any>(null);

  const handleChangePage = (value: number) => {
    const values = data.slice((value - 1) * pagination.limit, value * pagination.limit);
    setRecords(values);
    setPagination({
      ...pagination,
      index: value - 1,
    });
  };

  const handleToggleTooltip = (index: number) => {
    const open: any = {
      ...openTooltip,
    };
    open[index] = open[index] ? !open[index] : true;
    setOpenTooltip(open);
  };

  useEffect(() => {
    if (account) {
      setRecords(data.slice(0, 5));
    }
  }, [account, data]);

  return (
    <Wrapper>
      {/* <ListAction>
        <ButtonClaimAll onClick={onClaimAll}>Claim All</ButtonClaimAll>
      </ListAction> */}

      {records.map((item, i: number) => (
        <CardItem key={i}>
          <Grid container spacing={'15px'}>
            <Grid item xs={6}>
              <Detail>
                <h4>stake date</h4>
                <h3>{moment.unix(Number(item.stakeDate)).format('MMM DD YYYY')}</h3>
              </Detail>
            </Grid>
            <Grid item xs={6}>
              <Detail>
                <h4>stake amount</h4>
                <h3>
                  {' '}
                  {formatForNumberLessThanCondition({
                    value: item.stakedAmount,
                    addLessThanSymbol: true,
                    minValueCondition: '0.000001',
                    callback: formatPercent,
                    callBackParams: [6],
                  })}
                </h3>
              </Detail>
            </Grid>
            <Grid item xs={6}>
              <Detail>
                <h4>unstaked amount</h4>
                <h3>
                  {formatForNumberLessThanCondition({
                    value: item.unstakedAmount,
                    addLessThanSymbol: true,
                    minValueCondition: '0.000001',
                    callback: formatPercent,
                    callBackParams: [6],
                  })}
                </h3>
              </Detail>
            </Grid>
            <Grid item xs={6}>
              <Detail>
                <h4>staking time</h4>
                <h3>{`${item.stakingTime} days`}</h3>
              </Detail>
            </Grid>
            <Grid item xs={6}>
              <Detail>
                <h4>rewards 0xB</h4>
                <h3>
                  {' '}
                  {formatForNumberLessThanCondition({
                    value: item.reward,
                    addLessThanSymbol: true,
                    minValueCondition: '0.000001',
                    callback: formatPercent,
                    callBackParams: [6],
                  })}
                </h3>
              </Detail>
            </Grid>
            <Grid item xs={6}>
              <Detail>
                <h4>{''}</h4>
                <h3>
                  <TooltipCustom
                    open={(openTooltip && openTooltip[i]) || false}
                    title={
                      <div>
                        <p>If you unstake before 30 days, you will be charged 5% on your unstake amount</p>
                        <p>If you unstake before 60 days, you will be charged 2.5% on your unstake amount </p>
                      </div>
                    }
                    arrow
                    placement="top-end"
                  >
                    {theme.palette.mode === 'light' ? (
                      <WarnIcon width={28} height={28} onClick={() => handleToggleTooltip(i)} />
                    ) : (
                      <WarnDarkIcon width={28} height={28} onClick={() => handleToggleTooltip(i)} />
                    )}
                  </TooltipCustom>
                </h3>
              </Detail>
            </Grid>
            <Grid item xs={12}>
              <Box>
                <ButtonStake variant="outlined" onClick={() => onUnstake(item.id)}>
                  Unstake
                </ButtonStake>
                <ButtonClaim variant="contained" onClick={() => onClaim(item.id)}>
                  Claim
                </ButtonClaim>
              </Box>
            </Grid>
          </Grid>
        </CardItem>
      ))}

      <ViewPagination>
        <PaginationCustom
          total={data.length}
          limit={pagination.limit}
          page={pagination.index + 1}
          onChange={handleChangePage}
        />
      </ViewPagination>
    </Wrapper>
  );
};

export default ListMyStake;