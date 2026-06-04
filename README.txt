LT Dev Studio — Static site (HTML / CSS / JS / PHP)
====================================================

Folder contents
---------------
index.html, about.html, services.html, work.html, contact.html, 404.html
process_form.php          contact form mail handler
.htaccess                 pretty URLs, caching, security headers
assets/                   styles.css, app.js, icons.js, images, logo

Deploy to cPanel
----------------
1. Zip the CONTENTS of this folder (not the folder itself).
2. cPanel → File Manager → public_html → Upload → Extract.
3. Verify that index.html, .htaccess and process_form.php all sit
   directly inside public_html.
4. Visit your domain. Done.

Contact form
------------
- Posts to process_form.php on the same domain.
- Edit the top of process_form.php to change:
    $TO_ADDRESS    where enquiries are sent
    $FROM_ADDRESS  must be a real mailbox on your domain
                   (some hosts reject mail otherwise).
- Most cPanel hosts have PHP mail() enabled out of the box.

Local preview
-------------
Open index.html in a browser. (The PHP form will only work on a
real server with PHP — it gracefully shows an error otherwise.)
