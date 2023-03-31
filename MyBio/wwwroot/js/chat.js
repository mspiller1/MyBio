"use strict";

let connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

//Disable the send button until connection is established.
document.getElementById("sendButton").disabled = true;

connection.on("ReceiveMessage", function (user, message) {
    let div = createDivWithMessage(user, message);
    document.getElementById("messages").append(div);
});

connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", sendMessage);
document.getElementById("messageInput").addEventListener("keyup", function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById("sendButton").click();
    }
});

function sendMessage(event) {
    let user = document.getElementById("userInput").value;
    let messageInput = document.getElementById("messageInput");
    let message = messageInput.value;
    messageInput.value = "";

    connection.invoke("SendMessage", user, message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
};

function createDivWithMessage(user, message) {
    let currentUser = document.getElementById("userInput").value;
    let justifyContent = user === currentUser ? "justify-content-end" : "justify-content-start";
    let avatar = user === currentUser ? "ava1-bg.webp" : "ava2-bg.webp";
    let divString = `<div class="d-flex flex-row ${justifyContent} mb-4">
                        <div class="p-3 me-3 border" style="border-radius: 15px; background-color: #fbfbfb;">
                            <p class="small mb-0">${message}</p>
                        </div>
                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/${avatar}"
                                alt="${user}" style="width: 45px; height: 100%;">
                    </div>`;

    let div = document.createElement('div');
    div.innerHTML = divString;
    return div.firstChild;
}