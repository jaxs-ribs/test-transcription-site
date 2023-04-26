# Podcast Transcript Search

This project allows you to search through podcast episode transcripts and find specific episodes based on keywords. When you enter a search term, the application filters the episodes and displays only the ones that contain the search term in their transcripts. You can click on an episode to view its transcript with the search term highlighted.

## Getting Started

To get started with the project, clone or download the repository to your local machine.

### Prerequisites

To run this project, you'll need a modern web browser like Chrome, Firefox, Safari, or Edge.

### Running the Project

1. Open the folder containing the project files in your local machine.
2. Start a local web server in the project directory. For example, you can use Python's built-in HTTP server:

   ```sh
   # For Python 3.x
   python -m http.server

   # For Python 2.x
   python -m SimpleHTTPServer

    Open your web browser and navigate to the address provided by the local server (usually http://localhost:8000 or http://127.0.0.1:8000).
    You should see the main page with a search bar and a list of episodes.
    Enter a keyword in the search bar to filter the episodes.
    Click on an episode to view its transcript in a new tab. The search term will be highlighted in the transcript.

Project Structure

This project consists of the following main files:

- index.html: The main page with the search bar and episode list.
- episode.html: The episode page displaying the transcript.
- styles.css: The CSS file for styling the pages.
- scripts.js: The JavaScript file for handling the search functionality on the main page.
- episode.js: The JavaScript file for loading and displaying the episode transcript.

Customization

To add your own podcast episodes and transcripts, update the list.json file with the appropriate episode information and add the transcript JSON files to the project directory.
License

This project is open-source and available for personal and commercial use.

javascript

You can use this `README.md` file as a starting point for your project documentation. You may want to further customize it to include additional information, such as screenshots, technology stack, or credits.
