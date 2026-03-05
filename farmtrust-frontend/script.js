document.getElementById('register-btn').addEventListener('click', async function() {
    console.log("1. Button was clicked!");
    
    const nameInput = document.getElementById('farmer-name').value;
    const locationInput = document.getElementById('farmer-location').value;

    if (nameInput === "" || locationInput === "") {
        alert("Please fill in both fields!");
        return;
    }

    const newFarmerData = { name: nameInput, location: locationInput };
    console.log("2. Data packaged and sending to backend:", newFarmerData);

    try {
        const response = await fetch('http://localhost:3000/api/farmers', {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newFarmerData) 
        });

        console.log("3. Backend responded! Converting receipt to JSON...");
        const data = await response.json();
        
        console.log("4. Here is the exact data the server sent back:", data);

        // Update the screen
        document.getElementById('server-response').innerText = data.message + " (Assigned ID: " + data.farmerId + ")";
        
        // Clear the boxes
        document.getElementById('farmer-name').value = "";
        document.getElementById('farmer-location').value = "";
        
        console.log("5. Screen successfully updated!");

    } catch (error) {
        console.error("Uh oh, an error happened:", error);
    }
});


// The GET Request
document.getElementById('load-btn').addEventListener('click', async function() {
    try {
        // 1. Ask the backend for the data
        const response = await fetch('http://localhost:3000/api/farmers');
        
        // 2. Unpack the JSON array the server sends back
        const farmers = await response.json();
        
        // 3. Grab the empty HTML list
        const listElement = document.getElementById('farmer-list');
        listElement.innerHTML = ""; // Clear out old data so it doesn't double-stack
        
        // 4. Loop through the array and create a visual item for every single farmer!
        farmers.forEach(farmer => {
            const listItem = document.createElement('li');
            listItem.style.padding = "10px";
            listItem.style.borderBottom = "1px solid #ccc";
            
            // Format how it looks on screen
            listItem.innerText = `🆔 ID: ${farmer.id} | 🧑‍🌾 Name: ${farmer.name} | 📍 District: ${farmer.location}`;
            // --- NEW EDIT BUTTON CODE ---
            const editBtn = document.createElement('button');
            editBtn.innerText = "✏️ Edit";
            editBtn.style.marginLeft = "10px";
            editBtn.style.background = "#ffc107"; // Yellow color
            editBtn.style.border = "none";
            editBtn.style.padding = "5px 10px";
            editBtn.style.cursor = "pointer";
            editBtn.style.borderRadius = "3px";

            // Tell the button what to do when clicked!
            editBtn.onclick = async function() {
                // 1. Ask the user for the new details (defaults to current info)
                const newName = prompt("Update Farmer Name:", farmer.name);
                const newLocation = prompt("Update District:", farmer.location);

                // Safety check: If they clicked "Cancel", stop the code
                if (newName === null || newLocation === null) return;

                try {
                    // 2. Shoot the UPDATE request to the backend
                    await fetch(`http://localhost:3000/api/farmers/${farmer.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name: newName, location: newLocation })
                    });
                    
                    // 3. Tell the user it worked!
                    alert("✅ Farmer updated! Click 'Load Farmer List' to see the changes.");
                } catch (error) {
                    console.error("Failed to update:", error);
                }
            };
            
            // Attach the edit button to the list item FIRST (so it sits next to the delete button)
            listItem.appendChild(editBtn);
            // ------------------------------
            // --- NEW DELETE BUTTON CODE ---
            const deleteBtn = document.createElement('button');
            deleteBtn.innerText = "❌ Delete";
            deleteBtn.style.marginLeft = "15px";
            deleteBtn.style.background = "#dc3545"; // Red color
            deleteBtn.style.color = "white";
            deleteBtn.style.border = "none";
            deleteBtn.style.padding = "5px 10px";
            deleteBtn.style.cursor = "pointer";
            deleteBtn.style.borderRadius = "3px";

            // Tell the button what to do when clicked!
            deleteBtn.onclick = async function() {
                try {
                    // Shoot the DELETE request to the backend with this specific farmer's ID
                    await fetch(`http://localhost:3000/api/farmers/${farmer.id}`, {
                        method: 'DELETE'
                    });
                    
                    // Instantly make the item vanish from the web page!
                    listItem.remove(); 
                } catch (error) {
                    console.error("Failed to delete:", error);
                }
            };
            
            // Attach the button to the list item
            listItem.appendChild(deleteBtn);
            // ------------------------------
            
            // Inject it into the web page
            listElement.appendChild(listItem);
        });

    } catch (error) {
        console.error("Error loading farmers:", error);
    }
});