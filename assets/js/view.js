const starCount = 120;

for (let i = 0; i < starCount; i++) {
    const star = document.createElement("div");
    star.classList.add("star");

    const size = Math.random() * 2 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;

    star.style.top = Math.random() * window.innerHeight + "px";
    star.style.left = Math.random() * window.innerWidth + "px";

    star.style.animationDuration = Math.random() * 3 + 2 + "s";
    star.style.animationDelay = Math.random() * 5 + "s";

    document.body.appendChild(star);
}

/* Shooting star every random time */
setInterval(() => {
    const shootingStar = document.createElement("div");
    shootingStar.id = "shooting-star";

    shootingStar.style.top = Math.random() * window.innerHeight / 2 + "px";
    shootingStar.style.left = "-100px";

    document.body.appendChild(shootingStar);

    setTimeout(() => {
        shootingStar.remove();
    }, 3000);
}, 7000);