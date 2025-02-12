import { prismaDB } from "@/lib/prismaDB";
export async function POST(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { id } = req.body;
  const pdf = await prismaDB.pdfDetails.findUnique({ where: { id } });

  if (!pdf) return res.status(404).json({ error: "Document not found" });

  res.status(200).json({ success: true, data: pdf });
}
