import { m } from 'framer-motion';
// @mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
// utils
import { IListingItem } from 'src/types/listing';
// components
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import Markdown from 'src/components/markdown';
import { varTranHover } from 'src/components/animate';
import Lightbox, { useLightBox } from 'src/components/lightbox';
import startCase from 'lodash/startCase';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

type Props = {
  listing: IListingItem;
};

export default function TourDetailsContent({ listing }: Props) {
  const {
    title,
    images,
    address,
    description,
    price,
    category,
    place_type,
    cancellation_policy,
    check_in,
    check_out,
    bed_count,
    bedroom_count,
    guest_count,
    bathroom_count,
    amenities,
    event_allowed,
    pet_allowed,
    media_allowed,
    smoking_allowed,
    total_rating_count,
    avg_rating,
    owner,
  } = listing;

  const slides = images.map((slide) => ({
    src: slide,
  }));

  const {
    selected: selectedImage,
    open: openLightbox,
    onOpen: handleOpenLightbox,
    onClose: handleCloseLightbox,
  } = useLightBox(slides);

  const houseRules = [
    {
      name: 'Pet Allowed',
      value: pet_allowed,
    },
    {
      name: 'Smoking Allowed',
      value: smoking_allowed,
    },
    {
      name: 'Media Allowed',
      value: media_allowed,
    },
    {
      name: 'Event Allowed',
      value: event_allowed,
    },
  ].filter((elem) => elem.value);

  const renderGallery = (
    <>
      {slides.length ? (
        <Box
          gap={1}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
          }}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          {slides.length > 0 && (
            <m.div
              key={slides[0].src}
              whileHover="hover"
              variants={{
                hover: { opacity: 0.8 },
              }}
              transition={varTranHover()}
            >
              <Image
                alt={slides[0].src}
                src={slides[0].src}
                ratio="1/1"
                onClick={() => handleOpenLightbox(slides[0].src)}
                sx={{ borderRadius: 2, cursor: 'pointer' }}
              />
            </m.div>
          )}

          <Box gap={1} display="grid" gridTemplateColumns="repeat(2, 1fr)">
            {slides.slice(1, 5).map((slide) => (
              <m.div
                key={slide.src}
                whileHover="hover"
                variants={{
                  hover: { opacity: 0.8 },
                }}
                transition={varTranHover()}
              >
                <Image
                  alt={slide.src}
                  src={slide.src}
                  ratio="1/1"
                  onClick={() => handleOpenLightbox(slide.src)}
                  sx={{ borderRadius: 2, cursor: 'pointer' }}
                />
              </m.div>
            ))}
          </Box>
        </Box>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="200px"
          bgcolor="#f0f0f0"
          sx={{ width: '100%', my: 3 }}
        >
          <Typography variant="body2" color="textSecondary">
            No images found for this Listing
          </Typography>
        </Box>
      )}

      <Lightbox
        index={selectedImage}
        slides={slides}
        open={openLightbox}
        close={handleCloseLightbox}
      />
    </>
  );

  const renderHead = (
    <>
      <Stack direction="row" sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
      </Stack>

      <Stack spacing={3} direction="row" flexWrap="wrap" alignItems="center">
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ typography: 'body2' }}>
          <Iconify icon="eva:star-fill" sx={{ color: 'warning.main' }} />
          <Box component="span" sx={{ typography: 'subtitle2' }}>
            {avg_rating}
          </Box>
          <Link sx={{ color: 'text.secondary' }}>({total_rating_count} reviews)</Link>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ typography: 'body2' }}>
          <Iconify icon="mingcute:location-fill" sx={{ color: 'error.main' }} />
          {address}
        </Stack>
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ typography: 'body2' }}>
          <Iconify icon="solar:flag-bold" sx={{ color: 'primary.main' }} />
          <Link href={`${paths.dashboard.user.root}/${owner?.id}/edit`}>{owner?.full_name}</Link>
        </Stack>
      </Stack>
    </>
  );

  const renderOverview = (
    <Box
      gap={3}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        md: 'repeat(2, 1fr)',
      }}
    >
      {[
        {
          label: 'Price',
          value: `${price}`,
          icon: <Iconify icon="solar:clock-circle-bold" />,
        },
        {
          label: 'Place Type',
          value: startCase(place_type?.split('_')?.join(' ')),
          icon: <Iconify icon="solar:clock-circle-bold" />,
        },
        {
          label: 'Floor Plan',
          value: `Bedrooms: ${bedroom_count}, Beds: ${bed_count}, Bathrooms: ${bathroom_count}, Guests: ${guest_count}`,
          icon: <Iconify icon="solar:clock-circle-bold" />,
        },
        {
          label: 'Property Type',
          value: category?.name,
          icon: <Iconify icon="solar:clock-circle-bold" />,
        },
        {
          label: 'Cancellation Policy',
          value: cancellation_policy?.policy_name,
          icon: <Iconify icon="solar:clock-circle-bold" />,
        },
        {
          label: 'Check-in/Check-out Time',
          value: `${check_in}/${check_out}`,
          icon: <Iconify icon="solar:clock-circle-bold" />,
        },
      ].map((item) => (
        <Stack key={item.label} spacing={1.5} direction="row">
          {item.icon}
          <ListItemText
            primary={item.label}
            secondary={item.value}
            primaryTypographyProps={{
              typography: 'body2',
              color: 'text.secondary',
              mb: 0.5,
            }}
            secondaryTypographyProps={{
              typography: 'subtitle2',
              color: 'text.primary',
              component: 'span',
            }}
          />
        </Stack>
      ))}
    </Box>
  );

  const renderContent = (
    <>
      <Typography variant="h6" sx={{ marginBottom: 3 }}>
        Description
      </Typography>
      <Markdown children={description || ''} />

      {!!amenities.length && (
        <Typography variant="h6" sx={{ my: 3 }}>
          Amenities
        </Typography>
      )}
      <Stack spacing={2}>
        <Box
          rowGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
          }}
        >
          {amenities.map((amenity) => (
            <Stack key={amenity.amenity.id} spacing={1} direction="row" alignItems="center">
              <Iconify
                icon="eva:checkmark-circle-2-outline"
                sx={{
                  color: 'primary.main',
                }}
              />
              {amenity.amenity.name}
            </Stack>
          ))}
        </Box>
      </Stack>

      {!!houseRules.length && (
        <Typography variant="h6" sx={{ my: 3 }}>
          House Rules
        </Typography>
      )}
      <Stack spacing={2}>
        <Box
          rowGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
          }}
        >
          {houseRules.map((rule) => (
            <Stack key={rule.name} spacing={1} direction="row" alignItems="center">
              <Iconify
                icon="eva:checkmark-circle-2-outline"
                sx={{
                  color: 'primary.main',
                }}
              />
              {rule.name}
            </Stack>
          ))}
        </Box>
      </Stack>
    </>
  );

  return (
    <>
      {renderGallery}

      <Stack sx={{ maxWidth: 720, mx: 'auto' }}>
        {renderHead}

        <Divider sx={{ borderStyle: 'dashed', my: 5 }} />

        <Typography variant="h6" sx={{ marginBottom: 3 }}>
          Overview
        </Typography>
        {renderOverview}

        <Divider sx={{ borderStyle: 'dashed', my: 5 }} />

        {renderContent}
      </Stack>
    </>
  );
}
