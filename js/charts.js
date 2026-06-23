(function () {
  const tooltip = d3.select('body').append('div').attr('class', 'chart-tooltip');

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
    tooltip.style('opacity', 1).html(`<strong>${item.axis}</strong><br>${item.value}% proficiency`);
    positionSkillTooltip(event);
  }

  function positionSkillTooltip(event) {
    const { x, y } = getPointerPosition(event);
    tooltip.style('left', `${x + 12}px`).style('top', `${y - 24}px`);
  }

  function hideSkillTooltip() {
    tooltip.style('opacity', 0);
  }

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

    const totalLength = polygon.node().getTotalLength();
    polygon
      .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(900)
      .attr('stroke-dashoffset', 0);

    g.selectAll('.skill-node')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'skill-node')
      .attr('cx', (_, index) => valuePoints[index][0])
      .attr('cy', (_, index) => valuePoints[index][1])
      .attr('r', width < 480 ? 6 : 4)
      .attr('fill', colors.stroke)
      .on('mouseenter', (event, item) => showSkillTooltip(event, item))
      .on('mousemove', positionSkillTooltip)
      .on('mouseleave', hideSkillTooltip)
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
      .attr('transform', (item) => `translate(0, ${y(item.id)})`)
      .on('click', (_, item) => {
        const card = document.getElementById(`exp-${item.id}`);
        if (card) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          card.classList.add('ring-2', 'ring-blue-500');
          setTimeout(() => card.classList.remove('ring-2', 'ring-blue-500'), 1200);
        }
      });

    nodes
      .append('circle')
      .attr('cx', lineX)
      .attr('cy', 0)
      .attr('r', 0)
      .attr('fill', colors.node)
      .transition()
      .delay((_, index) => index * 80)
      .duration(500)
      .attr('r', 7);

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
    renderSkillsRadar();
    renderExperienceTimeline();
  }

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.skill-node') && !event.target.closest('.chart-tooltip')) {
      hideSkillTooltip();
    }
  });

  window.PortfolioCharts = { renderAll, renderSkillsRadar, renderExperienceTimeline };
})();
