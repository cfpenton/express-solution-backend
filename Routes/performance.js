
const express = require('express');
const router = express.Router();

const mysqlConnection  = require('../dbConfig.js');

// directorio por default
router.get('/', (req, res) => {
  res.json({
    message: 'Performance API'
  });
});

// list consultores
router.get('/consultoresAll', (req, res) => {
    
    //let sql = 'SELECT  u.co_usuario, u.no_usuario FROM  CAO_USUARIO u INNER JOIN PERMISSAO_SISTEMA p ON u.co_usuario = p.co_usuario WHERE p.co_sistema = 1 AND p.in_ativo = "S" AND P.co_tipo_usuario IN (0,1,2)'
    mysqlConnection.query(`SELECT  u.co_usuario, u.no_usuario FROM  CAO_USUARIO u 
                            INNER JOIN PERMISSAO_SISTEMA p ON u.co_usuario = p.co_usuario 
                            WHERE p.co_sistema = 1 AND p.in_ativo = "S" AND P.co_tipo_usuario IN (0,1,2)`, (err, rows, fields) => {
        if (err){
            console.log(err);
        }

        res.json(rows);
    });
});

// relatorio data
router.get('/relatorio/:co_usuario/:date', (req, res) => {
    
  const { co_usuario, date } = req.params;
  
  console.log('co_usuario', co_usuario);
  console.log('date', date);  

  const query = `CALL SP_GetRelatorio(?, ?);`;
  
  mysqlConnection.query(query, [co_usuario, date], (err, rows, fields) => {
    if (err) {
      console.log(err);
    }

    res.json(rows[0]);

  });
});

// consultores filter
router.get('/consultores/:co_usuario/:date_start/:date_end', (req, res) => {
  
  //const {co_usuario, data_emissao} = req.body;
  const { co_usuario, date_start, date_end } = req.params;
  
  console.log('co_usuario', co_usuario);
  console.log('date_start', date_start);
  console.log('date_end', date_end);

  const query = `
    CALL SP_GetRelatorioBetween(?, ?, ?);
  `
  mysqlConnection.query(query, [co_usuario, date_start, date_end], (err, rows, fields) => {
    if (err) {
      console.log(err);
    }

    res.json(rows[0]);

  });
});

// consultores x email
router.get('/consultores/:co_usuario', (req, res) => {
  const { co_usuario } = req.params;
  mysqlConnection.query('SELECT  * FROM  CAO_USUARIO WHERE co_usuario = ?', [co_usuario], (err, rows, fields) => {
    if (err){
      console.log(err);
    }

    res.json(rows);

  });
});

// ALert
router.post('/aviso', (req, res) => {
  
  const {co_aviso, ds_aviso} = req.body;

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
  
  const {co_aviso, ds_aviso} = req.body;
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