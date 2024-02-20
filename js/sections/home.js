import { animateHomeContent } from "../components/textScramble/TextScramble.js";

// Adjust and initialize the home section
export function adjustHomeSize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const element = document.getElementById('home');
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;
}

export function initHome() {
    window.addEventListener('resize', adjustHomeSize);
}

animateHomeContent();

document.getElementById('settings-button').addEventListener('click', function() {
    var overlay = document.getElementById('animation-control-panel-overlay');

    if (overlay.style.visibility === 'visible') {
        overlay.style.visibility = "hidden";
        overlay.classList.remove('open');
    } else {
        overlay.classList.add('open');
        overlay.style.visibility = "visible"
    }
});

document.getElementById('infos-tab').addEventListener('click', function() {
    var infosTab = document.getElementById('infos-tab');
    var settingsTab = document.getElementById('settings-tab');
    var animationSettings = document.getElementById('animation-settings');

    infosTab.classList.add('tab-selected');
    infosTab.classList.remove('tab');
    settingsTab.classList.remove('tab-selected');
    settingsTab.classList.add('tab');
    settingsTab.style.borderLeft = 'none';
    animationSettings.style.visibility = 'hidden';
});

document.getElementById('settings-tab').addEventListener('click', function() {
    var infosTab = document.getElementById('infos-tab');
    var settingsTab = document.getElementById('settings-tab');
    var animationSettings = document.getElementById('animation-settings');

    infosTab.classList.remove('tab-selected');
    infosTab.classList.add('tab');
    settingsTab.classList.add('tab-selected');
    settingsTab.classList.remove('tab');
    animationSettings.style.visibility = 'visible';
});

document.getElementById('xmark').addEventListener('click', function() {
    var overlay = document.getElementById('animation-control-panel-overlay');

    overlay.style.visibility = 'hidden';
    overlay.classList.remove('open');
});

