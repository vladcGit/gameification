import React, { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Appbar from './Appbar';
import axios from 'axios';
import { Modal, TextField } from '@mui/material';
import { formatDate } from '../util';

export default function Curs() {
  const [curs, setCurs] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [nume, setNume] = React.useState('');
  const [descriere, setDescriere] = React.useState('');
  const [text, setText] = React.useState('');

  const { id } = useParams();
  const navigate = useNavigate();

  const fetchCurs = async (id) => {
    try {
      const res = await axios.get(`/api/curs/${id}`);
      setCurs(res.data);
    } catch (e) {
      const err = e.response;
      if (err.status === 500) {
        alert('A aparut o eroare');
      }
    }
  };

  const fetchCursCallback = useCallback(() => {
    fetchCurs(id);
  }, [id]);

  React.useEffect(() => {
    const fetchUser = async (id) => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await axios.get(`/api/user`, {
            headers: {
              Authorization: token,
            },
          });
          setUser(res.data);
        }
      } catch (e) {
        const err = e.response;
        if (err.status === 500) {
          alert('A aparut o eroare');
        }
      }
    };

    fetchUser();
  }, []);

  React.useEffect(() => {
    fetchCursCallback();
  }, [fetchCursCallback]);

  const creazaLectie = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await axios.post(
          `/api/lectie/nou`,
          { nume, descriere, text, id_curs: id },
          {
            headers: {
              Authorization: token,
            },
          }
        );

        console.log(res.data);
        setOpen(false);
        setNume('');
        setDescriere('');
        setText('');
        fetchCursCallback();
      } catch (e) {
        const err = e.response;
        if (err.status === 500) {
          alert('A aparut o eroare');
        }
      }
    }
  };

  const stergeLectie = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        if (!window.confirm('Sigur vrei sa stergi aceasta lectie?')) return;
        await axios.delete(`/api/lectie/${id}`, {
          headers: { Authorization: token },
        });
        fetchCursCallback();
      }
    } catch (e) {
      const err = e.response;
      if (err.status === 500) {
        alert('A aparut o eroare');
      }
    }
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  return (
    <>
      <CssBaseline />
      <Appbar />
      <main>
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth='sm'>
            {curs && (
              <>
                <Typography
                  component='h1'
                  variant='h2'
                  align='center'
                  color='text.primary'
                  gutterBottom
                >
                  {curs.nume}
                </Typography>
                <Typography
                  variant='h5'
                  align='center'
                  color='text.secondary'
                  paragraph
                >
                  {curs.descriere}
                </Typography>
                <Stack
                  sx={{ pt: 4 }}
                  direction='row'
                  spacing={2}
                  justifyContent='center'
                ></Stack>
              </>
            )}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <Button variant='contained' onClick={() => setOpen(true)}>
                Creeaza o lectie
              </Button>
            </div>
          </Container>
        </Box>

        {/*Modal*/}
        <div>
          <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
          >
            <Box sx={modalStyle}>
              <Typography id='modal-modal-title' variant='h6' component='h2'>
                Creeaza o lectie noua
              </Typography>
              <Typography id='modal-modal-description' sx={{ mt: 2 }}>
                Introdu datele si apoi apasa pe buton. (pentru campul text se
                pot introduce mai multe linii)
              </Typography>
              <TextField
                placeholder='Nume lectie'
                value={nume}
                onChange={(e) => setNume(e.target.value)}
                margin={'normal'}
              />
              <TextField
                placeholder='Descriere lectie'
                value={descriere}
                onChange={(e) => setDescriere(e.target.value)}
                margin={'normal'}
              />
              <TextField
                placeholder='Continut text lectie'
                value={text}
                onChange={(e) => setText(e.target.value)}
                margin={'normal'}
                multiline
              />
              <Button
                variant='contained'
                color='primary'
                sx={{ margin: '10px' }}
                onClick={creazaLectie}
              >
                Creeaza
              </Button>
            </Box>
          </Modal>
        </div>
        {/*End Modal*/}

        {curs?.Lecties && (
          <Container sx={{ py: 8 }} maxWidth='sm'>
            <Grid container spacing={4}>
              {curs.Lecties.map((lectie) => (
                <Grid item key={lectie.id} xs={12}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom>
                        {formatDate(new Date(lectie.createdAt))}
                      </Typography>
                      <Typography gutterBottom variant='h5' component='h2'>
                        {lectie.nume}
                      </Typography>
                      <Typography>{lectie.descriere}</Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size='small'
                        onClick={() =>
                          navigate(`/curs/${id}/lectie/${lectie.id}`)
                        }
                      >
                        Vezi
                      </Button>
                      {user?.eProfesor && (
                        <>
                          <Button size='small' onClick={() => {}}>
                            Editeaza
                          </Button>
                          <Button
                            size='small'
                            color='secondary'
                            onClick={() => stergeLectie(lectie.id)}
                          >
                            Sterge
                          </Button>
                        </>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        )}
      </main>
    </>
  );
}
