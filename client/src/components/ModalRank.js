import { Box, Button, Modal, Typography } from '@mui/material';
import React from 'react';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 400,
  maxWidth: '90vw',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 1,
  textAlign: 'center',
};
export default function ModalRank() {
  const [open, setOpen] = React.useState(false);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <Button variant='contained' onClick={() => setOpen(true)}>
        Afiseaza rankuri
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <Typography variant='h3' m='20px'>
            Maestru 500xp
          </Typography>
          <Typography variant='h3' m='20px'>
            Entuziast 200xp
          </Typography>
          <Typography variant='h3' m='20px'>
            Incepator 0xp
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
