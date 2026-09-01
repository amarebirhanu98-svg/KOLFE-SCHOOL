// ========================================
// ANNOUNCEMENTS MANAGEMENT
// A.KOLFE SECONDARY SCHOOL
// ========================================


// ========================================
// ELEMENTS
// ========================================

const addAnnouncementBtn =
    document.getElementById("addAnnouncementBtn");

const modal =
    document.getElementById("announcementModal");

const closeModalBtn =
    document.getElementById("closeModal");

const cancelBtn =
    document.getElementById("cancelBtn");

const form =
    document.getElementById("announcementForm");

const announcementList =
    document.getElementById("announcementList");

const searchInput =
    document.getElementById("searchInput");

const categoryFilter =
    document.getElementById("categoryFilter");

const statusFilter =
    document.getElementById("statusFilter");


// ========================================
// LOAD ANNOUNCEMENTS
// ========================================

const savedAnnouncements =
    localStorage.getItem("kolfeAnnouncements");


let announcements = [];


// Use saved data if available
if (savedAnnouncements) {

    try {

        announcements =
            JSON.parse(savedAnnouncements);

        // Make sure the saved data is actually an array
        if (!Array.isArray(announcements)) {

            announcements = [];

        }

    } catch (error) {

        console.error(
            "Could not load announcements:",
            error
        );

        announcements = [];

    }

}


// ========================================
// SAMPLE DATA
// ========================================

if (announcements.length === 0) {

    announcements = [

        {
            id: Date.now() - 3000,

            title:
                "Welcome to the New Academic Year",

            category:
                "General",

            status:
                "Published",

            publishDate:
                "2019-01-01",

            audience:
                "Everyone",

            message:
                "Welcome students, teachers and parents to the new academic year at A.Kolfe Secondary School.",

            createdAt:
                new Date().toISOString()

        },


        {
            id: Date.now() - 2000,

            title:
                "First Semester Examination",

            category:
                "Exam",

            status:
                "Published",

            publishDate:
                "2019-02-15",

            audience:
                "Students",

            message:
                "Students are reminded to prepare for the upcoming first semester examination. Please check the examination schedule carefully.",

            createdAt:
                new Date().toISOString()

        },


        {
            id: Date.now() - 1000,

            title:
                "Parents Meeting",

            category:
                "Event",

            status:
                "Scheduled",

            publishDate:
                "2019-03-10",

            audience:
                "Parents",

            message:
                "A parents meeting will be held at the school. Parents are encouraged to attend and discuss student progress with teachers.",

            createdAt:
                new Date().toISOString()

        }

    ];

    saveAnnouncements();

}


// ========================================
// SAVE TO LOCAL STORAGE
// ========================================

function saveAnnouncements() {

    localStorage.setItem(
        "kolfeAnnouncements",
        JSON.stringify(announcements)
    );

}


// ========================================
// OPEN ADD MODAL
// ========================================

if (addAnnouncementBtn) {

    addAnnouncementBtn.addEventListener(
        "click",
        openAddAnnouncement
    );

}


function openAddAnnouncement() {

    form.reset();


    document.getElementById(
        "editId"
    ).value = "";


    document.getElementById(
        "modalTitle"
    ).textContent =
        "New Announcement";


    // Default status
    document.getElementById(
        "status"
    ).value =
        "Published";


    // Default audience
    document.getElementById(
        "audience"
    ).value =
        "Everyone";


    // Set today's date
    document.getElementById(
        "publishDate"
    ).value =
        getTodayDate();


    modal.classList.add("show");

}


// ========================================
// CLOSE MODAL
// ========================================

if (closeModalBtn) {

    closeModalBtn.addEventListener(
        "click",
        closeAnnouncementModal
    );

}


if (cancelBtn) {

    cancelBtn.addEventListener(
        "click",
        closeAnnouncementModal
    );

}


function closeAnnouncementModal() {

    modal.classList.remove("show");

}


// ========================================
// CLOSE MODAL WHEN CLICKING OUTSIDE
// ========================================

if (modal) {

    modal.addEventListener(
        "click",
        function (event) {

            if (event.target === modal) {

                closeAnnouncementModal();

            }

        }
    );

}


// ========================================
// ESCAPE KEY CLOSES MODAL
// ========================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            modal.classList.contains("show")
        ) {

            closeAnnouncementModal();

        }

    }
);


// ========================================
// SAVE ANNOUNCEMENT
// ========================================

