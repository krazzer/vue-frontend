import type MockAdapter from "axios-mock-adapter";
import {Mocker} from "@/classes/mocker";

class MediaMock {
    appMocker: Mocker;
    subFolderIds: Array<number>;

    mock(mocker: MockAdapter, appMocker: Mocker) {
        this.appMocker    = appMocker;
        this.subFolderIds = [12, 13, 14, 15, 16, 17, 18, 19];

        mocker.onGet("/api/media/newfolder").reply((request) => {
            let name   = request.params.name;
            let params = {name: name};

            return [200, params];
        });

        mocker.onGet("/api/media/open").reply((request) => {
            let params = request.params;
            let id     = params.id;

            let mediaFiles = this.getFilesById(id);
            let path       = this.getPathById(id);

            return [200, {files: mediaFiles, path: path}];
        });

        mocker.onGet("/api/media/paste").reply((request) => {
            let params     = request.params;
            let ids        = params.ids;
            let folderId   = params.folder;
            let mediaFiles = this.getFilesById(folderId);
            let path       = this.getPathById(folderId);

            ids.forEach((id: number) => {
                mediaFiles.push({id: id, name: 'Some pasted folder', isDir: true});
            });

            return [200, {files: mediaFiles, path: path}];
        });

        mocker.onGet("/api/media/key").reply((request) => {
            let params   = request.params;
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