import { ChangeEvent, useCallback } from 'react';
// @mui
import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';
import { IBlogItem } from 'src/types/blog';
import { useRouter } from 'src/routes/hook';
//
import BlogItem from './blog-item';

// ----------------------------------------------------------------------

type Props = {
  blogs: IBlogItem[];
  onPaginationChange: (event: ChangeEvent<unknown>, page: number) => void;
  totalPage: number;
};

export default function BlogList({ blogs, onPaginationChange, totalPage }: Props) {
  const router = useRouter();

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
        }}
      >
        {blogs.map((blog) => (
          <BlogItem key={blog.id} blog={blog} />
        ))}
      </Box>

      <Pagination
        onChange={onPaginationChange}
        count={totalPage || 0}
        sx={{
          mt: 8,
          [`& .${paginationClasses.ul}`]: {
            justifyContent: 'center',
          },
        }}
      />
    </>
  );
}
