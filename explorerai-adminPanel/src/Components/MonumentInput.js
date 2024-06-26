import React, { useState } from 'react';
import { TextField, Button, Typography, Grid } from '@mui/material';

const MonumentInput = ({ onAddMonument }) => {
  const [monumentName, setMonumentName] = useState('');
  const [monumentDescription, setMonumentDescription] = useState('');
  const [address, setAddress] = useState('');
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);

  const handleAddMonument = () => {
    if (monumentName.trim() !== '' && selectedCoordinates) {
      const monument = {
        name: monumentName,
        description: monumentDescription,
        coordinates: selectedCoordinates,
      };
      onAddMonument(monument);
      setMonumentName('');
      setMonumentDescription('');
      setAddress('');
      setSelectedCoordinates(null);
    }
  };

  const onSearchAddress = () => {
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=API_KEY`)
      .then(response => response.json())
      .then(data => {
        if (data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          setSelectedCoordinates({ latitude: lat, longitude: lng });
        } else {
          console.log('Address not found');
        }
      })
      .catch(error => console.error('Error searching address:', error));
  };

  return (
    <Grid item xs={6}>
      <Typography variant="h6">Dodaj znamenitost</Typography>
      <TextField
        label="Ime znamenitosti"
        variant="outlined"
        fullWidth
        value={monumentName}
        onChange={(e) => setMonumentName(e.target.value)}
        margin="normal"
      />
      <TextField
        label="Opis znamenitosti"
        variant="outlined"
        multiline
        fullWidth
        value={monumentDescription}
        onChange={(e) => setMonumentDescription(e.target.value)}
        margin="normal"
      />
      <TextField
        label="Vnesi naslov"
        variant="outlined"
        fullWidth
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={onSearchAddress} fullWidth style={{ marginBottom: '10px' }}>
        Iskanje
      </Button>
      {selectedCoordinates && (
        <Typography variant="body1">
          Koordinate: {selectedCoordinates.latitude}, {selectedCoordinates.longitude}
        </Typography>
      )}
      <Button variant="contained" color="primary" onClick={handleAddMonument} disabled={!selectedCoordinates} fullWidth>
        Dodaj znamenitost
      </Button>
    </Grid>
  );
};

export default MonumentInput;
