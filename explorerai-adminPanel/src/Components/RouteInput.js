import React, { useState } from 'react';
import { Modal, TextField, Button, Grid, Typography, Paper, FormControlLabel, Checkbox, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { collection, addDoc } from 'firebase/firestore';
import { db, storage } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import MonumentInput from './MonumentInput'; 
import Chip from '@mui/material/Chip';


const RouteInput = () => {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [seasonal, setSeasonal] = useState(false);
  const [seasonalFrom, setSeasonalFrom] = useState('');
  const [seasonalTo, setSeasonalTo] = useState('');
  const [admin] = useState(true);
  const [published] = useState(false);
  const [tagsArray, setTagsArray] = useState([]);
  const [monuments, setMonuments] = useState([]);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(''); 

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const storageRef = ref(storage, `route_photos/${file.name}`);

    try {
      const snapshot = await uploadBytes(storageRef, file);
      console.log('File uploaded:', snapshot);

      const url = await getDownloadURL(storageRef);
      setPhotoUrl(url); 
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const onSaveRoute = async () => {
    setConfirmModalVisible(false);
    const routeData = {
      name,
      duration,
      description,
      tags: tagsArray,
      admin,
      seasonalFrom: seasonal ? seasonalFrom : null,
      seasonalTo: seasonal ? seasonalTo : null,
      published,
      photoUrl, 
      walkedCounter: 0
    };

    try {
      const routeDocRef = await addDoc(collection(db, 'routes'), routeData);
      console.log('Route ID:', routeDocRef.id);

      for (const monument of monuments) {
        await addDoc(collection(routeDocRef, 'monuments'), monument);
        console.log('Monument:', monument);
      }

      setSuccessModalVisible(true);

      setName('');
      setDuration('');
      setDescription('');
      setTags('');
      setTagsArray([]);
      setSeasonal(false);
      setSeasonalFrom('');
      setSeasonalTo('');
      setMonuments([]);
      setPhotoUrl(''); 

    } catch (e) {
      console.error('Error adding route: ', e);
    }
  };

  const onConfirmSaveRoute = () => {
    setConfirmModalVisible(true);
  };

  const onAddTag = () => {
    if (tags.trim() !== '') {
      setTagsArray([...tagsArray, tags.trim()]);
      setTags('');
    }
  };

  const handleSeasonalChange = (event) => {
    setSeasonal(event.target.checked);
    if (!event.target.checked) {
      setSeasonalFrom('');
      setSeasonalTo('');
    }
  };

  const handleAddMonument = (monument) => {
    setMonuments([...monuments, monument]);
  };

  const onSuccessModalClose = () => {
    setSuccessModalVisible(false);
  };

  return (
    <div style={styles.container}>

    <Grid container spacing={2} style={styles.gridContainer}>
      <Grid item xs={6}>
        <Typography variant="h6">Dodaj pot</Typography>
        <TextField
          label="Ime"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Trajanje"
          variant="outlined"
          fullWidth
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Opis"
          variant="outlined"
          multiline
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Oznake"
          variant="outlined"
          fullWidth
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              onAddTag();
            }
          }}
          margin="normal"
        />
        <div>
          {tagsArray.map((tag, index) => (
            <Chip key={index} label={tag} color="primary" variant="contained" />
          ))}
        </div>
        <FormControlLabel
          control={<Checkbox checked={seasonal} onChange={handleSeasonalChange} />}
          label="Sezonska pot"
        />
        <br />
        {seasonal && (
          <>
            <TextField
              label="Začetek"
              type="date"
              variant="outlined"
              fullWidth
              value={seasonalFrom}
              onChange={(e) => setSeasonalFrom(e.target.value)}
              InputLabelProps={{ shrink: true }}
              margin="normal"
            />
            <TextField
              label="Konec"
              type="date"
              variant="outlined"
              fullWidth
              value={seasonalTo}
              onChange={(e) => setSeasonalTo(e.target.value)}
              InputLabelProps={{ shrink: true }}
              margin="normal"
            />
          </>
        )}

        <Typography variant="subtitle1" style={styles.photoLabel}>
          Slika poti
        </Typography>

        <input type="file" onChange={handleFileUpload} />

        {photoUrl && (
          <img src={photoUrl} style={styles.photo} />
        )}

        <Typography variant="h6" style={styles.addedMonumentsLabel}>
          Dodane znamenitosti
        </Typography>
        <List>
          {monuments.map((monument, index) => (
            <ListItem key={index}>
              <ListItemText primary={monument.name} secondary={monument.description} />
            </ListItem>
          ))}
        </List>

        <Button variant="contained" color="primary" onClick={onConfirmSaveRoute} fullWidth>
          Shrani pot
        </Button>
      </Grid>

      <MonumentInput onAddMonument={handleAddMonument} />

      <Modal open={confirmModalVisible} onClose={() => setConfirmModalVisible(false)}>
        <div style={styles.modal}>
          <Typography variant="h6">Potrdite shranjevanje</Typography>
          <div style={styles.modalButtons}>
            <Button variant="contained" color="primary" onClick={onSaveRoute}>Da</Button>
            <Button variant="outlined" color="primary" onClick={() => setConfirmModalVisible(false)}>Ne</Button>
          </div>
        </div>
      </Modal>

      <Modal open={successModalVisible} onClose={onSuccessModalClose}>
        <div style={styles.modalSuccess}>
          <Typography variant="h6" style={styles.modalSuccessText}>
            Uspešno ste dodali pot
          </Typography>
          <IconButton style={styles.modalCloseButton} onClick={onSuccessModalClose}>
            <Close />
          </IconButton>
        </div>
      </Modal>
    </Grid>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    marginTop: '0px',
  },
  gridContainer: {
    padding: 20,
  },
  
  photoLabel: {
    marginTop: 20,
    fontSize: '16px',
  },
  photo: {
    maxWidth: '100%',
    marginTop: 10,
  },
  addedMonumentsLabel: {
    marginTop: 20,
  },
  modal: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '5px',
    width: '300px',
    margin: 'auto',
    marginTop: '20vh',
  },
  modalButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  modalSuccess: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '5px',
    width: '300px',
    margin: 'auto',
    marginTop: '20vh',
    position: 'relative',
  },
  modalSuccessText: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  modalCloseButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
  },
};

export default RouteInput;
