import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { IBlogItem } from 'src/types/blog';
import { useCallback, useEffect, useState } from 'react';
import { getBlog } from 'src/utils/queries/blogs';
import BlogNewEditForm from '../blog-new-edit-form';

export default function BlogEditView({ id }: { id: string }) {
  const settings = useSettingsContext();

  const [currentBlog, setCurrentBlog] = useState<IBlogItem>();

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

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new blog"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Blog',
            href: paths.dashboard.blog.root,
          },
          {
            name: 'Create',
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <BlogNewEditForm currentPost={currentBlog} />
    </Container>
  );
}
