export interface CreateUserUploadedFiles {
  image?: Express.Multer.File[];
}

export interface UpdateUserUploadedFiles {
  image?: Express.Multer.File[];
}

export enum Permissions {
  ManagePostComments = 1,
  ManageChats = 2,
  ManageChatMessages = 4,
  ManagePosts = 8,
  ManagePostCategories = 16,
  ManageUsers = 32,
  ManageUserBans = 64,
}

export enum UserRoles {
  User = 'User',
  Volunteer = 'Volunteer',
  Administrator = 'Administrator',
}
