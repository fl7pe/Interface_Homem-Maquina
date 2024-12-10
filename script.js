// script.js
document.addEventListener('DOMContentLoaded', () => {
    AOS.init();

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Dataset para o Bubble Chart com URLs
    const bubbleData = [
        { name: "Programação", value: 80, url: "programacao.html" },
        { name: "Algoritmos", value: 70, url: "algoritmos.html" },
        { name: "Engenharia de Software", value: 60, url: "engenharia-software.html" },
        { name: "Eletrônica", value: 50, url: "eletronica.html" },
        { name: "Redes", value: 40, url: "redes.html" },
        { name: "Inteligência Artificial", value: 60, url: "ia.html" },
        { name: "Robótica", value: 30, url: "robotica.html" }
    ];

    // Dimensões do gráfico
    const width = 600;
    const height = 400;

    // Criação do SVG
    const svg = d3.select("#bubble")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Escala de cores
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Simulação de força
    const simulation = d3.forceSimulation(bubbleData)
        .force("charge", d3.forceManyBody().strength(-50))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius(d => d.value))
        .force("x", d3.forceX().x(d => Math.max(d.value, Math.min(width - d.value, width / 2))))
        .force("y", d3.forceY().y(d => Math.max(d.value, Math.min(height - d.value, height / 2))));

    // Criação das bolhas
    const nodes = svg.selectAll("circle")
        .data(bubbleData)
        .enter()
        .append("circle")
        .attr("r", d => d.value)
        .attr("fill", (d, i) => color(i))
        .attr("stroke", "#fff")
        .attr("stroke-width", 1)
        .on("click", (event, d) => {
            window.location.href = d.url; // Redireciona para a URL associada à bolha
        })
        .call(d3.drag()
            .on("start", (event, d) => {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            })
            .on("drag", (event, d) => {
                d.fx = event.x;
                d.fy = event.y;
            })
            .on("end", (event, d) => {
                if (!event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            })
        );

    // Adicionando rótulos
    svg.selectAll("text")
        .data(bubbleData)
        .enter()
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dy", ".3em")
        .attr("font-size", "10px")
        .attr("fill", "#fff")
        .text(d => d.name);

    // Atualizando a simulação
    simulation.on("tick", () => {
        nodes
            .attr("cx", d => Math.max(d.value, Math.min(width - d.value, d.x)))
            .attr("cy", d => Math.max(d.value, Math.min(height - d.value, d.y)));

        svg.selectAll("text")
            .attr("x", d => Math.max(d.value, Math.min(width - d.value, d.x)))
            .attr("y", d => Math.max(d.value, Math.min(height - d.value, d.y)));
    });
});


// Pie Chart: Distribuição da Carga Horária
document.addEventListener('DOMContentLoaded', () => {
    AOS.init();

    // Dataset: Carga horária por área
    const data = [
        { area: "Matemática", hours: 200 },
        { area: "Programação", hours: 400 },
        { area: "Física", hours: 150 },
        { area: "Engenharia de Software", hours: 300 },
        { area: "Hardware", hours: 250 },
    ];

    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const color = d3.scaleOrdinal()
        .domain(data.map(d => d.area))
        .range(d3.schemeCategory10);

    const svg = d3.select("#pie-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const pie = d3.pie()
        .value(d => d.hours);

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    // Draw slices
    svg.selectAll("path")
        .data(pie(data))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.area))
        .attr("stroke", "#fff")
        .style("stroke-width", "2px")
        .on("mouseover", function (event, d) {
            d3.select(this).style("opacity", 0.8);
        })
        .on("mouseout", function () {
            d3.select(this).style("opacity", 1);
        });

    // Add labels
    svg.selectAll("text")
        .data(pie(data))
        .enter()
        .append("text")
        .text(d => `${d.data.area}: ${d.data.hours}h`)
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .style("text-anchor", "middle")
        .style("font-size", "12px");
});


document.addEventListener('DOMContentLoaded', () => {
    AOS.init();

    // Dataset de Conexões entre Disciplinas
    const graph = {
        nodes: [
            { id: "Matemática", group: 1 },
            { id: "Programação", group: 2 },
            { id: "Algoritmos", group: 2 },
            { id: "Banco de Dados", group: 3 },
            { id: "Redes", group: 3 },
            { id: "Inteligência Artificial", group: 4 },
            { id: "Hardware", group: 5 },
            { id: "Sistemas Operacionais", group: 5 }
        ],
        links: [
            { source: "Matemática", target: "Programação", value: 1 },
            { source: "Programação", target: "Algoritmos", value: 1 },
            { source: "Algoritmos", target: "Inteligência Artificial", value: 1 },
            { source: "Banco de Dados", target: "Redes", value: 1 },
            { source: "Redes", target: "Sistemas Operacionais", value: 1 },
            { source: "Hardware", target: "Sistemas Operacionais", value: 1 }
        ]
    };

    // Dimensões
    const width = 800;
    const height = 600;

    // Criação do SVG
    const svg = d3.select("#force-graph")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Configuração do layout de força
    const simulation = d3.forceSimulation(graph.nodes)
        .force("link", d3.forceLink(graph.links).id(d => d.id).distance(100))
        .force("charge", d3.forceManyBody().strength(-300))
        .force("center", d3.forceCenter(width / 2, height / 2));

    // Links (linhas)
    const link = svg.append("g")
        .attr("stroke", "#aaa")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .attr("stroke-width", d => Math.sqrt(d.value));

    // Nós (círculos)
    const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("r", 10)
        .attr("fill", d => {
            // Paleta de cores para grupos
            const groupColors = ["#0066cc", "#0099cc", "#00cc99", "#cc6600", "#cc0066"];
            return groupColors[d.group - 1];
        })
        .call(drag(simulation));

    // Labels
    const label = svg.append("g")
        .selectAll("text")
        .data(graph.nodes)
        .enter().append("text")
        .text(d => d.id)
        .attr("x", 12)
        .attr("y", 3)
        .style("font-size", "12px")
        .style("fill", "#333");

    // Atualiza posições em cada tick
    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

        label
            .attr("x", d => d.x)
            .attr("y", d => d.y);
    });

    // Função de arrastar
    function drag(simulation) {
        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }
});

// Adiciona um evento ao clicar na logo
document.querySelector('.logo').addEventListener('click', function (e) {
    e.preventDefault(); // Previne o comportamento padrão do link
    window.scrollTo({
        top: 0, // Move para o topo
        behavior: 'smooth' // Faz a rolagem suave
    });
});