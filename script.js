document.addEventListener('DOMContentLoaded', () => {
    // document.getElementById("nav-links").addEventListener('click', e => {
    //     console.log("Event Type:", e.type);
    //     console.log("Target Element:", e.target.id);
    //     console.log("Target Element Tag Name:", e.target.tagName);
    //     console.log("Event Details:", e);
    // });
    document.getElementById("nav-links").addEventListener('click', e => {
        if(e.target.id !== "home-link") {
            showOrHide(e.target.id);
        } else {
            hideAll();
        }
    });

    document.getElementById("whoami").addEventListener('click', () => {
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            if (section.id !== 'home') {
                section.classList.toggle('hidden');
            }
        });
    })
});

const hideAll = () => {
    // Select all section elements
    const sections = document.querySelectorAll('section');
    
    // Loop through each section and add the 'hidden' class
    sections.forEach(section => {
        if (section.id !== 'home') {
            section.classList.add('hidden');
        }
    });
}

const showOrHide  = link => {
    const linkId = document.getElementById(link).href;
    const urlObject = new URL(linkId);
    const fragment = urlObject.hash.substring(1);
    const item = document.getElementById(fragment);
    console.log(link);
    item.classList.toggle('hidden');
}