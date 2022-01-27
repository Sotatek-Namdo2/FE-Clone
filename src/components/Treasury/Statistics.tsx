import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Box, BoxProps, Grid, Typography, TypographyProps } from '@mui/material';
import { useWindowSize } from 'hooks/useWindowSize';
import AreaChartCustom from 'components/Base/AreaChart';
import { useFetchMarketCapData } from 'hooks/useFetchMarketCapData';
import { formatBigNumber } from 'helpers/formatBigNumber';

interface Props {
  title?: string;
}

interface BoxLeftProps extends BoxProps {
  isMarket: boolean;
}

const Wrapper = styled(Box)<BoxProps>(({ theme }) => ({
  marginTop: '30px',

  [theme.breakpoints.down('lg')]: {
    marginTop: '30px',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '0 14px',
  },
}));

const BoxDetail = styled(Box)<BoxProps>(({ theme }) => ({
  background: 'linear-gradient(129.07deg, #7FB2FE 3.5%, #879FFF 115.01%), #FFFFFF',
  boxShadow: '0px 66px 35px -48px rgba(25, 21, 48, 0.13)',
  borderRadius: '20px',
  display: 'flex',
  alignItems: 'center',
  padding: '2px',
  height: '190px',
  boxSizing: 'border-box',

  [theme.breakpoints.up('xl')]: {
    height: 'auto',
  },
  [theme.breakpoints.down('lg')]: {
    height: 'auto',
  },
  [theme.breakpoints.down('md')]: {
    // display: 'inline-block',
    width: '100%',
    // padding: '12px',
  },
  [theme.breakpoints.down('sm')]: {
    display: 'inline-block',
    width: '100%',
    padding: '10px',
  },
}));

const BoxTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontFamily: 'Roboto',
  fontWeight: 'bold',
  fontSize: '32px',
  lineHeight: '37px',
  color: '#FFFFFF',

  [theme.breakpoints.down('lg')]: {
    fontSize: '26px',
    lineHeight: '34px',
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '32px',
    lineHeight: '37px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '32px',
    lineHeight: '37px',
  },
}));

const BoxText = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontFamily: 'Poppins',
  fontWeight: 'bold',
  fontSize: '14px',
  lineHeight: '21px',
  textTransform: 'uppercase',
  color: '#C5D9FF',
  maxWidth: '163px',
  marginBottom: '15px',

  [theme.breakpoints.down('lg')]: {
    fontSize: '12px',
    lineHeight: '18px',
  },
  [theme.breakpoints.down('md')]: {
    // textAlign: 'center',
    // margin: '0 auto 15px',
    fontSize: '14px',
    lineHeight: '21px',
  },
  [theme.breakpoints.down('sm')]: {
    textAlign: 'center',
    margin: '0 auto 15px',
    fontSize: '14px',
    lineHeight: '21px',
  },
}));

const BoxText2 = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontFamily: 'Poppins',
  fontWeight: 'bold',
  fontSize: '18px',
  lineHeight: '27px',
  textTransform: 'uppercase',
  color: '#C5D9FF',
  maxWidth: '163px',
  marginBottom: '15px',

  [theme.breakpoints.down('lg')]: {
    fontSize: '16px',
    lineHeight: '22px',
  },
  [theme.breakpoints.down('md')]: {
    // textAlign: 'center',
    // margin: '0 auto 15px',
    fontSize: '18px',
    lineHeight: '27px',
  },
  [theme.breakpoints.down('sm')]: {
    textAlign: 'center',
    margin: '0 auto 15px',
    fontSize: '18px',
    lineHeight: '27px',
  },
}));

const BoxLeft = styled(Box)<BoxLeftProps>(({ theme, isMarket }) => ({
  width: 'calc(100% - 290px)',
  padding: isMarket ? '30px 47px' : '30px',
  boxSizing: 'border-box',

  [theme.breakpoints.up('xl')]: {
    width: '50%',
  },
  [theme.breakpoints.down('lg')]: {
    width: '50%',
    padding: '20px',
  },

  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center',
    padding: '17px 0px 23px',
  },
}));

