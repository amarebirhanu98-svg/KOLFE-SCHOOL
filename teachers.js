// ============================================
// A.KOLFE SECONDARY SCHOOL
// TEACHER MANAGEMENT
// ============================================


// ELEMENTS

const addTeacherBtn =
    document.getElementById("addTeacherBtn");

const modal =
    document.getElementById("teacherModal");

const closeModalBtn =
    document.getElementById("closeModal");

const cancelBtn =
    document.getElementById("cancelBtn");

const form =
    document.getElementById("teacherForm");

const table =
    document.getElementById("teacherTable");

const searchInput =
    document.getElementById("searchInput");

const subjectFilter =
    document.getElementById("subjectFilter");

const gradeFilter =
    document.getElementById("gradeFilter");


// ============================================
// LOAD TEACHERS
// ============================================

let teachers = [];

try {

    const savedTeachers =
        localStorage.getItem("kolfeTeachers");

    teachers =
        savedTeachers
            ? JSON.parse(savedTeachers)
            : [];

    // Make sure the saved data is an array
    if (!Array.isArray(teachers)) {
        teachers = [];
    }

} catch (error) {

    console.error(
        "Could not load teachers:",
        error
    );

    teachers = [];

}


// ============================================
// DEFAULT DEMO TEACHERS
// ============================================

// Add demo teachers only if there are no saved teachers.

if (teachers.length === 0) {

    teachers = [

        {
            id: "KSS-T001",
            name: "Abebe Teacher",
            gender: "Male",
            subject: "Mathematics",
            grades: "9, 10",
            phone: "0911000001",
            email: "abebe@kolfe.edu.et",
            year: "2019 E.C."
        },

        {
            id: "KSS-T002",
            name: "Hana Teacher",
            gender: "Female",
            subject: "Biology",
            grades: "11, 12",
            phone: "0911000002",
            email: "hana@kolfe.edu.et",
            year: "2019 E.C."
        },

        {
            id: "KSS-T003",
            name: "Dawit Teacher",
            gender: "Male",
            subject: "Physics",
            grades: "11, 12",
            phone: "0911000003",
            email: "dawit@kolfe.edu.et",
            year: "2019 E.C."
        }

    ];

    saveTeachers();

}


// ============================================
// SAVE TEACHERS
// ============================================

function saveTeachers() {

    localStorage.setItem(
        "kolfeTeachers",
        JSON.stringify(teachers)
    );

}


// ============================================
// ESCAPE HTML
// ============================================

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;

}


// ============================================
// DISPLAY TEACHERS
// ============================================

function displayTeachers() {

    const search =
        searchInput.value
            .toLowerCase()
            .trim();

    const subject =
        subjectFilter.value;

    const grade =
        gradeFilter.value;


    const filteredTeachers =
        teachers.filter(function (teacher) {

            const teacherName =
                String(
                    teacher.name || ""
                ).toLowerCase();

            const teacherId =
                String(
                    teacher.id || ""
                ).toLowerCase();


            // SEARCH

            const matchesSearch =

                teacherName.includes(search) ||

                teacherId.includes(search);


            // SUBJECT

            const matchesSubject =

                subject === "" ||

                teacher.subject === subject;


            // GRADE

            const teacherGrades =
                String(
                    teacher.grades || ""
                )
                    .split(",")
                    .map(function (item) {

                        return item
                            .trim()
                            .replace(
                                /^Grade\s*/i,
                                ""
                            );

                    });


            const matchesGrade =

                grade === "" ||

                teacherGrades.includes(grade);


            return (
                matchesSearch &&
                matchesSubject &&
                matchesGrade
            );

        });


    // CLEAR TABLE

    table.innerHTML = "";


    // NO RESULTS

    if (filteredTeachers.length === 0) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    style="
                        text-align:center;
                        padding:40px;
                    "
                >

                    No teachers found.

                </td>

            </tr>

        `;

        updateStatistics(0);

        return;

    }


    // CREATE ROWS

    filteredTeachers.forEach(function (teacher) {

        const index =
            teachers.indexOf(teacher);


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                <strong>
                    ${escapeHTML(teacher.id)}
                </strong>
            </td>

            <td>
                ${escapeHTML(teacher.name)}
            </td>

            <td>
                ${escapeHTML(teacher.gender)}
            </td>

            <td>
                ${escapeHTML(teacher.subject)}
            </td>

            <td>
                ${escapeHTML(teacher.grades)}
            </td>

            <td>
                ${escapeHTML(teacher.phone)}
            </td>

            <td>

                <span class="status">
                    Active
                </span>

            </td>

            <td>

                <button
                    type="button"
                    class="action-btn view-btn"
                    onclick="viewTeacher(${index})"
                >
                    View
                </button>


                <button
                    type="button"
                    class="action-btn edit-btn"
                    onclick="editTeacher(${index})"
                >
                    Edit
                </button>


                <button
                    type="button"
                    class="action-btn delete-btn"
                    onclick="deleteTeacher(${index})"
                >
                    Delete
                </button>

            </td>

        `;


        table.appendChild(row);

    });


    // UPDATE STATISTICS

    updateStatistics(
        filteredTeachers.length
    );

}


