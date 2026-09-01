const menuButton = document.getElementById("menuButton");
const sidebar = document.getElementById("sidebar");


// Mobile menu

menuButton.addEventListener("click", function () {

    sidebar.classList.toggle("show");

});


// Sidebar navigation

const navLinks = document.querySelectorAll("nav a");

navLinks.forEach(function (link) {

    link.addEventListener("click", function () {

        navLinks.forEach(function (item) {
            item.classList.remove("active");
        });

        this.classList.add("active");

        sidebar.classList.remove("show");

    });

});


// Quick action buttons

const quickButtons = document.querySelectorAll(".quick-actions button");

quickButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        alert(
            "This teacher tool will be connected to the school system later."
        );

    });

});


// Logout

const logoutButton = document.getElementById("logoutButton");

logoutButton.addEventListener("click", function () {

    const confirmLogout = confirm(
        "Are you sure you want to logout?"
    );

    if (confirmLogout) {

        window.location.href = "login.html";

    }

});