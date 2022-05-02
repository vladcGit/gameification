import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Album from './AlbumLayout';
import { useNavigate } from 'react-router-dom';

export default function Domenii() {
  const [domenii, setDomenii] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/domeniu/all`);
        const carduri = res.data.map((domeniu) => ({
          id: domeniu.id,
          titlu: domeniu.nume,
          subtitlu: domeniu.descriere,
        }));
        setDomenii(carduri);
      } catch (e) {
        const err = e.response;
        if (err.status === 500) {
          alert('A aparut o eroare');
        }
      }
    };
    fetchData();
  }, []);

  const handler = ({ id }) => {
    navigate(`/domeniu/${id}`);
  };

  return (
    <Album
      titlu='Domenii'
      subtitlu='Alege din sfera noastra larga de domenii'
      cards={domenii}
      buttonHandler={handler}
    />
  );
}
