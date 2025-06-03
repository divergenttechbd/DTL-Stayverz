import { Helmet } from 'react-helmet-async';
import BlogListView from 'src/sections/blogs/view/blog-list-view';

export default function PostListHomePage() {
  return (
    <>
      <Helmet>
        <title> Post: List</title>
      </Helmet>

      <BlogListView />
    </>
  );
}
