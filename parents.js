// ==========================================
// A.KOLFE SECONDARY SCHOOL
// PARENTS MANAGEMENT
// ==========================================


// ==========================================
// ELEMENTS
// ==========================================

const addParentBtn =
    document.getElementById(
        "addParentBtn"
    );


const parentModal =
    document.getElementById(
        "parentModal"
    );


const closeModalBtn =
    document.getElementById(
        "closeModal"
    );


const cancelBtn =
    document.getElementById(
        "cancelBtn"
    );


const parentForm =
    document.getElementById(
        "parentForm"
    );


const parentGrid =
    document.getElementById(
        "parentGrid"
    );


const searchInput =
    document.getElementById(
        "searchInput"
    );


const relationshipFilter =
    document.getElementById(
        "relationshipFilter"
    );


// ==========================================
// LOAD PARENTS
// ==========================================

let parents =
    JSON.parse(
        localStorage.getItem(
            "kolfeParents"
        )
    ) || [

        {
            id: Date.now() + 1,

            name: "Abebe Kebede",

            relationship: "Father",

            phone: "0911223344",

            studentName: "Hana Abebe",

            studentGrade: "Grade 9",

            studentClass: "Class 1",

            address: "Kolfe"
        },


        {
            id: Date.now() + 2,

            name: "Marta Alemu",

            relationship: "Mother",

            phone: "0922334455",

            studentName: "Dawit Marta",

            studentGrade: "Grade 10",

            studentClass: "Class 2",

            address: "Alem Bank"
        },


        {
            id: Date.now() + 3,

            name: "Kebede Girma",

            relationship: "Guardian",

            phone: "0933445566",

            studentName: "Samuel Kebede",

            studentGrade: "Grade 11",

            studentClass: "Class 3",

            address: "Kolfe"
        }

    ];


// ==========================================
// SAVE
// ==========================================

function saveParents() {

    localStorage.setItem(

        "kolfeParents",

        JSON.stringify(
            parents
        )

    );

}


// ==========================================
// OPEN ADD MODAL
// ==========================================

addParentBtn.addEventListener(

    "click",

    function() {

        parentForm.reset();


        document.getElementById(
            "editId"
        ).value = "";


        document.getElementById(
            "modalTitle"
        ).textContent =
            "Add Parent";


        parentModal.classList.add(
            "active"
        );

    }

);


// ==========================================
// CLOSE MODAL
// ==========================================

function closeParentModal() {

    parentModal.classList.remove(
        "active"
    );


    parentForm.reset();


    document.getElementById(
        "editId"
    ).value = "";

}


closeModalBtn.addEventListener(

    "click",

    closeParentModal

);


cancelBtn.addEventListener(

    "click",

    closeParentModal

);


// ==========================================
// OUTSIDE CLICK
// ==========================================

parentModal.addEventListener(

    "click",

    function(event) {

        if (
            event.target ===
            parentModal
        ) {

            closeParentModal();

        }

    }

);


// ==========================================
// SAVE / UPDATE
// ==========================================

