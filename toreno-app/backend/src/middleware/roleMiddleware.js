// Verificar que el usuario tenga uno de los roles permitidos
export const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // req.user viene del authMiddleware
      if (!req.user) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
      }

      const userRole = req.user.role;

      // Verificar si el rol del usuario está en los roles permitidos
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ 
          error: 'No tienes permisos para realizar esta acción',
          requiredRoles: allowedRoles,
          yourRole: userRole
        });
      }

      next();

    } catch (error) {
      return res.status(500).json({ error: 'Error al verificar permisos' });
    }
  };
};

// Middleware específicos por rol (atajos)
export const isAdmin = checkRole('admin');
export const isAdminOrGerente = checkRole('admin', 'gerente');
export const isAdminOrCajero = checkRole('admin', 'cajero', 'gerente');
export const isPastelero = checkRole('admin', 'gerente', 'pastelero');