import duckdb from "duckdb";
import fs from "fs";

const db = new duckdb.Database(":memory:");
const baseDir = "./generatedFiles";

const fileAmount = fs.readdirSync(baseDir);

let i = 1,
  len = fileAmount.length;

console.time();

const transformation = new Promise((resolve, reject) => {
  while (i < len) {
    db.run(
      `CREATE TABLE etp_transform_${i} AS SELECT * FROM read_csv_auto('./generatedFiles/ETP-Generated-File-${i}.csv')`
    );
    db.run(`UPDATE etp_transform_${i} SET Name = 'TransformedName'`);
    db.run(
      `COPY (SELECT * FROM etp_transform_${i}) TO './exportedFiles-poc1.1/ETP-Transformed-File-${i}.csv' (HEADER, DELIMITER ',')`
    );
    db.run(`DROP TABLE etp_transform_${i}`);

    if (i === len - 1) {
      resolve();
    }

    i++;
  }
});

transformation.then(() => {
  db.all("SHOW TABLES", (err, res) => console.timeEnd());
});
