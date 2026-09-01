// ==========================================
// A.KOLFE SCHOOL
// SHARED LOGOUT
// ==========================================

(function () {

    const logoutLinks =
        document.querySelectorAll(
            ".logout-link"
        );


    logoutLinks.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();


                    const confirmed =
                        confirm(
                            "Are you sure you want to logout?"
                        );


                    if (!confirmed) {

                        return;

                    }


                    // Clear login session

                    sessionStorage.removeItem(
                        "kolfeLoggedIn"
                    );

                    sessionStorage.removeItem(
                        "kolfeUser"
                    );


                    // Go to login

                    window.location.replace(
                        "login.html"
                    );

                }
            );

        }
    );

})();