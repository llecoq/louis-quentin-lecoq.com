const fs = require('fs');

const baseDir = './benchmarks/data/';
const tech = ['wasm', 'js'];

const REF_USS = 316;

async function processTechRam(tech) {
    const ramMetricsDir = baseDir + tech + '/ram-metrics/';
    let count = 0;
    let totalUss = 0;
    let extractedDataTotal = {};

    for (let numberOfWorkers = 0; numberOfWorkers <= 8; numberOfWorkers++) {
        const refFileName = 'smem_0_' + numberOfWorkers + '.' + tech + '.txt';
        const refFilePath = ramMetricsDir + refFileName;

        if (await fileExists(refFilePath)) {
            for (let numberOfParticles = 100; numberOfParticles <= 1500; numberOfParticles += 100) {
                const fileName = 'smem_' + numberOfParticles + '_' + numberOfWorkers + '.' + tech + '.txt';
                const filePath = ramMetricsDir + fileName;

                if (await fileExists(filePath)) {
                    const extractedData = extractRamMetrics(filePath, numberOfWorkers, numberOfParticles, tech);
                    extractedData.USS -= REF_USS;

                    const outputDir = './benchmarks/charts/profiles/' + tech;
                    const outputPath = outputDir + '/profile_' + numberOfWorkers + '.' + tech + '.json';

                    createDirectory(outputDir);
                    updateJSONFile(outputPath, extractedData);

                    if (!extractedDataTotal[numberOfParticles]) {
                        extractedDataTotal[numberOfParticles] = {
                            USS: 0,
                            count: 0
                        };
                    }

                    updateExtractedDataTotal(extractedDataTotal[numberOfParticles], extractedData);
                    totalUss += extractedData.USS;
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
    const averageTotal = computeTotal(tech, totalUss, count);
    updateJSONFile(outputPath, averageTotal);
}

tech.forEach(tech => processTechRam(tech));

function computeTotal(tech, totalUss, count) {
    return {
        tech: tech,
        numberOfWorkers: 'average',
        numberOfParticles: 'average',
        USS: totalUss / count
    }
}

function computeAverage(data, numberOfParticles, tech) {
    return {
        tech: tech,
        numberOfParticles: numberOfParticles,
        numberOfWorkers: 'average',
        USS: data.USS / data.count 
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

function updateExtractedDataTotal(total, extractedData) {
    total.USS += extractedData.USS;
    total.count++;
}

function extractRamMetrics(filePath, numberOfWorkers, numberOfParticles, tech) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.split('\n');
    const lastLineSplit = lines[lines.length - 2].split(/\s+/);
    const USSMetrics = lastLineSplit[4];

    return {
        tech: tech,
        numberOfWorkers: numberOfWorkers,
        numberOfParticles: numberOfParticles,
        USS: parseFloat(USSMetrics)
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

    const found = data.some(obj => obj.tech === newData.tech 
        && obj.numberOfWorkers == newData.numberOfWorkers 
        && obj.numberOfParticles == newData.numberOfParticles
    );

    if (found) {
        data = data.map(obj => 
            obj.tech === newData.tech 
                && obj.numberOfWorkers == newData.numberOfWorkers 
                && obj.numberOfParticles == newData.numberOfParticles
            ? {...obj, USS: newData.USS}
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
