// @mui
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
// routes
import { useRouter } from 'src/routes/hook';
import Iconify from 'src/components/iconify';
import SearchNotFound from 'src/components/search-not-found';
import { Avatar } from '@mui/material';

// ----------------------------------------------------------------------

export type IListingItemLite = {
  title: string;
  cover_image: string;
  id: number;
};

type Props = {
  query: string;
  results: IListingItemLite[];
  onSearch: (inputValue: string) => void;
  hrefItem: (id: string) => string;
};

export default function TourSearch({ query, results, onSearch, hrefItem }: Props) {
  const router = useRouter();

  const handleClick = (id: string) => {
    router.push(hrefItem(id));
  };

  return (
    <Autocomplete
      sx={{ width: { xs: 1, sm: 260 } }}
      autoHighlight
      popupIcon={null}
      options={results}
      onInputChange={(event, newValue) => onSearch(newValue)}
      getOptionLabel={(option) => option.title}
      noOptionsText={<SearchNotFound query={query} sx={{ bgcolor: 'unset' }} />}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      slotProps={{
        popper: {
          placement: 'bottom-start',
          sx: {
            minWidth: 320,
          },
        },
        paper: {
          sx: {
            [` .${autocompleteClasses.option}`]: {
              pl: 0.75,
            },
          },
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search..."
          autoComplete="off"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ ml: 1, color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      )}
      renderOption={(props, tour, { inputValue }) => (
        <Box
          component="li"
          {...props}
          onClick={() => handleClick(tour.id.toString())}
          key={tour.id}
        >
          <Avatar
            key={tour.id}
            alt={tour.title}
            src={tour.cover_image}
            variant="rounded"
            sx={{ width: 48, height: 48, flexShrink: 0, mr: 1.5, borderRadius: 1 }}
          />

          <div key={inputValue}>
            <Typography
              key={tour.id}
              component="span"
              sx={{
                typography: 'body2',
              }}
            >
              {tour.title}
            </Typography>
          </div>
        </Box>
      )}
    />
  );
}
