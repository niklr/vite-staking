import * as React from 'react';
import { Pool, PoolDialogState, PoolDialogType } from '../../../../util/types';
import { PoolDepositDialog } from '../dialog-deposit';
import { PoolWithdrawDialog } from '../dialog-withdraw';

interface Props {
  pool: Pool
  state: PoolDialogState
  setState: React.Dispatch<React.SetStateAction<PoolDialogState>>
}

export const PoolDialog: React.FC<Props> = (props: Props) => {
  switch (props.state.type) {
    case PoolDialogType.WITHDRAW:
      return <PoolWithdrawDialog pool={props.pool} state={props.state} setState={props.setState}></PoolWithdrawDialog>
    case PoolDialogType.DEPOSIT:
      return <PoolDepositDialog pool={props.pool} state={props.state} setState={props.setState}></PoolDepositDialog>
    default:
      return <></>
  }
}
