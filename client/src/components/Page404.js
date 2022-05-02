import { Box, CssBaseline, Typography } from '@mui/material';
import React from 'react';
import Appbar from './Appbar';

export default function Page404() {
  return (
    <>
      <CssBaseline />
      <Appbar />
      <main>
        <Box sx={{ bgcolor: 'background.paper' }}>
          <Typography color='text.primary' variant='h3' textAlign={'center'}>
            Page not found
          </Typography>
        </Box>
      </main>
    </>
  );
}
