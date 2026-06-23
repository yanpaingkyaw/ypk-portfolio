function portfolioApp() {
  return {
    profile: PROFILE,
    darkMode: false,
    mobileOpen: false,
    activeSection: 'hero',
    projectFilter: 'All',

    get filteredProjects() {
      if (this.projectFilter === 'All') {
        return this.profile.projects;
      }
      return this.profile.projects.filter((project) => project.domain === this.projectFilter);
    },

    init() {
      this.initTheme();
      this.initSectionObserver();
      this.initMobileNav();

      window.addEventListener('portfolio:theme-changed', () => {
        if (window.PortfolioCharts) {
          window.PortfolioCharts.renderAll();
        }
      });

      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          if (window.PortfolioCharts) {
            window.PortfolioCharts.renderAll();
          }
        }, 150);
      });

      this.$nextTick(() => {
        if (window.PortfolioCharts) {
          window.PortfolioCharts.renderAll();
        }
        if (window.PortfolioAnimations) {
          window.PortfolioAnimations.init();
        }
      });
    },

    initTheme() {
      const stored = localStorage.getItem('portfolio-theme');
      if (stored === 'dark') {
        this.darkMode = true;
      } else if (stored === 'light') {
        this.darkMode = false;
      } else {
        this.darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      this.applyTheme();
    },

    toggleTheme() {
      this.darkMode = !this.darkMode;
      localStorage.setItem('portfolio-theme', this.darkMode ? 'dark' : 'light');
      this.applyTheme();
    },

    applyTheme() {
      document.documentElement.classList.toggle('dark', this.darkMode);
      window.dispatchEvent(new CustomEvent('portfolio:theme-changed'));
    },

    scrollTo(id) {
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      this.mobileOpen = false;
    },

    formatDateRange(start, end) {
      const formatter = new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' });
      const startDate = formatter.format(new Date(start + '-01'));
      const endDate = end === 'Present' ? 'Present' : formatter.format(new Date(end + '-01'));
      return `${startDate} – ${endDate}`;
    },

    initSectionObserver() {
      const sections = this.profile.navLinks
        .map((link) => document.getElementById(link.id))
        .filter(Boolean);

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.activeSection = entry.target.id;
            }
          });
        },
        { rootMargin: '-40% 0px -45% 0px', threshold: 0.01 }
      );

      sections.forEach((section) => observer.observe(section));
    },

    initMobileNav() {
      window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          this.mobileOpen = false;
        }
      });
    },
  };
}

document.addEventListener('alpine:init', () => {
  Alpine.data('portfolioApp', portfolioApp);
});
