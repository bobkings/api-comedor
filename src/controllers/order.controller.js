//importar dependencias y modulos
const Order = require('../models/order.model');
const Employee = require('../models/employee.model');
const { validateOrder } = require('../helpers/validate');
//const { exportOrder } = require('../helpers/exportExcel');
const excelJS = require("exceljs");
const { Op } = require("sequelize");

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
        let limit = req.body.limit;
        let offset = 0 + (page - 1) * limit;
        const orders = await Order.findAndCountAll({
            limit,
            offset,
            include: [
                {
                    model: Employee,
                    attributes: ['empNumber','fullName']
                }
            ]
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
    let orderId = req.params.id;

    await Order.findOne({
        where: {
            orderId
        },
        include: [
            {
                model: Employee,
                attributes: ['empNumber','fullName']
            }
        ]        
    }).then(async (order) => {
        return res.status(200).json({
            ok: true,
            order
        });
    }).catch((error) => {
        return res.status(500).send({
            ok: false,
            message: error.message
        });
    })
};

const deleteOrder = async (req, res) => {
    try {
        let idToDelete= req.params.id;
        
        const order = await Order.destroy({
            where:{ orderId: idToDelete}            
        });
        
        return res.status(200).json({
            ok: true,
            body: order
        })        
    } catch (error) {
        return res.status(500).send({
            ok: false,
            message: error.message
        });           
    }
}

const downloadExcel = async (req, res) => {
    // We'll write this code in a moment
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Pedidos");
    let startDate=req.body.startDate;
    let endDate=req.body.endDate;
    
    /*
    // Define columns in the worksheet 
    */
    worksheet.columns = [
        { header: "Numero de empleado", key: "empnum", width: 10 },        
        { header: "Nombre", key: "name", width: 25 },
        { header: "Especial", key: "sp", width: 10 },
        { header: "Para llevar", key: "togo", width: 10 },
        { header: "Refresco", key: "soda", width: 10 },
        { header: "Fecha", key: "date", width: 25, style: { numFmt: 'dd/mm/yyyy HH:mm:ss' } },
    ];

    const orders = await Order.findAll({
        include: [
            {
                model: Employee,
                attributes: ['empNumber','fullName']
            }
        ],
        where: {
            updatedAt: {
                [Op.between]: [startDate, endDate],
            }
        }
    });
    
    //console.log(orders[0]['orderId'], orders[0]['employeeId'], orders[0]['Employee']['fullName']);

    // Add data to the worksheet 
    orders.forEach(order => {
        let chsp= (order['special']) ? 'Si' : 'No';
        let chtogo= (order['toGo']) ? 'Si' : 'No';
        let chsoda= (order['soda']) ? 'Si' : 'No';                
        worksheet.addRow({empnum: order['Employee']['empNumber'], name: order['Employee']['fullName'], sp: chsp, togo: chtogo, soda: chsoda, date: order['updatedAt']}); 
    });
/*
return res.status(200).json({
    ok: true,
    body: orders
})    
*/

    /*
    */
    // headers (revisar en postman) 
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"); 
    res.setHeader("Content-Disposition", "attachment; filename=" + "Pedidos.xlsx");
    
    // Write the workbook to the response object 
    workbook.xlsx.write(res).then(() => res.end());
}

//exportar acciones
module.exports = {
    prueba,
    register,
    list,
    update,
    listOne,
    deleteOrder,
    downloadExcel
}