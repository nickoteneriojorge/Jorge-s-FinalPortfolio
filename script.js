/* =========================================
   NICKO JORGE PORTFOLIO
========================================= */

const MAX_IMAGES = 10;

const categories = [
    "assignment",
    "seatwork",
    "activity",
    "quiz",
    "longquiz",
    "laboratory",
    "midterm",
    "finalexam"
];


/* =========================================
   PAGE LOAD
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    categories.forEach(function (category) {
        displayImages(category);
    });

    updateHomeCounters();

    setupSearch();

    setupNavigation();

});


/* =========================================
   CHECK IMAGE FILE
========================================= */

function isImage(file) {

    return (
        file &&
        file.type &&
        file.type.startsWith("image/")
    );

}


/* =========================================
   UPLOAD IMAGES
========================================= */

function uploadImages(event, category) {

    const input = event.target;

    const files = Array.from(input.files);

    if (files.length === 0) {
        return;
    }


    let images =
        JSON.parse(
            localStorage.getItem(category)
        ) || [];


    const remaining =
        MAX_IMAGES - images.length;


    if (remaining <= 0) {

        alert(
            "This category already contains 10 images."
        );

        input.value = "";

        return;
    }


    if (files.length > remaining) {

        alert(
            "You can only add " +
            remaining +
            " more image(s).\n\n" +
            "Maximum is 10 images per category."
        );

        input.value = "";

        return;
    }


    for (let i = 0; i < files.length; i++) {

        if (!isImage(files[i])) {

            alert(
                "Only image files can be uploaded."
            );

            input.value = "";

            return;
        }

    }


    let completed = 0;


    files.forEach(function (file) {

        const reader = new FileReader();


        reader.onload = function (event) {

            images.push(
                event.target.result
            );

            completed++;


            if (
                completed ===
                files.length
            ) {

                localStorage.setItem(
                    category,
                    JSON.stringify(images)
                );


                displayImages(category);

                updateHomeCounters();

            }

        };


        reader.onerror = function () {

            alert(
                "There was a problem reading an image."
            );

        };


        reader.readAsDataURL(file);

    });


    input.value = "";

}


/* =========================================
   DISPLAY IMAGES
========================================= */

function displayImages(category) {

    const gallery =
        document.getElementById(category);


    const counter =
        document.getElementById(
            category + "-counter"
        );


    if (!gallery || !counter) {
        return;
    }


    const images =
        JSON.parse(
            localStorage.getItem(category)
        ) || [];


    counter.textContent =
        images.length +
        " / " +
        MAX_IMAGES +
        " images";


    gallery.innerHTML = "";


    if (images.length === 0) {

        gallery.innerHTML = `
            <div class="empty">
                No images uploaded yet.
            </div>
        `;

        return;
    }


    images.forEach(
        function (image, index) {

            const item =
                document.createElement("div");

            item.className =
                "image-item";


            const img =
                document.createElement("img");

            img.src = image;

            img.alt =
                category +
                " image " +
                (index + 1);

            img.loading = "lazy";


            img.onclick = function () {

                openModal(image);

            };


            const deleteButton =
                document.createElement("button");

            deleteButton.className =
                "delete-image";

            deleteButton.textContent =
                "×";

            deleteButton.title =
                "Delete image";


            deleteButton.onclick =
                function (event) {

                    event.stopPropagation();

                    deleteImage(
                        category,
                        index
                    );

                };


            item.appendChild(img);

            item.appendChild(
                deleteButton
            );

            gallery.appendChild(item);

        }
    );

}


/* =========================================
   DELETE IMAGE
========================================= */

function deleteImage(
    category,
    index
) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this image?"
        );


    if (!confirmed) {
        return;
    }


    let images =
        JSON.parse(
            localStorage.getItem(category)
        ) || [];


    images.splice(
        index,
        1
    );


    localStorage.setItem(
        category,
        JSON.stringify(images)
    );


    displayImages(category);

    updateHomeCounters();

}


/* =========================================
   HOME CATEGORY COUNTERS
========================================= */

function updateHomeCounters() {

    let total = 0;


    categories.forEach(
        function (category) {

            const images =
                JSON.parse(
                    localStorage.getItem(category)
                ) || [];


            total += images.length;


            const homeCounter =
                document.getElementById(
                    "home-" + category
                );


            if (homeCounter) {

                homeCounter.textContent =
                    images.length +
                    (
                        images.length === 1
                            ? " image"
                            : " images"
                    );

            }

        }
    );


    const totalImages =
        document.getElementById(
            "totalImages"
        );


    if (totalImages) {

        totalImages.textContent =
            total;

    }

}


/* =========================================
   IMAGE MODAL
========================================= */

function openModal(image) {

    const modal =
        document.getElementById(
            "imageModal"
        );


    const modalImage =
        document.getElementById(
            "modalImage"
        );


    modalImage.src =
        image;


    modal.style.display =
        "flex";


    document.body.style.overflow =
        "hidden";

}


/* =========================================
   CLOSE IMAGE MODAL
========================================= */

