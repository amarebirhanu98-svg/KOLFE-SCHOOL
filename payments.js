// ==========================================
// A.KOLFE SECONDARY SCHOOL
// FEES & PAYMENTS MANAGEMENT
// ==========================================


// ==========================================
// ELEMENTS
// ==========================================

const paymentsTableBody =
    document.getElementById(
        "paymentsTableBody"
    );

const gradeFilter =
    document.getElementById(
        "gradeFilter"
    );

const classFilter =
    document.getElementById(
        "classFilter"
    );

const searchInput =
    document.getElementById(
        "searchInput"
    );


// PAYMENT MODAL

const paymentModal =
    document.getElementById(
        "paymentModal"
    );

const addPaymentBtn =
    document.getElementById(
        "addPaymentBtn"
    );

const closePaymentModal =
    document.getElementById(
        "closePaymentModal"
    );

const cancelPaymentBtn =
    document.getElementById(
        "cancelPaymentBtn"
    );

const paymentForm =
    document.getElementById(
        "paymentForm"
    );

const studentSelect =
    document.getElementById(
        "studentSelect"
    );


// SETTINGS MODAL

const settingsModal =
    document.getElementById(
        "settingsModal"
    );

const settingsBtn =
    document.getElementById(
        "settingsBtn"
    );

const changePaymentBtn =
    document.getElementById(
        "changePaymentBtn"
    );

const closeSettingsModal =
    document.getElementById(
        "closeSettingsModal"
    );

const cancelSettingsBtn =
    document.getElementById(
        "cancelSettingsBtn"
    );

const settingsForm =
    document.getElementById(
        "settingsForm"
    );


// ==========================================
// SAMPLE STUDENTS
// ==========================================

const students = [

    {
        id: "KSS-001",
        name: "Abel Tesfaye",
        grade: "Grade 9",
        classNumber: "1"
    },

    {
        id: "KSS-002",
        name: "Bethel Alemu",
        grade: "Grade 9",
        classNumber: "1"
    },

    {
        id: "KSS-003",
        name: "Dawit Bekele",
        grade: "Grade 9",
        classNumber: "1"
    },

    {
        id: "KSS-004",
        name: "Hana Girma",
        grade: "Grade 9",
        classNumber: "1"
    },

    {
        id: "KSS-005",
        name: "Meron Abebe",
        grade: "Grade 9",
        classNumber: "2"
    },

    {
        id: "KSS-006",
        name: "Samuel Tadesse",
        grade: "Grade 10",
        classNumber: "1"
    },

    {
        id: "KSS-007",
        name: "Marta Worku",
        grade: "Grade 10",
        classNumber: "1"
    },

    {
        id: "KSS-008",
        name: "Yonas Kebede",
        grade: "Grade 10",
        classNumber: "2"
    },

    {
        id: "KSS-009",
        name: "Sara Haile",
        grade: "Grade 11",
        classNumber: "1"
    },

    {
        id: "KSS-010",
        name: "Nahom Getachew",
        grade: "Grade 11",
        classNumber: "1"
    },

    {
        id: "KSS-011",
        name: "Liya Mengistu",
        grade: "Grade 12",
        classNumber: "1"
    },

    {
        id: "KSS-012",
        name: "Henok Fikre",
        grade: "Grade 12",
        classNumber: "1"
    }

];


// ==========================================
// FEE AMOUNT
// ==========================================

const DEFAULT_FEE =
    1000;


// ==========================================
// PAYMENT DATA
// ==========================================

let payments = {};


// ==========================================
// PAYMENT SETTINGS
// ==========================================

let paymentSettings = {

    method: "CBE",

    accountName:
        "A.Kolfe Secondary School",

    accountNumber: "",

    phone: "",

    instructions:
        "Use the student's ID as the payment reference."

};


// ==========================================
// LOAD DATA
// ==========================================

function loadData() {

    try {

        const savedPayments =
            localStorage.getItem(
                "kolfePayments"
            );


        if (savedPayments) {

            payments =
                JSON.parse(
                    savedPayments
                );

        }


        const savedSettings =
            localStorage.getItem(
                "kolfePaymentSettings"
            );


        if (savedSettings) {

            paymentSettings =
                {
                    ...paymentSettings,
                    ...JSON.parse(
                        savedSettings
                    )
                };

        }

    }

    catch (error) {

        console.error(
            "Could not load payment data:",
            error
        );

    }

}


