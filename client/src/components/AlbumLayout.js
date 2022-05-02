import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Appbar from './Appbar';

export default function Album(props) {
  const { titlu, subtitlu, cards, buttonHandler, text, SecondaryButton } =
    props;
  return (
    <>
      <CssBaseline />
      <Appbar />
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth='sm'>
            <Typography
              component='h1'
              variant='h2'
              align='center'
              color='text.primary'
              gutterBottom
            >
              {titlu}
            </Typography>
            <Typography
              variant='h5'
              align='center'
              color='text.secondary'
              paragraph
            >
              {subtitlu}
            </Typography>
            {text && (
              <Typography
                variant='h3'
                align='center'
                color='text.primary'
                multiline='true'
                mt='70px'
              >
                {text}
              </Typography>
            )}
            <Stack
              sx={{ pt: 4 }}
              direction='row'
              spacing={2}
              justifyContent='center'
            ></Stack>
          </Container>
        </Box>
        {cards && (
          <Container sx={{ py: 8 }} maxWidth='md'>
            {/* End hero unit */}
            <Grid container spacing={4}>
              {cards.map((card) => (
                <Grid item key={card.id} xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant='h5' component='h2'>
                        {card.titlu}
                      </Typography>
                      <Typography>{card.subtitlu}</Typography>
                    </CardContent>
                    <CardActions>
                      <Button size='small' onClick={() => buttonHandler(card)}>
                        Vezi
                      </Button>
                      {SecondaryButton && (
                        <Button
                          size='small'
                          color='secondary'
                          onClick={() => SecondaryButton.handler(card)}
                        >
                          {SecondaryButton.text}
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        )}
      </main>
    </>
  );
}
