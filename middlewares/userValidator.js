export const verificarUser = (req, res, next) => {
    /* Verifica que haya una sesion activa
    El request tendra las config de passport
    isAuthenticated() viene de passport
    En caso de que haya una sesion, pasa al controlador
    */
    if (req.isAuthenticated()) return next();
    res.redirect("/auth/login");
};
