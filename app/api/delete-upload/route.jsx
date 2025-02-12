import { prismaDB } from "@/lib/prismaDB";

export async function POST(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { pdf } = req.body;
  const deletedPdf = await prismaDB.pdfDetails.delete({ where: { id: pdf } });

  if (!deletedPdf) return res.status(404).json({ error: "File not found." });

  res.status(200).json({ success: true, message: "File deleted successfully." });
}
