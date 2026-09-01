// ============================================
// A.KOLFE SECONDARY SCHOOL
// CLASS MANAGEMENT
// ============================================


// ELEMENTS

const addClassBtn =
    document.getElementById("addClassBtn");

const modal =
    document.getElementById("classModal");

const closeModalBtn =
    document.getElementById("closeModal");

const cancelBtn =
    document.getElementById("cancelBtn");

const form =
    document.getElementById("classForm");

const classGrid =
    document.getElementById("classGrid");

const searchInput =
    document.getElementById("searchInput");

const gradeFilter =
    document.getElementById("gradeFilter");


// ============================================
// LOAD CLASSES
// ============================================

let classes = [];

try {

    const savedClasses =
        localStorage.getItem("kolfeClasses");

    classes =
        savedClasses
            ? JSON.parse(savedClasses)
            : [];

    if (!Array.isArray(classes)) {
        classes = [];
    }

} catch (error) {

    console.error(
        "Could not load classes:",
        error
    );

    classes = [];

}


// ============================================
// DEFAULT DEMO CLASSES
// ============================================

if (classes.length === 0) {

    classes = [

        {
            id: "class-1",
            grade: "Grade 9",
            section: "9-1",
            teacher: "Abebe Teacher",
            room: "Room 1"
        },

        {
            id: "class-2",
            grade: "Grade 9",
            section: "9-2",
            teacher: "Hana Teacher",
            room: "Room 2"
        },

        {
            id: "class-3",
            grade: "Grade 10",
            section: "10-1",
            teacher: "Dawit Teacher",
            room: "Room 3"
        },

        {
            id: "class-4",
            grade: "Grade 10",
            section: "10-2",
            teacher: "Abebe Teacher",
            room: "Room 4"
        },

        {
            id: "class-5",
            grade: "Grade 11",
            section: "11-1",
            teacher: "Hana Teacher",
            room: "Room 5"
        },

        {
            id: "class-6",
            grade: "Grade 12",
            section: "12-1",
            teacher: "Dawit Teacher",
            room: "Room 6"
        }

    ];

    saveClasses();

}


// ============================================
// SAVE CLASSES
// ============================================

function saveClasses() {

    localStorage.setItem(
        "kolfeClasses",
        JSON.stringify(classes)
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
// DISPLAY CLASSES
// ============================================

function displayClasses() {

    const search =
        searchInput.value
            .toLowerCase()
            .trim();

    const selectedGrade =
        gradeFilter.value;


    const filteredClasses =
        classes.filter(function (classItem) {

            const grade =
                String(
                    classItem.grade || ""
                ).toLowerCase();

            const section =
                String(
                    classItem.section || ""
                ).toLowerCase();

            const teacher =
                String(
                    classItem.teacher || ""
                ).toLowerCase();

            const room =
                String(
                    classItem.room || ""
                ).toLowerCase();


            // SEARCH

            const matchesSearch =

                grade.includes(search) ||

                section.includes(search) ||

                teacher.includes(search) ||

                room.includes(search);


            // GRADE FILTER

            const matchesGrade =

                selectedGrade === "All" ||

                classItem.grade === selectedGrade;


            return (
                matchesSearch &&
                matchesGrade
            );

        });


    // CLEAR GRID

    classGrid.innerHTML = "";


    // NO RESULTS

    if (filteredClasses.length === 0) {

        classGrid.innerHTML = `

            <div class="empty">

                No classes found.

            </div>

        `;

        updateStatistics();

        return;

    }


    // CREATE CLASS CARDS

    filteredClasses.forEach(function (classItem) {

        const index =
            classes.indexOf(classItem);


        const card =
            document.createElement("div");


        card.className =
            "class-card";


        card.innerHTML = `

            <div class="class-card-header">

                <div>

                    <span class="class-grade">
                        ${escapeHTML(
                            classItem.grade
                        )}
                    </span>

                    <h2>
                        ${escapeHTML(
                            classItem.section
                        )}
                    </h2>

                </div>

                <span class="class-icon">
                    🏫
                </span>

            </div>


            <div class="class-info">

                <div class="info-item">

                    <span>
                        👨‍🏫
                    </span>

                    <div>

                        <small>
                            Class Teacher
                        </small>

                        <strong>
                            ${escapeHTML(
                                classItem.teacher
                            )}
                        </strong>

                    </div>

                </div>


                <div class="info-item">

                    <span>
                        🚪
                    </span>

                    <div>

                        <small>
                            Room
                        </small>

                        <strong>
                            ${escapeHTML(
                                classItem.room
                            )}
                        </strong>

                    </div>

                </div>

            </div>


            <div class="class-actions">

                <button
                    type="button"
                    class="action-btn view-btn"
                    onclick="viewClass(${index})"
                >
                    View
                </button>


                <button
                    type="button"
                    class="action-btn edit-btn"
                    onclick="editClass(${index})"
                >
                    Edit
                </button>


                <button
                    type="button"
                    class="action-btn delete-btn"
                    onclick="deleteClass(${index})"
                >
                    Delete
                </button>

            </div>

        `;


        classGrid.appendChild(card);

    });


    updateStatistics();

}


// ============================================
// STATISTICS
// ============================================

function updateStatistics() {

    // TOTAL CLASSES

    document.getElementById(
        "totalClasses"
    ).textContent =
        classes.length;


    // GRADE 9

    document.getElementById(
        "grade9"
    ).textContent =

        classes.filter(function (classItem) {

            return classItem.grade === "Grade 9";

        }).length;


    // GRADE 10

    document.getElementById(
        "grade10"
    ).textContent =

        classes.filter(function (classItem) {

            return classItem.grade === "Grade 10";

        }).length;


    // GRADE 11 + 12

    document.getElementById(
        "grade1112"
    ).textContent =

        classes.filter(function (classItem) {

            return (

                classItem.grade === "Grade 11" ||

                classItem.grade === "Grade 12"

            );

        }).length;

}


// ============================================
// OPEN ADD CLASS MODAL
// ============================================

function openAddClass() {

    form.reset();


    document.getElementById(
        "editId"
    ).value = "";


    document.getElementById(
        "modalTitle"
    ).textContent =
        "Add Class";


    modal.classList.add("show");


    document.getElementById(
        "grade"
    ).focus();

}


if (addClassBtn) {

    addClassBtn.addEventListener(
        "click",
        openAddClass
    );

}


// ============================================
// CLOSE MODAL
// ============================================

function closeClassModal() {

    modal.classList.remove("show");

}


if (closeModalBtn) {

    closeModalBtn.addEventListener(
        "click",
        closeClassModal
    );

}


if (cancelBtn) {

    cancelBtn.addEventListener(
        "click",
        closeClassModal
    );

}


// ============================================
// CLOSE WHEN CLICKING OUTSIDE
// ============================================

if (modal) {

    modal.addEventListener(
        "click",
        function (event) {

            if (event.target === modal) {

                closeClassModal();

            }

        }
    );

}


// ============================================
// ESC KEY
// ============================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            modal.classList.contains("show")
        ) {

            closeClassModal();

        }

    }
);


