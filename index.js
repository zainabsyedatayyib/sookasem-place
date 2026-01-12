/**
 * ============================================================================
 * SOOKASEM PLACE - Animation Controller
 * ============================================================================
 * 
 * This file handles all scroll-based animations using GSAP (GreenSock Animation
 * Platform) and its ScrollTrigger plugin. The animations create an engaging,
 * modern feel as users scroll through the page.
 * 
 * Dependencies:
 *   - GSAP Core (gsap.min.js)
 *   - ScrollTrigger Plugin - triggers animations based on scroll position
 *   - SplitText Plugin - splits text into individual characters for animation
 *   - CustomEase Plugin - allows custom easing curves
 * 
 * @author Zainab Syeda Tayyab
 * @see https://greensock.com/docs/ for GSAP documentation
 */

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Wait for the DOM to be fully loaded before running animations.
 * This ensures all elements exist before we try to animate them.
 * 
 * Why DOMContentLoaded instead of 'load'?
 *   - 'DOMContentLoaded' fires when HTML is parsed (faster)
 *   - 'load' waits for ALL resources (images, etc.) to finish
 *   - We only need the DOM structure, not images, so this is faster
 */
document.addEventListener("DOMContentLoaded", (event) => {

  // ============================================================================
  // HORIZONTAL SCROLL ANIMATION - "Near Us" Section
  // ============================================================================
  
  /**
   * This section creates a horizontal scrolling gallery effect.
   * As the user scrolls DOWN, the content moves LEFT horizontally.
   * This creates an engaging "showcase" feel for the nearby locations.
   */

  // Get the container that holds all the scrolling images
  const w_scr = document.querySelector("#wrap-scroll");

  /**
   * Calculate how far the content needs to scroll horizontally.
   * 
   * Formula: -(scrollWidth - windowWidth)
   *   - scrollWidth: Total width of ALL content inside the container
   *   - innerWidth: Width of the visible browser window
   *   - The difference tells us how much content is "hidden" off-screen
   *   - We make it NEGATIVE because we're moving content to the LEFT
   * 
   * @returns {number} The negative pixel distance to scroll
   * 
   * Example: If content is 3000px wide and window is 1200px:
   *          -(3000 - 1200) = -1800px (scroll left by 1800 pixels)
   */
  const get_scr = () => {
    return -(w_scr.scrollWidth - window.innerWidth);
  };

  // ----------------------------------------------------------------------------
  // Register GSAP Plugins
  // ----------------------------------------------------------------------------
  
  /**
   * GSAP plugins must be registered before use.
   * This tells GSAP to load these extra features:
   * 
   *   - ScrollTrigger: Connects animations to scroll position
   *   - RoughEase: Creates "shaky" or rough animation curves
   *   - CustomEase: Define your own bezier easing curves
   *   - SplitText: Splits text into chars/words/lines for animation
   */
  gsap.registerPlugin(ScrollTrigger, RoughEase, CustomEase, SplitText);

  // ----------------------------------------------------------------------------
  // Create the Horizontal Scroll Animation
  // ----------------------------------------------------------------------------
  
  /**
   * Define the horizontal movement animation.
   * 
   * gsap.to() = Animate FROM current state TO these values
   * 
   * Properties:
   *   - ease: "slow(0.0000000001, 0.0000000001, false)"
   *           Creates an almost LINEAR ease (very subtle slowdown)
   *           Parameters: (power, ratio, yoyoMode)
   *           Near-zero values = nearly constant speed
   * 
   *   - x: The horizontal position to animate to
   *        Using a function () => get_scr() so it recalculates on resize
   * 
   *   - duration: Base duration (ScrollTrigger's scrub overrides this)
   */
  const a = gsap.to(w_scr, {
    ease: "slow(0.0000000001,0.0000000001,false)",
    x: () => get_scr(),
    duration: 5,
  });

  /**
   * Connect the animation to scroll position with ScrollTrigger.
   * 
   * This is the "magic" that makes scrolling control the animation!
   * 
   * Properties explained:
   * 
   *   refreshPriority: -1
   *     - Lower priority = refreshes later
   *     - Negative values refresh AFTER default (0) triggers
   *     - Prevents conflicts with other ScrollTriggers
   * 
   *   trigger: w_scr
   *     - The element that triggers the animation
   *     - Animation starts/ends based on THIS element's position
   * 
   *   start: "top 20%"
   *     - When to START the animation
   *     - "top 20%" = when the TOP of #wrap-scroll reaches 20% from viewport top
   *     - Format: "[trigger position] [viewport position]"
   * 
   *   end: `+=${get_scr * -1}`
   *     - When to END the animation (how far to scroll)
   *     - `+=` means "add this distance to the start point"
   *     - get_scr * -1 converts back to positive (scroll distance)
   * 
   *   pin: true
   *     - PINS the trigger element in place while animating
   *     - The #wrap-scroll stays fixed as content scrolls through it
   *     - Creates the "horizontal scroll while pinned" effect
   * 
   *   animation: a
   *     - Links our horizontal movement animation (defined above)
   * 
   *   invalidateOnRefresh: true
   *     - Recalculates values when ScrollTrigger refreshes
   *     - Important for responsive design (window resizing)
   * 
   *   scrub: 195
   *     - Links animation progress directly to scroll position
   *     - Number = smoothing time in milliseconds (0.195 seconds)
   *     - Higher value = smoother but more "laggy" feel
   *     - Creates that smooth, satisfying scroll-linked animation
   */
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

  // ============================================================================
  // FADE-UP ANIMATIONS - Content Reveal Effect
  // ============================================================================

  /**
   * Creates a "fade up" animation for elements as they scroll into view.
   * Elements start invisible and below their final position, then fade in
   * while moving upward. This creates a pleasant reveal effect.
   * 
   * @param {string|Element} element - CSS selector or DOM element to animate
   * 
   * Animation properties:
   *   - opacity: 1       → Fade from invisible to fully visible
   *   - y: -60           → Move UP by 60 pixels (negative = up)
   *   - duration: 1.5    → Animation takes 1.5 seconds
   * 
   * Note: Elements should have initial CSS of:
   *       opacity: 0; transform: translateY(60px);
   *       (or GSAP will animate from current state)
   */
  const goUp = (element) => {
    gsap.to(element, {
      opacity: 1,
      y: -60,
      duration: 1.5,
      scrollTrigger: {
        trigger: element,        // Start when THIS element enters viewport
        refreshPriority: -1,     // Lower priority to prevent conflicts
        // Uses default start: "top bottom" (when element top hits viewport bottom)
      },
    });
  };

  // ----------------------------------------------------------------------------
  // Apply Fade-Up to Multiple Elements
  // ----------------------------------------------------------------------------

  /**
   * Get all paragraph elements in the "What We Provide" section.
   * Each amenity (WIFI, Telephone, etc.) will fade up individually.
   */
  const boxes = document.querySelectorAll(".provide p");

  /**
   * Array of CSS selectors for other elements that should fade up:
   *   - ".m_i"  → "MORE INFO" heading
   *   - ".t"    → The pricing table
   *   - ".loc"  → "LOCATION" heading
   */
  const elements = [".m_i", ".t", ".loc"];

  // Apply the fade-up animation to each element
  elements.forEach((element) => {
    goUp(element);
  });

  // Apply fade-up to each "provide" paragraph
  boxes.forEach((element) => {
    goUp(element);
  });

  // ============================================================================
  // TEXT SPLIT ANIMATION - Character-by-Character Reveal
  // ============================================================================

  /**
   * This creates a dramatic "typewriter" effect for the rental price text.
   * Each character fades in one at a time, drawing attention to the price.
   */

  /**
   * Step 1: Ensure the text is visible before we start.
   * gsap.set() = Immediately set properties (no animation)
   * 
   * Why? The text might be hidden initially to prevent "flash of
   * unstyled content". We make it visible right before animating.
   */
  gsap.set(".text_spl", { opacity: 1 });

  /**
   * Step 2: Split the text into individual characters.
   * 
   * SplitText.create() breaks text into animatable pieces:
   *   - type: "chars" → Split into individual characters
   *   - Other options: "words", "lines", or combinations
   * 
   * This wraps each character in a <div> so they can animate independently.
   * 
   * Before: <h2 class="text_spl">5,000-19,000 THB/MONTH</h2>
   * After:  <h2 class="text_spl">
   *           <div class="char">5</div>
   *           <div class="char">,</div>
   *           <div class="char">0</div>
   *           ... etc
   *         </h2>
   */
  let spl = SplitText.create(".text_spl", { type: "chars" });

  /**
   * Step 3: Animate each character with a stagger effect.
   * 
   * gsap.from() = Animate FROM these values TO current state
   * (opposite of gsap.to)
   * 
   * Properties:
   *   - opacity: 0      → Start invisible, fade to visible
   *   - duration: 0.9   → Each character takes 0.9 seconds
   *   - ease: "power2.in" → Starts slow, accelerates (dramatic entrance)
   *   - stagger: 0.1    → 0.1 second delay between each character
   *                       Creates the sequential "typing" effect
   * 
   * Total animation time = duration + (stagger × number of characters)
   * For "5,000-19,000 THB/MONTH" (20 chars):
   * 0.9 + (0.1 × 19) = 2.8 seconds total
   */
  gsap.from(spl.chars, {
    opacity: 0,
    duration: 0.9,
    ease: "power2.in",
    stagger: 0.1,
    scrollTrigger: {
      trigger: ".text_spl",     // Start when price text enters viewport
      refreshPriority: -1,       // Lower priority for consistent behavior
    },
  });

  // ============================================================================
  // SCROLLTRIGGER CONFIGURATION
  // ============================================================================

  /**
   * Configure when ScrollTrigger should recalculate positions.
   * 
   * Why is this important?
   *   - Page layout can change (images load, content expands, window resizes)
   *   - ScrollTrigger needs to know NEW positions of elements
   *   - Without refreshing, animations might trigger at wrong scroll positions
   * 
   * autoRefreshEvents tells ScrollTrigger to recalculate when:
   *   - visibilitychange: Tab becomes visible again (user switches back)
   *   - DOMContentLoaded: Initial page load complete
   *   - load: All resources (images) finished loading
   *   - resize: Browser window is resized
   */
  ScrollTrigger.config({
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load,resize",
  });

  // ============================================================================
  // SUBTLE PARALLAX ANIMATION
  // ============================================================================

  /**
   * A simple downward drift animation for elements with class "a".
   * Creates a subtle parallax/floating effect.
   * 
   * Note: This animation starts immediately on page load, not scroll-triggered.
   * 
   * Properties:
   *   - y: 30           → Move DOWN by 30 pixels
   *   - ease: "power3.out" → Fast start, slow end (natural deceleration)
   *   - duration: 3     → Takes 3 seconds
   */
  gsap.to(".a", {
    y: 30,
    ease: "power3.out",
    duration: 3,
  });

}); // End of DOMContentLoaded
