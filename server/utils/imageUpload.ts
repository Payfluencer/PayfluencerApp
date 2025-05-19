import 'dotenv/config'
import path from 'path'
import multer from 'multer'
import fs from 'fs/promises'
import { Logger } from 'borgen'

// Set up multer storage
const storage = multer.memoryStorage()

// Set up multer upload
const upload = multer({
  storage,
  fileFilter: (_, file, cb) => {
    const fileTypes = /jpeg|jpg|png/
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase(),
    )
    const mimetype = fileTypes.test(file.mimetype)

    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error('Only images are allowed (jpg, jpeg, png)'))
    }
  },
})

// Middleware for handling image upload and processing
export const uploadImage = upload.single('image')

// Middleware for handling multiple image uploads and processing
export const uploadImages = upload.array('images', 2)

// Set up multer for pdf upload
const pdfStorage = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_, file, cb) => {
    const fileTypes = /pdf/
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase(),
    )
    const mimetype = fileTypes.test(file.mimetype)

    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error('Only pdf files are allowed'))
    }
  },
})

// Middleware for handling pdf upload
export const uploadPdf = pdfStorage.single('file')

// Function to check if directory exists and create if it doesn't we create one
export const checkAndCreateDirectory = async (
  directoryPath: string,
): Promise<void> => {
  try {
    await fs.access(directoryPath, fs.constants.F_OK | fs.constants.R_OK)
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // Directory does not exist
      await fs.mkdir(directoryPath, { recursive: true })
    } else {
      // Directory exists, but we don't have permission
      Logger.error({ message: 'Error checking directory' + error })
      throw new Error('No permission to access directory')
    }
  }
}
