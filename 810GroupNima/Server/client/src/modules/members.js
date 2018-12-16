import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Member } from '../resources/data/member-object';

@inject(Router, Member)

export class Members {
  constructor(router, members) {
    this.router = router;
    this.members = members;
    this.message = 'Members';
    this.showMemberEditForm = false;
  }

  async activate() {
    await this.getMembers();
  }


  attached() {
    feather.replace()
  }


  async getMembers() {
    await this.members.getMembers();
  }


  newMember() {
    this.member = {
      firstName: "",
      lastName: "",
      allocated: true,
      role: "none",
      email: "",
      password: ""
    }
    this.openEditForm();
  }


  editMember(member) {
    this.member = member;
    this.openEditForm();
  }

  openEditForm() {
    this.showMemberEditForm = true;
    setTimeout(() => { $("#firstName").focus(); }, 500);
  }

  changeActive(member) {
    this.member = member;
    this.save();
  }


  async save() {
    if (this.member && this.member.firstName && this.member.lastName
      && this.member.email && this.member.password)
      await this.members.saveMember(this.member);
    await this.getMembers();
    this.back();
  }

  async delete() {
    if (this.member) {
      await this.members.delete(this.member);
      await this.getMembers();
      this.back();
    }
  }



  back() {
    this.showMemberEditForm = false;
  }

}





