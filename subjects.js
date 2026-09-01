// ==========================================
// A.KOLFE SECONDARY SCHOOL
// SUBJECT MANAGEMENT
// ==========================================


// ==========================================
// GET HTML ELEMENTS
// ==========================================

const addSubjectBtn =
    document.getElementById("addSubjectBtn");

const modal =
    document.getElementById("subjectModal");

const closeModalBtn =
    document.getElementById("closeModal");

const cancelBtn =
    document.getElementById("cancelBtn");

const form =
    document.getElementById("subjectForm");

const subjectGrid =
    document.getElementById("subjectGrid");

const searchInput =
    document.getElementById("searchInput");

const gradeFilter =
    document.getElementById("gradeFilter");


// ==========================================
// DEFAULT SUBJECTS
// ==========================================

const defaultSubjects = [

    {
        id: 1,
        name: "Mathematics",
        code: "MAT",
        grade: "Grade 9",
        teacher: "Abebe Teacher",
        periods: 5
    },

    {
        id: 2,
        name: "Biology",
        code: "BIO",
        grade: "Grade 11",
        teacher: "Hana Teacher",
        periods: 4
    },

    {
        id: 3,
        name: "Physics",
        code: "PHY",
        grade: "Grade 12",
        teacher: "Dawit Teacher",
        periods: 4
    },

    {
        id: 4,
        name: "English",
        code: "ENG",
        grade: "Grade 10",
        teacher: "Not Assigned",
        periods: 4
    },

    {
        id: 5,
        name: "Chemistry",
        code: "CHE",
        grade: "Grade 11",
        teacher: "Not Assigned",
        periods: 4
    },

    {
        id: 6,
        name: "HPE",
        code: "HPE",
        grade: "Grade 9",
        teacher: "Not Assigned",
        periods: 3
    },

    {
        id: 7,
        name: "Citizenship",
        code: "CIT",
        grade: "Grade 10",
        teacher: "Not Assigned",
        periods: 2
    }

];


// ==========================================
// SUBJECT DATA
// ==========================================

let subjects = [];


// ==========================================
// LOAD SUBJECTS
// ==========================================

function loadSubjects() {

    try {

        const savedSubjects =
            localStorage.getItem(
                "kolfeSubjects"
            );


        if (savedSubjects) {

            const parsed =
                JSON.parse(savedSubjects);


            if (Array.isArray(parsed)) {

                subjects = parsed;

                return;

            }

        }

    } catch (error) {

        console.error(
            "Error loading subjects:",
            error
        );

    }


    subjects =
        [...defaultSubjects];


    saveSubjects();

}


// ==========================================
// SAVE SUBJECTS
// ==========================================

function saveSubjects() {

    try {

        localStorage.setItem(
            "kolfeSubjects",
            JSON.stringify(subjects)
        );

    } catch (error) {

        console.error(
            "Error saving subjects:",
            error
        );

    }

}


// ==========================================
// OPEN ADD MODAL
// ==========================================

function openAddModal() {

    form.reset();


    document.getElementById(
        "editId"
    ).value = "";


    document.getElementById(
        "modalTitle"
    ).textContent =
        "Add Subject";


    document.getElementById(
        "periods"
    ).value = 4;


    modal.classList.add(
        "active"
    );


    document.getElementById(
        "subjectName"
    ).focus();

}


// ==========================================
// CLOSE MODAL
// ==========================================

function closeModal() {

    modal.classList.remove(
        "active"
    );


    form.reset();


    document.getElementById(
        "editId"
    ).value = "";


    document.getElementById(
        "modalTitle"
    ).textContent =
        "Add Subject";


    document.getElementById(
        "periods"
    ).value = 4;

}


// ==========================================
// ADD BUTTON
// ==========================================

addSubjectBtn.addEventListener(
    "click",
    openAddModal
);


// ==========================================
// CLOSE BUTTON
// ==========================================

closeModalBtn.addEventListener(
    "click",
    closeModal
);


// ==========================================
// CANCEL BUTTON
// ==========================================

cancelBtn.addEventListener(
    "click",
    closeModal
);


// ==========================================
// CLICK OUTSIDE MODAL
// ==========================================

modal.addEventListener(
    "click",
    function (event) {

        if (
            event.target === modal
        ) {

            closeModal();

        }

    }
);


// ==========================================
// SAVE / UPDATE
// ==========================================