// ============================================
// STATISTICS
// ============================================

function updateStatistics(filteredCount) {

    // TOTAL

    document.getElementById(
        "totalTeachers"
    ).textContent =
        teachers.length;


    // MALE

    document.getElementById(
        "maleTeachers"
    ).textContent =

        teachers.filter(function (teacher) {

            return teacher.gender === "Male";

        }).length;


    // FEMALE

    document.getElementById(
        "femaleTeachers"
    ).textContent =

        teachers.filter(function (teacher) {

            return teacher.gender === "Female";

        }).length;


    // SUBJECTS

    const subjects =
        new Set(

            teachers
                .map(function (teacher) {

                    return teacher.subject;

                })
                .filter(Boolean)

        );


    document.getElementById(
        "subjectCount"
    ).textContent =
        subjects.size;


    // RESULT COUNT

    document.getElementById(
        "resultCount"
    ).textContent =

        `${filteredCount} teacher${
            filteredCount === 1
                ? ""
                : "s"
        }`;

}


// ============================================
// OPEN ADD TEACHER MODAL
// ============================================

function openAddTeacher() {

    form.reset();


    document.getElementById(
        "teacherIndex"
    ).value = "";


    document.getElementById(
        "employmentYear"
    ).value =
        "2019 E.C.";


    document.getElementById(
        "modalTitle"
    ).textContent =
        "Add Teacher";


    modal.classList.add("show");


    document.getElementById(
        "teacherId"
    ).focus();

}


// BUTTON

if (addTeacherBtn) {

    addTeacherBtn.addEventListener(
        "click",
        openAddTeacher
    );

}


// ============================================
// CLOSE MODAL
// ============================================

function closeTeacherModal() {

    modal.classList.remove("show");

}


if (closeModalBtn) {

    closeModalBtn.addEventListener(
        "click",
        closeTeacherModal
    );

}


if (cancelBtn) {

    cancelBtn.addEventListener(
        "click",
        closeTeacherModal
    );

}


// ============================================
// CLOSE WHEN CLICKING OUTSIDE MODAL
// ============================================

if (modal) {

    modal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === modal
            ) {

                closeTeacherModal();

            }

        }
    );

}


// ============================================
// ESC KEY CLOSES MODAL
// ============================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            modal.classList.contains("show")
        ) {

            closeTeacherModal();

        }

    }
);


// ============================================
// SAVE TEACHER
// ============================================

