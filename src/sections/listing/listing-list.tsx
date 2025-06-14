import { ChangeEvent, useCallback } from 'react'
// @mui
import Box from '@mui/material/Box'
import Pagination, { paginationClasses } from '@mui/material/Pagination'
// routes
import { paths } from 'src/routes/paths'
// types
import { IListingItem } from 'src/types/listing'
// components
import { useRouter } from 'src/routes/hook'
//
import { softDeleteListing } from 'src/utils/queries/listing'
import TourItem from './listing-item'

// ----------------------------------------------------------------------

type Props = {
  tours: IListingItem[];
  onPaginationChange: (event: ChangeEvent<unknown>, page: number) => void;
  totalPage: number;
};

export default function TourList({ tours, onPaginationChange, totalPage }: Props) {
  const router = useRouter();

  const handleView = useCallback(
    (id: number | string) => {
      router.push(paths.dashboard.listing.details(id.toString()));
    },
    [router]
  );

  const handleEdit = useCallback(
    (id: number | string) => {
      router.push(paths.dashboard.listing.edit(id.toString()));
    },
    [router]
  );

  const handleDelete = useCallback(async (id: number | string) => {
    console.info('DELETE', id);
    try {
      const res = await softDeleteListing({
        id
      });
      if (!res.success) throw res.data;
      router.reload();
    } catch (err) {
      console.log(err);
    }
  }, [router]);

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        {tours.map((tour) => (
          <TourItem
            key={tour.id}
            tour={tour}
            onView={() => handleView(tour.id)}
            onEdit={() => handleEdit(tour.id)}
            onDelete={() => handleDelete(tour.id)}
          />
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
