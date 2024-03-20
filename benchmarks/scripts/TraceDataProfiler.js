const fs = require('fs');
const { css } = require('highcharts');
const path = require('path');

const baseDir = './benchmarks/data/';
const tech = ['wasm', 'js'];

tech.forEach(tech => {
    const tracesDir = baseDir + tech + '/traces/';

    fs.readdir(tracesDir, (err, files) => {
        if (err) {
            console.error("Error reading directory", err);
            return;
        }

        let extractedDataTotal = {};
        createDirectory(`./benchmarks/charts/profiles/${tech}/`);

        files.forEach(file => {

            if (file.startsWith('trace_') && file.endsWith('.json')) {
                console.log(`Parsing ${file}`);

                const parts = file.split('_');
                const numberOfParticles = parts[1];
                const numberOfWorkers = parts[2];
                const traceDuration = parts[3].split('.')[0];
                const filePath = path.join(tracesDir, file);
                const extractedData = extractFpsAndAnimateAverageDuration(filePath, numberOfWorkers, numberOfParticles, tech, traceDuration);
                const outputPath = `./benchmarks/charts/profiles/${tech}/profile_${numberOfWorkers}.${tech}.json`;

                updateJSONFile(outputPath, extractedData);

                if (!extractedDataTotal[numberOfParticles]) {
                    extractedDataTotal[numberOfParticles] = {
                        animationData: { 
                            totalDuration: 0, 
                            numberOfFrames: 0 
                        },
                        sortNeighborsData: { 
                            totalDuration: 0, 
                            count: 0 
                        },
                        traceDuration: 0,
                    };
                }

                updateExtractedDataTotal(extractedDataTotal[numberOfParticles], extractedData);
                extractedDataTotal[numberOfParticles].count++;
            }
        });

        for (const numberOfParticles in extractedDataTotal) {
            const totalData = computeAverage(extractedDataTotal[numberOfParticles], numberOfParticles, tech);
            const outputPath = `./benchmarks/charts/profiles/${tech}/profile_average.${tech}.json`;
            updateJSONFile(outputPath, totalData);
        }

        const outputPath = `./benchmarks/charts/profiles/${tech}/profile_total.${tech}.json`;
        const averageTotal = computeTotal(extractedDataTotal, tech);
        updateJSONFile(outputPath, averageTotal);
    });
});

function computeTotal(extractedData, tech) {
    let total = {
        traceDuration: 0,
        animationData: {
            totalDuration: 0,
            numberOfFrames: 0,
        },
        sortNeighborsData: {
            totalDuration: 0,
            count: 0
        }
    };
    
    for (const numberOfParticles in extractedData) {
        total.traceDuration += extractedData[numberOfParticles].traceDuration;
        total.animationData.totalDuration += extractedData[numberOfParticles].animationData.totalDuration;
        total.animationData.numberOfFrames += extractedData[numberOfParticles].animationData.numberOfFrames;
        total.sortNeighborsData.totalDuration += extractedData[numberOfParticles].sortNeighborsData.totalDuration;
        total.sortNeighborsData.count += extractedData[numberOfParticles].sortNeighborsData.count;
    }

    return {
        tech: tech,
        numberOfParticles: 'average',
        numberOfWorkers: 'average',
        traceDuration: total.traceDuration,
        animationData: {
            fps: Math.round((total.animationData.numberOfFrames * 1000) / total.traceDuration),
            totalDuration: total.animationData.totalDuration,
            numberOfFrames: total.animationData.numberOfFrames,
            averageDuration: (total.animationData.numberOfFrames > 0) ? (total.animationData.totalDuration / total.animationData.numberOfFrames) : 0
        },
        sortNeighborsData: {
            totalDuration: total.sortNeighborsData.totalDuration,
            count: total.sortNeighborsData.count,
            averageDuration: (total.sortNeighborsData.count > 0) ? (total.sortNeighborsData.totalDuration / total.sortNeighborsData.count) : 0
        }           
    }
}

function updateExtractedDataTotal(total, extractedData) {
    total.animationData.totalDuration += extractedData.animationData.totalDuration;
    total.animationData.numberOfFrames += extractedData.animationData.numberOfFrames;
    total.sortNeighborsData.totalDuration += extractedData.sortNeighborsData.totalDuration;
    total.sortNeighborsData.count += extractedData.sortNeighborsData.count;
    total.traceDuration += parseInt(extractedData.traceDuration);
}

