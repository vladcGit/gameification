import {
  Autocomplete,
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
import { useNavigate } from 'react-router-dom';

export default function CursNou() {
  const [domenii, setDomenii] = React.useState([]);
  const [domeniu, setDomeniu] = React.useState({});
  const [materii, setMaterii] = React.useState([]);
  const [materie, setMaterie] = React.useState(null);
  const [nume, setNume] = React.useState('');
  const [descriere, setDescriere] = React.useState('');

  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const resDomenii = await axios.get(`/api/domeniu/all`);
        setDomenii(resDomenii.data);
        if (resDomenii.data.length > 0) setDomeniu(resDomenii.data[0]);
      } catch (e) {
        const err = e.response;
        if (err.status === 500) {
          alert('A aparut o eroare');
        }
      }
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(domeniu);
        if (!domeniu.id) return;
        const resMaterii = await axios.get(`/api/domeniu/${domeniu.id}`);
        const mat = resMaterii.data.Materies;
        setMaterii(mat);
        if (mat.length > 0) setMaterie(mat[0]);
      } catch (e) {
        const err = e.response;
        if (err.status === 500) {
          alert('A aparut o eroare');
        }
      }
    };
    fetchData();
  }, [domeniu]);

  const creareCurs = async () => {
    try {
      await axios.post(
        `/api/curs/nou`,
        { nume, descriere, id_materie: materie.id },
        { headers: { Authorization: localStorage.getItem('token') } }
      );
      navigate('/');
    } catch (e) {
      const err = e.response;
      console.log(err);
      alert('eroare');
    }
  };

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
              Creeaza un curs
            </Typography>
          </Grid>
          <Grid item xs={12}>
            {domeniu && (
              <Autocomplete
                options={domenii.map((d) => d.nume)}
                value={domeniu.nume || ''}
                onChange={(event, newValue) => {
                  const domFilter = domenii.filter(
                    (d) => d.nume === newValue
                  )[0];
                  if (domFilter) setDomeniu(domFilter);
                }}
                renderInput={(params) => (
                  <TextField {...params} label='Domeniu' />
                )}
                sx={{ width: 300 }}
              />
            )}
          </Grid>
          <Grid item xs={12} sx={{ minWidth: 300 }}>
            {materii.length > 0 && materie && (
              <Autocomplete
                options={materii.map((m) => m.nume)}
                value={materie.nume || ''}
                onChange={(event, newValue) => {
                  const matFilter = materii.filter(
                    (m) => m.nume === newValue
                  )[0];
                  if (matFilter) setMaterie(matFilter);
                }}
                renderInput={(params) => (
                  <TextField {...params} label='Materie' />
                )}
                sx={{ width: 300 }}
              />
            )}
          </Grid>
          {domeniu && materie && (
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
          )}
          <Grid item xs={12}>
            <Button
              variant='contained'
              color='primary'
              disabled={
                !domeniu ||
                !materie ||
                nume.length === 0 ||
                descriere.length === 0
              }
              onClick={creareCurs}
            >
              Creeaza
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
