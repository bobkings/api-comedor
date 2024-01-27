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


const update = async (req, res) => {
    //recogemos info de lo que se va a actualizar
    let orderNewInfo = req.body;
    let orderToUpdateId = req.params.id;

    //que lleguen los parametros
    const validate = validateOrder(orderNewInfo);

    if (validate) {
        return res.status(400).json({
            ok: false,
            message: "Validation failed",
            validate
        })
    }

    //buscar y actualizar con await       
    try {
        let orderUpdated = await Order.update(
            orderNewInfo,
            { where: { orderId: orderToUpdateId } }
        );

        if (!orderUpdated) {
            return res.status(404).json({
                ok: false,
                message: error.message
            });
        }

        //devolver respuesta
        return res.status(200).json({
            ok: true,
            message: "Order updated successfully",
            order: orderUpdated
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: "Update failed",
            error: error.message
        });
    }



}


//listar ordenes ***REVISAR PORQUE TE QUIERE BUSCAR EL CAMPO EXCLUIDO SI NO EXISTE
//se corrigio
const list = async (req, res) => {
    try {
        let page=req.params.page ? req.params.page : 1;
        let limit = 5;
        let offset = 0 + (page - 1) * limit;
        const orders = await Order.findAndCountAll({
            limit,
            offset
        });
        return res.status(200).json({
            ok: true,
            body: orders
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
    update,
    listOne
}