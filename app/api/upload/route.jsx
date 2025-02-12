import { NextResponse } from 'next/server';
import { prismaDB } from '@/lib/prismaDB';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req) {
  try {
    // Parse FormData from the request
    const formData = await req.formData();
    const file = formData.get("file");
    const title = formData.get("title") || "Untitled";

    if (!file) {
      return NextResponse.json({ success: false, message: "No file uploaded." }, { status: 400 });
    }

    // Convert file to a Buffer and save it
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public/uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, file.name);
    await fs.writeFile(filePath, buffer);

    // Send file to Document AI API
//     const response = await fetch('http://localhost:3000/api/documentAi', {
//       method: "POST",
// body:file

//     });

//     if (!response.ok) {
//       return NextResponse.json(
//         { success: false, message: "Document AI processing failed" },
//         { status: response.status }
//       );
//     }

//     const result = await response.json(); // Assuming the API returns JSON

    // Save file details in the database
    const pdfDetails = await prismaDB.pdfDetails.create({
      data: { title, pdf: file.name, type: file.type },
    });

    return NextResponse.json(
      { success: true, message: "File uploaded successfully!", data: pdfDetails },
      { status: 200 }
    );

  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process document.", error: error.message },
      { status: 500 }
    );
  }
}
