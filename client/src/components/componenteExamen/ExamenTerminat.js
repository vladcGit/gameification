import * as React from 'react';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import { useTheme } from '@emotion/react';
import SimpleText from './SimpleText';
import BasicTable from '../BasicTable';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function ExamenTerminat({ examen, punctaj }) {
  const [lista, setLista] = React.useState([]);
  const [xp, setXp] = React.useState(0);

  const navigate = useNavigate();

  const text =
    punctaj > -1 && punctaj !== 1
      ? `Ai obtinut ${punctaj} puncte din ${examen?.Intrebares.length}`
      : punctaj > -1
      ? `Ai obtinut ${punctaj} punct din ${examen?.Intrebares.length}`
      : 'Examen terminat, se calculeaza punctajul';

  const theme = useTheme();
  const secondaryColor = theme.palette.warning.main;

  React.useEffect(() => {
    const fetchDate = async () => {
      const res = await axios.get(`/api/examen/${examen.id}/raspunsuri`, {
        headers: { Authorization: localStorage.getItem('token') },
      });
      setLista(res.data.lista);
      setXp(res.data.xp);
      console.log(res.data);
    };
    fetchDate();
  }, [examen.id]);

  return (
    <>
      <SimpleText text={text} />
      <Grid item xs={12} mt='30px'>
        <Button
          variant='contained'
          color='primary'
          onClick={() => navigate(`/examen/${examen.id}/clasament`)}
        >
          Clasament
        </Button>
      </Grid>
      <Grid item xs={10} mt='20px'>
        <BasicTable
          columns={['Numar intrebare', 'Trimis', 'Corect']}
          rows={lista}
          highlightColor={secondaryColor}
          predicatHighlight={(row) => row.trimis !== row.corect}
        />
      </Grid>
      <Grid item xs={10} mt='20px'>
        {`Ai obtinut ${Math.round(xp)} puncte de experienta pentru acest quiz`}
      </Grid>
    </>
  );
}
