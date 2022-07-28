
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

  mysqlConnection.query(`SELECT u.co_usuario, u.no_usuario FROM cao_usuario u 
                            INNER JOIN permissao_sistema p ON u.co_usuario = p.co_usuario 
                            WHERE p.co_sistema = 1 AND p.in_ativo = "S" AND p.co_tipo_usuario IN (0,1,2)`, (err, rows, fields) => {
    if (err) {
      console.log("Error getting consultores", err);
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
  /* console.log(co_usuario); */
  const repo = `CALL Get_MonthReport(?, ?, ?);`;
  const getcons = `CALL Get_Consultor(?);`;
  let dateArray = [];
  let no_consultor = '';
  let rlArray = [];
  let rowArray = [];
  let saldo = { RECEITA_LIQUIDA: 0, CUSTO_FIJO: 0, COMISSAO: 0, LUCRO: 0 };
  let mm;
  if (year_start < year_end || (year_end == year_start && month_start <= month_end)) {
    for (let y = year_start; y <= year_end; y++) {
      let abc;
      if (y == year_start) {
        abc = month_start;
      }
      if (y !== year_start) {
        abc = 1;
      }

      for (let m = abc; m <= 12; m++) {

        mm = m.toString();
        if (mm.length < 2) {
          mm = '0' + mm;
        }
        dateArray.push(mm + '/' + y);
        
        mysqlConnection.query(repo, [co_usuario, mm, y], (err, rows, fields) => {
          if (err) {
            console.log("Error getting rowArray", err);
          }
          saldo.RECEITA_LIQUIDA += rows[0][0].RECEITA_LIQUIDA;
          saldo.CUSTO_FIJO += rows[0][0].CUSTO_FIJO;
          saldo.COMISSAO += rows[0][0].COMISSAO;
          saldo.LUCRO += rows[0][0].LUCRO;
          rlArray.push(rows[0][0].RECEITA_LIQUIDA);
          rowArray.push(rows[0][0]);
          if (y == year_end && m == month_end) {
            mysqlConnection.query(getcons, [co_usuario], (err1, rows1, fields) => {
              if (err1) {
                console.log("Error getting no_consultor", err1);
              }
              no_consultor = rows1[0][0].no_usuario;
              res.json({ no_consultor, dateArray, rowArray, rlArray, saldo });
            });

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

module.exports = router;