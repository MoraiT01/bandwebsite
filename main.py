from flask import Flask, render_template

app = Flask(__name__)

# List of links (easily extendable)
band_links = [
    {"name": "Instagram", "url": "https://www.instagram.com/smokinbreadsticks/"},
    {"name": "Spotify", "url": "https://open.spotify.com/intl-de/artist/6fjb2fConTsDEi1db27tjt?si=qLEuJaL0TGCUe-snkiP1LA"},
    {"name": "YouTube", "url": "https://www.youtube.com/@SmokinBreadsticks"}
]

@app.route('/')
def home():
    return render_template('templates/index.html', links=band_links)

@app.route('/')
def portfolio():
    return render_template('templates/portfolio.html')

if __name__ == '__main__':
    app.run(debug=True)
