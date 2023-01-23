using System;
using System.Globalization;
using System.IO;
using System.Text;
using CsvHelper;

namespace TransformationEngine;

class Program
{
    private static string basePath = @"C:\ETP-Repos\ETP-TransformationEngine\generatedFiles\";
    static void Main(string[] args)
    {

        GenerateFiles(80000);
    }

    private static void GenerateFiles(int amount)
    {
        string baseFileName = "ETP-Generated-File-";
        string fileExtension = ".csv";

        List<DummyData> dummyData = GenerateData(50);

        foreach (int value in Enumerable.Range(59304, amount))
        {
            string filePath = basePath + baseFileName + value + fileExtension;
            using (var writer = new StreamWriter(filePath))
            using (var csv = new CsvWriter(writer, CultureInfo.InvariantCulture))
            {
                csv.WriteRecords(dummyData);
                Console.Clear();
                Console.Write("Generated " + value + " files");
            }
        }
    }

    private static List<DummyData> GenerateData(int amount)
    {
        var dummyObjects = new List<DummyData>();

        foreach (int value in Enumerable.Range(1, amount))
        {
            dummyObjects.Add(new DummyData { Id = value, Name = "RandomName" + value, Hash = "ThisIsSomethingRandom" });
        }

        return dummyObjects;
    }
}

class DummyData
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Hash { get; set; }
}
