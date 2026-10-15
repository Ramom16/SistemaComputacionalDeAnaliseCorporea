import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function createMulter({
  folder = "images",
  allowedTypes = ["image/jpeg", "image/png", "image/webp"],
  fileSize = 10 * 1024 * 1024, // 10 MB
} = {}) {
  const uploadDir = path.resolve(__dirname, "..", "uploads", folder);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const extensao = path.extname(file.originalname).toLowerCase();
      const nomeUnico = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${extensao}`;
      cb(null, nomeUnico);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Tipo de arquivo não permitido. Tipos aceitos: ${allowedTypes.join(", ")}`), false);
    }
  };

  return multer({
    storage,
    limits: { fileSize },
    fileFilter,
  });
}
