import type MockAdapter from "axios-mock-adapter";
import {Mocker} from "@/classes/mocker";

class MediaMock {
    mock(mocker: MockAdapter, appMocker: Mocker) {
        mocker.onGet("/api/media/newfolder").reply((request) => {
            let name   = request.params.name;
            let params = {name : name};

            return [200, params];
        });

        mocker.onGet("/api/media/open").reply((request) => {
            let params = request.params;
            let id = params.id;

            if( ! id){
                return [200, {files: appMocker.homeMock.getMediaFiles(), path: {}}];
            } else if([12,13,14,15,16,17,18,19].includes(id)) {
                let mediaFiles = [
                    {id: 16, name: 'Subsubfolder', isDir: true},
                    {id: 17, name: 'Subsubfolder', isDir: true},
                    {id: 18, name: 'Subsubfolder', isDir: true},
                    {id: 19, name: 'Subsubfolder', isDir: true},
                ];

                return [200, {files: mediaFiles, path: {1: 'Folder', 12: 'Subfolder'}}];
            } else {
                let mediaFiles = [
                    {id: 12, name: 'Subfolder', isDir: true},
                    {id: 13, name: 'Subfolder', isDir: true},
                    {id: 14, name: 'Subfolder', isDir: true},
                    {id: 15, name: 'Subfolder', isDir: true},
                ];

                return [200, {files: mediaFiles, path: {1: 'Folder'}}];
            }
        });
    }
}

export default new MediaMock();