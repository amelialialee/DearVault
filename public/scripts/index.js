// ====================================================================================================================
// Check if the browser supports Web Storage (localStorage and sessionStorage)
// ====================================================================================================================
if (typeof(Storage) !== "undefined") {
    console.log("localStorage is supported!");
  } else {
    console.error("localStorage is not supported.");
  }
// ====================================================================================================================
// SESSION TIMER 
// ====================================================================================================================
let loggedIn = false; // Track the user's logged-in status

// Set the session timeout (Looged out after 30 minutes of inactivity)
function startSessionTimer() {
  sessionStorage.setItem('sessionActive', 'true');
  sessionStorage.setItem('sessionExpiry', Date.now() + 30 * 60 * 1000); // Set session expiry time to 30 minutes from now
  
  // Check for session expiration every minute
  setInterval(function() {
    const sessionExpiry = sessionStorage.getItem('sessionExpiry'); // Retrieve session expiry time from localStorage
    if (sessionExpiry && Date.now() > sessionExpiry) { // Ensure there is value in 'sessionExpiry' & check if session is expired
      alert('Session expired due to inactivity or you have logged out.');
      logoutUser(); // Logout User
    }
  }, 60000); // 60 seconds (1 minute)
}

// Reset the session timer on user activity
function resetTimer() {
  if (sessionStorage.getItem('sessionActive')) { 
    sessionStorage.setItem('sessionExpiry', Date.now() + 30 * 60 * 1000); // Reset session expiry time to 30 minutes from now
  }
}

// Reset session timer on user movements
['click', 'keypress', 'mousemove', 'scroll'].forEach(event => {
  window.addEventListener(event, resetTimer); 
});

// ====================================================================================================================
// LOG IN & SIGN UP
// ====================================================================================================================
document.getElementById('toggleForm').addEventListener('click', function (event) {

    event.preventDefault();
    
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginFormTitle = document.getElementById('loginFormTitle');
    const toggleFormLink = document.getElementById('toggleForm');
  
    // If currently on Sign Up Form
    if (loginForm.style.display === 'none') {
      // Display Login Form
      document.getElementById('signupForm').reset();
      loginForm.style.display = 'block';  // Show the login form
      signupForm.style.display = 'none';  // Hide the signup form
      loginFormTitle.textContent = 'Login';  // Change the title to 'Login'
      toggleFormLink.textContent = "Don't have an account? Sign up";  // Update the link text
    } else {
      // Display Sign Up Form
      document.getElementById('loginForm').reset();
      loginForm.style.display = 'none';  // Hide the login form
      signupForm.style.display = 'block';  // Show the signup form
      loginFormTitle.textContent = 'Sign Up';  // Change the title to 'Sign Up'
      toggleFormLink.textContent = "Already have an account? Login";  // Update the link text
    }
  });
  
  // Login Form references
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const loginButton = document.getElementById('loginButton');
// Sign Up Form references
  const newUsernameInput = document.getElementById('newUsername');
  const emailInput = document.getElementById('email');
  const newPasswordInput = document.getElementById('newPassword');
  const signupButton = document.getElementById('signupButton');
  
  // Check if all Login fields are filled
  function checkLoginFields() {
    const isUsernameFilled = usernameInput.value.trim() !== ''; 
    const isPasswordFilled = passwordInput.value.trim() !== '';
  
    // Activate Login button if both field are filled
    if (isUsernameFilled && isPasswordFilled) {
      loginButton.classList.remove('sunken'); 
      loginButton.classList.add('active'); 
    } else {
      loginButton.classList.add('sunken');
      loginButton.classList.remove('active');
    }
  }
  
  // Check if all Signup fields are filled
  function checkSignupFields() {
    const isNewUsernameFilled = newUsernameInput.value.trim() !== '';
    const isEmailFilled = emailInput.value.trim() !== '';  
    const isNewPasswordFilled = newPasswordInput.value.trim() !== '';  

    // Activate Sign up button if all fields are filled
    if (isNewUsernameFilled && isEmailFilled && isNewPasswordFilled) {
      signupButton.classList.remove('sunken');  
      signupButton.classList.add('active'); 
    } else {
      signupButton.classList.add('sunken');
      signupButton.classList.remove('active');
    }
  }
  
  // Add event listeners to check fields when user types
  usernameInput.addEventListener('input', checkLoginFields);
  passwordInput.addEventListener('input', checkLoginFields);
  
  newUsernameInput.addEventListener('input', checkSignupFields);
  emailInput.addEventListener('input', checkSignupFields);
  newPasswordInput.addEventListener('input', checkSignupFields);
  
  // Initial check when page loads
  checkLoginFields();
  checkSignupFields();
// ====================================================================================================================
// PASSWORD HASHING, USER ID GENERATION 
// ====================================================================================================================
async function hashPassword(password) {
    const encoder = new TextEncoder(); // Convert the password string into byte array
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data); // Hash password using SHA-256 algorithm
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // Convert: hash buffer into an array of int
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join(''); // Convert each byte to a hexadecimal string &  join into 1 string
    return hashHex; // Return the hashed string
  }

function generateUserId() {
  const users = JSON.parse(localStorage.getItem('users')) || {};
  let generatedID;

  do {
    generatedID = Math.floor(Math.random() * 1000000); // Generates a random 6-digit number
  } while (users[generatedID]);

  return generatedID; // Return a unique userId
}

// ====================================================================================================================
// LOG IN & LOG OUT
// ====================================================================================================================

// Declare global variables without initial values
let currentUserId;

// Logging Out User
function logoutUser() {
    const users = JSON.parse(localStorage.getItem('users')) || {};
  
    // Confirm current user ID exists in localStorage
    if (currentUserId && users[currentUserId]) {
      users[currentUserId].theme = sessionStorage.getItem('theme') || '0'; // Save User's current theme
      localStorage.setItem('users', JSON.stringify(users)); // Save the updated users data to localStorage
    }
  
    // Display login page
    document.querySelector('.login-container').style.display = 'flex';
    document.querySelector('.main-container').style.display = 'none';
  
    // Clear all session data
    sessionStorage.clear();
    //sessionStorage.removeItem('sessionActive');
    //sessionStorage.removeItem('sessionExpiry');
    
    // Ensure no input fields in Login Page
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
  }
  
  
 // User Sign-out 
document.getElementById('signOutBtn').addEventListener('click', function() {
  const confirmSignOut = confirm("Are you sure you want to sign out?");

  // User confirms Sign out
  if (confirmSignOut) {
    loggedIn = false;
    logoutUser();
  }
});

const welcomePage = `
  <h2 class="mainPanelHeader" style="padding: 0 3%; margin-bottom: 3%;">WELCOME</h2>
  <p style="text-align: center; padding: 0 5%;">
    We're so glad you're here! Step into a world where past, present, and future intertwine. Here, you can store the moments that matter, 
    preserve them for tomorrow, and share them when the time is right. Whether it’s a heartfelt message, a photo from a cherished memory, 
    or a vision for the future, your Time Capsule ensures it stays safe until the perfect moment to open it again. Create your Time Capsule 
    today, add your memories, and set the date when they will be revealed. This is your story, sealed and protected.
  </p>
  <small style="text-align: center; color: grey; font-style: italic;">
    New user? Need some help? Click on the ' ? ' for help.
  </small>
`;

// LOGIN FORM
document.getElementById('loginForm').addEventListener('submit', async function (event) {
  event.preventDefault(); 

  // Get the values of username and password input fields
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const users = JSON.parse(localStorage.getItem('users')) || {};
  
  // Find the user object based on the entered username
  const user = Object.values(users).find(user => user.username === username);

  if (user) {
    // Hash the entered password to compare with the stored hashed password
    const hashedPassword = await hashPassword(password);
    
    // If the hashed passwords match, proceed with login
    if (hashedPassword === user.password) {
      // alert('Login successful!');

      // Start the session timer
      startSessionTimer();

      // Hide the login container and show the main content
      document.querySelector('.login-container').style.display = 'none';
      document.querySelector('.main-container').style.display = 'flex';
      mainPanel.innerHTML = welcomePage;
      
      // Store session data in sessionStorage
      sessionStorage.setItem('loggedIn', 'true');
      sessionStorage.setItem('username', username);
      sessionStorage.setItem('theme', user.theme); 
      currentThemeIndex = user.theme;
      
      // Store the userId in sessionStorage
      sessionStorage.setItem('userId', Object.keys(users).find(id => users[id].username === username));
      loggedIn = true;
      currentUserId = sessionStorage.getItem('userId');

      // Update the theme based on the user's settings
      updateTheme();
      
      // Display the closest upcoming capsule (feature in the app)
      displayClosestUpcomingCapsule();

    } else {
      // If the password is invalid, clear the password input field
      document.getElementById('password').value = '';
      alert('Invalid password. Please try again.');
    }
  } else {
    // If the username is not found, clear the password input field
    document.getElementById('password').value = '';
    alert('User not found. Please check your username or sign up.');
  }
});