function closeModal() {

    const modal =
        document.getElementById(
            "imageModal"
        );


    const modalImage =
        document.getElementById(
            "modalImage"
        );


    modal.style.display =
        "none";


    modalImage.src =
        "";


    document.body.style.overflow =
        "";

}


/* =========================================
   IMAGE MODAL BACKGROUND CLICK
========================================= */

document
    .getElementById("imageModal")
    .addEventListener(
        "click",
        function (event) {

            if (
                event.target === this
            ) {

                closeModal();

            }

        }
    );


/* =========================================
   STATIC FILE VIEWER
========================================= */

function openStaticFile(
    filePath,
    fileName
) {

    const modal =
        document.getElementById(
            "staticFileModal"
        );


    const title =
        document.getElementById(
            "staticFileTitle"
        );


    const imageViewer =
        document.getElementById(
            "staticImageViewer"
        );


    const pdfViewer =
        document.getElementById(
            "staticPdfViewer"
        );


    const unsupported =
        document.getElementById(
            "unsupportedFile"
        );


    /* Reset viewers */

    imageViewer.style.display =
        "none";

    pdfViewer.style.display =
        "none";

    unsupported.style.display =
        "none";


    imageViewer.src =
        "";

    pdfViewer.src =
        "";


    title.textContent =
        fileName;


    const extension =
        fileName
            .split(".")
            .pop()
            .toLowerCase();


    const imageTypes = [
        "jpg",
        "jpeg",
        "png",
        "gif",
        "webp",
        "bmp",
        "svg"
    ];


    /* =====================================
       IMAGE
    ====================================== */

    if (
        imageTypes.includes(
            extension
        )
    ) {

        imageViewer.src =
            filePath;

        imageViewer.style.display =
            "block";

    }


    /* =====================================
       PDF
    ====================================== */

    else if (
        extension === "pdf"
    ) {

        pdfViewer.src =
            filePath;

        pdfViewer.style.display =
            "block";

    }


    /* =====================================
       UNSUPPORTED
    ====================================== */

    else {

        unsupported.style.display =
            "block";

    }


    modal.classList.add("show");

    document.body.style.overflow =
        "hidden";

}


/* =========================================
   CLOSE STATIC FILE
========================================= */

function closeStaticFile() {

    const modal =
        document.getElementById(
            "staticFileModal"
        );


    const imageViewer =
        document.getElementById(
            "staticImageViewer"
        );


    const pdfViewer =
        document.getElementById(
            "staticPdfViewer"
        );


    modal.classList.remove(
        "show"
    );


    imageViewer.src =
        "";


    pdfViewer.src =
        "";


    document.body.style.overflow =
        "";

}


/* =========================================
   STATIC FILE MODAL BACKGROUND CLICK
========================================= */

document.addEventListener(
    "click",
    function (event) {

        const modal =
            document.getElementById(
                "staticFileModal"
            );


        if (
            event.target === modal
        ) {

            closeStaticFile();

        }

    }
);


/* =========================================
   ESC KEY
========================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            closeModal();

            closeStaticFile();

        }

    }
);


/* =========================================
   SEARCH
========================================= */

function setupSearch() {

    const input =
        document.getElementById(
            "searchInput"
        );


    const cards =
        document.querySelectorAll(
            ".work-card"
        );


    const noResults =
        document.getElementById(
            "noResults"
        );


    input.addEventListener(
        "input",
        function () {

            const search =
                this.value
                    .toLowerCase()
                    .trim();


            let visible = 0;


            cards.forEach(
                function (card) {

                    const name =
                        card.dataset.name
                            .toLowerCase();


                    const title =
                        card
                            .querySelector("h3")
                            .textContent
                            .toLowerCase();


                    if (
                        name.includes(search) ||
                        title.includes(search)
                    ) {

                        card.style.display =
                            "";

                        visible++;

                    }

                    else {

                        card.style.display =
                            "none";

                    }

                }
            );


            if (
                visible === 0
            ) {

                noResults.style.display =
                    "block";

            }

            else {

                noResults.style.display =
                    "none";

            }

        }
    );

}


/* =========================================
   NAVIGATION ACTIVE STATE
========================================= */

function setupNavigation() {

    const links =
        document.querySelectorAll(
            ".nav-link"
        );


    window.addEventListener(
        "scroll",
        function () {

            let current = "";


            const sections =
                document.querySelectorAll(
                    "section[id]"
                );


            sections.forEach(
                function (section) {

                    const top =
                        section.offsetTop -
                        150;


                    if (
                        window.scrollY >=
                        top
                    ) {

                        current =
                            section.id;

                    }

                }
            );


            links.forEach(
                function (link) {

                    link.classList.remove(
                        "active"
                    );


                    if (
                        link.getAttribute("href") ===
                        "#" + current
                    ) {

                        link.classList.add(
                            "active"
                        );

                    }

                }
            );

        }
    );

}

function closeStaticModal() {
  const modal = document.getElementById("staticFileModal");
  modal.classList.remove("show");
  document.body.style.overflow = "auto";
}