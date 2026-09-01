// ==========================================
// A.KOLFE SCHOOL
// ADMIN AUTHENTICATION GUARD
// ==========================================

(function () {

    const isLoggedIn =
        sessionStorage.getItem(
            "kolfeLoggedIn"
        );

    const userData =
        sessionStorage.getItem(
            "kolfeUser"
        );


    // Not logged in
    if (
        isLoggedIn !== "true" ||
        !userData
    ) {

        window.location.replace(
            "login.html"
        );

        return;

    }


    // Check user role
    try {

        const user =
            JSON.parse(userData);


        // Only administrators can
        // access admin pages

        if (
            user.role !== "admin"
        ) {

            window.location.replace(
                "student-dashboard.html"
            );

        }

    } catch (error) {

        sessionStorage.removeItem(
            "kolfeLoggedIn"
        );

        sessionStorage.removeItem(
            "kolfeUser"
        );


        window.location.replace(
            "login.html"
        );

    }

})();