import { CssBaseline, Grid, Typography, Divider } from '@mui/material';
import React from 'react';
import Appbar from './Appbar';
import axios from 'axios';
import { formatDate } from '../util';

export default function Profil() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const res = await axios.get(`/api/user/profil`, {
          headers: {
            Authorization: token,
          },
        });
        setUser(res.data);
        console.log(res.data);
      }
    };
    fetchData();
  }, []);

  const calculateXp = (vector) => {
    return vector
      .map((e) => e.xp)
      .reduce((partialSum, a) => partialSum + a, 0)
      .toFixed(2);
  };
  return (
    <>
      <CssBaseline />
      <Appbar />
      {user && (
        <Grid
          container
          flexDirection={'column'}
          alignItems='center'
          justifyContent={'center'}
          minHeight='70vh'
          spacing={3}
        >
          <Grid item xs={10}>
            <Typography variant='h3'>Nume: {user.nume}</Typography>
          </Grid>
          <Grid item xs={10}>
            <Typography variant='h3'>Email: {user.email}</Typography>
          </Grid>
          <Grid item xs={10}>
            <Typography variant='h3'>
              Data inregistrare: {formatDate(new Date(user.createdAt))}
            </Typography>
            <Divider flexItem sx={{ mt: '20px' }} />
          </Grid>
          {user.eProfesor ? (
            <>
              <Grid item xs={10}>
                <Typography variant='h3'>
                  Cursuri create: {user.Curs.length}
                </Typography>
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={10}>
                <Typography variant='h3'>
                  Cursuri active: {user.CursuriStudents.length}
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Typography variant='h3'>
                  Examene finalizate: {user.ExamenStudents.length}
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Typography variant='h3'>
                  Experienta totala: {calculateXp(user.Experienta)} xp
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Typography variant='h3'>
                  Nivel total: {Math.floor(calculateXp(user.Experienta) / 100)}
                </Typography>
              </Grid>
            </>
          )}
        </Grid>
      )}
    </>
  );
}