const BoxRight = styled(Box)<BoxProps>(({ theme }) => ({
  width: '290px',
  background: '#FFFFFF',
  boxShadow: '0px 4px 26px rgba(0, 0, 0, 0.12)',
  borderRadius: '17px',
  padding: '10px 28px 10px 5px',
  boxSizing: 'border-box',
  position: 'relative',

  [theme.breakpoints.up('xl')]: {
    width: '50%',
  },
  [theme.breakpoints.down('lg')]: {
    width: '50%',
    paddingRight: '15px',
  },

  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

const TitleChart = styled(Typography)<TypographyProps>(() => ({
  position: 'absolute',
  zIndex: '2',
  top: '16px',
  left: '42px',
  fontFamily: 'Roboto',
  fontWeight: 'normal',
  fontSize: '12px',
  lineHeight: '14px',
  textAlign: 'center',
  color: '#000000',
}));

const Statistics: React.FC<Props> = () => {
  const [width] = useWindowSize();
  const [screenSize, setScreenSize] = useState(width);

  const { circulatingSupply, circulatingSupplyHistory, totalSupply, marketCap, marketCapHistory } =
    useFetchMarketCapData();

  useEffect(() => {
    setScreenSize(width);
  }, [width]);

  return (
    <Wrapper>
      <Grid container spacing={{ xs: '20px', md: '24px', lg: '39px' }}>
        <Grid item xs={12} sm={12} md={6}>
          <BoxDetail>
            <BoxLeft isMarket={false}>
              <BoxText>Circulation Supply / Total Supply</BoxText>
              <BoxTitle>
                {formatBigNumber(circulatingSupply)} / {formatBigNumber(totalSupply)}
              </BoxTitle>
            </BoxLeft>
            <BoxRight>
              <div
                style={{
                  width: screenSize > 600 ? 'calc(100% + 30px)' : 'calc(100% + 30px)',
                  // height: { md: '140px', lg: '181px' },
                  height:
                    screenSize > 2559
                      ? '270px'
                      : screenSize > 1560
                      ? '220px'
                      : screenSize > 899
                      ? '181px'
                      : screenSize > 599
                      ? '240px'
                      : '179px',
                  minHeight: '100%',
                  marginLeft: screenSize > 599 ? '-35px' : '-30px',
                  marginBottom: '-15px',
                }}
              >
                <TitleChart>Last 30 Days</TitleChart>
                <AreaChartCustom
                  dataKey="circulationSupply"
                  id="colorUv"
                  color="#E5F5FE"
                  data={circulatingSupplyHistory}
                />
              </div>
            </BoxRight>
          </BoxDetail>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <BoxDetail>
            <BoxLeft isMarket={true}>
              <BoxText2>Market Cap</BoxText2>
              <BoxTitle>{formatBigNumber(marketCap)}</BoxTitle>
            </BoxLeft>
            <BoxRight>
              <div
                style={{
                  width: screenSize > 600 ? 'calc(100% + 30px)' : 'calc(100% + 30px)',
                  // height: { md: '140px', lg: '181px' },
                  height:
                    screenSize > 2559
                      ? '270px'
                      : screenSize > 1560
                      ? '220px'
                      : screenSize > 899
                      ? '181px'
                      : screenSize > 599
                      ? '240px'
                      : '179px',
                  minHeight: '100%',
                  marginLeft: screenSize > 599 ? '-35px' : '-30px',
                  marginBottom: '-15px',
                }}
              >
                <TitleChart>Last 30 Days</TitleChart>
                <AreaChartCustom dataKey="marketCap" id="colorUv2" data={marketCapHistory} color="#E5E8FE" />
              </div>
            </BoxRight>
          </BoxDetail>
        </Grid>
      </Grid>
    </Wrapper>
  );
};

export default Statistics;
