import { Calendar } from '~/app/host-dashboard/calendar/components/Calendar'

export default function CalendarPage() {

  return (
    <div className=''>
      <div className='flex min-h-[90vh] flex-col justify-between w-full '>
        <Calendar />
      </div>
    </div>
  )
}
