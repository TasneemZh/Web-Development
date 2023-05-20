export const CONSTANTS = {
  PORT: 3002,
  COLLECTION_NAME: 'Alphabets',
};

export const DB_SCHEMA = {
  email: { type: String, unique: true, required: true },
  password: String,
  first_name: String,
  last_name: String,
  created_at: Date,
  start_activity_date: Date,
  last_activity_date: Date,
};
