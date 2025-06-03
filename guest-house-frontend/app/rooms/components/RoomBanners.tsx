'use client'
import { CaretLeft, DotsNine, Heart } from '@phosphor-icons/react'
import { MapPinLine } from '@phosphor-icons/react/dist/ssr/MapPinLine'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Fancybox from '~/components/Images/Fancybox'
import customToast from '~/lib/utils/customToast'
import PropertyVerifiedImg from '~/public/images/property/property-verfied.png'
import { addWishList, deleteWishList } from '~/queries/client/room'
import { useAuthStore } from '~/store/authStore'
import { styles } from '~/styles/classes'

const RoomBanners: React.FC<any> = ({ data }) => {
  const [offCanvasStyles, setOffcanvasStyles] = useState<string>('hidden')

  // wishlist
  const { isAuthenticated, wishlists, userData } = useAuthStore()
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const [wishListed, setWishListed] = useState(false)
  const queryClient = useQueryClient()
  const { mutateAsync: wishListMutation } = useMutation({
    mutationFn: addWishList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishListData'] })
    },
  })
  const { mutateAsync: removeWishList } = useMutation({
    mutationFn: deleteWishList,
  })
  useEffect(() => {
    const isWishListed = wishlists?.includes(data?.id)
    if (isWishListed !== undefined) {
      setWishListed(isWishListed)
    }
    isAuthenticated && userData?.u_type === 'guest'
      ? setIsLoading(false)
      : setIsLoading(false)
  }, [data?.id, isAuthenticated, userData?.u_type, wishListed, wishlists])

  const handleWishListClick = useCallback(async () => {
    setWishListed((prevWishList) => !prevWishList)

    if (wishListed) {
      try {
        const mutation = await removeWishList(data?.id)
        if (!mutation.isSucceed) throw mutation
        useAuthStore.setState({
          wishlists: wishlists?.filter((i) => i !== data?.id),
        })
        customToast(
          'success',
          'Removed from the wishlist !',
          'top-center',
          'mt-4 sm:m-0'
        )
      } catch (error) {
        console.error('Error updating wish list:', error)
      }
    } else {
      const payload: any = { listing_id: data?.id }
      try {
        const mutation = await wishListMutation(payload)
        if (!mutation.isSucceed) throw mutation
        useAuthStore.setState({ wishlists: [...(wishlists || []), data?.id] })
        setIsLoggingIn(false)
        customToast(
          'success',
          'Saved to the wishlist !',
          'top-center',
          'mt-4 sm:m-0'
        )
      } catch (error) {
        setIsLoggingIn(false)
        console.error('Error updating wish list:', error)
      }
    }
  }, [wishListed, removeWishList, data?.id, wishListMutation, wishlists])

  const handleLogin = useCallback(() => {
    setIsLoggingIn(true)
    useAuthStore.setState({ authFlow: 'GUEST_LOG_IN' })
  }, [])

  const handleOffcanvasOpen = () => {
    setOffcanvasStyles('slide-in-bottom')
  }

  const handleOffcanvasClose = () => {
    setOffcanvasStyles('slide-out-bottom')
  }

  const verificationStatus = useMemo(() => {
    if (data?.verification_status === 'verified') {
      return 'Verified'
    } else {
      return ''
    }
  }, [data?.verification_status])

  return (
    <div className='relative flex flex-col-reverse sm:flex-col gap-5 w-full'>
      <div className='block sm:hidden absolute top-0 left-0 right-0 mx-auto w-full z-10'>
        <div className='flex items-center justify-between flex-wrap p-3'>
          {/* <Link
            href={'/'}
            className={`${styles.flexCenter} bg-white rounded-full h-7 w-7 shadow-md`}
          >
            <CaretLeft size={15} color='#000000' />
          </Link> */}
          <button
            onClick={() => router.back()}
            className={`${styles.flexCenter} bg-white rounded-full h-7 w-7 shadow-md`}
          >
            <CaretLeft size={15} color='#000000' />
          </button>
          <div className='flex justify-end items-center gap-2'>
            <button
              className={`${styles.flexCenter} bg-white rounded-full h-7 w-7 shadow-md`}
              onClick={
                isAuthenticated && userData?.u_type === 'guest'
                  ? handleWishListClick
                  : handleLogin
              }
            >
              <Heart
                size={16}
                weight={wishListed ? 'fill' : 'bold'}
                className={`mt-[1px] ${
                  wishListed ? 'text-red-500 heart' : 'text-black'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
      {/* TITLE */}
      <div className='px-5 xl:px-0 xl:container'>
        <div className={`w-full`}>
          <div className=' flex flex-col gap-1'>
            <div>
              <h1 className='text-lg  leading-7 text-left md:text-2xl font-medium md:leading-8 text-[#202020] flex justify-start items-center gap-2'>
                {data?.title}
                {verificationStatus !== '' && (
                  <span className={`${styles.flexCenter}`}>
                    <Image
                      src={PropertyVerifiedImg}
                      width={16}
                      height={16}
                      alt='property-verified'
                      className='min-w-[16px] max-w-[16] h-[16px]'
                    />
                  </span>
                )}
              </h1>
            </div>
            <div className='flex items-center justify-between flex-wrap'>
              <div className='flex justify-start items-start md:items-center'>
                {/* <span className='flex justify-start items-center gap-1 text-[#202020] text-[14px] font-[600]'>
                  <Star weight='fill' size={14} /> {data?.avg_rating}
                </span>
                <span><Dot size={16} /></span>
                <span className='flex justify-start items-center gap-1 text-[#202020] text-[14px] font-[600] underline'>
                  {data?.total_rating_count} reviews
                </span> */}
                <MapPinLine
                  size={16}
                  className='min-w-[16px] my-auto mt-1 sm:mt-auto mr-2 md:mr-1 text-[#616161] md:text-[#202020]'
                />
                <span className='flex justify-start items-center gap-1 text-[#616161] md:text-[#202020] text-sm font-normal leading-5 tracking-normal text-left  md:text-base md:font-normal md:leading-6'>
                  {data?.address}
                </span>
              </div>
              <div className='hidden sm:flex justify-end items-center gap-2'>
                {/* <button className='hover:bg-[rgba(0,0,0,0.03)] border border-[#DCDDE1] py-2 px-2 rounded-full flex justify-start items-center gap-1 text-[#202020] text-[14px] font-[600] underline'>
                  <ShareNetwork size={14} className='' />
                </button> */}
                {/* {
                  isLoading ? 
                    <WishListSkeleton/> : (
                      <button 
                        className={`${!wishListed ? 'hover:bg-[rgba(0,0,0,0.03)]': ''} border border-[#DCDDE1] py-2 px-2 rounded-full flex justify-start items-center gap-1 text-[#616161] text-sm font-normal underline`}
                        onClick={isAuthenticated && userData?.u_type === 'guest' ? handleWishListClick : handleLogin}
                      >
                        <Heart size={14} weight={wishListed ? 'fill':'bold'} className={` ${wishListed ? 'text-red-500 heart':'text-[#616161]'}`}/>
                      </button>
                    )
                } */}
                <button
                  className={`${
                    !wishListed ? 'hover:bg-[rgba(0,0,0,0.03)]' : ''
                  } border border-[#DCDDE1] py-2 px-2 rounded-full flex justify-start items-center gap-1 text-[#616161] text-sm font-normal underline`}
                  onClick={
                    isAuthenticated && userData?.u_type === 'guest'
                      ? handleWishListClick
                      : handleLogin
                  }
                >
                  <Heart
                    size={14}
                    weight={wishListed ? 'fill' : 'bold'}
                    className={` ${
                      wishListed ? 'text-red-500 heart' : 'text-[#616161]'
                    }`}
                  />
                  {/* <span>{wishListed ? 'Saved':'Save'}</span> */}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* BANER */}
      <div className='md:px-5 xl:px-0 xl:container'>
        <div
          onClick={handleOffcanvasOpen}
          className='block sm:grid grid-cols-2 gap-2 overflow-hidden sm:rounded-xl relative'
        >
          <div className='relative'>
            <ImageContainer imgUrl={data?.cover_photo} alt='banner-one' />
          </div>
          <div
            className={`cursor-pointer absolute block sm:hidden bg-[rgba(0,0,0,0.7)] z-auto right-2 bottom-2 w-[55px] h-[23px] rounded-[3px] text-white text-[12px] font-semibold ${styles.flexCenter}`}
          >
            1/{data?.images?.length}
          </div>
          <div className='hidden sm:grid grid-cols-2 gap-2 relative'>
            {data?.images?.map(
              (imgUrl: string, index: number) =>
                index > 0 &&
                index <= 4 && (
                  <ImageContainer
                    key={`data-image-${index + 1}`}
                    imgUrl={imgUrl}
                    alt={`banner-${index + 1}`}
                  />
                )
            )}

            <button className='hidden lg:flex absolute border border-[#222222] bg-[#ffffff] z-auto px-2 py-2 rounded-lg text-[14px] text-[#202020] font-[600]  justify-center items-center bottom-4 right-4 gap-1'>
              <DotsNine size={20} color='#222222' />
              Show all photos
            </button>
          </div>
        </div>
      </div>

      <BannersOffcanvas
        data={data}
        offCanvasStyles={offCanvasStyles}
        handleClose={handleOffcanvasClose}
      />
    </div>
  )
}

