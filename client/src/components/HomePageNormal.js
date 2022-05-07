import React from 'react';
import Album from './AlbumLayout';
import { Button, Grid, Link, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function HomePageNormal() {
  const navigate = useNavigate();
  return (
    <div>
      <Album
        titlu='Bine ai venit!'
        subtitlu='Fie ca esti aici sa inveti concepte noi sau sa participi la competitii educationale, ai venit unde trebuie.'
      />
      <Grid container flexDirection={'column'} alignItems='center' spacing={3}>
        <Grid item xs={10}>
          <Typography variant='h5'>
            Inainte de a incepe te rugam sa iti faci un cont{' '}
            <Link
              component='span'
              variant='inherit'
              onClick={() => navigate('/signup')}
              sx={{ cursor: 'pointer' }}
            >
              aici
            </Link>{' '}
            sau sa intri in cont{' '}
            <Link
              component='span'
              variant='inherit'
              onClick={() => navigate('/login')}
              sx={{ cursor: 'pointer' }}
            >
              aici
            </Link>
          </Typography>
        </Grid>
        <Grid item xs={10}>
          <Button
            variant='contained'
            color='primary'
            onClick={() => navigate('/domeniu')}
          >
            Domeniile pe care le poti invata
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
