-- CreateTable
CREATE TABLE "Administrador" (
    "id_admin" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre_completo" TEXT NOT NULL,
    "correo_electronico" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "verification_code" TEXT,
    "verification_code_expires" DATETIME,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "recovery_token" TEXT,
    "recovery_token_expires" DATETIME
);

-- CreateTable
CREATE TABLE "Estudiante" (
    "id_estudiante" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "codigo_estudiante" TEXT,
    "nombre_completo" TEXT NOT NULL,
    "tipo_documento" TEXT NOT NULL,
    "numero_documento" TEXT NOT NULL,
    "correo_electronico" TEXT NOT NULL,
    "grado" TEXT NOT NULL,
    "grupo" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "fecha_registro" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" TEXT NOT NULL DEFAULT 'activo',
    "id_admin" INTEGER,
    "nombre_completo_admin" TEXT,
    "correo_electronico_admin" TEXT
);

-- CreateTable
CREATE TABLE "Profesor" (
    "id_profesor" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "codigo_profesor" TEXT,
    "nombre_completo" TEXT NOT NULL,
    "tipo_documento" TEXT NOT NULL,
    "numero_documento" TEXT NOT NULL,
    "correo_electronico" TEXT NOT NULL,
    "telefono" TEXT,
    "asignaturas" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "fecha_registro" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" TEXT NOT NULL DEFAULT 'activo',
    "id_admin" INTEGER,
    "nombre_completo_admin" TEXT,
    "correo_electronico_admin" TEXT
);

-- CreateTable
CREATE TABLE "SolicitudCambioContrasena" (
    "id_solicitud" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tipo_usuario" TEXT NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "codigo_usuario" TEXT NOT NULL,
    "correo_usuario" TEXT NOT NULL,
    "motivo" TEXT NOT NULL,
    "id_admin" INTEGER NOT NULL,
    "fecha_solicitud" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    CONSTRAINT "SolicitudCambioContrasena_id_admin_fkey" FOREIGN KEY ("id_admin") REFERENCES "Administrador" ("id_admin") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PeriodoAcademico" (
    "id_periodo" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "fecha_inicio" DATETIME NOT NULL,
    "fecha_fin" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Grupo" (
    "id_grupo" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "id_periodo" INTEGER,
    CONSTRAINT "Grupo_id_periodo_fkey" FOREIGN KEY ("id_periodo") REFERENCES "PeriodoAcademico" ("id_periodo") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Materia" (
    "id_materia" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "codigo" TEXT
);

-- CreateTable
CREATE TABLE "GrupoMateria" (
    "id_grupo_materia" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_grupo" INTEGER NOT NULL,
    "id_materia" INTEGER NOT NULL,
    "id_docente" INTEGER NOT NULL,
    CONSTRAINT "GrupoMateria_id_grupo_fkey" FOREIGN KEY ("id_grupo") REFERENCES "Grupo" ("id_grupo") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "GrupoMateria_id_materia_fkey" FOREIGN KEY ("id_materia") REFERENCES "Materia" ("id_materia") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "GrupoMateria_id_docente_fkey" FOREIGN KEY ("id_docente") REFERENCES "Profesor" ("id_profesor") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GrupoEstudiante" (
    "id_grupo" INTEGER NOT NULL,
    "id_estudiante" INTEGER NOT NULL,

    PRIMARY KEY ("id_grupo", "id_estudiante"),
    CONSTRAINT "GrupoEstudiante_id_grupo_fkey" FOREIGN KEY ("id_grupo") REFERENCES "Grupo" ("id_grupo") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "GrupoEstudiante_id_estudiante_fkey" FOREIGN KEY ("id_estudiante") REFERENCES "Estudiante" ("id_estudiante") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TipoNota" (
    "id_tipo" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre_tipo" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Nota" (
    "id_nota" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_estudiante" INTEGER NOT NULL,
    "valor" REAL NOT NULL,
    "descripcion" TEXT,
    "fecha_registro" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_tipo" INTEGER,
    "id_grupo_materia" INTEGER,
    CONSTRAINT "Nota_id_estudiante_fkey" FOREIGN KEY ("id_estudiante") REFERENCES "Estudiante" ("id_estudiante") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Nota_id_tipo_fkey" FOREIGN KEY ("id_tipo") REFERENCES "TipoNota" ("id_tipo") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Nota_id_grupo_materia_fkey" FOREIGN KEY ("id_grupo_materia") REFERENCES "GrupoMateria" ("id_grupo_materia") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Horario" (
    "id_horario" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dia_semana" TEXT NOT NULL,
    "hora_inicio" DATETIME NOT NULL,
    "hora_fin" DATETIME NOT NULL,
    "id_grupo_materia" INTEGER,
    CONSTRAINT "Horario_id_grupo_materia_fkey" FOREIGN KEY ("id_grupo_materia") REFERENCES "GrupoMateria" ("id_grupo_materia") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id_usuario" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre_completo" TEXT NOT NULL,
    "correo_electronico" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "tipo_usuario" TEXT NOT NULL,
    "fecha_registro" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" TEXT NOT NULL DEFAULT 'activo'
);

-- CreateTable
CREATE TABLE "Observador" (
    "id_observacion" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_estudiante" INTEGER NOT NULL,
    "id_profesor" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fecha_registro" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Observador_id_estudiante_fkey" FOREIGN KEY ("id_estudiante") REFERENCES "Estudiante" ("id_estudiante") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Observador_id_profesor_fkey" FOREIGN KEY ("id_profesor") REFERENCES "Profesor" ("id_profesor") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Agenda" (
    "id_agenda" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_profesor" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "fecha_evento" DATETIME NOT NULL,
    "hora_inicio" DATETIME,
    "hora_fin" DATETIME,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "fecha_registro" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Agenda_id_profesor_fkey" FOREIGN KEY ("id_profesor") REFERENCES "Profesor" ("id_profesor") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Administrador_correo_electronico_key" ON "Administrador"("correo_electronico");

-- CreateIndex
CREATE UNIQUE INDEX "Estudiante_codigo_estudiante_key" ON "Estudiante"("codigo_estudiante");

-- CreateIndex
CREATE UNIQUE INDEX "Estudiante_numero_documento_key" ON "Estudiante"("numero_documento");

-- CreateIndex
CREATE UNIQUE INDEX "Estudiante_correo_electronico_key" ON "Estudiante"("correo_electronico");

-- CreateIndex
CREATE UNIQUE INDEX "Profesor_codigo_profesor_key" ON "Profesor"("codigo_profesor");

-- CreateIndex
CREATE UNIQUE INDEX "Profesor_numero_documento_key" ON "Profesor"("numero_documento");

-- CreateIndex
CREATE UNIQUE INDEX "Profesor_correo_electronico_key" ON "Profesor"("correo_electronico");

-- CreateIndex
CREATE UNIQUE INDEX "Materia_codigo_key" ON "Materia"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_electronico_key" ON "Usuario"("correo_electronico");
