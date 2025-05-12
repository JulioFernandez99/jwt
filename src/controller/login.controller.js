const path = require('path');
const fs = require('fs/promises');
const  jwt = require('jsonwebtoken')
require('dotenv').config()

const jwt_secret = process.env.JWT_SECRET

const login = async (req, res) => {
    console.log("--------------> Login")
    const {user, password} = req.body
    try {
        const filePath = path.join(__dirname, './db.json');
        const rawData = await fs.readFile(filePath, 'utf8');
        const data = JSON.parse(rawData);
        const foundUser = data.users.find(u => u.user === user && u.password === password);

        if (foundUser){
            const token = jwt.sign({user: user, password: password}, jwt_secret, {
                expiresIn: '1h'
            })
            return res
            .cookie('access_token', token, {
                httpOnly: true, //? la cookie solo se puede acceder en el server
                sameSite:  'strict', //? La cookie solo se puede acceder en el mismo dominio
                maxAge: 1000 * 60 * 60 //? la cookie tiene solo validez por 1 hora
            })
            .status(200).json({
                status: true,
                message: 'Usuario encontrado con exito'                                                                                                     
            })
        }

        return res.clearCookie('access_token').status(500).json({
                status: true,
                message: 'Credenciales incorrectas'
            })

    } catch (error) {    
        console.error('Error leyendo el archivo JSON:', error);
        res.status(500).json({ status: false, message: 'Error al leer el archivo JSON' });
    }
};


const verify_login = async (req, res) => {
    const {user} = req.session

    if (!user) {
         return res.status(403).json({
            status: false,
            message: 'Acceso no autorizado'
        })       

    }
    // const token = req.cookies.access_token
    // if (!token){
    //     return res.status(403).json({
    //         status: false,
    //         message: 'Acceso no autorizado'
    //     })
    // }

    return res.status(200).json({
            status: false,
            message: 'Acceso autorizado',
            user: user
        })

}

const logout = async (req,res) => {

    const {user} = req.session

    if (!user) {
         return res.status(403).json({
            status: false,
            message: 'No existe una sesion abierta'
        })       

    }
    // const token = req.cookies.access_token
    // if (!token){
    //     return res.status(403).json({
    //         status: false,
    //         message: 'Acceso no autorizado'
    //     })
    // }

    return res.status(200).json({
            status: false,
            message: 'Sesion cerrada con exito',
            user: user
        })


}

module.exports = {
    login,
    verify_login,
    logout
};
