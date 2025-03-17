from flask import Flask, render_template

app = Flask(__name__)

# List of links (easily extendable)
band_links = [
    {"name": "Instagram", "url": "https://instagram.com/yourband"},
    {"name": "Spotify", "url": "https://spotify.com/yourband"},
    {"name": "YouTube", "url": "https://youtube.com/yourband"}
]

@app.route('/')
def home():
    return render_template('index.html', links=band_links)

@app.route('/portfolio')
def portfolio():
    return render_template('portfolio.html')

if __name__ == '__main__':
    app.run(debug=True)
