export function adjustHomeSize() {
    var width = window.innerWidth;
    var height = window.innerHeight;

    var element = document.getElementById('home');
    element.style.width = width + 'px';
    element.style.height = height + 'px';
}

export function initHome() {
    window.addEventListener('resize', adjustHomeSize);
}