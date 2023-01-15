class Auth {
     // setup the class and hide the body by default
    constructor() {
        document.querySelector("body").style.display = "none";
        const auth = localStorage.getItem("token");
        this.validateAuth(auth);
    }
    // check to see if the localStorage item passed to the function is valid and set
    validateAuth(auth) {
        if (!auth) {
            window.location.replace("login.html");
        } else {
            document.querySelector("body").style.display = "block";
        }
    }
    // will remove the localStorage item and redirect to login  screen
    logOut() {
        localStorage.removeItem("token");
        window.location.replace("login.html");
    }
}