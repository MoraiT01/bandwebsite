from app import app
from flask import render_template, redirect, url_for, request

# Home page route
@app.route('/')
def home():
    return render_template('index.html')

# Music page route
@app.route('/music')
def music():
    return render_template('music.html')

# Tour/Shows page route
@app.route('/tour')
def tour():
    return render_template('tour.html')

# Gallery page route
@app.route('/gallery')
def gallery():
    return render_template('gallery.html')

# Videos page route
@app.route('/videos')
def videos():
    return render_template('videos.html')

# Merch page route
@app.route('/merch')
def merch():
    return render_template('merch.html')

# About page route
@app.route('/about')
def about():
    return render_template('about.html')
