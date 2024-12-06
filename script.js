import { finishedProjects, upcomingProjects } from "./projects.js";
$(document).ready(() => {
    // Constants
    const totalCerts = 3;
    let certIndex = 1;
    let darkMode = false;

    // Functions
    const changeCert = () => {
        $(".certificate").attr("src", `./images/cert_${certIndex}.png`);
        certIndex = (certIndex % totalCerts) + 1;
    };

    const toggleDarkMode = () => {
        darkMode = !darkMode;
        const rootStyles = {
            "--text-color": darkMode ? "white" : "black",
            "--background-color": darkMode ? "black" : "white",
        };

        $(":root").css(rootStyles);
        $(".radio-inner").toggleClass("active-theme");
        $(".skills-first").toggleClass("skills-first-dark");
        $(".skills-second").toggleClass("skills-second-dark");

        $(".current-projects").empty();
        Object.keys(finishedProjects).forEach((project) =>
            displayFinishedProjects(project)
        );
    };

    const fetchCurrentTime = async () => {
        try {
            const response = await $.getJSON(
                "https://timeapi.io/api/time/current/zone?timeZone=Asia/Manila"
            );
            return new Date(response.dateTime);
        } catch (err) {
            console.error("Error fetching current time:", err);
            return new Date(); // Default to local time
        }
    };

    const updateTime = (time) => {
        const dateOptions = { year: "numeric", month: "long", day: "numeric" };
        const timeOptions = { hour: "2-digit", minute: "2-digit" };
        $(".date").text(
            `${time.toLocaleDateString(
                undefined,
                dateOptions
            )} ${time.toLocaleTimeString(undefined, timeOptions)}`
        );
    };

    const initializeClock = async () => {
        let currentTime = await fetchCurrentTime();
        updateTime(currentTime);
        setInterval(() => {
            currentTime.setSeconds(currentTime.getSeconds() + 1);
            updateTime(currentTime);
        }, 1000);
    };

    const initializeMenu = () => {
        const $menuLinks = $(".menu a");
        const defaultButtonId = $menuLinks.first().attr("id");
        const activeButtonId =
            localStorage.getItem("activeButtonId") || defaultButtonId;

        $menuLinks.removeClass("active").addClass("not-active");
        $(`#${activeButtonId}`).removeClass("not-active").addClass("active");
        $(".page").hide();
        $(`#${activeButtonId.replace("-btn", "")}`).show();

        $menuLinks.on("click", function (e) {
            e.preventDefault();
            const $clickedLink = $(this);

            $menuLinks.removeClass("active").addClass("not-active");
            $clickedLink.removeClass("not-active").addClass("active");
            localStorage.setItem("activeButtonId", $clickedLink.attr("id"));

            $(".page").hide();
            $(`#${$clickedLink.attr("id").replace("-btn", "")}`).show();
        });
    };

    const displayFinishedProjects = (projectName) => {
        const project = finishedProjects[projectName];
        const $projectContainer = $(
            `<div id="${projectName}" class="project"></div>`
        );

        const renderImages = (screenType) => {
            const $imageContainer = $(`<div class="${screenType}"></div>`);
            project[screenType].forEach((image) => {
                const modifiedImage = darkMode
                    ? image.replace(/-(\d+)/, "-d$1")
                    : image;
                $imageContainer.append(
                    `<img src="${modifiedImage}" alt="${projectName}-project" class="project-image">`
                );
            });
            $projectContainer.append($imageContainer);
        };

        const renderDescription = () => {
            $projectContainer.append(`
                <div class="project-description">
                    <h1>${project.title}</h1>
                    <p>${project.description}</p>
                    <p class="project-technologies"><span>TECHNOLOGIES USED: </span>${project.technologies}</p>
                </div>
            `);
        };

        renderImages("desktop");
        renderImages("mobile");
        renderDescription();
        $(".current-projects").append($projectContainer);
    };

    const initializeProjects = () => {
        Object.keys(finishedProjects).forEach((project) =>
            displayFinishedProjects(project)
        );
    };

    const projectClick = () => {
        $(".current-projects").on("click", ".desktop, .mobile", function () {
            if ($(this).hasClass("desktop")) {
                $(this).addClass("project-expand-desktop no-hover");
            } else {
                $(this).addClass("project-expand-mobile no-hover");
            }
            $(this).children().addClass("image-expand");
            $(".overlay").fadeIn();
        });

        $(".overlay").click(function () {
            $(".project-expand-desktop").removeClass(
                "project-expand-desktop no-hover"
            );
            $(".project-expand-mobile").removeClass(
                "project-expand-mobile no-hover"
            );
            $(".image-expand").removeClass("image-expand");
            $(this).fadeOut();
        });
    };

    const displayUpcomingProjects = (projectName) => {
        const $projectContainer = $(
            `<div id="${projectName}" class="upcoming-project"></div>`
        );
        const project = upcomingProjects[projectName];

        $projectContainer.append(
            $(`<img src=${project.image} /> <h2>${project.title}</h2>`)
        );
        $(".upcoming-projects").append($projectContainer);
        console.log(project);
    };
    const InitializeUpcomingProjects = () => {
        Object.keys(upcomingProjects).forEach((project) => {
            displayUpcomingProjects(project);
        });
    };
    // Initialize
    setInterval(changeCert, 3000);
    $(".radio-btn").on("click", toggleDarkMode);
    initializeClock();
    initializeMenu();
    initializeProjects();
    InitializeUpcomingProjects();
    if ($(window).width() >= 500) {
        projectClick();
    }
});
