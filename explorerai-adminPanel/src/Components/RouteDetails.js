import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import Chip from '@mui/material/Chip';


const RouteDetails = ({ route }) => {
  return (
    <Box sx={{ width: '100%' }}>
      {route.photoUrl && (
        <img src={route.photoUrl} alt={route.name} style={{ width: '100%', marginBottom: 16 }} />
      )}
      <Typography>
        <strong>ID:</strong> {route.id}<br />
        <strong>Trajanje:</strong> {route.duration}<br />
        <strong>Objavljena:</strong> {route.published ? (
          <CheckCircleIcon sx={{ color: 'green' }} />
        ) : (
          <CancelIcon sx={{ color: 'red' }} />
        )}
        <br />
        <strong>Admin:</strong> {route.admin ? (
          <CheckCircleIcon sx={{ color: 'green' }} />
        ) : (
          <CancelIcon sx={{ color: 'red' }} />
        )}
        <br />
        <strong>Sezonska:</strong> {route.seasonalFrom ? (
          <Typography>
            <CheckCircleIcon sx={{ color: 'green' }} /><br />
            <strong> Od:</strong> {route.seasonalFrom}<br />
            <strong> Do:</strong> {route.seasonalTo}<br />
          </Typography>
        ) : (
          <CancelIcon sx={{ color: 'red' }} />
        )}
        <br />
        <strong>Opis:</strong> {route.description}<br />
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
            {route.tags && route.tags.length > 0 && (
              <>
                <strong>Oznake:</strong>
                {route.tags.map((tag, index) => (
                  <Chip key={index} label={tag} color="primary" variant="contained" />
                ))}
              </>
            )}
          </div>
        </div>


        <strong>Znamenitosti:</strong>
        <ul>
          {route.monuments && route.monuments.length > 0 ? (
            route.monuments.map((monument) => (
              <li key={monument.id}>
                <strong>{monument.name} ({monument.coordinates.latitude}, {monument.coordinates.longitude})</strong>
                <Typography>{monument.description}</Typography>
                <br />
              </li>
            ))
          ) : (
            <li>Ni znamenitosti</li>
          )}
        </ul>
      </Typography>
    </Box>
  );
};

export default RouteDetails;
