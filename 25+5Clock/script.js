document.addEventListener('DOMContentLoaded', () => {
    let breakLength = 5;
    let sessionLength = 25;
    let timerState = 'stopped';
    let timerType = 'Session';
    let timer = sessionLength * 60;
    let intervalID;
    const beep = document.getElementById('beep');

    function updateDisplay() {
        document.getElementById('break-length').textContent = breakLength;
        document.getElementById('session-length').textContent = sessionLength;
        document.getElementById('timer-label').textContent = timerType;
        document.getElementById('time-left').textContent = formatTime(timer);
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    function startStopTimer() {
        if (timerState === 'stopped') {
            intervalID = setInterval(() => {
                timer--;
                if (timer < 0) {
                    beep.play();
                    if (timerType === 'Session') {
                        timerType = 'Break';
                        timer = breakLength * 60;
                    } else {
                        timerType = 'Session';
                        timer = sessionLength * 60;
                    }
                }
                updateDisplay();
            }, 1000);
            timerState = 'running';
            document.getElementById('start_stop').children[0].classList.add("hide");
            document.getElementById('start_stop').children[1].classList.remove("hide");
        } else {
            clearInterval(intervalID);
            timerState = 'stopped';
            document.getElementById('start_stop').children[1].classList.add("hide");
            document.getElementById('start_stop').children[0].classList.remove("hide");
        }
    }

    function resetTimer() {
        clearInterval(intervalID);
        timerState = 'stopped';
        timerType = 'Session';
        breakLength = 5;
        sessionLength = 25;
        timer = sessionLength * 60;
        beep.pause();
        beep.currentTime = 0;
        updateDisplay();
    }

    function changeLength(type, operation) {
        if (timerState === 'running') return;
        if (type === 'break') {
            if (operation === '-' && breakLength > 1) breakLength--;
            if (operation === '+' && breakLength < 60) breakLength++;
        } else if (type === 'session') {
            if (operation === '-' && sessionLength > 1) sessionLength--;
            if (operation === '+' && sessionLength < 60) sessionLength++;
            timer = sessionLength * 60;
        }
        updateDisplay();
    }

    document.getElementById('break-decrement').addEventListener('click', () => changeLength('break', '-'));
    document.getElementById('break-increment').addEventListener('click', () => changeLength('break', '+'));
    document.getElementById('session-decrement').addEventListener('click', () => changeLength('session', '-'));
    document.getElementById('session-increment').addEventListener('click', () => changeLength('session', '+'));
    document.getElementById('start_stop').addEventListener('click', startStopTimer);
    document.getElementById('reset').addEventListener('click', resetTimer);

    updateDisplay();
});