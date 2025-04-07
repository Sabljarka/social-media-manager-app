import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../store/slices/authSlice';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Link,
  Grid,
  Alert,
} from '@mui/material';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    console.log('Attempting login with:', { username, password });
    
    // Prosta provera za demo
    if (username === 'bobke' && password === '1983') {
      console.log('Login successful');
      dispatch(login({ email: username, token: 'demo-token' }));
      navigate('/dashboard');
    } else {
      console.log('Login failed');
      setError('Pogrešno korisničko ime ili lozinka');
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 400,
          mx: 'auto',
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600,
            mb: 4,
            textAlign: 'center',
          }}
        >
          Social Media Manager
        </Typography>
        <Paper
          elevation={3}
          sx={{
            p: 4,
          }}
        >
          <form onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              label="Korisničko ime"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <TextField
              label="Lozinka"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
            >
              Prijava
            </Button>
            <Grid container justifyContent="center" spacing={2}>
              <Grid item>
                <Link href="/privacy-policy" variant="body2">
                  Politika privatnosti
                </Link>
              </Grid>
              <Grid item>
                <Link href="/terms-of-service" variant="body2">
                  Uslovi korišćenja
                </Link>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default LoginForm; 