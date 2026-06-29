export const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);

    if (!section) return;

    section.scrollIntoView({
        behavior: "smooth",
        block: "start",
    });

    const observer = new IntersectionObserver(
        ([entry], obs) => {
            if (!entry.isIntersecting) return;

            section.classList.remove("section-highlight");

            // Restart animation
            void section.offsetWidth;

            section.classList.add("section-highlight");

            // Stop observing
            obs.disconnect();
        },
        {
            threshold: 0.6,
        }
    );

    observer.observe(section);
};

export const navigateToSection = (sectionId, navigate, homePath = "/") => {
    navigate(homePath, {
        state: { scrollTo: sectionId },
    });
};
