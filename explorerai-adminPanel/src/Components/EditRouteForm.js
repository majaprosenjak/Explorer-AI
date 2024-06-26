import React from 'react';
import { Box, TextField, Button, Typography, FormControlLabel, Checkbox } from '@mui/material';

const EditRouteForm = ({ editedRoute, handleInputChange, handleMonumentChange, handleDeletePhoto, handlePhotoChange, uploadNewPhoto, removeMonument, saveEditedRoute }) => {
  return (
    <Box>
      <TextField
        name="name"
        label="Ime poti"
        value={editedRoute.name}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="duration"
        label="Trajanje"
        value={editedRoute.duration}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={Boolean(editedRoute.published)}
            onChange={(event) =>
              handleInputChange({
                target: {
                  name: 'published',
                  value: event.target.checked,
                },
              })
            }
            name="published"
            color="primary"
          />
        }
        label="Objavljena"
      />

      <TextField
        name="seasonalFrom"
        label="Sezonska od (YYYY-MM-DD)"
        value={editedRoute.seasonalFrom}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="seasonalTo"
        label="Sezonska do (YYYY-MM-DD)"
        value={editedRoute.seasonalTo}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="description"
        label="Opis"
        value={editedRoute.description}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <Box sx={{ mt: 2 }}>
        {editedRoute.photoUrl && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ marginRight: '10px' }}>
              Trenutna slika
            </Typography>
            <img
              src={editedRoute.photoUrl}
              alt={editedRoute.name}
              style={{ maxWidth: '100px', maxHeight: '100px', borderRadius: '5px' }}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDeletePhoto}
              sx={{ ml: 2 }}
            >
              Izbriši sliko
            </Button>
          </Box>
        )}
        <Box sx={{ mt: 2 }}>
          <Typography>Dodaj novo sliko:</Typography>
          <input type="file" accept="image/*" onChange={handlePhotoChange} />
          <Button variant="contained" color="primary"  onClick={uploadNewPhoto} sx={{ mt: 1, ml: 1 }}>
            Dodaj
          </Button>
        </Box>
      </Box>

      <Typography variant="h6" sx={{ mt: 2 }}>
        Znamenitosti
      </Typography>
      {editedRoute.monuments.map((monument, index) => (
        <Box key={monument.id} sx={{ mt: 2, mb: 2 }}>
          <TextField
            label="Ime znamenitosti"
            value={monument.name}
            onChange={(e) => handleMonumentChange(index, 'name', e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Opis znamenitosti"
            value={monument.description}
            onChange={(e) => handleMonumentChange(index, 'description', e.target.value)}
            fullWidth
            margin="normal"
            multiline
          />
          <TextField
            label="Geografska širina"
            value={monument.coordinates.latitude}
            onChange={(e) =>
              handleMonumentChange(index, 'coordinates', {
                ...monument.coordinates,
                latitude: e.target.value,
              })
            }
            fullWidth
            margin="normal"
          />

          <TextField
            label="Geografska dolžina"
            value={monument.coordinates.longitude}
            onChange={(e) =>
              handleMonumentChange(index, 'coordinates', {
                ...monument.coordinates,
                longitude: e.target.value,
              })
            }
            fullWidth
            margin="normal"
          />

          <Button
            variant="contained"
            color="secondary"
            onClick={() => removeMonument(index)}
            sx={{ mt: 1 }}
          >
            Odstrani znamenitost
          </Button>
        </Box>
      ))}

      <Button
        variant="contained"
        color="primary"
        onClick={saveEditedRoute}
        sx={{ mr: '10px' }}
        fullWidth
      >
        Shrani
      </Button>
    </Box>
  );
};

export default EditRouteForm;