// ====================================================================================================================
// SIGN UP & PASSWORD VALIDATION
// ====================================================================================================================
// Password Validation
function isValidPassword(password) {
    // Check password length (at least 8 characters)
    if (password.length < 8) {
      return false; 
    }
    // Check for digits (0-9)
    if (!/[0-9]/.test(password)) {
      return false;
    }
    // Check for uppercase letters (A-Z)
    if (!/[A-Z]/.test(password)) {
      return false; 
    }
    // Check for lowercase letters (a-z)
    if (!/[a-z]/.test(password)) {
      return false; 
    }
    // Check for special characters (!@#$%^&*)
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return false; 
    }
    return true; // All checks pass
  }

// Sign Up Form
document.getElementById('signupForm').addEventListener('submit', async function (event) {
  event.preventDefault();

  // Get username, email & new password
  const newUsername = document.getElementById('newUsername').value; 
  const email = document.getElementById('email').value; 
  const newPassword = document.getElementById('newPassword').value; 
  const users = JSON.parse(localStorage.getItem('users') || '{}') || {}; // Retrieve existing users from localStorage, or initialize an empty object

  // Check if the new username already exists in users
  const usernameExists = Object.values(users).some(user => user.username === newUsername);
  // Check if the new email already exists in users
  const emailExists = Object.values(users).some(user => user.email === email);

  // Reject repeated usernames
  if (usernameExists) {
    alert('Username already exists. Please choose a different username.');
  } 
  // Reject repeated emails
  else if (emailExists) {
    alert('Email already exists. Please use a different email.');
  }
  // Reject passwords that do not meet requirements
 else if (!isValidPassword(newPassword)) {
    alert('Password must be at least 8 characters long and contain at least one digit, one uppercase letter, one lowercase letter, and one special character.');
  }
  else { //All validation passed

    const hashedPassword = await hashPassword(newPassword); // Hash password
    const userId = generateUserId(); // Generate a random userId

    // Store the new user in users obj
    users[userId] = { 
      username: newUsername, 
      password: hashedPassword, 
      email: email, 
      friends: [], 
      userCapsule: [], 
      createdCapsule: [], 
      theme: 0 
    };

    localStorage.setItem('users', JSON.stringify(users)); // Save the updated users object back to localStorage
    alert('Sign up successful! Please login.');

    document.getElementById('signupForm').reset(); // Reset the signup form after successful signup
    document.getElementById('toggleForm').click(); // Go to login form
  }
});

// ====================================================================================================================
// THEME
// ====================================================================================================================
const body = document.body;
const themeButton = document.getElementById("themeBtn");
themeButton.addEventListener("click", changeTheme); // Change theme when button clicekd

// Theme's Array (3 Themes: Default, Pink, Black)
const themes = ['', 'pink-theme', 'dark-theme']; 
let currentThemeIndex = 0; // Default theme to '0'

// Elements with Themes
const elements = [
    '#mainPanel', '.generalBtn', '.generalBtn:hover', '.generalBtn:disabled', '.deleteBtn', '.deleteBtn:hover', 
    '.addBtn', '.addBtn:hover', 'body', '.mainPanelHeader', '.login-container', 
    '.login-box', '#loginFormTitle', '.loginField', '.formLabel', '.formInput', '.submitButton', '.submitButton.sunken', 
    '.submitButton.sunken:hover', '.submitButton.active', '.submitButton:hover', '.contactsHeader', '#toggleForm', 
    '#toggleForm:hover', '.main-container', '.main-container2', '.headerSection', '.headerBtn', '.headerBtn:hover', 
    '.mainContainer', '.notificationPanel', '.notificationDetails', '.upcomingCapsuleNotif', '.sideTabs', '.sideTabs:hover', 
    '.helpContainer', '.helpCategory', '.helpTitle', '.helpTitle:hover', '.helpDescription', 
    '.noFriendsAlert', '.userResultsDiv', '.friendsDiv', '.createCapsuleTitle', '.capsuleMessage', '#charCount', 
    '.createCapsuleFileBtn', '.createCapsuleFileBtn:hover', '#filePreviewContainer', '.file-remove', 
    '.file-remove button:hover', '.selectedReceiversContainer', '.noReceiversLabel', '.list-group', '.list-group-item', 
    '.addReceiversPanelBtn', '#addReceiversPanelBtn', '#addReceiversPanelBtn:hover', '#addReceiversPanelBtn.pressed', 
    '#addReceiversPanel', '#friendListContainer', '#receiverStatus', 
    '.createCapsuleDateBtn', '.capsule', '.ongoingUnlockDate', '.countdown-box', 
    '.libraryViewBtn', '.contactsHeader button', '.libraryViewBtn:hover', '.contactsHeader button:hover', '.lockedRow', 
    '.unlockedRow', '.unlockedRow:hover', '.backButton', '.backButton:hover', '.capsuleDetails', '.displayTitle', 
    '.displayDate', '.displayFilesContainer', '.displayFilesItem', '.capsuleDelete.deleteBtn', 
  ];

// Changing theme
function changeTheme() {
  // Remove the current theme class from all elements that have the theme
  if (themes[currentThemeIndex]) {
    elements.forEach(selector => {
      const el = document.querySelectorAll(selector);  // Select matching elements
      el.forEach(element => {
        element.classList.remove(themes[currentThemeIndex]);  // Remove the current theme class
      });
    });
  }

  // Move to next theme index (looping in Theme array)
  currentThemeIndex = (currentThemeIndex + 1) % themes.length; 

  // Apply the new theme class to all selected elements
  if (themes[currentThemeIndex]) {
    elements.forEach(selector => {
      const el = document.querySelectorAll(selector);
      el.forEach(element => {
        element.classList.add(themes[currentThemeIndex]);  // Add the new theme class
      });
    });
  }

  // Store / Update theme index in sessionStorage
  sessionStorage.setItem('theme', currentThemeIndex);
}

// Updating Theme
function updateTheme() {
  // Check if any of the elements exist on the page
  const anyElementExists = elements.some(selector => document.querySelector(selector));

  // If the theme and elements exist, remove the current theme class and apply the new theme
  if (themes[currentThemeIndex] && anyElementExists) {
    elements.forEach(selector => {
      const el = document.querySelectorAll(selector); 
      el.forEach(element => {
        element.classList.remove(themes[currentThemeIndex]); // Remove the current theme class
      });
    });
  }

  // Apply the new theme class to all selected elements
  if (themes[currentThemeIndex] && anyElementExists) {
    elements.forEach(selector => {
      const el = document.querySelectorAll(selector);  
      el.forEach(element => {
        element.classList.add(themes[currentThemeIndex]);  // Add the new theme class
      });
    });
  }
}
// ====================================================================================================================
// ENCRYPTION & DECRYPTION
// ====================================================================================================================
function generateSharedKey(creatorId, receiverId) {
  const combined = creatorId + receiverId; // Combine creatorId & receiverId
  let hash = 0; 
 
  for (let i = 0; i < combined.length; i++) {
    hash = ((hash << 5) - hash) + combined.charCodeAt(i); // Apply bitwise operations to generate hash
    hash = hash & hash; // Convert to 32bit integer
  }

  return hash.toString(); // Return the hashed result as the shared key
}

