//Elements Html
//form inputs
const input_Name = document.getElementById("name");
const input_mensalDeposit = document.getElementById("mensalDeposit");
const input_interestRate = document.getElementById("interestRate");
const select_period = document.getElementById("period");

// buttons interactions
const calcBtn = document.getElementById("calc-btn");
const clearBtn = document.getElementById("clear-btn");
const backBtn = document.getElementById("back-btn");

//containers
const calcContainer = document.querySelector("#calc-container");
const resultContainer = document.querySelector("#result-container");

//elements to show results
const feesName = document.querySelector("#fees-name span");
const feesMensalDeposit = document.querySelector("#fees-mensalDeposit span");
const feesInterestRate = document.querySelector("#fees-interestRate span");
const feesPeriod = document.querySelector("#fees-period span");
const finalResult = document.querySelector("#fees-finalResult span");
//Constantes
let nameForm = "";
let mensalDeposit = 0;
let interestRate = 0;
let period = 0;
let result = 0;

//Functions
function showOrHideResults() {
  calcContainer.classList.toggle("hide");
  resultContainer.classList.toggle("hide");
}

function clearInput() {
  input_Name.value = "";
  input_mensalDeposit.value = "";
  input_interestRate.value = "";
  select_period.value = "";
  select_period.options = "";

  feesName.innerHTML = "";
  feesMensalDeposit.innerHTML = "";
  feesInterestRate.innerHTML = "";
  feesPeriod.innerHTML = "";
  finalResult.innerHTML = "";
}

function createElementsResult() {
  feesName.innerHTML += nameForm;
  feesMensalDeposit.innerHTML += mensalDeposit;
  feesInterestRate.innerHTML += interestRate;
  feesPeriod.innerHTML += period;
  finalResult.innerHTML += result;
}

function validNumerics(text) {
  return text.replace(/[^0-9.]/g, "");
}

function validNames(text) {
  return text.replace(/[^A-Za-zÀ-ÖØ-öø-ÿÇç ]+$/u, "");
}

function makeExpression() {
  let expression = {
    expr: `${mensalDeposit} * (((1 + ${interestRate / 100})^${period * 12}-1)/${
      interestRate / 100
    })`,
  };
  return expression;
}

async function apiFetch() {
  try {
    const apiMathJs = "http://api.mathjs.org/v4/";
    const data = makeExpression();

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(apiMathJs, options);

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const responseData = await response.json();

    result = Math.round(responseData.result *100)/100;

  } catch (error) {
    console.error("Ocorreu um erro:", error);
  }
}

//Listeners in buttons
calcBtn.addEventListener("click", async (evt) => {
  evt.preventDefault();

  nameForm = input_Name.value;
  mensalDeposit = input_mensalDeposit.value;
  interestRate = input_interestRate.value;
  period = select_period.value;
  period = period;

  if (
    nameForm == "" ||
    mensalDeposit == "" ||
    interestRate == "" ||
    period == ""
  ) {
    alert("Preencha todos os campos!");
  } else {
    await apiFetch();
    createElementsResult();
    showOrHideResults();
  }
});

clearBtn.addEventListener("click", (evt) => {
  evt.preventDefault();
  clearInput();
});

backBtn.addEventListener("click", (evt) => {
  clearInput();
  showOrHideResults();
});

/*Input´s validations*/
input_Name.addEventListener("input", (e) => {
  const updateValue = validNames(e.target.value);
  e.target.value = updateValue;
});

input_mensalDeposit.addEventListener("input", (e) => {
  const updateValue = validNumerics(e.target.value);
  e.target.value = updateValue;
});

input_interestRate.addEventListener("input", (e) => {
  const updateValue = validNumerics(e.target.value);
  e.target.value = updateValue;
});

select_period.addEventListener("change", function () {
  const selectedOption = select_period.options[select_period.selectedIndex];
});

/** TO DO
 * [OK] Validar digitação em cada input
 * [OK] Trocar o campo perídodo
 * [OK] Criar a função que irá montar a expressão matemática ex: {"expr": "20 * (((1 + 3.80) ^ 24 - 1) / 3.80)"}
 * Criar função que irá utilizar o fetch API para consumir os dados da api MathJS http://api.mathjs.org/v4/ com o JSON body acima
   e preencher a variavel result
 * Subir o projeto no gitHub e GitHubpages
 */