form.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        // GET FORM VALUES

        const index =
            document.getElementById(
                "teacherIndex"
            ).value;


        const teacherId =
            document.getElementById(
                "teacherId"
            ).value.trim();


        const teacherName =
            document.getElementById(
                "teacherName"
            ).value.trim();


        const gender =
            document.getElementById(
                "gender"
            ).value;


        const subject =
            document.getElementById(
                "subject"
            ).value;


        const grades =
            document.getElementById(
                "grades"
            ).value.trim();


        const phone =
            document.getElementById(
                "phone"
            ).value.trim();


        const email =
            document.getElementById(
                "email"
            ).value.trim();


        const employmentYear =
            document.getElementById(
                "employmentYear"
            ).value.trim();


        // ========================================
        // BASIC VALIDATION
        // ========================================

        if (
            !teacherId ||
            !teacherName ||
            !gender ||
            !subject ||
            !grades ||
            !phone ||
            !employmentYear
        ) {

            alert(
                "Please complete all required fields."
            );

            return;

        }


        // ========================================
        // CHECK DUPLICATE TEACHER ID
        // ========================================

        const duplicate =
            teachers.some(function (
                teacher,
                teacherIndex
            ) {

                return (

                    teacher.id
                        .toLowerCase() ===
                    teacherId.toLowerCase()

                    &&

                    String(teacherIndex) !==
                    String(index)

                );

            });


        if (duplicate) {

            alert(
                "A teacher with this ID already exists."
            );

            return;

        }


        // ========================================
        // CREATE TEACHER OBJECT
        // ========================================

        const teacher = {

            id: teacherId,

            name: teacherName,

            gender: gender,

            subject: subject,

            grades: grades,

            phone: phone,

            email: email,

            year: employmentYear

        };


        // ========================================
        // EDIT EXISTING TEACHER
        // ========================================

        if (index !== "") {

            teachers[
                Number(index)
            ] = teacher;

        }


        // ========================================
        // ADD NEW TEACHER
        // ========================================

        else {

            teachers.push(teacher);

        }


        // SAVE

        saveTeachers();


        // REFRESH TABLE

        displayTeachers();


        // CLOSE MODAL

        closeTeacherModal();


        // MESSAGE

        alert(
            index !== ""
                ? "Teacher updated successfully."
                : "Teacher added successfully."
        );

    }
);


// ============================================
// EDIT TEACHER
// ============================================

function editTeacher(index) {

    const teacher =
        teachers[index];


    if (!teacher) {

        return;

    }


    document.getElementById(
        "teacherIndex"
    ).value =
        index;


    document.getElementById(
        "teacherId"
    ).value =
        teacher.id || "";


    document.getElementById(
        "teacherName"
    ).value =
        teacher.name || "";


    document.getElementById(
        "gender"
    ).value =
        teacher.gender || "";


    document.getElementById(
        "subject"
    ).value =
        teacher.subject || "";


    document.getElementById(
        "grades"
    ).value =
        teacher.grades || "";


    document.getElementById(
        "phone"
    ).value =
        teacher.phone || "";


    document.getElementById(
        "email"
    ).value =
        teacher.email || "";


    document.getElementById(
        "employmentYear"
    ).value =
        teacher.year || "2019 E.C.";


    document.getElementById(
        "modalTitle"
    ).textContent =
        "Edit Teacher";


    modal.classList.add("show");


    document.getElementById(
        "teacherName"
    ).focus();

}


// ============================================
// VIEW TEACHER
// ============================================

function viewTeacher(index) {

    const teacher =
        teachers[index];


    if (!teacher) {

        return;

    }


    alert(

        "Teacher Information\n\n" +

        "ID: " +
        (teacher.id || "") +

        "\n\nName: " +
        (teacher.name || "") +

        "\n\nGender: " +
        (teacher.gender || "") +

        "\n\nSubject: " +
        (teacher.subject || "") +

        "\n\nGrades: " +
        (teacher.grades || "") +

        "\n\nPhone: " +
        (teacher.phone || "") +

        "\n\nEmail: " +
        (teacher.email || "Not provided") +

        "\n\nEmployment: " +
        (teacher.year || "")

    );

}


// ============================================
// DELETE TEACHER
// ============================================

function deleteTeacher(index) {

    const teacher =
        teachers[index];


    if (!teacher) {

        return;

    }


    const confirmed =
        confirm(

            `Delete ${teacher.name}?\n\n` +

            "This action cannot be undone."

        );


    if (!confirmed) {

        return;

    }


    teachers.splice(
        index,
        1
    );


    saveTeachers();


    displayTeachers();


    alert(
        "Teacher deleted successfully."
    );

}


// ============================================
// SEARCH
// ============================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        displayTeachers
    );

}


// ============================================
// SUBJECT FILTER
// ============================================

if (subjectFilter) {

    subjectFilter.addEventListener(
        "change",
        displayTeachers
    );

}


// ============================================
// GRADE FILTER
// ============================================

if (gradeFilter) {

    gradeFilter.addEventListener(
        "change",
        displayTeachers
    );

}


// ============================================
// INITIAL DISPLAY
// ============================================

displayTeachers();