parentForm.addEventListener(

    "submit",

    function(event) {

        event.preventDefault();


        const editId =
            document.getElementById(
                "editId"
            ).value;


        const parent = {

            id:
                editId ||
                Date.now(),

            name:
                document.getElementById(
                    "parentName"
                ).value.trim(),

            relationship:
                document.getElementById(
                    "relationship"
                ).value,

            phone:
                document.getElementById(
                    "phone"
                ).value.trim(),

            studentName:
                document.getElementById(
                    "studentName"
                ).value.trim(),

            studentGrade:
                document.getElementById(
                    "studentGrade"
                ).value,

            studentClass:
                document.getElementById(
                    "studentClass"
                ).value,

            address:
                document.getElementById(
                    "address"
                ).value.trim()

        };


        // ==================================
        // CHECK DUPLICATE PHONE
        // ==================================

        const duplicate =
            parents.some(

                function(item) {

                    return (

                        item.phone ===
                            parent.phone &&

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
                "A parent with this phone number already exists."
            );

            return;

        }


        // ==================================
        // UPDATE
        // ==================================

        if (editId) {

            parents =
                parents.map(

                    function(oldParent) {

                        if (

                            String(
                                oldParent.id
                            ) ===
                            String(
                                editId
                            )

                        ) {

                            return parent;

                        }


                        return oldParent;

                    }

                );

        }


        // ==================================
        // ADD
        // ==================================

        else {

            parents.push(
                parent
            );

        }


        saveParents();

        displayParents();

        closeParentModal();

    }

);


// ==========================================
// DISPLAY
// ==========================================

function displayParents() {

    const search =
        searchInput.value
            .toLowerCase()
            .trim();


    const relationship =
        relationshipFilter.value;


    const filteredParents =
        parents.filter(

            function(parent) {

                const matchesSearch =

                    parent.name
                        .toLowerCase()
                        .includes(search)

                    ||

                    parent.phone
                        .toLowerCase()
                        .includes(search)

                    ||

                    parent.studentName
                        .toLowerCase()
                        .includes(search);


                const matchesRelationship =

                    relationship ===
                        "All"

                    ||

                    parent.relationship ===
                        relationship;


                return (

                    matchesSearch &&
                    matchesRelationship

                );

            }

        );


    parentGrid.innerHTML =
        "";


    // ==================================
    // EMPTY STATE
    // ==================================

    if (
        filteredParents.length ===
        0
    ) {

        parentGrid.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    👨‍👩‍👧
                </div>

                <h3>
                    No parents found
                </h3>

                <p>
                    Try changing your search
                    or add a new parent.
                </p>

            </div>

        `;


        updateStatistics();

        return;

    }


    // ==================================
    // CREATE CARDS
    // ==================================

    filteredParents.forEach(

        function(parent) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "parent-card";


            const initials =
                getInitials(
                    parent.name
                );


            card.innerHTML = `

                <div class="parent-header">

                    <div class="parent-avatar">
                        ${escapeHTML(initials)}
                    </div>


                    <div class="parent-actions">

                        <button
                            type="button"
                            class="action-btn"
                            onclick="editParent(${parent.id})"
                        >
                            ✏️ Edit
                        </button>


                        <button
                            type="button"
                            class="action-btn delete-btn"
                            onclick="deleteParent(${parent.id})"
                        >
                            🗑️ Delete
                        </button>

                    </div>

                </div>


                <div class="parent-name">

                    <h3>
                        ${escapeHTML(
                            parent.name
                        )}
                    </h3>


                    <span class="relationship">

                        ${escapeHTML(
                            parent.relationship
                        )}

                    </span>

                </div>


                <div class="parent-info">


                    <div class="info-row">

                        <span>
                            Phone
                        </span>

                        <strong>
                            ${escapeHTML(
                                parent.phone
                            )}
                        </strong>

                    </div>


                    <div class="info-row">

                        <span>
                            Student
                        </span>

                        <strong>
                            ${escapeHTML(
                                parent.studentName
                            )}
                        </strong>

                    </div>


                    <div class="info-row">

                        <span>
                            Grade
                        </span>

                        <strong>
                            ${escapeHTML(
                                parent.studentGrade
                            )}
                        </strong>

                    </div>


                    <div class="info-row">

                        <span>
                            Class
                        </span>

                        <strong>
                            ${escapeHTML(
                                parent.studentClass
                            )}
                        </strong>

                    </div>


                    <div class="info-row">

                        <span>
                            Address
                        </span>

                        <strong>
                            ${escapeHTML(
                                parent.address
                            )}
                        </strong>

                    </div>


                </div>

            `;


            parentGrid.appendChild(
                card
            );

        }

    );


    updateStatistics();

}


// ==========================================
// EDIT PARENT
// ==========================================

function editParent(
    id
) {

    const parent =
        parents.find(

            function(item) {

                return String(
                    item.id
                ) === String(id);

            }

        );


    if (!parent) {

        return;

    }


    document.getElementById(
        "editId"
    ).value =
        parent.id;


    document.getElementById(
        "parentName"
    ).value =
        parent.name;


    document.getElementById(
        "relationship"
    ).value =
        parent.relationship;


    document.getElementById(
        "phone"
    ).value =
        parent.phone;


    document.getElementById(
        "studentName"
    ).value =
        parent.studentName;


    document.getElementById(
        "studentGrade"
    ).value =
        parent.studentGrade;


    document.getElementById(
        "studentClass"
    ).value =
        parent.studentClass;


    document.getElementById(
        "address"
    ).value =
        parent.address;


    document.getElementById(
        "modalTitle"
    ).textContent =
        "Edit Parent";


    parentModal.classList.add(
        "active"
    );

}


// ==========================================
// DELETE PARENT
// ==========================================

function deleteParent(
    id
) {

    const parent =
        parents.find(

            function(item) {

                return String(
                    item.id
                ) === String(id);

            }

        );


    if (!parent) {

        return;

    }


    const confirmed =
        confirm(

            "Delete " +
            parent.name +
            "?\n\n" +
            "This action cannot be undone."

        );


    if (!confirmed) {

        return;

    }


    parents =
        parents.filter(

            function(item) {

                return String(
                    item.id
                ) !== String(id);

            }

        );


    saveParents();

    displayParents();

}


// ==========================================
// STATISTICS
// ==========================================

function updateStatistics() {

    document.getElementById(
        "totalParents"
    ).textContent =
        parents.length;


    document.getElementById(
        "totalFathers"
    ).textContent =

        parents.filter(

            function(parent) {

                return (
                    parent.relationship ===
                    "Father"
                );

            }

        ).length;


    document.getElementById(
        "totalMothers"
    ).textContent =

        parents.filter(

            function(parent) {

                return (
                    parent.relationship ===
                    "Mother"
                );

            }

        ).length;


    document.getElementById(
        "totalContacts"
    ).textContent =

        parents.filter(

            function(parent) {

                return (
                    parent.phone &&
                    parent.phone.trim() !== ""
                );

            }

        ).length;

}


// ==========================================
// SEARCH
// ==========================================

searchInput.addEventListener(

    "input",

    displayParents

);


// ==========================================
// FILTER
// ==========================================

relationshipFilter.addEventListener(

    "change",

    displayParents

);


// ==========================================
// GET INITIALS
// ==========================================

function getInitials(
    name
) {

    const words =
        name
            .trim()
            .split(/\s+/);


    if (
        words.length === 1
    ) {

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

            event.key === "Escape" &&

            parentModal.classList.contains(
                "active"
            )

        ) {

            closeParentModal();

        }

    }

);


// ==========================================
// INITIAL DISPLAY
// ==========================================

displayParents();


console.log(
    "A.Kolfe Parents module loaded successfully."
);