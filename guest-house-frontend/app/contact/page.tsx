'use client'
import { WhatsappLogo } from '@phosphor-icons/react'
import ContactForm from '~/app/contact/components/ContactForm'
import ContactInfo from '~/app/contact/components/ContactInfo'
import Container from '~/components/layout/Container'
import Footer from '~/components/layout/Footer'
import ResponsiveHostNavbar from '~/components/layout/ResponsiveHostNavbar'
import ResponsiveNavbar from '~/components/layout/ResponsiveNavbar'
import { useAuthStore } from '~/store/authStore'

export default function Contact() {
  const { userData } = useAuthStore()
  const { u_type: userType } = userData || {}
  return (
    <>
      {
        userType === 'host' ?  
          <ResponsiveHostNavbar /> : <ResponsiveNavbar wrapInContainer={true}/> 
      }

      <Container>
        <section className='bg-grayBg pb-12 -mt[84px] pt-20 text-left lg:text-center px-5 lg:px-0'>
          <div className='mt-10 lg:mt-0'>
            <h2 className='text-4xl font-semibold lg:font-bold'>Contact Us</h2>
            <p className='text-lightGrayText mt-2 text-sm lg:text-base'>Any question or remarks? Just write us a message</p>
          </div>

          <div className='container flex flex-col lg:flex-row gap-10 lg:gap-20 mt-8 lg:mt-16 p-0 bg-white rounded-xl'>
            <ContactInfo />
            <ContactForm/>
          </div>
        </section>
      </Container>
      {
        userType !== 'host' ? 
          <Footer/>: ''
      }

      <a
        href='https://wa.me/8801879997999'
        className='fixed right-5 md:right-10 bottom-20 md:bottom-5 z-50'
        target='_blank'
      >
        <WhatsappLogo size={60} color='#25D366' weight='fill' />
      </a>
    </>
  )
}
