import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth'; 
import { auth } from '../firebaseConfig'; 
import { Box, TextField, Button, Typography } from '@mui/material';
import LogoImage from '../logo1.png'; 

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (event) => {
    event.preventDefault();
    if (email === "admin@eai.si") {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        setUser(userCredential.user);
      } catch (err) {
        setError(err.message);
      }
    } else {
      setError("Administratorska plošča je namenjena samo administratorju!");
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#389bd9',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
      }}
    >
      <Box
        sx={{
          width: '100%', 
          maxWidth: 400,
          textAlign: 'center',
          backgroundColor: '#ffffff',
          borderRadius: 8,
          padding: 3,

        }}
      >
        <Box style={{ mb: 2}}> 
          <img src={LogoImage} alt="Logo" style={{ width: 80, height: 'auto' }} />
        </Box>
        
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Geslo"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth style={{ mt: 2, marginBottom: 3 }}>
            Prijava
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default Login;
