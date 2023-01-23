import duckdb from "duckdb";

const db = new duckdb.Database(":memory:");
const baseDir = "./generatedFiles";

let i = 1;

console.time();

const loadFilesInDb = new Promise((resolve, reject) => {
  while (i < 80_000) {
    db.run(
      `CREATE TABLE etp_transform_${i} AS SELECT * FROM read_csv_auto('./generatedFiles/ETP-Generated-File-${i}.csv')`
    );

    if (i === 80_000 - 1) {
      resolve();
    }

    i++;
  }
});

await loadFilesInDb.then(() =>
  db.all("SHOW TABLES", (err, res) => console.log("files loaded"))
);

let j = 1;

const transformFiles = new Promise((resolve, reject) => {
  while (j < 80_000) {
    db.run(`UPDATE etp_transform_${i} SET Name = 'TransformedName'`);
    db.run(
      `COPY (SELECT * FROM etp_transform_${i}) TO './exportedFiles-poc1.2/ETP-Transformed-File-${i}.csv' (HEADER, DELIMITER ',')`
    );
    db.run(`DROP TABLE etp_transform_${i}`);

    if (i === 80_000 - 1) {
      resolve();
    }

    i++;
  }
});

transformFiles.then(() =>
  db.all("SHOW TABLES", (err, res) => console.timeEnd())
);
