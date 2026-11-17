(function () {
  const tooltip = d3.select('body').append('div')
    .attr('class', 'chart-tooltip')
    .attr('id', 'skill-tooltip')
    .attr('role', 'tooltip')
    .attr('aria-hidden', 'true');
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let tooltipOwner = null;
  let tooltipHideTimer;

  function getThemeColors() {
    const styles = getComputedStyle(document.documentElement);
    return {
      grid: styles.getPropertyValue('--chart-grid').trim(),
      fill: styles.getPropertyValue('--chart-fill').trim(),
      stroke: styles.getPropertyValue('--chart-stroke').trim(),
      text: styles.getPropertyValue('--text-secondary').trim(),
      line: styles.getPropertyValue('--timeline-line').trim(),
      node: styles.getPropertyValue('--timeline-node').trim(),
    };
  }

  function getPointerPosition(event) {
    if (event.pageX != null) {
      return { x: event.pageX, y: event.pageY };
    }
    const touch = event.changedTouches?.[0] || event.touches?.[0];
    if (touch) {
      return { x: touch.pageX, y: touch.pageY };
    }
    return { x: 0, y: 0 };
  }

  function showSkillTooltip(event, item) {
    clearTimeout(tooltipHideTimer);
    tooltipOwner?.removeAttribute('aria-describedby');
    tooltipOwner = event.currentTarget;
    tooltipOwner.setAttribute('aria-describedby', 'skill-tooltip');
    tooltip.attr('aria-hidden', 'false').style('opacity', 1)
      .text(`${item.axis}: ${item.value}% proficiency`);
    if (event.type === 'focus') {
      const rect = tooltipOwner.getBoundingClientRect();
      positionSkillTooltip({ pageX: rect.left + rect.width / 2 + window.scrollX,
        pageY: rect.top + window.scrollY });
    } else {
      positionSkillTooltip(event);
    }
  }

  function positionSkillTooltip(event) {
    const { x, y } = getPointerPosition(event);
    const bounds = tooltip.node().getBoundingClientRect();
    const left = Math.max(window.scrollX + 8,
      Math.min(x + 12, window.scrollX + document.documentElement.clientWidth - bounds.width - 8));
    tooltip.style('left', `${left}px`).style('top', `${Math.max(window.scrollY + 8, y - bounds.height - 8)}px`);
  }

  function hideSkillTooltip() {
    clearTimeout(tooltipHideTimer);
    tooltipOwner?.removeAttribute('aria-describedby');
    tooltipOwner = null;
    tooltip.attr('aria-hidden', 'true').style('opacity', 0);
  }

  // Allow the pointer to cross the gap between a point and its tooltip.
  function scheduleTooltipHide() {
    clearTimeout(tooltipHideTimer);
    tooltipHideTimer = setTimeout(() => {
      if (document.activeElement !== tooltipOwner) hideSkillTooltip();
    }, 150);
  }

  tooltip.on('mouseenter', () => clearTimeout(tooltipHideTimer))
    .on('mouseleave', scheduleTooltipHide);

  function renderSkillsRadar() {
    const container = document.getElementById('skills-chart');
    if (!container || typeof PROFILE === 'undefined') return;

    const data = PROFILE.skillCategories;
    const width = container.clientWidth || 480;
    const height = Math.max(320, width * 0.72);
    const radius = Math.min(width, height) / 2 - (width < 480 ? 56 : 48);
    const levels = 5;
    const labelOffset = width < 480 ? 18 : 22;
    const labelFontSize = width < 480 ? 11 : 12;

    container.innerHTML = '';
    const svg = d3
      .select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', width)
      .attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${width / 2}, ${height / 2})`);
    const colors = getThemeColors();
    const angleSlice = (Math.PI * 2) / data.length;

    for (let level = 1; level <= levels; level += 1) {
      const levelRadius = (radius / levels) * level;
      const points = data.map((_, index) => {
        const angle = index * angleSlice - Math.PI / 2;
        return [Math.cos(angle) * levelRadius, Math.sin(angle) * levelRadius];
      });

      g.append('polygon')
        .attr('points', points.map((point) => point.join(',')).join(' '))
        .attr('fill', 'none')
        .attr('stroke', colors.grid)
        .attr('stroke-width', 1);
    }

    data.forEach((item, index) => {
      const angle = index * angleSlice - Math.PI / 2;
      g.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', Math.cos(angle) * radius)
        .attr('y2', Math.sin(angle) * radius)
        .attr('stroke', colors.grid)
        .attr('stroke-width', 1);

      g.append('text')
        .attr('x', Math.cos(angle) * (radius + labelOffset))
        .attr('y', Math.sin(angle) * (radius + labelOffset))
        .attr('text-anchor', Math.abs(Math.cos(angle)) < 0.1 ? 'middle' : Math.cos(angle) > 0 ? 'start' : 'end')
        .attr('dominant-baseline', 'middle')
        .attr('fill', colors.text)
        .attr('font-size', labelFontSize)
        .text(item.axis);
    });

    const valuePoints = data.map((item, index) => {
      const angle = index * angleSlice - Math.PI / 2;
      const valueRadius = (item.value / 100) * radius;
      return [Math.cos(angle) * valueRadius, Math.sin(angle) * valueRadius];
    });

    const polygon = g
      .append('polygon')
      .attr('points', valuePoints.map((point) => point.join(',')).join(' '))
      .attr('fill', colors.fill)
      .attr('stroke', colors.stroke)
      .attr('stroke-width', 2);

    if (!motionPreference.matches) {
      const totalLength = polygon.node().getTotalLength();
      polygon
        .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(900)
        .attr('stroke-dashoffset', 0);
    }

    g.selectAll('.skill-node')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'skill-node')
      .attr('tabindex', 0)
      .attr('role', 'img')
      .attr('data-chart-key', (_, index) => `skill-${index}`)
      .attr('aria-label', (item) => `${item.axis}: ${item.value}% proficiency`)
      .attr('cx', (_, index) => valuePoints[index][0])
      .attr('cy', (_, index) => valuePoints[index][1])
      .attr('r', width < 480 ? 6 : 4)
      .attr('fill', colors.stroke)
      .on('mouseenter', (event, item) => showSkillTooltip(event, item))
      .on('mousemove', positionSkillTooltip)
      .on('mouseleave', scheduleTooltipHide)
      .on('focus', showSkillTooltip)
      .on('blur', hideSkillTooltip)
      .on('click', function (event, item) {
        event.stopPropagation();
        showSkillTooltip(event, item);
      })
      .on('touchend', function (event, item) {
        event.preventDefault();
        event.stopPropagation();
        showSkillTooltip(event, item);
      });
  }

  function formatTimelineRange(start, end) {
    const formatter = new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' });
    const startLabel = formatter.format(new Date(start + '-01'));
    const endLabel = end === 'Present' ? 'Present' : formatter.format(new Date(end + '-01'));
    return `${startLabel} – ${endLabel}`;
  }

  function activateTimelineEntry(item) {
    const card = document.getElementById(`exp-${item.id}`);
    if (!card) return;
    card.querySelector('button')?.focus({ preventScroll: true });
    card.scrollIntoView({ behavior: motionPreference.matches ? 'instant' : 'smooth', block: 'center' });
    card.classList.add('ring-2', 'ring-blue-500');
    setTimeout(() => card.classList.remove('ring-2', 'ring-blue-500'), 1200);
  }

  function renderExperienceTimeline() {
    const container = document.getElementById('experience-timeline');
    if (!container || typeof PROFILE === 'undefined') return;

    const experiences = PROFILE.experience;
    const width = container.clientWidth || 480;
    const rowHeight = width < 480 ? 88 : 78;
    const margin = { top: 12, right: 12, bottom: 12, left: 12 };
    const lineX = 18;
    const labelX = 40;
    const labelWidth = width - labelX - margin.left - margin.right;
    const labelHeight = width < 480 ? 80 : 64;
    const height = Math.max(420, experiences.length * rowHeight + margin.top + margin.bottom);
    const innerHeight = height - margin.top - margin.bottom;

    container.innerHTML = '';
    const svg = d3
      .select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', width)
      .attr('height', height)
      .attr('overflow', 'visible');

    const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);
    const colors = getThemeColors();

    const y = d3
      .scalePoint()
      .domain(experiences.map((item) => item.id))
      .range([0, innerHeight])
      .padding(0.45);

    const firstY = y(experiences[0].id);
    const lastY = y(experiences[experiences.length - 1].id);

    g.append('line')
      .attr('x1', lineX)
      .attr('x2', lineX)
      .attr('y1', firstY)
      .attr('y2', lastY)
      .attr('stroke', colors.line)
      .attr('stroke-width', 2);

    const nodes = g
      .selectAll('.timeline-node')
      .data(experiences)
      .enter()
      .append('g')
      .attr('class', 'timeline-node')
      .attr('tabindex', 0)
      .attr('role', 'button')
      .attr('data-chart-key', (item) => `timeline-${item.id}`)
      .attr('aria-label', (item) => `${item.title}, ${item.company}, ${formatTimelineRange(item.start, item.end)}. Jump to role details.`)
      .attr('aria-controls', (item) => `exp-${item.id}`)
      .attr('transform', (item) => `translate(0, ${y(item.id)})`)
      .on('click', (_, item) => activateTimelineEntry(item))
      .on('keydown', (event, item) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          activateTimelineEntry(item);
        }
      });

    const circles = nodes
      .append('circle')
      .attr('cx', lineX)
      .attr('cy', 0)
      .attr('r', 7)
      .attr('fill', colors.node);

    if (!motionPreference.matches) {
      circles.attr('r', 0).transition()
        .delay((_, index) => index * 80)
        .duration(500)
        .attr('r', 7);
    }

    nodes
      .append('foreignObject')
      .attr('x', labelX)
      .attr('y', -(labelHeight / 2))
      .attr('width', labelWidth)
      .attr('height', labelHeight)
      .append('xhtml:div')
      .attr('class', 'timeline-label')
      .html(
        (item) => `
          <p class="timeline-label-title">${item.title}</p>
          <p class="timeline-label-company">${item.company}</p>
          <p class="timeline-label-date">${formatTimelineRange(item.start, item.end)}</p>
        `
      );
  }

  function renderAll() {
    const focusedKey = document.activeElement?.getAttribute('data-chart-key');
    hideSkillTooltip();
    renderSkillsRadar();
    renderExperienceTimeline();
    if (focusedKey) {
      const replacement = Array.from(document.querySelectorAll('[data-chart-key]'))
        .find((node) => node.getAttribute('data-chart-key') === focusedKey);
      replacement?.focus({ preventScroll: true });
    }
  }

  motionPreference.addEventListener('change', renderAll);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') hideSkillTooltip();
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.skill-node') && !event.target.closest('.chart-tooltip')) {
      hideSkillTooltip();
    }
  });

  window.PortfolioCharts = { renderAll, renderSkillsRadar, renderExperienceTimeline };
})();
