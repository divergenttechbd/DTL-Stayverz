import { ApexOptions } from 'apexcharts';
import { useState, useCallback } from 'react';
// @mui
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import ButtonBase from '@mui/material/ButtonBase';
import CardHeader from '@mui/material/CardHeader';
import Card, { CardProps } from '@mui/material/Card';
// components
import Chart, { useChart } from 'src/components/chart';
import { usePopover } from 'src/components/custom-popover';
import { FormControl, InputLabel, OutlinedInput, Radio, Select } from '@mui/material';
import { startCase } from 'lodash';

const filterOptions = Array.from({ length: 5 }, (_, index) => {
  const year = new Date().getFullYear() - index;
  return {
    label: year.toString(),
    value: year.toString(),
  };
});

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  setFilters?: Function;
  filters?: Record<any, any>;
  chart: {
    categories?: string[];
    colors?: string[];
    series: {
      name: string;
      data: number[];
    }[];
    options?: ApexOptions;
  };
}

export default function BookingStatistics({
  title,
  subheader,
  filters,
  setFilters,
  chart,
  ...other
}: Props) {
  const { categories, colors, series, options } = chart;

  const chartOptions = useChart({
    colors,
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories,
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${value}`,
      },
    },
    ...options,
  });

  return (
    <>
      <Card {...other}>
        <CardHeader
          title={title}
          subheader={subheader}
          action={
            <FormControl
              sx={{
                flexShrink: 1,
                width: { xs: '200px' },
              }}
            >
              <Select
                value={filters?.bookingStatYear}
                onChange={(val) =>
                  setFilters?.((prev: any) => ({
                    ...(prev || {}),
                    bookingStatYear: val.target.value,
                  }))
                }
                renderValue={(selected) => startCase(selected)}
                MenuProps={{
                  PaperProps: {
                    sx: { maxHeight: 240 },
                  },
                }}
              >
                {filterOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Radio
                      disableRipple
                      size="small"
                      checked={filters?.statFilter === option.value}
                    />
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          }
        />

        <Box sx={{ mt: 3, mx: 3 }}>
          <Chart dir="ltr" type="bar" series={series} options={chartOptions} height={364} />
        </Box>
      </Card>
    </>
  );
}
