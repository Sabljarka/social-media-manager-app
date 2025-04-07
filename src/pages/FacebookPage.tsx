import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Avatar,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Snackbar,
  Alert,
  Divider,
} from '@mui/material';
import {
  ThumbUp,
  Delete,
  Add,
  Reply,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { 
  setPosts, 
  addPost,
  deleteComment,
  setFacebookPages,
  setSelectedPage,
  addFacebookPage,
  removeFacebookPage,
  updateFacebookPage,
} from '../store/slices/socialSlice';
import { FacebookPage as FacebookPageType, Post, Comment as CommentType, SocialState } from '../store/slices/socialSlice';
import facebookService, { FacebookPost } from '../services/facebookService';
import { useTheme } from '@mui/material/styles';
import { socialService } from '../services/socialService';
import socketService from '../services/socketService';
import type { FacebookPage } from '../services/facebookService';

const FacebookPage: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const facebookPages = useSelector((state: RootState) => state.social.facebookPages);
  const selectedPage = useSelector((state: RootState) => state.social.selectedPage);
  const selectedPageData = selectedPage ? facebookPages.find(p => p.id === selectedPage) : null;
  const [newPostDialogOpen, setNewPostDialogOpen] = useState(false);
  const [newCommentDialogOpen, setNewCommentDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newPostContent, setNewPostContent] = useState('');
  const [newCommentContent, setNewCommentContent] = useState<{ [key: string]: string }>({});
  const [newPageDialogOpen, setNewPageDialogOpen] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [newPageToken, setNewPageToken] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState<{ [key: string]: boolean }>({});
  const [posts, setLocalPosts] = useState<{ [key: string]: Post[] }>({});
  const [comments, setComments] = useState<{ [key: string]: CommentType[] }>({});
  const [expandedComments, setExpandedComments] = useState<{ [key: string]: boolean }>({});
  const [commentFilter, setCommentFilter] = useState<{ [key: string]: 'all' | 'new' | 'relevant' }>({});

  useEffect(() => {
    facebookPages.forEach(page => {
      socketService.joinRoom(`facebook_${page.id}`);
    });

    return () => {
      facebookPages.forEach(page => {
        socketService.leaveRoom(`facebook_${page.id}`);
      });
    };
  }, [facebookPages]);

  useEffect(() => {
    if (selectedPage) {
      const pagePosts = facebookPages.find(p => p.id === selectedPage)?.posts || [];
      setLocalPosts(prev => ({ ...prev, [selectedPage]: pagePosts }));
    }
  }, [selectedPage, facebookPages]);

  const handleLoadPosts = async (pageId: string) => {
    console.log('handleLoadPosts called with pageId:', pageId);
    const page = facebookPages.find(p => p.id === pageId);
    console.log('Found page:', page);
    
    if (!page) {
      console.log('Page not found');
      return;
    }

    setLoadingPosts(prev => ({ ...prev, [pageId]: true }));
    setError(null);

    try {
      console.log('Validating token...');
      const isValid = await facebookService.validateToken(page.accessToken);
      console.log('Token validation result:', isValid);
      
      if (!isValid) {
        console.log('Token is invalid');
        setError(`Invalid access token for page ${page.name}`);
        return;
      }

      console.log('Fetching posts from Facebook API...');
      const posts = await facebookService.getPagePosts(page.id, page.accessToken);
      console.log('Received posts:', posts);
      
      if (posts && posts.length > 0) {
        console.log('Processing posts...');
        const formattedPosts: Post[] = await Promise.all(posts.map(async (post: FacebookPost) => {
          console.log('Processing post:', post.id);
          const comments = await facebookService.getPostComments(post.id, page.accessToken);
          console.log(`Comments for post ${post.id}:`, comments);

          const formattedComments: CommentType[] = comments.map((comment: any) => ({
            id: comment.id,
            postId: post.id,
            author: comment.from?.name || 'Unknown User',
            authorPicture: comment.from?.picture?.data?.url || '/default-avatar.png',
            content: comment.message,
            timestamp: comment.created_time,
            isHidden: false,
            replies: [],
            likes: comment.like_count || 0,
          }));

          return {
            id: post.id,
            pageId: page.id,
            content: post.message,
            timestamp: post.created_time,
            likes: post.likes?.summary?.total_count || 0,
            shares: post.shares?.count || 0,
            comments: formattedComments,
            isPublished: true,
          };
        }));

        console.log('Dispatching formatted posts with comments:', formattedPosts);
        dispatch(setPosts({ pageId: page.id, posts: formattedPosts }));
        setLocalPosts(prev => ({ ...prev, [pageId]: formattedPosts }));
      } else {
        console.log(`No posts found for page ${page.name}`);
        setError(`No posts found for ${page.name}`);
      }
    } catch (error) {
      console.error(`Error loading posts for page ${page.id}:`, error);
      setError(`Failed to load posts for ${page.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoadingPosts(prev => ({ ...prev, [pageId]: false }));
    }
  };

  const handlePageSelect = (pageId: string) => {
    dispatch(setSelectedPage(pageId));
  };

  const handleAddPost = async () => {
    if (selectedPage && newPostContent.trim()) {
      try {
        const page = facebookPages.find(p => p.id === selectedPage);
        if (!page) return;

        const response = await socialService.createFacebookPost(
          page.id,
          page.accessToken,
          newPostContent
        );

        const newPost: Post = {
          id: response.id,
          pageId: selectedPage,
          content: newPostContent,
          timestamp: new Date().toISOString(),
          likes: 0,
          shares: 0,
          comments: [],
          isPublished: true,
        };

        dispatch(addPost({ pageId: selectedPage, post: newPost }));
        setNewPostContent('');
        setNewPostDialogOpen(false);
      } catch (error) {
        console.error('Error creating Facebook post:', error);
        setError('Failed to create post');
      }
    }
  };

  const handleToggleComments = (postId: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleCommentFilterChange = (postId: string, filter: 'all' | 'new' | 'relevant') => {
    setCommentFilter(prev => ({
      ...prev,
      [postId]: filter
    }));
  };

  const handleAddComment = async (postId: string, pageId: string) => {
    const commentContent = newCommentContent[postId];
    if (!commentContent?.trim()) return;

    try {
      const page = facebookPages.find(p => p.id === pageId);
      if (!page) return;

      await facebookService.createComment(postId, page.accessToken, commentContent);
      // Refresh posts to get the new comment
      handleLoadPosts(pageId);
      setNewCommentContent(prev => ({ ...prev, [postId]: '' }));
    } catch (error) {
      setError(`Failed to add comment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const renderComments = (post: Post) => {
    if (!expandedComments[post.id]) return null;

    const filteredComments = post.comments.filter(comment => {
      switch (commentFilter[post.id]) {
        case 'new':
          // Comments from last 24 hours
          return new Date(comment.timestamp).getTime() > Date.now() - 24 * 60 * 60 * 1000;
        case 'relevant':
          // Comments with more than 2 likes or replies
          return (comment.likes && comment.likes > 2) || (comment.replies && comment.replies.length > 0);
        default:
          return true;
      }
    });

    return (
      <Box sx={{ mt: 2, ml: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Button
            size="small"
            variant={commentFilter[post.id] === 'all' ? 'contained' : 'outlined'}
            onClick={() => handleCommentFilterChange(post.id, 'all')}
          >
            All Comments
          </Button>
          <Button
            size="small"
            variant={commentFilter[post.id] === 'new' ? 'contained' : 'outlined'}
            onClick={() => handleCommentFilterChange(post.id, 'new')}
          >
            New Comments
          </Button>
          <Button
            size="small"
            variant={commentFilter[post.id] === 'relevant' ? 'contained' : 'outlined'}
            onClick={() => handleCommentFilterChange(post.id, 'relevant')}
          >
            Relevant Comments
          </Button>
        </Box>

        <List>
          {filteredComments.map((comment) => (
            <ListItem key={comment.id} sx={{ alignItems: 'flex-start' }}>
              <Avatar 
                src={comment.authorPicture} 
                alt={comment.author}
                sx={{ width: 40, height: 40, mr: 2 }}
              />
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    {comment.author}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(comment.timestamp).toLocaleString()}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  {comment.content}
                </Typography>
                {comment.likes > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ThumbUp sx={{ fontSize: 16, color: 'primary.main', mr: 0.5 }} />
                    <Typography variant="caption" color="text.secondary">
                      {comment.likes}
                    </Typography>
                  </Box>
                )}
              </Box>
            </ListItem>
          ))}
        </List>

        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Avatar 
            src="/default-avatar.png" 
            alt="You"
            sx={{ width: 40, height: 40 }}
          />
          <TextField
            fullWidth
            size="small"
            placeholder="Write a comment..."
            value={newCommentContent[post.id] || ''}
            onChange={(e) => setNewCommentContent(prev => ({ ...prev, [post.id]: e.target.value }))}
          />
          <Button
            variant="contained"
            size="small"
            onClick={() => handleAddComment(post.id, post.pageId)}
          >
            Comment
          </Button>
        </Box>
      </Box>
    );
  };

  const handleAddNewPage = async () => {
    if (newPageName.trim() && newPageToken.trim()) {
      try {
        const isValid = await socialService.validateFacebookToken(newPageToken);
        if (!isValid) {
          setError('Invalid access token');
          return;
        }

        const pages = await socialService.getFacebookPages(newPageToken);
        const newPages = pages.map(page => ({
          id: page.id,
          name: page.name,
          accessToken: page.access_token,
          posts: [],
          followers: 0,
          isActive: true,
        }));

        dispatch(setFacebookPages([...facebookPages, ...newPages]));
        setNewPageName('');
        setNewPageToken('');
        setNewPageDialogOpen(false);
      } catch (error) {
        console.error('Error adding Facebook page:', error);
        setError('Failed to add Facebook page');
      }
    }
  };

  const handleAddPage = async () => {
    if (!newPageName || !newPageToken) {
      setError('Please enter both page name and access token');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Starting to add new page:', newPageName);
      
      // Validate the token first
      console.log('Validating token...');
      const isValid = await facebookService.validateToken(newPageToken);
      console.log('Token validation result:', isValid);
      
      if (!isValid) {
        setError('Invalid access token');
        return;
      }

      // Check if page already exists
      const existingPage = facebookPages.find(page => page.name === newPageName);
      if (existingPage) {
        setError('Page already exists');
        return;
      }

      // Get page details
      console.log('Fetching page details...');
      const pages = await facebookService.getPages(newPageToken);
      console.log('Available pages:', pages);
      
      const page = pages.find(p => p.name === newPageName);
      if (!page) {
        setError('Page not found or you do not have access to it');
        return;
      }

      console.log('Adding page to store...');
      const newPage: FacebookPageType = {
        id: page.id,
        name: page.name,
        accessToken: page.access_token,
        posts: [],
        followers: 0,
        isActive: true,
      };

      dispatch(addFacebookPage(newPage));
      console.log('Page added successfully:', newPage);
      
      setNewPageDialogOpen(false);
      setNewPageName('');
      setNewPageToken('');
    } catch (error) {
      console.error('Error adding page:', error);
      setError('Failed to add page. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePage = (pageId: string) => {
    dispatch(removeFacebookPage(pageId));
  };

  const handleUpdatePage = (pageId: string, newName: string, newToken: string) => {
    const updatedPage: FacebookPageType = {
      id: pageId,
      name: newName,
      accessToken: newToken,
      posts: [],
      followers: 0,
      isActive: true,
    };
    dispatch(updateFacebookPage(updatedPage));
  };

  const handleCreatePost = async (pageId: string) => {
    if (newPostContent) {
      setLoading(true);
      try {
        const page = facebookPages.find(p => p.id === pageId);
        if (!page) {
          throw new Error('Page not found');
        }

        const response = await facebookService.createPost(pageId, page.accessToken, newPostContent);
        
        const newPost: Post = {
          id: response.id,
          pageId,
          content: newPostContent,
          timestamp: new Date().toISOString(),
          likes: response.likes?.summary?.total_count || 0,
          shares: response.shares?.count || 0,
          comments: [],
          isPublished: true,
        };

        dispatch(addPost({ pageId, post: newPost }));
        setNewPostContent('');
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to create post');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddCommentToPost = (pageId: string, postId: string) => {
    if (newCommentContent[postId]) {
      const newComment: CommentType = {
        id: Date.now().toString(),
        postId: postId,
        author: 'Current User',
        content: newCommentContent[postId],
        timestamp: new Date().toISOString(),
        isHidden: false,
        replies: [],
        likes: 0,
      };
      setComments(prev => ({
        ...prev,
        [`${pageId}_${postId}`]: [...(prev[`${pageId}_${postId}`] || []), newComment],
      }));
      setNewCommentContent(prev => ({ ...prev, [postId]: '' }));
      setSelectedPost(null);
    }
  };

  const handleDeleteComment = (post: Post, commentId: string) => {
    if (selectedPage) {
      dispatch(deleteComment({
        pageId: selectedPage,
        postId: post.id,
        commentId,
      }));
    }
  };

  return (
    <Box sx={{ 
      p: 2, 
      maxWidth: 1200, 
      margin: '0 auto',
      bgcolor: 'background.default',
      minHeight: '100vh'
    }}>
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          fontWeight: 500, 
          mb: 3,
          color: 'text.primary',
          fontSize: '1.5rem'
        }}
      >
        Facebook Pages
      </Typography>

      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Page selection */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Select a Page
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {facebookPages.map((page) => (
            <Chip
              key={page.id}
              label={page.name}
              onClick={() => handlePageSelect(page.id)}
              onDelete={() => handleRemovePage(page.id)}
              color={selectedPage === page.id ? 'primary' : 'default'}
              avatar={<Avatar src={page.picture} />}
              sx={{ mb: 1 }}
            />
          ))}
          <Chip
            label="Add New Page"
            onClick={() => setNewPageDialogOpen(true)}
            color="primary"
            variant="outlined"
            icon={<Add />}
          />
        </Box>
      </Box>

      {/* Selected page content */}
      {selectedPage && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              {selectedPageData?.name}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleLoadPosts(selectedPage)}
              disabled={loadingPosts[selectedPage]}
              startIcon={loadingPosts[selectedPage] ? <CircularProgress size={20} /> : null}
            >
              {loadingPosts[selectedPage] ? 'Loading...' : 'Load Posts'}
            </Button>
          </Box>

          {/* Posts */}
          {loadingPosts[selectedPage] ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : posts[selectedPage]?.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {posts[selectedPage].map((post) => (
                <Card key={post.id} className="post-enter card-hover">
                  <CardContent>
                    {/* Post content */}
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {post.content}
                    </Typography>
                    
                    {/* Post actions */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small">
                          <ThumbUp fontSize="small" />
                        </IconButton>
                        <Typography variant="body2" color="text.secondary">
                          {post.likes} likes
                        </Typography>
                      </Box>
                      <Button
                        size="small"
                        onClick={() => handleToggleComments(post.id)}
                      >
                        {expandedComments[post.id] ? 'Hide Comments' : 'Show Comments'}
                      </Button>
                    </Box>

                    {/* Comments */}
                    {expandedComments[post.id] && renderComments(post)}
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            <Typography variant="body1" color="text.secondary" align="center">
              No posts available. Click "Load Posts" to fetch posts from Facebook.
            </Typography>
          )}
        </Box>
      )}

      {/* New Post Dialog */}
      <Dialog open={newPostDialogOpen} onClose={() => setNewPostDialogOpen(false)}>
        <DialogTitle>Create New Post</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Post Content"
            fullWidth
            multiline
            rows={4}
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewPostDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => {
              if (selectedPage) {
                handleCreatePost(selectedPage);
                setNewPostDialogOpen(false);
              }
            }} 
            variant="contained"
            disabled={!selectedPage}
          >
            Post
          </Button>
        </DialogActions>
      </Dialog>

      {/* New Comment Dialog */}
      <Dialog open={newCommentDialogOpen} onClose={() => setNewCommentDialogOpen(false)}>
        <DialogTitle>Add Comment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Comment"
            fullWidth
            multiline
            rows={4}
            value={newCommentContent[selectedPost?.id || ''] || ''}
            onChange={(e) => setNewCommentContent(prev => ({ ...prev, [selectedPost?.id || '']: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewCommentDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => handleAddCommentToPost(selectedPage!, selectedPost?.id || '')} variant="contained">
            Comment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add New Page Dialog */}
      <Dialog open={newPageDialogOpen} onClose={() => setNewPageDialogOpen(false)}>
        <DialogTitle>Add New Facebook Page</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Page Name"
            fullWidth
            value={newPageName}
            onChange={(e) => setNewPageName(e.target.value)}
            disabled={loading}
          />
          <TextField
            margin="dense"
            label="Access Token"
            fullWidth
            value={newPageToken}
            onChange={(e) => setNewPageToken(e.target.value)}
            disabled={loading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewPageDialogOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleAddPage} color="primary" disabled={loading}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FacebookPage; 