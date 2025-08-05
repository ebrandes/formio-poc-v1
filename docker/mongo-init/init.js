// MongoDB initialization script
// This script runs when MongoDB container starts for the first time

db = db.getSiblingDB('formio');

// Create formio user with proper permissions
db.createUser({
  user: 'formio',
  pwd: 'formio123',
  roles: [
    {
      role: 'dbOwner',
      db: 'formio'
    }
  ]
});

// Create initial collections
db.createCollection('projects');
db.createCollection('forms');
db.createCollection('submissions');
db.createCollection('roles');
db.createCollection('actions');

print('MongoDB initialization completed');