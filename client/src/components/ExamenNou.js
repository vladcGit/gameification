import {
  Button,
  Checkbox,
  CssBaseline,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import axios from 'axios';

import React, { useState } from 'react';
import Appbar from './Appbar';
import { useNavigate, useParams } from 'react-router-dom';

export default function ExamenNou() {
  const [nume, setNume] = useState('');
  const [descriere, setDescriere] = useState('');
  const [dataIncepere, setDataIncepere] = useState(new Date());
  const [durata, setDurata] = useState(0);
  const [intrebari, setIntrebari] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();

  const addIntrebare = () => {
    const copie = [...intrebari];
    copie.push({ text: '', indexRaspunsCorect: 0, variante: [] });
    setIntrebari(copie);
  };

  const addVarianta = (indexIntrebare) => {
    const copie = [...intrebari];
    copie[indexIntrebare].variante.push({ text: '' });
    setIntrebari(copie);
  };

  const handleCreateExamen = async () => {
    try {
      await axios.post(
        `/api/examen`,
        {
          nume,
          descriere,
          durata,
          id_curs: id,
          data_incepere: dataIncepere,
          intrebari,
        },
        { headers: { Authorization: localStorage.getItem('token') } }
      );
      navigate(`/curs/${id}`);
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
      <Grid
        container
        flexDirection={'column'}
        alignItems='center'
        marginTop={'20px'}
        spacing={3}
      >
        <Grid item xs={10}>
          <TextField
            label='nume'
            value={nume}
            onChange={(e) => setNume(e.target.value)}
            sx={{ minWidth: '300px' }}
          />
        </Grid>
        <Grid item xs={10}>
          <TextField
            label='descriere'
            value={descriere}
            onChange={(e) => setDescriere(e.target.value)}
            sx={{ minWidth: '300px' }}
          />
        </Grid>
        <Grid item xs={10}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label='data inceput'
              value={dataIncepere}
              onChange={(newValue) => setDataIncepere(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={10}>
          <TextField
            type='number'
            label='durata (in minute)'
            value={durata}
            onChange={(e) => setDurata(e.target.value)}
            sx={{ minWidth: '300px' }}
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid item xs={10}>
          <Typography variant='h3'>Grile:</Typography>
        </Grid>
        {intrebari.map((intrebare, index) => (
          <Grid item xs={10} mt='20px' key={`intrebare ${index}`}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: '5px solid gray',
                padding: '20px',
                borderRadius: '20px',
              }}
            >
              <Typography gutterBottom>{`Intrebarea ${index}:`}</Typography>
              <TextField
                label='text intrebare'
                value={intrebare.text}
                onChange={(e) => {
                  const value = e.target.value;
                  const copie = [...intrebari];
                  copie[index].text = value;
                  setIntrebari(copie);
                }}
                sx={{ marginBottom: '10px' }}
              />
              <div style={{ marginBottom: '30px' }}>
                {intrebare.variante.length < 5 && (
                  <Button onClick={() => addVarianta(index)}>
                    Adauga o varianta
                  </Button>
                )}
              </div>
              {intrebare.variante.map((varianta, indexVarianta) => (
                <div
                  key={`intrebare ${index} varianta ${indexVarianta}`}
                  style={{ marginTop: '20px' }}
                >
                  <TextField
                    label={`text varianta ${'abcde'[indexVarianta]}`}
                    value={varianta.text}
                    onChange={(e) => {
                      const value = e.target.value;
                      const copie = [...intrebari];
                      copie[index].variante[indexVarianta].text = value;
                      setIntrebari(copie);
                    }}
                  />
                  <Checkbox
                    checked={indexVarianta === intrebare.indexRaspunsCorect}
                    onChange={() => {
                      const copie = [...intrebari];
                      copie[index].indexRaspunsCorect = indexVarianta;
                      setIntrebari(copie);
                    }}
                  />
                </div>
              ))}
            </div>
          </Grid>
        ))}
        <Grid item xs={10}>
          <Button variant='contained' color='secondary' onClick={addIntrebare}>
            Adauga intrebare
          </Button>
          <Grid item xs={10} margin='10px'>
            <Button variant='contained' onClick={handleCreateExamen}>
              Creeaza examen
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
