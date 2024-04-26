import { Client, Databases, Account, Avatars, Storage } from "appwrite";
export const appWriteConfig = {
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  url: import.meta.env.VITE_APPWRITE_URL,
  storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  postsColectionId: import.meta.env.VITE_APPWRITE_POSTS_COLECTION_ID,
  usersColectionId: import.meta.env.VITE_APPWRITE_USERS_COLECTION_ID,
  savesColectionId: import.meta.env.VITE_APPWRITE_SAVES_COLECTION_ID,
};
export const client = new Client();
client.setProject(appWriteConfig.projectId);
client.setEndpoint(appWriteConfig.url);
export const account = new Account(client);
export const databases = new Databases(client);
export const avatars = new Avatars(client);
export const storage = new Storage(client);
