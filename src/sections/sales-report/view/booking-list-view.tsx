import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
// routes
import { paths } from 'src/routes/paths';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { format } from 'date-fns';
import {
  useTable,
  TableNoData,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
import { downloadCSV, getBookings } from 'src/utils/queries/bookings';
// types
import {} from 'src/types/user';
import { IBookingTableFilters, IBookingTableFilterValue } from 'src/types/booking';
import { Stack } from '@mui/material';
import { Box } from '@mui/system';
//
import SalesReportTableToolbar from '../booking-table-toolbar';
import SalesReportTableFiltersResult from '../booking-table-filters-result';
import SalesReportTableRow from '../booking-table-row';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'currently_hosting', label: 'Currently Hosting' },
  { value: 'completed', label: 'Completed' },
];

const TABLE_HEAD = [
  { id: 'guest', label: 'Guest', width: 180 },
  { id: 'host', label: 'Host', width: 180 },
  { id: 'check_in', label: 'Check-in', width: 100 },
  { id: 'check_out', label: 'Checkout', width: 100 },
  { id: 'booked_on', label: 'Booked', width: 100 },
  { id: 'listing', label: 'Listing', width: 250 },
  { id: 'confirmation_code', label: 'Confirmation Code', width: 100 },
  { id: 'paid_amount', label: 'Guest Paid', width: 100 },
  { id: 'guest_service_charge', label: 'Gateway Fee', width: 100 },
  { id: 'host_service_charge', label: 'Host Service Charge', width: 100 },
  { id: 'host_pay_out', label: 'Host Payout', width: 100 },
  { id: 'total_profit', label: 'Total Profit', width: 100 },
  { id: '', label: 'Action', width: 88 },
];

const defaultFilters: IBookingTableFilters = {
  search: '',
  created_at_after: null,
  created_at_before: null,
  status: 'all',
  host: null,
};

// ----------------------------------------------------------------------

export default function SalesReportListView() {
  const table = useTable({
    defaultCurrentPage: 0,
    defaultRowsPerPage: 10,
  });
  const settings = useSettingsContext();
  const confirm = useBoolean();

  const [tableData, setTableData] = useState<any>([]);
  const [tableMeta, setTableMeta] = useState<any>({ total: 0 });
  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = tableData;
  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name: string, value: IBookingTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleDownload = useCallback(async () => {
    try {
      await downloadCSV(
        table.selected.length
          ? {
              ids: table.selected,
            }
          : {
              created_at_gte: filters.created_at_after,
              created_at_lte: filters.created_at_before,
              host_id: filters.host?.value,
              search: filters.search,
              status: filters.status,
              event_type: filters.status === 'all' ? null : filters.status,
            }
      );
    } catch (e) {
      console.log(e);
    }
  }, [table, filters]);

  const getBookingList = useCallback(async (data: any) => {
    try {
      const res = await getBookings(data);
      if (!res.success) throw res.data;
      setTableData(res.data);
      setTableMeta({
        ...res.meta_data,
        event_stats: {
          ...res.event_stats,
          all_count:
            res.event_stats.currently_hosting_count +
            res.event_stats.completed_count +
            res.event_stats.upcoming_count,
        },
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    getBookingList({
      created_at_after: filters.created_at_after
        ? format(filters.created_at_after, 'yyyy-MM-dd')
        : null,
      bookings: true,
      host: filters.host?.value,
      created_at_before: filters.created_at_before
        ? format(filters.created_at_before, 'yyyy-MM-dd')
        : null,
      page_size: table.rowsPerPage,
      page: table.page + 1,
      search: filters.search,
      event_type: filters.status === 'all' ? null : filters.status,
    });
  }, [filters, getBookingList, table.page, table.rowsPerPage]);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Stack
          spacing={3}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-end', sm: 'center' }}
          direction={{ xs: 'column', sm: 'row' }}
        >
          <CustomBreadcrumbs
            heading="List"
            links={[
              { name: 'Dashboard', href: paths.dashboard.root },
              { name: 'Sales Report List' },
            ]}
            sx={{
              mb: { xs: 3, md: 5 },
            }}
          />
          <Button variant="contained" onClick={confirm.onTrue}>
            <Iconify icon="solar:download-bold" sx={{ marginRight: 1 }} /> Download
          </Button>
        </Stack>
        <Card>
          <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                    }
                    color={
                      (tab.value === 'active' && 'success') ||
                      (tab.value === 'deactivated' && 'warning') ||
                      (tab.value === 'restricted' && 'error') ||
                      'default'
                    }
                  >
                    {tableMeta.event_stats?.[`${tab.value}_count`]}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <SalesReportTableToolbar filters={filters} onFilters={handleFilters} />

          {canReset && (
            <SalesReportTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              onResetFilters={handleResetFilters}
              results={tableMeta.total}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={tableData?.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  tableData?.map((row: any) => row.id)
                )
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      tableData.map((row: any) => row.id)
                    )
                  }
                />

                <TableBody>
                  {tableData.map((row: any) => (
                    <SalesReportTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onDeleteRow={() => {}}
                      onEditRow={() => {}}
                    />
                  ))}

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={tableMeta.total}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={<>Are you sure want to download report?</>}
        action={
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              handleDownload();
              confirm.onFalse();
            }}
          >
            Download
          </Button>
        }
      />
    </>
  );
}
