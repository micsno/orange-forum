let currentUser = "noName";
let currentKey = "noKey";
let maxMessageAmount = -1;

//-------------- User Login selection -------------------------------------------------
// Combined User Login Selection and Message Amount Selector into one DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", () => {
  // User Login Selection
  const selectUser = document.createElement('select');
  selectUser.id = 'user-select';

  const users = [
    { name: "Log in", key: "noKey" },
    { name: "Frodo", key: "7QUY8ujh" },
    { name: "Sam", key: "6M3BAimf" },
    { name: "Saruman", key: "BE5AFqsf" },
    { name: "Gimli", key: "hdh2gMve" }
  ];

  users.forEach(user => {
    const option = document.createElement('option');
    option.value = user.key; // Store the key as the option value
    option.textContent = user.name; // Displayed text
    selectUser.appendChild(option);
  });

  const storedUser = localStorage.getItem('currentUser'); // Get the stored user
  const storedKey = localStorage.getItem('currentKey'); // Get the stored key
  const storedMaxMessageRows = localStorage.getItem('currentUser')

  if (storedUser && storedKey) { // If there is a stored user and key
    currentUser = storedUser; // Set the current user to the stored user
    currentKey = storedKey; // Set the current key to the stored key
    selectUser.value = currentKey; // Set the dropdown to the stored user
    console.log("Restored user key:", currentKey);
    console.log("Restored user:", currentUser);
  }



  selectUser.addEventListener("change", async (e) => { // When the dropdown changes
    currentKey = selectUser.value; // Set the current key to the selected key
    currentUser = selectUser.selectedOptions[0].textContent; // Set the current user to the selected user

    localStorage.setItem('currentUser', currentUser);
    localStorage.setItem('currentKey', currentKey);

    console.log("Selected user key:", currentKey);
    console.log("Selected user:", currentUser);
    console.log("Selected max Message rows is:", maxMessageAmount, " in the maxMessageAmount varaible");
    // Refresh data when user changes
    await refreshData();
  });

  document.getElementById('login-form-container').classList.add('custom-select');
  document.getElementById('login-form-container').appendChild(selectUser);

  // Message Amount Selector
    const selectMessageAmount = document.createElement('select');
    selectMessageAmount.id = 'message-amount-select';
  
    const messageAmountOptions = [
      { name: "Show all messages", messageAmount: -1 },
      { name: "Show 10 latest messages", messageAmount: 10 },
      { name: "Show 20 latest messages", messageAmount: 20 },
      { name: "Show 50 latest messages", messageAmount: 50 },
      { name: "Show 100 latest messages", messageAmount: 100 }
    ];
  
    messageAmountOptions.forEach(selection => { // Loop through the message amount options
      const option = document.createElement('option'); 
      option.value = selection.messageAmount; // Store the key as the option value
      option.textContent = selection.name; // Displayed text
      selectMessageAmount.appendChild(option); 
    });
  
    const storedMax = localStorage.getItem('maxMessageAmount');
    console.log("Max messages per display from a local file:", storedMax);
  
    if (storedMax) {
      maxMessageAmount = parseInt(storedMax, 10);
    } else {
      maxMessageAmount = -1;  // Default value, to show all messages
    }

    selectMessageAmount.value = maxMessageAmount;
  
    selectMessageAmount.addEventListener("change", async (e) => { 
      maxMessageAmount = parseInt(selectMessageAmount.value, 10);
      localStorage.setItem('maxMessageAmount', maxMessageAmount);
  
      console.log("Selected max messages amount:", maxMessageAmount);
  
      // Refresh data when message amount changes
      await refreshData();
    });
  
    const maxMessagesSelector = document.getElementById('max-messages-selector'); 
    if (maxMessagesSelector) {
      maxMessagesSelector.classList.add('custom-select');
      maxMessagesSelector.appendChild(selectMessageAmount);
    } else {
      console.error("Element with ID 'max-messages-selector' not found.");
    }
    
 

    if (typeof getData === 'function') { // Check if the function 'getData' is defined
      window.onload = getData; // Call the function 'getData' when the window loads
    } else { // If the function 'getData' is not defined
      console.error("Function 'getData' is not defined.");
    }
    //getData(); // Call the function 'getData' when the window loads
  });
  


//----------------------------------------------------------------------------------------------------------------

