import React from 'react';
import { Tooltip } from '@mui/material';
import { CommonUtil } from '../../../../util/common.util';

interface Props {
  value?: string
  maxLength: number
  defaultValue?: string
}

export const TruncateTooltip: React.FC<Props> = (props: Props) => {
  const defaultValue = props.defaultValue ?? "-"
  const renderTooltip = () => {
    if (props.value && props.value.length > props.maxLength) {
      const truncateValue = CommonUtil.truncateString(props.value, props.maxLength)
      return (
        <Tooltip title={props.value} placement="top" arrow>
          <span>{truncateValue ?? defaultValue}</span>
        </Tooltip>
      )
    }
    return (
      <span>{props.value ?? defaultValue}</span>
    )
  }

  return (
    <>
      {renderTooltip()}
    </>
  );
}
