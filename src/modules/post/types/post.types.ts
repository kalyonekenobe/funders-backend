export interface CreatePostUploadedFiles {
  image?: Express.Multer.File[];
  attachments?: Express.Multer.File[];
}

export interface UpdatePostUploadedFiles {
  image?: Express.Multer.File[];
  attachments?: Express.Multer.File[];
}
