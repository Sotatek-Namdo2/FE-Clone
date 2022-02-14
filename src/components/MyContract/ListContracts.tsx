import React, { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Box, BoxProps, Button, ButtonProps } from '@mui/material';

import ContractDetail from './ContractDetail';
import { useAppDispatch, useAppSelector } from 'stores/hooks';
import { SquareIcon, CubeIcon, TessIcon, SquareDarkIcon, CubeDarkIcon, TessDarkIcon } from 'assets/images';

import { setIsClaimingReward, unSetIsClaimingReward } from 'services/contract';
import { claimAllNodes, claimNodeByNode, getClaimPermit } from 'helpers/interractiveContract';
import { sleep } from 'helpers/delayTime';
import { DELAY_TIME } from 'consts/typeReward';
import { formatCType } from 'helpers/formatCType';
import { errorMessage } from 'messages/errorMessages';
import MintStatusModal from 'components/Base/MintStatusModal';
import { useToast } from 'hooks/useToast';

interface Props {
  data: Array<any>;
}

const Wrapper = styled(Box)<BoxProps>(() => ({
  width: '100%',
  boxSizing: 'border-box',
  padding: '0 14px',
}));

const Actions = styled(Box)<BoxProps>(() => ({
  textAlign: 'right',
  width: '100%',
  marginBottom: '14px',
}));

const ButtonClaimAll = styled(Button)<ButtonProps>(({ theme }) => ({
  fontSize: '14px',
  lineHeight: '21px',
  fontFamily: 'Poppins',
  fontWeight: 'bold',
  padding: '8px 10px',
  textTransform: 'unset',
  borderRadius: '10px',
  boxShadow: 'none',
  width: '99px',
  height: '38px',
  boxSizing: 'border-box',
  background:
    theme.palette.mode === 'light'
      ? theme.palette.primary.light
      : 'linear-gradient(141.34deg, #2978F4 28.42%, #23ABF8 132.6%)',

  '&:hover': {
    cursor: 'pointed',
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    opacity: 0.7,
    boxShadow: 'none',
  },

  '&:disabled': {
    color: '#fff',
    background:
      theme.palette.mode === 'light' ? '#E0E0E0' : 'linear-gradient(141.34deg, #2978F4 28.42%, #23ABF8 132.6%)',
  },
}));

const EmptyContracts = styled(Box)<BoxProps>(({ theme }) => ({
  minHeight: '192px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.mode === 'light' ? '#E0E0E0' : '#828282',
  fontFamily: 'Roboto',
  fontWeight: 'bold',
  fontSize: '24px',
  lineHeight: '33px',
  boxShadow: '0px 0px 48px rgba(0, 0, 0, 0.1)',
  borderRadius: '14px',
  background: theme.palette.mode === 'light' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.03)',
}));

const STATUS = ['success', 'error', 'pending'];

const ListContracts: React.FC<Props> = ({ data }) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const currentUserAddress = useAppSelector((state) => state.user.account?.address);
  const isClaimingReward = useAppSelector((state) => state.contract.isClaimingReward);

  const { createToast } = useToast();
  const [openStatus, setOpenStatus] = useState(false);
  const [status, setStatus] = useState<any>(null);
  const [claimType, setClaimType] = useState<string>('');
  const [icon, setIcon] = useState<string>('');

  const handleToggleStatus = () => {
    setOpenStatus(!openStatus);
  };

  const processModal = (type: string) => {
    setStatus(STATUS[2]);
    setOpenStatus(true);
    setClaimType(type);
  };

  const processIcon = (cType: string) => {
    if (cType === '') {
      setIcon('');
      return;
    }

    if (cType === '0') {
      setIcon(theme.palette.mode === 'light' ? SquareIcon : SquareDarkIcon);
      return;
    }

    if (cType === '1') {
      setIcon(theme.palette.mode === 'light' ? CubeIcon : CubeDarkIcon);
      return;
    }

    setIcon(theme.palette.mode === 'light' ? TessIcon : TessDarkIcon);
  };

  const handleClickClaimAll = async () => {
    try {
      processModal('ALL CONTRACTS');
      processIcon('');
      dispatch(setIsClaimingReward());

      const claimPermit = await getClaimPermit();
      if (!claimPermit[0]) {
        setStatus(STATUS[3]);
        return;
      }

      const response: Record<string, any> = await claimAllNodes();
      await sleep(DELAY_TIME);

      if (!openStatus) setOpenStatus(true);
      if (response.hash) setStatus(STATUS[0]);
    } catch (err: any) {
      if (!openStatus) setOpenStatus(true);
      setStatus(STATUS[1]);
    } finally {
      dispatch(unSetIsClaimingReward());
    }
  };

  const handleClickClaimNodeByNode = async (nodeIndex: number, cType: string) => {
    try {
      processModal(formatCType(cType));
      processIcon(cType);
      dispatch(setIsClaimingReward());

      const claimPermit = await getClaimPermit();
      if (!claimPermit[0]) {
        processModal('');
        processIcon('');
        setStatus(STATUS[3]);
        return;
      }

      const response: Record<string, any> = await claimNodeByNode(nodeIndex);
      await sleep(DELAY_TIME);

      if (!openStatus) setOpenStatus(true);
      if (response.hash) setStatus(STATUS[0]);
    } catch (e: any) {
      if (!openStatus) setOpenStatus(true);
      if (e.code === -32603) {
        createToast({
          message: errorMessage.REWARDS_NOT_READY.message,
          type: 'error',
        });
      }
      setStatus(STATUS[1]);
    } finally {
      dispatch(unSetIsClaimingReward());
    }
  };

  return (
    <Wrapper>
      <Actions>
        <ButtonClaimAll
          size="small"
          variant="contained"
          color="primary"
          disabled={data.length === 0 || isClaimingReward}
          onClick={handleClickClaimAll}
        >
          Claim all
        </ButtonClaimAll>
      </Actions>

      <Box>
        {data && data.length > 0 ? (
          data.map((item, i) => (
            <ContractDetail
              key={i}
              mintDate={item.mintDate}
              type={item.type}
              initial={item.initial}
              name={item.name}
              rewards={item.rewards}
              current={item.current}
              nodeIndex={data.length - i - 1}
              onClaimClick={handleClickClaimNodeByNode}
            />
          ))
        ) : (
          <EmptyContracts>{currentUserAddress ? 'No contracts yet!' : 'You need to connect wallet!'}</EmptyContracts>
        )}
      </Box>

      <MintStatusModal
        icon={icon}
        name={claimType}
        open={openStatus}
        status={status}
        text={
          status === 'success'
            ? 'Rewards claimed successfully'
            : status === 'error'
            ? 'Rewards claiming failed'
            : status === 'pending'
            ? 'Processing'
            : 'Insufficient Tokens'
        }
        onClose={handleToggleStatus}
      />
    </Wrapper>
  );
};

export default ListContracts;