// XOR encryption/decryption
function xorEncryptDecrypt(message, key) {
  // Ensure the message is a string
  if (typeof message !== 'string') {
    message = String(message);
  }
    
  let result = '';
  for (let i = 0; i < message.length; i++) {
     // XOR the character code of the message with the key's corresponding character code
    result += String.fromCharCode(message.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return result; // Return (encrypted or decrypted message)
}

// ====================================================================================================================
// DEFAULT DISPLAY (WELCOME PAGE) + NOTIFICATIONS 
// ====================================================================================================================
// Main panel where all content is displayed
const mainPanel = document.getElementById('mainPanel');
const titleContainer = document.getElementById('titleContainer'); 

// Reset to default (Welcome page) when logo is selected
titleContainer.addEventListener('click', () => {
  mainPanel.innerHTML = welcomePage; 
});

// NOTIFICATIONS: Update User Status
function displayClosestUpcomingCapsule() {
  const notificationContainer = document.getElementById('notificationContainer');  // Container for notifications
  const users = JSON.parse(localStorage.getItem('users')) || {};  // Get users from localStorage (empty object if not available)

  // Get the user's capsule list, created capsules, and friends
  const userCapsules = users[currentUserId].userCapsule;  // Capsules the user has received
  const createdCapsules = users[currentUserId].createdCapsule;  // Capsules the user has sent
  const friends = users[currentUserId].friends;  // User's friends list

  // Retrieve capsules from Local Storage & Filter for user's receiving capsules
  const storedCapsules = JSON.parse(localStorage.getItem('capsules')) || [];  
  const userCapsuleDetails = storedCapsules.filter(capsule => userCapsules.includes(capsule.id));

  const currentDate = new Date();// Get the current date
  // Filter future capsules based on the unlock date & sort by closest first (unlock date)
  const futureCapsules = userCapsuleDetails.filter(capsule => new Date(capsule.date) > currentDate);
  futureCapsules.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Notification Contents 1
  notificationContainer.innerHTML = `
    <h3 class="notifCapsuleTitle">NOTIFICATIONS</h3>
    <p class="notificationDetails ">(<strong>${userCapsules.length}</strong>) Capsules Received</p>
    <p class="notificationDetails ">(<strong>${createdCapsules.length}</strong>) Capsules Sent</p>
    <p class="notificationDetails ">(<strong>${friends.length}</strong>) Friends</p>
  `;

  // Calculate Days Remaining 
  const calculateDaysRemaining = (dateObj) => {
    const today = new Date();
    const timeDiff = dateObj.getTime() - today.getTime();  // Difference in milliseconds
    const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));  // Convert to days
    return daysRemaining;  // Return the number of days remaining
  };

  // Get details of closest upcoming capsule
  if (futureCapsules.length > 0) {
    const closestCapsule = futureCapsules[0];  // The closest upcoming capsule
    const capsuleSharedKey = generateSharedKey(closestCapsule.creator, closestCapsule.receiver[0]); // Generate shared key 
    const decryptedTitle = xorEncryptDecrypt(closestCapsule.title, capsuleSharedKey); // Decrypt details
    const capsuleDate = new Date(closestCapsule.date);  // Get unlock date
    const daysRemaining = calculateDaysRemaining(capsuleDate);  // Calculate days remaining

    // Get current theme
    const currentThemeClass = document.body.classList.contains('dark-theme') ? 'dark-theme' :
                            document.body.classList.contains('pink-theme') ? 'pink-theme' : 'natural-theme';

    // Notification Contents 2
    notificationContainer.innerHTML += `
    <div class="upcomingCapsuleNotif ${currentThemeClass}">
      <p><small>Next capsule unlocks in</small><br><strong>${daysRemaining} ${daysRemaining === 1 ? 'day!' : 'days!'}</strong></p>
    </div>`;
  } else {
    // If no receiving Capsule
    notificationContainer.innerHTML += `
    <div class="upcomingCapsuleNotif">
      <p>No upcoming capsules...</p>
    </div>`;
  }
}

// Update Notifications every 5 minutes (default)
setInterval(displayClosestUpcomingCapsule, 300000);

// ====================================================================================================================
// HELP SECTION
// ====================================================================================================================
const helpeBtn = document.getElementById('helpBtn');

helpeBtn.addEventListener('click', () => {

  const mainPanel = document.getElementById('mainPanel');
  mainPanel.innerHTML = '<h2 class="mainPanelHeader">HELP</h2>';

  fetch("public/data/help.json") // Fetch the help.json data from the public folder
      .then(response => response.json())  // Parse the JSON response
      .then(data => {
          // Add Features Section
          const featuresDiv = document.createElement('div');
          featuresDiv.classList.add('helpContainer');
          featuresDiv.innerHTML = '<h3 class="helpCategory">Getting Started...</h3>'; // Set section heading

          // Create elements for each 'feature'
          data.features.forEach(feature => {
              const featureDiv = document.createElement('div');
              featureDiv.classList.add('helpDiv'); 

              // Title
              const titleElement = document.createElement('strong');
              titleElement.classList.add('helpTitle');  
              titleElement.textContent = feature.title;  

              // Description
              const descriptionElement = document.createElement('p');
              descriptionElement.classList.add('helpDescription');  
              descriptionElement.textContent = feature.description;  
              descriptionElement.style.display = 'none';  

              // User clicks on Title
              titleElement.addEventListener('click', () => {
                  const allTitles = document.querySelectorAll('.helpTitle');
                  allTitles.forEach(t => t.classList.remove('pressed'));  // Reset all Titles

                  // Find the currently visible description & hide it
                  const currentlyVisible = document.querySelector('.feature-description[style="display: block;"]');
                  if (currentlyVisible && currentlyVisible !== descriptionElement) {
                      currentlyVisible.style.display = 'none'; 
                  }
                  // Toggle the clicked description visibility & its Title styling
                  if (descriptionElement.style.display === 'none') {
                      descriptionElement.style.display = 'block'; 
                      titleElement.classList.add('pressed');  
                  } else {
                      descriptionElement.style.display = 'none';  
                      titleElement.classList.remove('pressed'); 
                  }
              });

              descriptionElement.classList.add('feature-description');
              featureDiv.appendChild(titleElement);
              featureDiv.appendChild(descriptionElement);
              featuresDiv.appendChild(featureDiv);
          });

          mainPanel.appendChild(featuresDiv);

          // Add Common Q&A Section
          const commonQADiv = document.createElement('div');
          commonQADiv.classList.add('helpContainer');  
          commonQADiv.innerHTML = '<h3 class="helpCategory">Common Questions & Answers</h3>'; 

          // Create elements for each 'Q&A'
          data.commonQA.forEach(qa => {
              const qaDiv = document.createElement('div');
              qaDiv.classList.add('helpDiv');

              // Title
              const questionElement = document.createElement('strong');
              questionElement.classList.add('helpTitle'); 
              questionElement.textContent = qa.question;  
              questionElement.style.cursor = 'pointer';  

              // Description
              const answerElement = document.createElement('p');
              answerElement.classList.add('helpDescription');  
              answerElement.textContent = qa.description; 
              answerElement.style.display = 'none'; 

              // User clicks on Title
              questionElement.addEventListener('click', () => {
        
                  const allTitles = document.querySelectorAll('.helpTitle');
                  allTitles.forEach(t => t.style.color = '');  
                  // Find the currently visible description & hide it
                  const currentlyVisible = document.querySelector('.qa-answer[style="display: block;"]');
                  if (currentlyVisible && currentlyVisible !== answerElement) {
                      currentlyVisible.style.display = 'none'; 
                  }
                   // Toggle the clicked description visibility & its Title styling
                  if (answerElement.style.display === 'none') {
                      answerElement.style.display = 'block'; 
                  } else {
                      answerElement.style.display = 'none';  
                  }
              });
          
              answerElement.classList.add('qa-answer');
              qaDiv.appendChild(questionElement);
              qaDiv.appendChild(answerElement);
              commonQADiv.appendChild(qaDiv);  
          });

          mainPanel.appendChild(commonQADiv);
          setTimeout(() => { updateTheme(); }, 0); // Update Theme 
      })
      .catch(error => { // Catch error in loading json data
          console.error('Error loading help data:', error);
          mainPanel.innerHTML += '<p style="text-align: center;">Failed to load help content.</p>';
      });

      setTimeout(() => { updateTheme(); }, 0); // Update Theme 
});

// ====================================================================================================================
// SCHDULED CAPSULES (ONGOING/COUNTDOWN)
// ====================================================================================================================
const ongoingCapsuleBtn = document.getElementById('ongoingCapsuleBtn');

