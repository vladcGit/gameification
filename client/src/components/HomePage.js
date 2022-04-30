import React from 'react';
import axios from 'axios';
import HomePageProf from './HomePageProf';
import HomePageStud from './HomePageStud';
import HomePageNormal from './HomePageNormal';
import { CircularProgress } from '@mui/material';
import { Box } from '@mui/system';

export default function HomePage() {
  const [user, setUser] = React.useState({});
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const res = await axios.get(`/api/user`, {
          headers: {
            Authorization: token,
          },
        });
        setUser(res.data);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <>
      {loading && (
        <Box
          sx={{
            bgcolor: 'background.paper',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100vw',
            height: '100vh',
          }}
        >
          <CircularProgress />
        </Box>
      )}
      {!loading && localStorage.getItem('token') && user && !user.eProfesor && (
        <HomePageStud user={user} />
      )}
      {!loading && localStorage.getItem('token') && user && user.eProfesor && (
        <HomePageProf user={user} />
      )}
      {(!localStorage.getItem('token') || !user) && !loading && (
        <HomePageNormal />
      )}
    </>
  );
}
