import React, { useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { injected } from 'connectors';
import { Web3Provider } from '@ethersproject/providers';
import { UnsupportedChainIdError } from '@web3-react/core';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from 'stores/hooks';
import { setAccount, setLogin, unSetAccount, unSetLogin } from 'services/account';
import { styled } from '@mui/material/styles';
import { ButtonProps, Button } from '@mui/material';
import { errorMessage } from 'messages/errorMessages';
import { successMessage } from 'messages/successMessages';
import { isMetaMaskInstalled, onClickConnect, addEthereumChain, getSignerSignMessage } from 'helpers';
import { authenticateUser, getToken, unAuthenticateUser } from 'services/auth';

interface Props {
  name?: string;
}

const ButtonConnect = styled(Button)<ButtonProps>(() => ({
  textDecoration: 'none',
  borderRadius: '14px',
  padding: '12px 20px',
  textTransform: 'unset',
  fontSize: '14px',
  lineHeight: '21px',
  fontWeight: 'bold',
}));

const ButtonWallet = styled(Button)<ButtonProps>(({ theme }) => ({
  fontSize: '14px',
  lineHeight: '21px',
  fontFamily: 'Poppins',
  fontWeight: 'bold',
  padding: '12px 24px',
  borderRadius: '14px',
  textTransform: 'capitalize',
  boxShadow: 'none',
  background: theme.palette.primary.main,
  color: 'white',

  '&:hover': {
    opacity: 0.7,
    boxShadow: 'none',
    background: theme.palette.primary.main,
  },
}));

const ConnectWallet: React.FC<Props> = () => {
  const dispatch = useAppDispatch();
  const { active, account, activate, deactivate, error } = useWeb3React<Web3Provider>();
  const isUnsupportedChainIdError = error instanceof UnsupportedChainIdError;

  const isLogin = useAppSelector((state) => state.user.isLogin);

  const login = async (): Promise<void> => {
    try {
      if (!isMetaMaskInstalled()) {
        toast.error(errorMessage.META_MASK_DONT_INSTALLED.message, { hideProgressBar: true });
        return;
      }
      await onClickConnect();
      const signature = await getSignerSignMessage();
      await activate(injected);
      if (!getToken()) dispatch(setLogin());
      authenticateUser(signature as string);
      toast.success(successMessage.META_MASK_CONNECT_SUCCESSFULLY.message, { hideProgressBar: true });
    } catch (ex: any) {
      toast.error(ex.message, { hideProgressBar: true });
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await deactivate();
      unAuthenticateUser();
      dispatch(unSetLogin());
      toast.info(successMessage.META_MASK_DISCONNECT_SUCCESSFULLY.message, { hideProgressBar: true });
    } catch (ex: any) {
      toast.error(ex.message, { hideProgressBar: true });
    }
  };

  const handleWrongNetWork = async (): Promise<void> => {
    try {
      await addEthereumChain();
      await activate(injected);
    } catch (ex: any) {
      toast.error(ex.message, { hideProgressBar: true });
    }
  };

  useEffect(() => {
    if (account && active) {
      dispatch(setAccount({ address: account }));
      return;
    }
    dispatch(unSetAccount());
  }, [account, active]);

  useEffect(() => {
    if (getToken()) {
      dispatch(setLogin());
      return;
    }
    dispatch(unSetLogin());
  }, [getToken()]);

  return (
    <div>
      {!(active && isLogin) && (
        <div>
          {isUnsupportedChainIdError && isLogin ? (
            <ButtonConnect variant="outlined" color="primary" onClick={handleWrongNetWork}>
              Wrong network
            </ButtonConnect>
          ) : (
            <ButtonConnect variant="outlined" color="primary" onClick={login}>
              Connect Wallet
            </ButtonConnect>
          )}
        </div>
      )}
      {active && isLogin && (
        <div>
          <ButtonWallet variant="outlined" color="primary" onClick={logout}>
            Disconnect Wallet
          </ButtonWallet>
        </div>
      )}
    </div>
  );
};

export default ConnectWallet;