ongoingCapsuleBtn.addEventListener('click', () => {
  
  const users = JSON.parse(localStorage.getItem('users')) || {};
  const userCapsules = users[currentUserId].userCapsule;
  const storedCapsules = JSON.parse(localStorage.getItem('capsules')) || [];
  // Filter capsules to get the ones that match the user's capsule ID
  const userCapsuleDetails = storedCapsules.filter(capsule => userCapsules.includes(capsule.id));

  const currentDate = new Date();

  // Separate future(locked) and past(unlocked) capsules based on the unlock date
  const futureCapsules = userCapsuleDetails.filter(capsule => new Date(capsule.date) > currentDate);

  // Sort the future capsules to current date
  futureCapsules.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Format the date and time
  const formatDateTime = (dateObj) => {
    const datePart = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timePart = dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true }).replace(/\s/g, '');
    return `${datePart} [${timePart}]`;
  };

  // Panel Title
  let capsuleDisplay = '<h2 class="mainPanelHeader">Incoming Capsules</h2> <div class="ongoingCapsulePanel">';

  // If no receiving capsules
  if (userCapsuleDetails.length === 0) {
    capsuleDisplay += '<p style="text-align: center;">No Incoming Capsules.</p>';
  }

  // Loop through the future (locked) capsules 
  futureCapsules.forEach((capsule, index) => {
    let capsuleSharedKey = generateSharedKey(capsule.creator, capsule.receiver[0]); // Generate a shared key

    // Get the creator username and display "Me" if is from themselves
    const creatorUsername = users[capsule.creator]?.username || 'Unavailable';
    const displayCreator = creatorUsername === users[currentUserId].username ? "Me" : creatorUsername;

    // Display each Capsule
    capsuleDisplay += `
    <div class="capsule" style="margin-bottom:2rem;">
      <h3 class="ongoingTitle">${xorEncryptDecrypt(capsule.title, capsuleSharedKey)}</h3>
      <p class="ongoingSender">~ from <strong>${displayCreator}</strong> on <strong>${formatDateTime(new Date(capsule.createdAt))}</strong> ~</p>
      <p class="ongoingUnlockDate">UNLOCK ON: ${formatDateTime(new Date(capsule.date))}</p>
      <div class="countdown-container">
        <strong>TIME REMAINING</strong>
        <div class="countdown countdown-row" id="countdown-${index}">
          <div class="countdown-box"><span class="countdown-days"></span>
          <div class="countdown-boxLabel">DAYS</div></div>

          <div class="countdown-box"><span class="countdown-hours"></span>
          <div class="countdown-boxLabel">HOURS</div></div>

          <div class="countdown-box"><span class="countdown-minutes"></span>
          <div class="countdown-boxLabel">MINUTES</div></div>

          <div class="countdown-box"><span class="countdown-seconds"></span>
          <div class="countdown-boxLabel">SECONDS</div></div>
        </div>
      </div>
    </div>`;
  });
  capsuleDisplay += `</div>`;

  mainPanel.innerHTML = capsuleDisplay; 
  setTimeout(() => { updateTheme(); }, 0); // Update Theme 

  // Update Countdown
  futureCapsules.forEach((capsule, index) => {
    const countdownElement = document.getElementById(`countdown-${index}`);
    const capsuleDate = new Date(capsule.date);

    const updateCountdown = () => {
      const currentTime = new Date();
      const timeRemaining = capsuleDate - currentTime;

      // If Countdown reach 0 
      if (timeRemaining <= 0) {
        countdownElement.textContent = "Capsule Unlocked!";
        clearInterval(countdownInterval); // Stop the countdown
      } else {
        // Calculate remaining days, hours, minutes, and seconds
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        // Update the countdown elements with the calculated values
        countdownElement.querySelector('.countdown-days').textContent = days;
        countdownElement.querySelector('.countdown-hours').textContent = hours;
        countdownElement.querySelector('.countdown-minutes').textContent = minutes;
        countdownElement.querySelector('.countdown-seconds').textContent = seconds;
      }
    };

    const countdownInterval = setInterval(updateCountdown, 1000); // Update Countdown every second
    // Initial countdown update
    updateCountdown();
  });
});

// ====================================================================================================================
// CAPSULE LIBRARY (MY CAPSULES) + CAPSULE DETAILS
// ====================================================================================================================
let refresh = false;
const capsuleLibraryBtn = document.getElementById('capsuleLibraryBtn');

