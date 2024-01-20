//importar dependencias y modulos
const Order = require('../models/order.model');
const { validateOrder } = require('../helpers/validate');

const prueba = (req, res) => {
    return res.status(200).json({
        ok: true,
        message: "Test method, orderController"
    })
}

//registrar orden
const register = async (req, res) => {
    try {
        //recoger datos
        const dataOrder = req.body;
        //para que se cree la tabla en caso de que no exista
        await Order.sync();

        //que lleguen los parametros
        const validate = validateOrder(dataOrder);

        if (validate) {
            return res.status(400).json({
                ok: false,
                message: "Validation failed",
                validate
            })
        }

        const saveOrder = await Order.create({
            employeeId: dataOrder.employeeId,
            special: dataOrder.special,
            toGo: dataOrder.toGo,
            soda: dataOrder.soda
        })

        return res.status(201).json({
            ok: true,
            message: "Order created succesfully",
            saveOrder
        })
    } catch (error) {
        return res.status(400).json({
            ok: false,
            message: error.message
            
        })        
    }

}

const login = (req, res) => {
    //recoger parametros de body
    let dataUser = req.body;

    if (!dataUser.userName || !dataUser.password) {
        return res.status(400).send({
            ok: false,
            message: "Missing user or password"
        })
    }

    //buscar en la bd si existe
    User.findOne({
        where: {
            userName: dataUser.userName
        }
    })
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    ok: false,
                    message: "User missing"
                })
            }

            //comprobar su contraseña
            const pwd = bcrypt.compareSync(dataUser.password, user.password);

            if (!pwd) {
                return res.status(400).json({
                    ok: false,
                    message: "Wrong password"
                })
            }

            //conseguir token
            const token = jwt.createToken(user);


            //devolver datos del usuario    
            return res.status(200).json({
                ok: true,
                message: "Logged succesfully",
                user: {
                    userName: user.userName,
                    fullName: user.fullName
                },
                token
            })

        })
        .catch(error => {
            return res.status(404).json({
                ok: false,
                message: error.message
            })
        })

}


const update = (req, res) => {
    //recogemos info de lo que se va a actualizar
    let userNewInfo = req.body;
    let userToUpdateId = req.params.id;

    //que lleguen los parametros
    const validate = validateUserUpdate(userNewInfo);

    if (validate) {
        return res.status(400).json({
            ok: false,
            message: "Validation failed",
            validate
        })
    }

    User.findOne({
        where: {
            userName: userNewInfo.userName
        }
    }).then(async (user) => {


        let userIsset = false;
        if (user && user.userId != userToUpdateId) userIsset = true;
        if (userIsset) {
            return res.status(200).json({
                ok: true,
                message: "User already exists"
            })
        }




        //si me llega la paswrd cifrarla
        //cifrar la contraseña
        if (userNewInfo.password) {
            let pwd = await bcrypt.hash(userNewInfo.password, 10);
            userNewInfo.password = pwd;
        } else {
            delete userNewInfo.password;
        }

        //buscar y actualizar con await       
        try {
            let userUpdated = await User.update(
                userNewInfo,
                { where: { userId: userToUpdateId } }
            );

            if (!userUpdated) {
                return res.status(404).json({
                    ok: false,
                    message: error.message
                });
            }

            //devolver respuesta
            return res.status(200).json({
                ok: true,
                message: "Metodo de actualizar usuario",
                user: userUpdated
            });
        } catch (error) {
            return res.status(500).json({
                ok: false,
                message: "Error al actualizar",
                error: error.message
            });
        }

    })
        .catch(error => {
            return res.status(500).json({
                ok: false,
                message: error.message
            });

        })



}


//listar usuarios
const list = async (req, res) => {
    try {
        const users = await User.findAll();
        return res.status(200).json({
            ok: true,
            body: users
        })
    } catch (error) {
        return res.status(500).send({
            ok: false,
            message: error.message
        });
    }
};

const listOne = async (req, res) => {
    let userId = req.params.id;

    await User.findOne({
        where: {
            userId
        },
        attributes: ['userId', 'userName', 'fullName', 'createdAt', 'updatedAt']
    }).then(async (user) => {
        return res.status(200).json({
            ok: true,
            user
        });
    }).catch((error) => {
        return res.status(500).send({
            ok: false,
            message: error.message
        });
    })
};

//exportar acciones
module.exports = {
    prueba,
    register,
    list,
    login,
    update,
    listOne
}