import {inject} from 'aurelia-framework';

export class Home {
  constructor() {
          this.message = 'Home is where the heart is :)';
  }

  attached(){
    console.log('here')
  }

}



