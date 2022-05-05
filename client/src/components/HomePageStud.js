import { Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Album from './AlbumLayout';

export default function HomePageStud({ user }) {
  const navigate = useNavigate();
  return (
    <>
      <Album
        titlu={`Bine ai venit, ${user.nume}`}
        subtitlu={'Incepe sa vezi oferta noastra apasand pe butonul de mai jos'}
      />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant='contained'
          color='primary'
          onClick={() => navigate('/domeniu')}
        >
          Domenii
        </Button>
      </div>
    </>
  );
}
