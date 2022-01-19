import React, { useEffect } from 'react';
import Statistics from 'components/Dashboard/Statistics';
import TotalMinted from 'components/Dashboard/TotalMinted';
import PriceChart from 'components/Dashboard/PriceChart';
import { Box, Grid } from '@mui/material';
import { coinsPrices } from 'services/coingeko';
import { useAppDispatch, useAppSelector } from 'stores/hooks';
import useInterval from 'hooks/useInterval';

interface DashboardProps {
  name?: string;
}

const Dashboard: React.FC<DashboardProps> = () => {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.coingeko.data);

  useEffect(() => {
    dispatch(coinsPrices({ vs_currency: 'usd', days: '365' }));
  }, []);

  useInterval(async () => {
    await dispatch(coinsPrices({ vs_currency: 'usd', days: '365' }));
  }, 50000);

  const rechartLineData = (data?.prices || []).map((el: Array<string>) => {
    return {
      time: el[0],
      close: el[1],
    };
  });

  return (
    <Box>
      <Box mt="30px" mb="50px">
        <Statistics />
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <TotalMinted />
        </Grid>
        <Grid item xs={12} md={8}>
          <PriceChart data={rechartLineData} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
