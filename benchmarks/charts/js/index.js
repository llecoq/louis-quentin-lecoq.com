import ChartCpuMetricsAverage from "./ChartCpuMetricsAverage.js";
import ChartRamMetricsAverage from "./ChartRamMetricsAverage.js";
import ChartFpsParticles from "./ChartFpsParticles.js";
import ChartSortAlgo from "./ChartsSortAlgo.js";
import ChartSpeedometerCpu from "./ChartSpeedometerCpu.js";
import ChartDonutLanguages from "./ChartDonutLanguages.js";
import ChartRadar from "./ChartRadar.js";

const tech = ['wasm', 'js'];
const baseDir = "/profiles/";
let charts = [];

async function loadData(tech, numberOfWorkers) {
    let fileName;
    
    if (numberOfWorkers === 9) {
        fileName = `profile_average.${tech}.json`;
    } else if (numberOfWorkers === 'total') {
        fileName = `profile_total.${tech}.json`;
    } else {
        fileName = `profile_${numberOfWorkers}.${tech}.json`;
    }
    
    const fullPath = `${baseDir}${tech}/${fileName}`;
    const response = await fetch(fullPath);
    return await response.json();
}

function initCharts() {
    let promisesWorkers = [];

    for (let numberOfWorkers = 0; numberOfWorkers <= 9; numberOfWorkers++) {
        tech.forEach(tech => {
            promisesWorkers.push(loadData(tech, numberOfWorkers));
        });
    }

    Promise.all(promisesWorkers).then((results) => {
        for (let i = 0; i < results.length; i += 2) {
            const wasmData = results[i];
            const jsData = results[i + 1];
            charts.push(new ChartFpsParticles(jsData, wasmData));
            charts.push(new ChartSortAlgo(jsData, wasmData));
            charts[charts.length - 1].render();
            charts[charts.length - 2].render();
        }

        charts.push(new ChartCpuMetricsAverage(results[results.length - 1], results[results.length - 2]));
        charts.push(new ChartRamMetricsAverage(results[results.length - 1], results[results.length - 2]));
        charts[charts.length - 1].render();
        charts[charts.length - 2].render();

    }).catch(error => console.log('Error:', error));

    let promiseAverage = [];

    tech.forEach(tech => {
        promiseAverage.push(loadData(tech, 'total'));
    });

    Promise.all(promiseAverage).then((results) => {
        charts.push(new ChartSpeedometerCpu(results[results.length - 1], 'js'));
        charts.push(new ChartSpeedometerCpu(results[results.length - 2], 'wasm'));
        charts[charts.length - 1].render();
        charts[charts.length - 2].render();
    })

    charts.push(new ChartDonutLanguages('js'));
    charts.push(new ChartDonutLanguages('wasm'));
    charts[charts.length - 2].render();
    charts[charts.length - 1].render();

    charts.push(new ChartRadar());
    charts[charts.length - 1].render();
    
}

initCharts();