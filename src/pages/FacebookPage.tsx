import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Avatar,
  Divider,
  useTheme,
  Grid,
  Card,
  CardContent,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Reply as ReplyIcon,
  Edit as EditIcon,
  ThumbUp as ThumbUpIcon,
} from '@mui/icons-material';
import { FacebookPage as FacebookPageType, Post, Comment } from '../store/slices/socialSlice';
import {
  setFacebookPages,
  setSelectedPage,
  addPost,
  updatePost,
  deletePost,
  addComment,
  updateComment,
  deleteComment,
  addFacebookPage,
  removeFacebookPage,
  updateFacebookPage,
  setPosts,
} from '../store/slices/socialSlice';
import { socialService } from '../services/socialService';
import { socketService } from '../services/socketService';
import facebookService, { FacebookPost } from '../services/facebookService';
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
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
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
          const formattedComments: Comment[] = comments.map((comment: any) => {
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
                    <ThumbUpIcon sx={{ fontSize: 16, color: 'primary.main', mr: 0.5 }} />
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
    if (newPageName && newPageToken) {
      setLoading(true);
      try {
        const isValid = await facebookService.validateToken(newPageToken);
        if (!isValid) {
          throw new Error('Invalid access token');
        }

        const pages = await facebookService.getPages(newPageToken);
        const page = pages.find((p: FacebookPage) => p.name === newPageName);
        
        if (!page) {
          throw new Error('Page not found');
        }

        const newPage: FacebookPageType = {
          id: page.id,
          name: page.name,
          accessToken: page.access_token,
          posts: [],
          followers: 0,
          isActive: true,
        };

        dispatch(addFacebookPage(newPage));
        setNewPageName('');
        setNewPageToken('');
        setNewPageDialogOpen(false);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to add Facebook page');
      } finally {
        setLoading(false);
      }
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
      const newComment: Comment = {
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Facebook Pages
      </Typography>

      {/* Page Selection */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Select Page
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {facebookPages.map((page) => (
            <Chip
              key={page.id}
              label={page.name}
              onClick={() => handlePageSelect(page.id)}
              color={selectedPage === page.id ? 'primary' : 'default'}
              avatar={<Avatar>{page.name[0]}</Avatar>}
            />
          ))}
          <Chip
            icon={<AddIcon />}
            label="Add New Page"
            onClick={() => setNewPageDialogOpen(true)}
            variant="outlined"
          />
        </Box>
      </Box>

      {selectedPageData ? (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6">
              Posts for {selectedPageData.name}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setNewPostDialogOpen(true)}
            >
              New Post
            </Button>
          </Box>

          <List>
            {selectedPageData.posts.map((post) => (
              <React.Fragment key={post.id}>
                <Paper sx={{ mb: 2, p: 2 }}>
                  <ListItem>
                    <ListItemText
                      primary={post.content}
                      secondary={`Posted on ${new Date(post.timestamp).toLocaleString()}`}
                    />
                    <IconButton
                      edge="end"
                      onClick={() => {
                        setSelectedPost(post);
                        setNewCommentDialogOpen(true);
                      }}
                    >
                      <ReplyIcon />
                    </IconButton>
                  </ListItem>

                  {/* Comments Section */}
                  {post.comments.length > 0 && (
                    <Box sx={{ mt: 2, ml: 4 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Comments
                      </Typography>
                      <List>
                        {post.comments.map((comment) => (
                          <ListItem key={comment.id}>
                            <ListItemText primary={comment.content} />
                            <IconButton edge="end" onClick={() => handleDeleteComment(post, comment.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </Paper>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </>
      ) : (
        <Typography>Please select a page to view posts</Typography>
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

      <Grid container spacing={3}>
        {facebookPages.map((page) => (
          <Grid 
            key={page.id}
            component="div"
            sx={{
              width: { xs: '100%', md: '50%' },
              p: 1
            }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6">{page.name}</Typography>
                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleLoadPosts(page.id)}
                    disabled={loadingPosts[page.id]}
                  >
                    {loadingPosts[page.id] ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Load Posts'
                    )}
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleCreatePost(page.id)}
                    disabled={loading}
                  >
                    Create Post
                  </Button>
                </Box>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Recent Posts
                  </Typography>
                  {loadingPosts[page.id] ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <List>
                      {page.posts.map((post) => (
                        <Paper key={post.id} sx={{ p: 2, mb: 2 }}>
                          <Typography variant="body1">{post.content}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {new Date(post.timestamp).toLocaleString()}
                          </Typography>
                          <Box sx={{ mt: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Chip
                              size="small"
                              label={`${post.likes} likes`}
                              color="primary"
                              variant="outlined"
                            />
                            <Chip
                              size="small"
                              label={`${post.shares} shares`}
                              color="secondary"
                              variant="outlined"
                            />
                            <Button
                              size="small"
                              onClick={() => handleToggleComments(post.id)}
                              startIcon={<ReplyIcon />}
                            >
                              {post.comments.length} Comments
                            </Button>
                          </Box>
                          {renderComments(post)}
                        </Paper>
                      ))}
                    </List>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={!!selectedPost}
        onClose={() => setSelectedPost(null)}
      >
        <DialogTitle>Comments</DialogTitle>
        <DialogContent>
          <List>
            {(selectedPost && comments[`${selectedPage}_${selectedPost.id}`] || []).map((comment) => (
              <ListItem key={comment.id}>
                <ListItemText
                  primary={comment.content}
                  secondary={`${comment.author} - ${new Date(comment.timestamp).toLocaleString()}`}
                />
              </ListItem>
            ))}
          </List>
          <TextField
            autoFocus
            margin="dense"
            label="New Comment"
            fullWidth
            value={newCommentContent[selectedPost?.id || ''] || ''}
            onChange={(e) => setNewCommentContent(prev => ({ ...prev, [selectedPost?.id || '']: e.target.value }))}
            disabled={loading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedPost(null)} disabled={loading}>
            Close
          </Button>
          <Button
            onClick={() => selectedPost && handleAddCommentToPost(selectedPage!, selectedPost.id)}
            color="primary"
            disabled={loading}
          >
            Add Comment
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