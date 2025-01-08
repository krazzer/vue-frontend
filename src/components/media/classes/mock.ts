import type MockAdapter from "axios-mock-adapter";
import {Mocker} from "@/classes/mocker";

class MediaMock {
    appMocker: Mocker;
    subFolderIds: Array<number>;

    mock(mocker: MockAdapter, appMocker: Mocker) {
        this.appMocker    = appMocker;
        this.subFolderIds = [12, 13, 14, 15, 16, 17, 18, 19];

        /**
         * Mocks the media upload.
         * To test a real upload use this code:
         * const xhr = new XMLHttpRequest();
         * xhr.upload.addEventListener("progress", uploadProgressEvent);
         * xhr.open("POST", "https://kiksaus.nl/test/uploadtest.php");
         * xhr.send(formData);
         */
        mocker.onPost("/api/media/upload").reply(async (request: any) => {
            const totalSize        = request.totalBytes;
            const step             = request.totalBytes / 20;
            const progressInterval = 100;

            let uploadedSize = 0;
            let folderId     = null;
            let files        = <any>[];

            request.data.forEach((value: any, key: any) => {
                if (key === "folder") {
                    folderId = value == 'null' ? null : parseInt(value);
                }
                if (key === "file") {
                    files.push(value);
                }
            });

            let mediaFiles = <any>[];
            let path       = {};

            if (folderId) {
                mediaFiles = this.getFilesById(folderId);
                path       = this.getPathById(folderId);
            }

            let newId = 100;

            files.forEach((file: any) => {
                mediaFiles.push({id: newId++, name: file.name, thumb: '/cms/src/assets/images/example-image-1.jpg'});
            });

            return new Promise((resolve) => {
                const intervalId = setInterval(() => {
                    uploadedSize += step;

                    if (request.onUploadProgress) {
                        request.onUploadProgress({loaded: uploadedSize, total: totalSize});
                    }

                    if (uploadedSize >= totalSize) {
                        clearInterval(intervalId);
                        resolve([200, {files: mediaFiles, path: path}]);
                    }
                }, progressInterval);
            });
        });

        mocker.onPost("/api/media/newfolder").reply((request) => {
            let params     = JSON.parse(request.data).params;
            let name       = params.name;
            let folderId   = params.folder;
            let mediaFiles = this.getFilesById(folderId);
            let path       = this.getPathById(folderId);

            mediaFiles.push({id: 100, name: name, isDir: true});

            return [200, {files: mediaFiles, path: path}];
        });

        mocker.onPost("/api/media/open").reply((request) => {
            let params = JSON.parse(request.data).params;
            let id     = params.id;

            let mediaFiles = this.getFilesById(id);
            let path       = this.getPathById(id);

            return [200, {files: mediaFiles, path: path}];
        });

        mocker.onPost("/api/media/paste").reply((request) => {
            let params     = JSON.parse(request.data).params;
            let ids        = params.ids;
            let folderId   = params.folder;
            let mediaFiles = this.getFilesById(folderId);
            let path       = this.getPathById(folderId);

            ids.forEach((id: number) => {
                mediaFiles.push({id: id, name: 'Some pasted folder', isDir: true});
            });

            return [200, {files: mediaFiles, path: path}];
        });

        mocker.onPost("/api/media/delete").reply((request) => {
            let params     = JSON.parse(request.data).params;
            let ids        = params.ids;
            let folderId   = params.folder;
            let mediaFiles = this.getFilesById(folderId);
            let path       = this.getPathById(folderId);

            ids.forEach((id: number) => {
                let index = this.getIndexById(id, mediaFiles);

                if (index) {
                    mediaFiles.splice(index, 1);
                }
            });

            return [200, {files: mediaFiles, path: path}];
        });

        mocker.onPost("/api/media/key").reply((request) => {
            let params   = JSON.parse(request.data).params;
            let folderId = params.folder;
            let id       = params.id;
            let name     = params.name;

            let mediaFiles = this.getFilesById(folderId);
            let path       = this.getPathById(folderId);
            let index      = this.getIndexById(id, mediaFiles);

            if (index) {
                let file = mediaFiles[index];
                file.key = name;

                mediaFiles[index] = file;
            }

            return [200, {files: mediaFiles, path: path}];
        });

        mocker.onPost("/api/media/search").reply((request) => {
            let params     = JSON.parse(request.data).params;
            let search     = params.search;
            let mediaFiles = [{id: 1, name: search, isDir: true}];

            return [200, {files: mediaFiles, path: []}];
        });
    }

    /**
     * @param id
     */
    getFilesById(id: number): Array<any> {
        if (!id) {
            return this.appMocker.homeMock.getMediaFiles();
        } else if (this.subFolderIds.includes(id)) {
            return [
                {id: 16, name: 'Subsubfolder', isDir: true},
                {id: 17, name: 'Subsubfolder', isDir: true},
                {id: 18, name: 'Subsubfolder', isDir: true},
                {id: 19, name: 'Subsubfolder', isDir: true},
            ];
        } else {
            return [
                {id: 13, name: 'Subfolder', isDir: true},
                {id: 14, name: 'Subfolder', isDir: true},
                {id: 15, name: 'Subfolder', isDir: true},
            ];
        }
    }

    /**
     * @param id
     */
    getPathById(id: number): object {
        if (!id) {
            return {};
        } else if (this.subFolderIds.includes(id)) {
            return {1: 'Folder', 12: 'Subfolder'};
        } else {
            return {1: 'Folder'};
        }
    }

    /**
     * @param id
     * @param files
     */
    getIndexById(id: number, files: Array<any>): null | number {
        let index = null;

        files.forEach((file, i) => {
            if (file.id == id) {
                index = i;
            }
        });

        return index;
    }
}

export default new MediaMock();