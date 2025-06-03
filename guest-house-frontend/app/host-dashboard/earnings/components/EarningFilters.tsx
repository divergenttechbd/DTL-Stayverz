import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import React, { FC, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import useEarningFilterFIelds from '~/app/host-dashboard/earnings/hooks/useEarningFilterFIelds'
import Form from '~/components/form/Form'
import { DATE_FORMAT } from '~/constants/format'
import { getPaymentMethods } from '~/queries/client/paymentMethod'

interface IEarningFiltersProps {
  setFilters: Function
}

const EarningFilters: FC<IEarningFiltersProps> = ({ setFilters }) => {
  const formInstance = useForm()
  const fieldsValue = formInstance.watch()

  const { data: paymentMethods } = useQuery({ queryKey: ['paymentMethods'], queryFn: () => getPaymentMethods(), refetchOnWindowFocus: false })

  const filterFields = useEarningFilterFIelds(paymentMethods?.data)

  const applyFilter = useCallback(() => {
    const filters: Record<string, string> = {}
    if (fieldsValue.from_month > -1 && fieldsValue.from_year > -1)
      filters['payment_date_after'] = dayjs().set('month', fieldsValue.from_month).set('year', fieldsValue.from_year).startOf('month').format(DATE_FORMAT)
    if (fieldsValue.to_month > -1 && fieldsValue.to_year > -1)
      filters['payment_date_before'] = dayjs().set('month', fieldsValue.to_month).set('year', fieldsValue.to_year).endOf('month').format(DATE_FORMAT)
    filters['pay_method'] = fieldsValue.pay_method

    if (fieldsValue.pay_method == 0) delete filters['pay_method']

    setFilters((prev: Record<string, any>) => ({ ...prev, ...filters }))
  }, [fieldsValue.from_month, fieldsValue.from_year, fieldsValue.pay_method, fieldsValue.to_month, fieldsValue.to_year, setFilters])

  useEffect(() => {
    applyFilter()
  }, [applyFilter])

  return (
    <div>
      <Form
        formInstance={formInstance}
        fields={filterFields}
        onSubmit={() => { }}
        inputsContainerClassName='grid grid-cols-2 gap-3 mt-4'
        resetForm={false}
      />
    </div>
  )
}

export default EarningFilters