form.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        // --------------------------------------
        // GET VALUES
        // --------------------------------------

        const editId =
            document.getElementById(
                "editId"
            ).value;


        const name =
            document.getElementById(
                "subjectName"
            ).value.trim();


        const code =
            document.getElementById(
                "subjectCode"
            ).value
                .trim()
                .toUpperCase();


        const grade =
            document.getElementById(
                "grade"
            ).value;


        const teacher =
            document.getElementById(
                "teacher"
            ).value.trim();


        const periods =
            Number(
                document.getElementById(
                    "periods"
                ).value
            );


        // --------------------------------------
        // VALIDATION
        // --------------------------------------

        if (!name) {

            alert(
                "Please enter the subject name."
            );

            return;

        }


        if (!code) {

            alert(
                "Please enter the subject code."
            );

            return;

        }


        if (!grade) {

            alert(
                "Please select a grade."
            );

            return;

        }


        if (!teacher) {

            alert(
                "Please enter the teacher."
            );

            return;

        }


        if (
            periods < 1 ||
            periods > 20
        ) {

            alert(
                "Weekly periods must be between 1 and 20."
            );

            return;

        }


        // --------------------------------------
        // DUPLICATE CODE CHECK
        // --------------------------------------

        const duplicate =
            subjects.some(
                function (subject) {

                    return (

                        subject.code
                            .toLowerCase() ===
                        code.toLowerCase()

                        &&

                        String(subject.id) !==
                        String(editId)

                    );

                }
            );


        if (duplicate) {

            alert(
                "A subject with this code already exists."
            );

            return;

        }


        // --------------------------------------
        // CREATE SUBJECT
        // --------------------------------------

        const subject = {

            id:
                editId
                    ? Number(editId)
                    : Date.now(),

            name: name,

            code: code,

            grade: grade,

            teacher: teacher,

            periods: periods

        };


        // --------------------------------------
        // UPDATE
        // --------------------------------------

        if (editId) {

            subjects =
                subjects.map(
                    function (oldSubject) {

                        if (
                            String(
                                oldSubject.id
                            ) ===
                            String(editId)
                        ) {

                            return subject;

                        }


                        return oldSubject;

                    }
                );


            alert(
                "Subject updated successfully!"
            );

        }


        // --------------------------------------
        // ADD
        // --------------------------------------

        else {

            subjects.push(
                subject
            );


            alert(
                "Subject added successfully!"
            );

        }


        // --------------------------------------
        // SAVE
        // --------------------------------------

        saveSubjects();


        // --------------------------------------
        // REFRESH
        // --------------------------------------

        displaySubjects();


        closeModal();

    }
);


// ==========================================
// DISPLAY SUBJECTS
// ==========================================

