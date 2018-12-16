import { inject } from 'aurelia-framework';
import { DataServices } from './data-services';
@inject(DataServices)

export class TaskManager {
    constructor(data) {
        this.data = data;
        this.TASK_MANAGER_SERVICE = 'taskManagers';    // THIS PART DOES THE "/HELPTICKET" IN THE URL
        this.TASK_MANAGER_TASK_SERVICE = 'taskManagerTasks';
    }

    async getTaskManagers(memberObj) {
        let url = this.TASK_MANAGER_SERVICE;
        if (memberObj.role == 'member') {
            url += '/member/' + memberObj._id;
        }
        let response = await this.data.get(url);
        if (!response.error) {
            this.taskManagersArray = response;
        } else {
            this.taskManagersArray = [];
        }
    }

    async getTaskManagersTasks(id) {
        let url = this.TASK_MANAGER_TASK_SERVICE + "/taskManager/" + id ;
        let response = await this.data.get(url);
        if (!response.error) {
            this.taskManagersTaskArray = response;
        } else {
            this.taskManagersTaskArray = [];
        }
    }

    async saveTaskManager(taskManager) {
        let serverResponse;
        if (taskManager) {
            if (taskManager.taskManager._id) {
                serverResponse = await this.data.put(taskManager, this.TASK_MANAGER_SERVICE);
            } else {
                serverResponse = await this.data.post(taskManager, this.TASK_MANAGER_SERVICE);
            }
            return serverResponse;
        }
    }
    async delete(taskManager) {
        if (taskManager && taskManager._id) {
            await this.data.delete(this.TASK_MANAGER_SERVICE + '/' + taskManager._id)
        }
    }

    async uploadFile(files, id) {
            await this.data.uploadFiles(files, this.TASK_MANAGER_TASK_SERVICE + "/upload/" + id);

    }

}
