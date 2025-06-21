from flask import Flask, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import pandas as pd
import os

db = SQLAlchemy()

class TrialRecord(db.Model):
  '''A row from the CSV file representing a trial result'''
  sample = db.Column(db.String, primary_key=True)
  project = db.Column(db.String, nullable=True)
  subject = db.Column(db.String, nullable=True)
  condition = db.Column(
    db.Enum('healthy', 'carcinoma', 'melanoma', name='condition_enum'),
    nullable=True
  )
  age = db.Column(db.Integer, nullable=True)
  sex = db.Column(db.Enum('M', 'F', name='sex_enum'), nullable=True)
  treatment = db.Column(db.Enum('miraclib', 'phauximab', 'none', name='treatment_enum'), nullable=True)
  response = db.Column(db.Enum('yes', 'no'), nullable=True)
  sample_type = db.Column(db.Enum('PBMC', 'WB', name='sample_type_enum'), nullable=True)
  time_from_treatment = db.Column(db.Integer, nullable=True)
  b_cell = db.Column(db.Integer)
  cd8_t_cell = db.Column(db.Integer)
  cd4_t_cell = db.Column(db.Integer)
  nk_cell = db.Column(db.Integer)
  monocyte = db.Column(db.Integer)

  def __repr__(self):
    return f'<TrialRecord {self.sample}>'

def create_app():
  app = Flask(__name__)
  CORS(app, origins=['http://localhost:5173']) # Necessary to allow requests from the frontend
  app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
  app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False # save resources by disabling unnecessary tracking
  
  db.init_app(app)
  
  with app.app_context():
    db.create_all()
    
    # Load CSV on first run
    if should_load_initial_data():
      load_csv_data('../data/cell-count.csv')
  
  @app.route('/')
  def home():
    result = ""
    records = TrialRecord.query.all()
    if records:
      result = "<h1>Trial Records</h1><ul>"
      for record in records:
        result += f"<li>{record.sample}: {record.condition} - {record.response}</li>"
      result += "</ul>"
    else:
      result = "<h1>No records found</h1>"
    return result
  
  # --- API routes ---

  # Yes, it's ridiculous to use GET for creating records, but we're bootstrapping a quick example here. TODO: change to POST
  @app.route('/api/create', methods=['GET'])
  def api_create():
    # All fields as URL parameters
    params = {k: v for k, v in dict(**dict(request.args)).items()}
    if 'sample' not in params:
      return {"error": "Missing required field: sample"}, 400
    if TrialRecord.query.get(params['sample']):
      return {"error": "Record with this sample already exists"}, 409
    try:
      record = TrialRecord()
      record.sample = params.get('sample')
      record.project = params.get('project')
      record.subject = params.get('subject')
      record.condition = params.get('condition')
      record.age = int(params['age']) if params.get('age') else None
      record.sex = params.get('sex')
      record.treatment = params.get('treatment')
      record.response = params.get('response')
      record.sample_type = params.get('sample_type')
      record.time_from_treatment = int(params['time_from_treatment']) if params.get('time_from_treatment') else None
      record.b_cell = int(params['b_cell']) if params.get('b_cell') else None
      record.cd8_t_cell = int(params['cd8_t_cell']) if params.get('cd8_t_cell') else None
      record.cd4_t_cell = int(params['cd4_t_cell']) if params.get('cd4_t_cell') else None
      record.nk_cell = int(params['nk_cell']) if params.get('nk_cell') else None
      record.monocyte = int(params['monocyte']) if params.get('monocyte') else None
      db.session.add(record)
      db.session.commit()
      return {"message": "Record created", "sample": record.sample}, 201
    except Exception as e:
      db.session.rollback()
      return {"error": str(e)}, 400

  # TODO: change to DELETE
  @app.route('/api/delete/<sample>', methods=['GET'])
  def api_delete(sample):
    record = TrialRecord.query.get(sample)
    if not record:
      return {"error": "Record not found"}, 404
    try:
      db.session.delete(record)
      db.session.commit()
      return {"message": f"Record {sample} deleted"}
    except Exception as e:
      db.session.rollback()
      return {"error": str(e)}, 400
    
  @app.route('/api/list', methods=['GET'])
  def api_get_all_records():
    try:
      records = TrialRecord.query.all()
      result = []
      for record in records:
        result.append({
          'sample': record.sample,
          'project': record.project,
          'subject': record.subject,
          'condition': record.condition,
          'age': record.age,
          'sex': record.sex,
          'treatment': record.treatment,
          'response': record.response,
          'sample_type': record.sample_type,
          'time_from_treatment': record.time_from_treatment,
          'b_cell': record.b_cell,
          'cd8_t_cell': record.cd8_t_cell,
          'cd4_t_cell': record.cd4_t_cell,
          'nk_cell': record.nk_cell,
          'monocyte': record.monocyte
        })
      return result, 200
    except Exception as e:
      return {"error": str(e)}, 500

  return app


def load_csv_data(csv_path):
  '''Load CSV data into the database'''
  if not os.path.exists(csv_path):
    print(f"CSV file not found: {csv_path}")
    return
  
  try:
    # Read CSV with pandas
    df = pd.read_csv(csv_path)
    
    # Clean column names (remove whitespace, etc.)
    df.columns = df.columns.str.strip()
    
    # Load data in batches for better performance
    batch_size = 1000
    total_rows = len(df)
    
    for i in range(0, total_rows, batch_size):
      batch = df.iloc[i:i+batch_size]
      records = []
      
      for _, row in batch.iterrows():
        record = TrialRecord()
        record.sample = row['sample']
        record.project = row.get('project')
        record.subject = row.get('subject')
        record.condition = row.get('condition')
        record.age = row.get('age')
        record.sex = row.get('sex')
        record.treatment = row.get('treatment')
        record.response = row.get('response') if row.get('response') in ['yes', 'no'] else None
        record.sample_type = row.get('sample_type')
        record.time_from_treatment = row.get('time_from_treatment')
        record.b_cell = row.get('b_cell')
        record.cd8_t_cell = row.get('cd8_t_cell')
        record.cd4_t_cell = row.get('cd4_t_cell')
        record.nk_cell = row.get('nk_cell')
        record.monocyte = row.get('monocyte')
        records.append(record)
      
      # Bulk insert for better performance
      db.session.bulk_save_objects(records)
      db.session.commit()
      
      print(f"Loaded {min(i+batch_size, total_rows)}/{total_rows} records")
    
    print(f"Successfully loaded {total_rows} records from {csv_path}")
    
  except Exception as e:
    db.session.rollback()
    print(f"Error loading CSV: {str(e)}")
    raise

def should_load_initial_data():
  '''Check if initial data should be loaded'''
  return TrialRecord.query.count() == 0

if __name__ == '__main__':
  app = create_app()
  app.run(debug=True)