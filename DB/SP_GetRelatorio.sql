DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_GetRelatorio`(
  IN _co_usuario VARCHAR(45),
  IN _date_start VARCHAR(30),
  IN _date_end VARCHAR(30)
)
BEGIN 
	SELECT  sum((f.valor - (f.valor * f.total_imp_inc) / 100)) as RECEITA_LIQUIDA, s.brut_salario as CUSTO_FIJO,   
		sum((f.valor - (f.valor * f.total_imp_inc) / 100) * (comissao_cn) /100) as COMISSAO,
		sum((f.valor - (f.valor * f.total_imp_inc) / 100) - (s.brut_salario + (f.valor - (f.valor * f.total_imp_inc) / 100) * (comissao_cn) / 100)) as LUCRO
	FROM CAO_FATURA f
	INNER JOIN CAO_OS o 
		ON f.co_os = o.co_os
	INNER JOIN CAO_SALARIO s 
		ON s.co_usuario = s.co_usuario
	INNER JOIN CAO_USUARIO u
		ON s.co_usuario = u.co_usuario
	INNER JOIN PERMISSAO_SISTEMA ps
		ON u.co_usuario = ps.co_usuario
	WHERE ps.co_sistema = 1 
		AND ps.in_ativo = 'S' 
		AND ps.co_tipo_usuario IN (0,1,2) 
		AND u.co_usuario = _co_usuario
		AND  data_emissao BETWEEN _date_start AND _date_end;

END$$
DELIMITER ;
