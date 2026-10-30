import multer from "multer";

const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];
const limiteArquivo = 8 * 1024 * 1024;
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: limiteArquivo },
  fileFilter: (req, file, callback) => {
    if (tiposPermitidos.includes(file.mimetype)) {
      callback(null, true);
      return;
    }

    callback(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
  }
}).single("image");

const uploadImage = (req, res, next) => {
  upload(req, res, (error) => {
    if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({ erro: "A imagem deve ter no máximo 8 MB." });
    }

    if (error instanceof multer.MulterError) {
      return res.status(400).json({ erro: "Envie uma imagem PNG, JPEG ou WEBP no campo image." });
    }

    if (error) return next(error);
    return next();
  });
};

export default uploadImage;