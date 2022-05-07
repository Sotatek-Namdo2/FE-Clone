import React from 'react';
import { styled } from '@mui/material/styles';

import {
  Typography,
  TypographyProps,
  Dialog,
  DialogProps,
  DialogTitle,
  DialogContent,
  IconButton,
  IconButtonProps,
  Button,
  ButtonProps,
  Box,
  BoxProps,
} from '@mui/material';

import { ReactComponent as CloseImg } from 'assets/images/charm_cross.svg';

interface Props {
  open: boolean;
  onClose: () => void;
}

interface DialogTitleCustomProps {
  denied?: boolean;
}

interface DialogContentCustomProps {
  denied?: boolean;
}

const Wrapper = styled(Dialog)<DialogProps>(({ theme }) => ({
  background: 'rgba(165, 199, 251, 0.38)',
  zIndex: 1700,

  '.MuiDialog-container': {
    background: theme.palette.mode === 'light' ? 'rgba(165, 199, 251, 0.38)' : '#9f9f9f2f',
  },

  '.MuiPaper-root': {
    width: '437px',
    boxShadow: '0px 4px 67px rgba(0, 0, 0, 0.09)',
    borderRadius: '11px',
    padding: '0',
    margin: '0',
    boxSizing: 'border-box',
    background: theme.palette.mode === 'light' ? '#fff' : '#171717',
    border: theme.palette.mode === 'light' ? 'unset' : 'unset',

    [theme.breakpoints.down('sm')]: {
      width: 'calc(100%  - 36px)',
      borderRadius: '14px',
    },
  },
}));

const HeaderText = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontFamily: 'Poppins',
  fontSize: '20px',
  lineHeight: '37px',
  color: theme.palette.mode === 'light' ? '#293247' : '#fff',
  textTransform: 'capitalize',
  fontWeight: '600',
}));

const CloseIcon = styled(IconButton)<IconButtonProps>(() => ({
  width: '28px',
  height: '28px',
  padding: '0',
  border: 'none',
  marginLeft: 'auto',

  img: {
    width: '100%',
  },
}));

const Header = styled(DialogTitle)<DialogTitleCustomProps>(({}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '25px 21px',
}));

const Content = styled(DialogContent)<DialogContentCustomProps>(({}) => ({
  padding: '0px 20px 33px',
  overflow: 'hidden',

  '.MuiDialogContentText-root': {
    color: '#828282',
    fontFamily: 'Poppins',
    fontSize: '12px',
    lineHeight: '18px',
    marginBottom: '8px',
    textTransform: 'capitalize',
  },
}));

const ButtonConfirm = styled(Button)<ButtonProps>(() => ({
  fontFamily: 'Poppins',
  fontStyle: 'normal',
  fontWeight: '500',
  fontSize: '18px',
  lineHeight: '33px',
  textAlign: 'center',
  background: '#3864FF',
  color: '#fff',
  textTransform: 'capitalize',
  height: '58px',
  borderRadius: '11px',
  boxShadow: 'none',
  padding: '10px 10px',
  minWidth: '122px',
  marginTop: '20px',

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
}));

const StakeDetail = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    border: '1px solid rgba(41, 50, 71, 0.09)',
    padding: '40px 20px 35px',
    boxSizing: 'border-box',
    borderRadius: '11px',
    marginBottom: '26px',
  },
}));

const BoxDetail = styled(Box)<BoxProps>(({ theme }) => ({
  background: '#fff',
  border: '1px solid rgba(41, 50, 71, 0.09)',
  borderRadius: '11px',
  padding: '25px 20px 27px',
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  marginBottom: '21px',

  [theme.breakpoints.down('md')]: {
    display: 'block',
    border: 'none',
    margin: 0,
    padding: 0,

    '.boxItem': {
      width: '100%',
      marginBottom: '42px',

      '&:last-child': {
        marginBottom: '0',
      },
    },
  },

  '.boxItem': {
    textAlign: 'center',

    '&:last-child': {
      marginLeft: 'auto',
    },
  },

  h3: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '18px',
    lineHeight: '21px',
    textTransform: 'capitalize',
    color: theme.palette.mode === 'light' ? 'rgba(41, 50, 71, 0.8)' : 'rgba(255, 255, 255, 0.8)',
    margin: '0 0 9px',
  },

  h4: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: '18px',
    lineHeight: '21px',
    textTransform: 'capitalize',
    color: theme.palette.mode === 'light' ? 'rgba(41, 50, 71, 0.8)' : 'rgba(255, 255, 255, 0.8)',
    margin: '0 0 9px',
  },
}));

const UnStakeModal: React.FC<Props> = ({ open, onClose }) => {
  return (
    <Wrapper className="swapDialog" open={open} keepMounted aria-describedby="alert-dialog-slide-description">
      <Header>
        <HeaderText>Unstake</HeaderText>

        <CloseIcon onClick={onClose}>
          <CloseImg />
        </CloseIcon>
      </Header>

      <Content>
        <StakeDetail>
          <BoxDetail>
            <div className="boxItem">
              <h3>Unstake Amount</h3>
              <h4>40 LP</h4>
            </div>
            <div className="boxItem">
              <h3>Earned Reward</h3>
              <h4>20 0xB</h4>
            </div>
          </BoxDetail>

          <BoxDetail>
            <div className="boxItem">
              <h3>Accrue days</h3>
              <h4>20 days</h4>
            </div>
            <div className="boxItem">
              <h3>Early Unstake fee</h3>
              <h4>2 LP</h4>
            </div>
          </BoxDetail>
        </StakeDetail>

        <ButtonConfirm variant="contained" fullWidth onClick={onClose}>
          Confirm
        </ButtonConfirm>
      </Content>
    </Wrapper>
  );
};

export default UnStakeModal;
