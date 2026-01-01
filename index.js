document.addEventListener("DOMContentLoaded", (event) => {
  const w_scr = document.querySelector("#wrap-scroll");
  const get_scr = () => {
    return -(w_scr.scrollWidth - window.innerWidth);
  };
  gsap.registerPlugin(ScrollTrigger, RoughEase, CustomEase, SplitText);
  const a = gsap.to(w_scr, {
    ease: "slow(0.0000000001,0.0000000001,false)",
    x: () => get_scr(),
    duration: 5,
  });
  ScrollTrigger.create({
    refreshPriority: -1,
    trigger: w_scr,
    start: "top 20%",
    end: `+=${get_scr * -1}`,
    pin: true,
    animation: a,
    invalidateOnRefresh: true,
    scrub: 195,
  });
  const goUp = (element) => {
    gsap.to(element, {
      opacity: 1,
      y: -60,
      duration: 1.5,
      scrollTrigger: {
        trigger: element,
        refreshPriority: -1,
      },
    });
  };
  const boxes = document.querySelectorAll(".provide p");
  const elements = [".m_i", ".t", ".loc"];
  elements.forEach((element) => {
    goUp(element);
  });
  boxes.forEach((element) => {
    goUp(element);
  });
  gsap.set(".text_spl", { opacity: 1 });
  let spl = SplitText.create(".text_spl", { type: "chars" });
  gsap.from(spl.chars, {
    opacity: 0,
    duration: 0.9,
    ease: "power2.in",
    stagger: 0.1,
    scrollTrigger: {
      trigger: ".text_spl",
      refreshPriority: -1,
    },
  });
  ScrollTrigger.config({
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load,resize",
  });
  gsap.to(".a", {
    y: 30,
    ease: "power3.out",
    duration: 3,
  });
});
