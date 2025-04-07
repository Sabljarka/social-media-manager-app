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
import { FacebookPage as FacebookPageType, Post, Comment as CommentType } from '../store/slices/socialSlice';
import facebookService, { FacebookPost } from '../services/facebookService';
import { useTheme } from '@mui/material/styles';
import { socialService } from '../services/socialService';
import socketService from '../services/socketService';
import type { FacebookPage } from '../services/facebookService';

const FacebookPage: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { facebookPages, selectedPage } = useSelector((state: RootState) => state.social);
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

  const handleLoadPosts = async (pageId: string) => {
    const page = facebookPages.find(p => p.id === pageId);
    if (!page) return;

    setLoadingPosts(prev => ({ ...prev, [pageId]: true }));
    try {
      console.log('Validating token...');
      const isValid = await facebookService.validateToken(page.accessToken);
      console.log('Token validation result:', isValid);
      
      if (!isValid) {
        setError(`Invalid access token for page ${page.name}`);
        return;
      }

      console.log('Fetching posts from Facebook API...');
      const posts = await facebookService.getPagePosts(page.id, page.accessToken);
      console.log('Received posts:', posts);
      
      if (posts && posts.length > 0) {
        const formattedPosts: Post[] = await Promise.all(posts.map(async (post: FacebookPost) => {
          // Fetch comments for this post
          const comments = await facebookService.getPostComments(post.id, page.accessToken);
          console.log(`Comments for post ${post.id}:`, comments);

          // Format comments with user information
          const formattedComments: CommentType[] = comments.map((comment: any) => {
            console.log('Processing comment:', comment);
            console.log('Comment author:', comment.from);
            console.log('Comment author picture:', comment.from?.picture);
            
            // Get user information from the comment
            const author = comment.from?.name || 'Unknown User';
            const authorPicture = comment.from?.picture?.data?.url || '/default-avatar.png';
            
            return {
              id: comment.id,
              postId: post.id,
              author: author,
              authorPicture: authorPicture,
              content: comment.message,
              timestamp: comment.created_time,
              isHidden: false,
              replies: [],
              likes: comment.like_count || 0,
            };
          });

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

  const selectedPageData = facebookPages.find(page => page.id === selectedPage);

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

      {/* Page Selection */}
      <Box sx={{ 
        mb: 3,
        p: 2,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {facebookPages.map((page) => (
            <Chip
              key={page.id}
              label={page.name}
              onClick={() => handlePageSelect(page.id)}
              color={selectedPage === page.id ? 'primary' : 'default'}
              size="small"
              sx={{ 
                borderRadius: 1,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                },
                '& .MuiChip-avatar': { width: 24, height: 24, fontSize: '0.75rem' }
              }}
              avatar={<Avatar sx={{ width: 24, height: 24 }}>{page.name[0]}</Avatar>}
            />
          ))}
          <Chip
            icon={<Add sx={{ fontSize: 16 }} />}
            label="Add Page"
            onClick={() => setNewPageDialogOpen(true)}
            variant="outlined"
            size="small"
            sx={{ 
              borderRadius: 1,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }
            }}
          />
        </Box>
      </Box>

      {selectedPageData ? (
        <>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 2,
            p: 2,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }
          }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              {selectedPageData.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleLoadPosts(selectedPageData.id)}
                disabled={loadingPosts[selectedPageData.id]}
                sx={{ 
                  textTransform: 'none',
                  minWidth: 100,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }
                }}
              >
                {loadingPosts[selectedPageData.id] ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  'Load Posts'
                )}
              </Button>
              <Button
                variant="contained"
                size="small"
                startIcon={<Add sx={{ fontSize: 16 }} />}
                onClick={() => setNewPostDialogOpen(true)}
                sx={{ 
                  textTransform: 'none',
                  minWidth: 100,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }
                }}
              >
                New Post
              </Button>
            </Box>
          </Box>

          {loadingPosts[selectedPageData.id] ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              p: 3,
              animation: 'pulse 1.5s infinite'
            }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {selectedPageData.posts.map((post) => (
                <Card className="post-enter card-hover" sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar 
                        sx={{ 
                          width: 32, 
                          height: 32, 
                          mr: 1,
                          bgcolor: 'primary.main',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            transform: 'scale(1.1)'
                          }
                        }}
                      >
                        {selectedPageData.name[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                          {selectedPageData.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(post.timestamp).toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {post.content}
                    </Typography>

                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2,
                      color: 'text.secondary',
                      fontSize: '0.875rem',
                      mt: 1
                    }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 0.5,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          color: 'primary.main'
                        }
                      }}>
                        <ThumbUp sx={{ fontSize: 16 }} />
                        <span>{post.likes}</span>
                      </Box>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 0.5,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          color: 'primary.main'
                        }
                      }}>
                        <Reply sx={{ fontSize: 16 }} />
                        <span>{post.comments.length}</span>
                      </Box>
                    </Box>

                    {post.comments.length > 0 && (
                      <Box sx={{ mt: 2, ml: 2 }}>
                        <List dense sx={{ py: 0 }}>
                          {post.comments.map((comment) => (
                            <Card className="comment-enter card-hover" sx={{ mb: 1 }}>
                              <ListItem 
                                sx={{ 
                                  py: 0.5,
                                  transition: 'all 0.2s ease-in-out',
                                  '&:hover': { 
                                    bgcolor: 'action.hover',
                                    borderRadius: 1
                                  }
                                }}
                              >
                                <ListItemText
                                  primary={
                                    <Typography variant="body2">
                                      <strong>{comment.author}</strong> {comment.content}
                                    </Typography>
                                  }
                                  secondary={
                                    <Typography variant="caption" color="text.secondary">
                                      {new Date(comment.timestamp).toLocaleString()}
                                    </Typography>
                                  }
                                />
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleDeleteComment(post, comment.id)}
                                  sx={{ 
                                    ml: 1,
                                    transition: 'all 0.2s ease-in-out',
                                    '&:hover': {
                                      transform: 'scale(1.1)',
                                      color: 'error.main'
                                    }
                                  }}
                                >
                                  <Delete sx={{ fontSize: 16 }} />
                                </IconButton>
                              </ListItem>
                            </Card>
                          ))}
                        </List>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Select a page to view posts
        </Typography>
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

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FacebookPage; 