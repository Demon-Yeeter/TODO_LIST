// countdown.js

export const startCountdown = (task) => {
    const countdownCell = document.querySelector(`.row[data-id="${task.id}"] .cell.countdown`);
    
    if (!countdownCell) {
        console.error("Countdown-Zelle nicht gefunden.");
        return;
    }

    const countDownDate = new Date(task.deadline).getTime();
    console.log("Countdown startet für:", task.deadline);

    const countdown = setInterval(() => {
        const now = new Date().getTime();
        const distance = countDownDate - now;

        if (distance < 0) {
            clearInterval(countdown);
            countdownCell.textContent = "Zeit abgelaufen";
        } else {
            const days = String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, '0');
            const hours = String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
            const minutes = String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
            const seconds = String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0');
            countdownCell.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }
    }, 1000);
};