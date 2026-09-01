// ==========================================
// A.KOLFE SECONDARY SCHOOL
// SETTINGS MANAGEMENT
// ==========================================


// ==========================================
// DEFAULT SETTINGS
// ==========================================

const defaultSettings = {

    schoolName:
        "A.KOLFE SECONDARY SCHOOL",

    schoolCode:
        "KSS",

    schoolPhone:
        "",

    schoolEmail:
        "",

    schoolAddress:
        "Addis Ababa, Ethiopia",

    adminName:
        "AMARE BIRHANU",

    adminUsername:
        "admin",

    academicYear:
        "2019 E.C.",

    currentTerm:
        "Term 1",

    cbeAccountName:
        "A.Kolfe Secondary School",

    cbeAccountNumber:
        "",

    studentFee:
        0,

    currency:
        "ETB",

    notifications:
        true,

    autoSave:
        true

};


// ==========================================
// LOAD SETTINGS
// ==========================================

let settings =
    JSON.parse(
        localStorage.getItem(
            "kolfeSchoolSettings"
        )
    ) || {
        ...defaultSettings
    };


// ==========================================
// GET ELEMENTS
// ==========================================

const schoolName =
    document.getElementById(
        "schoolName"
    );

const schoolCode =
    document.getElementById(
        "schoolCode"
    );

const schoolPhone =
    document.getElementById(
        "schoolPhone"
    );

const schoolEmail =
    document.getElementById(
        "schoolEmail"
    );

const schoolAddress =
    document.getElementById(
        "schoolAddress"
    );


const adminName =
    document.getElementById(
        "adminName"
    );

const adminUsername =
    document.getElementById(
        "adminUsername"
    );


const academicYear =
    document.getElementById(
        "academicYear"
    );

const currentTerm =
    document.getElementById(
        "currentTerm"
    );


const cbeAccountName =
    document.getElementById(
        "cbeAccountName"
    );

const cbeAccountNumber =
    document.getElementById(
        "cbeAccountNumber"
    );

const studentFee =
    document.getElementById(
        "studentFee"
    );

const currency =
    document.getElementById(
        "currency"
    );


const notifications =
    document.getElementById(
        "notifications"
    );

const autoSave =
    document.getElementById(
        "autoSave"
    );


const saveSettingsBtn =
    document.getElementById(
        "saveSettingsBtn"
    );

const resetSettingsBtn =
    document.getElementById(
        "resetSettingsBtn"
    );


// ==========================================
// LOAD SETTINGS INTO FORM
// ==========================================

function loadSettings() {

    schoolName.value =
        settings.schoolName;

    schoolCode.value =
        settings.schoolCode;

    schoolPhone.value =
        settings.schoolPhone;

    schoolEmail.value =
        settings.schoolEmail;

    schoolAddress.value =
        settings.schoolAddress;


    adminName.value =
        settings.adminName;

    adminUsername.value =
        settings.adminUsername;


    academicYear.value =
        settings.academicYear;

    currentTerm.value =
        settings.currentTerm;


    cbeAccountName.value =
        settings.cbeAccountName;

    cbeAccountNumber.value =
        settings.cbeAccountNumber;

    studentFee.value =
        settings.studentFee;

    currency.value =
        settings.currency;


    notifications.checked =
        settings.notifications;

    autoSave.checked =
        settings.autoSave;

}


// ==========================================
// GET FORM DATA
// ==========================================

function getFormSettings() {

    return {

        schoolName:
            schoolName.value.trim(),

        schoolCode:
            schoolCode.value.trim(),

        schoolPhone:
            schoolPhone.value.trim(),

        schoolEmail:
            schoolEmail.value.trim(),

        schoolAddress:
            schoolAddress.value.trim(),


        adminName:
            adminName.value.trim(),

        adminUsername:
            adminUsername.value.trim(),


        academicYear:
            academicYear.value.trim(),

        currentTerm:
            currentTerm.value,


        cbeAccountName:
            cbeAccountName.value.trim(),

        cbeAccountNumber:
            cbeAccountNumber.value.trim(),

        studentFee:
            Number(
                studentFee.value
            ) || 0,

        currency:
            currency.value,


        notifications:
            notifications.checked,

        autoSave:
            autoSave.checked

    };

}


