import React, { useEffect, useRef, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { TextField, TextFieldProps, InputAdornment, Button, ButtonProps, Link, LinkProps } from '@mui/material';

import { ReactComponent as DownIcon } from 'assets/images/down-icon.svg';
import { ReactComponent as DownDarkIcon } from 'assets/images/down-dark-icon.svg';
import debounce from 'lodash/debounce';
import { useAppDispatch, useAppSelector } from 'stores/hooks';
import { setIsLoadEstimateToken } from 'services/swap';
import isEqual from 'lodash/isEqual';

interface Props {
  name: string;
  value: number | null;
  isMax?: boolean;
  max?: number;
  min?: number;
  selected: number | any;
  tokens: Array<any>;
  onMax?: () => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeToken: (name: string) => void;
  tokenIds: string[];
}

const TextFieldSwap = styled(TextField)<TextFieldProps>(({ theme }) => ({
  borderRadius: '9px',

  input: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '18px',
    lineHeight: '33px',
    textAlign: 'right',
    letterSpacing: '0.04em',
    textTransform: 'capitalize',
    color: theme.palette.mode === 'light' ? '#293247' : '#fff',
    borderRadius: '9px',

    '&:placeholder': {
      color: theme.palette.mode === 'light' ? '#BEBFCF' : '#BEBFCF',
    },

    '&::-webkit-outer-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
    '&::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
  },
  '& label.Mui-focused': {
    color: 'rgba(56, 100, 255, 0.26)',
  },

  '& .MuiOutlinedInput-root': {
    background: theme.palette.mode === 'light' ? '#F9FAFF' : '#252525',

    '& fieldset': {
      borderColor: 'rgba(56, 100, 255, 0.26)',
      borderRadius: '9px',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(56, 100, 255, 0.26)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'rgba(56, 100, 255, 0.26)',
    },
  },
}));

const ButtonMax = styled(Button)<ButtonProps>(({ theme }) => ({
  background: theme.palette.mode === 'light' ? '#E9EDFF' : '#171717',
  borderRadius: '6px',
  fontFamily: 'Poppins',
  fontStyle: 'normal',
  fontWeight: '400',
  fontSize: '14px',
  lineHeight: '26px',
  letterSpacing: '0.04em',
  color: theme.palette.mode === 'light' ? '#293247' : '#fff',
  padding: '0px',
  minWidth: '51px',

  [theme.breakpoints.down('sm')]: {
    fontSize: '12px',
    lineHeight: '22px',
    minWidth: '47px',
  },
}));

const TokenActive = styled(Link)<LinkProps>(({ theme }) => ({
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  fontFamily: 'Poppins',
  fontStyle: 'normal',
  fontWeight: '400',
  fontSize: '16px',
  lineHeight: '29px',
  letterSpacing: '0.04em',
  textTransform: 'capitalize',
  color: theme.palette.mode === 'light' ? '#293247' : '#fff',
  borderRight: '1px solid rgba(56, 100, 255, 0.2) !important',
  marginRight: '9px',
  minWidth: '114px',
  cursor: 'pointer',

  p: {
    margin: 0,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '16px',
    lineHeight: '33px',
    letterSpacing: '0.04em',
    textTransform: 'capitalize',
    color: theme.palette.mode === 'light' ? '#293247' : '#fff',
  },

  svg: {
    marginLeft: 'auto',
    marginRight: '10px',
  },

  [theme.breakpoints.down('sm')]: {
    fontSize: '14px',
    lineHeight: '26px',

    p: {
      fontSize: '14px',
      lineHeight: '26px',
    },
  },
}));

const InputSwap: React.FC<Props> = ({
  name,
  value,
  max,
  min,
  selected,
  onMax,
  onChange,
  onChangeToken,
  tokens,
  isMax,
  tokenIds,
}) => {
  const [inputValue, setInputValue] = useState(String(value));
  const theme = useTheme();
  const selectedToken = tokens.filter((item) => item.id === selected)[0];
  const selectedName = useAppSelector((state) => state.swap.selectedName);
  const currentExchangeIdsRef = useRef(tokenIds);
  const selectedNameRef = useRef(selectedName);
  const dispatch = useAppDispatch();

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event);
  };
  const debounceRef = useRef(
    debounce((event) => {
      handleValueChange(event);
    }, 500),
  );

  useEffect(() => {
    if (!isEqual(currentExchangeIdsRef.current, tokenIds) || !isEqual(selectedNameRef.current, selectedName)) {
      debounceRef.current = debounce((event) => {
        handleValueChange(event);
      }, 500);
      currentExchangeIdsRef.current = tokenIds;
      selectedNameRef.current = selectedName;
      return () => {
        debounceRef.current.cancel();
      };
    }
  }, [selectedName, tokenIds]);

  useEffect(() => {
    if (selectedName !== name) {
      setInputValue(String(value));
    }
  }, [value, selectedName]);

  return (
    <TextFieldSwap
      placeholder="0.0000"
      type="number"
      name={name}
      fullWidth
      value={inputValue}
      onChange={(event) => {
        dispatch(setIsLoadEstimateToken(true));
        if (debounceRef.current) {
          setInputValue(event.target.value);
          debounceRef.current(event);
        }
      }}
      InputProps={{
        inputProps: {
          max: max,
          min: min,
        },
        startAdornment: (
          <InputAdornment position="start">
            <TokenActive onClick={() => onChangeToken(name)}>
              <img alt="" src={selectedToken.logo} width={27} style={{ marginRight: 9 }} />
              <p>{selectedToken.name}</p> {theme.palette.mode === 'light' ? <DownIcon /> : <DownDarkIcon />}
            </TokenActive>

            {isMax && <ButtonMax onClick={onMax}>Max</ButtonMax>}
          </InputAdornment>
        ),
      }}
    />
  );
};

export default InputSwap;
