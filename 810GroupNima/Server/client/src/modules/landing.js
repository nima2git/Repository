import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';

@inject(Router)

export class Landing {
    constructor(router){
        this.router = router;
        this.email = "";
        this.password = "";
        this.authenticated = false;
    }

}