import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import { paths } from 'src/routes/paths';
import { useBoolean } from 'src/hooks/use-boolean';
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
import { getStaffUsers } from 'src/utils/queries/users';
import { IUserTableFilters, IUserTableFilterValue } from 'src/types/user';
import { RouterLink } from 'src/routes/components';
import UserTableRow from '../user-table-row';
import UserTableToolbar from '../user-table-toolbar';
import UserTableFiltersResult from '../user-table-filters-result';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'restricted', label: 'Restricted' },
];

const TABLE_HEAD = [
  { id: 'full_name', label: 'Name' },
  { id: 'phone_number', label: 'Phone Number', width: 180 },
  { id: 'date_joined', label: 'Joined At', width: 220 },
  { id: 'u_type', label: 'Role', width: 180 },
  { id: 'status', label: 'Status', width: 100 },
  { id: '', width: 88 },
];

const defaultFilters: IUserTableFilters = {
  search: '',
  u_type: '',
  status: 'all',
  identity_verification_status: '',
  date_joined_after: null,
  date_joined_before: null,
};

export default function UserListView() {
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
    (name: string, value: IUserTableFilterValue) => {
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

  const getUserList = useCallback(async (data: any) => {
    try {
      const res = await getStaffUsers(data);
      if (!res.success) throw res.data;
      setTableData(res.data);
      setTableMeta({ ...res.meta_data, user_status_count: res.user_status_count });
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    getUserList({
      date_joined_after: filters.date_joined_after
        ? format(filters.date_joined_after, 'yyyy-MM-dd')
        : null,
      date_joined_before: filters.date_joined_before
        ? format(filters.date_joined_before, 'yyyy-MM-dd')
        : null,
      role: filters.u_type,
      page_size: table.rowsPerPage,
      page: table.page + 1,
      search: filters.search,
      status: filters.status === 'all' ? null : filters.status,
    });
  }, [filters, getUserList, table.page, table.rowsPerPage]);

  // Excel export function
  const handleExport = async () => {
    try {
      const res = await getStaffUsers({ page: 1, page_size: 100000000 });
      if (!res.success) throw res.data;
      const reportData = res.data;
      const dataForExport = reportData?.map((entry: any) => ({
        Name: entry?.full_name,
        Email: entry?.email,
        'Host Name': entry?.host?.full_name,
        'Phone Number': entry?.phone_number,
        Role: entry?.status,
        Status: entry?.role,
      }));

      const worksheet = XLSX.utils.json_to_sheet(dataForExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'User List Report');
      const today = new Date().toISOString().split('T')[0];
      XLSX.writeFile(workbook, `user_list_report_${today}.xlsx`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="List"
          links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'User List' }]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
          action={
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
              <Button
                component={RouterLink}
                href={paths.dashboard.settings.user.new}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                New User
              </Button>
              <Button variant="contained" onClick={handleExport}>
                <Iconify icon="solar:download-bold" sx={{ marginRight: 1 }} /> Download
              </Button>
            </Box>
          }
        />
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
                    {tab.value === 'all'
                      ? tableMeta.user_status_count?.reduce(
                          (acc: number, cur: any) => acc + cur.status_count,
                          0
                        )
                      : tableMeta?.user_status_count?.find(
                          (count: any) => count.status === tab.value
                        )?.status_count || 0}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <UserTableToolbar filters={filters} onFilters={handleFilters} />

          {canReset && (
            <UserTableFiltersResult
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
                    <UserTableRow
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
