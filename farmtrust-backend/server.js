const express = require('express');
const cors = require('cors'); 
const sqlite3 = require('sqlite3').verbose(); // 1. Hire the Database Manager

const app = express();
app.use(cors()); 
app.use(express.json()); 

// 2. Open the Database (This creates a file called farmtrust.db)
const db = new sqlite3.Database('./farmtrust.db', (err) => {
    if (err) console.error("Database error:", err.message);
    else console.log("📦 Connected to FarmTrust SQLite Database.");
});

// 3. Create the Filing Cabinet (Table) if it doesn't exist yet
db.run(`CREATE TABLE IF NOT EXISTS farmers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    location TEXT
)`);

// 4. The Upgraded Catcher's Mitt
app.post('/api/farmers', (req, res) => {
    const farmerName = req.body.name;
    const farmerLocation = req.body.location;

    // The SQL command to save the data
    const sql = `INSERT INTO farmers (name, location) VALUES (?, ?)`;
    
    // Execute the SQL
    db.run(sql, [farmerName, farmerLocation], function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: "Failed to save farmer" });
            return;
        }
        
        // this.lastID gets the exact ID the database generated for this farmer
        console.log(`SUCCESS! Saved ${farmerName} to database with ID: ${this.lastID}`);
        
        // Send the receipt back to the frontend
        res.json({ 
            message: "Welcome to FarmTrust! Farmer saved permanently.", 
            farmerId: this.lastID 
        });
    });
});
app.get('/api/farmers', (req, res) => {
    console.log("📢 Someone just requested the FarmTrust farmer list!");
    // The SQL command to select everything
    const sql = `SELECT * FROM farmers`;
    
    // db.all runs the query and hands us an array of 'rows'
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: "Failed to load farmers" });
            return;
        }
        
        // Send the entire array of farmers back to the frontend!
        res.json(rows); 
    });
});

app.listen(3000, () => {
    console.log('🌱 FarmTrust Backend listening on http://localhost:3000');
});
// The UPDATE Endpoint: Editing a Farmer
app.put('/api/farmers/:id', (req, res) => {
    // 1. Grab the ID from the URL
    const farmerId = req.params.id;
    
    // 2. Grab the new data from the package
    const newName = req.body.name;
    const newLocation = req.body.location;

    // 3. The SQL command to update that specific row
    const sql = `UPDATE farmers SET name = ?, location = ? WHERE id = ?`;
    
    // 4. Execute the command
    db.run(sql, [newName, newLocation, farmerId], function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: "Failed to update farmer" });
            return;
        }
        
        console.log(`✏️ SUCCESS! Updated farmer ID ${farmerId}.`);
        res.json({ message: "Farmer updated successfully!" });
    });
});
// The DELETE Endpoint: Erasing a Farmer
app.delete('/api/farmers/:id', (req, res) => {
    // 1. Grab the specific ID from the URL (e.g., /api/farmers/5 means ID 5)
    const farmerId = req.params.id; 
    
    // 2. The SQL command to delete that exact row
    const sql = `DELETE FROM farmers WHERE id = ?`;
    
    // 3. Execute the command
    db.run(sql, farmerId, function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: "Failed to delete farmer" });
            return;
        }
        
        console.log(`🗑️ SUCCESS! Erased farmer ID ${farmerId} from the database.`);
        res.json({ message: "Farmer deleted successfully!" });
    });
});