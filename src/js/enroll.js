// Dans src/js/enroll.js
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const program = urlParams.get('program');

    if (program) {
        const radio = document.querySelector(`input[name="program"][value="${program}"]`);
        if (radio) {
            radio.checked = true;
        }
    }
});
