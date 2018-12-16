import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { AuthService } from 'aurelia-auth';


@inject(Router, AuthService)
export class NavBar {
    constructor(router, auth) {
        this.router = router;
        this.auth = auth;
        this.loginError = '';
        this.authenticated = false;
        this.email = "";
        this.password = "";
    }

    //this code block makes it so that when member refreshes the session is still authenticated and member is not kicked out
    bind() {
        this.isAuthenticated = this.auth.isAuthenticated();
    }

    //The attached code block makes it so the links that are clicked are highlighted 'home', 'members',
    //'helpTickets'.
    attached() {
        $('.navbar-nav a').on('click', function () {
            $('.navbar-nav').find('li.active').removeClass('active');
            $(this).parent('li').addClass('active');
        });
    }

    login() {
        return this.auth.login(this.email, this.password)
            .then(response => {
                this.memberObj = response.member;
                sessionStorage.setItem("memberObj", JSON.stringify(this.memberObj));
                this.loginError = "";
                this.isAuthenticated = this.auth.isAuthenticated();
                this.router.navigate('home');
            })
            .catch(error => {
                console.log(error);
                this.authenticated = false;
                this.loginError = "Invalid credentials.";
            });
    };

    logout() {
        if (this.memberObj) this.auth.logout(this.memberObj.email);
        sessionStorage.removeItem('member');
        this.isAuthenticated = this.auth.isAuthenticated();
        this.auth.logout();
    }

}

