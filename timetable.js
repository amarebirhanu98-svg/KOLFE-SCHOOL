// ==========================================
// A.KOLFE SECONDARY SCHOOL
// TIMETABLE MANAGEMENT
// ==========================================


// ==========================================
// ELEMENTS
// ==========================================

const timetableBody =
    document.getElementById(
        "timetableBody"
    );


const gradeFilter =
    document.getElementById(
        "gradeFilter"
    );


const classFilter =
    document.getElementById(
        "classFilter"
    );


const addLessonBtn =
    document.getElementById(
        "addLessonBtn"
    );


const lessonModal =
    document.getElementById(
        "lessonModal"
    );


const closeModalBtn =
    document.getElementById(
        "closeModal"
    );


const cancelBtn =
    document.getElementById(
        "cancelBtn"
    );


const lessonForm =
    document.getElementById(
        "lessonForm"
    );


const lessonCount =
    document.getElementById(
        "lessonCount"
    );


const timetableTitle =
    document.getElementById(
        "timetableTitle"
    );


// ==========================================
// DAYS
// ==========================================

const days = [

    "Monday",

    "Tuesday",

    "Wednesday",

    "Thursday",

    "Friday"

];


// ==========================================
// PERIODS
// ==========================================

const periods = [

    {
        number: 1,
        time: "8:00 – 8:45"
    },

    {
        number: 2,
        time: "8:45 – 9:30"
    },

    {
        number: 3,
        time: "9:30 – 10:15"
    },

    {
        number: 4,
        time: "10:15 – 11:00"
    },

    {
        number: 5,
        time: "11:30 – 12:15"
    },

    {
        number: 6,
        time: "12:15 – 1:00"
    },

    {
        number: 7,
        time: "1:00 – 1:45"
    },

    {
        number: 8,
        time: "1:45 – 2:30"
    }

];


// ==========================================
// SUBJECTS
// ==========================================

const subjects = [

    "Mathematics",

    "Biology",

    "English",

    "Chemistry",

    "Physics",

    "HPE",

    "Citizenship"

];


// ==========================================
// LOAD TIMETABLE
// ==========================================

let lessons =
    JSON.parse(
        localStorage.getItem(
            "kolfeTimetable"
        )
    ) || [];


// ==========================================
// SAMPLE TIMETABLE
// ==========================================

if (
    lessons.length === 0
) {

    lessons = [

        {
            id: Date.now() + 1,
            grade: "Grade 9",
            classNumber: "1",
            day: "Monday",
            period: 1,
            subject: "Mathematics",
            teacher: "Abebe Teacher"
        },

        {
            id: Date.now() + 2,
            grade: "Grade 9",
            classNumber: "1",
            day: "Monday",
            period: 2,
            subject: "English",
            teacher: "Marta Teacher"
        },

        {
            id: Date.now() + 3,
            grade: "Grade 9",
            classNumber: "1",
            day: "Tuesday",
            period: 1,
            subject: "Biology",
            teacher: "Hana Teacher"
        },

        {
            id: Date.now() + 4,
            grade: "Grade 9",
            classNumber: "1",
            day: "Wednesday",
            period: 3,
            subject: "Physics",
            teacher: "Dawit Teacher"
        },

        {
            id: Date.now() + 5,
            grade: "Grade 9",
            classNumber: "1",
            day: "Thursday",
            period: 2,
            subject: "Chemistry",
            teacher: "Samuel Teacher"
        },

        {
            id: Date.now() + 6,
            grade: "Grade 9",
            classNumber: "1",
            day: "Friday",
            period: 4,
            subject: "HPE",
            teacher: "Yonas Teacher"
        }

    ];


    saveLessons();

}


// ==========================================
// SAVE
// ==========================================

function saveLessons() {

    localStorage.setItem(

        "kolfeTimetable",

        JSON.stringify(
            lessons
        )

    );

}


// ==========================================
// DISPLAY TIMETABLE
// ==========================================

