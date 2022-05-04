import React, { useState, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ColorModeContext } from '../util';
import { useMediaQuery } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignInSide from './Signin';
import SignUp from './Signup';
import HomePage from './HomePage';
import Domenii from './Domenii';
import Domeniu from './Domeniu';
import Materie from './Materie';
import CursNou from './CursNou';
import Curs from './Curs';
import Page404 from './Page404';
import Lectie from './Lectie';
import CursEdit from './CursEdit';

export default function App() {
  const [mode, setMode] = useState('light');
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  React.useEffect(() => {
    if (prefersDarkMode) setMode('dark');
  }, [prefersDarkMode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  theme.typography.h3 = {
    fontSize: '1.2rem',
    '@media (min-width:600px)': {
      fontSize: '1.5rem',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '2rem',
    },
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route exact path='/' element={<HomePage />} />
            <Route exact path='/login' element={<SignInSide />} />
            <Route exact path='/signup' element={<SignUp />} />
            <Route exact path='/domeniu' element={<Domenii />} />
            <Route exact path='/domeniu/:id' element={<Domeniu />} />
            <Route exact path='/materie/:id' element={<Materie />} />
            <Route exact path='/curs/nou' element={<CursNou />} />
            <Route exact path='/curs/edit/:id' element={<CursEdit />} />
            <Route exact path='/curs/:id' element={<Curs />} />
            <Route
              exact
              path='/curs/:id/lectie/:idLectie'
              element={<Lectie />}
            />
            <Route path='*' element={<Page404 />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