const getData = async () => {
  const url = 'https://starttipakettiforumapi.azurewebsites.net/allMessages';
  const response = await fetch(url);
  const result = await response.json();
  result.reverse();

  // result.forEach(user => {
  //   createRow(user);
  // });
  if (!maxMessageAmount) { maxMessageAmount = -1 }
  if (maxMessageAmount < 0) { maxMessageAmount = result.length };
  for (let i = 0; i < maxMessageAmount; i++) {
    createRow(result[i])

  }
  console.log("I am after the loop of creating limited length page!")
};

const refreshData = async () => {
  const mainDiv = document.querySelector('#messages-container');
  mainDiv.innerHTML = ''; // Clear existing messages
  await getData(); // Fetch and display new messages
};

document.getElementById('send-message').addEventListener('click', async () => {
  const messages = document.getElementById("textInput");
  const userNick = document.getElementById("userName");

  const aAndB = { "message": messages.value };
  const options = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'userkey': currentKey
    },
    body: JSON.stringify(aAndB)
  };

  const url = 'https://starttipakettiforumapi.azurewebsites.net/newMessage';
  const response = await fetch(url, options);
  const result = await response.json(); //text
  console.log(result)

  createRow(result, true);

  messages.value = "";
  userNick.value = "";
});

const createRow = (user, prepend = false) => {
  const mainDiv = document.querySelector('#messages-container');
  const messageContainer = document.createElement('div');
  messageContainer.className = 'msg-container';
  messageContainer.id = user.message_id;
  mainDiv.appendChild(messageContainer);

  const messageContent = document.createElement('div');
  messageContent.className = 'msg-content';
  messageContainer.appendChild(messageContent);

  const messageHeader = document.createElement('div');
  messageHeader.className = 'msg-header';
  messageContent.appendChild(messageHeader);

  const orangeImage = document.createElement('img');
  orangeImage.src = 'images/orange-75-300x300.png';
  orangeImage.alt = 'User Avatar';
  orangeImage.className = 'avatar';
  messageHeader.appendChild(orangeImage);
  switch (user.sender_name) {
    case "Frodo": orangeImage.src = 'images/frodo.jpg'; break;
    case "Sam": orangeImage.src = 'images/sam.jpg'; break;
    case "Saruman": orangeImage.src = 'images/saruman.jpg'; break;
    case "Gimli": orangeImage.src = 'images/gimli.jpg'; break;
    case "Sauron": orangeImage.src = 'images/sauron.jpg'; break;
    case "Pippin": orangeImage.src = 'images/pippin.jpg'; break;
    case "Gollum": orangeImage.src = 'images/gollum.jpg'; break;
    case "Galadriel": orangeImage.src = 'images/galadriel.jpg'; break;
    case "Gothmog": orangeImage.src = 'images/gothmog.jpg'; break;
    case "Boromir": orangeImage.src = 'images/boromir.jpg'; break;
    case "Gandalf": orangeImage.src = 'images/gandalf.jpg'; break;
    case "Legolas": orangeImage.src = 'images/legolas.jpg'; break;
    case "Aragorn": orangeImage.src = 'images/aragorn.jpg'; break;
    case "Merry": orangeImage.src = 'images/merry.jpg'; break;
    case "Faramir": orangeImage.src = 'images/faramir.jpg'; break;
    case "Eru Ilúvatar": orangeImage.src = 'images/Eru.jpg'; break;
    default: break;
  }

  const usernameSpan = document.createElement('span');
  usernameSpan.id = 'username';
  messageHeader.appendChild(usernameSpan);
  usernameSpan.innerHTML = user.sender_name;

  // create and format timestamp
  const date = document.createElement('span');
  date.className = 'date';
  messageHeader.appendChild(date);


  const messageActions = document.createElement('div');
  messageActions.className = 'msg-actions';
  messageHeader.appendChild(messageActions);

  // edit button
  const editBtn = document.createElement('button');
  messageActions.appendChild(editBtn);
  editBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" class="edit-icon"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>';
  editBtn.className = 'icon';

  // delete button
  const deleteBtn = document.createElement('button');
  messageActions.appendChild(deleteBtn);
  deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" class="delete-icon"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>';
  deleteBtn.className = 'icon';

  if (currentUser != user.sender_name) {
    editBtn.style.display = "none";
    deleteBtn.style.display = "none";

  } else {
    editBtn.style.display = "visible";
    deleteBtn.style.display = "initial";
  }

  const messageBody = document.createElement('div');
  messageBody.className = 'msg-body';
  messageContent.appendChild(messageBody);

  if (prepend) {  // written message
    document.querySelector('#messages-container').prepend(messageContainer);
    usernameSpan.innerHTML = currentUser;
    messageBody.innerHTML = user.message;
    date.innerHTML = "Now";
    location.reload();
  } else { // or get all messages
    document.querySelector('#messages-container').appendChild(messageContainer);
    messageBody.innerHTML = user.content;
    //----------------  TimeStamp ------------------
    let timeStamp = new Date(user.timestamp);
    const shortTime = new Intl.DateTimeFormat("en", {
      timeStyle: "short",
    });
    timeStamp = shortTime.format(timeStamp);
    let ddMmYy = new Date(user.timestamp);
    ddMmYy = ddMmYy.toDateString();
    date.innerHTML = ddMmYy + ', ' + timeStamp;
    // Datestamp comparison, post 'Today' as date if true
    const ISODate = new Date(ddMmYy);
    const dateInMilliseconds = ISODate.getTime()
    const dateNow = Date.now();
    const isToday = (d1, d2) => {
      const oneDay = 86400000;
      let dateComparison = d2 - oneDay;

      if (d1 > dateComparison) {
        date.innerHTML = 'Today' + ', ' + timeStamp;
      }
    };

    isToday(dateInMilliseconds, dateNow);
  }

  const deleteMessage = async (id) => {
    const url = 'https://starttipakettiforumapi.azurewebsites.net/deleteMessage/' + id;

    const options = {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'userkey': currentKey,
      },
    };

    const response = await fetch(url, options);
    console.log(response.status, response.statusText);

    const result = await response.text();
    console.log("result:", result);
    let beginOfTheResult = result.substr(0, 7);
    console.log(beginOfTheResult)

    if (response.ok) {
      if (beginOfTheResult === "Message") {
        alert('1. You are unauthorized to remove this message!');
      } else {
        const message = document.getElementById(id);
        message.remove();
      }

    } else {
      alert('You are unauthorized to remove this message!');
    }

  };


  const editMessage = async (id) => {
    const message = document.getElementById(id);
    console.log("ID: ", id, "message:", message);
    const messageBody = message.querySelector('.msg-body');
    const currentText = messageBody.textContent;
    id = Number(id);

    console.log("currentText:", currentText); // Log the current text

    const inputField = document.createElement('input'); // Create an input field
    inputField.type = 'text';
    inputField.value = currentText;
    inputField.classList.add('edit-input');
    inputField.style.width = '60%';

    const saveButton = document.createElement('text'); // Create a save button
    saveButton.textContent = 'Save'; // Set the text content of the button
    saveButton.classList.add('save-button'); // Add a class to the button
    saveButton.style.margin = '0 10px'; // Add some margin to the button
    saveButton.style.fontSize = '14px'; // Set the font size of the button
    document.body.appendChild(saveButton); // Append the button to the body (or any other element)


    messageBody.innerHTML = ''; // Clear the message body
    messageBody.appendChild(inputField); // Append the input field to the message body
    messageBody.appendChild(saveButton); // Append the save button to the message body

    saveButton.addEventListener('click', async () => { // Add an event listener to the save button
      const newText = inputField.value; // Get the value of the input field

      const url = 'https://starttipakettiforumapi.azurewebsites.net/modifyMessage/';
      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'userkey': currentKey
        },
        body: JSON.stringify({ id: id, message: newText })
      };
      console.log("sent ID:", id, typeof (id));
      console.log("sent message:", newText, typeof (newText));
      const response = await fetch(url, options);
      console.log("newText:", newText);
      console.log("resp status:", response.status, "response in total: ", response);

      if (response.ok) { // Check if the response is ok
        console.log("response ok:", newText);
        messageBody.innerHTML = newText;
      } else {
        alert('You are unauthorized to edit this message!'); // Alert the user that they are unauthorized

        messageBody.innerHTML = currentText; // Set the message body to the current text
      }
    });
  };


  deleteBtn.addEventListener("click", () => {
    const confirmation = confirm("Are you sure you want to delete this message?");
    if (confirmation) {
      console.log("Delete press detected at some row, ID:", messageContainer.id);
      deleteMessage(messageContainer.id);
    }
  });

  editBtn.addEventListener("click", () => {
    console.log("Edit press detected at some row, ID:", messageContainer.id);
    editMessage(messageContainer.id);
  });
};

window.onload = getData;