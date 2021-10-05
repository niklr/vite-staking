import React from 'react';
import { LoadingButton } from '@mui/lab';

interface Props {
  children: React.ReactNode
  size?: 'small' | 'medium' | 'large'
  variant?: 'text' | 'outlined' | 'contained'
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
  fullWidth?: boolean
  autoFocus?: boolean
  callbackFn: () => Promise<void>
}

export const ClickOnceButton: React.FC<Props> = (props: Props) => {
  const [isDisabled, setIsDisabled] = React.useState(false)

  const handleClick = async () => {
    setIsDisabled(true)
    try {
      await props.callbackFn()
    } catch (error) {
      console.log(error)
    }
    setIsDisabled(false)
  }

  return (
    <LoadingButton
      loading={isDisabled}
      size={props.size ?? "small"}
      variant={props.variant ?? "contained"}
      color={props.color ?? "primary"}
      fullWidth={props.fullWidth}
      onClick={handleClick}
    >
      {props.children}
    </LoadingButton>
  );
}
