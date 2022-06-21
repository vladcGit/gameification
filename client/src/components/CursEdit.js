import {
  Box,
  Button,
  CssBaseline,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import Appbar from './Appbar';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function CursEdit() {
  const [nume, setNume] = React.useState('');
  const [descriere, setDescriere] = React.useState('');

  const { id } = useParams();

  const navigate = useNavigate();

  const editCurs = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await axios.put(
        `/api/curs/${id}`,
        { nume, descriere },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      navigate(`/`);
    } catch (e) {
      const err = e.response;
      if (err.status === 500) {
        alert('A aparut o eroare');
      }
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/curs/${id}`);
        const { nume, descriere } = res.data;
        setNume(nume);
        setDescriere(descriere);
      } catch (e) {
        const err = e.response;
        if (err.status === 500) {
          alert('A aparut o eroare');
        }
      }
    };
    fetchData();
  }, [id]);

  return (
    <>
      <Appbar />
      <CssBaseline />
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 8,
          pb: 6,
        }}
      >
        <Grid
          container
          flexDirection={'column'}
          justifyContent='flex-start'
          alignItems={'center'}
          spacing={3}
          width='100vw'
        >
          <Grid item xs={12}>
            <Typography variant='h3' textAlign={'center'} color='text.primary'>
              Editeaza cursul
            </Typography>
          </Grid>
          <>
            <Grid item xs={12} sx={{ width: 300 }}>
              <TextField
                sx={{ width: 250 }}
                value={nume}
                onChange={(e) => setNume(e.target.value)}
                placeholder='nume'
              />
            </Grid>
            <Grid item xs={12} sx={{ width: 300 }}>
              <TextField
                sx={{ width: 250 }}
                value={descriere}
                onChange={(e) => setDescriere(e.target.value)}
                placeholder='descriere'
              />
            </Grid>
          </>
          <Grid item xs={12}>
            <Button
              variant='contained'
              color='primary'
              disabled={nume.length === 0 || descriere.length === 0}
              onClick={editCurs}
            >
              Salveaza
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
