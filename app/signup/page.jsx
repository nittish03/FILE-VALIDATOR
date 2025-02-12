"use client";
import React, { FormEvent, useState } from "react";
import { redirect } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { IoMdEye } from "react-icons/io";

const Page = () => {
  const { data: session } = useSession();
  if (session) {
    redirect("/");
  }
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [register, setRegister] = useState(false);

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  const changeShowStatus = () => {
    setShowPass(!showPass);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email === "" || password === "" || username === "") {
      setError("Fill all fields!");
      return;
    }
    if (
      !email.includes("@") ||
      email.length < 5 ||
      !email.includes(".") ||
      email.length > 100
    ) {
      setError("Invalid email, must include @ and domain part!");
      return;
    }
    try {
      const response = await axios.post("/api/auth/register", {
        username,
        email,
        password,
      });
      const loading = toast.loading("registering");
      if (response) {
        toast.dismiss(loading);
        toast.success("OTP SENT SUCCESSFULLY");
        setRegister(true);
      } else {
        toast.dismiss(loading);
        toast.error("Signup Failed");
      }
    } catch (e) {
      toast.error("Signup failed");
      console.log(e);
      setRegister(false);
    }
    return;
  };
  const handleOTP = async (e) => {
    e.preventDefault();
    if (otp.length < 6 || error !== "") {
      setError("Wrong Inputs! make sure the input is exaclty six digits.");
      return;
    }
    try {
      const loading = toast.loading("Signing in");
      const response = await axios.post("/api/auth/otp-verification", {
        email,
        otp,
      });
      await signIn("credentials", {
        email,
        password,
        callbackUrl: "/",
        redirect: true,
      });
      console.log(response);
      if (response) {
        toast.dismiss(loading);
        toast.success("Signed In successfully");
        router.push("/login");
      } else {
        toast.dismiss(loading);
        toast.error("Failed to sign in, please try again!");
      }
    } catch (e) {
      console.log(e);
    }

    console.log(otp);
    return;
  };

  const handleResendOTP = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/resend-otp", { email });
      if (response) {
        toast.success("OTP Resent Successfully");
      } else {
        toast.error("Failed to resend OTP");
      }
    } catch (e) {
      console.log(e);
    }
  };

  return !register ? (
    <div>
      <div className="w-full flex justify-center items-center my-4">
        <div className="flex flex-col  bg-gradient-to-r from-blue-500 to-purple-500 px-4 md:py-2 py-2 md:p-8 w-96 rounded-lg transition-all duration-300  ease-in-out hover:from-purple-500 hover:to-blue-500">
          <div className="flex justify-center items-center flex-col">
            <h1 className="text-2xl tracking-wide">Sign Up</h1>
            <h3 className="text-sm mb-5">to continue</h3>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <div className="flex flex-col">
              <label className="text-black font-semibold">Name</label>
            </div>
            <div className="flex items-center border-2 border-gray-300 rounded-lg h-12 px-2 bg-white">
              <input
                onChange={(e) => {
                  setError("");
                  setUsername(e.target.value);
                }}
                value={username}
                placeholder="Name"
                className="ml-2 w-full h-full border-none outline-none text-black"
                type="text"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-black font-semibold">Email</label>
            </div>
            <div className="flex items-center border-2 border-gray-300 rounded-lg h-12 px-2 bg-white">
              <input
                onChange={(e) => {
                  setError("");
                  setEmail(e.target.value);
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
                placeholder="Password"
                onChange={(e) => {
                  setError("");
                  setPassword(e.target.value);
                }}
                value={password}
                className="ml-2 w-full h-full border-none outline-none text-black"
                type={`${showPass ? "text" : "password"}`}
              />
 
              <div className="flex items-center text-black justify-center ml-3">
                <IoMdEye size={30} onClick={changeShowStatus} />
              </div>
            </div>

            <button className="w-full h-10  bg-transparent border-2 border-black rounded-lg text-black font-medium transition duration-300 hover:bg-purple-600 hover:border-white hover:text-white">
              Sign Up
            </button>
            <p className="text-center text-white text-sm">
              Already have an account?
              <button onClick={()=>{
                setError(" ")
                router.push("/login")}}  className="cursor-pointer transition-all duration-300 ease-in-out hover:text-black">
                Sign In
              </button>
            </p>
            <div className="w-full flex justify-center items-center">
              <div className="w-[90%] h-[1px] bg-white"></div>
            </div>
            <div className="flex flex-col justify-center items-center">
              <div className="w-full text-center">or</div>
              <div className="w-full flex justify-center items-center">
                <div className="cursor-pointer size-8 rounded-full flex justify-center items-center transition-all ease-in-out duration-300 hover:bg-black bg-white">
                  <FcGoogle onClick={handleGoogleSignIn} className="size-6" />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  ) : (
    <>
      <div className="h-fit w-screen flex justify-center items-center my-4">
        <div className="custom-shadow  w-[320px] md:w-[420px] mt-5 py-2 md:py-7 h-fit border rounded-lg flex flex-col bg-custom-bg text-light-gray items-center justify-around font-sans font-light">
          <h1 className="text-2xl tracking-wide text-custom-neon">Sign Up</h1>
          <h3 className="text-sm mb-5">to continue</h3>
          <form
            onSubmit={handleOTP}
            className="w-[80%] flex flex-col items-center justify-center gap-7"
          >
            <div className="flex flex-col text-sm md:text-base text-center justify-center items-start w-full">
              <div>OTP for one time verification sent to</div>
              <div>{email} </div>
            </div>
            <InputOTP
              maxLength={6}
              onChange={(value) => {
                if (/^\d*$/.test(value)) {
                  setOtp(value);
                  setError(""); // Clear error if input is valid
                } else {
                  setError("Only numeric digits are allowed.");
                }
              }}
            >
              <InputOTPGroup className="gap-[3px] md:gap-3">
                <InputOTPSlot
                  index={0}
                  className="text-lg md:size-10 text-black bg-[#d9d9d9] outline-none border-[2px] border-white"
                />
                <InputOTPSlot
                  index={1}
                  className="text-lg md:size-10 text-black bg-[#d9d9d9] outline-none border-[2px] border-white"
                />
                <InputOTPSlot
                  index={2}
                  className="text-lg md:size-10 text-black bg-[#d9d9d9] outline-none border-[2px] border-white"
                />
                <InputOTPSlot
                  index={3}
                  className="text-lg md:size-10 text-black bg-[#d9d9d9] outline-none border-[2px] border-white"
                />
                <InputOTPSlot
                  index={4}
                  className="text-lg md:size-10 text-black bg-[#d9d9d9] outline-none border-[2px] border-white"
                />
                <InputOTPSlot
                  index={5}
                  className="text-lg md:size-10 text-black bg-[#d9d9d9] outline-none border-[2px] border-white"
                />
              </InputOTPGroup>
            </InputOTP>
            <div className="flex justify-start items-start w-full text-sm md:text-base gap-1">
              <div>Didn't recieve OTP? </div>
              <button
                onClick={handleResendOTP}
                className="font-aria text-custom-neon cursor-pointer"
              >
                Send Again
              </button>
            </div>
            {error && (
              <p className="w-full text-start text-sm text-red-500 my-[-12px]">
                {error}
              </p>
            )}
            <button className="w-full h-10  bg-transparent border-2 border-black rounded-lg text-black font-medium transition duration-300 hover:bg-purple-600 hover:border-white hover:text-white">
              Sign In
            </button>
            <div className="w-full">
              <div className="flex">
                <button
                  onClick={() => {
                    setRegister(false);
                  }}
                  className="w-full text-sm text-custom-neon flex justify-center items-center cursor-pointer"
                >
                  Change email address
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Page;
