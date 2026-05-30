/*
  Warnings:

  - You are about to drop the `GrupoEstudiante` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `grado` on the `Estudiante` table. All the data in the column will be lost.
  - You are about to drop the column `grupo` on the `Estudiante` table. All the data in the column will be lost.
  - You are about to drop the column `asignaturas` on the `Profesor` table. All the data in the column will be lost.
  - Added the required column `id_grado` to the `Grupo` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "GrupoEstudiante";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Grado" (
    "id_grado" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Estudiante" (
    "id_estudiante" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "codigo_estudiante" TEXT,
    "nombre_completo" TEXT NOT NULL,
    "tipo_documento" TEXT NOT NULL,
    "numero_documento" TEXT NOT NULL,
    "correo_electronico" TEXT NOT NULL,
    "id_grupo" INTEGER,
    "contrasena" TEXT NOT NULL,
    "fecha_registro" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" TEXT NOT NULL DEFAULT 'activo',
    "id_admin" INTEGER,
    "nombre_completo_admin" TEXT,
    "correo_electronico_admin" TEXT,
    CONSTRAINT "Estudiante_id_grupo_fkey" FOREIGN KEY ("id_grupo") REFERENCES "Grupo" ("id_grupo") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Estudiante" ("codigo_estudiante", "contrasena", "correo_electronico", "correo_electronico_admin", "estado", "fecha_registro", "id_admin", "id_estudiante", "nombre_completo", "nombre_completo_admin", "numero_documento", "tipo_documento") SELECT "codigo_estudiante", "contrasena", "correo_electronico", "correo_electronico_admin", "estado", "fecha_registro", "id_admin", "id_estudiante", "nombre_completo", "nombre_completo_admin", "numero_documento", "tipo_documento" FROM "Estudiante";
DROP TABLE "Estudiante";
ALTER TABLE "new_Estudiante" RENAME TO "Estudiante";
CREATE UNIQUE INDEX "Estudiante_codigo_estudiante_key" ON "Estudiante"("codigo_estudiante");
CREATE UNIQUE INDEX "Estudiante_numero_documento_key" ON "Estudiante"("numero_documento");
CREATE UNIQUE INDEX "Estudiante_correo_electronico_key" ON "Estudiante"("correo_electronico");
CREATE TABLE "new_Grupo" (
    "id_grupo" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "id_grado" INTEGER NOT NULL,
    "id_periodo" INTEGER,
    CONSTRAINT "Grupo_id_grado_fkey" FOREIGN KEY ("id_grado") REFERENCES "Grado" ("id_grado") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Grupo_id_periodo_fkey" FOREIGN KEY ("id_periodo") REFERENCES "PeriodoAcademico" ("id_periodo") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Grupo" ("id_grupo", "id_periodo", "nombre") SELECT "id_grupo", "id_periodo", "nombre" FROM "Grupo";
DROP TABLE "Grupo";
ALTER TABLE "new_Grupo" RENAME TO "Grupo";
CREATE TABLE "new_Profesor" (
    "id_profesor" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "codigo_profesor" TEXT,
    "nombre_completo" TEXT NOT NULL,
    "tipo_documento" TEXT NOT NULL,
    "numero_documento" TEXT NOT NULL,
    "correo_electronico" TEXT NOT NULL,
    "telefono" TEXT,
    "contrasena" TEXT NOT NULL,
    "fecha_registro" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" TEXT NOT NULL DEFAULT 'activo',
    "id_admin" INTEGER,
    "nombre_completo_admin" TEXT,
    "correo_electronico_admin" TEXT
);
INSERT INTO "new_Profesor" ("codigo_profesor", "contrasena", "correo_electronico", "correo_electronico_admin", "estado", "fecha_registro", "id_admin", "id_profesor", "nombre_completo", "nombre_completo_admin", "numero_documento", "telefono", "tipo_documento") SELECT "codigo_profesor", "contrasena", "correo_electronico", "correo_electronico_admin", "estado", "fecha_registro", "id_admin", "id_profesor", "nombre_completo", "nombre_completo_admin", "numero_documento", "telefono", "tipo_documento" FROM "Profesor";
DROP TABLE "Profesor";
ALTER TABLE "new_Profesor" RENAME TO "Profesor";
CREATE UNIQUE INDEX "Profesor_codigo_profesor_key" ON "Profesor"("codigo_profesor");
CREATE UNIQUE INDEX "Profesor_numero_documento_key" ON "Profesor"("numero_documento");
CREATE UNIQUE INDEX "Profesor_correo_electronico_key" ON "Profesor"("correo_electronico");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Grado_nombre_key" ON "Grado"("nombre");
