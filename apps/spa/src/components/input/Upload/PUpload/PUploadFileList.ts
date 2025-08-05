
export interface PUploadFileListProps {
  id: null | string;
  name: string;
  type: string;
  trash: boolean;
  file: string | File;
}

export default class PUploadFileList {
  files: Array<PUploadFileListProps>;

  constructor() {
    this.files = [];
  }

  updateFiles(updates: PUploadFileListProps[], multiple?: boolean) {
    if (true === multiple) {
      this.files = [...this.files, ...updates];
    } else {
      this.files = [
        ...this.files
          .filter((f) => null !== f.id)
          .map((f) => ({ ...f, trash: true })),
        ...updates,
      ];
    }
  }

  setFiles(files: PUploadFileListProps[]) {
    this.files = files;
  }

  setDefaultValue(defaultValue: string | any[]) {
    this.files = this._mapValue(defaultValue);
  }

  _mapValue(value: string | any[]) {
    if ( !value ) {
      return [];
    }
    if ( !Array.isArray(value) ) {
      return [{
        id: "edit-url",
        name: "edit-url",
        type: "image/*",
        trash: false,
        file: value,
      }];
    }
    return value.map((val: any) => ({
      id: val.id,
      name: val?.name || val?.label,
      type: val.mime_type,
      trash: false,
      file: val?.file || val?.image,
    }));
  }
}
