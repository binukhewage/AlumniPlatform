//This file configures multer to store uploaded files on the server with unique filenames to prevent conflicts


// import multer - middleware for handling file uploads
import multer from "multer";
import path from "path";

//configure storage setting for upload files 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  //generates a unique file name 
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, uniqueName + path.extname(file.originalname));
  },
});

//creates a multer instance with defined storage 
const upload = multer({ storage });

export default upload;