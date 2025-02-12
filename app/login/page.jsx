'use client'
import React,{ useState} from 'react'
import { redirect, useRouter } from 'next/navigation'
import { FcGoogle } from "react-icons/fc";
import { signIn } from 'next-auth/react'
import { toast } from 'react-toastify';
import { IoMdEye } from "react-icons/io";
import { useSession } from 'next-auth/react';

const Page = () => {

    const {data:session} = useSession()
    const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

if(session){
    redirect('/');
}

  const handleGoogleSignIn = () => {
      const loading = toast.loading("Logging in");
      try {
        signIn("google",{callbackUrl: '/'});
        toast.dismiss(loading);
    } catch (error) {
        toast.dismiss(loading);
        console.log(error);
        toast.error("Failed to Log in, please try again")
    }
  }

  const changeShowStatus = () => {
      setShowPass(!showPass);
  }

  const handleSubmit = async(e) => {


    e.preventDefault();
    if (email === '' || password === '') {
        setError("Fill all fields!")
        return;
    }
    if (!email.includes("@") || email.length < 5 || !email.includes(".") || email.length > 100) {
        setError("Invalid email, must include @ and domain part!")
        return;
    }

    const loading = toast.loading("Signing in")
    try {
        await signIn(
            "credentials", {
                email,
                password,
                callbackUrl: "/",
                redirect: true
            }
        );

            toast.dismiss(loading)
            toast.success("Signed in successfully");
    } catch (error) {
      toast.dismiss(loading);
      toast.error("Failed to sign in");
        console.log(error);
    }finally{
        toast.dismiss(loading);
    }
    return;
}

  return (
<div className='w-full flex justify-center items-center my-4'>
    
    <div className="flex flex-col  bg-gradient-to-r from-blue-500 to-purple-500 p-4 md:p-6 w-96 rounded-lg transition-all duration-300  ease-in-out hover:from-purple-500 hover:to-blue-500">
    <div className='flex justify-center items-center flex-col'>

    <h1 className='text-2xl tracking-wide'>{"SIGN IN"}</h1>
    <h3 className='text-sm mb-3'>to continue</h3>
    </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        
        <div className="flex flex-col">
          <label className="text-black font-semibold">Email</label>
        </div>
        <div className="flex items-center border-2 border-gray-300 rounded-lg h-12 px-2 bg-white">
          <input
          onChange={(e) => {
            setError('');
            setEmail(e.target.value)
        }} 
        value={email} 
            placeholder="email"
            className="ml-2 w-full h-full border-none outline-none text-black"
            type="email"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-black font-semibold">Password</label>
        </div>
        <div className="flex items-center border-2 border-gray-300 rounded-lg h-12 px-2 bg-white">
          <input
     placeholder='Password' onChange={(e) => {
        setError('');
        setPassword(e.target.value)
    }} value={password} 
            className="ml-2 w-full h-full border-none outline-none text-black"
            type={`${showPass?"text":"password"}`}
          /> 

          <div className="flex items-center text-black justify-center ml-3">
            <IoMdEye size={30}  onClick={changeShowStatus} />
  </div>
          
        </div>

        <button className="w-full  py-2 bg-transparent border-2 border-black rounded-lg text-black font-medium transition duration-300 hover:bg-purple-600 hover:border-white hover:text-white">
          Sign In
        </button>
        <p className="text-center text-white text-sm">
          Don't have an account? <button onClick={()=>{
            setError(" ")
            router.push("/signup")}} className="cursor-pointer transition-all duration-300 ease-in-out hover:text-black">Sign Up</button>
        </p>
        <div className='w-full flex justify-center items-center'>
        <div className='w-[90%] h-[1px] bg-white'></div>
        </div>
          <div className='flex flex-col justify-center items-center'>
              <div className='w-full text-center'>or</div>
              <div className='w-full flex justify-center items-center'>
                  <div className='cursor-pointer size-8 rounded-full flex justify-center items-center transition-all ease-in-out duration-300 hover:bg-black bg-white'>
                      <FcGoogle onClick={handleGoogleSignIn} className='size-6 ' />
                  </div>
              </div>
          </div>
      </form>
    </div>
</div>

  );
};

export default Page;
