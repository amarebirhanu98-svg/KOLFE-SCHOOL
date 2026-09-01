// ========================================
// A.KOLFE SECONDARY SCHOOL
// ADMIN DASHBOARD JAVASCRIPT
// ========================================


// ----------------------------------------
// MOBILE SIDEBAR
// ----------------------------------------

const menuButton = document.getElementById("menuButton");
const sidebar = document.querySelector(".sidebar");

if (menuButton && sidebar) {

    menuButton.addEventListener("click", function () {

        sidebar.classList.toggle("show");

    });

}


// ----------------------------------------
// SIDEBAR NAVIGATION
// ----------------------------------------

const navLinks =
    document.querySelectorAll(".sidebar-menu a");

navLinks.forEach(function (link) {

    link.addEventListener("click", function () {

        // Close mobile sidebar.
        // Do NOT prevent the normal link navigation.

        if (sidebar) {
            sidebar.classList.remove("show");
        }

    });

});


// ----------------------------------------
// QUICK ACTIONS
// ----------------------------------------

const quickButtons =
    document.querySelectorAll(".quick-actions button");


quickButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const action =
            this.dataset.action;


        if (action === "student") {

            window.location.href =
                "students.html";

        }


        else if (action === "teacher") {

            window.location.href =
                "teachers.html";

        }


        else if (action === "class") {

            window.location.href =
                "classes.html";

        }


        else if (action === "announcement") {

            window.location.href =
                "announcements.html";

        }

    });

});


// ----------------------------------------
// LOGOUT
// ----------------------------------------

const logoutButton =
    document.querySelector(".logout");


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function (event) {

            const confirmLogout =
                window.confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmLogout) {

                event.preventDefault();

            }

        }
    );

}