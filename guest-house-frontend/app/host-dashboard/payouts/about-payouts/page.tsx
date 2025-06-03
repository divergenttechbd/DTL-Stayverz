/* eslint-disable react/no-unescaped-entities */
const AboutPayouts = () => {
  return(
    <section className='my-20 md:my-10 container'>

      <div className='text-left pb-20'>
        <h1 className='text-brandColor text-center text-3xl font-bold mb-10'>What you need to know about STAYVETRZ payouts. </h1>
        <p className='text-base'>
          Your Stayverz payout is on its way! You choose how you’d like to receive the money you earn hosting. The options vary depending on where you’re based. The timing depends on your guest's stay length, how long it takes your chosen payout method to process the funds, and whether you're new to hosting with Stayverz. 
        </p>


        <div className='mb-10 mt-10'>
          <h4 className='text-lg font-semibold mb-2'>When Stayverz releases payouts for shorter stays?</h4>
          <p className='text-base'>
            For stays 7 nights or shorter, expect your Stayverz payout to be sent within 24 hours of guest check-in. The final arrival time will depend on the processing speed of your chosen payout method.
          </p>
        </div>


        <div className='mb-10'>
          <h4 className='text-lg font-semibold mb-2'>When Stayverz releases payouts for monthly stays?</h4>
          <p className='text-base'>
            For stays 7 nights or shorter, expect your Stayverz payout to be sent within 24 hours of guest check-in. The final arrival time will depend on the processing speed of your chosen payout method.If the reservation is a stay of 8 nights or more, we’ll send the payout after the guest checks in, and we’ll send any payouts after contacting with both parties.<br/>
            Upcoming payouts are released to you based on the check-in date, for the duration of the reservation.<br/>
            Once payouts are released by Stayverz, how long it takes you to get your money depends on your payout method’s processing time.<br/>
          </p>
        </div>


        <div className='mb-10'>
          <h4 className='text-lg font-semibold mb-2'>How long payouts take to process?</h4>
          <p className='text-base'>
            There’s a processing time before the money arrives with your payment provider, after Stayverz releases your payout. You can always contact your payment provider for further details on this timeline.
          </p>
        </div>


        <div className='mb-10'>
          <h4 className='text-lg font-semibold mb-2'>Make sure your payout method is added correctly.</h4>
          <p className='text-base'>
            You must set up at least one <b>Payment Method</b> so you can get paid.<br/>
            If you want your payouts to be released automatically, you must <b>set a Default Payment Method.</b><br/> 
            You can always check the status of your payout in your <b>Earnings</b> section.
            If you have multiple listings with check-ins on the same day, your money may usually be sent as a single payout.
          </p>
        </div>


        <div className='mb-10'>
          <h4 className='text-lg font-semibold mb-2'>Weekend or holidays might delay your payouts.</h4>
          <p className='text-base'>
            If your added payout method is through bank, please know that banking systems don’t process transactions on weekends or holidays, so your money will be processed the next business day. Contact your bank directly if you have any questions.<br/>
            Whereas mobile financial banking systems allow payouts to be processed and sent on weekends and holidays as well. 
          </p>
        </div>
      </div>
    </section>
  )
}

export default AboutPayouts
