import React from 'react';
import axios from 'axios';
import { Box, Button, Checkbox, Grid, Typography } from '@mui/material';
import Appbar from './Appbar';
import { Navigate, useParams } from 'react-router-dom';
import CountdownTimer from './CountdownTimer';
import SimpleText from './componenteExamen/SimpleText';
import ExamenTerminat from './componenteExamen/ExamenTerminat';

export default function Examen() {
  const { id } = useParams();
  const [examen, setExamen] = React.useState(null);
  const [isStarted, setIsStarted] = React.useState(false);
  const [isOver, setIsOver] = React.useState(false);
  const [finished, setFinished] = React.useState(false);
  const [indexIntrebare, setindexIntrebare] = React.useState(0);
  const [intrebare, setintrebare] = React.useState({});
  const [indexRaspuns, setIndexRaspuns] = React.useState({});
  const [punctaj, setPunctaj] = React.useState(-1);
  const [redirect, setRedirect] = React.useState('');

  const alphabet = 'abcdefghijklmnopqrstuvwxyz';

  const callbackSendExam = React.useCallback(async () => {
    setFinished(true);
    if (punctaj > -1) return;
    try {
      const raspunsuri = JSON.parse(localStorage.getItem('examen')).raspunsuri;
      const res = await axios.post(
        `/api/examen/${id}/termina`,
        { raspunsuri },
        { headers: { Authorization: localStorage.getItem('token') } }
      );
      setPunctaj(res.data.punctaj);
      localStorage.removeItem('examen');
    } catch (e) {
      const err = e.response;
      if (err.status === 404) {
        alert('Nu exista acest examen');
        console.log(err);
      } else if (err.status === 500) {
        alert('A aparut o eroare');
        console.log(err);
      }
    }
  }, [id, punctaj]);

  //se asigura ca se da submit automat cand se termina timpul
  React.useEffect(() => {
    let timer;
    if (isStarted && examen) {
      timer = setInterval(() => {
        const timpTerminare =
          new Date(examen.data_incepere).getTime() + examen.durata * 60 * 1000;
        if (timpTerminare < new Date().getTime()) {
          setIsOver(true);
          callbackSendExam();
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [examen, isStarted, callbackSendExam]);

  //incarcare date initiale
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const resExamen = await axios.get(`/api/examen/${id}`);

        //sortare variante raspuns dupa createdAt
        for (let intrebare of resExamen.data.Intrebares) {
          intrebare.Varianta.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
        }

        setExamen(resExamen.data);

        //verifica daca examenul s-a terminat
        const timpTerminare =
          new Date(resExamen.data.data_incepere).getTime() +
          resExamen.data.durata * 60 * 1000;
        if (timpTerminare < new Date().getTime()) {
          setIsOver(true);
        }

        //verifica daca examenul a fost sustinut
        const resTerminat = await axios.get(`/api/examen/${id}/rezultat`, {
          headers: { Authorization: localStorage.getItem('token') },
        });
        if (resTerminat.data.sustinut === true) {
          setFinished(true);
          setIsStarted(true);
          setPunctaj(resTerminat.data.punctaj);
          return;
        }

        // verifica daca examenul a inceput
        const diffTime = new Date() - new Date(resExamen.data.data_incepere);

        if (diffTime > 0) {
          setIsStarted(true);

          //verifica daca la unele intrebari a fost primit raspuns
          const obiect = JSON.parse(localStorage.getItem('examen'));
          if (obiect == null || obiect.id_examen !== resExamen.data.id) {
            //obiect initial
            localStorage.setItem(
              'examen',
              JSON.stringify({
                id_examen: resExamen.data.id,
                raspunsuri: [],
              })
            );
          } else {
            //modificare index intrebare curenta in functie de obiectul din localStorage
            const index = obiect.raspunsuri.length;
            setindexIntrebare(index);
            setintrebare(resExamen.data.Intrebares[index]);
            if (index === resExamen.data.Intrebares.length) setFinished(true);
          }
        }
      } catch (e) {
        const err = e.response;
        if (err.status === 404) {
          alert('Nu exista acest examen');
        } else if (err.status === 500) {
          alert('A aparut o eroare');
        }
      }
    };
    if (localStorage.getItem('token')) fetchData();
  }, [id]);

  // redirect catre login daca nu esti autentificat
  React.useEffect(() => {
    if (!localStorage.getItem('token')) setRedirect('/login');
  }, []);

  // schimbare text intrebare dupa ce e trimisa cea veche
  React.useEffect(() => {
    setintrebare(examen?.Intrebares[indexIntrebare]);
  }, [indexIntrebare, examen]);

  // raspunde la intrebare si, daca e cazul, trimite test
  const handleSubmit = async () => {
    if (indexIntrebare == null) return alert('Selecteaza un raspuns');
    const obiect = JSON.parse(localStorage.getItem('examen'));
    if (obiect.raspunsuri.length < examen.Intrebares.length) {
      obiect.raspunsuri.push({
        id_intrebare: examen.Intrebares[indexIntrebare].id,
        raspuns: alphabet[indexRaspuns],
      });
      setindexIntrebare(indexIntrebare + 1);
      setIndexRaspuns(null);
      localStorage.setItem('examen', JSON.stringify(obiect));
    }

    if (obiect.raspunsuri.length === examen.Intrebares.length)
      await callbackSendExam();
  };

  const Component = () => (
    <>
      <Grid item xs={12}>
        <CountdownTimer
          targetDate={
            new Date(examen?.data_incepere).getTime() +
            examen.durata * 60 * 1000
          }
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant='h2'>- Test -</Typography>
      </Grid>

      <Grid item xs={12} mb='40px' textAlign={'center'}>
        <Typography variant='h3' textAlign={'center'}>
          {`Intrebarea ${indexIntrebare + 1}: ${intrebare?.text}`}
        </Typography>
      </Grid>
      {intrebare?.Varianta.map((raspuns, index) => (
        <Grid
          item
          xs={10}
          key={raspuns.id}
          minWidth='70vw'
          display={'flex'}
          justifyContent='center'
          alignItems={'center'}
        >
          <Checkbox
            checked={index === indexRaspuns}
            onChange={() => {
              if (index !== indexRaspuns) setIndexRaspuns(index);
              else setIndexRaspuns(null);
            }}
          />
          <Typography>{`${alphabet[index]}. ${raspuns.text}`}</Typography>
        </Grid>
      ))}
      <Button variant='contained' color='primary' onClick={handleSubmit}>
        Trimite
      </Button>
    </>
  );

  return (
    <Box
      sx={{
        width: '100vw',
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
      }}
    >
      {redirect.length > 0 && <Navigate to={redirect} />}
      <Appbar />
      <Grid
        container
        flexDirection={'column'}
        alignItems='center'
        justifyContent={'center'}
        spacing={5}
      >
        {examen && isStarted && !isOver && !finished && <Component />}
        {!isOver && finished && isStarted && examen && (
          <SimpleText text='Ai terminat examenul, vei primi rezultatele dupa expirarea timpului' />
        )}
        {isOver && finished && (
          <ExamenTerminat punctaj={punctaj} examen={examen} />
        )}
        {examen && !isStarted && !isOver && !finished && (
          <SimpleText text='Nu a inceput' />
        )}
        {examen && isStarted && isOver && !finished && (
          <SimpleText text='Examen terminat' />
        )}
      </Grid>
    </Box>
  );
}
