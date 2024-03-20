const fs = require('fs');

const baseDir = './benchmarks/data/';
const tech = ['wasm', 'js'];

const REF_CPU = 10.4;

async function processTech(tech) {
    const cpuMetricsDir = baseDir + tech + '/cpu-metrics/';
    let count = 0;
    let totalCpu = 0;
    let maxCpu = 0;
    let extractedDataTotal = {};

    for (let numberOfWorkers = 0; numberOfWorkers <= 8; numberOfWorkers++) {
        const refFileName = 'cpu_0_' + numberOfWorkers + '.' + tech + '.txt';
        const refFilePath = cpuMetricsDir + refFileName;

        if (await fileExists(refFilePath)) {
            createDirectory(`./benchmarks/charts/profiles/${tech}/`);

            for (let numberOfParticles = 100; numberOfParticles <= 1500; numberOfParticles += 100) {
                const fileName = 'cpu_' + numberOfParticles + '_' + numberOfWorkers + '.' + tech + '.txt';
                const filePath = cpuMetricsDir + fileName;

                if (await fileExists(filePath)) {
                    const extractedData = extractCpuMetrics(filePath, numberOfWorkers, numberOfParticles, tech);
                    extractedData.CPU -= REF_CPU;
                    const outputDir = './benchmarks/charts/profiles/' + tech;
                    const outputPath = outputDir + '/profile_' + numberOfWorkers + '.' + tech + '.json';

                    updateJSONFile(outputPath, extractedData);

                    if (!extractedDataTotal[numberOfParticles]) {
                        extractedDataTotal[numberOfParticles] = {
                            CPU: 0,
                            maxCPU: 0,
                            count: 0
                        };
                    }

                    updateExtractedDataTotal(extractedDataTotal[numberOfParticles], extractedData);
                    totalCpu += extractedData.CPU;
                    if (extractedData.CPU > maxCpu)
                        maxCpu = extractedData.CPU;
                    count++;
                }
            }
        }
    }

    for (const numberOfParticles in extractedDataTotal) {
        const totalData = computeAverage(extractedDataTotal[numberOfParticles], numberOfParticles, tech);
        const outputPath = `./benchmarks/charts/profiles/${tech}/profile_average.${tech}.json`;
        updateJSONFile(outputPath, totalData);
    }

    const outputPath = `./benchmarks/charts/profiles/${tech}/profile_total.${tech}.json`;
    const averageTotal = computeTotal(tech, totalCpu, count, maxCpu);
    updateJSONFile(outputPath, averageTotal);
}

tech.forEach(tech => processTech(tech));

function updateExtractedDataTotal(total, extractedData) {
    total.CPU += extractedData.CPU;
    total.count++;
    total.maxCPU = extractedData.CPU > total.maxCPU ? extractedData.CPU : total.maxCPU;
}

function computeAverage(data, numberOfParticles, tech) {
    return {
        tech: tech,
        numberOfParticles: numberOfParticles,
        numberOfWorkers: 'average',
        CPU: data.CPU / data.count,
        maxCPU: data.maxCPU
    }
}

async function fileExists(path) {
    try {
        await fs.promises.access(path, fs.constants.F_OK);
        return true;
    } catch (err) {
        return false;
    }
}

function computeTotal(tech, totalCpu, count, maxCpu) {
    return {
        tech: tech,
        numberOfWorkers: 'average',
        numberOfParticles: 'average',
        CPU: totalCpu / count,
        maxCPU: maxCpu
    }
}

function extractCpuMetrics(filePath, numberOfWorkers, numberOfParticles, tech) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.split('\n');
    let totalCpuUsage = 0.0;

    for (let i = 0; i < lines.length - 1; i++) {
        const line = lines[i].split(/\s+/);
        totalCpuUsage += parseFloat(line[9]);
    }

    return {
        tech: tech,
        numberOfWorkers: numberOfWorkers,
        numberOfParticles: numberOfParticles,
        CPU: totalCpuUsage
    };
}

function updateJSONFile(filePath, newData) {
    let data;

    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]));
        data = [];
    } else {
        data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }

    const found = data.some(obj => obj.tech == newData.tech 
        && obj.numberOfWorkers == newData.numberOfWorkers 
        && obj.numberOfParticles == newData.numberOfParticles
    );

    if (found) {
        data = data.map(obj => 
            obj.tech == newData.tech 
                && obj.numberOfWorkers == newData.numberOfWorkers 
                && obj.numberOfParticles == newData.numberOfParticles
            ? {...obj, CPU: newData.CPU, maxCPU: newData.maxCPU }
            : obj
        );
    } else {
        data.push(newData);
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Profile updated: ${filePath}`);
}

const createDirectory = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Directory created: ${dirPath}`);
    }
};