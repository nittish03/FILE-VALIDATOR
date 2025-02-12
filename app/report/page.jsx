'use client'
import React,{useState,useEffect} from 'react';
import { useParams } from "react-router-dom";
import { useLocation } from 'react-router-dom';

// import { OCR } from "../components/OCR";
export default function Report() {
    const location = useLocation();
    const { result} = location.state || {};
    const [resultArray,setResultArray] = useState([])
    useEffect(() => {
        if(result){
            setResultArray(result.split("**"))
        }
    },[result])

    return (
        <div className='w-full mx-auto px-2'>
            <div className="px-10">

            <h1 className="text-2xl font-bold text-gray-800 mb-5">Report...</h1>
        {
            resultArray.map((item,index) => {
                return (
                    <div className='flex mb-2' key={index}>
                        <h2>{index+1}. {item.split(":")[0]}</h2>
                        <p>{item.split(":")[1]}</p>
                    </div>
                )
            })
        }

            </div>
        </div>
    ) ;
}