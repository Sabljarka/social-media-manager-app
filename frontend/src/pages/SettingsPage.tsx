import React from 'react';
import { Box, Typography, Paper, TextField, Button } from '@mui/material';

const SettingsPage: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Paper sx={{ p: 3, maxWidth: 600 }}>
        <Typography variant="h6" gutterBottom>
          API Configuration
        </Typography>
        <TextField
          fullWidth
          label="Facebook API Key"
          margin="normal"
          variant="outlined"
        />
        <TextField
          fullWidth
          label="Instagram API Key"
          margin="normal"
          variant="outlined"
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Save Settings
        </Button>
      </Paper>
    </Box>
  );
};

export default SettingsPage; 