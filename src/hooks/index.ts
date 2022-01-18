import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { injected } from 'connectors';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';
import { errorMessage } from 'messages/errorMessages';
import { unAuthenticateUser } from 'services/auth';

export const useEagerConnect = () => {
  const { activate, active } = useWeb3React();

  const [tried, setTried] = useState(false);

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized: boolean) => {
      if (isAuthorized) {
        activate(injected, undefined, true).catch(() => {
          setTried(true);
        });
      } else {
        setTried(true);
      }
    });
  }, []);

  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  return tried;
};

export const useInactiveListener = (suppress = false) => {
  const { active, error, activate, deactivate } = useWeb3React();
  const validChainId = ethers.utils.hexlify(Number(process.env.REACT_APP_CHAIN_ID));

  useEffect((): any => {
    const { ethereum } = window as any;
    if (ethereum) {
      ethereum.removeAllListeners(['networkChanged']);
    }

    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleChainChanged = async (chainId: string | number) => {
        if (chainId.toString() !== validChainId.toString()) {
          toast.error(errorMessage.META_MASK_WRONG_NETWORK.message, { hideProgressBar: true });
          return;
        }
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const handleAccountsChanged = async (accounts: string[]) => {};

      // ethereum.on('chainChanged', handleChainChanged);
      ethereum.on('accountsChanged', handleAccountsChanged);
      injected.on('Web3ReactDeactivate', unAuthenticateUser);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('chainChanged', handleChainChanged);
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, [active, error, suppress, activate, deactivate]);
};