// ==========================================
// SAVE PAYMENT DATA
// ==========================================

function savePayments() {

    localStorage.setItem(

        "kolfePayments",

        JSON.stringify(
            payments
        )

    );

}


// ==========================================
// SAVE SETTINGS
// ==========================================

function savePaymentSettings() {

    localStorage.setItem(

        "kolfePaymentSettings",

        JSON.stringify(
            paymentSettings
        )

    );

}


// ==========================================
// GET STUDENT PAYMENT
// ==========================================

function getStudentPayment(
    studentId
) {

    return (

        payments[studentId] || {

            paid: 0,

            method: "",

            reference: "",

            note: ""

        }

    );

}


// ==========================================
// CALCULATE BALANCE
// ==========================================

function getBalance(
    student
) {

    const payment =
        getStudentPayment(
            student.id
        );


    return Math.max(

        DEFAULT_FEE -
        Number(payment.paid),

        0

    );

}


// ==========================================
// GET STATUS
// ==========================================

function getStatus(
    student
) {

    const payment =
        getStudentPayment(
            student.id
        );


    const paid =
        Number(payment.paid);


    if (
        paid >= DEFAULT_FEE
    ) {

        return "Paid";

    }


    if (paid > 0) {

        return "Partial";

    }


    return "Unpaid";

}


// ==========================================
// FILTER STUDENTS
// ==========================================

function getFilteredStudents() {

    const selectedGrade =
        gradeFilter.value;

    const selectedClass =
        classFilter.value;

    const search =
        searchInput.value
            .toLowerCase()
            .trim();


    return students.filter(

        function(student) {


            const gradeMatch =

                selectedGrade === "All" ||

                student.grade ===
                    selectedGrade;


            const classMatch =

                selectedClass === "All" ||

                student.classNumber ===
                    selectedClass;


            const searchMatch =

                student.name
                    .toLowerCase()
                    .includes(search)

                ||

                student.id
                    .toLowerCase()
                    .includes(search);


            return (

                gradeMatch &&
                classMatch &&
                searchMatch

            );

        }

    );

}


// ==========================================
// DISPLAY PAYMENTS
// ==========================================

function displayPayments() {

    paymentsTableBody.innerHTML =
        "";


    const filteredStudents =
        getFilteredStudents();


    if (
        filteredStudents.length === 0
    ) {

        paymentsTableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    style="
                        text-align:center;
                        padding:40px;
                    "
                >

                    No students found.

                </td>

            </tr>

        `;


        updateStatistics();

        return;

    }


    filteredStudents.forEach(

        function(student) {


            const payment =
                getStudentPayment(
                    student.id
                );


            const paid =
                Number(
                    payment.paid
                );


            const balance =
                getBalance(
                    student
                );


            const status =
                getStatus(
                    student
                );


            let statusClass =
                "status-unpaid";


            if (
                status === "Paid"
            ) {

                statusClass =
                    "status-paid";

            }

            else if (
                status === "Partial"
            ) {

                statusClass =
                    "status-partial";

            }


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>

                    <div class="student-name">

                        ${escapeHTML(
                            student.name
                        )}

                    </div>

                    <span class="student-id">

                        ${escapeHTML(
                            student.id
                        )}

                    </span>

                </td>


                <td>

                    ${escapeHTML(
                        student.grade
                    )}

                    <br>

                    <small>
                        Class ${escapeHTML(
                            student.classNumber
                        )}
                    </small>

                </td>


                <td>
                    ${formatMoney(
                        DEFAULT_FEE
                    )}
                </td>


                <td>
                    ${formatMoney(
                        paid
                    )}
                </td>


                <td>

                    <strong>
                        ${formatMoney(
                            balance
                        )}
                    </strong>

                </td>


                <td>

                    <span
                        class="status ${statusClass}"
                    >

                        ${status}

                    </span>

                </td>


                <td>

                    <button
                        type="button"
                        class="action-btn"
                        onclick="openPaymentForStudent('${student.id}')"
                    >

                        ${paid > 0
                            ? "Edit"
                            : "Pay"
                        }

                    </button>

                </td>

            `;


            paymentsTableBody.appendChild(
                row
            );

        }

    );


    updateStatistics();

}


