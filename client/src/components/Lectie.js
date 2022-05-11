import React, { useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Album from './AlbumLayout';
import { Button, CssBaseline } from '@mui/material';

export default function Lectie() {
  const [user, setUser] = React.useState(null);
  const [lectie, setLectie] = React.useState(null);

  const inputRef = React.useRef();

  const { idLectie } = useParams();

  const fetchLectie = async (idLectie) => {
    try {
      const res = await axios.get(`/api/lectie/${idLectie}`);
      setLectie(res.data);
    } catch (e) {
      console.log(e);
    }
  };
  const fetchLectieCallback = useCallback(
    () => fetchLectie(idLectie),
    [idLectie]
  );

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await axios.get(`/api/user`, {
          headers: { Authorization: token },
        });
        setUser(res.data);
      } catch (e) {
        console.log(e);
      }
    };

    fetchLectieCallback();
    fetchUser();
  }, [fetchLectieCallback]);

  const handleInputChange = async (e) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const fd = new FormData();
      const fisier = e.target.files[0];
      fd.append('file', fisier, fisier.name);
      fd.append('json_data', JSON.stringify({ id_lectie: idLectie }));
      console.log(fd);

      await axios.post(`/api/fisier/nou`, fd, {
        headers: {
          Authorization: token,
        },
      });
      fetchLectieCallback();
    } catch (e) {
      console.log(e);
    }
  };

  const handleDownloadFile = ({ continut, titlu, tip }) => {
    const file = new Blob([new Uint8Array(continut.data)], { type: tip });

    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = titlu;
    a.click();
  };

  const handleStergeFisier = async ({ id }) => {
    try {
      if (!window.confirm('Sigur vrei sa stergi fisierul')) return;
      const token = localStorage.getItem('token');
      await axios.delete(`/api/fisier/${id}`, {
        headers: { Authorization: token },
      });
      fetchLectieCallback();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <CssBaseline />
      <input
        ref={inputRef}
        type='file'
        style={{ display: 'none' }}
        onChange={handleInputChange}
      />
      {lectie && (
        <Album
          titlu={lectie.nume}
          subtitlu={lectie.descriere}
          text={lectie.text}
          cards={lectie.Fisieres}
          buttonHandler={handleDownloadFile}
          SecondaryButton={
            user?.eProfesor && { text: 'Sterge', handler: handleStergeFisier }
          }
        />
      )}
      <div
        style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
        onClick={() => inputRef.current.click()}
      >
        {user?.eProfesor ? (
          <Button variant='contained'>Incarca fisier</Button>
        ) : null}
      </div>
    </>
  );
}
