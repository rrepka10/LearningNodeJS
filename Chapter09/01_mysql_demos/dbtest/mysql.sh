drop database if exists testDB;
 
CREATE DATABASE testDB;
use testDB;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL
);

show tables;

select * from testdb;

