'use client'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'
import Container from '~/components/layout/Container'
import Footer from '~/components/layout/Footer'
import ResponsiveHostNavbar from '~/components/layout/ResponsiveHostNavbar'
import ResponsiveNavbar from '~/components/layout/ResponsiveNavbar'
import Loader from '~/components/loader/Loader'
import { getBlogs } from '~/queries/client/blog'
import { useAuthStore } from '~/store/authStore'

type BlogTypes = {
  created_at: string
  description: string
  id: number
  image: string
  slug: string
  title: string
  updated_at: string
}

const Blog:FC = () => {
  const { isLoading, data:blogData } = useQuery({
    queryKey: ['blogsData'],
    queryFn: () => getBlogs(),
  })

  const { userData } = useAuthStore()
  const { u_type: userType } = userData || {}
  return(
    <>
      {
        userType === 'host' ?  
          <ResponsiveHostNavbar /> : <ResponsiveNavbar wrapInContainer={true}/> 
      }
      <Container>
        <section className='container mt-10 mb-20 pt-navbar lg:pt-0'>
          {
            isLoading? 
              <Loader/>:
              <>
                <h2 className='text-2xl text-center font-semibold'>Travel Articles</h2>
                <p className='text-sm text-center text-grayText my-5'> Discover how to make the most of your Stayverz experience with our useful blogs for both hosts and guests.</p>
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-5 my-10'>
                  {blogData?.data.map((blog: BlogTypes) => <BlogCard key={blog.id} blog={blog}/>)}
                </div>
              </>
          }
        </section>
      </Container>
      {
        userType !== 'host' ? 
          <Footer/>: ''
      }
    </>
  )
}

const BlogCard:FC<{blog: BlogTypes}> = ({ blog }) => {
  const date = new Date(blog.created_at)
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit'
  }).format(date)

  return(
    <Link href={`/blog/${blog.slug}`} passHref>
      <div className='bg-white shadow-2xl rounded-lg p-4 cursor-pointer'>
        <Image
          src={blog.image}
          alt={blog.title}
          className='rounded-t-lg w-full h-48 object-cover'
          height={500}
          width={300}        
        />
        <div className='p-4'>
          <h3 className='text-xl font-semibold'>{blog.title}</h3>
          <p className='text-grayText text-sm mt-2'>{formattedDate}</p>
        </div>
      </div>
    </Link>
  )
}

export default Blog

