import React, { useEffect, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Box, BoxProps, Button, ButtonProps } from '@mui/material';

import ContractDetail from './ContractDetail';
import { useAppDispatch, useAppSelector } from 'stores/hooks';

import { setIsClaimingReward, unSetIsClaimingReward } from 'services/contract';
import { formatCType } from 'helpers/formatCType';
import { errorMessage } from 'messages/errorMessages';
import MintStatusModal from 'components/Base/MintStatusModal';
import { useToast } from 'hooks/useToast';
import { useInteractiveContract } from 'hooks/useInteractiveContract';
import { infoMessage } from 'messages/infoMessages';
import { calculateDueDate } from 'helpers/myContract/calculateDueDate';
import MyContractsPayFeeModal from 'components/Base/MyContractsPayFeeModal';
import { MineContract } from 'interfaces/MyContract';
import { convertCType, getIconByMode, getNoFeeContractType } from 'helpers/myContract';
import { ClaimingType, ClaimingTypeV2 } from './TableContracts';

interface Props {
  data: Array<any>;
}

const Wrapper = styled(Box)<BoxProps>(() => ({
  width: '100%',
  boxSizing: 'border-box',
  padding: '0 14px',
}));

const Actions = styled(Box)<BoxProps>(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  // textAlign: 'right',
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
  width: '110px',
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

const STATUS = ['success', 'error', 'pending', 'permission denied'];

const ListContracts: React.FC<Props> = ({ data }) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const currentUserAddress = useAppSelector((state) => state.user.account?.address);
  const isClaimingReward = useAppSelector((state) => state.contract.isClaimingReward);
  const monthlyFeeTimes = useAppSelector((state) => state.contract.monthlyFeeTimes);
  const monthlyFees = useAppSelector((state) => state.contract.monthlyFees);

  const { getClaimPermit, claimNodeByNode, claimAllNodes, payMonthlyFee, approveToken, getMonthlyFeePermit } =
    useInteractiveContract();
  const { createToast } = useToast();
  const [openStatus, setOpenStatus] = useState(false);
  const [status, setStatus] = useState<any>(null);
  const [claimType, setClaimType] = useState<string>('');

  const [isMetamaskConfirmPopupOpening, setIsMetamaskConfirmPopupOpening] = useState(false);
  const [claimingTransactionHash, setClaimingTransactionHash] = useState('');
  const [transactionHashCompleted, setTransactionHasCompleted] = useState('');
  const [transactionError, setTransactionError] = useState('');

  const [openPayFee, setOpenPayFee] = useState(false);
  const [isPayAllFee, setIsPayAllFee] = useState(false);
  const [openPayFeeModalStatus, setOpenPayFeeModalStatus] = useState(false);

  const [currentSelectedContracts, setCurrentSelectedContracts] = useState<MineContract[]>([]);
  const [isClaiming, setIsClaiming] = useState(true);
  const [nextDueDate, setNextDueDate] = useState<number>();
  const [claimingType, setClaimingType] = useState<ClaimingTypeV2>(null);

  const noPayFeeContract = getNoFeeContractType(monthlyFees);

  const handlePayFee = (item: MineContract) => {
    setCurrentSelectedContracts([item]);
    setIsPayAllFee(false);
    setOpenPayFee(true);
  };
  const handlePayAllFees = () => {
    setCurrentSelectedContracts([...data]);
    setIsPayAllFee(true);
    setOpenPayFee(true);
  };
  const handleTogglePayFee = () => {
    setOpenPayFee(!openPayFee);
  };

  const handleToggleStatus = () => {
    if (openStatus && !isMetamaskConfirmPopupOpening) {
      dispatch(unSetIsClaimingReward());
      setClaimingTransactionHash('');
      setTransactionHasCompleted('');
      setTransactionError('');
    }
    setOpenStatus(!openStatus);
  };
  const handleTransactionCompleted = (txHash: string) => {
    setTransactionHasCompleted(txHash);
  };
  const handleTransactionError = (txHash: string) => {
    setTransactionError(txHash);
  };

  const processModal = (type: string) => {
    setStatus(STATUS[2]);
    setOpenStatus(true);
    setClaimType(type);
  };

  const handleClickClaimAll = async () => {
    let txHash = '';
    setIsClaiming(true);
    try {
      processModal('ALL CONTRACTS');
      setClaimingType(ClaimingType.AllContracts);
      dispatch(setIsClaimingReward());

      const claimPermit = await getClaimPermit();
      if (!claimPermit[0]) {
        processModal('');
        setClaimingType(null);
        setStatus(STATUS[3]);
        return;
      }
      setIsMetamaskConfirmPopupOpening(true);
      const response: Record<string, any> = await claimAllNodes();
      setIsMetamaskConfirmPopupOpening(false);
      if (response.hash) {
        txHash = response.hash;
        setClaimingTransactionHash(response.hash);
        await response.wait();
        handleTransactionCompleted(response.hash);
      }
    } catch (err: any) {
      if (txHash !== '') {
        handleTransactionError(txHash);
      } else {
        setIsMetamaskConfirmPopupOpening(false);
        if (!openStatus) setOpenStatus(true);
        setStatus(STATUS[1]);
        dispatch(unSetIsClaimingReward());
      }
    }
  };

  const handleSubmitPayFee = async (contracts: MineContract[], times: string[], nextDueDate: number) => {
    setIsClaiming(false);
    setNextDueDate(nextDueDate);
    if (openPayFee) handleTogglePayFee();
    let txHash = '';
    try {
      processModal(contracts.length <= 1 ? `${convertCType(contracts[0].type)} CONTRACT` : 'Monthly Subscription Fee');
      setClaimingType(contracts.length > 1 ? 'payFee' : convertCType(contracts[0].type));
      dispatch(setIsClaimingReward());
      // check on/off pay monthly fee
      const isPayMonthlyFeeActive = await getMonthlyFeePermit();
      if (!isPayMonthlyFeeActive[0]) {
        processModal('');
        setClaimingType(null);
        setStatus(STATUS[3]);
        return;
      }

      setIsMetamaskConfirmPopupOpening(true);
      const contractIndexes = contracts.map((item) => item.index);
      const response: Record<string, any> = await payMonthlyFee(contractIndexes, times);
      setIsMetamaskConfirmPopupOpening(false);
      if (response.hash) {
        txHash = response.hash;
        setClaimingTransactionHash(response.hash);
        await response.wait();
        handleTransactionCompleted(response.hash);
      }
    } catch (err: any) {
      if (txHash !== '') {
        handleTransactionError(txHash);
      } else {
        setIsMetamaskConfirmPopupOpening(false);
        if (!openPayFeeModalStatus) setOpenPayFeeModalStatus(true);
        setStatus(STATUS[1]);
        dispatch(unSetIsClaimingReward());
      }
    }
  };

  const handleApproveUSDC = async () => {
    let txHash = '';
    setIsClaiming(false);
    if (openPayFee) handleTogglePayFee();
    try {
      processModal('Approving');
      setClaimingType('approve');
      dispatch(setIsClaimingReward());

      setIsMetamaskConfirmPopupOpening(true);
      const response = await approveToken(
        String(process.env.REACT_APP_USDC_TOKEN_ADDRESS),
        String(process.env.REACT_APP_CONTS_REWARD_MANAGER),
      );
      setIsMetamaskConfirmPopupOpening(false);
      if (response.hash) {
        txHash = response.hash;
        setClaimingTransactionHash(response.hash);
        await response.wait();
        handleTransactionCompleted(response.hash);
      }
    } catch (err: any) {
      if (txHash !== '') {
        handleTransactionError(txHash);
      } else {
        setIsMetamaskConfirmPopupOpening(false);
        if (!openPayFeeModalStatus) setOpenPayFeeModalStatus(true);
        setStatus(STATUS[1]);
        dispatch(unSetIsClaimingReward());
      }
    }
  };

  const handleClickClaimNodeByNode = async (nodeIndex: number, cType: string) => {
    let txHash = '';
    setIsClaiming(true);
    try {
      processModal(formatCType(cType));
      setClaimingType(convertCType(cType));
      dispatch(setIsClaimingReward());

      const claimPermit = await getClaimPermit();
      if (!claimPermit[0]) {
        processModal('');
        setClaimingType(null);
        setStatus(STATUS[3]);
        return;
      }

      setIsMetamaskConfirmPopupOpening(true);
      const response: Record<string, any> = await claimNodeByNode(nodeIndex);
      setIsMetamaskConfirmPopupOpening(false);

      if (response.hash) {
        txHash = response.hash;
        setClaimingTransactionHash(response.hash);
        await response.wait();
        handleTransactionCompleted(response.hash);
      }
    } catch (e: any) {
      if (txHash !== '') {
        handleTransactionError(txHash);
      } else {
        setIsMetamaskConfirmPopupOpening(false);
        if (!openStatus) setOpenStatus(true);
        if (e.code === -32603) {
          createToast({
            message: errorMessage.REWARDS_NOT_READY.message,
            type: 'error',
          });
        }
        setStatus(STATUS[1]);
        dispatch(unSetIsClaimingReward());
      }
    }
  };
  useEffect(() => {
    if (transactionError !== '' && claimingTransactionHash === transactionError) {
      setIsMetamaskConfirmPopupOpening(false);
      if (!openStatus) setOpenStatus(true);
      setStatus(STATUS[1]);
      dispatch(unSetIsClaimingReward());
      setTransactionError('');
    }
  }, [claimingTransactionHash, transactionError]);

  useEffect(() => {
    // if user close loading popup, claim reward status listener will be closed
    if (!openStatus && isClaimingReward && !isMetamaskConfirmPopupOpening) {
      dispatch(unSetIsClaimingReward());
      setClaimingTransactionHash('');
      setTransactionHasCompleted('');
      setTransactionError('');
    }
  }, [openStatus, isClaimingReward, isMetamaskConfirmPopupOpening]);

  useEffect(() => {
    if (claimingTransactionHash === transactionHashCompleted && claimingTransactionHash !== '') {
      setOpenStatus(true);
      setStatus(STATUS[0]);
      dispatch(unSetIsClaimingReward());
      setClaimingTransactionHash('');
      setTransactionHasCompleted('');
    }
  }, [claimingTransactionHash, transactionHashCompleted]);

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
        <ButtonClaimAll
          size="small"
          variant="contained"
          color="primary"
          disabled={data.length === 0 || isClaimingReward}
          onClick={handlePayAllFees}
        >
          Pay All Fees
        </ButtonClaimAll>
      </Actions>

      <Box>
        {data && data.length > 0 ? (
          data
            .filter((r) => r.mintDate !== '')
            .map((item, i) => (
              <ContractDetail
                key={i}
                mintDate={item.mintDate}
                type={item.type}
                initial={item.initial}
                name={item.name}
                rewards={item.rewards}
                current={item.current}
                nodeIndex={item.index}
                claimedReward={item.claimedRewards}
                expireIn={Number(item.expireIn)}
                dueDays={
                  !noPayFeeContract.map((item) => item.cType).includes(item.type)
                    ? calculateDueDate(Number(item.expireIn), Number(monthlyFeeTimes.one))
                    : undefined
                }
                onClaimClick={handleClickClaimNodeByNode}
                onPayFeeClick={() => {
                  handlePayFee(item);
                }}
              />
            ))
        ) : (
          <EmptyContracts>{currentUserAddress ? 'No contracts yet!' : 'You need to connect wallet!'}</EmptyContracts>
        )}
      </Box>

      <MintStatusModal
        icon={getIconByMode(claimingType, theme.palette.mode)}
        name={claimType}
        open={openStatus}
        status={status}
        mode={isClaiming ? 'claim_status' : 'pay_fee_status'}
        nextDueDate={nextDueDate}
        text={
          isClaiming
            ? status === 'success'
              ? infoMessage.REWARD_CLAIM_OK.message
              : status === 'error'
              ? infoMessage.REWARD_CLAIM_FAILED.message
              : status === 'pending'
              ? infoMessage.PROCESSING.message
              : status === 'permission denied'
              ? infoMessage.PERMISSION_DENIED.message
              : 'Insufficient Tokens'
            : status === 'success'
            ? claimType === 'Approving'
              ? 'Transaction Completed'
              : 'Payment Successful'
            : status === 'error'
            ? claimType === 'Approving'
              ? 'Transaction Rejected'
              : 'Payment Failed'
            : status === 'pending'
            ? infoMessage.PROCESSING.message
            : infoMessage.PERMISSION_DENIED.message
        }
        onClose={handleToggleStatus}
      />

      {openPayFee && (
        <MyContractsPayFeeModal
          type={isPayAllFee ? 'pay_all' : 'pay_one'}
          contracts={currentSelectedContracts}
          open={openPayFee}
          allContracts={data}
          onClose={handleTogglePayFee}
          onSubmit={handleSubmitPayFee}
          onApproveToken={handleApproveUSDC}
        />
      )}
    </Wrapper>
  );
};

export default ListContracts;
