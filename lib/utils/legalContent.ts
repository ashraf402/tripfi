import fs from "fs";
import path from "path";
import type { LegalDocument } from "@/lib/types/legal";

const LEGAL_DIR = path.join(process.cwd(), "content", "legal");

export function getLegalDocument(id: string): LegalDocument {
  const filePath = path.join(LEGAL_DIR, `${id}.json`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Legal document not found: ${id}`);
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as LegalDocument;
}

export function getAllLegalDocuments(): LegalDocument[] {
  const files = fs.readdirSync(LEGAL_DIR).filter((f) => f.endsWith(".json"));

  return files.map((file) => {
    const raw = fs.readFileSync(path.join(LEGAL_DIR, file), "utf-8");
    return JSON.parse(raw) as LegalDocument;
  });
}

export function getLegalDocumentMeta(
  id: string,
): Pick<LegalDocument, "id" | "title" | "lastUpdated"> {
  const doc = getLegalDocument(id);
  return {
    id: doc.id,
    title: doc.title,
    lastUpdated: doc.lastUpdated,
  };
}
