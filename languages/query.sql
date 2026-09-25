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

-- ALTER TABLE accounts
-- ADD COLUMN account_type VARCHAR(20);

-- UPDATE accounts SET account_type = 'SAVINGS' WHERE id IN (1, 2, 5, 8, 10);
-- UPDATE accounts SET account_type = 'CURRENT' WHERE id IN (3, 4, 6, 7, 9);

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


SELECT 
  CASE
      WHEN balance < 2000000 THEN 'LOW'
      WHEN balance >= 2000000 THEN 'HIGH'
      ELSE 'Zero'
  END as balance_group,
  AVG(balance) as average_balance
from accounts
GROUP BY balance_group

SELECT 
  CASE
      WHEN balance >= 1000000 THEN 'HIGH'
  END as balance_group,
    COUNT(id) as total_customers
from accounts
WHERE balance >= 1000000
GROUP BY balance_group
HAVING COUNT(id) > 3


SELECT 
 account_type,
 SUM(balance) as total_balances,
 count(id) as total_customers
from accounts
GROUP BY account_type

SELECT 
  account_type,
  count(id) total_customers,
  sum(balance) total_balances
from accounts
where balance >= 1000000
GROUP BY account_type
HAVING SUM(balance) > 15000000

SELECT 
    CASE
      WHEN balance < 2000000 THEN 'LOW'
      WHEN balance >= 2000000 THEN 'HIGH'
      ELSE 'Zero'
  END as balance_group,
  count(id) total_customers,
  sum(balance) total_balances
from accounts
GROUP BY balance_group
HAVING sum(balance) > 3000000
order by total_balances desc


SELECT 
    COUNT(
    CASE
      WHEN balance >= 2000000 THEN 'high_balance_customers'
    END
) as high_balance_customers,
COUNT(
    CASE
      WHEN balance < 2000000 THEN 'low_balance_customers'
    END
) as low_balance_customers
from accounts

SELECT 
    sum(
    CASE
      WHEN balance >= 2000000 THEN balance
    END
) as high_balance_customers,
sum(
    CASE
      WHEN balance < 2000000 THEN balance
    END
) as low_balance_customers
from accounts


SELECT 
    avg(
    CASE
      WHEN balance >= 2000000 THEN balance
    END
) as high_balance_customers,
AVG(
    CASE
      WHEN balance < 2000000 THEN balance
    END
) as low_balance_customers
from accounts

SELECT
account_type,
    COUNT(
    CASE
      WHEN balance >= 2000000 THEN 'high_balance_customers'
    END
) as high_balance_customers,
COUNT(
    CASE
      WHEN balance < 2000000 THEN 'low_balance_customers'
    END
) as low_balance_customers
from accounts
GROUP BY account_type
   
SELECT
account_type,
    SUM(
    CASE
      WHEN balance >= 2000000 THEN balance
    END
) as total_high_balance,
SUM(
    CASE
      WHEN balance < 2000000 THEN balance
    END
) as total_low_balance
from accounts
GROUP BY account_type