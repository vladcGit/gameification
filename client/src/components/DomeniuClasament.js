import { Box, Button, Modal, useTheme } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { useParams } from 'react-router-dom';
import BasicTable from './BasicTable';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: '50vw',
  maxWidth: '90vw',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 1,
};

export default function DomeniuClasament() {
  const [open, setOpen] = React.useState(false);
  const [lista, setLista] = React.useState([]);
  const [user, setUser] = React.useState(null);

  const { id } = useParams();

  const theme = useTheme();
  const secondaryColor = theme.palette.warning.main;

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`/api/experienta/all`, {
          headers: {
            Authorization: token,
          },
        });
        const entries = res.data;
        for (let entry of entries) {
          const resStud = await axios.get(`/api/user/${entry.id_student}`);
          entry.name = resStud.data.nume;
        }
        const mappedData = entries
          .filter((entry) => entry.id_domeniu === parseInt(id))
          .map((entry) => ({
            id_student: entry.id_student,
            name: entry.name,
            experienta: entry.xp.toFixed(2),
            rank: entry.rank,
          }));
        mappedData.sort((a, b) => b.experienta - a.experienta);
        setLista(mappedData);

        const resUser = await axios.get(`/api/user`, {
          headers: {
            Authorization: token,
          },
        });

        setUser(resUser.data);
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
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <Button variant='contained' onClick={() => setOpen(true)}>
        Afiseaza clasament
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <BasicTable
            columns={['pozitie', 'id_student', 'nume', 'experienta', 'rank']}
            rows={lista}
            highlightColor={secondaryColor}
            predicatHighlight={(row) => row.id_student === user.id}
          />
        </Box>
      </Modal>
    </div>
  );
}
