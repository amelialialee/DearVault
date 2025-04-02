**************************************************************************************
                ────────── DEAR VAULT ('Time Capsule' SPA) ──────────                
**************************************************************************************
Table of Contents:
--------------------------------------------------------------------------------------
1. 📜 Introduction
2. ✨ Features
3. 🛠 Tech Stack
4. 📂 Project Structure
4. 🚀 Installation & Run
5. 📚 References & Credits
6. 👤 Contact
--------------------------------------------------------------------------------------
1. 📜 Introduction
--------------------------------------------------------------------------------------
Welcome to "Dear Vault", an SPA that allows you to send time capsules (letters) 
to your future self or loved ones. 

In today's fast-paced world, many of us feel disconnected and overwhelmed by societal 
pressures, often leading to uncertainty about our worth."Dear Vault" is designed to 
help individuals step back, reflect on their journey, and promote mindfulness, 
gratitude, and personal growth.

--------------------------------------------------------------------------------------
2. ✨ Features
--------------------------------------------------------------------------------------
📩 Creating a Capsule
🔹 Set a title, write a message, choose an unlock date, and upload up to 5 images.
🔹 Add friends as recipients by selecting from your contact list or searching by 
   email/username.
🔹 Click 'Create' to send.

👥 Adding Friends
🔹 Search for friends using their username or email in 'Contacts'.
🔹 View and manage your friend list.
🔹 Easily remove friends by clicking 'Remove' next to their name.

🔒 Viewing & Managing Capsules
🔹 Navigate to 'My Capsules' to view all created capsules.
🔹 Filter between locked and unlocked capsules & created and recived capsules.
🔹 Click 'Click to View' to see capsule details and images.
🔹 Delete unwanted capsules with the 'Delete' button.

⏳ Countdown to Incoming Capsules
🔹 Check 'Scheduled' for capsules waiting to be unlocked

🔔 Notifications 
🔹 Displays user's stats & show the closest capsule unlock time.

🎨 Changing Themes
🔹 Toggle between three available themes by clicking the '☀️' icon at the top.

❓ Help Bar
🔹 Clicking the '?' icon at the top for additional help or Q&As.

--------------------------------------------------------------------------------------
3. 🛠 Tech Stack
--------------------------------------------------------------------------------------
Frontend: HTML, CSS, JavaScript  
Backend: JavaScript  
Database: JSON-File storage & Local Storage 

--------------------------------------------------------------------------------------
3. 📂 Project Structure
--------------------------------------------------------------------------------------
📂 DearVault
 ├── 📂 public/   
 │   ├── 📂 data/        # Data storage
 │   │   ├── help.json  
 │   ├── 📂 scripts/     # JavaScript file
 │   │   ├── index.js   
 │   ├── 📂 styles/      # Styles and images
 │   │   ├── 📂 images/  # All images in here
 │   │   ├── index.css  
 │
 ├── index.html          # Main HTML file
 ├── README.txt         # Project documentation

--------------------------------------------------------------------------------------
4. 🚀 Installation & Run
--------------------------------------------------------------------------------------
OPTION 1: Clone the Repository
a. Clone the repository:
git clone https://github.com/amelialialee/DearVault.git

b. Navigate to the project folder:
cd DearVault

c. Open the main.html file:
Double-click on the main.html file to open it in your browser.
OR
Use the following command to open it in Chrome:
start chrome main.html

OPTION 2: Use Live Server in VS Code 
a. Open the project folder in Visual Studio Code.
b. Install the Live Server extension:
c. Go to Extensions (Ctrl+Shift+X).
d. Search for Live Server and install it.
e. Right-click on 'main.html' file and select "Open with Live Server".

OPTION 3. Open the Project 
 a. Open Directly in a Browser
 b. Navigate to the project folder
 c. Double-click on main.html

The website should open in your default web browser!
(⚠️Note: JSON fetching may not work due to CORS restrictions*)

--------------------------------------------------------------------------------------
5. 📚 References & Credits
--------------------------------------------------------------------------------------
📖 REFERENCES:

Password Hashing (SHA-256 using SubtleCrypto):
- https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest

Generating Shared Key (Hashing String):
- https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
- https://www.geeksforgeeks.org/how-to-create-hash-from-string-in-javascript/

XOR Encryption/Decryption:
- https://th.atguy.com/mycode/xor_js_encryption/
- https://gist.github.com/mhingston/9e7d608145381097bde949ca7558c919
- https://youtu.be/EWdNhA5prXQ?si=ZUF7BjflaX-i0UCy

Help Section - Fetch():
- https://www.geeksforgeeks.org/read-json-file-using-javascript/
- https://youtu.be/r4MLHHLctKw?si=HdKr8TLe9kwXO-KY

Processing Files - FileReader() & Base64 Encoding:
- https://pqina.nl/blog/convert-a-file-to-a-base64-string-with-javascript/ 
- https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL

📖 CREDITS:

Star.png:
- Image obtained from the NASA Image and Video Library
- https://images.nasa.gov/details/GSFC_20171208_Archive_e000720

All Other Images Used:
- Created using Canva Free.

--------------------------------------------------------------------------------------
🚀 Thank you for using Dear Vault! 🚀
--------------------------------------------------------------------------------------
Project Author: Amelia Lee 
