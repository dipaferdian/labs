-- Active: 1786503636234@@127.0.0.1@5432@test
-- CREATE TABLE accounts (
--     id INT PRIMARY KEY,
--     customer_name VARCHAR(100) NOT NULL,
--     balance DECIMAL(15, 2) NOT NULL
-- );

-- INSERT INTO accounts (id, customer_name, balance) VALUES
-- (1, 'Andi', 5000000),
-- (2, 'Budi', 1500000),
-- (3, 'Citra', 8000000),
-- (4, 'Dedi', 300000),
-- (5, 'Eka', 2500000),
-- (6, 'Fajar', 1200000),
-- (7, 'Gina', 4500000),
-- (8, 'Hendra', 750000),
-- (9, 'Indah', 10000000),
-- (10, 'Joko', 2000000);


SELECT * FROM accounts
Where accounts.balance > 2000000

SELECT * from accounts
WHERE accounts.balance > 2000000 and (
    accounts.customer_name LIKE '%A%'
    OR accounts.customer_name LIKE '%C%'
  );

SELECT * FROM accounts
Where balance >= 2000000
Order by balance desc

SELECT COUNT(*) from accounts
where balance >= 2000000

SELECT Sum(balance) from accounts
where balance >= 2000000

SELECT avg(balance) from accounts
where balance >= 2000000

select min(balance) as min_balance, max(balance) as max_balance from accounts
where balance >= 2000000


SELECT 
  CASE
      WHEN balance < 2000000 THEN 'LOW'
      WHEN balance >= 2000000 THEN 'HIGH'
      ELSE 'Zero'
  END as balance_group,
  Count(*) as total_customers
from accounts
GROUP BY balance_group

SELECT 
  CASE
      WHEN balance < 2000000 THEN 'LOW'
      WHEN balance >= 2000000 THEN 'HIGH'
      ELSE 'Zero'
  END as balance_group,
  SUM(balance) as total_balance
from accounts
GROUP BY balance_group