import { Grid } from "@mui/material";
import { Alert } from "../../../common/components/alert";
import { PoolListItem } from "../list-item";

interface Props {
  total: number;
  filter?: Maybe<any>;
}

export const PoolList: React.FC<Props> = (props: Props) => {
  const total = props.total;
  const indexes: number[] = [];
  if (props.filter) {
    throw Error("Not implemented.");
  } else {
    for (let index = total; indexes.length < total; index--) {
      indexes.push(index - 1);
    }
  }

  if (indexes.length <= 0) {
    return (
      <Grid item key="1" xs={12} md={6}>
        <Alert message="No pools found." type="default"></Alert>
      </Grid>
    );
  }

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center" spacing={3}>
      {indexes.map((index: number) => (
        <Grid item key={index} xs={12} md={10}>
          <PoolListItem index={index}></PoolListItem>
        </Grid>
      ))}
    </Grid>
  );
}
