import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';
import BlogCreateView from 'src/sections/blogs/view/blog-create-view';
// sections

// ----------------------------------------------------------------------

export default function BlogCreatePage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new blog</title>
      </Helmet>

      <BlogCreateView id={`${id}`} />
    </>
  );
}
