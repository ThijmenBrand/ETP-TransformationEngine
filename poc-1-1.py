import duckdb
import os
import time

conn = duckdb.connect()

st = time.time()

for i in range(80_000):
    fileNum = i + 1
    conn.execute(f"CREATE TABLE etp_transform_{fileNum} AS SELECT * FROM read_csv_auto('./generatedFiles/ETP-Generated-File-{fileNum}.csv')")
    conn.execute(f"UPDATE etp_transform_{fileNum} SET Name = 'TransformedName'")
    conn.execute(f"COPY (SELECT * FROM etp_transform_{fileNum}) TO './exportedFiles-poc1.1.1/ETP-Transformed-File-{fileNum}.csv' (HEADER, DELIMITER ',')")
    conn.execute(f"DROP TABLE etp_transform_{fileNum}")

et = time.time()

elapsed_time = et - st
print('Execution time:', elapsed_time, 'seconds')