import { useState } from 'react'
import Button from '~/components/layout/Button'
import customToast from '~/lib/utils/customToast'

export default function ContactForm(){
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    text: ''
  })
  const baseURL = process.env.NEXT_PUBLIC_API_URL

  // handler function
  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`${baseURL}/contacts/messages/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) throw new Error('Failed to send message')
      const data = await response.json()
      console.log('Success:', data)

      // Clear form data
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        text: ''
      })      
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to send message')
    } finally{
      setLoading(false)
      customToast('success', 'Message sent successfully', 'bottom-right', 'mb-4 sm:m-0')
    }
  }

  return (
    <div className='lg:w-[55%] p-5'>
      <form onSubmit={handleSubmit}>
        <div className='flex flex-col gap-2 lg:flex-row lg:gap-0 justify-between'>

          <input 
            type='text' 
            name='first_name' 
            value={formData.first_name} 
            onChange={handleChange}
            className='appearance-none bg-transparent border-b border-grayBorder text-gray-700 py-1 px-2 leading-tight focus:outline-none mt-5 lg:mt-10 w-full lg:w-1/2 mr-5' 
            placeholder='First Name' required 
          />
          <input 
            type='text' 
            name='last_name' 
            value={formData.last_name} 
            onChange={handleChange} 
            className='appearance-none bg-transparent border-b border-grayBorder text-gray-700 py-1 px-2 leading-tight focus:outline-none mt-5 lg:mt-10 w-full lg:w-1/2'
            placeholder='Last Name' required 
          />
        </div>
        <div className='flex flex-col gap-2 lg:flex-row lg:gap-0 justify-between'>
          <input 
            type='email' 
            name='email' 
            value={formData.email} 
            onChange={handleChange} 
            className='appearance-none bg-transparent border-b border-grayBorder text-gray-700 py-1 px-2 leading-tight focus:outline-none mt-5 lg:mt-10 w-full lg:w-1/2 mr-5'
            placeholder='Email' required 
          />
          <input 
            type='tel' 
            name='phone_number' 
            maxLength={11}
            value={formData.phone_number} 
            onChange={handleChange} 
            className='appearance-none bg-transparent border-b border-grayBorder text-gray-700 py-1 px-2 leading-tight focus:outline-none mt-5 lg:mt-10 w-full lg:w-1/2'
            placeholder='Phone Number' required 
          />
        </div>
        <textarea 
          name='text' 
          value={formData.text} 
          onChange={handleChange} 
          className='appearance-none bg-transparent border-b border-grayBorder w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none mt-10'
          placeholder='Your message' required>
        </textarea>
        
        <Button 
          label='Send message'
          variant='primary'
          className='block ml-auto mt-5 w-full lg:w-auto'
          type='submit'
          loading={loading}
          loadingText='Sending ...'
        />
      </form>
    </div>
  )
}
