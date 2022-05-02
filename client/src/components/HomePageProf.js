import {
  Avatar,
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Album from './AlbumLayout';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ComputerIcon from '@mui/icons-material/Computer';
import { Link } from 'react-router-dom';

export default function HomePageProf({ user }) {
  const [cursuri, setCursuri] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const resCurs = await axios.get(`/api/curs/user`, {
          headers: { Authorization: localStorage.getItem('token') },
        });
        if (!resCurs.data) return;

        const resMaterii = await axios.get(`/api/materie/all`);
        for (let curs of resCurs.data) {
          curs.materie = resMaterii.data.filter(
            (m) => m.id === curs.id_materie
          )[0].nume;
        }
        console.log(resCurs.data);
        setCursuri(resCurs.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, []);
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    if (!window.confirm('Sigur vrei sa stergi cursul?')) return;
    const res = await fetch(`/api/curs/sterge/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      const cursuriRamase = cursuri.filter((c) => c.id !== id);
      setCursuri(cursuriRamase);
    } else alert('Error');
  };

  return (
    <>
      <Album
        titlu={`Bine ai venit, ${user.nume}`}
        subtitlu='Creeaza, modifica sau sterge cursuri'
      />
      <Grid
        container
        flexDirection={'column'}
        justifyContent='flex-start'
        alignItems={'center'}
        spacing={3}
        width='100vw'
      >
        <Grid item>
          <Button
            variant='contained'
            color='secondary'
            onClick={() => navigate('/curs/nou')}
          >
            Creeaza un curs
          </Button>
        </Grid>
        <Grid item xs={10}>
          <List
            component='nav'
            sx={{ overflowY: 'auto', marginBottom: '50px' }}
          >
            {Array.isArray(cursuri) &&
              cursuri.length > 0 &&
              cursuri.map((curs) => {
                return (
                  <ListItem key={curs.id}>
                    <ListItemButton component={Link} to={`/curs/${curs.id}`}>
                      <ListItemAvatar>
                        <Avatar>
                          <ComputerIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${curs.nume} (${curs.materie})`}
                        secondary={`${curs.descriere}`}
                      />
                    </ListItemButton>
                    <IconButton component={Link} to={`/curs/edit/${curs.id}`}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(curs.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                );
              })}
          </List>
        </Grid>
      </Grid>
    </>
  );
}