function displaySubjects() {

    subjectGrid.innerHTML = "";


    const search =
        searchInput.value
            .toLowerCase()
            .trim();


    const selectedGrade =
        gradeFilter.value;


    const filteredSubjects =
        subjects.filter(
            function (subject) {


                const name =
                    String(
                        subject.name || ""
                    ).toLowerCase();


                const code =
                    String(
                        subject.code || ""
                    ).toLowerCase();


                const teacher =
                    String(
                        subject.teacher || ""
                    ).toLowerCase();


                const matchesSearch =

                    name.includes(search)

                    ||

                    code.includes(search)

                    ||

                    teacher.includes(search);


                const matchesGrade =

                    selectedGrade === "All"

                    ||

                    subject.grade ===
                    selectedGrade;


                return (
                    matchesSearch &&
                    matchesGrade
                );

            }
        );


    // --------------------------------------
    // EMPTY STATE
    // --------------------------------------

    if (
        filteredSubjects.length === 0
    ) {

        subjectGrid.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    📚
                </div>

                <h3>
                    No subjects found
                </h3>

                <p>
                    Try changing your search
                    or grade filter.
                </p>

            </div>

        `;


        updateStatistics();

        return;

    }


    // --------------------------------------
    // CREATE CARDS
    // --------------------------------------

    filteredSubjects.forEach(
        function (subject) {


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "subject-card";


            card.innerHTML = `

                <div class="subject-card-header">

                    <div class="subject-icon">
                        📚
                    </div>


                    <div class="subject-actions">

                        <button
                            type="button"
                            class="action-btn edit-btn"
                            data-action="edit"
                            data-id="${subject.id}"
                        >
                            Edit
                        </button>


                        <button
                            type="button"
                            class="action-btn delete-btn"
                            data-action="delete"
                            data-id="${subject.id}"
                        >
                            Delete
                        </button>

                    </div>

                </div>


                <div class="subject-card-body">

                    <h3>
                        ${escapeHTML(
                            subject.name
                        )}
                    </h3>


                    <span class="subject-code">

                        ${escapeHTML(
                            subject.code
                        )}

                    </span>


                    <div class="subject-info">


                        <div class="info-row">

                            <span>
                                Grade
                            </span>

                            <strong>
                                ${escapeHTML(
                                    subject.grade
                                )}
                            </strong>

                        </div>


                        <div class="info-row">

                            <span>
                                Teacher
                            </span>

                            <strong>
                                ${escapeHTML(
                                    subject.teacher
                                )}
                            </strong>

                        </div>


                        <div class="info-row">

                            <span>
                                Weekly Periods
                            </span>

                            <strong>
                                ${subject.periods}
                            </strong>

                        </div>


                    </div>

                </div>

            `;


            subjectGrid.appendChild(
                card
            );

        }
    );


    updateStatistics();

}


// ==========================================
// EDIT / DELETE CLICK HANDLER
// ==========================================

subjectGrid.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                "button[data-action]"
            );


        if (!button) {

            return;

        }


        const action =
            button.dataset.action;


        const id =
            button.dataset.id;


        if (
            action === "edit"
        ) {

            editSubject(id);

        }


        if (
            action === "delete"
        ) {

            deleteSubject(id);

        }

    }
);


// ==========================================
// EDIT SUBJECT
// ==========================================

function editSubject(id) {

    const subject =
        subjects.find(
            function (item) {

                return (
                    String(item.id) ===
                    String(id)
                );

            }
        );


    if (!subject) {

        alert(
            "Subject not found."
        );

        return;

    }


    document.getElementById(
        "editId"
    ).value =
        subject.id;


    document.getElementById(
        "subjectName"
    ).value =
        subject.name;


    document.getElementById(
        "subjectCode"
    ).value =
        subject.code;


    document.getElementById(
        "grade"
    ).value =
        subject.grade;


    document.getElementById(
        "teacher"
    ).value =
        subject.teacher;


    document.getElementById(
        "periods"
    ).value =
        subject.periods;


    document.getElementById(
        "modalTitle"
    ).textContent =
        "Edit Subject";


    modal.classList.add(
        "active"
    );


    document.getElementById(
        "subjectName"
    ).focus();

}


// ==========================================
// DELETE SUBJECT
// ==========================================

function deleteSubject(id) {

    const subject =
        subjects.find(
            function (item) {

                return (
                    String(item.id) ===
                    String(id)
                );

            }
        );


    if (!subject) {

        alert(
            "Subject not found."
        );

        return;

    }


    const confirmed =
        confirm(

            "Delete " +
            subject.name +
            "?\n\n" +
            "This action cannot be undone."

        );


    if (!confirmed) {

        return;

    }


    subjects =
        subjects.filter(
            function (item) {

                return (
                    String(item.id) !==
                    String(id)
                );

            }
        );


    saveSubjects();


    displaySubjects();


    alert(
        "Subject deleted successfully!"
    );

}


// ==========================================
// UPDATE STATISTICS
// ==========================================

function updateStatistics() {

    const totalSubjects =
        document.getElementById(
            "totalSubjects"
        );


    if (totalSubjects) {

        totalSubjects.textContent =
            subjects.length;

    }


    const teacherList =
        subjects

            .map(
                function (subject) {

                    return String(
                        subject.teacher || ""
                    ).trim();

                }
            )

            .filter(
                function (teacher) {

                    return (

                        teacher !== ""

                        &&

                        teacher.toLowerCase() !==
                        "not assigned"

                    );

                }
            );


    const uniqueTeachers =
        new Set(
            teacherList
        );


    const assignedTeachers =
        document.getElementById(
            "assignedTeachers"
        );


    if (assignedTeachers) {

        assignedTeachers.textContent =
            uniqueTeachers.size;

    }

}


// ==========================================
// SEARCH
// ==========================================

searchInput.addEventListener(
    "input",
    displaySubjects
);


// ==========================================
// GRADE FILTER
// ==========================================

gradeFilter.addEventListener(
    "change",
    displaySubjects
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
// ESC KEY
// ==========================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"

            &&

            modal.classList.contains(
                "active"
            )
        ) {

            closeModal();

        }

    }
);


// ==========================================
// INITIALIZE
// ==========================================

loadSubjects();

displaySubjects();


console.log(
    "A.Kolfe Subjects Management loaded successfully."
);