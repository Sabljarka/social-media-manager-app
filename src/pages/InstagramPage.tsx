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
  ListItemSecondaryAction,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Avatar,
  Divider,
  useTheme,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Reply as ReplyIcon,
  Edit as EditIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { InstagramAccount, Post, Comment } from '../store/slices/socialSlice';
import {
  setInstagramAccounts,
  setSelectedAccount,
  addPost,
  updatePost,
  deletePost,
  addComment,
  updateComment,
  deleteComment,
} from '../store/slices/socialSlice';

const InstagramPage: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { instagramAccounts, selectedAccount } = useSelector((state: RootState) => state.social);
  const [newPostDialogOpen, setNewPostDialogOpen] = useState(false);
  const [newCommentDialogOpen, setNewCommentDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newPostContent, setNewPostContent] = useState('');
  const [newCommentContent, setNewCommentContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [newAccountDialogOpen, setNewAccountDialogOpen] = useState(false);
  const [newAccountUsername, setNewAccountUsername] = useState('');
  const [newAccountAccessToken, setNewAccountAccessToken] = useState('');

  useEffect(() => {
    // Simulacija podataka za demonstraciju
    dispatch(setInstagramAccounts([
      {
        id: '1',
        username: 'instagram_account_1',
        accessToken: 'token1',
        posts: [
          {
            id: '1',
            pageId: '1',
            content: 'Prvi post na Instagramu',
            mediaUrl: 'https://picsum.photos/500/500',
            timestamp: '2024-03-20T10:00:00',
            likes: 100,
            comments: [
              {
                id: '1',
                postId: '1',
                author: 'Korisnik 1',
                content: 'Odličan post!',
                timestamp: '2024-03-20T10:05:00',
                isHidden: false,
                replies: [],
              },
            ],
            isPublished: true,
          },
        ],
        followers: 1000,
        isActive: true,
      },
      {
        id: '2',
        username: 'instagram_account_2',
        accessToken: 'token2',
        posts: [],
        followers: 500,
        isActive: true,
      },
    ]));
  }, [dispatch]);

  const handleAccountSelect = (accountId: string) => {
    dispatch(setSelectedAccount(accountId));
  };

  const handleAddPost = () => {
    if (selectedAccount && newPostContent.trim()) {
      const newPost: Post = {
        id: Date.now().toString(),
        pageId: selectedAccount,
        content: newPostContent,
        mediaUrl: selectedImage ? URL.createObjectURL(selectedImage) : undefined,
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: [],
        isPublished: true,
      };
      dispatch(addPost({ pageId: selectedAccount, post: newPost }));
      setNewPostContent('');
      setSelectedImage(null);
      setNewPostDialogOpen(false);
    }
  };

  const handleAddComment = () => {
    if (selectedPost && newCommentContent.trim()) {
      const newComment: Comment = {
        id: Date.now().toString(),
        postId: selectedPost.id,
        author: 'Admin',
        content: newCommentContent,
        timestamp: new Date().toISOString(),
        isHidden: false,
        replies: [],
      };
      dispatch(addComment({
        pageId: selectedAccount!,
        postId: selectedPost.id,
        comment: newComment,
      }));
      setNewCommentContent('');
      setNewCommentDialogOpen(false);
    }
  };

  const handleToggleCommentVisibility = (post: Post, comment: Comment) => {
    const updatedComment = { ...comment, isHidden: !comment.isHidden };
    dispatch(updateComment({
      pageId: selectedAccount!,
      postId: post.id,
      comment: updatedComment,
    }));
  };

  const handleDeleteComment = (post: Post, commentId: string) => {
    dispatch(deleteComment({
      pageId: selectedAccount!,
      postId: post.id,
      commentId,
    }));
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
    }
  };

  const handleAddNewAccount = () => {
    if (newAccountUsername.trim() && newAccountAccessToken.trim()) {
      const newAccount: InstagramAccount = {
        id: Date.now().toString(),
        username: newAccountUsername,
        accessToken: newAccountAccessToken,
        posts: [],
        followers: 0,
        isActive: true,
      };
      dispatch(setInstagramAccounts([...instagramAccounts, newAccount]));
      setNewAccountUsername('');
      setNewAccountAccessToken('');
      setNewAccountDialogOpen(false);
    }
  };

  const selectedAccountData = instagramAccounts.find(account => account.id === selectedAccount);

  const formattedComments: Comment[] = selectedAccountData?.posts.map((post: any) => ({
    id: post.id,
    postId: post.id,
    author: post.from?.name || 'Unknown User',
    content: post.text,
    timestamp: post.timestamp,
    isHidden: false,
    replies: [],
    likes: post.like_count || 0,
  })) || [];

  const formattedPosts: Post[] = selectedAccountData?.posts.map((post: any) => ({
    id: post.id,
    pageId: selectedAccount,
    content: post.caption,
    mediaUrl: post.media_url,
    timestamp: post.timestamp,
    likes: post.like_count || 0,
    shares: 0,
    comments: [],
    isPublished: true,
  })) || [];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Instagram Accounts
      </Typography>

      {/* Account Selection */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Select Account
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {instagramAccounts.map((account) => (
            <Chip
              key={account.id}
              label={`@${account.username}`}
              onClick={() => handleAccountSelect(account.id)}
              color={selectedAccount === account.id ? 'primary' : 'default'}
              avatar={<Avatar>{account.username[0]}</Avatar>}
            />
          ))}
          <Chip
            icon={<AddIcon />}
            label="Add New Account"
            onClick={() => setNewAccountDialogOpen(true)}
            variant="outlined"
          />
        </Box>
      </Box>

      {selectedAccountData ? (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6">
              Posts for @{selectedAccountData.username}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setNewPostDialogOpen(true)}
            >
              New Post
            </Button>
          </Box>

          <Grid container spacing={2}>
            {formattedPosts.map((post) => (
              <Grid item xs={12} sm={6} md={4} key={post.id}>
                <Paper sx={{ p: 2, height: '100%' }}>
                  {post.mediaUrl && (
                    <Box sx={{ mb: 2, position: 'relative', paddingTop: '100%' }}>
                      <img
                        src={post.mediaUrl}
                        alt="Post"
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </Box>
                  )}
                  <Typography variant="body1" gutterBottom>
                    {post.content}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Posted on {new Date(post.timestamp).toLocaleString()}
                  </Typography>
                  <Typography variant="caption" display="block" color="text.secondary">
                    {post.likes} likes
                  </Typography>

                  {/* Comments Section */}
                  {formattedComments.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Comments
                      </Typography>
                      <List>
                        {formattedComments.map((comment) => (
                          <ListItem key={comment.id} sx={{ py: 0.5 }}>
                            <ListItemText
                              primary={comment.author}
                              secondary={comment.content}
                            />
                            <ListItemSecondaryAction>
                              <IconButton
                                edge="end"
                                onClick={() => handleToggleCommentVisibility(post, comment)}
                              >
                                {comment.isHidden ? <VisibilityOffIcon /> : <VisibilityIcon />}
                              </IconButton>
                              <IconButton
                                edge="end"
                                onClick={() => handleDeleteComment(post, comment.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}

                  <Box sx={{ mt: 2 }}>
                    <Button
                      startIcon={<ReplyIcon />}
                      onClick={() => {
                        setSelectedPost(post);
                        setNewCommentDialogOpen(true);
                      }}
                    >
                      Comment
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <Typography>Please select an account to view posts</Typography>
      )}

      {/* New Post Dialog */}
      <Dialog open={newPostDialogOpen} onClose={() => setNewPostDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Post</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<ImageIcon />}
              fullWidth
            >
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageSelect}
              />
            </Button>
            {selectedImage && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Selected"
                  style={{ maxWidth: '100%', maxHeight: '300px' }}
                />
              </Box>
            )}
          </Box>
          <TextField
            autoFocus
            margin="dense"
            label="Caption"
            fullWidth
            multiline
            rows={4}
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewPostDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddPost} variant="contained">
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
            value={newCommentContent}
            onChange={(e) => setNewCommentContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewCommentDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddComment} variant="contained">
            Comment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add New Account Dialog */}
      <Dialog open={newAccountDialogOpen} onClose={() => setNewAccountDialogOpen(false)}>
        <DialogTitle>Add New Instagram Account</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Username"
            fullWidth
            value={newAccountUsername}
            onChange={(e) => setNewAccountUsername(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Access Token"
            fullWidth
            value={newAccountAccessToken}
            onChange={(e) => setNewAccountAccessToken(e.target.value)}
            helperText="Enter your Instagram access token"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewAccountDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddNewAccount} variant="contained">
            Add Account
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InstagramPage; 