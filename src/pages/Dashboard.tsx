import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  IconButton,
  Button,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { facebookPages, instagramAccounts } = useSelector((state: RootState) => state.social);
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.username}!
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Facebook Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Facebook Pages
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/facebook')}
              >
                Add Page
              </Button>
            </Box>
            {facebookPages.length > 0 ? (
              <Grid container spacing={2}>
                {facebookPages.map((page) => (
                  <Grid item xs={12} key={page.id}>
                    <Card>
                      <CardHeader
                        avatar={
                          <Avatar src={page.picture}>
                            <FacebookIcon />
                          </Avatar>
                        }
                        action={
                          <IconButton>
                            <MoreVertIcon />
                          </IconButton>
                        }
                        title={page.name}
                        subheader={page.category}
                      />
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">
                          Followers: {page.followers}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Posts: {page.posts?.length || 0}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body1" color="text.secondary" align="center">
                No Facebook pages connected. Click "Add Page" to get started.
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Instagram Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Instagram Accounts
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/instagram')}
              >
                Add Account
              </Button>
            </Box>
            {instagramAccounts.length > 0 ? (
              <Grid container spacing={2}>
                {instagramAccounts.map((account) => (
                  <Grid item xs={12} key={account.id}>
                    <Card>
                      <CardHeader
                        avatar={
                          <Avatar src={account.picture}>
                            <InstagramIcon />
                          </Avatar>
                        }
                        action={
                          <IconButton>
                            <MoreVertIcon />
                          </IconButton>
                        }
                        title={account.username}
                        subheader={account.businessAccount ? 'Business Account' : 'Personal Account'}
                      />
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">
                          Followers: {account.followers}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Posts: {account.posts?.length || 0}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body1" color="text.secondary" align="center">
                No Instagram accounts connected. Click "Add Account" to get started.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 