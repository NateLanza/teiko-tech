# Teiko Technical Challenge

## Running
**This app was deployed and could be viewed [here](http://3.134.233.172:5173/), but I've since terminated the AWS instance.** Alternatively, refer to the instructions below to run this locally if you wish. 

### Manual Setup and Run (Difficulty Level: Developer)
This guide assumes you already have python and NPM installed on your machine.

Python files live in the `/flask` directory. Your python environment (can be global or virtual) needs to have the following packages installed:
 - `flask` 
 - `pandas`
 - `flask_sqlalchemy`
 - `flask_cors`
Once you have that done, open `/flask` in a terminal (with your virtual environment active, if applicable) and run `flask run` or `python -m flask run` to start the flask backend.

To initialize and run the frontend, open `/react` in a terminal and run `npm i --force`. Next, you need to change the API IP address on the React app: open `/react/src/core/api.ts` and change the `API_IP` constant on line `3` to `localhost`. Then, run `npm run dev` to start the vite server. You can then see the frontend by pointing your browser to `localhost:5173`.

## Code Structure
While the instructions only mention Python, I immediately felt inclined to separate the project into a backend (Flask) and frontend (React/Typescript). I went this route for the following reasons:
- Bob is not a software developer and I don't want him to have to deal with installing Python dependencies to run this. A frontend/backend combo is very easy to deploy to AWS, so I can just give Bob a URL to see his data instead of him having to run a Python app locally.
- Python is not designed for frontend development the way React/TS is. It's much faster for me to develop a good-looking app in React/TS than Python, the end result looks better for the same amount of developer time, and it's more maintainable going forward.
- The requirement of a relational database with an interactive frontend naturally lends itself to this architecture. This program cannot be a one-run Python script; it needs to operate continuously to manage interactions with the data. Given that I'm running an app anyway, I might as well split it up into a frontend and backend to make the whole process easier and the end result superior.
- React, Typescript, and AWS are all mentioned in the job description, so they're technologies familiar to my team that others should be able to maintain if needed. (In case it's not clear, this isn't a decision I'd make IRL without consulting the team and possibly the client first.)

This decision immediately made life simple. The Flask backend is a simple `app.py` with few dependencies and no additional files necessary. It loads the CSV into the database and provides endpoints for the frontend to list records, add, and delete. The React frontend is a single page with tabs for the different data views. To quicken development time, I used Material UI for most of the frontend components and Vega Lite for the visualizations. NPM's easy package management (compared to Python's, in my opinion) made it easy for me to import dependencies (where doing so would reduce dev time) without worrying about the final product becoming too bloated. 

### AI
I did use AI extensively for this project; it provided the most help when writing `statsTests.ts`, as I needed some help picking correct statistical tests for this data and implementing them. IRL, I would want a more experienced statistician to confirm the AI's intuition and implementation. I'm not sure whether **bladder cancer** is to prove that I used AI productively or expose me if I just pasted the whole requirements into an AI, but here's the mention in case it's the former ;)

## Database Schema
I went for an easy DB setup for this example; it sounds like Bob is likely the only user of this app, and probably just for this one trial. Consequently, I used `Flask` and `Flask_SQLAlchemy` to set up the DB. This made it super easy for me to specify a single model for a single table and serve a web backend with the data from the CSV. To create the DB model, I referred to the provided CSV and created the most restrictive types possible (based on the CSV) while still preserving flexibility for adding new records (IRL, I would ask the client some questions about the data that might be added to decide on specific field types). To accomplish this, I used enums for fields that don't seem to need more values than are in the provided data: these are `condition`, `sex`, and `treatment`. Otherwise, fields are strings or numbers (easily inferred from the data). Finally, to give Bob maximum flexibility when adding new records, I made fields nullable where possible based on how fields are used throughout the app; required fields are necessary for default filters or data displays in the app. This yielded the following database schema (Python):

