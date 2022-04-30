import { Button } from '@mui/material';
import React from 'react';
import Album from './AlbumLayout';

export default function HomePageStud({ user }) {
  return (
    <>
      <Album
        titlu={`Bine ai venit, ${user.nume}`}
        subtitlu={'Incepe sa vezi oferta noastra apasand pe butonul de mai jos'}
      />
      <Button variant='contained' color='primary'>
        Vezi domenii
      </Button>
    </>
  );
}
