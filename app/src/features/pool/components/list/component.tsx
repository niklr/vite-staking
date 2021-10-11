import { Grid } from "@mui/material";
import { Pool } from "../../../../util/types";
import { Alert } from "../../../common/components/alert";
import { PoolListItem } from "../list-item";

interface Props {
  pools?: Maybe<Pool[]>
}

export const PoolList: React.FC<Props> = (props: Props) => {
  console.log(props.pools)

  if (props.pools && props.pools.length <= 0) {
    return (
      <Grid item key="1" xs={12} md={6}>
        <Alert message="No pools found." type="default"></Alert>
      </Grid>
    );
  }

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center" spacing={3}>
      {!props.pools ? (
        <>
          {[0, 1, 2].map((index: number) => (
            <Grid item key={index} xs={12} md={10}>
              <PoolListItem></PoolListItem>
            </Grid>
          ))}
        </>
      ) : (
        <>
          {props.pools.map((p: Pool) => (
            <Grid item key={p.id} xs={12} md={10}>
              <PoolListItem pool={p}></PoolListItem>
            </Grid>
          ))}
        </>
      )}
    </Grid>
  );
}
