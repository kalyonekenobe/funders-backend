export interface CreateChatUploadedFiles {
  image?: Express.Multer.File[];
}

export interface UpdateChatUploadedFiles {
  image?: Express.Multer.File[];
}

export enum ChatRoles {
  Member = 'member',
  Moderator = 'moderator',
  Administrator = 'administrator',
}
