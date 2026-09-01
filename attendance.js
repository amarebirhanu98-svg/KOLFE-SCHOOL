// ==========================================
// A.KOLFE SECONDARY SCHOOL
// ATTENDANCE MANAGEMENT
// ==========================================

// ==========================================
// ELEMENTS
// ==========================================

const attendanceDate =
    document.getElementById("attendanceDate");

const gradeFilter =
    document.getElementById("gradeFilter");

const classFilter =
    document.getElementById("classFilter");

const searchInput =
    document.getElementById("searchInput");

const tableBody =
    document.getElementById("attendanceTableBody");

const saveAttendanceBtn =
    document.getElementById("saveAttendanceBtn");

const classTitle =
    document.getElementById("classTitle");


// ==========================================
// STUDENTS
// LOAD FROM STUDENT MODULE
// ==========================================

let students = [];


function loadStudents() {

    try {

        const savedStudents =
            localStorage.getItem(
                "kolfeStudents"
            );


        if (savedStudents) {

            const saved =
                JSON.parse(
                    savedStudents
                );


            students =
                saved.map(
                    function (student) {

                        return {

                            id:
                                student.studentId ||
                                student.id,

                            name:
                                student.name,

                            grade:
                                student.grade,

                            classNumber:
                                student.section ||
                                "1"

                        };

                    }
                );

        } else {

            students = [];

        }

    } catch (error) {

        console.error(
            "Could not load students:",
            error
        );

        students = [];

    }

}


// ==========================================
// ATTENDANCE DATA
// ==========================================

let attendance = {};


// ==========================================
// TODAY
// ==========================================

function getToday() {

    const date =
        new Date();


    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );


    return (
        year +
        "-" +
        month +
        "-" +
        day
    );

}


attendanceDate.value =
    getToday();


// ==========================================
// LOAD ATTENDANCE
// ==========================================

function loadAttendance() {

    try {

        const saved =
            localStorage.getItem(
                "kolfeAttendance"
            );


        if (saved) {

            attendance =
                JSON.parse(
                    saved
                );

        }

    } catch (error) {

        console.error(
            "Could not load attendance:",
            error
        );

        attendance = {};

    }

}


// ==========================================
// SAVE ATTENDANCE
// ==========================================

function saveAttendanceData() {

    localStorage.setItem(
        "kolfeAttendance",
        JSON.stringify(
            attendance
        )
    );

}


// ==========================================
// ATTENDANCE KEY
// ==========================================

function getAttendanceKey(
    date,
    studentId
) {

    return (
        date +
        "_" +
        studentId
    );

}


// ==========================================
// GET STATUS
// ==========================================

function getStatus(
    date,
    studentId
) {

    const key =
        getAttendanceKey(
            date,
            studentId
        );


    return (
        attendance[key] ||
        "Present"
    );

}


// ==========================================
// SET STATUS
// ==========================================

function setStatus(
    studentId,
    status
) {

    const date =
        attendanceDate.value;


    const key =
        getAttendanceKey(
            date,
            studentId
        );


    attendance[key] =
        status;


    renderStudents();

}


// ==========================================
// FILTER STUDENTS
// ==========================================