export default RoomBanners

type BannersOffcanvasTypes = {
  data: any
  offCanvasStyles: string
  handleClose: () => void
}
const BannersOffcanvas: React.FC<BannersOffcanvasTypes> = ({
  data,
  offCanvasStyles,
  handleClose,
}) => {
  return (
    <div
      className={`bg-[#ffffff] fixed top-0 left-0 right-0 mx-auto z-20 overflow-hidden ${offCanvasStyles}`}
    >
      <div className='h-screen w-screen overflow-y-auto'>
        {/* TOP SECTION */}
        <div className='flex items-center justify-between flex-wrap px-2 sm:px-5 py-3'>
          <button onClick={handleClose} className={`${styles.flexCenter}`}>
            <CaretLeft size={20} color='#222222' />
          </button>
          {/* <div className='flex justify-end items-center gap-2'>
            <button className='hover:bg-[rgba(0,0,0,0.05)] py-1 px-2 rounded-md flex justify-start items-center gap-1 text-[#202020] text-[14px] font-[600] underline'>
              <UploadSimple size={16} className='mt-[1px]' />Share
            </button>
            <button className='hover:bg-[rgba(0,0,0,0.05)] py-1 px-2 rounded-md flex justify-start items-center gap-1 text-[#202020] text-[14px] font-[600] underline'>
              <Heart size={16} className='mt-[1px]' />Save
            </button>
          </div> */}
        </div>

        {/* BANNER LIST */}
        <div className='sm:container lg:w-[900px] sm:p-5'>
          <div className='grid gap-2 overflow-hidden sm:rounded-xl '>
            <Fancybox
              options={{
                Carousel: {
                  infinite: false,
                },
              }}
            >
              <a data-fancybox='gallery' href={data?.cover_photo}>
                <ImageContainer imgUrl={data?.cover_photo} alt='banner-one' />
              </a>
              <div className='grid md:grid-cols-2 gap-2 relative'>
                {data?.images?.map((imgUrl: string, index: number) => (
                  <a
                    data-fancybox='gallery'
                    href={imgUrl}
                    key={`data-image-${index + 1}`}
                  >
                    <ImageContainer
                      imgUrl={imgUrl}
                      alt={`banner-${index + 1}`}
                    />
                  </a>
                ))}
              </div>
            </Fancybox>
          </div>
        </div>
      </div>
    </div>
  )
}

type ImageContainerProps = {
  imgUrl: string
  alt: string
}
const ImageContainer: React.FC<ImageContainerProps> = ({ imgUrl, alt }) => (
  <div className={`${styles.flexCenter} relative cursor-pointer`}>
    <div className='absolute w-full h-full top-0 left-0 bg-transparent hover:bg-[rgba(0,0,0,0.1)]'></div>

    <Image
      src={imgUrl}
      alt={alt}
      width={400}
      height={250}
      className='object-cover w-full h-full cursor-pointer aspect-[16/9]'
    />
  </div>
)
