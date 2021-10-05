import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// A custom theme for this app
// https://github.com/mui-org/material-ui/tree/master/examples/create-react-app-with-typescript
const theme = createTheme({
  palette: {
    primary: {
      main: '#007aff',
    },
    secondary: {
      main: '#c5d5ff',
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;