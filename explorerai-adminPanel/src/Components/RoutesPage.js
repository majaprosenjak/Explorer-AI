import React, { useEffect, useState } from 'react';
import { db, storage } from '../firebaseConfig';
import { collection, getDocs, deleteDoc, doc, updateDoc, setDoc } from 'firebase/firestore';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Button, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import RouteDetails from './RouteDetails';
import EditRouteForm from './EditRouteForm';

const RoutesPage = () => {
  const [routes, setRoutes] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState(null);
  const [publishingRoute, setPublishingRoute] = useState(null);
  const [editingRouteId, setEditingRouteId] = useState(null);
  const [editedRoute, setEditedRoute] = useState(null);
  const [newPhotoFile, setNewPhotoFile] = useState(null);

  useEffect(() => {
    const fetchRoutesAndMonuments = async () => {
      try {
        const routesCollection = collection(db, 'routes');
        const routesSnapshot = await getDocs(routesCollection);
        const routesList = [];

        for (const doc of routesSnapshot.docs) {
          const routeData = { id: doc.id, ...doc.data() };
          routeData.monuments = await fetchMonuments(routeData);
          routesList.push(routeData);
        }

        setRoutes(routesList);
        console.log(routesList);
      } catch (error) {
        console.error('Error fetching routes:', error);
      }
    };

    const fetchMonuments = async (route) => {
      const monuments = [];

      try {
        const monumentsCollection = collection(db, `routes/${route.id}/monuments`);
        const monumentsSnapshot = await getDocs(monumentsCollection);

        monumentsSnapshot.forEach((monumentDoc) => {
          monuments.push({
            id: monumentDoc.id,
            ...monumentDoc.data(),
          });
        });
      } catch (error) {
        console.error('Error fetching monuments:', error);
      }

      return monuments;
    };

    fetchRoutesAndMonuments();
  }, []);

  const handleDeleteRoute = async () => {
    try {
      await deleteDoc(doc(db, 'routes', routeToDelete));
      setRoutes(routes.filter((route) => route.id !== routeToDelete));
      setDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting route:', error);
    }
  };

  const handlePublish = async (route) => {
    try {
      setPublishingRoute(route.id);
      await updateDoc(doc(db, 'routes', route.id), { published: true });
      setRoutes(
        routes.map((r) =>
          r.id === route.id ? { ...r, published: true } : r
        )
      );
      setPublishingRoute(null);
    } catch (error) {
      console.error('Error publishing route:', error);
    }
  };

  const openDeleteModal = (routeId) => {
    setRouteToDelete(routeId);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setRouteToDelete(null);
  };

  const toggleEditMode = (routeId) => {
    if (routeId === editingRouteId) {
      setEditingRouteId(null);
      setEditedRoute(null);
    } else {
      setEditingRouteId(routeId);
      const routeToEdit = routes.find((route) => route.id === routeId);
      setEditedRoute(routeToEdit);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedRoute((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleMonumentChange = (index, name, value) => {
    const updatedMonuments = editedRoute.monuments.map((monument, i) =>
      i === index ? { ...monument, [name]: value } : monument
    );
  
    if (name === 'coordinates') {
      const updatedCoordinates = {
        ...updatedMonuments[index].coordinates,
      };
  
      if (value.latitude !== undefined) {
        updatedCoordinates.latitude = value.latitude !== '' ? parseFloat(value.latitude) : '';
      }
  
      if (value.longitude !== undefined) {
        updatedCoordinates.longitude = value.longitude !== '' ? parseFloat(value.longitude) : '';
      }
  
      updatedMonuments[index].coordinates = updatedCoordinates;
    }
  
    setEditedRoute((prevState) => ({
      ...prevState,
      monuments: updatedMonuments,
    }));
  };
  
  const removeMonument = (index) => {
    setEditedRoute((prevState) => {
      const updatedMonuments = prevState.monuments.filter((_, i) => i !== index);
      return {
        ...prevState,
        monuments: updatedMonuments,
      };
    });
  };

  const saveEditedRoute = async () => {
    try {
      
      const routeData = {
        name: editedRoute.name || '',
        description: editedRoute.description || '',
        photoUrl: editedRoute.photoUrl || '',
        tags: editedRoute.tags || '',
        seasonalTo: editedRoute.seasonalTo || '',
        seasonalFrom: editedRoute.seasonalFrom || '',
        admin: editedRoute.admin || '',
        published: Boolean(editedRoute.published),
        duration: editedRoute.duration || 0,
      };

      const routeDoc = doc(db, 'routes', editedRoute.id);
      await updateDoc(routeDoc, routeData);

      const snapshot = await getDocs(collection(db, `routes/${editedRoute.id}/monuments`));
      const existingMonumentIds = snapshot.docs.map(doc => doc.id);

      for (const monument of editedRoute.monuments) {
        if (monument.coordinates.latitude === '' || monument.coordinates.longitude === '') {
          continue;
        }

        monument.coordinates.latitude = parseFloat(monument.coordinates.latitude);
        monument.coordinates.longitude = parseFloat(monument.coordinates.longitude);

        console.log(`Saving monument: ${monument.id}, Coordinates: `, monument.coordinates);

        const monumentId = monument.id.toString();
        const monumentDoc = doc(db, `routes/${editedRoute.id}/monuments`, monumentId);
        await setDoc(monumentDoc, monument);
      }

      const monumentsToDelete = existingMonumentIds.filter(id => !editedRoute.monuments.some(m => m.id.toString() === id));
      for (const monumentIdToDelete of monumentsToDelete) {
        const monumentDocToDelete = doc(db, `routes/${editedRoute.id}/monuments`, monumentIdToDelete);
        await deleteDoc(monumentDocToDelete);
      }

      setRoutes((prevRoutes) =>
        prevRoutes.map((route) =>
          route.id === editedRoute.id ? editedRoute : route
        )
      );

      setEditingRouteId(null);
      setEditedRoute(null);
    } catch (error) {
      console.error('Error saving route changes:', error);
    }
  };

  const handleDeletePhoto = () => {
    setEditedRoute((prevState) => ({
      ...prevState,
      photoUrl: null,
    }));
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    setNewPhotoFile(file);
  };

  const uploadNewPhoto = async () => {
    if (!newPhotoFile) return;
  
    try {
      const photoUrl = await uploadPhoto(newPhotoFile);
      console.log(photoUrl);
  
      setEditedRoute((prevState) => ({
        ...prevState,
        photoUrl: photoUrl,
      }));
  
      setNewPhotoFile(null);
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };

  const uploadPhoto = async (file) => {
    const storageRef = ref(storage, `route_photos/${file.name}`);
    try {
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  return (
    <div style={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h6" sx={{ marginBottom: 2 }}> Poti </Typography>
      <br />
      {routes.map((route) => (
        <Accordion key={route.id} sx={{marginBottom: '16px', backgroundColor: route.published ? '#ffffff' : '#E0EDFB', borderRadius: '12px' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{route.name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {editingRouteId === route.id ? (
              <Box> 
              <EditRouteForm
                editedRoute={editedRoute}
                handleInputChange={handleInputChange}
                handleMonumentChange={handleMonumentChange}
                handleDeletePhoto={handleDeletePhoto}
                handlePhotoChange={handlePhotoChange}
                uploadNewPhoto={uploadNewPhoto}
                removeMonument={removeMonument}
                saveEditedRoute={saveEditedRoute}
              />
              <Button variant="contained" fullWidth sx={{my: 1}} onClick={() => toggleEditMode(route.id)}> Prekliči </Button>
              </Box>
            ) : (
              <Box>
              <RouteDetails route={route} />    
              <Button variant="contained" color="primary" fullWidth disabled={route.published} onClick={() => handlePublish(route)}>
                Objavi pot
              </Button>
              <Button variant="contained" color="primary" fullWidth onClick={() => toggleEditMode(route.id)} sx={{ my: 1 }}>
                Uredi pot
              </Button>
              <Button variant="contained"  color="primary" fullWidth onClick={() => openDeleteModal(route.id)}>
                Izbriši pot
              </Button>
            </Box>  
           )}
          </AccordionDetails>
        </Accordion>
      ))}
      <ConfirmDeleteModal open={deleteModalOpen} onClose={closeDeleteModal} onDelete={handleDeleteRoute} />
    </div>
  );
};
export default RoutesPage;
