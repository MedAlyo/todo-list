# Todolist db schema:

CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre_usuario VARCHAR(50) UNIQUE NOT NULL,
  correo_electronico VARCHAR(100) UNIQUE NOT NULL,
  contrasena_hash VARCHAR(255) NOT NULL
);

CREATE TABLE categorias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) UNIQUE NOT NULL  -- Ejemplo: "Trabajo", "Personal", "Estudio"
);

CREATE TABLE tareas (
  id SERIAL PRIMARY KEY,
  usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  titulo VARCHAR(100) NOT NULL,
  descripcion TEXT,
  es_publica BOOLEAN DEFAULT FALSE,
  nivel_dificultad VARCHAR(20) NOT NULL DEFAULT 'medio',
  categoria_id INT NOT NULL REFERENCES categorias(id) ON DELETE CASCADE,  -- Nueva columna
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comentarios (
  id SERIAL PRIMARY KEY,
  tarea_id INT NOT NULL REFERENCES tareas(id) ON DELETE CASCADE,
  usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
  contenido TEXT NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notas_privadas (
  id SERIAL PRIMARY KEY,
  tarea_id INT NOT NULL REFERENCES tareas(id) ON DELETE CASCADE,
  usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  contenido TEXT NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