if (form) {

    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const editId =
                document.getElementById(
                    "editId"
                ).value;


            const title =
                document.getElementById(
                    "announcementTitle"
                ).value.trim();


            const category =
                document.getElementById(
                    "category"
                ).value;


            const status =
                document.getElementById(
                    "status"
                ).value;


            const publishDate =
                document.getElementById(
                    "publishDate"
                ).value;


            const audience =
                document.getElementById(
                    "audience"
                ).value;


            const message =
                document.getElementById(
                    "message"
                ).value.trim();


            // ========================================
            // VALIDATION
            // ========================================

            if (
                !title ||
                !category ||
                !status ||
                !publishDate ||
                !audience ||
                !message
            ) {

                alert(
                    "Please complete all required fields."
                );

                return;

            }


            // ========================================
            // CREATE ANNOUNCEMENT OBJECT
            // ========================================

            const announcement = {

                id:
                    editId
                        ? Number(editId)
                        : Date.now(),

                title:
                    title,

                category:
                    category,

                status:
                    status,

                publishDate:
                    publishDate,

                audience:
                    audience,

                message:
                    message,

                createdAt:
                    editId
                        ? getExistingCreatedDate(
                            Number(editId)
                        )
                        : new Date().toISOString()

            };


            // ========================================
            // EDIT
            // ========================================

            if (editId) {

                const index =
                    announcements.findIndex(
                        item =>
                            Number(item.id) ===
                            Number(editId)
                    );


                if (index !== -1) {

                    announcements[index] =
                        announcement;

                }

            }


            // ========================================
            // ADD
            // ========================================

            else {

                announcements.unshift(
                    announcement
                );

            }


            // ========================================
            // SAVE + DISPLAY
            // ========================================

            saveAnnouncements();

            renderAnnouncements();

            closeAnnouncementModal();

        }
    );

}


// ========================================
// RENDER ANNOUNCEMENTS
// ========================================

function renderAnnouncements() {

    const search =
        searchInput.value
            .toLowerCase()
            .trim();


    const category =
        categoryFilter.value;


    const status =
        statusFilter.value;


    const filtered =
        announcements.filter(
            announcement => {

                const title =
                    String(
                        announcement.title || ""
                    ).toLowerCase();


                const message =
                    String(
                        announcement.message || ""
                    ).toLowerCase();


                const announcementCategory =
                    String(
                        announcement.category || ""
                    );


                const announcementStatus =
                    String(
                        announcement.status || ""
                    );


                const matchesSearch =

                    title.includes(search) ||

                    message.includes(search) ||

                    announcementCategory
                        .toLowerCase()
                        .includes(search);


                const matchesCategory =

                    category === "All" ||
                    announcementCategory === category;


                const matchesStatus =

                    status === "All" ||
                    announcementStatus === status;


                return (
                    matchesSearch &&
                    matchesCategory &&
                    matchesStatus
                );

            }
        );


    // ========================================
    // CLEAR LIST
    // ========================================

    announcementList.innerHTML = "";


    // ========================================
    // EMPTY STATE
    // ========================================

    if (filtered.length === 0) {

        announcementList.innerHTML = `

            <div class="empty">

                <div class="empty-icon">
                    📢
                </div>

                <h3>
                    No announcements found
                </h3>

                <p>
                    Try changing your search or filter.
                </p>

            </div>

        `;

        updateStatistics();

        updateResultCount(0);

        return;

    }


    // ========================================
    // DISPLAY ANNOUNCEMENTS
    // ========================================

    filtered.forEach(
        announcement => {

            const card =
                document.createElement("article");


            card.className =
                "announcement-item";


            const statusClass =
                announcement.status
                    .toLowerCase()
                    .replace(/\s+/g, "-");


            card.innerHTML = `

                <div class="announcement-top">

                    <div class="announcement-icon">
                        📢
                    </div>


                    <div class="announcement-content">

                        <div class="announcement-heading">

                            <h3>
                                ${escapeHTML(
                                    announcement.title
                                )}
                            </h3>

                            <span
                                class="status ${statusClass}">
                                ${escapeHTML(
                                    announcement.status
                                )}
                            </span>

                        </div>


                        <div class="announcement-meta">

                            <span>
                                ${escapeHTML(
                                    announcement.category
                                )}
                            </span>

                            <span>
                                •
                            </span>

                            <span>
                                ${formatDate(
                                    announcement.publishDate
                                )}
                            </span>

                            <span>
                                •
                            </span>

                            <span>
                                ${escapeHTML(
                                    announcement.audience
                                )}
                            </span>

                        </div>


                        <p class="announcement-message">

                            ${escapeHTML(
                                announcement.message
                            )}

                        </p>


                        <div class="announcement-actions">

                            <button
                                class="action-btn view-btn"
                                data-action="view"
                                data-id="${announcement.id}"
                            >
                                View
                            </button>


                            <button
                                class="action-btn edit-btn"
                                data-action="edit"
                                data-id="${announcement.id}"
                            >
                                Edit
                            </button>


                            <button
                                class="action-btn delete-btn"
                                data-action="delete"
                                data-id="${announcement.id}"
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                </div>

            `;


            announcementList.appendChild(
                card
            );

        }
    );


    // ========================================
    // UPDATE INFORMATION
    // ========================================

    updateStatistics();

    updateResultCount(
        filtered.length
    );

}


// ========================================
// RESULT COUNT
// ========================================

function updateResultCount(count) {

    const resultCount =
        document.getElementById(
            "resultCount"
        );


    if (!resultCount) {
        return;
    }


    resultCount.textContent =
        `${count} announcement${
            count === 1 ? "" : "s"
        }`;

}


