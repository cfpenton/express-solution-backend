
const express = require('express');
const router = express.Router();

const mysqlConnection = require('../dbConfig.js');

// directorio por default
router.get('/', (req, res) => {
  res.json({
    message: 'Performance API'
  });
});

//get consultores
router.get('/consultores', (req, res) => {

  mysqlConnection.query(`SELECT  u.co_usuario, u.no_usuario FROM  CAO_USUARIO u 
                            INNER JOIN PERMISSAO_SISTEMA p ON u.co_usuario = p.co_usuario 
                            WHERE p.co_sistema = 1 AND p.in_ativo = "S" AND P.co_tipo_usuario IN (0,1,2)`, (err, rows, fields) => {
    if (err) {
      console.log(err);
    }

    res.json(rows);
  });
});

//data report (month range)
//month(01-12)
//year(2003-2007)
//example   /relatorio/carlos.arruda/01/2007/07/2007
router.get('/relatorio/:co_usuario/:month_start/:year_start/:month_end/:year_end', (req, res) => {

  const { co_usuario, month_start, year_start, month_end, year_end } = req.params;
  const query = `CALL Get_MonthReport(?, ?, ?);`;
  let rowArray = [];
  let mm;
  if (year_start < year_end || (year_end == year_start && month_start <= month_end)) {
    for (let y = year_start; y <= year_end; y++) {
      for (let m = month_start; m <= 12; m++) {
        mm = m.toString();
        if (mm.length < 2) {
          mm = '0' + mm;
        }
      /*   console.log(co_usuario, mm, y); */
        mysqlConnection.query(query, [co_usuario, mm, y], (err, rows, fields) => {
          if (err) {
            console.log(err);
          }
          rowArray.push(rows[0][0]);
          if (y == year_end && m == month_end) {
            console.log(rowArray);
            res.json(rowArray);
          };
        });
        if (y == year_end && m == month_end) {
          break;
        };
      };
    };
  }
  else
    console.log('start date is greater than end date');
});

/* router.get('/relatorio/:co_usuario/:month_start/:year_start', (req, res) => {

  const { co_usuario, month_start, year_start } = req.params;
  const query = `CALL Get_MonthReport(?, ?, ?);`;
  console.log(co_usuario, month_start, year_start);
  mysqlConnection.query(query, [co_usuario, month_start, year_start], (err, rows, fields) => {
    if (err) {
      console.log(err);
    }
    res.json(rows[0]);
  });
}); */

//data report
/* router.get('/relatorio/:co_usuario/:date', (req, res) => {

  const { co_usuario, date } = req.params;

  console.log('co_usuario', co_usuario);
  console.log('date', date);

  const query = `CALL Get_Report(?, ?);`;

  mysqlConnection.query(query, [co_usuario, date], (err, rows, fields) => {
    if (err) {
      console.log(err);
    }

    res.json(rows[0]);

  });
}); */

//data report (range)
router.get('/consultores/:co_usuario/:date_start/:date_end', (req, res) => {

  const { co_usuario, date_start, date_end } = req.params;
  const query = `CALL Get_ReportBetween(?, ?, ?);`;

  mysqlConnection.query(query, [co_usuario, date_start, date_end], (err, rows, fields) => {
    if (err) {
      console.log(err);
    }
    console.log(rows[0][0]);
    res.json(rows[0]);

  });
});

// consultores x email
/* router.get('/consultores/:co_usuario', (req, res) => {
  const { co_usuario } = req.params;
  mysqlConnection.query('SELECT  * FROM  CAO_USUARIO WHERE co_usuario = ?', [co_usuario], (err, rows, fields) => {
    if (err) {
      console.log(err);
    }

    res.json(rows);

  });
}); */

// ALert
router.post('/aviso', (req, res) => {

  const { co_aviso, ds_aviso } = req.body;

  const query = `
    CALL AvisoAddOrEdit(?, ?);
  `
  mysqlConnection.query(query, [co_aviso, ds_aviso], (err, rows, fields) => {
    if (err) {
      console.log(err);
    }

    res.json({
      Status: 'Aviso agregado'
    });
  });
});

// update aviso
router.put('/aviso/:co', (req, res) => {

  const { co_aviso, ds_aviso } = req.body;
  const { co } = req.params;

  console.log('CO', co);

  const query = `
    CALL AvisoAddOrEdit(?, ?);
  `
  mysqlConnection.query(query, [co, ds_aviso], (err, rows, fields) => {
    if (err) {
      console.log(err);
    }

    res.json({
      Status: 'Aviso actualizado'
    });
  });
});

// delete aviso
router.delete('/aviso/:co', (req, res) => {

  const { co } = req.params;

  console.log('CO', co);

  mysqlConnection.query('delete from cao_aviso where co_aviso = ?', [co], (err, rows, fields) => {
    if (err) {
      console.log(err);
    }

    res.json({
      Status: 'Aviso eliminado'
    });
  });
});

module.exports = router;