function getFilteredStudents() {

    const grade =
        gradeFilter.value;


    const classNumber =
        classFilter.value;


    const search =
        searchInput.value
            .toLowerCase()
            .trim();


    return students.filter(
        function (student) {


            const gradeMatch =
                grade === "All" ||
                student.grade === grade;


            const classMatch =
                classNumber === "All" ||
                student.classNumber ===
                    classNumber;


            const searchMatch =

                student.name
                    .toLowerCase()
                    .includes(search)

                ||

                String(student.id)
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
// RENDER
// ==========================================

function renderStudents() {

    tableBody.innerHTML = "";


    const filtered =
        getFilteredStudents();


    if (
        gradeFilter.value === "All"
    ) {

        classTitle.textContent =
            "All Students";

    } else {

        classTitle.textContent =
            gradeFilter.value +
            " — Class " +
            classFilter.value;

    }


    if (
        filtered.length === 0
    ) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    style="text-align:center;padding:40px;"
                >

                    No students found.

                    <br><br>

                    Add students from the
                    Students module first.

                </td>

            </tr>

        `;


        updateStatistics();

        return;

    }


    filtered.forEach(
        function (student, index) {


            const status =
                getStatus(
                    attendanceDate.value,
                    student.id
                );


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>

                    <div class="student-name">

                        ${escapeHTML(
                            student.name
                        )}

                    </div>

                </td>

                <td>

                    <span class="student-id">

                        ${escapeHTML(
                            String(student.id)
                        )}

                    </span>

                </td>

                <td>

                    <div class="attendance-buttons">


                        <button
                            type="button"
                            class="attendance-btn ${
                                status === "Present"
                                    ? "active"
                                    : ""
                            }"
                            data-status="Present"
                            data-id="${student.id}"
                        >
                            ✅ Present
                        </button>


                        <button
                            type="button"
                            class="attendance-btn ${
                                status === "Absent"
                                    ? "active"
                                    : ""
                            }"
                            data-status="Absent"
                            data-id="${student.id}"
                        >
                            ❌ Absent
                        </button>


                        <button
                            type="button"
                            class="attendance-btn ${
                                status === "Late"
                                    ? "active"
                                    : ""
                            }"
                            data-status="Late"
                            data-id="${student.id}"
                        >
                            🕐 Late
                        </button>


                        <button
                            type="button"
                            class="attendance-btn ${
                                status === "Excused"
                                    ? "active"
                                    : ""
                            }"
                            data-status="Excused"
                            data-id="${student.id}"
                        >
                            📝 Excused
                        </button>


                    </div>

                </td>

            `;


            tableBody.appendChild(
                row
            );

        }
    );


    updateStatistics();

}


// ==========================================
// BUTTON CLICK
// ==========================================

tableBody.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                "button[data-status]"
            );


        if (!button) {

            return;

        }


        setStatus(
            button.dataset.id,
            button.dataset.status
        );

    }
);


// ==========================================
// STATISTICS
// ==========================================

function updateStatistics() {

    const filtered =
        getFilteredStudents();


    let present = 0;

    let absent = 0;

    let late = 0;

    let excused = 0;


    filtered.forEach(
        function (student) {

            const status =
                getStatus(
                    attendanceDate.value,
                    student.id
                );


            if (
                status === "Present"
            ) {

                present++;

            }


            if (
                status === "Absent"
            ) {

                absent++;

            }


            if (
                status === "Late"
            ) {

                late++;

            }


            if (
                status === "Excused"
            ) {

                excused++;

            }

        }
    );


    document.getElementById(
        "totalStudents"
    ).textContent =
        filtered.length;


    document.getElementById(
        "presentCount"
    ).textContent =
        present;


    document.getElementById(
        "absentCount"
    ).textContent =
        absent;


    document.getElementById(
        "lateCount"
    ).textContent =
        late;

}


// ==========================================
// SAVE BUTTON
// ==========================================

saveAttendanceBtn.addEventListener(
    "click",
    function () {

        saveAttendanceData();


        alert(
            "Attendance saved successfully!"
        );

    }
);


// ==========================================
// FILTER EVENTS
// ==========================================

gradeFilter.addEventListener(
    "change",
    renderStudents
);


classFilter.addEventListener(
    "change",
    renderStudents
);


searchInput.addEventListener(
    "input",
    renderStudents
);


attendanceDate.addEventListener(
    "change",
    renderStudents
);


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value ?? "";


    return div.innerHTML;

}


// ==========================================
// INITIALIZE
// ==========================================

loadStudents();

loadAttendance();

renderStudents();


console.log(
    "A.Kolfe Attendance Management loaded successfully."
);