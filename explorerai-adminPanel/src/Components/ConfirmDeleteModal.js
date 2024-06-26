import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const ConfirmDeleteModal = ({ open, onClose, onDelete }) => {
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="delete-route-modal" aria-describedby="confirm-delete-route">
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 300,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 3,
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
        <Typography variant="body1" gutterBottom>
          Ste prepričani, da želite izbrisati to pot?
        </Typography>
        <Box style={{ mt: 2 }}>
          <Button variant="contained" color="primary" onClick={onDelete} sx={{ mr: 2 }}>
            Izbriši
          </Button>
          <Button variant="contained" onClick={onClose}>
            Prekliči
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmDeleteModal;
