import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect } from 'react';
import * as XLSX from 'xlsx';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import { paths } from 'src/routes/paths';
import { useBoolean } from 'src/hooks/use-boolean';
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
import { TextField, Typography } from '@mui/material';
import { createServiceCharge, getServiceCharges } from 'src/utils/queries/configurations';
import { IServiceChargeFilter, IServiceChargeFilterValue } from 'src/types/service-charge';
import { LoadingButton } from '@mui/lab';
import { RouterLink } from 'src/routes/components';
import ChargeTableRow from '../charge-table-row';
import ChargeTableToolbar from '../charge-table-toolbar';
import ChargeTableFiltersResult from '../charge-table-filters-result';

const TABLE_HEAD = [
  { id: 'start_date', label: 'Start Date', width: 180 },
  { id: 'end_date', label: 'End Date', width: 180 },
  { id: 'service_charge', label: 'Host Service Charge', width: 180 },
];

const defaultFilters: IServiceChargeFilter = {
  start_date: null,
  end_date: null,
};

export default function ChargeListView({ sc_type }: { sc_type: string }) {
  const table = useTable({
    defaultCurrentPage: 0,
    defaultRowsPerPage: 10,
  });
  const settings = useSettingsContext();
  const confirm = useBoolean();

  const [charge, setCharge] = useState('');
  const [error, setError] = useState('');
  const loading = useBoolean();

  const [tableData, setTableData] = useState<any>([]);
  const [tableMeta, setTableMeta] = useState<any>({ total: 0 });
  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = tableData;
  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name: string, value: IServiceChargeFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const getChargeList = useCallback(async () => {
    try {
      const res = await getServiceCharges({
        start_date: filters.start_date ? format(filters.start_date, 'yyyy-MM-dd') : null,
        end_date: filters.end_date ? format(filters.end_date, 'yyyy-MM-dd') : null,
        page_size: table.rowsPerPage,
        page: table.page + 1,
        sc_type,
      });
      if (!res.success) throw res.data;
      setTableData(res.data);
      setTableMeta({ ...res.meta_data, user_status_count: res.user_status_count });
    } catch (err) {
      console.log(err);
    }
  }, [filters.start_date, filters.end_date, sc_type, table.page, table.rowsPerPage]);

  const handleChargeSubmit = useCallback(async () => {
    try {
      loading.onTrue();
      const value = parseInt(charge, 10);
      if (!value || value < 0) {
        setError('Invalid Charge');
        return;
      }
      const res = await createServiceCharge({
        sc_type,
        calculation_type: 'percentage',
        value: charge,
      });
      if (!res.success) throw res.data;
      getChargeList();
      setCharge('');
      confirm.onFalse();
    } catch (err) {
      setError(err.message);
      console.log(err);
    } finally {
      loading.onFalse();
    }
  }, [loading, charge, sc_type, getChargeList, confirm]);

  useEffect(() => {
    getChargeList();
  }, [filters, getChargeList]);

  // Excel export function
  const handleExport = async () => {
    try {
      const res = await getServiceCharges({ sc_type, page: 1, page_size: 100000000 });
      if (!res.success) throw res.data;
      const reportData = res.data;
      const dataForExport = reportData?.map((entry: any) => ({
        'Start Date': entry?.start_date,
        'End Date': entry?.end_date,
        "Host Service Charge (%)": entry?.value,
      }));

      const worksheet = XLSX.utils.json_to_sheet(dataForExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Charging List Report');
      const today = new Date().toISOString().split('T')[0];
      XLSX.writeFile(workbook, `charging_list_report_${today}.xlsx`);
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
                onClick={confirm.onTrue}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                New Charge
              </Button>
              <Button variant="contained" onClick={handleExport}>
                <Iconify icon="solar:download-bold" sx={{ marginRight: 1 }} /> Download
              </Button>
            </Box>
          }
        />

        <Card>
          <ChargeTableToolbar filters={filters} onFilters={handleFilters} />

          {canReset && (
            <ChargeTableFiltersResult
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
                />

                <TableBody>
                  {tableData.map((row: any) => (
                    <ChargeTableRow
                      key={row.id}
                      row={row}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      selected={table.selected.includes(row.id)}
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
        title="Update Service Charge"
        content={
          <>
            <TextField
              sx={{ width: '100%', mt: 2 }}
              type="number"
              label="Charge (%)"
              value={charge}
              onChange={(e) => setCharge(e.target.value)}
            />
            <Typography sx={{ marginTop: 1, marginLeft: 1, color: 'red', fontSize: '14px' }}>
              {error}
            </Typography>
          </>
        }
        action={
          <LoadingButton
            variant="contained"
            color="primary"
            onClick={handleChargeSubmit}
            loading={loading.value}
          >
            Save
          </LoadingButton>
        }
      />
    </>
  );
}
