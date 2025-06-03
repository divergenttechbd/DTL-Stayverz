import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hook';
import BlogEditView from 'src/sections/blogs/view/blog-edit-view';

// ----------------------------------------------------------------------

export default function BlogEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Blog: Edit</title>
      </Helmet>

      <BlogEditView id={`${id}`} />
    </>
  );
}