// ==========================================
// UPDATE STATISTICS
// ==========================================

function updateStatistics() {

    const filteredStudents =
        getFilteredStudents();


    let expected = 0;

    let collected = 0;

    let outstanding = 0;

    let fullyPaid = 0;


    filteredStudents.forEach(

        function(student) {

            expected +=
                DEFAULT_FEE;


            const payment =
                getStudentPayment(
                    student.id
                );


            const paid =
                Number(
                    payment.paid
                );


            collected += paid;


            outstanding +=
                Math.max(
                    DEFAULT_FEE - paid,
                    0
                );


            if (
                paid >= DEFAULT_FEE
            ) {

                fullyPaid++;

            }

        }

    );


    document.getElementById(
        "totalExpected"
    ).textContent =
        formatMoney(
            expected
        );


    document.getElementById(
        "totalCollected"
    ).textContent =
        formatMoney(
            collected
        );


    document.getElementById(
        "totalOutstanding"
    ).textContent =
        formatMoney(
            outstanding
        );


    document.getElementById(
        "fullyPaid"
    ).textContent =
        fullyPaid;

}


// ==========================================
// FORMAT MONEY
// ==========================================

function formatMoney(
    amount
) {

    return Number(
        amount
    ).toLocaleString(
        "en-US",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

}


// ==========================================
// OPEN ADD PAYMENT
// ==========================================

function openAddPayment() {

    paymentForm.reset();


    studentSelect.innerHTML = `

        <option value="">
            Select student
        </option>

    `;


    students.forEach(

        function(student) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                student.id;


            option.textContent =

                student.name +
                " — " +
                student.id;


            studentSelect.appendChild(
                option
            );

        }

    );


    paymentModal.classList.add(
        "active"
    );

}


// ==========================================
// OPEN PAYMENT FOR STUDENT
// ==========================================

function openPaymentForStudent(
    studentId
) {

    openAddPayment();


    studentSelect.value =
        studentId;


    const student =
        students.find(

            function(item) {

                return (
                    item.id ===
                    studentId
                );

            }

        );


    if (!student) {

        return;

    }


    document.getElementById(
        "paymentStudentName"
    ).textContent =
        student.name;


    const payment =
        getStudentPayment(
            studentId
        );


    document.getElementById(
        "amountPaid"
    ).value =
        payment.paid || "";


    document.getElementById(
        "paymentMethod"
    ).value =
        payment.method || "";


    document.getElementById(
        "referenceNumber"
    ).value =
        payment.reference || "";


    document.getElementById(
        "paymentNote"
    ).value =
        payment.note || "";

}


// ==========================================
// CLOSE PAYMENT MODAL
// ==========================================

function closePaymentWindow() {

    paymentModal.classList.remove(
        "active"
    );

    paymentForm.reset();

}


addPaymentBtn.addEventListener(
    "click",
    openAddPayment
);


closePaymentModal.addEventListener(
    "click",
    closePaymentWindow
);


cancelPaymentBtn.addEventListener(
    "click",
    closePaymentWindow
);


// ==========================================
// STUDENT SELECTION
// ==========================================

studentSelect.addEventListener(

    "change",

    function() {

        const studentId =
            studentSelect.value;


        if (!studentId) {

            document.getElementById(
                "paymentStudentName"
            ).textContent =
                "Student payment";

            return;

        }


        openPaymentForStudent(
            studentId
        );

    }

);


// ==========================================
// SAVE PAYMENT
// ==========================================

paymentForm.addEventListener(

    "submit",

    function(event) {

        event.preventDefault();


        const studentId =
            studentSelect.value;


        const amount =
            Number(
                document.getElementById(
                    "amountPaid"
                ).value
            );


        const method =
            document.getElementById(
                "paymentMethod"
            ).value;


        const reference =
            document.getElementById(
                "referenceNumber"
            ).value.trim();


        const note =
            document.getElementById(
                "paymentNote"
            ).value.trim();


        if (!studentId) {

            alert(
                "Please select a student."
            );

            return;

        }


        if (
            amount < 0
        ) {

            alert(
                "Payment amount cannot be negative."
            );

            return;

        }


        if (!method) {

            alert(
                "Please select a payment method."
            );

            return;

        }


        payments[studentId] = {

            paid: amount,

            method: method,

            reference: reference,

            note: note

        };


        savePayments();

        displayPayments();

        closePaymentWindow();


        alert(
            "Payment saved successfully."
        );

    }

);