function displayTimetable() {

    const selectedGrade =
        gradeFilter.value;


    const selectedClass =
        classFilter.value;


    timetableTitle.textContent =

        selectedGrade +
        " — Class " +
        selectedClass;


    const filteredLessons =
        lessons.filter(

            function(lesson) {

                return (

                    lesson.grade ===
                        selectedGrade &&

                    lesson.classNumber ===
                        selectedClass

                );

            }

        );


    lessonCount.textContent =
        filteredLessons.length;


    timetableBody.innerHTML =
        "";


    periods.forEach(

        function(periodInfo) {

            const row =
                document.createElement(
                    "tr"
                );


            // TIME

            const timeCell =
                document.createElement(
                    "td"
                );


            timeCell.className =
                "time-cell";


            timeCell.innerHTML = `

                <strong>
                    Period ${periodInfo.number}
                </strong>

                <span>
                    ${periodInfo.time}
                </span>

            `;


            row.appendChild(
                timeCell
            );


            // DAYS

            days.forEach(

                function(day) {

                    const cell =
                        document.createElement(
                            "td"
                        );


                    const lesson =
                        filteredLessons.find(

                            function(item) {

                                return (

                                    item.day ===
                                        day &&

                                    Number(
                                        item.period
                                    ) ===
                                        periodInfo.number

                                );

                            }

                        );


                    if (lesson) {

                        cell.innerHTML =
                            createLessonHTML(
                                lesson
                            );

                    }

                    else {

                        cell.innerHTML = `

                            <div class="empty-cell">
                                +
                            </div>

                        `;


                        cell.addEventListener(

                            "click",

                            function() {

                                openAddLesson(

                                    selectedGrade,

                                    selectedClass,

                                    day,

                                    periodInfo.number

                                );

                            }

                        );

                    }


                    row.appendChild(
                        cell
                    );

                }

            );


            timetableBody.appendChild(
                row
            );

        }

    );

}


// ==========================================
// CREATE LESSON HTML
// ==========================================

function createLessonHTML(
    lesson
) {

    return `

        <div
            class="lesson"
            onclick="editLesson(${lesson.id})"
        >

            <div class="lesson-subject">

                ${escapeHTML(
                    lesson.subject
                )}

            </div>


            <div class="lesson-teacher">

                👨‍🏫

                ${escapeHTML(
                    lesson.teacher
                )}

            </div>


            <div class="lesson-actions">

                <button
                    type="button"
                    onclick="event.stopPropagation(); editLesson(${lesson.id})"
                    title="Edit"
                >
                    ✏️
                </button>


                <button
                    type="button"
                    onclick="event.stopPropagation(); deleteLesson(${lesson.id})"
                    title="Delete"
                >
                    🗑️
                </button>

            </div>

        </div>

    `;

}


// ==========================================
// OPEN ADD LESSON
// ==========================================

function openAddLesson(
    grade = gradeFilter.value,
    classNumber = classFilter.value,
    day = "",
    period = ""
) {

    lessonForm.reset();


    document.getElementById(
        "editId"
    ).value = "";


    document.getElementById(
        "modalTitle"
    ).textContent =
        "Add Lesson";


    document.getElementById(
        "grade"
    ).value =
        grade;


    document.getElementById(
        "classNumber"
    ).value =
        classNumber;


    document.getElementById(
        "day"
    ).value =
        day;


    document.getElementById(
        "period"
    ).value =
        period;


    lessonModal.classList.add(
        "active"
    );

}


// ==========================================
// ADD BUTTON
// ==========================================

addLessonBtn.addEventListener(

    "click",

    function() {

        openAddLesson();

    }

);


// ==========================================
// EDIT LESSON
// ==========================================

function editLesson(
    id
) {

    const lesson =
        lessons.find(

            function(item) {

                return String(
                    item.id
                ) === String(id);

            }

        );


    if (!lesson) {

        return;

    }


    document.getElementById(
        "editId"
    ).value =
        lesson.id;


    document.getElementById(
        "grade"
    ).value =
        lesson.grade;


    document.getElementById(
        "classNumber"
    ).value =
        lesson.classNumber;


    document.getElementById(
        "day"
    ).value =
        lesson.day;


    document.getElementById(
        "period"
    ).value =
        lesson.period;


    document.getElementById(
        "subject"
    ).value =
        lesson.subject;


    document.getElementById(
        "teacher"
    ).value =
        lesson.teacher;


    document.getElementById(
        "modalTitle"
    ).textContent =
        "Edit Lesson";


    lessonModal.classList.add(
        "active"
    );

}


