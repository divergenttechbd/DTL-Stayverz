import { useState, useCallback, useEffect } from 'react';
import Container from '@mui/material/Container';
import { getBlog } from 'src/utils/queries/blogs';
import PostDetailsHero from 'src/sections/blogs/post-details-hero';
import Markdown from 'src/components/markdown/markdown';
import { IBlogItem } from 'src/types/blog';
import { Box, Chip, Stack, Typography } from '@mui/material';
import { startCase } from 'lodash';

// ----------------------------------------------------------------------

const tabs = [{ value: 'content', label: 'Listing Content' }];

type Props = {
  id: string;
};

export default function BlogDetailsView({ id }: Props) {
  const [currentBlog, setCurrentBlog] = useState<IBlogItem | null>(null);

  const getBlogDetails = useCallback(async () => {
    try {
      const res = await getBlog(id);
      if (!res.success) throw res.data;
      setCurrentBlog(res.data);
    } catch (err) {
      console.log(err);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      getBlogDetails();
    }
  }, [getBlogDetails, id]);

  const renderPost = currentBlog && (
    <>
      <Box
        sx={{
          display: 'flex',
          marginY: 2,
          paddingX: 1,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h2">{currentBlog?.title}</Typography>
        <Chip size="small" label={startCase(currentBlog?.status)} />
      </Box>

      <PostDetailsHero title={currentBlog.title} coverUrl={currentBlog.image} />

      <Stack
        sx={{
          maxWidth: 720,
          mx: 'auto',
          mt: { xs: 5, md: 10 },
        }}
      >
        <Markdown children={currentBlog.description} />
      </Stack>
    </>
  );

  return <Container maxWidth={false}>{currentBlog && renderPost}</Container>;
}