capsuleLibraryBtn.addEventListener('click', () => {
  const users = JSON.parse(localStorage.getItem('users')) || {};
  const userCapsules = users[currentUserId].userCapsule;
  const createdCapsules = users[currentUserId].createdCapsule;
  const storedCapsules = JSON.parse(localStorage.getItem('capsules')) || [];
  
  // Filter received capsules that match the user's received capsule IDs
  const userCapsuleDetails = storedCapsules.filter(capsule => userCapsules.includes(capsule.id));
  // Filter created capsules that match the user's created capsule IDs
  const createdCapsuleDetails = storedCapsules.filter(capsule => createdCapsules.includes(capsule.id));
    
  const currentDate = new Date();// Get the current date

  // Set the isViewEnabled flag based on whether it's a refresh
  let isViewEnabled = refresh ? true : false;

  // Default settings for viewing future(locked) and past(unlocked) capsules
  let showFutureCapsules = true;
  let showPastCapsules = true;

  let futureCapsules = [];
  let pastCapsules = [];

  // Display capsules based on the filters (locked/unlocked, received/created)
  function renderCapsules(isViewEnabled, showFutureCapsules, showPastCapsules) {
    
    if (isViewEnabled) {
    // Show capsules created by user 
      futureCapsules = createdCapsuleDetails.filter(capsule => new Date(capsule.date) > currentDate);
      pastCapsules = createdCapsuleDetails.filter(capsule => new Date(capsule.date) <= currentDate);
    } else {
      // Show capsules received by user
      futureCapsules = userCapsuleDetails.filter(capsule => new Date(capsule.date) > currentDate);
      pastCapsules = userCapsuleDetails.filter(capsule => new Date(capsule.date) <= currentDate);
    }
    refresh = false;
    
    // Sort future & past capsules by date
    futureCapsules.sort((a, b) => new Date(b.date) - new Date(a.date));
    pastCapsules.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Format the date and time
    const formatDateTime = (dateObj) => {
      const datePart = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const timePart = dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true }).replace(/\s/g, '');
      return `${datePart} [${timePart}]`;
    };

    let capsuleDisplay = '<div class="capsuleLibraryHeader"> <div class="capsuleLibraryTitle">';
    // Panel Title
    capsuleDisplay += isViewEnabled ? '<h2 class="mainPanelHeader">Sent Capsules</h2> </div>' : '<h2 class="mainPanelHeader">Received Capsules</h2> </div>';
    
    // Button filter (Created/Received Capsules)
    capsuleDisplay += `
    <button id="toggleCapsuleView" class="libraryViewBtn ">
    ${isViewEnabled ? 'VIEW RECEIVED' : 'VIEW SENT'}
    </button>
    </div> `;

    // Filter toggle switches (Locked / Unlocked)
    capsuleDisplay += `
    <div class="futurePastCapsuleDiv">
      <label class="toggle-switch">
        <input type="checkbox" id="futureCapsulesToggle" ${showFutureCapsules ? 'checked' : ''}>
        <span class="slider"></span>
        <span class="switch-label">LOCKED</span>
      </label>

      <label class="toggle-switch">
        <input type="checkbox" id="pastCapsulesToggle" ${showPastCapsules ? 'checked' : ''}>
        <span class="slider"></span>
        <span class="switch-label">UNLOCKED</span>
      </label>
    </div>
    `;

    // If no capsules created by user
    if (isViewEnabled && createdCapsuleDetails.length === 0) {
      capsuleDisplay += '<p style="text-align: center;" >No capsules created.</p>';
    } 
    // If no capsules received by user
    if (!isViewEnabled && userCapsuleDetails.length === 0) {
      capsuleDisplay += '<p style="text-align: center;">No received capsules.</p>';
    }

    // Display future capsules
    if (showFutureCapsules) {
      futureCapsules.forEach((capsule, index) => {
        let capsuleSharedKey = generateSharedKey(capsule.creator, capsule.receiver[0]);
        const capsuleDate = new Date(capsule.date);
        const creatorUsername = users[capsule.creator]?.username || 'Unavailable';
        const displayCreator = creatorUsername === users[currentUserId].username ? "Me" : creatorUsername;
        const displayReceivers = capsule.receiver.map(receiverId => {
          const receiverUsername = users[receiverId]?.username || 'Unavailable';
          return receiverUsername === users[currentUserId].username ? 'Me' : receiverUsername;
        }).join(', '); 

        capsuleDisplay += `
        <div class="capsuleLibraryContainer">
          <div class="capsule">
            <h3 class="lockedTitle">${xorEncryptDecrypt(capsule.title, capsuleSharedKey)}</h3>
            <p class="lockedSender">~ from <strong>${displayCreator}</strong> ~</p>
            <p class="unlockDate">Created on: <strong>${formatDateTime(new Date(capsule.createdAt))}</strong></p>
            <div class="lockedRow">
              <P>LOCKED TILL ${formatDateTime(capsuleDate)}</p>
            </div>
          </div>
        </div>`;
      });
    }

    // Display past capsules
    if (showPastCapsules) {
      pastCapsules.forEach((capsule, index) => {
        let capsuleSharedKey = generateSharedKey(capsule.creator, capsule.receiver[0]);
        const creatorUsername = users[capsule.creator]?.username || 'Unavailable';
        const displayCreator = creatorUsername === users[currentUserId].username ? "Me" : creatorUsername;
        const displayReceivers = capsule.receiver.map(receiverId => {
          const receiverUsername = users[receiverId]?.username || 'Unavailable';
          return receiverUsername === users[currentUserId].username ? 'Me' : receiverUsername;
        }).join(', ');

        capsuleDisplay += `
        <div class="capsuleLibraryContainer">
          <div class="capsule">
            <h3 class="lockedTitle">${xorEncryptDecrypt(capsule.title, capsuleSharedKey)}</h3>
            ${isViewEnabled ? '' : `<p class="lockedSender">~ from ${displayCreator} ~</p>`}
            <p class="lockedSender">TO: ${displayReceivers}</p>
            <p>Created On: ${formatDateTime(new Date(capsule.createdAt))}</p>
            <div class="unlockedRow capsule-title" data-index="${index}">Click to View</div>
          </div>
        </div>`;
      });
    }

    mainPanel.innerHTML = capsuleDisplay;
    setTimeout(() => { updateTheme(); }, 0); // Update Theme 

    // Handle Flters for future (locked) and past (unlocked) capsules
    document.getElementById('futureCapsulesToggle').addEventListener('change', () => {
      showFutureCapsules = !showFutureCapsules;
      backToCapsuleList(isViewEnabled, showFutureCapsules, showPastCapsules);
    });
    document.getElementById('pastCapsulesToggle').addEventListener('change', () => {
      showPastCapsules = !showPastCapsules;
      backToCapsuleList(isViewEnabled, showFutureCapsules, showPastCapsules);
    });

    document.querySelectorAll('.capsule-title').forEach(button => {
        button.addEventListener('click', (e) => {
          // Get clicked capsule index & type
          const index = e.target.getAttribute('data-index');
          const type = e.target.getAttribute('data-type'); 
      
          const capsules = JSON.parse(localStorage.getItem('capsules')) || []; 

          const capsuleId = type === 'future' ? futureCapsules[index].id : pastCapsules[index].id; // Get capsule id
          const capsule = capsules.find(capsule => capsule.id === capsuleId); // Find the capsule by its ID
      
          // console.log(capsule); debugging purposes
      
          let capsuleSharedKey = generateSharedKey(capsule.creator, capsule.receiver[0]); // Generate capsule key
          const creatorUsername = users[capsule.creator]?.username || 'Unavailable'; // Get Creator's username
          const displayCreator = creatorUsername === users[currentUserId].username ? "Me" : creatorUsername; // Display 'Me' if creator is current user
      
          // Get all receivers of capsule
          const displayReceivers = capsule.receiver.map(receiverId => {
            const receiverUsername = users[receiverId]?.username || 'Unavailable'; // Get each receiver's username
            return receiverUsername === users[currentUserId].username ? 'Me' : receiverUsername; // Replace current user with 'Me;
          }).join(', ');
      
          // Display files (if any)
          const capsuleFiles = capsule.files;
          let imageElements = ''; 
          let decryptedFilesList = [];
      
          if (Array.isArray(capsuleFiles) && capsuleFiles.length > 0) { // If capsule has files
            imageElements += `<div class="displayFilesContainer">`; 
            // Loop through each file and display it
            capsuleFiles.forEach((file, fileIndex) => { 
              const imageName = xorEncryptDecrypt(file.name, capsuleSharedKey); // Decrypt the file name
              decryptedFilesList.push(imageName);
              imageElements += `
                <div class="viewImage displayFilesItem" style="background-image: url('${file.data}');"  data-filename="${imageName}" data-filedata="${file.data}" data-fileindex="${fileIndex}">
                  <span >${imageName}</span>
                </div>`;
            });
            imageElements += `</div>`;
          }
      
          const capsuleDate = new Date(capsule.date);
          // Display Capsule Details
          let capsuleDetails = `
          <div class="capsuleLibraryContainer">
            <button id="backToCapsuleList" class="backButton">BACK</button>
            <div class="capsuleDetails">
              <h3 class="displayTitle">${xorEncryptDecrypt(capsule.title, capsuleSharedKey)}</h3> <!-- Display capsule title -->
              <p class="displayDate">${formatDateTime(new Date(capsule.createdAt))} ➜ ${formatDateTime(capsuleDate)}</p> <!-- Display capsule creation and target date -->
              <div class="displayMessageContainer">
                <p class="displayReceivers">To: ${displayReceivers}</p> <!-- Display list of receivers -->
                <p class="displayMessage">${xorEncryptDecrypt(capsule.message, capsuleSharedKey)}</p> <!-- Display decrypted message -->
                <p class="displaySender">From: ${displayCreator}</p> <!-- Display creator -->
              </div>
      
            ${decryptedFilesList.length > 0 ? `<!--<p>Files: ${decryptedFilesList.length} file(s) attached: ${decryptedFilesList.join(', ')} </p> -->` : ''}
            ${imageElements}
            <button class="capsuleDelete deleteBtn" data-index="${index}" data-type="past">Delete Capsule</button>
          </div>`;
      
          mainPanel.innerHTML = capsuleDetails; 
          setTimeout(() => { updateTheme(); }, 0); // Update Theme 
      
          // "Back" button to go back to the capsule list/library
          document.getElementById('backToCapsuleList').addEventListener('click', () => {
            backToCapsuleList(isViewEnabled, showFutureCapsules, showPastCapsules);
          });
      
          // View image in full size (Zoom in on Image)
          document.querySelectorAll('.viewImage').forEach(item => {
            item.addEventListener('click', function () {
              const fileData = this.getAttribute('data-filedata');
              const fileIndex = this.getAttribute('data-fileindex');
      
              //console.log('File clicked:', fileName); // Debugging: Log file click
      
              let displayMedia = ` 
              <div class="displayMediaContainer">
                <button id="backToCapsuleDetails" class="backButton displayImageBack">BACK</button>
                <div class="imageContainer">
                  <img class="displayImage" src="${fileData}" alt="Capsule Image ${fileIndex + 1}">
                </div>
              </div>`;
      
              const displayMediaElement = document.createElement('div');

              // Adjust main panel
              mainPanel.style.overflowY = '';
              mainPanel.style.flexDirection = '';
              
              displayMediaElement.innerHTML = displayMedia;
              setTimeout(() => { updateTheme(); }, 0); // Update Theme 
              mainPanel.appendChild(displayMediaElement); 
      
              // Hide capsule details when showing the media
              const capsuleDetailsElement = document.querySelector('.capsuleLibraryContainer');
              capsuleDetailsElement.style.display = 'none';
      
              // Back to capsule details
              document.getElementById('backToCapsuleDetails').addEventListener('click', function () {
                displayMediaElement.remove();
                mainPanel.style.overflowY = 'auto';
                mainPanel.style.flexDirection = 'column';
                capsuleDetailsElement.style.display = 'block'; // Show capsule details again
              });
            });
          });
      
          document.querySelectorAll('.capsuleDelete').forEach(button => {
            button.addEventListener('click', (e) => {
              // Get index & type of the capsule to delete
              const index = e.target.getAttribute('data-index');
              const type = e.target.getAttribute('data-type');
              deleteCapsule(index, type); // Call function to delete capsule
            });
          });
        });
      });
      
      // Capsule deletion
      function deleteCapsule(index, type) {
          const capsules = JSON.parse(localStorage.getItem('capsules')) || [];
          const capsuleId = type === 'future' ? futureCapsules[index].id : pastCapsules[index].id;   
          const capsule = capsules.find(capsule => capsule.id === capsuleId); // Find capsule by ID

          // Confirmation    
          const confirmDeletion = capsule.holders === 1 ? confirm("You are the last holder of this capsule. Deleting it will permanently remove it. Are you sure you want to delete this capsule?")
                                                      : confirm("Are you sure you want to delete this capsule?");
      
          if (confirmDeletion) {
            const users = JSON.parse(localStorage.getItem('users')) || {};
            const user = users[currentUserId];
      
            // Remove capsule id from current user's array (userCapsule & createdCapsule)
            const userCapsuleIndex = user.userCapsule.indexOf(capsuleId);
            if (userCapsuleIndex !== -1) {
              user.userCapsule.splice(userCapsuleIndex, 1);
            }
            const createdCapsuleIndex = user.createdCapsule.indexOf(capsuleId);
            if (createdCapsuleIndex !== -1) {
              user.createdCapsule.splice(createdCapsuleIndex, 1);
            }
      
            capsule.holders -= 1; // Update number of holders
      
            // If no holders left, remove the capsule permanently from localStorage
            if (capsule.holders <= 0) {
              const capsuleIndex = capsules.findIndex(capsule => capsule.id === capsuleId);
              if (capsuleIndex !== -1) {
                capsules.splice(capsuleIndex, 1);
              }
            }
      
            // Save updated users & capsules to localStorage
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('capsules', JSON.stringify(capsules));
      
            // Refresh the capsule display
            displayClosestUpcomingCapsule();
            refresh = true;
            capsuleLibraryBtn.click();
          }
      }
      
      // Filter for displaying capsules user created / user received
      const toggleCapsuleView = document.getElementById('toggleCapsuleView');
      toggleCapsuleView.addEventListener('click', () => {
        toggleCapsuleView.classList.toggle('active');
        isViewEnabled = !isViewEnabled;
        showFutureCapsules = true;
        showPastCapsules = true;
        renderCapsules(isViewEnabled, showFutureCapsules, showPastCapsules); // Refresh capsule view based on updated state
      });
  };

  // Go back to the capsule list
  function backToCapsuleList(isViewEnabled, showFutureCapsules, showPastCapsules){
    renderCapsules(isViewEnabled, showFutureCapsules, showPastCapsules);
  }
      
  renderCapsules(isViewEnabled, showFutureCapsules, showPastCapsules); // Initial render
});


