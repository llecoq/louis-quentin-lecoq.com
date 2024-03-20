const puppeteer = require('puppeteer');
const fs = require('fs');
const { exec } = require('child_process');

const opts = {
    PAGE_ADDRESS: 'http://localhost:5500/',
    TRACE_DURATION: 2000, // ms
    TEXTE_SCRAMBLE_ANIMATION_DURATION: 6000, // ms
    PARTICLES_NUMBER_TEST_BATCH: 100,
    MAX_NUMBER_OF_PARTICLES: 1500,
    MAX_NUMBER_OF_WEB_WORKERS: 8,
    MAX_TRACE_DURATION: 100000,
};

(async () => {
    // Process args
    const args = process.argv.slice(2);
    parseArgs(args);
    const animationMode = process.argv[2];
    const numberOfWorkers = parseInt(process.argv[3]);
    const traceDuration = args.length === 3 ? parseInt(process.argv[4]) : opts.TRACE_DURATION;

    // Launch puppeteer + chrome browser
    const browser = await puppeteer.launch({ headless: false });

    // Reference `smem` and `top` snapshots with empty tab (3 sec timeout to wait for it to stabilize itself)
    await new Promise(resolve => setTimeout(resolve, 3000));
    cpuProfilingChrome(0, animationMode, numberOfWorkers);
    smemProfilingChrome(0, animationMode, numberOfWorkers);

    const page = await browser.newPage();

    // Load page
    await loadPage(page, opts.PAGE_ADDRESS);
    // Redirect page's console.log() to the terminal
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    // Open Animation Control Panel
    await openAnimationControlPanel(page);
    // Set number of Web Workers
    await setNumberOfWorkers(page, numberOfWorkers);

    // Change Animation Mode to JS if necessary
    await handleAnimationMode(page, animationMode);

    console.log('\x1b[32m%s\x1b[0m', 'Performance testing ready to start.');
    // Trace performances + metrics snapshots
    for (let numberOfParticles = opts.PARTICLES_NUMBER_TEST_BATCH;
        numberOfParticles <= opts.MAX_NUMBER_OF_PARTICLES; 
        numberOfParticles += opts.PARTICLES_NUMBER_TEST_BATCH) 
    {
        // Changing number of particles
        await setNumberOfParticles(page, numberOfParticles);
        // Waiting 3 sec before next batch of performance tracing
        await new Promise(resolve => setTimeout(resolve, 3000));
        // Trace performanecs with the Chrome DevTools Protocol
        await tracePerformances(page, numberOfParticles, animationMode, numberOfWorkers, traceDuration);
        
        await new Promise(resolve => setTimeout(resolve, 3000));
        // Ram profiling with `smem`
        smemProfilingChrome(numberOfParticles, animationMode, numberOfWorkers);

        await new Promise(resolve => setTimeout(resolve, 3000));
        // CPU profiling with `top`
        cpuProfilingChrome(numberOfParticles, animationMode, numberOfWorkers);

        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('\x1b[32m%s\x1b[0m', 'Performance tracing and metrics done.');
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('\x1b[32m%s\x1b[0m', 'All done! Leaving.\n');
    await browser.close();
})();

async function handleAnimationMode(page, animationMode) {
    if (animationMode === 'js') {
        await changeAnimationMode(page);
    } else {
        // Loading wasm module
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}

async function setNumberOfParticles(page, numberOfParticles) {
    await page.waitForSelector('#particles-number-range');

    await page.evaluate((value) => {
        const slider = document.getElementById('particles-number-range');
        slider.value = value;
        slider.dispatchEvent(new Event('input', { bubbles: true }));
    }, numberOfParticles);

    console.log('Number of particles set to', numberOfParticles);
}

async function setNumberOfWorkers(page, numberOfWorkers) {
    await page.waitForSelector('#workers-number-range');

    await page.evaluate((value) => {
        const slider = document.getElementById('workers-number-range');
        slider.value = value;
        slider.dispatchEvent(new Event('input', { bubbles: true }));
    }, numberOfWorkers);

    console.log('Number of workers set to', numberOfWorkers);
}

async function tracePerformances(page, numberOfParticles, animationMode, numberOfWorkers, traceDuration) {
    const directoryPath = animationMode === 'js' ? 'benchmarks/data/js/traces/' : 'benchmarks/data/wasm/traces/';
    const fileName = 'trace_' + numberOfParticles + '_' + numberOfWorkers + '_' + traceDuration;
    const fullPath = directoryPath + fileName + '.' + animationMode + '.json';

    createDirectory(directoryPath);

    await page.tracing.start({ path: fullPath, categories: ['devtools.timeline', 'v8', 'disabled-by-default-v8.cpu_profiler'] });
    console.log('Performance tracing', animationMode, 'mode for', numberOfParticles, 'particles with', numberOfWorkers, 'Web Workers for', (traceDuration * 0.001), 'seconds.');
   
    await new Promise(resolve => setTimeout(resolve, traceDuration));
    await page.tracing.stop();
    console.log('Performance tracing stops');
}

function smemProfilingChrome(numberOfParticles, animationMode, numberOfWorkers) {
    const directoryPath = animationMode === 'js' ? 'benchmarks/data/js/ram-metrics/' : 'benchmarks/data/wasm/ram-metrics/';
    const fileName = 'smem_' + numberOfParticles + '_' + numberOfWorkers;
    const fullPath = directoryPath + fileName + '.' + animationMode + '.txt';

    createDirectory(directoryPath);

    exec('smem -ktP chrome', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
    
        fs.writeFile(fullPath, stdout, (err) => {
            if (err) {
                console.error(`Error writing to file: ${err}`);
            } else {
                console.log('The smem output has been saved to', fullPath);
            }
        });
    });
}

function cpuProfilingChrome(numberOfParticles, animationMode, numberOfWorkers) {
    const directoryPath = animationMode === 'js' ? 'benchmarks/data/js/cpu-metrics/' : 'benchmarks/data/wasm/cpu-metrics/';
    const fileName = 'cpu_' + numberOfParticles + '_' + numberOfWorkers;
    const fullPath = directoryPath + fileName + '.' + animationMode + '.txt';

    createDirectory(directoryPath);

    exec('top -b -n 1 | grep chrome', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
    
        fs.writeFile(fullPath, stdout, (err) => {
            if (err) {
                console.error(`Error writing to file: ${err}`);
            } else {
                console.log('The cpu usage output has been saved to', fullPath);
            }
        });
    });
}

