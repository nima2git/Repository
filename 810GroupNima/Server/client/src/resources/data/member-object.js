import { inject } from 'aurelia-framework';
import { DataServices } from './data-services';
@inject(DataServices)
export class Member {
    constructor(data) {
        this.data = data;
        this.MEMBER_SERVICE = 'members';    // THIS PART DOES THE "/members" IN THE URL
    }


    async saveMember(member) {
        let serverResponse;
        if (member) {
            if (member._id) {
                serverResponse = await this.data.put(member, this.MEMBER_SERVICE);
            } else {
                serverResponse = await this.data.post(user, this.MEMBER_SERVICE);
            }
            return serverResponse;
        }
    }

    async delete(member) {
        if (member && member._id) {
            await this.data.delete(this.MEMBER_SERVICE + '/' + member._id)
        }
    }



    async getMembers() {
        let response = await this.data.get(this.MEMBER_SERVICE);
        if (!response.error) {
            this.membersArray = response;
        } else {
            this.membersArray = [];
        }
    }

}







