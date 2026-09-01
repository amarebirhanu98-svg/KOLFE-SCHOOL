const menuButton = document.getElementById("menuButton");
const sidebar = document.getElementById("sidebar");

const pageTitle = document.getElementById("pageTitle");

const navLinks = document.querySelectorAll(".nav-link");


// Mobile sidebar
menuButton.addEventListener("click", function () {

    sidebar.classList.toggle("show");

});


// Navigation
navLinks.forEach(function (link) {

    link.addEventListener("click", function (event) {

        event.preventDefault();

        navLinks.forEach(function (item) {
            item.classList.remove("active");
        });

        this.classList.add("active");

        const page = this.dataset.page;

        const titles = {
            dashboard: "Student Dashboard",
            profile: "My Profile",
            classes: "My Classes",
            timetable: "Timetable",
            assignments: "Assignments",
            grades: "Results & Grades",
            attendance: "Attendance",
            fees: "Fees & Payments",
            announcements: "Announcements",
            notifications: "Notifications"
        };

        pageTitle.textContent = titles[page];

        sidebar.classList.remove("show");

    });

});


// Logout
const logoutButton = document.getElementById("logoutButton");

logoutButton.addEventListener("click", function () {

    const confirmed = confirm(
        "Are you sure you want to logout?"
    );

    if (confirmed) {

        window.location.href = "login.html";

    }

});