// ====================================================================================================================
// CREATE CAPSULES (NEW CAPSULES)
// ====================================================================================================================
const createCapsuleBtn = document.getElementById('createCapsuleBtn');

let uploadedFiles = []; // Keep track of uploaded files

// File input change listener for preview
function fileInputListener() {
  const fileInput = document.getElementById('capsuleFiles');
  const customFileBtn = document.getElementById('customFileBtn'); 
  const filePreviewContainer = document.getElementById('filePreviewContainer');

  const maxFiles = 5;  // Limit number of files to 5

  // Display the preview container , if a file is uploaded
  if (uploadedFiles.length > 0) {
    filePreviewContainer.style.display = 'flex'; 
  } else if (uploadedFiles.length == 0) {
    filePreviewContainer.style.display = 'none';
  };

  // Trigger file input (hidden)
  customFileBtn.addEventListener('click', function() { fileInput.click(); });

  // When files are selected in the file input
  fileInput.addEventListener('change', function(event) {
    const newFiles = Array.from(event.target.files); // Convert to array

    // Check if total files exceed the limit
    if (uploadedFiles.length + newFiles.length > maxFiles) {
      alert(`You can only upload a maximum of ${maxFiles} files.`);
      event.target.value = ''; // Clear file input  
    } else {
      processFiles(newFiles); // Process the selected files
    }
    // Reset file input (after processing)
    fileInput.value = '';
  });

  // Processing uploaded/selected files
  function processFiles(files) {
    files.forEach((file) => {
      const reader = new FileReader(); // Read file as Base64
      reader.onload = function(e) {
        const base64String = e.target.result; // Get (Base64) file data
        
        const fileData = {
          name: file.name,
          data: base64String
        };

        // Add file data to uploadedFiles
        uploadedFiles.push(fileData);

        // Display the preview container, if a file is uploaded
        if (uploadedFiles.length > 0) {
          filePreviewContainer.style.display = 'flex';
        }

        // Create a preview element for the file
        const previewElement = document.createElement('div');
        previewElement.classList.add('file-preview');

        // Display preview of image
        previewElement.style.backgroundImage = `linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)),url(${base64String})`;

        // Create file name container
        const fileNameContainer = document.createElement('div');
        fileNameContainer.classList.add('file-name');
        const fileName = document.createElement('span');
        fileName.textContent = file.name;
        fileNameContainer.appendChild(fileName);

        // Remove button
        const removeButtonContainer = document.createElement('div');
        removeButtonContainer.classList.add('file-remove');
        const removeButton = document.createElement('button');
        removeButton.style.marginTop = '0.25rem'; // Style the remove button
        removeButton.textContent = 'Remove'; // Set the button text
        
        // Remove the file from preview and selected array
        removeButton.addEventListener('click', () => {
          const fileIndex = uploadedFiles.findIndex(uploadedFile => uploadedFile.data === base64String); // Find the file index
          if (fileIndex > -1) {
            uploadedFiles.splice(fileIndex, 1); // Remove file from selected array
          }
          filePreviewContainer.removeChild(previewElement); // Remove from the preview container & Hide if no files remains
          if (uploadedFiles.length === 0) {
            filePreviewContainer.style.display = 'none'; 
          }   
        });

        removeButtonContainer.appendChild(removeButton); 
        previewElement.appendChild(fileNameContainer);
        previewElement.appendChild(removeButtonContainer);
        filePreviewContainer.appendChild(previewElement);
      };

      reader.readAsDataURL(file); // Convert file to Base64
    });
  }
}

