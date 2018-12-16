import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { TaskManager } from '../resources/data/task-manager-object';

@inject(Router, TaskManager)



export class TaskManagers {
    constructor(router, taskManager) {
        this.router = router;
        this.taskManagers = taskManager;
        this.showTaskManagerEditForm = false;
        this.memberObj = JSON.parse(sessionStorage.getItem('memberObj'));
    }


    async activate() {
        this.taskManagers.getTaskManagers(this.memberObj);
    }
    attached() {
        feather.replace()
    }

    showEditForm() {
        this.showTaskManagerEditForm = true;
        setTimeout(() => { $("#firstName").focus(); }, 500);
    }

    back() {
        this.showTaskManagerEditForm = false;
        this.showTaskManagerDisplayForm = false;
        this.filesToUpload = new Array();
        this.files = new Array();

    }

    changeFiles() {
        this.filesToUpload = this.filesToUpload ? this.filesToUpload : new Array();
        for (var i = 0; i < this.files.length; i++) {
            let addFile = true;
            this.filesToUpload.forEach(item => {
                if (item.name === this.files[i].name) addFile = false;
            })
            if (addFile) this.filesToUpload.push(this.files[i]);
        }
    }


    async getTaskManagers() {
        await this.taskManagers.getTaskManagers(this.memberObj);
    }

    newTaskManager() {
        this.taskManager = {
            title: "",
            personId: this.memberObj._id,
            ownerId: "a1a1a1a1a1a1a1a1a1a1a1a1",
            status: 'new'
        };

        this.taskManagerTask = {
            personId: this.memberObj._id,
            task: ""
        };
        this.showEditForm();
    }


    async editTaskManager(taskManager) {
        this.taskManager = taskManager;
        this.taskManagerTask = {
            personId: this.memberObj._id,
            task: ""
        };
        await this.taskMangers.getTaskManagersTasks(taskManager._id)
        this.showEditForm();
    }


    async save() {
        if (this.taskManager && this.taskManager.title && this.taskManagerTask && this.taskManagerTask.task) {
            if (this.memberObj.role === 'manager' || this.memberObj.role === 'analyst' ) {
                this.taskManager.ownerId = this.memberObj._id;
            }
            let taskManager = { taskManager: this.taskManager, task: this.taskManagerTask }
            let serverResponse = await this.taskManagers.saveTaskManager(taskManager);
            if (this.filesToUpload && this.filesToUpload.length > 0) this.taskManagers.uploadFile(this.filesToUpload,
                sponse.taskID);
            await this.getTaskManagers();
            this.back();
        }
    }


    async delete() {
        if (this.taskManager) {
            await this.taskManagers.delete(this.taskManager);
            await this.getTaskManagers();
            this.back();
        }
    }

}
