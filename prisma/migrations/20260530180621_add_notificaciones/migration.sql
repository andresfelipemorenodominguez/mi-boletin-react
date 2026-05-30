-- CreateTable
CREATE TABLE "Notificacion" (
    "id_notificacion" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_admin" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'info',
    "titulo" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "href" TEXT,
    "fecha_creacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notificacion_id_admin_fkey" FOREIGN KEY ("id_admin") REFERENCES "Administrador" ("id_admin") ON DELETE CASCADE ON UPDATE CASCADE
);
