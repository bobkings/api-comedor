const readXlsxFile = require("read-excel-file/node");

exports.readExcel = async (path) => {
    let employees = [];
    await readXlsxFile(path).then((rows) => {
        // skip header
        rows.shift();        

        rows.forEach((row) => {
            let employee = {
                employeeId: null,
                empNumber: row[0],
                fullName: row[1],
            };

            employees.push(employee);
        });
    });

    return employees;
}