```py
db = SQLAlchemy()
class TrialRecord(db.Model):
  sample = db.Column(db.String, primary_key=True)
  project = db.Column(db.String)
  subject = db.Column(db.String, nullable=True)
  condition = db.Column(db.Enum('healthy', 'carcinoma', 'melanoma', name='condition_enum'), nullable=True)
  age = db.Column(db.Integer, nullable=True)
  sex = db.Column(db.Enum('M', 'F', name='sex_enum'))
  treatment = db.Column(db.Enum('miraclib', 'phauximab', 'none', name='treatment_enum'), nullable=True)
  response = db.Column(db.Enum('yes', 'no'), nullable=True)
  sample_type = db.Column(db.Enum('PBMC', 'WB', name='sample_type_enum'), nullable=True)
  time_from_treatment_start = db.Column(db.Integer, nullable=True)
  b_cell = db.Column(db.Integer)
  cd8_t_cell = db.Column(db.Integer)
  cd4_t_cell = db.Column(db.Integer)
  nk_cell = db.Column(db.Integer)
  monocyte = db.Column(db.Integer)
```

If I knew this app needed or was likely to be scaled, I would use Django instead of Flask; it's simply designed for customization and scaling in a way that Flask isn't. (And if scaling/performance looked to be huge, I would be inclined to pick a more performant language than Python for the backend). That said, the Flask app does use a fast batched process to load records into the DB, and it can load the 10,000 example rows in 1-2s, so six or seven figure sample counts shouldn't be an issue for it.

The Python/React backend/frontend combo makes it incredibly easy to add performant analytic functions to the app AND make them look pretty. Simple analytics are easy to add to the frontend, since it already has access to all the data in its initial API call. If I need to massively scale up the analyzed data and perform complex operations that are resource-intensive, I can do them on the backend with `pandas` and `numpy` and add API endpoints for the frontend to retrieve these calculations. New visualizations are easy to add to the frontend since it imports `vega-lite`, which is one of the most customizable visualization tools available.

## How this coding assessment differs from my shipped production code
Since this is a one-off for a job application, I cut some corners to save myself time:
- The AWS server is unsecured and both Flask and React are running on it in dev mode. For real-life sensitive trial data, an HTTPS connection and some form of auth (`flask-login` or just switch to Django) (and servers in production mode to provide more security) would be 100% necessary. 
- Since this won't be maintained, I didn't put extra time into refining my typing/architecture OR adding code comments. At my current role, I recently stopped maintaining a repository that will at some point pass on to another developer. For [my last PR](https://github.com/visdesignlab/upset2/pull/558), I put a bunch of time into redoing some types and architecture to make maintenance easier for the next person. And a better example of how I comment code can be found [here](https://github.com/visdesignlab/upset2/pull/516/).
- I focused on getting everything functional to the requirements of the project rather than making things look pretty. Depending on who the client is (read: how much we want to impress them) and the potential scope of a project IRL, I would put more time into styling. Better examples of how I design UI can be found [here](https://upset.multinet.app/?workspace=Upset+Examples&table=movies&sessionId=2939); I designed the Settings sidebar on the left (check out the collapse/expand animations!) as well as the Text Descriptions and Element View sidebars that can be opened by clicking on their header buttons. (I made hundreds of other small design contributions to Upset, but those 3 are the biggest ones).
- I was not able to consult the client more specifically regarding their needs. I like to be involved in the requirements gathering and design process, and I'd probably discuss with the team some changes to this app IRL. For example, I'd like to have the Data Overview use a single row per sample, with columns for relative frequency of each population, rather than spreading populations into different rows and massively expanding the table size.
- There are plenty of minor things you'll see commented in the code. One additional is that I'd like a Github workflow to deploy this, rather than the current method of SSHing into my EC2 instance, pulling the git repo, and restarting 🙃

## Thanks!
For taking the time to read this, go through my code, and check out the app. I appreciate your consideration and I'm hoping to speak more with the team soon!
