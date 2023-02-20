import { Injectable } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/compat/storage";

export class FileUpload {
    key!: string;
    name!: string;
    url!: string;
    file: File;
    constructor(file: File) {
      this.file = file;
    }
  }
@Injectable({
  providedIn: "root",
})
export class ImageUploadService {
  private basePath = "/uploads";
  constructor(
    private storage: AngularFireStorage,
  ) {}

  uploadFile(fileUpload: FileUpload): Promise<any> {
    return new Promise((resolve, reject) => {
      const filePath = `${this.basePath}/${fileUpload.file.name}`;
      const storageRef = this.storage.ref(filePath);
      const uploadTask = this.storage.upload(filePath, fileUpload.file);
      uploadTask.then(() => {
        const url = storageRef.getDownloadURL().toPromise();
        resolve(url);
      });
    });
  }

  saveToDatabase(memePayload: any) {
    
  }

}
