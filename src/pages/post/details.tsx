import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hook';
// sections
import BlogDetailsView from 'src/sections/blogs/view/blog-details-view';

// ----------------------------------------------------------------------

export default function BlogDetailsPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Blog: Details</title>
      </Helmet>

      <BlogDetailsView id={`${id}`} />
    </>
  );
}
