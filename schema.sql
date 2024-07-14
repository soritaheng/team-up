DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS tasks;

CREATE TABLE projects (
  id INTEGER PRIMARY KEY,
  item TEXT NOT NULL
);

CREATE TABLE tasks (
    id INTEGER PRIMARY KEY,
    project_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    completed BOOLEAN,
    FOREIGN KEY (project_id) REFERENCES projects (id)
);