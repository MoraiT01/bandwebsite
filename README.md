# Smokin' Breadsticks - Official Band Website

Welcome to the official website repository for Smokin' Breadsticks! This site is built as a static HTML, CSS, and JavaScript website, ready for deployment on services like GitHub Pages.

Originally, this project was a Flask-based web application. It has been converted to a static site to simplify hosting and leverage platforms like GitHub Pages.

## About This Website

This website serves as the online presence for the band Smokin' Breadsticks. Fans can find information about:
* **Music:** Discover albums, EPs, and singles, listen to tracks (placeholder), and view lyrics.
* **Tour Dates:** Check out upcoming shows and look back at past tours.
* **Gallery:** View photos from live performances, behind-the-scenes moments, and fan submissions.
* **Videos:** Watch music videos, live performance footage, and interviews (placeholders for actual video playback).
* **Merchandise:** Browse and "add to cart" band merch (client-side demo functionality).
* **About the Band:** Read the band's biography, meet the members, and learn about their history.

## Project Status: Static Conversion

* **Backend Removed:** The Python Flask backend, including the admin panel and server-side API for forms, has been removed.
* **Dynamic Content:** Content previously generated dynamically (e.g., news, upcoming shows on the homepage and tour page) is now hardcoded into the HTML files.
* **Form Handling:** Contact and newsletter forms currently use JavaScript `alert()` messages for demonstration. For live data collection, these forms need to be integrated with a third-party service like Formspree or Netlify Forms.
* **Merch Cart:** The shopping cart functionality on the merch page is a client-side demonstration. It updates the UI but does not process real orders or persist data across sessions.

## File Structure

The website is organized as follows:

* `index.html`: The homepage.
* `music.html`, `tour.html`, `gallery.html`, `videos.html`, `merch.html`, `about.html`: Main content pages.
* `404.html`: Custom page for "Page Not Found" errors.
* `static/`: Contains all static assets:
    * `css/style.css`: Main stylesheet for the website.
    * `js/main.js`: Global JavaScript for interactions like mobile menu, smooth scroll, active navigation links, and footer newsletter demo.
    * `js/form_handlers.js`: JavaScript for client-side form interaction demos (contact, newsletter, merch cart UI).
    * `images/`: All images used on the website.

## Local Development

To view the website locally:
1.  Clone this repository to your local machine.
2.  Navigate to the project directory in your file explorer.
3.  Open any of the `.html` files (e.g., `index.html`) directly in your web browser.

No special server setup is required as it's a fully static site.

## Content Management

Since the Flask admin panel has been removed, content updates must be done manually:
* **Textual Content:** Edit the relevant HTML files directly.
* **Images:** Add new images to the `static/images/` directory and update the `<img>` tags or CSS `background-image` properties in the HTML files.
* **News/Shows:** Update the hardcoded sections in `index.html` and `tour.html`. For more complex data management, consider moving this data to JSON files in a `static/data/` directory and using JavaScript to fetch and display it.

## Deployment to GitHub Pages

This site is structured for easy deployment to GitHub Pages:

1.  **Ensure your repository is on GitHub.**
2.  **Go to your repository's settings.**
3.  **Navigate to the "Pages" section.**
4.  **Choose your deployment source:**
    * Select the branch you want to deploy from (e.g., `main` or `master`).
    * Select the folder: `/ (root)`.
5.  **Save your changes.** GitHub Pages will build and deploy your site. The URL will typically be `https://<your-username>.github.io/<repository-name>/`.

## Contributing

This repository primarily serves the static website. If you have suggestions or find issues:
* Please describe them clearly by opening an issue in this repository.
* If you'd like to contribute changes, you can fork the repository, make your changes, and submit a pull request. Ensure all changes are static and testable by opening the HTML files in a browser.

---

Thanks to Anderson de Lima Luiz for the initial website version and inspiration!
Our goal is to keep rocking online!
