import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const TermsOfService: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Terms of Service
        </Typography>
        
        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Last Updated: {new Date().toLocaleDateString()}
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            1. Acceptance of Terms
          </Typography>
          <Typography paragraph>
            By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement.
          </Typography>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            2. Use License
          </Typography>
          <Typography paragraph>
            Permission is granted to temporarily use our service for personal, non-commercial transitory viewing only.
          </Typography>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            3. User Responsibilities
          </Typography>
          <Typography paragraph>
            As a user of this service, you agree to:
          </Typography>
          <ul>
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account</li>
            <li>Not use the service for any illegal purposes</li>
            <li>Not interfere with the proper functioning of the service</li>
          </ul>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            4. Service Modifications
          </Typography>
          <Typography paragraph>
            We reserve the right to modify or discontinue, temporarily or permanently, the service with or without notice.
          </Typography>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            5. Limitation of Liability
          </Typography>
          <Typography paragraph>
            In no event shall we be liable for any damages arising out of the use or inability to use the service.
          </Typography>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            6. Governing Law
          </Typography>
          <Typography paragraph>
            These terms shall be governed by and construed in accordance with the laws of your jurisdiction.
          </Typography>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            7. Contact Information
          </Typography>
          <Typography paragraph>
            If you have any questions about these Terms, please contact us at:
            <br />
            Email: support@socialmediamanager.com
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default TermsOfService; 