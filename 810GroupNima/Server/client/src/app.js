//Week 12 - Aurelia Authentication Slide 6
import {AuthorizeStep} from 'aurelia-auth';


//WEEK 10 - AURELIA ROUTING BASICS PP SLIDE 5
//THIS CODE BELOW IS USED IN PLACE OF THE CODE BLOCK ABOVE

export class App {
  configureRouter(config, router) {
    this.router = router;
    config.addPipelineStep('authorize', AuthorizeStep); 
    config.map([
      {
        route: ['', 'landing'],  //WEEK 11 Navigation PP SLIDE 2, updating to make landing the default route & home just another route
        moduleId: './modules/landing',
        name: 'Landing',
        auth: false
      },
      {
        route: 'home',
        moduleId: './modules/home',
        name: ' Home',
        auth: true
      },
      {
        route: 'users',
        moduleId: './modules/users',
        name: ' Users',
        auth: true 
      },
      {
        route: 'helpTickets',
        moduleId: './modules/helpTickets',
        name: ' Help Tickets',
        auth: true 
      }
    ]);
  }
}
