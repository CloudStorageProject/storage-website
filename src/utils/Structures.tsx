export  const FileType = {
    IMAGE:"IMAGE",
    AUDIO:"AUDIO",
    TEXT:"TEXT",
    DOCUMENT:"DOCUMENT",
    VIDEO:"VIDEO",
}

export function determineFileFormat(file: File) {
    const extension = file.name.split('.').pop()?.toLowerCase();
    return extension;
}

export function determineFileType(file: File) {
    const extension = file.name.split('.').pop()?.toLowerCase();
    switch (extension) {
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':{
            return FileType.IMAGE;
        }
        case 'mp3':
        case 'wav':{
            return FileType.AUDIO;
        }
        case 'pdf':
        case 'doc':
        case 'docx':{
            return FileType.DOCUMENT;
        }
        case 'mp4':
        case 'avi':{
            return FileType.VIDEO;
        }
        default:{
            return FileType.TEXT;
        }
    }
}

export class FileStructure {
    folder_id: number;
    file_id: number;
    name: string;
    type: typeof FileType;
    format: string;
    encrypted_key: string;
    encrypted_iv: string;
    content: string;

    constructor( folder_id: number,file_id  : number, name: string, type: typeof FileType, format: string, encrypted_key: string, encrypted_iv: string, content: string) {
        this.folder_id = folder_id;
        this.file_id = file_id;
        this.name = name;
        this.type = type;
        this.format = format;
        this.encrypted_key = encrypted_key;
        this.encrypted_iv = encrypted_iv;
        this.content = content;
    }
}

export  class FolderStructure {
    name: string;
    id: number;
    folders: Array<FolderStructure>;
    files: Array<FileStructure>;

    constructor(name: string, id: number, folders: Array<FolderStructure>, files: Array<FileStructure>) {
        this.name = name;
        this.id = id;
        this.folders = folders;
        this.files = files;        
    }
}

export class UserStructure {
    id: number;
    username: string;
    password: string;
    public_key: string;

    constructor( id: number, username: string, password: string, public_key: string) {
        this.username = username;
        this.password = password;
        this.id = id;
        this.public_key = public_key;
    }
}