// ============================================
// SAVE CLASS
// ============================================

form.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const editId =
            document.getElementById(
                "editId"
            ).value;


        const grade =
            document.getElementById(
                "grade"
            ).value;


        const section =
            document.getElementById(
                "section"
            ).value.trim();


        const teacher =
            document.getElementById(
                "teacher"
            ).value.trim();


        const room =
            document.getElementById(
                "room"
            ).value.trim();


        // ========================================
        // VALIDATION
        // ========================================

        if (
            !grade ||
            !section ||
            !teacher ||
            !room
        ) {

            alert(
                "Please complete all fields."
            );

            return;

        }


        // ========================================
        // CHECK DUPLICATE SECTION
        // ========================================

        const duplicate =
            classes.some(function (
                classItem,
                index
            ) {

                if (
                    String(index) ===
                    String(editId)
                ) {

                    return false;

                }


                return (

                    classItem.grade === grade &&

                    classItem.section
                        .toLowerCase() ===
                    section.toLowerCase()

                );

            });


        if (duplicate) {

            alert(
                "This class section already exists."
            );

            return;

        }


        // ========================================
        // CLASS OBJECT
        // ========================================

        const classData = {

            id:
                editId !== ""
                    ? classes[
                        Number(editId)
                    ].id
                    : "class-" + Date.now(),

            grade: grade,

            section: section,

            teacher: teacher,

            room: room

        };


        // ========================================
        // EDIT
        // ========================================

        if (editId !== "") {

            classes[
                Number(editId)
            ] = classData;


            alert(
                "Class updated successfully."
            );

        }


        // ========================================
        // ADD
        // ========================================

        else {

            classes.push(classData);


            alert(
                "Class added successfully."
            );

        }


        // SAVE

        saveClasses();


        // DISPLAY

        displayClasses();


        // CLOSE

        closeClassModal();

    }
);


// ============================================
// EDIT CLASS
// ============================================

function editClass(index) {

    const classItem =
        classes[index];


    if (!classItem) {

        return;

    }


    document.getElementById(
        "editId"
    ).value =
        index;


    document.getElementById(
        "grade"
    ).value =
        classItem.grade || "";


    document.getElementById(
        "section"
    ).value =
        classItem.section || "";


    document.getElementById(
        "teacher"
    ).value =
        classItem.teacher || "";


    document.getElementById(
        "room"
    ).value =
        classItem.room || "";


    document.getElementById(
        "modalTitle"
    ).textContent =
        "Edit Class";


    modal.classList.add("show");


    document.getElementById(
        "grade"
    ).focus();

}


// ============================================
// VIEW CLASS
// ============================================

function viewClass(index) {

    const classItem =
        classes[index];


    if (!classItem) {

        return;

    }


    alert(

        "Class Information\n\n" +

        "Grade: " +
        (classItem.grade || "") +

        "\n\nSection: " +
        (classItem.section || "") +

        "\n\nClass Teacher: " +
        (classItem.teacher || "") +

        "\n\nRoom: " +
        (classItem.room || "")

    );

}


// ============================================
// DELETE CLASS
// ============================================

function deleteClass(index) {

    const classItem =
        classes[index];


    if (!classItem) {

        return;

    }


    const confirmed =
        confirm(

            `Delete ${classItem.grade} ` +
            `${classItem.section}?\n\n` +

            "This action cannot be undone."

        );


    if (!confirmed) {

        return;

    }


    classes.splice(
        index,
        1
    );


    saveClasses();


    displayClasses();


    alert(
        "Class deleted successfully."
    );

}


// ============================================
// SEARCH
// ============================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        displayClasses
    );

}


// ============================================
// GRADE FILTER
// ============================================

if (gradeFilter) {

    gradeFilter.addEventListener(
        "change",
        displayClasses
    );

}


// ============================================
// INITIAL DISPLAY
// ============================================

displayClasses();