function computeAverage(data, numberOfParticles, tech) {
    return {
        tech: tech,
        numberOfParticles: numberOfParticles,
        numberOfWorkers: 'average',
        traceDuration: data.traceDuration,
        animationData: {
            fps: Math.round((data.animationData.numberOfFrames * 1000) / data.traceDuration),
            totalDuration: data.animationData.totalDuration,
            numberOfFrames: data.animationData.numberOfFrames,
            averageDuration: (data.animationData.numberOfFrames > 0) ? (data.animationData.totalDuration / data.animationData.numberOfFrames) : 0
        },
        sortNeighborsData: {
            totalDuration: data.sortNeighborsData.totalDuration,
            count: data.sortNeighborsData.count,
            averageDuration: (data.sortNeighborsData.count > 0) ? (data.sortNeighborsData.totalDuration / data.sortNeighborsData.count) : 0
        }   
    }
}

function extractFpsAndAnimateAverageDuration(filePath, numberOfWorkers, numberOfParticles, tech, traceDuration) {
    const devToolsEvents = fs.readFileSync(filePath, 'utf-8');
    const parsedData = JSON.parse(devToolsEvents);
    let animateData = {totalDuration: 0, numberOfFrames: 0}
    let sortNeighborsData = {totalDuration: 0, count: 0};

    for (let i = 0; i < parsedData.traceEvents.length; i++) {
        const extractedData = extractSortNeighborsData(parsedData.traceEvents[i], numberOfWorkers);

        sortNeighborsData.totalDuration += extractedData.duration;
        animateData.totalDuration += extractDuration(parsedData.traceEvents[i]);
        animateData.numberOfFrames += extractFrame(parsedData.traceEvents[i]);
        sortNeighborsData.count += extractedData.count;
    }

    return {
        tech: tech,
        numberOfParticles: numberOfParticles,
        numberOfWorkers: numberOfWorkers,
        traceDuration: traceDuration,
        animationData: {
            fps: Math.round((animateData.numberOfFrames * 1000) / parseInt(traceDuration)),
            totalDuration: animateData.totalDuration,
            numberOfFrames: animateData.numberOfFrames,
            averageDuration: animateData.totalDuration / animateData.numberOfFrames
        },
        sortNeighborsData: {
            totalDuration: sortNeighborsData.totalDuration,
            count: sortNeighborsData.count,
            averageDuration: sortNeighborsData.totalDuration / sortNeighborsData.count
        }
    };
}

function extractSortNeighborsData(parsedData, numberOfWorkers) {
    let duration = 0;
    let count = 0;

    if (numberOfWorkers == 0) {
        if (parsedData.name === 'TimerFire' && parsedData.dur) {
            duration += parsedData.dur;
            count++;        
        }
    } else {
        if (parsedData.args
            && parsedData.args.data
            && containsSortNeighbors(parsedData.args.data.url)
            && parsedData.dur)
        {
            duration += parsedData.dur;
            count++;
        }
    }

    return {duration, count};
}

function containsSortNeighbors(str) {
    const regex = /SortNeighbors(WASM|JS).worker.js/;
    return regex.test(str);
}

function extractDuration(parsedData) {
    if (parsedData.cat == 'devtools.timeline'
        && parsedData.args.data
        && parsedData.args.data.functionName == 'animate') 
    {
        if (parsedData.dur) {
            return parsedData.dur;
        }
    }
    return 0;
}

function extractFrame(parsedData) {
    if (parsedData.name == 'FireAnimationFrame') {
        return 1;
    }
    return 0;
}

function updateJSONFile(filePath, newData) {
    let data;

    if (!fs.existsSync(filePath)) {
        console.log(filePath)
        fs.writeFileSync(filePath, JSON.stringify([]));
        data = [];
    } else {
        data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }

    const found = data.some(obj => obj.tech === newData.tech 
        && obj.numberOfWorkers === newData.numberOfWorkers 
        && obj.numberOfParticles === newData.numberOfParticles
        && obj.traceDuration === newData.traceDuration
    );

    if (found) {
        data = data.map(obj => 
            obj.tech === newData.tech 
                && obj.numberOfWorkers === newData.numberOfWorkers 
                && obj.numberOfParticles === newData.numberOfParticles
                && obj.traceDuration === newData.traceDuration
            ? {...obj, animationData: newData.animationData, sortNeighborsData: newData.sortNeighborsData, traceDuration: newData.traceDuration}
            : obj
        );
    } else {
        data.push(newData);
    }

    data.sort((a, b) => {
        return a.numberOfParticles - b.numberOfParticles;
    });

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Profile updated: ${filePath}`);
}

const createDirectory = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Directory created: ${dirPath}`);
    }
};