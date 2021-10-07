import React from "react";

interface Props {
  index: number;
}

export const PoolListItem: React.FC<Props> = (props: Props) => {
  return (
    <>
      {props.index}
    </>
  );
}