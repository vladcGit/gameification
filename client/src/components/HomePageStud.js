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
  Typography,
} from '@mui/material';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Album from './AlbumLayout';
import axios from 'axios';
import ComputerIcon from '@mui/icons-material/Computer';
import DeleteIcon from '@mui/icons-material/Delete';

export default function HomePageStud({ user }) {
  const [cursuriAccesate, setCursuriAccesate] = React.useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchCursuriAccesate = async () => {
      const res = await axios.get('/api/curs_student/user', {
        headers: { Authorization: localStorage.getItem('token') },
      });
      setCursuriAccesate(res.data);
    };
    fetchCursuriAccesate();
  }, []);

  const stergeCursStudent = async (id, cursId) => {
    const res = await axios.delete(`/api/curs_student/${id}`, {
      headers: { Authorization: localStorage.getItem('token') },
    });
    if (res.status === 200) {
      const cursuriRamase = cursuriAccesate.filter(
        (curs) => curs.id !== cursId
      );
      setCursuriAccesate(cursuriRamase);
    }
  };
  return (
    <>
      <Album
        titlu={`Bine ai venit, ${user.nume}`}
        subtitlu={'Incepe sa vezi oferta noastra apasand pe butonul de mai jos'}
      />
      <Grid container flexDirection={'column'} alignItems='center' spacing={3}>
        <Grid item xs={10}>
          <Button
            variant='contained'
            color='primary'
            onClick={() => navigate('/domeniu')}
          >
            Domenii
          </Button>
        </Grid>
        {cursuriAccesate.length > 0 && (
          <Grid item xs={10} marginTop='50px'>
            <Typography variant='h5'>
              Lista cursurilor accesate in trecut:
            </Typography>

            <List
              component='nav'
              sx={{ overflowY: 'auto', marginBottom: '50px' }}
            >
              {cursuriAccesate.map((curs) => {
                return (
                  <ListItem key={curs.id}>
                    <ListItemButton component={Link} to={`/curs/${curs.id}`}>
                      <ListItemAvatar>
                        <Avatar>
                          <ComputerIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${curs.nume}`}
                        secondary={`${curs.descriere}`}
                      />
                    </ListItemButton>
                    <IconButton
                      onClick={() =>
                        stergeCursStudent(curs.CursuriStudents[0].id, curs.id)
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                );
              })}
            </List>
          </Grid>
        )}
      </Grid>
    </>
  );
}
