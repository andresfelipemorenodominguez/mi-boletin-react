export async function sendVerificationEmail(email: string, code: string) {
  // TODO: Integrar Nodemailer u otro servicio SMTP.
  // Por ahora, simularemos el envío logueando en consola para acelerar el desarrollo.
  console.log(`\n=========================================`);
  console.log(`📧 SIMULACIÓN DE CORREO: Verificación`);
  console.log(`=========================================`);
  console.log(`Para: ${email}`);
  console.log(`Asunto: Verifica tu cuenta en Mi Boletín`);
  console.log(`Tu código de verificación es: ${code}`);
  console.log(`=========================================\n`);
  
  return true;
}

export async function sendRecoveryEmail(email: string, recoveryToken: string, userName: string) {
  // TODO: Integrar Nodemailer u otro servicio SMTP.
  // URL simulada, esto vendría de variables de entorno en producción.
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const resetLink = `${baseUrl}/admin/reset-password?token=${recoveryToken}`;

  console.log(`\n=========================================`);
  console.log(`📧 SIMULACIÓN DE CORREO: Recuperación de contraseña`);
  console.log(`=========================================`);
  console.log(`Para: ${email}`);
  console.log(`Asunto: Restablece tu contraseña en Mi Boletín`);
  console.log(`Hola, ${userName} 👋`);
  console.log(`Haz clic en el siguiente enlace para restablecer tu contraseña:`);
  console.log(`${resetLink}`);
  console.log(`=========================================\n`);

  return true;
}