function parseArgs(args) {
    if (args.length < 2 || args.length > 3) {
        console.error(
            '\x1b[31m%s\x1b[0m', 
            'Error: Incorrect number of arguments.\nUsage: npm run benchmark <animationMode> <numOfWorkers> [<traceDuration>]\nExample: npm run benchmark js 4'
        );
        process.exit(1); 
    }

    const animationMode = args[0];
    const numOfWorkers = parseInt(args[1]);

    if (animationMode !== 'js' && animationMode !== 'wasm') {
        console.error(
            '\x1b[31m%s\x1b[0m',
            'Error: First argument must be "js" or "wasm".'
        );
        process.exit(1); 
    }

    if (isNaN(numOfWorkers) 
        || (numOfWorkers < 0 || numOfWorkers > opts.MAX_NUMBER_OF_WEB_WORKERS)) 
    {
        console.error(
            '\x1b[31m%s\x1b[0m',
            'Error: Second argument must be a number between 0 and', opts.MAX_NUMBER_OF_WEB_WORKERS
        );
        process.exit(1); 
    }

    if (args.length === 3) {
        const traceDuration = parseInt(args[2]);

        if (isNaN(traceDuration)
            || (traceDuration < 1000 || traceDuration > opts.MAX_TRACE_DURATION)) 
        {
            console.error(
                '\x1b[31m%s\x1b[0m',
                'Error: Second argument must be a number between 1000 and', opts.MAX_TRACE_DURATION
            );
            process.exit(1); 
        }
    }
}

async function changeAnimationMode(page) {
    await page.evaluate(() => {
        const toggleSwitch = document.getElementById('animation-toggle-switch');
        toggleSwitch.checked = !toggleSwitch.checked; 
        toggleSwitch.dispatchEvent(new Event('change')); 
    });
}

async function openAnimationControlPanel(page) {
    console.log("Clicking on settings button.");
    await page.waitForSelector('#settings-button');
    await page.click('#settings-button');
    console.log("Animation Control Panel opened");
}

async function loadPage(page, pageAddress) {
    await page.goto(pageAddress, { waitUntil: 'networkidle0' });
    console.log('Page loaded. Waiting for TextScramble animation to terminate.');
    await new Promise(resolve => setTimeout(resolve, opts.TEXTE_SCRAMBLE_ANIMATION_DURATION));
    console.log('TextScramble animation over.');
}

const createDirectory = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Directory created: ${dirPath}`);
    }
};