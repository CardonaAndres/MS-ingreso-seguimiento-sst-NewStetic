import { throwError } from '../../../app/utils/throw.error.js';

export class UserValidator {
    static validateUserInfo(userInfo){
        const {             
            username, 
            documentNumber, 
            email = `${username}@newstetic.com`, 
            state = 'Activo',
            roleID 
        } = userInfo;
        
        if (!username || typeof username !== 'string' || username.trim().length < 3) 
            throwError('El username es obligatorio y debe tener al menos 3 caracteres', 400)
        
        if (!documentNumber || !/^\d+$/.test(documentNumber))
            throwError('El número de documento es obligatorio y solo puede contener dígitos', 400)

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) 
            throwError('El email no es válido', 400);
        
        if (!['Activo', 'Inactivo'].includes(state))
            throwError(`El estado debe ser uno de: ${['Activo', 'Inactivo'].join(', ')}`, 400)

        if (!roleID || isNaN(roleID) || roleID <= 0) 
            throwError('El roleID es obligatorio y debe ser un número positivo', 400)

        return true;
    }
}