import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Album from './AlbumLayout';
import { useParams, useNavigate } from 'react-router-dom';

export default function Domeniu() {
  const [materii, setMaterii] = useState([]);
  const [domeniu, setDomeniu] = useState({});
  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resDomeniu = await axios.get(`/api/domeniu/${id}`);
        setDomeniu(resDomeniu.data);
        const resMaterie = await axios.get('/api/materie/all');
        const carduri = resMaterie.data.map((materie) => ({
          id: materie.id,
          titlu: materie.nume,
          subtitlu: materie.descriere,
        }));
        setMaterii(carduri);
      } catch (e) {
        const err = e.response;
        if (err.status === 500) {
          alert('A aparut o eroare');
        }
      }
    };
    fetchData();
  }, [id]);

  const buttonHandler = (id) => {
    navigate(`/materie/${id}`);
  };
  return (
    <Album
      titlu={domeniu.nume}
      subtitlu='Alege din sfera noastra larga de materii'
      cards={materii}
      buttonHandler={buttonHandler}
    />
  );
}
