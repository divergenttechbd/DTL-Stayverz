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

  return (
    <TextField
      onChange={(e) => onSearch(e.target.value)}
      placeholder="Search..."
      autoComplete="off"
    />
  );
}
