const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const APIError = require('../utils/error');
const { RoleService, UserService } = require('../services');
const { UserController } = require('../controllers');

module.exports = {
    logDate: (req, res, next) => {
        const date = new Date();
        // eslint-disable-next-line no-console
        console.log(`${date.toLocaleTimeString()}`);
        next();
    },
    verifyToken(req, res, next) {
        //Verificamos si el token fue firmado con nuestro secreto
        try {
            /*   console.log(req.headers) */
            const { authorization } = req.headers;
            if (authorization) {
                const token = authorization.split(' ')[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET);

                req.decoded = decoded;
                next();
            } else {

                throw new APIError('Not Authorized', 400);
            }

        } catch (error) {
            res.send(error.message);
        }
    },
    roleHasPermissions: (...permissions) => {
        /*Middleware para comprobar los permisos con los que cuenta quien envia la peticion
        dentro del bearer y se comprueba en la base*/
        var isSubset = function (piece, wholeArray) {
            /*   console.log(piece)
              console.log(wholeArray) */
            return piece.every(function (val) {

                return wholeArray.indexOf(val) >= 0;
            })
        }
        return async (req, res, next) => {
            try {

                const user = await UserService.findOneByUsernameWithRolePermissions(req.decoded.username);

                if (user != null && (isSubset(permissions, user.permissions) || user.role === "ADMIN")) {
                    req.user = user;
                    next();
                } else {
                    res.status(403).send({
                        message: 'Not Authorized'
                    });
                }

            } catch (error) {
                if (process.env.DEBUG) console.log(error)

                res.status(500).send({
                    message: 'Error Contact TI Team'
                });
            }


        }

    },
    // eslint-disable-next-line no-unused-vars
    errorHandler: (err, req, res, next) => {
        console.error(err.stack);
        const accessLogStream = fs.createWriteStream(path.join(__dirname, '../../access.log'), { flags: 'a' });
        accessLogStream.write(`${err.stack} \n`, 'utf8');
        accessLogStream.end();
        // eslint-disable-next-line no-console
        if (err instanceof APIError) {
            res
                .status(err.statusCode)
                .json({ errorCode: err.statusCode, message: err.message });
        } else {
            res
                .status(500)
                .json({ errorCode: 500, message: err.message });
        }
    },
    dateFormatter: (startDate, finalDate) => {
        let date = new Date(Number(startDate));
        let hr = date.getHours();
        let min = date.getMinutes();
        let seg = date.getMinutes();
        if (hr < 10) {
            hr = "0" + hr;
        }
        if (min < 10) {
            min = "0" + min;
        }
        if (seg < 10) {
            seg = "0" + seg;
        }
        startDate = date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + ("0" + (date.getDate()))
            .slice(-2) +
            " " + hr +
            ":" + min +
            ":" + seg;

        if (finalDate != 'null') {
            let date = new Date(Number(finalDate));
            let hr = date.getHours();
            let min = date.getMinutes();
            let seg = date.getMinutes();
            if (hr < 10) {
                hr = "0" + hr;
            }
            if (min < 10) {
                min = "0" + min;
            }
            if (seg < 10) {
                seg = "0" + seg;
            }

            finalDate = date = date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + ("0" + (date.getDate()))
                .slice(-2) +
                " " + hr +
                ":" + min +
                ":" + seg;
        } else {
            finalDate = today;
        }

        return startDate;
    }
};