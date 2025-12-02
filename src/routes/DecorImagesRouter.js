import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const decorImagesPath = path.join(process.cwd(), "public/images/decor");
    if (!fs.existsSync(decorImagesPath)) {
      fs.mkdirSync(decorImagesPath, { recursive: true });
    }
    cb(null, decorImagesPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten archivos de imagen"), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// In-memory storage for decoration images (in production, use MongoDB)
let decorImages = [
  {
    _id: "1",
    name: "Decoración 1",
    url: "/images/decor/decor1.jpg"
  },
  {
    _id: "2", 
    name: "Decoración 2",
    url: "/images/decor/image-1764273632106-240830930.jpg"
  },
  {
    _id: "3",
    name: "Decoración 3",
    url: "/images/decor/decor3.jpg"
  },
  {
    _id: "4",
    name: "Decoración 4",
    url: "/images/decor/decor4.jpg"
  },
  {
    _id: "5",
    name: "Decoración 5",
    url: "/images/decor/decor5.jpg"
  },
  {
    _id: "6",
    name: "Decoración 6",
    url: "/images/decor/decor6.jpg"
  }
];

// Button text storage
let buttonText = { text: "Página de decoración" };

// GET button text
router.get("/button", (req, res) => {
  try {
    res.json({ status: "success", payload: buttonText });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// PUT update button text
router.put("/button", (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ status: "error", message: "El texto es requerido" });
    }
    buttonText.text = text.trim();
    res.json({ status: "success", payload: buttonText });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// GET all decoration images
router.get("/", (req, res) => {
  try {
    res.json({ status: "success", payload: decorImages });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// POST new decoration image
router.post("/", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: "error", message: "No se proporcionó ninguna imagen" });
    }

    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ status: "error", message: "El nombre es requerido" });
    }

    const newImage = {
      _id: Date.now().toString(),
      name: name.trim(),
      url: `/images/decor/${req.file.filename}`
    };

    decorImages.push(newImage);
    res.json({ status: "success", payload: newImage });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// PUT update decoration image name
router.put("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ status: "error", message: "El nombre es requerido" });
    }

    const imageIndex = decorImages.findIndex(img => img._id === id);
    if (imageIndex === -1) {
      return res.status(404).json({ status: "error", message: "Imagen no encontrada" });
    }

    decorImages[imageIndex].name = name.trim();
    res.json({ status: "success", payload: decorImages[imageIndex] });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// DELETE decoration image
router.delete("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const imageIndex = decorImages.findIndex(img => img._id === id);
    
    if (imageIndex === -1) {
      return res.status(404).json({ status: "error", message: "Imagen no encontrada" });
    }

    const imageToDelete = decorImages[imageIndex];
    
    // Try to delete the file from filesystem
    try {
      const filename = imageToDelete.url.split("/").pop();
      const filePath = path.join(process.cwd(), "public/images/decor", filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (fileError) {
      console.log("Error deleting file:", fileError.message);
    }

    decorImages.splice(imageIndex, 1);
    res.json({ status: "success", message: "Imagen eliminada exitosamente" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

export default router;
