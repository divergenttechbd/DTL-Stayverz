import isEqual from 'lodash/isEqual'
import { useCallback, useEffect, useState } from 'react'
// @mui
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
// types
import { IReviewTableFilters, IReviewTableFilterValue } from 'src/types/review'
import { getReviews } from 'src/utils/queries/bookings'
//
import ReviewTableFiltersResult from '../review-table-filters-result'
import ReviewTableRow from '../review-table-row'
import ReviewTableToolbar from '../review-table-toolbar'

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'host', label: 'Host' },
  { value: 'guest', label: 'Guest' },
];

const TABLE_HEAD = [
  { id: 'review_by', label: 'Review By', width: 180 },
  { id: 'review_for', label: 'Review To', width: 180 },
  { id: 'rating', label: 'Rating', width: 100 },
  { id: 'created_at', label: 'Given at', width: 180 },
  { id: 'review', label: 'Review Details', width: 300 },
];

const defaultFilters: IReviewTableFilters = {
  search: '',
  u_type: '',
  status: 'all',
  identity_verification_status: '',
  created_at_after: null,
  created_at_before: null,
  user: null,
};
interface IReviewListViewProps {
  fromUserDetails?: boolean;
  userId?: number;
  userType?: string;
}

// ----------------------------------------------------------------------

export default function ReviewListView({
  fromUserDetails = false,
  userId,
  userType,
}: IReviewListViewProps) {
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
    (name: string, value: IReviewTableFilterValue) => {
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

  const getReviewList = useCallback(async (data: any) => {
    try {
      const res = await getReviews(data);
      if (!res.success) throw res.data;
      setTableData(res.data);
      setTableMeta({ ...res.meta_data, user_status_count: res.stats });
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    getReviewList({
      ...filters,
      stats: true,
      created_at_after: filters.created_at_after
        ? format(filters.created_at_after, 'yyyy-MM-dd')
        : null,
      created_at_before: filters.created_at_before
        ? format(filters.created_at_before, 'yyyy-MM-dd')
        : null,
      identity_verification_status: filters.identity_verification_status?.replace(
        'unverified',
        'not_verified'
      ),
      page_size: table.rowsPerPage,
      page: table.page + 1,
      status: filters.status === 'all' ? null : filters.status,
      user: fromUserDetails && userId
    });
  }, [filters, fromUserDetails, getReviewList, table.page, table.rowsPerPage, userId, userType]);
  // console.log('from user details -', fromUserDetails)
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>

      {!fromUserDetails && (
        <CustomBreadcrumbs
          heading="List"
          links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Review List' }]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
      )}

      <Card>
        {fromUserDetails ? (
          ''
        ) : (
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
                      (tab.value === 'host' && 'success') ||
                      (tab.value === 'guest' && 'success') ||
                      'default'
                    }
                  >
                    {tab.value === 'all'
                      ? (tableMeta?.user_status_count?.guest_review_count || 0) +
                        (tableMeta?.user_status_count?.host_review_count || 0)
                      : tableMeta?.user_status_count?.[`${tab.value}_review_count`]}
                  </Label>
                }
              />
            ))}
          </Tabs>
        )}

        <ReviewTableToolbar
          filters={filters}
          onFilters={handleFilters}
          showHostFilter={!fromUserDetails}
        />

        {canReset && (
          <ReviewTableFiltersResult
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
                  <ReviewTableRow
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
  );
}
