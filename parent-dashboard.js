const menuButton = document.getElementById("menuButton");
const sidebar = document.getElementById("sidebar");


// Mobile menu

menuButton.addEventListener("click", function () {

    sidebar.classList.toggle("show");

});


// Close mobile menu when a link is clicked

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


// Child selector

const childSelect = document.getElementById("childSelect");

childSelect.addEventListener("change", function () {

    alert(
        "Student selected: " + this.value
    );

});


// Payment button

const payButton = document.getElementById("payButton");

payButton.addEventListener("click", function () {

    alert(
        "Payment system will be connected later to CBE, Telebirr, Nib, Awash, Abissinia and M-Pesa."
    );

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