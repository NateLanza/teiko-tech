# Teiko Technical Challenge

## Setup and Installation
This guide assumes you already have python and NPM installed on your machine.

Python files live in the `/flask` directory. Your python environment (can be global or virtual) needs to have the following packages installed:
 - `flask` 
 - `pandas`
 - `flask_sqlalchemy`
 - `flask_cors`
Once you have that done, open `/flask` in a terminal (with your virtual environment, if applicable) and run `flask run` or `python -m flask run` to start the flask backend.

To initialize and run the frontend, open `/react` in a terminal and run `npm install`. Then, run `npm run dev` to start the vite server. You can then see the frontend by pointing your browser to `localhost:5173`.