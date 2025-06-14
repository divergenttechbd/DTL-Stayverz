import isEqual from 'lodash/isEqual'
import { useCallback, useEffect, useState } from 'react'
// @mui
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import { alpha } from '@mui/material/styles'
import Tab from '@mui/material/Tab'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import Tabs from '@mui/material/Tabs'
import Tooltip from '@mui/material/Tooltip'
// routes
import { paths } from 'src/routes/paths'
// hooks
import { useBoolean } from 'src/hooks/use-boolean'
// components
import { format } from 'date-fns'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs'
import { ConfirmDialog } from 'src/components/custom-dialog'
import Iconify from 'src/components/iconify'
import Label from 'src/components/label'
import Scrollbar from 'src/components/scrollbar'
import { useSettingsContext } from 'src/components/settings'
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  useTable,
} from 'src/components/table'
import { getBookings } from 'src/utils/queries/bookings'
// types
import { IBookingTableFilters, IBookingTableFilterValue } from 'src/types/booking'
import { } from 'src/types/user'
//
import BookingTableFiltersResult from '../booking-table-filters-result'
import BookingTableRow from '../booking-table-row'
import BookingTableToolbar from '../booking-table-toolbar'

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'currently_hosting', label: 'Currently Hosting' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
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
  { id: '', label: 'Action', width: 88 },
];
const defaultFilters: IBookingTableFilters = {
  search: '',
  created_at_after: null,
  created_at_before: null,
  status: 'all',
  host: null,
  guest: null,
};

// ----------------------------------------------------------------------
// these props will help to identify the exact user when this component will be called from the 'user-edit-view.tsx' (user detail)
type BookingListViewProps = {
  fromUserDetails?: boolean;
  userType?: string;
  userId?: number;
};

export default function BookingListView({
  fromUserDetails = false,
  userType,
  userId,
}: BookingListViewProps) {
  // console.log('bookings ---', fromUserDetails, userType, userId);

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

  const handleCancel = async (id: number) => {
    try {
      // const res = await cancelBooking({ id: confirm.value });
      // if (!res.success) throw res.data;
      console.log(id);
      getBookingList({ page: table.page + 1, page_size: table.rowsPerPage });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getBookingList({
      created_at_after: filters.created_at_after
        ? format(filters.created_at_after, 'yyyy-MM-dd')
        : null,
      bookings: true,
      host: fromUserDetails && userType === 'host' ? userId : filters.host?.value,
      guest: fromUserDetails && userType === 'guest' ? userId : null,
      created_at_before: filters.created_at_before
        ? format(filters.created_at_before, 'yyyy-MM-dd')
        : null,
      page_size: table.rowsPerPage,
      page: table.page + 1,
      search: filters.search,
      event_type: filters.status === 'all' ? null : filters.status,
    });
  }, [filters, getBookingList, table.page, table.rowsPerPage, fromUserDetails, userId, userType]);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        {!fromUserDetails && (
          <CustomBreadcrumbs
            heading="List"
            links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Booking List' }]}
            sx={{
              mb: { xs: 3, md: 5 },
            }}
          />
        )}

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

          {/* 
            show user dropdown select -> when not coming from indi user (!false = true)
            hide user dropdown select -> when coming from indi user (!true = false) 
          */}
          <BookingTableToolbar
            filters={filters}
            onFilters={handleFilters}
            showUserDropdown={!fromUserDetails}
          />

          {canReset && (
            <BookingTableFiltersResult
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
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
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
                    <BookingTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onDeleteRow={() => { }}
                      onEditRow={() => { }}
                      onCancel={() => { handleCancel(row.id) }}
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
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}
