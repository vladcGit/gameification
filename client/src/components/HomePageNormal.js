import React from 'react';
import Album from './AlbumLayout';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function HomePageNormal() {
  const navigate = useNavigate();
  return (
    <div>
      <Album
        titlu='Album layout'
        subtitlu="Something short and leading about the collection below—its
          contents, the creator, etc. Make it short and sweet, but not too
          short so folks don't simply skip over it entirely."
      />
      <div>
        <Button
          variant='contained'
          color='primary'
          onClick={() => navigate('/domeniu')}
        >
          Domenii
        </Button>
      </div>
    </div>
  );
}
