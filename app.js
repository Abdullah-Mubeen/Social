document.addEventListener("DOMContentLoaded", (event) => {
    gsap.registerPlugin(ScrollTrigger);

    const wrappers = document.querySelectorAll('.img-wrapper');
    const listItems = document.querySelectorAll('.list-item');

    ScrollTrigger.matchMedia({
        "(min-width: 901px)": function () {
            let proxy = { skew: 0 },
                skewSetter = gsap.quickSetter(".img-wrapper img", "skewY", "deg");

            const imageSpacing = 800;
            const totalScroll = imageSpacing * (wrappers.length - 1);

            wrappers.forEach((wrapper, i) => {
                gsap.set(wrapper, { y: i * imageSpacing, x: 0 });
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".image-container",
                    start: "top top",
                    end: "+=" + totalScroll,
                    scrub: true,
                    pin: ".image-container",
                    anticipatePin: 1,
                    onUpdate: (self) => {
                        let skew = self.getVelocity() / -700;
                        if (Math.abs(skew) > Math.abs(proxy.skew)) {
                            proxy.skew = skew;
                            gsap.to(proxy, {
                                skew: 0,
                                duration: 0.5,
                                ease: "power4.easeOut",
                                overwrite: true,
                                onUpdate: () => skewSetter(proxy.skew),
                            });
                        }
                    },
                },
            });

            tl.to(wrappers, {
                y: (i) => i * imageSpacing - totalScroll,
                ease: "none",
            });

            wrappers.forEach((wrapper, i) => {
                ScrollTrigger.create({
                    trigger: wrapper,
                    start: "top center",
                    end: "bottom center",
                    onEnter: () => activateItem(i),
                    onEnterBack: () => activateItem(i),
                });
            });
        },

        "(max-width: 900px)": function () {
            let proxy = { skew: 0 },
                skewSetter = gsap.quickSetter(".img-wrapper img", "skewX", "deg");

            const imageSpacing = 400;
            const totalScroll = imageSpacing * (wrappers.length - 1);

            wrappers.forEach((wrapper, i) => {
                gsap.set(wrapper, { x: (i + 1) * imageSpacing, y: 0 });
            });

            const activateItemOnScroll = () => {
                let minDiff = Infinity;
                let activeIndex = 0;

                wrappers.forEach((wrapper, i) => {
                    const x = gsap.getProperty(wrapper, "x"); 
                    const diff = Math.abs(x);

                    if (diff < minDiff) {
                        minDiff = diff;
                        activeIndex = i;
                    }
                });

                activateItem(activeIndex);
            };

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".image-container",
                    start: "bottom bottom",
                    end: "+=" + totalScroll,
                    scrub: true,
                    pin: ".image-container",
                    anticipatePin: 1,
                    onUpdate: (self) => {
                        let skew = self.getVelocity() / -700;
                        if (Math.abs(skew) > Math.abs(proxy.skew)) {
                            proxy.skew = skew;
                            gsap.to(proxy, {
                                skew: 0,
                                duration: 0.5,
                                ease: "power4.easeOut",
                                overwrite: true,
                                onUpdate: () => skewSetter(proxy.skew),
                            });
                        }

                        activateItemOnScroll();
                    },
                },
            });

            tl.to(wrappers, {
                x: (i) => i * imageSpacing - totalScroll,
                ease: "none",
            });
        },
    });

    function activateItem(activateIndex) {
        listItems.forEach((item, i) => {
            item.classList.toggle('active', i === activateIndex);
        });
    }

    gsap.set(".img-wrapper img", {
        transformOrigin: "center center",
        force3D: true
    });

    ScrollTrigger.refresh();
});