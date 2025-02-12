'use client'
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function Report() {
    const searchParams = useSearchParams();
    const validity = searchParams.get('validity');

    const [resultArray, setResultArray] = useState([]);

    useEffect(() => {
        if (validity) {
            setResultArray(validity.split("**"));
        }
    }, [validity]);

    return (
        <div className='w-full h-[85vh] max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg overflow-x-scroll'>
            <h1 className="text-2xl font-bold text-gray-800 mb-5">Report</h1>

            {resultArray.length > 0 ? (
                resultArray.map((item, index) => {
                    const parts = item.split(":");
                    return (
                        <div className='flex items-center flex-col gap-x-2 p-3 bg-gray-100 rounded-md mb-2 gap-4' key={index}>
                            <h2 className="text-lg font-semibold text-gray-700">{index + 1}. {parts[0] || "N/A"}</h2>
                        </div>
                    );
                })
            ) : (
                <p className="text-gray-500">No report data available.</p>
            )}
        </div>
    );
}
