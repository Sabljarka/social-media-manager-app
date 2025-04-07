import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  useTheme,
  Paper,
  Fade,
  Grow,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const DashboardPage: React.FC = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = React.useState(0);
  const { facebookPages, instagramAccounts } = useSelector((state: RootState) => state.social);

  useEffect(() => {
    console.log('DashboardPage component rendered');
  }, []);

  const stats = [
    {
      title: 'Facebook Pages',
      value: facebookPages.length,
      icon: <FacebookIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      color: theme.palette.primary.main,
    },
    {
      title: 'Instagram Accounts',
      value: instagramAccounts.length,
      icon: <InstagramIcon sx={{ fontSize: 40, color: theme.palette.secondary.main }} />,
      color: theme.palette.secondary.main,
    },
    {
      title: 'Total Followers',
      value: '24.5K',
      icon: <PeopleIcon sx={{ fontSize: 40, color: theme.palette.success.main }} />,
      color: theme.palette.success.main,
    },
    {
      title: 'Engagement Rate',
      value: '4.2%',
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: theme.palette.info.main }} />,
      color: theme.palette.info.main,
    },
  ];

  // Sample data for charts
  const engagementData = [
    { name: 'Mon', facebook: 4000, instagram: 2400 },
    { name: 'Tue', facebook: 3000, instagram: 1398 },
    { name: 'Wed', facebook: 2000, instagram: 9800 },
    { name: 'Thu', facebook: 2780, instagram: 3908 },
    { name: 'Fri', facebook: 1890, instagram: 4800 },
    { name: 'Sat', facebook: 2390, instagram: 3800 },
    { name: 'Sun', facebook: 3490, instagram: 4300 },
  ];

  const postData = [
    { name: 'Mon', posts: 4 },
    { name: 'Tue', posts: 3 },
    { name: 'Wed', posts: 5 },
    { name: 'Thu', posts: 2 },
    { name: 'Fri', posts: 6 },
    { name: 'Sat', posts: 4 },
    { name: 'Sun', posts: 3 },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Fade in={true} timeout={500}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3 }}>
          {stats.map((stat, index) => (
            <Grow in={true} timeout={500} style={{ transitionDelay: `${index * 100}ms` }} key={stat.title}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 2,
                    }}
                  >
                    {stat.icon}
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{ color: stat.color, fontWeight: 'bold' }}
                    >
                      {stat.value}
                    </Typography>
                  </Box>
                  <Typography variant="subtitle1" color="text.secondary">
                    {stat.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grow>
          ))}
        </Box>
        <Box sx={{ mt: 4 }}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 400,
              background: `linear-gradient(45deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
            }}
          >
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs value={activeTab} onChange={handleTabChange}>
                <Tab label="Engagement" />
                <Tab label="Posts" />
              </Tabs>
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              {activeTab === 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="facebook"
                      stroke={theme.palette.primary.main}
                      name="Facebook"
                    />
                    <Line
                      type="monotone"
                      dataKey="instagram"
                      stroke={theme.palette.secondary.main}
                      name="Instagram"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={postData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="posts"
                      fill={theme.palette.primary.main}
                      name="Posts"
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Fade>
  );
};

export default DashboardPage; 