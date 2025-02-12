import { NextResponse } from "next/server";
import { DocumentProcessorServiceClient } from "@google-cloud/documentai";
import { readFileSync } from "fs";
import path from "path";

// Google Document AI Configuration
const PROJECT_ID = "pdf-validator-450520"; // Replace with your actual project ID
const LOCATION = "us"; // Change to "eu" or "asia" if needed
const PROCESSOR_ID = "f164ea073eb751b2"; // Replace with your actual processor ID
const ENDPOINT = `projects/${PROJECT_ID}/locations/${LOCATION}/processors/${PROCESSOR_ID}`;

// Load Google Credentials Manually
const credentialsPath = path.join(process.cwd(), "service-account.json");
const credentials = JSON.parse(readFileSync(credentialsPath, "utf8"));

// Set up Document AI client with credentials
const client = new DocumentProcessorServiceClient({ credentials });

export async function POST(req) {
  try {
    // Read the uploaded file
    const body = await req.arrayBuffer();
    if (!body) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file buffer to Base64
    const fileBuffer = Buffer.from(body);
    const base64File = fileBuffer.toString("base64");

    // Process document with Google Document AI
    const result = await processDocumentWithAI(base64File);

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    console.error("Error while processing document:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Function to send file to Google Document AI
async function processDocumentWithAI(base64File) {
  const request = {
    name: ENDPOINT,
    rawDocument: {
      content: base64File,
      mimeType: "application/pdf", // Change based on your document type
    },
  };

  const [response] = await client.processDocument(request);
  const { document } = response;

  // Extracting the text from the processed document
  const extractedText = document.text || "No text extracted";

  return {
    message: "Document processed successfully",
    extractedText,
    entities: document.entities || [],
    pages: document.pages || [],
  };
}
