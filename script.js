// ============================================================
// CREDITGUARD - FRONTEND JAVASCRIPT
// ============================================================


// ------------------------------------------------------------
// GET HTML ELEMENTS
// ------------------------------------------------------------

const predictButton = document.getElementById("predictButton");

const resultBox = document.getElementById("result");
const predictionText = document.getElementById("prediction");
const probabilityText = document.getElementById("probability");


// ============================================================
// SAMPLE TRANSACTION
// ============================================================

const sampleTransaction = {

    Time: 406,

    V1: -2.31,
    V2: 1.95,
    V3: -1.60,
    V4: 3.99,
    V5: -0.52,
    V6: -1.42,
    V7: -2.53,
    V8: 1.39,
    V9: -2.77,
    V10: -2.77,

    V11: 3.20,
    V12: -2.89,
    V13: -0.59,
    V14: -4.28,
    V15: 0.38,
    V16: -1.14,
    V17: -2.83,
    V18: -0.06,
    V19: 0,
    V20: 0,

    V21: 0,
    V22: 0,
    V23: 0,
    V24: 0,
    V25: 0,
    V26: 0,
    V27: 0,
    V28: 0,

    Amount: 0
};


// ============================================================
// FILL SAMPLE VALUES AUTOMATICALLY
// ============================================================

window.addEventListener("load", function () {

    Object.keys(sampleTransaction).forEach(function (key) {

        const input = document.getElementById(key);

        if (input) {
            input.value = sampleTransaction[key];
        }

    });

});


// ============================================================
// FRAUD DETECTION
// ============================================================

predictButton.addEventListener("click", async function () {

    const transaction = {

        Time: Number(document.getElementById("Time").value),

        V1: Number(document.getElementById("V1").value),
        V2: Number(document.getElementById("V2").value),
        V3: Number(document.getElementById("V3").value),
        V4: Number(document.getElementById("V4").value),
        V5: Number(document.getElementById("V5").value),
        V6: Number(document.getElementById("V6").value),
        V7: Number(document.getElementById("V7").value),
        V8: Number(document.getElementById("V8").value),
        V9: Number(document.getElementById("V9").value),
        V10: Number(document.getElementById("V10").value),

        V11: Number(document.getElementById("V11").value),
        V12: Number(document.getElementById("V12").value),
        V13: Number(document.getElementById("V13").value),
        V14: Number(document.getElementById("V14").value),
        V15: Number(document.getElementById("V15").value),
        V16: Number(document.getElementById("V16").value),
        V17: Number(document.getElementById("V17").value),
        V18: Number(document.getElementById("V18").value),
        V19: Number(document.getElementById("V19").value),
        V20: Number(document.getElementById("V20").value),

        V21: Number(document.getElementById("V21").value),
        V22: Number(document.getElementById("V22").value),
        V23: Number(document.getElementById("V23").value),
        V24: Number(document.getElementById("V24").value),
        V25: Number(document.getElementById("V25").value),
        V26: Number(document.getElementById("V26").value),
        V27: Number(document.getElementById("V27").value),
        V28: Number(document.getElementById("V28").value),

        Amount: Number(document.getElementById("Amount").value)
    };


    predictButton.disabled = true;
    predictButton.textContent = "Analyzing...";


    try {

        const response = await fetch(
            "http://127.0.0.1:8000/predict",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(transaction)
            }
        );


        if (!response.ok) {
            throw new Error("Backend request failed");
        }


        const data = await response.json();


        resultBox.classList.remove("hidden");

        predictionText.textContent = data.prediction;

        probabilityText.textContent =
            "Fraud Probability: " +
            (data.fraud_probability * 100).toFixed(2) +
            "%";


    } catch (error) {

        resultBox.classList.remove("hidden");

        predictionText.textContent = "Error";

        probabilityText.textContent =
            "Could not connect to the backend. Make sure FastAPI is running.";

        console.error(error);

    }


    predictButton.disabled = false;
    predictButton.textContent = "Analyze Transaction";

});


// ============================================================
// DATASET OVERVIEW
// ============================================================

const totalTransactions = 284807;

const normalTransactions = 284315;

const fraudTransactions = 492;