// ========================================
// STATISTICS
// ========================================

function updateStatistics() {

    const total =
        announcements.length;


    const published =
        announcements.filter(
            announcement =>
                announcement.status ===
                "Published"
        ).length;


    const scheduled =
        announcements.filter(
            announcement =>
                announcement.status ===
                "Scheduled"
        ).length;


    const totalElement =
        document.getElementById(
            "totalAnnouncements"
        );


    const publishedElement =
        document.getElementById(
            "publishedAnnouncements"
        );


    const scheduledElement =
        document.getElementById(
            "scheduledAnnouncements"
        );


    if (totalElement) {

        totalElement.textContent =
            total;

    }


    if (publishedElement) {

        publishedElement.textContent =
            published;

    }


    if (scheduledElement) {

        scheduledElement.textContent =
            scheduled;

    }

}


// ========================================
// VIEW ANNOUNCEMENT
// ========================================

function viewAnnouncement(id) {

    const announcement =
        findAnnouncement(id);


    if (!announcement) {
        return;
    }


    alert(

        "Announcement Information\n\n" +

        "Title: " +
        announcement.title +

        "\n\nCategory: " +
        announcement.category +

        "\nStatus: " +
        announcement.status +

        "\nPublish Date: " +
        formatDate(
            announcement.publishDate
        ) +

        "\nAudience: " +
        announcement.audience +

        "\n\nMessage:\n" +
        announcement.message

    );

}


// ========================================
// EDIT ANNOUNCEMENT
// ========================================

function editAnnouncement(id) {

    const announcement =
        findAnnouncement(id);


    if (!announcement) {
        return;
    }


    document.getElementById(
        "editId"
    ).value =
        announcement.id;


    document.getElementById(
        "announcementTitle"
    ).value =
        announcement.title;


    document.getElementById(
        "category"
    ).value =
        announcement.category;


    document.getElementById(
        "status"
    ).value =
        announcement.status;


    document.getElementById(
        "publishDate"
    ).value =
        announcement.publishDate;


    document.getElementById(
        "audience"
    ).value =
        announcement.audience;


    document.getElementById(
        "message"
    ).value =
        announcement.message;


    document.getElementById(
        "modalTitle"
    ).textContent =
        "Edit Announcement";


    modal.classList.add("show");

}


// ========================================
// DELETE ANNOUNCEMENT
// ========================================

function deleteAnnouncement(id) {

    const announcement =
        findAnnouncement(id);


    if (!announcement) {
        return;
    }


    const confirmed =
        confirm(

            `Delete "${announcement.title}"?\n\n` +
            "This action cannot be undone."

        );


    if (!confirmed) {
        return;
    }


    announcements =
        announcements.filter(
            item =>
                Number(item.id) !==
                Number(id)
        );


    saveAnnouncements();

    renderAnnouncements();

}


// ========================================
// BUTTON ACTION HANDLER
// ========================================

if (announcementList) {

    announcementList.addEventListener(
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
                Number(
                    button.dataset.id
                );


            if (action === "view") {

                viewAnnouncement(id);

            }


            else if (action === "edit") {

                editAnnouncement(id);

            }


            else if (action === "delete") {

                deleteAnnouncement(id);

            }

        }
    );

}


// ========================================
// SEARCH
// ========================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        renderAnnouncements
    );

}


// ========================================
// CATEGORY FILTER
// ========================================

if (categoryFilter) {

    categoryFilter.addEventListener(
        "change",
        renderAnnouncements
    );

}


// ========================================
// STATUS FILTER
// ========================================

if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        renderAnnouncements
    );

}


// ========================================
// FIND ANNOUNCEMENT
// ========================================

function findAnnouncement(id) {

    return announcements.find(
        announcement =>
            Number(announcement.id) ===
            Number(id)
    );

}


// ========================================
// GET EXISTING CREATED DATE
// ========================================

function getExistingCreatedDate(id) {

    const existing =
        findAnnouncement(id);


    if (
        existing &&
        existing.createdAt
    ) {

        return existing.createdAt;

    }


    return new Date().toISOString();

}


// ========================================
// FORMAT DATE
// ========================================

function formatDate(dateString) {

    if (!dateString) {

        return "No date";

    }


    const date =
        new Date(
            dateString + "T00:00:00"
        );


    if (Number.isNaN(date.getTime())) {

        return dateString;

    }


    return date.toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );

}


// ========================================
// TODAY'S DATE
// ========================================

function getTodayDate() {

    const date =
        new Date();


    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    return (
        year +
        "-" +
        month +
        "-" +
        day
    );

}


// ========================================
// SECURITY
// PREVENT HTML INJECTION
// ========================================

function escapeHTML(value) {

    const div =
        document.createElement("div");


    div.textContent =
        String(value ?? "");


    return div.innerHTML;

}


// ========================================
// INITIAL DISPLAY
// ========================================

renderAnnouncements();