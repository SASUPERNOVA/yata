displayTime();
setInterval(displayTime, 1000);

function displayTime() {
    let time = new Date().toLocaleTimeString(undefined, {hour: "2-digit", minute: "2-digit", second: '2-digit'});
    document.getElementById("time").textContent = `${time}`;
}