createCapsuleBtn.addEventListener('click', () => {
    uploadedFiles = [];
  
    const createCapsuleContent = `
    <h2 class="mainPanelHeader">Create a New Capsule</h2>
    <form id="capsuleForm">
      <div class="createCapsuleTitleDiv" >
        <label for="capsuleTitle" class="formLabel createCapsuleTitle ">Title</label>
        <input type="text" class="formInput" id="capsuleTitle" placeholder="Enter Capsule Title" required>
      </div>
      <div class="createCapsuleTitleDiv">
        <label for="capsuleMessage" class="formLabel createCapsuleTitle">Message</label>
        <textarea class="formInput" id="capsuleMessage" rows="7" placeholder="Enter Capsule Message" maxlength="1000" required></textarea>
        <div class="charCountWrapper">
          <small id="charCount">1000 characters remaining</small>

          <!-- Custom button for file input -->
          <input type="file" class="formInput" style="display: none;" id="capsuleFiles" multiple accept="image/*">
          <button type="button" id="customFileBtn" class="createCapsuleFileBtn">Upload Media (5 files max)</button>
        </div>
      </div>
  
    <div id="filePreviewContainer" ></div>
  
    <div class="createCapsuleReceiversDiv">
      <h3 class="createCapsuleTitle"> Capsule Receiver(s) </h3>
      <div class="selectedReceiversContainer">
      <p class="noReceiversLabel">No Selected Receivers</p>
      <ul id="receiverList" class="list-group"></ul>
      </div>
    </div>
  
  <div class="addReceiversPanelBtn">
    <button type="button" id="addReceiversPanelBtn" class="addBtn">Add Receivers</button>
    <div id="addReceiversPanel">
  
      <!-- Scrollable friend list container -->
      <h3 id="showFriendsLabel" class="addReceiversTitle">Your Friends</h3>
      <div id="friendListContainer">
      </div>
  
      <label for="capsuleReceiver" class="addReceiversTitle">Search Receivers</label>
      <small class="addReceiverNote">Add by username or email if receiver is not in your friend list.</small>
      <div class="searchReceiver">
        <input type="text" class="formInput" id="capsuleReceiver" placeholder="Enter Receiver Name or Email" autocomplete="off">
  
        <!-- Add button for adding receiver -->
        <button type="button" id="addReceiverBtn" class="addBtn" disabled>Add</button>
      </div>
      <small id="receiverStatus"></small>
    </div> 
  </div>
  <label for="capsuleDate" class="formLabel createCapsuleDateTitle createCapsuleTitle">Date & Time</label>
    <div class="createCapsuleDatesDiv">
      <div class="selectDatesSection">
        <input type="datetime-local" class="formInput" id="capsuleDate"; required>
      </div>
      <div class="selectDatesBtnSection">
        <button type="button" class="createCapsuleDateBtn generalBtn " id="addOneMonth">1 Month</button>
        <button type="button" class="createCapsuleDateBtn generalBtn" id="addSixMonths">6 Months</button>
        <button type="button" class="createCapsuleDateBtn generalBtn " id="addOneYear">1 Year</button>
        <button type="button" class="createCapsuleDateBtn generalBtn" id="addFiveYears">5 Years</button>
      </div>
    </div>
    <button type="submit" id="submit" class="submitCapsuleBtn addBtn">Create Capsule</button>
  </form>
  `;
  
    mainPanel.innerHTML = createCapsuleContent;
    setTimeout(() => { updateTheme(); }, 0); // Update Theme 
    fileInputListener();
  
    // Date + Formatting 
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1); // Only allow the next day & onwards
    const formattedDate = currentDate.toISOString().slice(0, 16); 
    const capsuleDateInput = document.getElementById('capsuleDate');
    capsuleDateInput.setAttribute("min", formattedDate);
  
    // Update date input using quick tabs (predefined date ranges)
    document.getElementById('addFiveYears').addEventListener('click', () => updateDate(5, 'years'));
    document.getElementById('addOneYear').addEventListener('click', () => updateDate(1, 'years'));
    document.getElementById('addSixMonths').addEventListener('click', () => updateDate(6, 'months'));
    document.getElementById('addOneMonth').addEventListener('click', () => updateDate(1, 'months'));
  
    // Update the date input field
    function updateDate(amount, type) {
      const currentDate = new Date();
      if (type === 'years') {
        currentDate.setFullYear(currentDate.getFullYear() + amount);
      } else if (type === 'months') {
        currentDate.setMonth(currentDate.getMonth() + amount);
      }
      capsuleDateInput.value = currentDate.toISOString().slice(0, 16);
    }
  
    // Character count for message input
    document.getElementById('capsuleMessage').addEventListener('input', function () {
      const maxLength = 1000;
      const currentLength = this.value.length;
      const remaining = maxLength - currentLength;
      document.getElementById('charCount').textContent = `${remaining} characters remaining`;
    });
  
    // Toggle visibility of the "Add Receivers" Panel
    const addReceiversBtn = document.getElementById('addReceiversPanelBtn');
    const addReceiversPanel = document.getElementById('addReceiversPanel');
    
    addReceiversBtn.addEventListener('click', function() {
      if (addReceiversPanel.style.display === 'none' || addReceiversPanel.style.display === '') {
        addReceiversPanel.style.display = 'flex';  // Show panel
        addReceiversBtn.classList.add('pressed'); 
      } else {
        addReceiversPanel.style.display = 'none';  // Hide panel
        addReceiversBtn.classList.remove('pressed');
      }
    });
  
    // Get current user and their friends from session/local storage
    const users = JSON.parse(localStorage.getItem('users')) || {};
    const currentUser = users[currentUserId];
    const friendListContainer = document.getElementById('friendListContainer');
    const receiverListElement = document.getElementById('receiverList');
    const noReceiversLabel = document.querySelector('.noReceiversLabel');
  
    let receivers = [];
    let receiversName = [];
  
    // Display message if no receivers are selected
    if (receivers.length === 0){
      noReceiversLabel.style.display = 'block';
    }else{
      noReceiversLabel.style.display = 'none';
    } 
    
    // Add a receiver to temp arrays
    const addReceiver = (receiverId, receiverName) => {
      // Check if receiverId is already in the receivers array or not
      if (!receivers.includes(receiverId)) {
        // Add receiverId & name to receivers array
        receivers.push(receiverId); 
        receiversName.push(receiverName);
  
        if (receivers.length > 0){ noReceiversLabel.style.display = 'none'; } // Hide the "no receivers" label
  
        // console.log('Receivers Array:', receivers); // Changes for debugging
        // console.log('Receivers Name Array:', receiversName); // Changes for debugging
  
        displayReceivers(); // Update display with the latest list of receivers
        removeAddButton(receiverId); // Remove 'add' button for added receiver
      }
    };
  
    // Remove the "Add" button after friend is added
    const removeAddButton = (friendId) => {
      const addButton = document.getElementById(`addFriend${friendId}`);
      if (addButton) {
        addButton.style.display = 'none'; // Hide the "Add" button for the given friend
      }
    };
  
    // Display receivers
    const displayReceivers = () => {
      receiverListElement.innerHTML = ''; // Clear list
      receivers.forEach((receiverId, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        listItem.textContent = receiversName[index]; // Display receiver's username
    
        // "Remove" button
        const removeBtn = document.createElement('button');
        removeBtn.className = 'deleteBtn';
        removeBtn.textContent = 'Remove';
        removeBtn.addEventListener('click', () => {
          removeReceiver(receiverId); // Remove selected receiver
        });
    
        listItem.appendChild(removeBtn);
        receiverListElement.appendChild(listItem); 
      });
    };
  
    // Remove a receiver from the arrays
    const removeReceiver = (receiverId) => {
      const index = receivers.indexOf(receiverId); // Find the index of the receiver in receivers array
      if (index > -1) {
        receivers.splice(index, 1);
        receiversName.splice(index, 1);
  
        // If there are no receivers left
        if (receivers.length === 0){ noReceiversLabel.style.display = 'block'; }
  
       // console.log('Receivers Array after removal:', receivers); // Log for debugging
       // console.log('Receivers Name Array after removal:', receiversName); // Log for debugging
      
        displayReceivers(); // Update display after removal
        
        // Show  "Add" button again for removed friend
        const addButton = document.getElementById(`addFriend${receiverId}`);
        if (addButton) {
          addButton.style.display = 'inline-block'; // Make the "Add" button visible again
        }
      }
    };
    
    // Add current user ("Me") to friend list
    const meItem = document.createElement('div');  
    meItem.classList.add('meReceiverItem');  
    meItem.innerHTML = `
      <span>Me</span> 
      <button type="button" class="addBtn" id="addFriend${currentUserId}">Add</button>
    `;
    friendListContainer.appendChild(meItem); 
    
    document.getElementById(`addFriend${currentUserId}`).addEventListener('click', (event) => {
      event.preventDefault();
      addReceiver(currentUserId, 'Me');  // Add the current user as receiver
    });
    
    currentUser.friends.forEach(friendId => {
      const friend = users[friendId];  // Get current user's friends
      if (friend) {
        const friendItem = document.createElement('div'); 
        friendItem.classList.add('friendReceiverItem');  
        friendItem.innerHTML =`
          <span>${friend.username}</span> 
          <button type="button" class="addBtn" id="addFriend${friendId}">Add</button> 
        `;
        friendListContainer.appendChild(friendItem); 
    
        // Add event listener for each friend button
        document.getElementById(`addFriend${friendId}`).addEventListener('click', (event) => {
          event.preventDefault(); 
          addReceiver(friendId, friend.username);  // Add friend as receiver 
        });
      }
    });
    setTimeout(() => { updateTheme(); }, 0); // Update Theme 
    
    // Search for a receiver by username or email and return the userId
    const findReceiver = (receiverInput) => {
      // Check if receiverInput matches an existing username
      const userByUsername = Object.entries(users).find(([userId, user]) => user.username === receiverInput);
      if (userByUsername) {
        return userByUsername[0]; 
      }
    
      // If no username match, check if the receiverInput matches an email
      const userByEmail = Object.entries(users).find(([userId, user]) => user.email === receiverInput);
      if (userByEmail) {
        return userByEmail[0];
      }
    
      return null;  // No match found
    };
    
    const receiverInput = document.getElementById('capsuleReceiver'); 
    const receiverStatus = document.getElementById('receiverStatus'); 
    const addSearchedReceiverBtn = document.getElementById('addReceiverBtn');  

    // Add real-time search check for receiver Input
    receiverInput.addEventListener('input', () => {
      const receiverValue = receiverInput.value.trim();  
    
      // Find the receiver's ID based on the input & update status
      if (receiverValue) {
        const receiverId = findReceiver(receiverValue); 
        if (receiverId) {
          receiverStatus.textContent = 'User exists';  
          receiverStatus.style.color = 'green';  
          addSearchedReceiverBtn.disabled = false;  
        } else {
          receiverStatus.textContent = 'No match found';  
          receiverStatus.style.color = 'red';  
          addSearchedReceiverBtn.disabled = true;
        }
      } else {
        receiverStatus.textContent = 'Search by username or email if receiver is not in your friend list.';  // Default message when input is empty
        receiverStatus.style.fontSize = 'smaller';  
        addSearchedReceiverBtn.disabled = true;  // Disable the 'Add' button
        receiverStatus.style.color = '';
      }
    });
    
    // Add receiver to the arrays when the "Add" button is clicked
    addSearchedReceiverBtn.addEventListener('click', () => {
      const receiverValue = receiverInput.value.trim();  // Get the receiver input value
      
      if (receiverValue) {
        const receiverId = findReceiver(receiverValue);  // Find the receiver's ID based on the input
        if (receiverId) {
          const receiverName = users[receiverId].username || users[receiverId].email;  // Get the receiver's name or email
          
          // Add receiver to the arrays
          addReceiver(receiverId, receiverName);
    
          // Clear the input field after adding the receiver
          receiverInput.value = '';
          
          // Reset the status message
          receiverStatus.textContent = 'Search by username or email if receiver is not in your friend list.';
          receiverStatus.style.color = 'black';  // Reset text color
          
          // Disable the "Add" button again until a new valid input is entered
          addSearchedReceiverBtn.disabled = true;
        }
      }
    });
    
    // Generate a random capsuleId
    function generateCapsuleId() { return Math.floor(Math.random() * 1000000); }
    
    // Submit Form (Create Capsule)
    document.getElementById('capsuleForm').addEventListener('submit', function (event) {
      event.preventDefault();
    
      if (receivers.length === 0) {
        alert('Please add at least one receiver before submitting the form.');
        return;
      }
    
      const capsuleTitle = document.getElementById('capsuleTitle').value;  
      const capsuleMessage = document.getElementById('capsuleMessage').value; 
      const capsuleFiles = document.getElementById('capsuleFiles').files;  
      const capsuleDate = document.getElementById('capsuleDate').value;  
      const createdAt = new Date().toISOString(); 
    
      const users = JSON.parse(localStorage.getItem('users')) || {};  
      const creatorId = sessionStorage.getItem('userId');  
    
      // Generate shared key
      const sharedKey = generateSharedKey(creatorId, receivers[0]);
      console.log("Selected Files:", Array.from(capsuleFiles).map(file => file.name));
    
      // Encrypt capsule content
      const encryptedMessage = xorEncryptDecrypt(capsuleMessage, sharedKey);  // Encrypt the message
      const encryptedTitle = xorEncryptDecrypt(capsuleTitle, sharedKey);  // Encrypt the title
    
      const capsuleId = generateCapsuleId();  // Generate capsule ID
      const totalHolders = receivers.includes(creatorId)? receivers.length : receivers.length + 1; // Count total holders (Total receiver(s) + creator)
    
      // Capsule Format
      const capsuleData = {
        id: capsuleId,
        title: encryptedTitle,
        message: encryptedMessage,  
        files: uploadedFiles.map(file => ({ name: xorEncryptDecrypt(file.name, sharedKey), data: file.data })),  // Store encrypted file names and data
        receiver: receivers, 
        creator: creatorId,  
        date: capsuleDate,  
        holders: totalHolders,  
        createdAt: createdAt  
      };
    
      // console.log("Capsule Data:", capsuleData); // Debuging

      // Save capsule to localStorage
      let storedCapsules = JSON.parse(localStorage.getItem('capsules')) || [];  
      storedCapsules.push(capsuleData);
      localStorage.setItem('capsules', JSON.stringify(storedCapsules));
    
      // Add capsuleId to each receiver and the creator data
      receivers.forEach(receiverId => {
        if (users[receiverId]) {
          users[receiverId].userCapsule.push(capsuleId); 
        }
      });
      if (users[creatorId]) {
        users[creatorId].createdCapsule.push(capsuleId);  
      }
    
      // Save updated users back to localStorage
      localStorage.setItem('users', JSON.stringify(users));
    
      alert("Your Capsule has been sent!");
      displayClosestUpcomingCapsule(); // Update Notifications 
      document.getElementById('capsuleForm').reset();  // Reset the form
      uploadedFiles = []; 
      refreshForm();  
    });
}); 
    
