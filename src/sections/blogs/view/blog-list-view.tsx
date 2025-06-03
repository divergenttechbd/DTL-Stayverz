import { useState, useCallback, useEffect } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// utils
// assets
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { getBlogs } from 'src/utils/queries/blogs';
import { IBlogFilter, IBlogFilterValue, IBlogItem } from 'src/types/blog';
import { Button, Link } from '@mui/material';

import TourSort from '../listing-sort';
import TourSearch, { IListingItemLite } from '../listing-search';
import BlogList from '../blog-list';

export const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
];

const defaultFilters: IBlogFilter = {
  status: '',
  sort_by: '',
  search: '',
  page_size: 12,
  page: 1,
};

export default function BlogListView() {
  const settings = useSettingsContext();

  const openFilters = useBoolean();

  const [listData, setListData] = useState<IBlogItem[]>([]);
  const [listMeta, setListMeta] = useState<any>();

  const [search, setSearch] = useState<{ query: string; results: IListingItemLite[] }>({
    query: '',
    results: [],
  });

  const [filters, setFilters] = useState(defaultFilters);

  const getBlogList = useCallback(async (data: any) => {
    try {
      const res = await getBlogs(data);
      if (!res.success) throw res.data;
      setListData(res.data);
      setListMeta(res.meta_data);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    getBlogList({
      status: filters.status,
      sort_by: filters.sort_by,
      search: filters.search,
    });
  }, [filters, getBlogList]);

  const canReset = false;

  const notFound = !listData.length && canReset;

  const handleFilters = useCallback((name: string, value: IBlogFilterValue) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleSortBy = useCallback(
    (newValue: string) => {
      handleFilters('sort_by', newValue);
    },
    [handleFilters]
  );

  const handleSearch = useCallback(
    async (inputValue: string) => {
      setSearch((prevState) => ({
        ...prevState,
        query: inputValue,
      }));
      handleFilters('search', inputValue);
    },
    [handleFilters]
  );

  const handlePaginationChange = useCallback((event: React.ChangeEvent<unknown>, value: number) => {
    setFilters((prev) => ({ ...prev, page: value }));
  }, []);

  const renderFilters = (
    <Stack
      spacing={3}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-end', sm: 'center' }}
      direction={{ xs: 'column', sm: 'row' }}
    >
      <TourSearch
        query={search.query}
        results={search.results}
        onSearch={handleSearch}
        hrefItem={(id: string) => paths.dashboard.listing.details(id)}
      />

      <Stack direction="row" spacing={1} flexShrink={0}>
        <Link href={paths.dashboard.blog.new}>
          <Button variant="contained">+ New Blog</Button>
        </Link>
        <TourSort sort={filters.sort_by} onSort={handleSortBy} sortOptions={sortOptions} />
      </Stack>
    </Stack>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Blogs',
            href: paths.dashboard.blog.root,
          },
          { name: 'List' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Stack
        spacing={2.5}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {renderFilters}
      </Stack>

      {notFound && <EmptyContent title="No Data" filled sx={{ py: 10 }} />}

      <BlogList
        blogs={listData}
        onPaginationChange={handlePaginationChange}
        totalPage={Math.ceil((listMeta?.total || 0) / filters.page_size)}
      />
    </Container>
  );
}
