import React, { useState } from 'react';
import { Box, Container } from '@chakra-ui/react';
import PostList from './PostList';
import CommentManager from './CommentManager';

interface FacebookManagerProps {
  pageId: string;
}

const FacebookManager: React.FC<FacebookManagerProps> = ({ pageId }) => {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const handlePostSelect = (postId: string) => {
    setSelectedPostId(postId);
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={8}>
        <PostList
          pageId={pageId}
          onPostSelect={handlePostSelect}
        />
      </Box>

      {selectedPostId && (
        <Box>
          <CommentManager
            postId={selectedPostId}
            pageId={pageId}
            onCommentAdded={() => {
              // Refresh posts to show new comments
              setSelectedPostId(null);
              setTimeout(() => setSelectedPostId(selectedPostId), 100);
            }}
          />
        </Box>
      )}
    </Container>
  );
};

export default FacebookManager; 