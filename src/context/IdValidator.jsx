import { Navigate, useParams } from "react-router";
import { useAuth } from "./AuthContext";

function idMongoDbValidator(id) {

    //Validacion básica que no esté vacio
    // y su longitud sea de 24 caracteres
    if (!id || id.trim().length !== 24)
        return false;

    //Validar formato hexadecimal
    const isValidHex = /^[0-9a-fA-F]{24}$/.test(id.trim());
    if (!isValidHex)
        return false;

    //Validar ID "especiales reservados para mongodb
    // o IDs sospechosos para testing de ataques
    // o secuencias que nunca generará mongoDB en un id
    const reservedOrSuspiciousObjectsIds = [
        '000000000000000000000000',
        'ffffffffffffffffffffffff',

        //Patrones de testing comunes
        'aaaaaaaaaaaaaaaaaaaaaaaa',
        'bbbbbbbbbbbbbbbbbbbbbbbb',
        'cccccccccccccccccccccccc',

        //secuencias obvias
        '0123456789abcdef01234567',
        '123456789abcdef12345678',

        //Palabras/conceptos en hex
        'deadbeefdeadbeefdeadbeef', //"dead beef"
        'cafebabecafebabecafebabe', //"cafe babe"
        'badc0ffebadc0ffebadc0ffe', //"bad coffe"
    ];
    if (reservedOrSuspiciousObjectsIds.includes(id.trim().toLowerCase()))
        return false;

    return true;
};//fin de idMongoDbValidator

//Wrapper para validacion 
function IdValidator({ children }) {
    const { isAdmin } = useAuth();
    const { id } = useParams();
    const validateId = idMongoDbValidator(id);

    if (!validateId) {
        if (isAdmin)
            return <Navigate to="/products" replace />;
        else
            return <Navigate to="/getallproducts" replace />;
    }

    return children;
}

export default IdValidator;
