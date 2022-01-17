import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, BoxProps, Paper, PaperProps, Typography, TypographyProps, Button, ButtonProps } from '@mui/material';

interface Props {
  text?: string;
  walletId?: string;
  connected?: boolean;
  isBg: boolean;
  onConnect?: () => void;
}

interface ButtonWalletProps extends ButtonProps {
  isBg: boolean;
}

interface PaperCustomProps extends PaperProps {
  isBg: boolean;
}

const BannerWrapper = styled(Paper)<PaperCustomProps>(({ isBg }) => ({
  boxShadow: isBg ? '0px 0px 48px rgba(0, 0, 0, 0.06)' : 'none',
  borderRadius: '22px',
  backgroundColor: isBg ? '#fff' : 'unset',
  padding: isBg ? '30px 22px 30px 33px' : 0,
  boxSizing: 'border-box',
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  minHeight: isBg ? '119px' : '50px',
}));

const Text = styled(Typography)<TypographyProps>(() => ({
  fontSize: '16px',
  color: '#293247',
  fontWeight: '600',
  lineHeight: '30px',
  fontFamily: 'Poppins',
  width: '479px',
}));

const Title = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontSize: '14px',
  color: theme.palette.primary.main,
  fontWeight: 'bold',
  lineHeight: '21px',
  fontFamily: 'Poppins',
  overflow: 'hidden',
  width: '100%',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
}));

const BoxRight = styled(Box)<BoxProps>(() => ({
  width: 'calc(100% - 479px)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
}));

const Wallet = styled(Box)<BoxProps>(() => ({
  maxWidth: '126px',
  marginRight: '30px',
  overflow: 'hidden',

  span: {
    color: '#BDBDBD',
    fontFamily: 'Poppins',
    fontSize: '12px',
    lineHeight: '18px',
  },
}));

const ButtonWallet = styled(Button)<ButtonWalletProps>(({ isBg, theme }) => ({
  fontSize: '14px',
  lineHeight: '21px',
  fontFamily: 'Poppins',
  fontWeight: 'bold',
  padding: '12px 24px',
  borderRadius: '14px',
  textTransform: 'capitalize',
  boxShadow: 'none',
  background: isBg ? theme.palette.primary.main : 'unset',

  '&:hover': {
    opacity: 0.7,
    boxShadow: 'none',
    background: isBg ? theme.palette.primary.main : 'unset',
  },
}));

const Banner: React.FC<Props> = ({ isBg, text, walletId, connected, onConnect }) => {
  return (
    <BannerWrapper isBg={isBg}>
      {text && <Text>{text}</Text>}

      <BoxRight>
        {connected && (
          <Wallet>
            <span>Wallet</span>
            <Title>{walletId}</Title>
          </Wallet>
        )}
        <ButtonWallet isBg={isBg} variant={isBg ? 'contained' : 'outlined'} color="primary" onClick={onConnect}>
          {connected ? 'Disconnect' : 'Connect'} Wallet
        </ButtonWallet>
      </BoxRight>
    </BannerWrapper>
  );
};

export default Banner;
