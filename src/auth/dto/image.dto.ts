import { FileSystemStoredFile, HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from "nestjs-form-data";

export class ImgDto {

    // @IsFile()
    // @MaxFileSize(1e6)
    // @HasMimeType(['image/jpeg', 'image/png'])
    image: FileSystemStoredFile
    
  }