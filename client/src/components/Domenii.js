import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Album from './AlbumLayout';
import { useNavigate } from 'react-router-dom';
import ModalRank from './ModalRank';

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
            domeniu.subtitlu += '\nIncepator\n0 experienta';
          } else {
            const resPozitieClasament = await axios.get(
              `/api/experienta/domeniu/${domeniu.id}/clasament`,
              {
                headers: {
                  Authorization: token,
                },
              }
            );

            let xpRamas;
            if (filtrate[0].xp < 200)
              xpRamas =
                Number(200 - filtrate[0].xp).toFixed(2) +
                ' puncte de experienta pana la urmatorul rank';
            else if (filtrate[0].xp < 500)
              xpRamas =
                Number(500 - filtrate[0].xp).toFixed(2) +
                ' puncte de experienta pana la urmatorul rank';
            else xpRamas = 'Rank maxim atins';

            domeniu.subtitlu += `\n${
              filtrate[0].rank
            } (${xpRamas}) \n${Math.round(filtrate[0].xp)} experienta \nlocul ${
              resPozitieClasament.data.pozitie
            } in clasament`;
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
    <>
      <Album
        titlu='Domenii'
        subtitlu='Alege din sfera noastra larga de domenii'
        cards={domenii}
        buttonHandler={handler}
      />
      <ModalRank />
    </>
  );
}
