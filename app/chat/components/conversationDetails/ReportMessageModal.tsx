import { FC, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import Form, { IFormProps } from '~/components/form/Form'
import Button from '~/components/layout/Button'
import Modal from '~/components/modal/Modal'
import inputTypes from '~/constants/forms/inputTypes'
import customToast from '~/lib/utils/customToast'
import { createReport } from '~/queries/client/chat'
import { Message } from '~/queries/models/conversation'

interface ReportMessageModalProps {
  message: Message | undefined
  onClose: () => void
}

const fields: IFormProps['fields'] = [
  {
    inputType: inputTypes.TEXTAREA,
    label: 'Your complaint',
    key: 'text',
    rows: 6,
    required: true,
  }
]

export const ReportMessageModal:FC<ReportMessageModalProps> = ({
  message,
  onClose,
}) => {
  const formInstance = useForm()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit:IFormProps['onSubmit'] = useCallback(async (data) => {
    setIsProcessing(false)
    try {
      setIsProcessing(true)
      const response = await createReport({data})
      if (response.isSucceed) {
        onClose()
        customToast('success', 'Report sent!')
      }
    } catch (error) {
      customToast('error', (error as any).error)
    } finally {
      setIsProcessing(false)
    }
  }, [onClose])

  return (
    <Modal show={!!message} onClose={onClose} modalContainerclassName='rounded p-2'>
      <div className='p-4 w-[80vw] sm:w-[50vw]'>
        <h4 className='font-bold text-lg my-4'>Report on this message?</h4>
        <Form
          fields={fields}
          formInstance={formInstance}
          onSubmit={handleSubmit}
          submitButtonLabel={<Button type='submit' label='Submit' loading={isProcessing} />}
        />
      </div>
    </Modal>
  )
}
