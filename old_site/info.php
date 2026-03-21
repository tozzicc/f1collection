<?php
  try {
    $banco = new PDO('mysql:host=base_cv.mysql.dbaas.com.br;dbname=base_cv', 'base_cv','cv123456') or print (mysql_error());
    print "Conexão Efetuada com sucesso!";
  } catch(Exception $e) {
      print_r($e);
  }
?>