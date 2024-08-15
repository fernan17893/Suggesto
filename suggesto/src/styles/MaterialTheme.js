import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#e50914', 
    },
    secondary: {
      main: '#b20710', // Slightly darker for hover
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#b20710', // Darker red on hover
          },
        },
      },
    },
  },
});

export default theme;
