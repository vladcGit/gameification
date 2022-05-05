import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Album from './AlbumLayout';
import { useNavigate, useParams } from 'react-router-dom';

export default function Materie() {
  const [cursuri, setCursuri] = useState([]);
  const [materie, setMaterie] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resMaterie = await axios.get(`/api/materie/${id}`);
        setMaterie(resMaterie.data);
        console.log(resMaterie.data);
        const carduri = resMaterie.data.Curs.map((curs) => ({
          id: curs.id,
          titlu: curs.nume,
          subtitlu: curs.descriere,
        }));
        setCursuri(carduri);
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
    <Album
      titlu={materie.nume}
      subtitlu={materie.descriere}
      cards={cursuri}
      buttonHandler={({ id }) => navigate(`/curs/${id}`)}
    />
  );
}
