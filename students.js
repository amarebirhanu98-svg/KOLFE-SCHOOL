const modal =
    document.getElementById("studentModal");

const form =
    document.getElementById("studentForm");

const table =
    document.getElementById("studentsTable");

const searchInput =
    document.getElementById("searchInput");

const gradeFilter =
    document.getElementById("gradeFilter");

const genderFilter =
    document.getElementById("genderFilter");


let students = [];


// LOAD DATA

const savedStudents =
    localStorage.getItem(
        "kolfeStudents"
    );


if (savedStudents) {

    students =
        JSON.parse(savedStudents);

}


// OPEN MODAL

document
    .getElementById("addStudentBtn")
    .addEventListener(
        "click",
        openAddStudent
    );


function openAddStudent() {

    form.reset();

    document.getElementById(
        "editId"
    ).value = "";

    document.getElementById(
        "modalTitle"
    ).textContent =
        "Add Student";

    modal.classList.add(
        "active"
    );

}


// CLOSE MODAL

document
    .getElementById("closeModal")
    .addEventListener(
        "click",
        closeModal
    );


document
    .getElementById("cancelBtn")
    .addEventListener(
        "click",
        closeModal
    );


function closeModal() {

    modal.classList.remove(
        "active"
    );

}


// SAVE STUDENT

form.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const editId =
            document.getElementById(
                "editId"
            ).value;


        const student = {

            id:
                editId ||
                Date.now(),

            studentId:
                document.getElementById(
                    "studentId"
                ).value.trim(),

            name:
                document.getElementById(
                    "studentName"
                ).value.trim(),

            gender:
                document.getElementById(
                    "gender"
                ).value,

            grade:
                document.getElementById(
                    "grade"
                ).value,

            section:
                document.getElementById(
                    "section"
                ).value.trim(),

            parent:
                document.getElementById(
                    "parent"
                ).value.trim(),

            phone:
                document.getElementById(
                    "phone"
                ).value.trim()

        };


        if (editId) {

            students =
                students.map(
                    oldStudent =>
                        oldStudent.id ==
                        editId
                            ? student
                            : oldStudent
                );

        } else {

            students.push(
                student
            );

        }


        saveStudents();

        renderStudents();

        closeModal();

    }
);


// DISPLAY

function renderStudents() {

    const search =
        searchInput.value
            .toLowerCase()
            .trim();


    const grade =
        gradeFilter.value;


    const gender =
        genderFilter.value;


    const filtered =
        students.filter(
            student => {

                const matchesSearch =

                    student.name
                        .toLowerCase()
                        .includes(search) ||

                    student.studentId
                        .toLowerCase()
                        .includes(search);


                const matchesGrade =

                    grade === "All" ||
                    student.grade === grade;


                const matchesGender =

                    gender === "All" ||
                    student.gender === gender;


                return (
                    matchesSearch &&
                    matchesGrade &&
                    matchesGender
                );

            }
        );


    table.innerHTML = "";


    if (
        filtered.length === 0
    ) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="9"
                    class="empty"
                >

                    No students found.

                </td>

            </tr>

        `;

    } else {

        filtered.forEach(
            (student, index) => {

                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        <span class="student-id">
                            ${escapeHTML(
                                student.studentId
                            )}
                        </span>
                    </td>

                    <td>
                        <span class="student-name">
                            ${escapeHTML(
                                student.name
                            )}
                        </span>
                    </td>

                    <td>
                        ${escapeHTML(
                            student.gender
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            student.grade
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            student.section
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            student.parent
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            student.phone
                        )}
                    </td>

                    <td>

                        <button
                            class="action-btn edit-btn"
                            onclick="editStudent(${student.id})"
                        >
                            Edit
                        </button>

                        <button
                            class="action-btn delete-btn"
                            onclick="deleteStudent(${student.id})"
                        >
                            Delete
                        </button>

                    </td>

                `;


                table.appendChild(
                    row
                );

            }
        );

    }


    updateStatistics();

}


// EDIT

function editStudent(id) {

    const student =
        students.find(
            item =>
                item.id == id
        );


    if (!student) {
        return;
    }


    document.getElementById(
        "editId"
    ).value =
        student.id;


    document.getElementById(
        "studentId"
    ).value =
        student.studentId;


    document.getElementById(
        "studentName"
    ).value =
        student.name;


    document.getElementById(
        "gender"
    ).value =
        student.gender;


    document.getElementById(
        "grade"
    ).value =
        student.grade;


    document.getElementById(
        "section"
    ).value =
        student.section;


    document.getElementById(
        "parent"
    ).value =
        student.parent;


    document.getElementById(
        "phone"
    ).value =
        student.phone;


    document.getElementById(
        "modalTitle"
    ).textContent =
        "Edit Student";


    modal.classList.add(
        "active"
    );

}


// DELETE

function deleteStudent(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this student?"
        );


    if (!confirmed) {
        return;
    }


    students =
        students.filter(
            student =>
                student.id != id
        );


    saveStudents();

    renderStudents();

}


// SAVE

function saveStudents() {

    localStorage.setItem(
        "kolfeStudents",

        JSON.stringify(
            students
        )
    );

}


// STATISTICS

function updateStatistics() {

    document.getElementById(
        "totalStudents"
    ).textContent =
        students.length;


    document.getElementById(
        "grade9Count"
    ).textContent =
        countGrade("Grade 9");


    document.getElementById(
        "grade10Count"
    ).textContent =
        countGrade("Grade 10");


    document.getElementById(
        "grade1112Count"
    ).textContent =

        students.filter(
            student =>
                student.grade ===
                    "Grade 11" ||
                student.grade ===
                    "Grade 12"
        ).length;

}


function countGrade(grade) {

    return students.filter(
        student =>
            student.grade === grade
    ).length;

}


// SEARCH/FILTER

searchInput.addEventListener(
    "input",
    renderStudents
);


gradeFilter.addEventListener(
    "change",
    renderStudents
);


genderFilter.addEventListener(
    "change",
    renderStudents
);


// SECURITY

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent = text;

    return div.innerHTML;

}


// INITIAL DISPLAY

renderStudents();