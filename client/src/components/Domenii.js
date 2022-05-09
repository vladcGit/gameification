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

        //experienta

        const token = localStorage.getItem('token');
        if (!token) return;

        const resUser = await axios.get(`/api/user`, {
          headers: {
            Authorization: token,
          },
        });

        if (resUser.data.eProfesor) return;

        const resXp = await axios.get(`/api/experienta`, {
          headers: {
            Authorization: token,
          },
        });

        const domeniiCopie = [...carduri];
        for (let domeniu of domeniiCopie) {
          const filtrate = resXp.data.filter(
            (xp) => xp.id_domeniu === domeniu.id
          );
          if (filtrate.length === 0) {
            domeniu.subtitlu += ' (Incepator, 0 experienta)';
          } else {
            const resPozitieClasament = await axios.get(
              `/api/experienta/domeniu/${domeniu.id}/clasament`,
              {
                headers: {
                  Authorization: token,
                },
              }
            );
            domeniu.subtitlu += ` (${filtrate[0].rank}, ${Math.round(
              filtrate[0].xp
            )} experienta, locul ${
              resPozitieClasament.data.pozitie
            } in clasament)`;
          }
        }
        setDomenii(domeniiCopie);
        console.log(domeniiCopie);
      } catch (e) {
        console.log(e);
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
