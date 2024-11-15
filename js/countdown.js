// countdown.js

export const startCountdown = (task) => {
    const countdownCell = document.querySelector(`.row[data-id="${task.id}"] .countdown`);
    const countDownDate = new Date(task.deadline).getTime();

    const countdown = setInterval(() => {
        const now = new Date().getTime();
        const distance = countDownDate - now;

        if (distance < 0) {
            clearInterval(countdown);
            countdownCell.textContent = "Zeit abgelaufen";
        } else {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            countdownCell.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }
    }, 1000);
};