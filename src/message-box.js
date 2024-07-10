const messageBox = document.getElementById('msg-box');
const orangeBtn = document.getElementById('use-msg-box');
const closeBtn = document.getElementById('close-btn');
const sendBtn = document.getElementById('send-message');
const closeMsgBox = () => { messageBox.style.display = 'none'; }

orangeBtn.addEventListener('click', () => {
    messageBox.style.display = 'block';
    messageBox.style.animation = 'appear-up .3s forwards';
});

closeBtn.addEventListener('click', () => {
    messageBox.style.animation = 'disappear-down .3s forwards';
    setTimeout(closeMsgBox, 300);
});

sendBtn.addEventListener('click', () => {
    messageBox.style.animation = 'disappear-down .3s forwards';
    setTimeout(closeMsgBox, 300);
});