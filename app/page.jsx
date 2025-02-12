import LandingPage from '@/components/LandingPage'
import ChatBot from '@/components/ChatBot'
import Warning from '@/components/Warning'

export default function Home() {
  return (
    <>
    <div className='overflow-hidden'>
<LandingPage/>
<ChatBot/>
<Warning/>

    </div>
    </>
  );
}