// ==========================================
// SAVE SETTINGS
// ==========================================

function saveSettings() {

    const newSettings =
        getFormSettings();


    // ==============================
    // VALIDATION
    // ==============================

    if (!newSettings.schoolName) {

        alert(
            "Please enter the school name."
        );

        schoolName.focus();

        return;

    }


    if (!newSettings.adminName) {

        alert(
            "Please enter the administrator name."
        );

        adminName.focus();

        return;

    }


    if (!newSettings.adminUsername) {

        alert(
            "Please enter the administrator username."
        );

        adminUsername.focus();

        return;

    }


    if (
        newSettings.studentFee < 0
    ) {

        alert(
            "Student fee cannot be negative."
        );

        studentFee.focus();

        return;

    }


    // ==============================
    // SAVE
    // ==============================

    settings =
        newSettings;


    localStorage.setItem(
        "kolfeSchoolSettings",
        JSON.stringify(
            settings
        )
    );


    showSuccessMessage(
        "Settings saved successfully."
    );


    updatePageInformation();

}


// ==========================================
// RESET SETTINGS
// ==========================================

function resetSettings() {

    const confirmed =
        confirm(

            "Reset all settings to the default values?"

        );


    if (!confirmed) {

        return;

    }


    settings = {
        ...defaultSettings
    };


    localStorage.setItem(
        "kolfeSchoolSettings",
        JSON.stringify(
            settings
        )
    );


    loadSettings();

    updatePageInformation();


    showSuccessMessage(
        "Settings have been reset."
    );

}


// ==========================================
// SUCCESS MESSAGE
// ==========================================

function showSuccessMessage(message) {

    const oldMessage =
        document.querySelector(
            ".success-message"
        );


    if (oldMessage) {

        oldMessage.remove();

    }


    const messageBox =
        document.createElement(
            "div"
        );


    messageBox.className =
        "success-message";


    messageBox.textContent =
        "✓ " + message;


    document.body.appendChild(
        messageBox
    );


    setTimeout(
        function() {

            if (
                messageBox.parentNode
            ) {

                messageBox.remove();

            }

        },
        3000
    );

}


// ==========================================
// UPDATE PAGE INFORMATION
// ==========================================

function updatePageInformation() {

    // Update browser title

    document.title =
        settings.schoolName +
        " | Settings";


    // Update topbar administrator

    const adminStrong =
        document.querySelector(
            ".admin strong"
        );


    if (adminStrong) {

        adminStrong.textContent =
            settings.adminName;

    }


    // Update school brand

    const brandStrong =
        document.querySelector(
            ".brand strong"
        );


    if (brandStrong) {

        brandStrong.textContent =
            settings.schoolName;

    }


    // Update logo initials

    const avatar =
        document.querySelector(
            ".avatar"
        );


    if (avatar) {

        avatar.textContent =
            getInitials(
                settings.adminName
            );

    }

}


// ==========================================
// GET INITIALS
// ==========================================

function getInitials(name) {

    const words =
        name
            .trim()
            .split(/\s+/);


    if (!words.length) {

        return "AD";

    }


    if (words.length === 1) {

        return words[0]
            .substring(0, 2)
            .toUpperCase();

    }


    return (

        words[0][0] +
        words[1][0]

    ).toUpperCase();

}


// ==========================================
// SAVE BUTTON
// ==========================================

saveSettingsBtn.addEventListener(
    "click",
    saveSettings
);


// ==========================================
// RESET BUTTON
// ==========================================

resetSettingsBtn.addEventListener(
    "click",
    resetSettings
);


// ==========================================
// AUTO SAVE
// ==========================================

const allInputs =
    document.querySelectorAll(
        "input, select"
    );


allInputs.forEach(
    function(input) {

        input.addEventListener(
            "change",
            function() {

                if (
                    autoSave.checked
                ) {

                    settings =
                        getFormSettings();


                    localStorage.setItem(
                        "kolfeSchoolSettings",
                        JSON.stringify(
                            settings
                        )
                    );

                }

            }
        );

    }
);


// ==========================================
// LOAD SETTINGS
// ==========================================

loadSettings();

updatePageInformation();


// ==========================================
// CONSOLE MESSAGE
// ==========================================

console.log(
    "A.Kolfe Settings module loaded successfully."
);