// ==========================================
// SETTINGS
// ==========================================

function openSettings() {

    document.getElementById(
        "mainPaymentMethod"
    ).value =
        paymentSettings.method;


    document.getElementById(
        "accountName"
    ).value =
        paymentSettings.accountName;


    document.getElementById(
        "accountNumber"
    ).value =
        paymentSettings.accountNumber;


    document.getElementById(
        "paymentPhone"
    ).value =
        paymentSettings.phone;


    document.getElementById(
        "paymentInstructions"
    ).value =
        paymentSettings.instructions;


    settingsModal.classList.add(
        "active"
    );

}


// ==========================================
// CLOSE SETTINGS
// ==========================================

function closeSettingsWindow() {

    settingsModal.classList.remove(
        "active"
    );

}


settingsBtn.addEventListener(
    "click",
    openSettings
);


changePaymentBtn.addEventListener(
    "click",
    openSettings
);


closeSettingsModal.addEventListener(
    "click",
    closeSettingsWindow
);


cancelSettingsBtn.addEventListener(
    "click",
    closeSettingsWindow
);


// ==========================================
// SAVE PAYMENT SETTINGS
// ==========================================

settingsForm.addEventListener(

    "submit",

    function(event) {

        event.preventDefault();


        paymentSettings = {

            method:
                document.getElementById(
                    "mainPaymentMethod"
                ).value,

            accountName:
                document.getElementById(
                    "accountName"
                ).value.trim(),

            accountNumber:
                document.getElementById(
                    "accountNumber"
                ).value.trim(),

            phone:
                document.getElementById(
                    "paymentPhone"
                ).value.trim(),

            instructions:
                document.getElementById(
                    "paymentInstructions"
                ).value.trim()

        };


        savePaymentSettings();

        updatePaymentDestination();

        closeSettingsWindow();


        alert(
            "Payment settings updated successfully."
        );

    }

);


// ==========================================
// DISPLAY PAYMENT ACCOUNT
// ==========================================

function updatePaymentDestination() {

    document.getElementById(
        "currentBankName"
    ).textContent =
        paymentSettings.method;


    let information = "";


    if (
        paymentSettings.accountName
    ) {

        information +=
            paymentSettings.accountName;

    }


    if (
        paymentSettings.accountNumber
    ) {

        if (information) {

            information +=
                " • ";

        }


        information +=
            "Account: " +
            paymentSettings.accountNumber;

    }


    if (
        paymentSettings.phone
    ) {

        if (information) {

            information +=
                " • ";

        }


        information +=
            "Phone: " +
            paymentSettings.phone;

    }


    if (!information) {

        information =
            "Account information not configured";

    }


    document.getElementById(
        "currentAccountInfo"
    ).textContent =
        information;

}


// ==========================================
// CLOSE MODALS BY OUTSIDE CLICK
// ==========================================

paymentModal.addEventListener(

    "click",

    function(event) {

        if (
            event.target ===
            paymentModal
        ) {

            closePaymentWindow();

        }

    }

);


settingsModal.addEventListener(

    "click",

    function(event) {

        if (
            event.target ===
            settingsModal
        ) {

            closeSettingsWindow();

        }

    }

);


// ==========================================
// FILTER EVENTS
// ==========================================

gradeFilter.addEventListener(
    "change",
    displayPayments
);


classFilter.addEventListener(
    "change",
    displayPayments
);


searchInput.addEventListener(
    "input",
    displayPayments
);


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(
    value
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value ?? "";


    return div.innerHTML;

}


// ==========================================
// ESC KEY
// ==========================================

document.addEventListener(

    "keydown",

    function(event) {

        if (
            event.key === "Escape"
        ) {

            paymentModal.classList.remove(
                "active"
            );

            settingsModal.classList.remove(
                "active"
            );

        }

    }

);


// ==========================================
// INITIALIZE
// ==========================================

loadData();

updatePaymentDestination();

displayPayments();


console.log(
    "A.Kolfe Fees & Payments loaded successfully."
);