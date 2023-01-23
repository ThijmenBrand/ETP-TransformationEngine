import sqlite3
import pandas as pd
import time
import os
  
# Connect to SQLite database
conn = sqlite3.connect(':memory:')

st = time.time()

for i in range(80_000):
    fileNum = i + 1
    # Load CSV data into Pandas DataFrame
    stud_data = pd.read_csv(f"generatedFiles/ETP-Generated-File-{fileNum}.csv")
    # Write the data to a sqlite table
    stud_data.to_sql(f"etp_transform_{fileNum}", conn, if_exists='replace', index=False)

print("files loaded")

for i in range(80_000):
    fileNum = i + 1
    
    conn.execute(f"UPDATE etp_transform_{fileNum} SET Name = 'TransformedName'")
    pd.read_sql_query(f"SELECT * FROM etp_transform_{fileNum}", conn).to_csv(f'exportedFiles-poc2.2/ETP-Transformed-File-{fileNum}.csv', index=False)
    conn.execute(f"DROP TABLE etp_transform_{fileNum}")

et = time.time()

elapsed_time = et - st
print('Execution time:', elapsed_time, 'seconds')

# Close connection to SQLite database
conn.close()