const loginForm =
    document.getElementById(
        "loginForm"
    );


const usernameInput =
    document.getElementById(
        "username"
    );


const passwordInput =
    document.getElementById(
        "password"
    );


const errorMessage =
    document.getElementById(
        "errorMessage"
    );


const togglePassword =
    document.getElementById(
        "togglePassword"
    );


// DEMO USERS

const users = [

    {
        username: "admin",

        password: "admin123",

        role: "admin"
    },

    {
        username: "student",

        password: "student123",

        role: "student"
    }

];


// PASSWORD VISIBILITY

togglePassword.addEventListener(
    "click",
    function() {

        if (
            passwordInput.type ===
            "password"
        ) {

            passwordInput.type =
                "text";

            togglePassword.textContent =
                "🙈";

        } else {

            passwordInput.type =
                "password";

            togglePassword.textContent =
                "👁";

        }

    }
);


// LOGIN

loginForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const username =
            usernameInput.value
                .trim();


        const password =
            passwordInput.value;


        errorMessage.textContent =
            "";


        const user =
            users.find(
                account =>
                    account.username ===
                        username &&
                    account.password ===
                        password
            );


        if (!user) {

            errorMessage.textContent =
                "Invalid username or password.";

            return;
        }


        // SAVE LOGIN SESSION

        sessionStorage.setItem(
            "kolfeLoggedIn",
            "true"
        );


        sessionStorage.setItem(
            "kolfeUser",
            JSON.stringify({
                username:
                    user.username,

                role:
                    user.role
            })
        );


        // REMEMBER USER

        const remember =
            document.getElementById(
                "remember"
            ).checked;


        if (remember) {

            localStorage.setItem(
                "kolfeRememberedUser",
                user.username
            );

        }


        // REDIRECT

        if (
            user.role ===
            "admin"
        ) {

            window.location.href =
                "admin-dashboard.html";

        } else {

            window.location.href =
                "student-dashboard.html";

        }

    }
);