// Refresh the capsule form
function refreshForm(){ createCapsuleBtn.click(); }

// ====================================================================================================================
// CONTACTS (ADD/REMOVE FRIENDS)
// ====================================================================================================================
 
// Get the button for opening the contacts library by its ID
const contactsLibraryBtn = document.getElementById('contactsLibraryBtn');

contactsLibraryBtn.addEventListener('click', () => {

  showcontactsLibrary();

  function showcontactsLibrary() {
    const contactsLibraryContent = `
      <div class="contactsHeader">
        <h2 class="mainPanelHeader">Search Users</h2>
        <button id="toggleViewBtn">CONTACTS 📒</button>
      </div>
      <div class="searchUserBar">
        <input type="text" class="formInput" id="searchInput" placeholder="Search Users (Username or Email)" autocomplete="off">
      </div>
      <div id="searchResults" style="margin-bottom: 1rem;"></div>
    `;

    mainPanel.innerHTML = contactsLibraryContent;
    setTimeout(() => { updateTheme(); }, 0); // Update Theme 

    const searchInput = document.getElementById('searchInput');

    // If the search input field exists, add event listeners for search functionality
    if (searchInput) {
      
      searchInput.addEventListener('input', filterUsers); // Filter users as the user types

      
      searchInput.addEventListener('keydown', function(event) { // Filter users when user enter key press  
        if (event.key === 'Enter') {
          filterUsers();
        }
      });
    }

    // Toggle between search user view and friend list view
    const toggleViewBtn = document.getElementById('toggleViewBtn');
    toggleViewBtn.addEventListener('click', () => {
      showFriendList();
    });
  }

  // Filter users based on the search input
  function filterUsers() {
    
    const query = searchInput.value.toLowerCase(); // Convert input to lowercase

    const users = JSON.parse(localStorage.getItem('users')) || {};
    const loggedInUserId = sessionStorage.getItem('userId');
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = ''; // Clear any previous search results

    // If there is a search query, filter and display users
    if (query) {
      // Filter users that match the query (either in username or email): exclude current user*
      const matchingUsers = Object.entries(users).filter(([userId, user]) => {
        return userId !== loggedInUserId && (user.username.toLowerCase().includes(query) || user.email.toLowerCase().includes(query));
      });

      // Display matching users 
      if (matchingUsers.length > 0) {
        matchingUsers.forEach(([userId, user]) => {
          const userElement = document.createElement('div');
          userElement.classList.add('userResultsDiv');

          // If the email is an exact match
          const emailMatchMessage = user.email.toLowerCase() === query ? "(Email is a match!)" : "";

          userElement.innerHTML = `
            <span class="userResultsName">${user.username} ${emailMatchMessage}</span>
            <button class="addFriendBtn addBtn" id="addFriendBtn-${userId}">Add Friend</button>
          `;
          resultsContainer.appendChild(userElement);

          // Check if the displayed user is already a friend
          const loggedInUser = users[loggedInUserId];
          const userIsFriend = loggedInUser.friends && loggedInUser.friends.includes(userId);

          // If the user is already a friend, change the button to "Remove Friend"
          if (userIsFriend) {
            const addButton = document.getElementById(`addFriendBtn-${userId}`);
            addButton.textContent = 'Remove Friend';
            addButton.classList.remove('addFriendBtn', 'addBtn');
            addButton.classList.add('deleteBtn', 'removeFriendBtn');
          }

          // Toggle friend status: "Add/Remove Friend" button 
          document.getElementById(`addFriendBtn-${userId}`).addEventListener('click', function() {
            const isRemove = this.textContent === 'Remove Friend';

            toggleFriendStatus(userId, isRemove);

            // Confirmation for removing friend
            if (isRemove) {
              const confirmRemove = confirm('Are you sure you want to remove this friend?');
              if (!confirmRemove) {
                return; 
              }
            }

            // Update the button (Add/Remove)
            const addButton = document.getElementById(`addFriendBtn-${userId}`);
            if (isRemove) {
              addButton.textContent = 'Add Friend';
              addButton.classList.remove('deleteBtn', 'removeFriendBtn');
              addButton.classList.add('addFriendBtn', 'addBtn');
            } else {
              addButton.textContent = 'Remove Friend';
              addButton.classList.remove('addFriendBtn', 'addBtn');
              addButton.classList.add('deleteBtn', 'removeFriendBtn');
            }
          });
        });
        setTimeout(() => { updateTheme(); }, 0); // Update Theme 
      } else {
        // If no matches are found
        resultsContainer.innerHTML = '<div class="noFriendsAlert">No matches found</div>';
        setTimeout(() => { updateTheme(); }, 0); // Update Theme 
      }
    }
  }

  // Toggle the friend status (Add/Remove)
  function toggleFriendStatus(userId, isRemove) {
    const loggedInUser = sessionStorage.getItem('userId');
    const users = JSON.parse(localStorage.getItem('users')) || {};
  
    // Add user or remove the friend from the current user's friends array
    if (isRemove) {
      // Removing the friend (userId) from the user's friend array
      const index = users[loggedInUser].friends.indexOf(userId);
      if (index !== -1) {
        users[loggedInUser].friends.splice(index, 1); 
      }
    } else {
       // Add user (userId) to the current user's friend array
      users[loggedInUser].friends.push(userId);
    }
  
    localStorage.setItem('users', JSON.stringify(users)); // Update the user data in localStorage
    displayClosestUpcomingCapsule(); // Update Notifications
  }
  
  // Show user's Friend List
  function showFriendList() {
    const users = JSON.parse(localStorage.getItem('users')) || {};
    const loggedInUser = sessionStorage.getItem('userId');
    const friendList = users[loggedInUser]?.friends || [];
  
    let friendListContent =`
      <div class="contactsHeader">
        <h2 class="mainPanelHeader">Your Friends</h2>
        <button id="toggleToLibraryBtn">SEARCH USER</button>
      </div>
      <div id="friendListResults" style=" margin-bottom: 1rem; margin: 0 15%; ">
    `;
  
    mainPanel.innerHTML = friendListContent;
  
    // Display friends
    if (friendList.length > 0) {
      friendList.forEach((friendId) => {
        const friend = users[friendId];  // Get details (username & id) for each friend
        friendListContent += `
          <div class="friendsDiv">
            <span class="userResultsName">${friend.username}</span>
            <button class="removeFriendBtn deleteBtn" id="removeFriendBtn-${friendId}">Remove Friend</button>
          </div>
        `;
      });
    } else {
      // If no friends
      friendListContent += '<div class="noFriendsAlert">You have no friends yet!</div>';
    }
  
    friendListContent += '</div>';
    mainPanel.innerHTML = friendListContent;
    setTimeout(() => { updateTheme(); }, 0); // Update Theme 
  
    // Toggle back to search user
    const toggleToLibraryBtn = document.getElementById('toggleToLibraryBtn');
    toggleToLibraryBtn.addEventListener('click', () => {
      showcontactsLibrary();
    });
  
    // "Remove Friend" in Contacts/Friend list
    friendList.forEach((friendId) => {
      // Confirm and remove the friend
      document.getElementById(`removeFriendBtn-${friendId}`).addEventListener('click', function() {
        const confirmation = window.confirm('Are you sure you want to remove this friend?');
        if (confirmation) {
          toggleFriendStatus(friendId, true);
          showFriendList(); // Refresh friend list after removal
        }
      });
    });
  }  
});
