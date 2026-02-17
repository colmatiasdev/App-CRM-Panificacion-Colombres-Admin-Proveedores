/**
 * Generación de IDs únicos para tablas/hojas.
 * Nivel Arquitectura: usado por todos los módulos que crean registros con ID autogenerado.
 *
 * Patrones soportados:
 * - patronId 1: prefijoId + "-" + cadena alfanumérica de 15 caracteres.
 *   Ejemplo: PROD-ELAB-4g8h6jjk64tg63
 * - patronId 2: prefijoId + "-" + alfanumérica + "-" + número aleatorio de 4 dígitos.
 *   Ejemplo: PROD-BASE-s46g4dh4s5aazs-7522
 */
(function () {
    var ALFANUM = "0123456789abcdefghijklmnopqrstuvwxyz";

    function alfanumericoAleatorio(longitud) {
        var r = "";
        for (var i = 0; i < (longitud || 15); i++) {
            r += ALFANUM[Math.floor(Math.random() * ALFANUM.length)];
        }
        return r;
    }

    function digitosAleatorios(cantidad) {
        var r = "";
        for (var i = 0; i < (cantidad || 4); i++) {
            r += Math.floor(Math.random() * 10);
        }
        return r;
    }

    /**
     * Genera un ID único según la configuración de la hoja.
     * @param {Object} hojaConfig - Config de la hoja (debe tener prefijoId y patronId).
     *   - prefijoId: string (ej. "PROD-ELAB" o "PROD-BASE")
     *   - patronId: 1 (dos partes: prefijo + 15 alfanum) | 2 (tres partes: prefijo + 15 alfanum + 4 dígitos)
     *   - longitudAlfanum: opcional, default 15
     *   - digitosSufijo: opcional, default 4 (solo patronId 2)
     * @returns {string} ID generado.
     */
    function generarIdParaHoja(hojaConfig) {
        var prefijo = (hojaConfig && hojaConfig.prefijoId) ? String(hojaConfig.prefijoId).trim() : "ID";
        var patron = hojaConfig && hojaConfig.patronId !== undefined ? parseInt(hojaConfig.patronId, 10) : 1;
        var lenAlf = (hojaConfig && hojaConfig.longitudAlfanum) !== undefined ? parseInt(hojaConfig.longitudAlfanum, 10) : 15;
        var lenDig = (hojaConfig && hojaConfig.digitosSufijo) !== undefined ? parseInt(hojaConfig.digitosSufijo, 10) : 4;
        if (isNaN(lenAlf) || lenAlf < 1) lenAlf = 15;
        if (isNaN(lenDig) || lenDig < 1) lenDig = 4;

        var parteAlf = alfanumericoAleatorio(lenAlf);
        if (patron === 2) {
            return prefijo + "-" + parteAlf + "-" + digitosAleatorios(lenDig);
        }
        return prefijo + "-" + parteAlf;
    }

    window.GENERAR_ID_PARA_HOJA = generarIdParaHoja;
})();