// ============================================================
// CLASS DISTRIBUTION CHART
// ============================================================

const classChartElement =
    document.getElementById("classChart");


if (classChartElement) {

    new Chart(classChartElement, {

        type: "doughnut",

        data: {

            labels: [
                "Normal Transactions",
                "Fraud Transactions"
            ],

            datasets: [

                {
                    data: [
                        normalTransactions,
                        fraudTransactions
                    ]
                }

            ]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {
                    position: "bottom"
                },

                tooltip: {

                    callbacks: {

                        label: function (context) {

                            const value = context.raw;

                            const percentage =
                                ((value / totalTransactions) * 100)
                                .toFixed(3);

                            return (
                                context.label +
                                ": " +
                                value.toLocaleString() +
                                " (" +
                                percentage +
                                "%)"
                            );

                        }

                    }

                }

            }

        }

    });

}


// ============================================================
// AMOUNT DISTRIBUTION
// ============================================================

// The uploaded training notebook confirms that Amount is one
// of the dataset columns, but it does not contain the actual
// histogram/bin values needed to recreate an Amount histogram
// inside the webpage.
//
// Therefore we show a useful EDA summary instead of inventing
// Amount values.

const amountChartElement =
    document.getElementById("amountChart");


if (amountChartElement) {

    new Chart(amountChartElement, {

        type: "bar",

        data: {

            labels: [
                "Normal",
                "Fraud"
            ],

            datasets: [

                {
                    label: "Number of Transactions",

                    data: [
                        normalTransactions,
                        fraudTransactions
                    ]
                }

            ]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {
                    display: false
                }

            },

            scales: {

                y: {

                    beginAtZero: true,

                    ticks: {

                        callback: function (value) {

                            return value.toLocaleString();

                        }

                    }

                }

            }

        }

    });

}


// ============================================================
// MODEL PERFORMANCE
// ============================================================

// REAL RANDOM FOREST RESULTS FROM YOUR TRAINING

const precision = 0.9358974358974359;

const recall = 0.7448979591836735;

const f1Score = 0.8295454545454546;

const averagePrecision = 0.872282937538452;


// ------------------------------------------------------------
// DISPLAY METRICS
// ------------------------------------------------------------

const precisionMetric =
    document.getElementById("precisionMetric");

const recallMetric =
    document.getElementById("recallMetric");

const f1Metric =
    document.getElementById("f1Metric");

const apMetric =
    document.getElementById("apMetric");


if (precisionMetric) {

    precisionMetric.textContent =
        (precision * 100).toFixed(2) + "%";

}


if (recallMetric) {

    recallMetric.textContent =
        (recall * 100).toFixed(2) + "%";

}


if (f1Metric) {

    f1Metric.textContent =
        (f1Score * 100).toFixed(2) + "%";

}


if (apMetric) {

    apMetric.textContent =
        (averagePrecision * 100).toFixed(2) + "%";

}


// ============================================================
// MODEL PERFORMANCE CHART
// ============================================================

// The notebook contains the final PR-AUC value for the
// Random Forest, but the individual precision/recall curve
// arrays are not stored in the uploaded file.
//
// So we display the REAL evaluation metrics here rather than
// creating a fake Precision-Recall curve.

const prChartElement =
    document.getElementById("prChart");


if (prChartElement) {

    new Chart(prChartElement, {

        type: "bar",

        data: {

            labels: [
                "Precision",
                "Recall",
                "F1 Score",
                "Average Precision"
            ],

            datasets: [

                {
                    label: "Random Forest",

                    data: [
                        precision,
                        recall,
                        f1Score,
                        averagePrecision
                    ]
                }

            ]

        },

        options: {

            responsive: true,

            scales: {

                y: {

                    beginAtZero: true,

                    max: 1,

                    ticks: {

                        callback: function (value) {

                            return (value * 100) + "%";

                        }

                    }

                }

            },

            plugins: {

                legend: {
                    position: "bottom"
                },

                tooltip: {

                    callbacks: {

                        label: function (context) {

                            return (
                                "Score: " +
                                (context.raw * 100).toFixed(2) +
                                "%"
                            );

                        }

                    }

                }

            }

        }

    });

}