// ==========================================
// SAVE LESSON
// ==========================================

lessonForm.addEventListener(

    "submit",

    function(event) {

        event.preventDefault();


        const editId =
            document.getElementById(
                "editId"
            ).value;


        const lesson = {

            id:
                editId ||
                Date.now(),

            grade:
                document.getElementById(
                    "grade"
                ).value,

            classNumber:
                document.getElementById(
                    "classNumber"
                ).value,

            day:
                document.getElementById(
                    "day"
                ).value,

            period:
                Number(
                    document.getElementById(
                        "period"
                    ).value
                ),

            subject:
                document.getElementById(
                    "subject"
                ).value,

            teacher:
                document.getElementById(
                    "teacher"
                ).value.trim()

        };


        // ==================================
        // CHECK DUPLICATE PERIOD
        // ==================================

        const duplicate =
            lessons.some(

                function(item) {

                    return (

                        item.grade ===
                            lesson.grade &&

                        item.classNumber ===
                            lesson.classNumber &&

                        item.day ===
                            lesson.day &&

                        Number(
                            item.period
                        ) ===
                            Number(
                                lesson.period
                            ) &&

                        String(
                            item.id
                        ) !==
                            String(
                                editId
                            )

                    );

                }

            );


        if (duplicate) {

            alert(

                "This period already has a lesson."

            );

            return;

        }


        // ==================================
        // UPDATE
        // ==================================

        if (editId) {

            lessons =
                lessons.map(

                    function(oldLesson) {

                        if (

                            String(
                                oldLesson.id
                            ) ===
                            String(
                                editId
                            )

                        ) {

                            return lesson;

                        }


                        return oldLesson;

                    }

                );

        }


        // ==================================
        // ADD
        // ==================================

        else {

            lessons.push(
                lesson
            );

        }


        saveLessons();

        displayTimetable();

        closeLessonModal();

    }

);


// ==========================================
// DELETE LESSON
// ==========================================

function deleteLesson(
    id
) {

    const lesson =
        lessons.find(

            function(item) {

                return String(
                    item.id
                ) === String(id);

            }

        );


    if (!lesson) {

        return;

    }


    const confirmed =
        confirm(

            "Delete " +
            lesson.subject +
            " from " +
            lesson.day +
            "?\n\n" +
            "This action cannot be undone."

        );


    if (!confirmed) {

        return;

    }


    lessons =
        lessons.filter(

            function(item) {

                return String(
                    item.id
                ) !== String(id);

            }

        );


    saveLessons();

    displayTimetable();

}


// ==========================================
// CLOSE MODAL
// ==========================================

function closeLessonModal() {

    lessonModal.classList.remove(
        "active"
    );

    lessonForm.reset();

    document.getElementById(
        "editId"
    ).value = "";

}


closeModalBtn.addEventListener(

    "click",

    closeLessonModal

);


cancelBtn.addEventListener(

    "click",

    closeLessonModal

);


// ==========================================
// OUTSIDE MODAL CLICK
// ==========================================

lessonModal.addEventListener(

    "click",

    function(event) {

        if (
            event.target ===
            lessonModal
        ) {

            closeLessonModal();

        }

    }

);


// ==========================================
// FILTERS
// ==========================================

gradeFilter.addEventListener(

    "change",

    displayTimetable

);


classFilter.addEventListener(

    "change",

    displayTimetable

);


// ==========================================
// ESC KEY
// ==========================================

document.addEventListener(

    "keydown",

    function(event) {

        if (
            event.key === "Escape" &&
            lessonModal.classList.contains(
                "active"
            )
        ) {

            closeLessonModal();

        }

    }

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
// INITIAL DISPLAY
// ==========================================

displayTimetable();


console.log(
    "A.Kolfe Timetable loaded successfully."
);