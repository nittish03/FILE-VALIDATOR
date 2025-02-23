import { NextResponse } from "next/server";
import { prismaDB } from "@/lib/prismaDB";
import cloudinary from "cloudinary";
import { DocumentProcessorServiceClient } from "@google-cloud/documentai";
import { readFileSync } from "fs";
import path from "path";

// Cloudinary Configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Google Document AI Configuration
const PROJECT_ID = "pdf-validator-450520"; // Replace with actual project ID
const LOCATION = "us"; 
const PROCESSOR_ID = "f164ea073eb751b2"; 
const ENDPOINT = `projects/${PROJECT_ID}/locations/${LOCATION}/processors/${PROCESSOR_ID}`;

// Load Google Credentials
const credentialsPath = path.join(process.cwd(), "service-account.json");
const credentials = JSON.parse(readFileSync(credentialsPath, "utf8"));

// Set up Document AI client
const client = new DocumentProcessorServiceClient({ credentials });

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const title = formData.get("title") || "Untitled";

    if (!file) {
      return NextResponse.json({ success: false, message: "No file uploaded." }, { status: 400 });
    }

    // Get MIME type dynamically
    const type = file.type.split("/")[1];

    // Convert file to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert Buffer to Base64 for Cloudinary upload
    const base64File = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.v2.uploader.upload(base64File, {
      folder: "uploads",
      resource_type: "auto",
    });

    if (!uploadResponse.secure_url) {
      return NextResponse.json(
        { success: false, message: "Cloudinary upload failed." },
        { status: 500 }
      );
    }

    // Process document with Google Document AI
    const aiResult = await processDocumentWithAI(buffer, file.type);

    // Save file details in the database
    const pdfDetails = await prismaDB.pdfDetails.create({
      data: {
        title,
        pdf: uploadResponse.secure_url,
        type: file.type,
        result: aiResult,
      },
    });

    return NextResponse.json(
      { success: true, message: "File uploaded & processed successfully!", data: pdfDetails },
      { status: 200 }
    );

  } catch (error) {
    console.error("Upload & Processing Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process document.", error: error.message },
      { status: 500 }
    );
  }
}

// Function to process the document with Google Document AI
async function processDocumentWithAI(buffer, mimeType) {
  const base64File = buffer.toString("base64");

  // Document AI request
  const request = {
    name: ENDPOINT,
    rawDocument: {
      content: base64File,
      mimeType, // Dynamic MIME type
    },
  };

  const [response] = await client.processDocument(request);
  const { document } = response;

  return {
    message: "Document processed successfully",
    extractedText: document.text || "No text extracted",
    entities: document.entities || [],
    pages: document.pages || [],
  };
}
