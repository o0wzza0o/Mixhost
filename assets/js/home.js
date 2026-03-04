document.addEventListener('DOMContentLoaded', () => {

    /* ─── Mobile Menu Toggle (Logo Click) ─────────── */
    const menuToggle = document.getElementById('menu-toggle');
    const leftLinks = document.querySelector('.left-links');
    const rightLinks = document.querySelector('.right-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            leftLinks.classList.toggle('open');
            rightLinks.classList.toggle('open');
        });

        // Close menu when a link is clicked
        document.querySelectorAll('.left-links a, .right-links a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                leftLinks.classList.remove('open');
                rightLinks.classList.remove('open');
            });
        });
    }

    /* ─── Stars ─────────────────────────────────────── */
    const starCount = 200;
    const body = document.body;
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        const size = Math.random() * 3 + 2;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.animationDuration = `${Math.random() * 3 + 2}s`;
        star.style.animationDelay = `${Math.random() * 5}s`;
        body.appendChild(star);
    }

    /* ─── Team Tree ──────────────────────────────────── */
    loadTeam();

    /* ─── Services Carousel ──────────────────────────── */
    loadServices();

    /* ─── ScrollSpy (Active Nav Links) ───────────────── */
    setupScrollSpy();

    /* ─── Typewriter Effect (Loop) ────────────────── */
    const typewriterEl = document.getElementById('typewriter');
    if (typewriterEl) {
        const fullText = typewriterEl.getAttribute('data-text');
        typewriterEl.classList.add('typing');

        function typeText(callback) {
            let i = 0;
            function next() {
                if (i < fullText.length) {
                    typewriterEl.textContent += fullText.charAt(i);
                    i++;
                    setTimeout(next, 65);
                } else {
                    setTimeout(callback, 2000); // pause after typing
                }
            }
            next();
        }

        function eraseText(callback) {
            function next() {
                if (typewriterEl.textContent.length > 0) {
                    typewriterEl.textContent = typewriterEl.textContent.slice(0, -1);
                    setTimeout(next, 35);
                } else {
                    setTimeout(callback, 1000); // pause after erasing
                }
            }
            next();
        }

        function loop() {
            typeText(() => eraseText(() => loop()));
        }

        setTimeout(loop, 600);
    }

    /* ─── Scroll Reveal (Intersection Observer) ───── */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add stagger delay for child elements
                const el = entry.target;
                if (el.classList.contains('reveal-child')) {
                    const siblings = [...el.parentElement.querySelectorAll('.reveal-child')];
                    const i = siblings.indexOf(el);
                    el.style.transitionDelay = `${i * 0.15}s`;
                }
                el.classList.add('active');
                revealObserver.unobserve(el); // only animate once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all static .reveal and .reveal-child elements
    document.querySelectorAll('.reveal, .reveal-child').forEach(el => {
        revealObserver.observe(el);
    });

    // Watch for dynamically added elements (team branches)
    const orgTree = document.getElementById('org-tree');
    if (orgTree) {
        const mutationObs = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        if (node.classList.contains('reveal')) {
                            revealObserver.observe(node);
                        }
                        node.querySelectorAll?.('.reveal, .reveal-child')?.forEach(child => {
                            revealObserver.observe(child);
                        });
                    }
                });
            });
        });
        mutationObs.observe(orgTree, { childList: true, subtree: true });
    }
});

async function loadTeam() {
    const container = document.getElementById('org-tree');
    if (!container) return;

    let members;
    try {
        const res = await fetch('assets/data/team.json');
        if (!res.ok) throw new Error('Failed to fetch team.json');
        members = await res.json();
    } catch (err) {
        console.error('Team load error:', err);
        return;
    }

    const sides = ['right', 'left'];

    members.forEach((m, i) => {
        const side = sides[i % 2];
        const branch = buildBranch(m, side);
        container.insertAdjacentHTML('beforeend', branch);
    });
}

function buildBranch(m, side) {
    const avatarHTML = m.photo
        ? `<img src="${m.photo}" alt="${m.name}">`
        : `<i class="fa-solid fa-user-secret"></i>`;

    const avatarClass = m.photo ? 'mc-avatar' : 'mc-avatar placeholder';

    const skillsHTML = m.skills.map(s =>
        `<span>${s.icon ? `<i class="${s.icon}"></i>` : ''} ${s.label}</span>`
    ).join('');

    const projectsBtn = m.projectsUrl
        ? `<button class="mc-btn glow" onclick="location.href='${m.projectsUrl}'"><i class="fa-solid fa-eye"></i> Projects</button>`
        : `<button class="mc-btn glow"><i class="fa-solid fa-eye"></i> Projects</button>`;

    const card = `
        <div class="member-card" style="--clr:${m.color}">
            <div class="${avatarClass}">
                ${avatarHTML}
                <span class="mc-status"></span>
            </div>
            <h3 class="mc-name">${m.name}</h3>
            <p class="mc-role"><i class="${m.roleIcon}"></i> ${m.role}</p>
            <div class="mc-skills">${skillsHTML}</div>
            <div class="mc-btns">
                <button class="mc-btn ghost"><i class="fa-solid fa-envelope"></i> Contact</button>
                ${projectsBtn}
            </div>
        </div>`;

    if (side === 'right') {
        return `
        <div class="org-branch right reveal" style="--clr:${m.color}">
            <div class="b-empty"></div>
            <div class="b-dot-col"><span class="b-dot"></span></div>
            <div class="b-card-col">
                <div class="b-line"></div>
                ${card}
            </div>
        </div>`;
    } else {
        return `
        <div class="org-branch left reveal" style="--clr:${m.color}">
            <div class="b-card-col reverse">
                ${card}
                <div class="b-line"></div>
            </div>
            <div class="b-dot-col"><span class="b-dot"></span></div>
            <div class="b-empty"></div>
        </div>`;
    }
}

async function loadServices() {
    const track1 = document.getElementById('services-track-1');
    const track2 = document.getElementById('services-track-2');

    if (!track1 || !track2) return;

    try {
        const res = await fetch('assets/data/services.json');
        if (!res.ok) throw new Error('Failed to fetch services.json');

        const data = await res.json();

        // Helper function to build HTML for a track
        const buildTrackHTML = (items) => {
            let html = '';
            // We append the list twice for the infinite scroll effect
            for (let j = 0; j < 2; j++) {
                items.forEach(item => {
                    html += `<div class="carousel-item">${item.name} <i class="${item.icon}"></i></div>`;
                });
            }
            return html;
        };

        track1.innerHTML = buildTrackHTML(data.track1);
        track2.innerHTML = buildTrackHTML(data.track2);

    } catch (err) {
        console.error('Services load error:', err);
    }
}

/* ─── Scroll Spy Function ─────────────────────── */
function setupScrollSpy() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-container a');

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Trigger when section is cleanly in view
        threshold: 0
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Get the id of the intersecting section
                const currentId = entry.target.getAttribute('id');

                // Remove active class from all links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    // If the link href matches the section id, add active class
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        scrollObserver.observe(section);
    });
}
