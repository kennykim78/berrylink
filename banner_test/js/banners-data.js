/**
 * K-Beauty Accordion Banners
 * English copy & visual metadata for the 6 brand banners.
 *
 * Copy rules:
 * - Strictly 2-tier text layer: Headline and Subtext only.
 * - Strictly ZERO CTA buttons, zero .btn/.cta classes, zero marketing action verbs.
 *
 * Export format: Universal Module Definition (UMD)
 * Compatible with vanilla HTML script tags (window.BANNER_DATA) and Node.js (module.exports).
 */

(function (root, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    // AMD
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node.js / CommonJS
    module.exports = factory();
  } else {
    // Browser global
    var exported = factory();
    root.BANNER_DATA = exported;
    if (typeof window !== 'undefined') {
      window.BANNER_DATA = exported;
    }
  }
}(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this)), function () {
  'use strict';

  var ASPECT = { pcActive: "4:2.5", pcInactive: "4:5", mobile: "1:1" };

  /**
   * Array of 6 brand copy and visual metadata records.
   */
  var BANNER_DATA = [
    {
      id: "tocobo",
      brandName: "TOCOBO",
      category: "Sun Care",
      headline: "A Weightless Cotton Finish",
      subtext: "TOCOBO's vegan sun stick with cotton extract delivers a flawless matte finish and reliable SPF50+ PA++++ protection, without any stickiness.",
      image: "assets/images/banners/banner_tocobo.webp",
      altText: "TOCOBO sun care",
      theme: {
        primaryColor: "#4B90D8",
        accentColor: "#DDF2FF",
        textColor: "#FFFFFF",
        visualTheme: "Sky Blue / Solar Protection / Pure Vegan",
        scrimGradient: "linear-gradient(to top, rgba(15, 32, 67, 0.72) 0%, rgba(15, 32, 67, 0.25) 55%, transparent 100%)"
      },
      aspectRatios: ASPECT
    },
    {
      id: "k-beauty",
      brandName: "K-BEAUTY",
      category: "Curated Travel Collection",
      headline: "Radiance on Every Journey",
      subtext: "An exclusive travel set of iconic Korean bestsellers for deep hydration and a fresh complexion, wherever in the world you are.",
      image: "assets/images/banners/banner_kbeauty.webp",
      altText: "K-BEAUTY curated travel collection",
      theme: {
        primaryColor: "#B59EBE",
        accentColor: "#F3EEF5",
        textColor: "#FFFFFF",
        visualTheme: "Soft Lavender & Mauve Flatlay / Travel Essentials",
        scrimGradient: "linear-gradient(to top, rgba(46, 32, 54, 0.72) 0%, rgba(46, 32, 54, 0.25) 55%, transparent 100%)"
      },
      aspectRatios: ASPECT
    },
    {
      id: "missha",
      brandName: "MISSHA",
      category: "Eye Makeup & Glow",
      headline: "Prismatic Radiance for the Eyes",
      subtext: "The MISSHA Modern Shadow collection: a silky veil of ultra-fine pigments and multifaceted shimmer for expressive eye makeup.",
      image: "assets/images/banners/banner_missha.webp",
      altText: "MISSHA prismatic eye shadow",
      theme: {
        primaryColor: "#8D7B68",
        accentColor: "#EAE5E1",
        textColor: "#FFFFFF",
        visualTheme: "High-Glamour Prismatic Shimmer / Silver Studio",
        scrimGradient: "linear-gradient(to top, rgba(38, 30, 26, 0.72) 0%, rgba(38, 30, 26, 0.25) 55%, transparent 100%)"
      },
      aspectRatios: ASPECT
    },
    {
      id: "rejuvelab",
      brandName: "REJUVELAB",
      category: "Clinical Dermocosmetics",
      headline: "Cellular PDRN Regeneration",
      subtext: "An innovative biotic care with salmon DNA (1400 ppm) and retinoate awakens the skin's own resources, restoring density and youthfulness.",
      image: "assets/images/banners/banner_rejuvelab.webp",
      altText: "REJUVELAB clinical dermocosmetics",
      theme: {
        primaryColor: "#006272",
        accentColor: "#E0F2F1",
        textColor: "#FFFFFF",
        visualTheme: "Clinical Dermocosmetics / White High-Tech Lab",
        scrimGradient: "linear-gradient(to top, rgba(12, 36, 40, 0.72) 0%, rgba(12, 36, 40, 0.25) 55%, transparent 100%)"
      },
      aspectRatios: ASPECT
    },
    {
      id: "manyo",
      brandName: "MANYO",
      category: "Antioxidant Brightening",
      headline: "Absolute Tone Radiance",
      subtext: "The power of glutathione and niacinamide in the Manyo Glutathione 7 line: effective brightening of pigmentation and a porcelain glow from within.",
      image: "assets/images/banners/banner_manyo.webp",
      altText: "MANYO antioxidant brightening",
      theme: {
        primaryColor: "#D9822B",
        accentColor: "#FFF3E0",
        textColor: "#FFFFFF",
        visualTheme: "Luminous Citrus Yellow / Dark Spot Science",
        scrimGradient: "linear-gradient(to top, rgba(54, 34, 12, 0.72) 0%, rgba(54, 34, 12, 0.25) 55%, transparent 100%)"
      },
      aspectRatios: ASPECT
    },
    {
      id: "sosohanmi",
      brandName: "SOSOHANMI",
      category: "Daily Essential Care",
      headline: "Harmony of Natural Balance",
      subtext: "The Sosohanmi Daily Balance ritual: gentle restoration of the skin barrier and exceptional comfort for sensitive skin.",
      image: "assets/images/banners/banner_sosohanmi.webp",
      altText: "SOSOHANMI daily essential care",
      theme: {
        primaryColor: "#5B7065",
        accentColor: "#E8EFE9",
        textColor: "#FFFFFF",
        visualTheme: "Zen Minimalist Sage Green / Pure Water Spheres",
        scrimGradient: "linear-gradient(to top, rgba(24, 36, 28, 0.72) 0%, rgba(24, 36, 28, 0.25) 55%, transparent 100%)"
      },
      aspectRatios: ASPECT
    }
  ];

  /**
   * Finds a brand banner record by its unique ID.
   * @param {string} id - The brand identifier (e.g. "tocobo", "k-beauty").
   * @returns {Object|null} The matching banner record or null if not found.
   */
  BANNER_DATA.getById = function (id) {
    if (typeof id !== 'string') {
      return null;
    }
    var targetId = id.toLowerCase().trim();
    for (var i = 0; i < BANNER_DATA.length; i++) {
      if (BANNER_DATA[i].id.toLowerCase() === targetId) {
        return BANNER_DATA[i];
      }
    }
    return null;
  };

  /**
   * Retrieves all banner brand IDs.
   * @returns {string[]} Array of brand IDs.
   */
  BANNER_DATA.getBrandIds = function () {
    return BANNER_DATA.map(function (banner) {
      return banner.id;
    });
  };

  // Expose on window object in browser environments
  if (typeof window !== 'undefined') {
    window.BANNER_DATA = BANNER_DATA;
  }

  return BANNER_DATA;
}));
