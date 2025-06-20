from flask import Flask
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
  response = db.Column(db.Boolean, nullable=True)
  sample_type = db.Column(db.Enum('PBMC', 'WB', name='sample_type_enum'), nullable=True)
  time_from_treatment = db.Column(db.Integer, nullable=True)
  d8_t_cell = db.Column(db.Integer, nullable=True)
  cd4_t_cell = db.Column(db.Integer, nullable=True)
  nk_cell = db.Column(db.Integer, nullable=True)
  monocyte = db.Column(db.Integer, nullable=True)

  def __repr__(self):
    return f'<TrialRecord {self.sample}>'

def create_app():
  app = Flask(__name__)
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
        record.response = row.get('response') == 'yes' if row.get('response') else None
        record.sample_type = row.get('sample_type')
        record.time_from_treatment = row.get('time_from_treatment')
        record.d8_t_cell = row.get('d8_t_cell')
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