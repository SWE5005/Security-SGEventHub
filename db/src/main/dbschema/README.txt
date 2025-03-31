1) Create a database and a user on your machine.
2) liquibase.properties-file, use the same db and credentials

3) log in as root to mysql
3.1) mysql> CREATE database sgeh;
3.2) mysql> GRANT ALL PRIVILEGES ON sgeh.* To 'sgeh'@'localhost' IDENTIFIED BY 'postgres';

4)   Execute the 'database project by running :
4.1) $mvn clean install

5.0) PostgreSQL hints
sudo -u postgres createdb sgeh
CREATE USER postgres WITH PASSWORD '{{PASSWORD}}';
psql -d postgres
postgres=# create database sgeh_development;
postgres=# GRANT ALL PRIVILEGES ON DATABASE sgeh_development to postgres;
psql -d sgeh

/home/ingimar/tmp/DANMARK-2015-11-02/db