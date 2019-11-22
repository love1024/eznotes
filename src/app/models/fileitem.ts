export interface IFile {
  fileId: number;

  userEmail: string;

  originalName: string;

  originalSize: number;

  videoFileName: string;

  audioFileName: string;

  text: string;

  createdAt: Date | string;

  editedAt: Date | string;

  isNew: boolean;
}
