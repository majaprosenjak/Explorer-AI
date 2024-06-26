import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig'; 
import LogoutIcon from '@mui/icons-material/Logout';

const NavBar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login'); 
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar style={{ justifyContent: 'space-between' }}>
        <Button color="inherit" component={Link} to="/routes"sx={{ textTransform: 'none', fontSize: '24px', fontWeight: 'bold' }}>
          ExplorerAI
        </Button>
        <Box sx={{ display: 'flex', gap: 4 }}>
          <Button color="inherit" component={Link} to="/routes">Poti</Button>
          <Button color="inherit" component={Link} to="/users">Uporabniki</Button>
          <Button color="inherit" component={Link} to="/routeInput">Vnos poti</Button>
          <Button color="inherit"  onClick={handleLogout}  startIcon={<LogoutIcon />} >Odjava </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
