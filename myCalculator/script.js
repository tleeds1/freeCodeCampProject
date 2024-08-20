const displayScreen = document.getElementById("display");
const formulaScreen = document.querySelector(".formula-screen");

let previousResult = null;
let hasCalculated = false;

document.querySelectorAll("button").forEach(but => {
    but.addEventListener("click", function() {
        const value = but.value;

        if (hasCalculated && !["=", "AC", "DEL"].includes(value)) {
            if (!isNaN(value) || value === ".") {
                if (value === ".") {
                    if (previousResult.includes(".") || displayScreen.textContent.includes(".")) {
                    }
                } else {
                    displayScreen.textContent = value;
                    formulaScreen.textContent = value;
                    hasCalculated = false;
                }
            } else if (["+", "-", "x", "/"].includes(value)) {
                formulaScreen.textContent = previousResult + value;
                displayScreen.textContent = value;
                hasCalculated = false;
            }
        } else if (!isNaN(value) || value === ".") {
            if (displayScreen.textContent === "0" && value !== ".") {
                displayScreen.textContent = value;
                formulaScreen.textContent += value;
                hasCalculated = false;
            } else if (value === "." && !displayScreen.textContent.includes(".")) {
                displayScreen.textContent += value;
                formulaScreen.textContent += value;
                hasCalculated = false;
            } else if (value !== ".") {
                displayScreen.textContent += value;
                formulaScreen.textContent += value;
                hasCalculated = false;
            } else {

            }
        } else if (value === "AC") {
            displayScreen.textContent = "0";
            formulaScreen.textContent = "";
            previousResult = null;
            hasCalculated = false;
        } else if (value === "=") {
            try {
                const result = eval(formulaScreen.textContent.replace(/x/g, '*'));
                displayScreen.textContent = result;
                formulaScreen.textContent += "=" + result;
                previousResult = result;
                hasCalculated = true;
            } catch (error) {
                displayScreen.textContent = "Error";
            }
        } else if (value === "DEL") {
            displayScreen.textContent = displayScreen.textContent.slice(0, -1) || "0";
            formulaScreen.textContent = formulaScreen.textContent.slice(0, -1);
        } else if (["+", "-", "x", "/"].includes(value)) {
            let lastChar = formulaScreen.textContent.slice(-1);

            if (["+", "-", "x", "/"].includes(lastChar)) {
                let prevLastChar = formulaScreen.textContent.slice(-2,-1);
                if (["+", "-", "x", "/"].includes(prevLastChar)) {
                    if (value === "-") {
                        return;
                    } else {
                        formulaScreen.textContent = formulaScreen.textContent.slice(0, -2);
                        formulaScreen.textContent += value;
                        displayScreen.textContent = value;
                    }
                } else {
                    if (value === "-") {
                        formulaScreen.textContent += value;
                        displayScreen.textContent = value;
                    } else {
                        formulaScreen.textContent = formulaScreen.textContent.slice(0, -1);
                        formulaScreen.textContent += value;
                        displayScreen.textContent = value;
                    }
                }
            } else {
                displayScreen.textContent = value;
                formulaScreen.textContent += value;
                hasCalculated = false;
            }
        }
    });
});
