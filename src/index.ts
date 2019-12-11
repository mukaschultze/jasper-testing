import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";

async function generateReport(outputFile: string, jrxmlFile: string) {

    console.log("Initializing jasper");

    const j = require("node-jasper")({
        path: path.resolve("./"),
        reports: {
            stock_ofertas: {
                // jasper: path.resolve("./reports/sample.jasper"),
                jrxml: path.resolve(jrxmlFile),
                conn: "in_memory_json"
            }
        }
    });

    return new Promise((resolve, reject) => {
        j.ready(async () => {

            const report = {
                report: "stock_ofertas",
                data: {
                    language: "spanish",
                    // on jasper make a parameter named "dataset2" and use on a subreport:
                    // ((net.sf.jasperreports.engine.data.JsonDataSource)$P{dataset2})
                    dataset2: j.toJsonDataSource(
                        {
                            dados: [{ value: 1 }, { value: 2 }]
                        },
                        "dados"
                    )
                },
                dataset: [
                    {
                        name: "Gonzalo",
                        lastname: "Vinas" // TODO: check on UTF-8
                    },
                    {
                        name: "Agustin",
                        lastname: "Moyano"
                    }
                ]
            };

            try {
                console.log("Jasper ready");
                const pdf = j.pdf(report);
                await promisify(fs.writeFile)(outputFile, pdf);

                if (!pdf) {
                    console.warn("Generated empty pdf");
                }

                resolve();
            } catch (err) {
                reject(err);
            }
        });
    });

}

generateReport("output.pdf", "reports/Cherry.jrxml")
    .then(() => console.log("finished"))
    .catch((err) => console.error(err));
