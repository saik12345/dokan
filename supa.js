import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://xzgrfpxfydnbmnxgqiki.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6Z3JmcHhmeWRuYm1ueGdxaWtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyOTA4MjYsImV4cCI6MjA2ODg2NjgyNn0.xScQIiye_zmIu5tefLNVWAJNVjX7pNBNF4wuxE-siAA";

const supabase = createClient(supabaseUrl, supabaseKey);
let options = [];
let dokanDetails = [];

/* HTML: <div class="loader"></div> */

const loader = document.createElement("div");
loader.id = "loader";
const spinner = document.createElement("div");
spinner.className = "spinner";
loader.appendChild(spinner);

const loader1 = document.createElement("div");
loader1.id = "loader1";
const spinner1 = document.createElement("div");
spinner1.className = "spinner";
loader1.appendChild(spinner1);

const message = document.createElement("div");
message.id = "loader";

//Confirmer
function getConfirmer() {
  const confirmer = document.createElement("div");
  confirmer.id = "loader";
  const confirmMessage = document.createElement("div");
  confirmMessage.className = "confirm";
  confirmMessage.innerHTML = `<h3>Are you sure ?</h3>
<button class="cb" id="yes">yes</button><button class="cb" id="no">No</button>`;
  confirmer.append(confirmMessage);
  return confirmer;
}

//show alert
function showAlert(message, duration = 1000) {
  const alertBox = document.getElementById("custom-alert");
  alertBox.textContent = message;
  alertBox.classList.remove("hidden");
  alertBox.classList.add("show");

  setTimeout(() => {
    alertBox.classList.remove("show");
    alertBox.classList.add("hidden");
  }, duration);
}

//get-dokans (for show dokans page and other dropdown)

async function getAllDokans({ dokanArea = null, dno = null }) {
  document.body.appendChild(loader);
  const { data: dokans, error } = await supabase.from("dokan").select("*");

  console.log(dokans);
  if (window.location.href.includes("dokans")) {
    dokans?.map((dokan) => {
      dokanDetails.push({
        id: dokan.id,
        name: dokan.name,
        mobile: dokan.mobile,
        email: dokan.email,
      });
    });

    dokanDetails.forEach(async (dokan) => {
      const dokanItem = document.createElement("div");
      const dueTotal = await dokanDueTotal(dokan.name);
      const totalProfit = await dokanTotalProfit(dokan.name);

      dokanItem.style.display = "flex";
      dokanItem.style.flexWrap = "nowrap";
      dokanItem.style.padding = "0";
      dokanItem.style.gap = "0.1rem";
      dokanItem.style.width = "100vw";
      dokanItem.style.height = "4em";
      dokanItem.id = dokan.id;

      dokanItem.innerHTML = `<div class="span-menu1">${dokan.name}</div>
      <div class="span-menu1" id="dokan-due-${
        dokan.id
      }">${dueTotal} gm<p style='background-color:yellow;border-radius:1.5rem;font-size:small;color:black;text-align:center;margin-top:0.5rem;padding:0.1rem 0.5rem'>${
        dueTotal < 0 ? "to pay" : "to be received"
      }</p></div>
      <div class="span-menu1"><span style="color:green;font-weight:900">+${totalProfit} gm</span></div>
      <div  class="dokan-delete span-menu1" style="display:flex;align-items:center;justify-content:center">
      <img src="delete.png" id="dokan-delete-${
        dokan.id
      }" style="border-radius:1.8rem;text-align:center;border:2px solid black;cursor:pointer;padding:0.2rem 0.6rem;height:2rem;width:2rem" class="dokan-delete"/>
      </div>
      <div  class="dokan-show span-menu1" style="display:flex;align-items:center;justify-content:center">

      <img src="visual.png" id="dokan-show-${
        dokan.id
      }" style="border-radius:1.8rem;text-align:center;border:2px solid black;cursor:pointer;padding:0.2rem 0.6rem;height:2rem;width:2rem" class="dokan-show "/></div>
      `;

      dokanArea?.append(dokanItem);
    });
    if (dokans && dokanDetails) {
      console.log("loading finished");
      document.getElementById("loader")?.remove();
    }
  } else {
    if (dokans) {
      console.log("loading finished");
      document.getElementById("loader")?.remove();
    }
    dokans?.map((dokan) => {
      options.push(dokan.name);
    });
    console.log(options);

    options.map((x) => {
      const option = document.createElement("option");
      option.textContent = x;
      option.value = x;
      dno?.appendChild(option);
    });
  }
}

//Total Due
async function dokanDueTotal(name) {
  let total = 0;
  const { data, error } = await supabase
    .from("gold")
    .select("due")
    .eq("shop_name", name);
  data?.forEach((el) => {
    // console.log(due);
    total = total + el.due;
  });
  return total.toFixed(2);
}
//Total profit
async function dokanTotalProfit(name) {
  let total = 0;
  const { data, error } = await supabase
    .from("gold")
    .select("profit")
    .eq("shop_name", name);
  data?.forEach((el) => {
    // console.log(due);
    total = total + el.profit;
  });
  return total.toFixed(2);
}

//view individual dokan
async function viewDokan(e) {
  console.log(e);
  const el = e.target.id;
  const id = el.split("-")[2];
  window.location.href = `/dokan/dokanDetails.html?id=${id}`;
}

//add-dokans
async function addDokan(e, addDokanForm) {
  e.preventDefault();
  console.log("addDokan triggered");
  //console.log(addDokanForm);
  const dokanName = document.getElementById("new-dokan-name").value;
  if (!dokanName) {
    alert("Give a dokan name !!");
    return;
  }
  const mob = document.getElementById("mob").value;
  const eml = document.getElementById("eml").value;
  const adr = document.getElementById("adr").value;
  const { data, error } = await supabase
    .from("dokan")
    .insert([{ name: dokanName, mobile: mob, email: eml, address: adr }])
    .select();
  if (error) {
    console.log(error);
  } else {
    console.log(data);
  }

  addDokanForm?.reset();
  showAlert("✅New Dokan Added Succesfully", 700);
  setTimeout(() => {
    window.location.href = "/dokan/";
  }, 1000);
}

//calculate-due
function calculateDue(status, due, amt, formula, hidden, newFormula) {
  let dueamt;
  if (status.value === "given") {
    if (!hidden && newFormula.value > 92) {
      dueamt = Number(amt.value * newFormula.value) / 99.5;
      due.textContent = dueamt.toFixed(2);
    } else if (!hidden && newFormula.value < 92) {
      due.textContent = 0;
    } else {
      dueamt = Number((amt.value * formula.value) / 99.5);
      due.textContent = dueamt.toFixed(2);
    }
  } else {
    due.textContent = amt.value;
  }
}

//add gold-form data

async function goldFormData({
  e,
  dno,
  amt,
  status,
  frml,
  due,
  newFormula,
  hidden,
  goldForm,
}) {
  e.preventDefault();
  if (!dno.value || !amt.value) {
    alert("Please fill all fields!");
    return;
  }
  console.log(hidden, "submit form");
  if (!hidden) {
    if (
      newFormula.value == "" ||
      newFormula.value == null ||
      Number(newFormula.value) <= 92 ||
      Number(newFormula.value) == 0 ||
      isNaN(newFormula.value) == true
    ) {
      alert("Enter proper formula above 92");
      return;
    }
  }

  console.log(frml.value);
  console.log(newFormula.value);
  let profit = 0;
  if (status.value === "given") {
    if (!hidden) {
      profit = (
        ((Number(newFormula.value) - 92) / 99.5) *
        Number(amt.value)
      ).toFixed(2);
    } else {
      profit = (((Number(frml.value) - 92) / 99.5) * Number(amt.value)).toFixed(
        2
      );
    }
  }

  const { data, error } = await supabase
    .from("gold")
    .insert([
      {
        shop_name: dno.value,
        formula:
          status.value == "given"
            ? hidden
              ? frml.value
              : newFormula.value
            : 0,
        due:
          status.value == "given"
            ? Number(due.textContent)
            : -1 * Number(due.textContent),
        Amount: amt.value,
        status: status.value,
        profit: status.value == "given" ? profit : 0,
      },
    ])
    .select();
  console.log(error);
  console.log(data);
  // alert("Submitted successfully");
  goldForm.reset();
  showAlert("✅successfully submitted data", 1000);
  due.textContent = 0;
}
//get-row
function getTransactionRow(t) {
  const row = document.createElement("div");
  row.id = t.id;
  row.style.display = "flex";
  row.style.flexWrap = "nowrap";
  row.style.margin = 0;
  row.style.padding = 0;
  row.style.gap = "0.1rem";
  row.style.backgroundColor = "white";
  // row.style.height = "3.5rem";
  row.style.width = "100%";
  row.id = t.id;
  row.innerHTML = `<div class="span-menu2">${new Date(
    t.date
  ).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })}</div>
    <div class="span-menu2">${t.shop_name}</div>
    <div class="span-menu2" style="color:${
      t.status == "given" ? "green" : "red"
    }"><b>${t.Amount}</b></div>
    <div class="span-menu2"  style="color:${
      t.status == "given" ? "green" : "red"
    }"><b>${t.formula == 0 ? "" : t.formula}</b></div>
    <div class="span-menu2"  style="color:${
      t.status == "given" ? "green" : "red"
    }"><b>${t.due}</b></div>
    <div class="span-menu2">${t.profit}</div>
    <div class="span-menu2" style="display:flex;flex-wrap:nowrap;justify-content:center">
    <img src="edit.png" class="edit-btn" id="edit-dokan-${t.id}"/>
    <img src="delete.png" class="del-btn" id="del-dokan-${t.id}"/>
    </div>
     `;
  return row;
}
//get-transactions

async function getTransactions(transactionArea) {
  document.body.append(loader);
  let { data: transactions, error } = await supabase
    .from("gold")
    .select("id,shop_name,date,due,Amount,status,formula,profit");

  if (transactions) {
    document.getElementById("loader")?.remove();
  }
  console.log(transactions);
  let totalProfit = 0;
  const noData = document.createElement("div");
  noData.innerHTML = `<h2>No data Found ‼‼</h2>`;
  console.log(transactions);
  if (transactions?.length == 0) {
    transactionArea.append(noData);
  } else {
    transactions?.map((t) => {
      totalProfit = totalProfit + t.profit;
      const row = getTransactionRow(t);
      transactionArea?.append(row);
    });
  }
  document.getElementById("total-profit").innerHTML = totalProfit.toFixed(2);
}

//delete record
async function deleteRecord(e) {
  console.log("called");
  if (
    window.location.pathname == "/dokan/transaction.html" ||
    window.location.href.includes("transaction")
  ) {
    const confirmMessage = getConfirmer();
    document.body.appendChild(confirmMessage);
    document.getElementById("yes").addEventListener("click", async () => {
      console.log("del");
      const btn = e.target;
      const id = btn.id;
      console.log(id);

      const { error } = await supabase
        .from("gold")
        .delete()
        .eq("id", id.split("-")[2]);
      console.log(error);
      document.querySelector(`div[id="${id.split("-")[2]}"]`).remove();
      confirmMessage.remove();
    });
    document.getElementById("no").addEventListener("click", () => {
      confirmMessage.remove();
    });
  } else if (
    window.location.pathname == "/dokan/dokans.html" ||
    window.location.href.includes("dokans")
  ) {
    console.log(e);
    const confirmMessage = getConfirmer();
    document.body.appendChild(confirmMessage);
    document.getElementById("yes").addEventListener("click", async () => {
      const el = e.target;
      console.log(el);
      const id = el.id;
      console.log(el.id);
      const { error } = await supabase
        .from("dokan")
        .delete()
        .eq("id", id.split("-")[2]);
      document.querySelector(`div[id="${id.split("-")[2]}"]`).remove();
      confirmMessage.remove();
    });
    document.getElementById("no").addEventListener("click", () => {
      confirmMessage.remove();
    });
  }
}

//filter
async function filter({ dn, sd, ed, stat, transactionArea }) {
  const t_col = document.getElementById("transaction-column");
  transactionArea.innerHTML = "";
  transactionArea.append(t_col);
  transactionArea.append(loader1);
  console.log("filter");
  console.log(dn);
  console.log(stat);
  let query = supabase.from("gold").select("*");

  if (dn != "None") {
    query = query.eq("shop_name", dn);
  }
  if (sd.value) {
    query = query.gte("date", sd.value);
  }
  if (ed.value) {
    query = query.lte("date", ed.value);
  }
  if (stat != "None") {
    query = query.eq("status", stat);
  }
  const { data: transactions, error } = await query;
  console.log(error);
  if (transactions) document.getElementById("loader1")?.remove();
  let totalProfit = 0;
  const noData = document.createElement("div");
  noData.innerHTML = `<h2>No data Found ‼‼</h2>`;
  console.log(transactions);
  if (transactions?.length == 0) {
    transactionArea.append(noData);
  } else {
    transactions?.map((t) => {
      totalProfit = totalProfit + t.profit;
      const row = getTransactionRow(t);
      transactionArea.append(row);
    });
  }
  document.getElementById("total-profit").innerHTML = `${totalProfit.toFixed(
    2
  )}`;
  // transactionArea.append();
}

//--------------------------------------------
//                HOME PAGE
//--------------------------------------------
if (
  window.location.href.includes("index") ||
  window.location.pathname == "/dokan/" ||
  window.location.pathname == "/"
) {
  const status = document.getElementById("status");
  const formula = document.getElementById("formula");
  const dno = document.getElementById("d-n-o");

  const due = document.getElementById("due");
  due.value = 0;
  const amt = document.getElementById("amt");
  const goldForm = document.getElementById("gold-form");
  const newFormulaButton = document.getElementById("add-new-formula");
  const newFormulaSpan = document.getElementById("new-formula-span");
  const newFormula = document.getElementById("new-formula");
  let hidden = true;
  getAllDokans({ dno });
  //++++++ EVENT LISTENER ++++++++
  newFormulaButton.addEventListener("click", () => {
    if (status.value === "given") {
      if (newFormulaSpan.hasAttribute("hidden")) {
        console.log("unhidden");
        newFormulaSpan.removeAttribute("hidden");
        newFormulaButton.innerHTML = "-";
        hidden = false;
        formula.setAttribute("disabled", true);
      } else {
        console.log("hidden");
        newFormulaSpan.setAttribute("hidden", true);
        newFormulaButton.innerHTML = "+";
        hidden = true;
        formula.removeAttribute("disabled");
      }
      calculateDue(
        status,
        due,
        amt,
        formula,
        newFormulaSpan.hasAttribute("hidden"),
        newFormula
      );
    }
  });

  dno?.addEventListener("change", () => {
    console.log(dno.value);
  });

  amt?.addEventListener("input", () =>
    calculateDue(
      status,
      due,
      amt,
      formula,
      newFormulaSpan.hasAttribute("hidden"),
      newFormula
    )
  );
  formula?.addEventListener("change", () =>
    calculateDue(
      status,
      due,
      amt,
      formula,
      newFormulaSpan.hasAttribute("hidden"),
      newFormula
    )
  );
  newFormula?.addEventListener("input", () =>
    calculateDue(
      status,
      due,
      amt,
      formula,
      newFormulaSpan.hasAttribute("hidden"),
      newFormula
    )
  );
  status?.addEventListener("change", () => {
    if (status.value === "received") {
      formula.setAttribute("disabled", true);
      newFormulaSpan.setAttribute("hidden", "");
      newFormulaButton.innerHTML = "+";
    } else {
      formula.removeAttribute("disabled");
    }
    calculateDue(
      status,
      due,
      amt,
      formula,
      newFormulaSpan.hasAttribute("hidden"),
      newFormula
    );
  });
  goldForm?.addEventListener("submit", (e) =>
    goldFormData({
      e,
      dno,
      amt,
      status,
      frml: formula,
      due,
      newFormula,
      hidden: newFormulaSpan.hasAttribute("hidden"),
      goldForm,
    })
  );
}

//---------------------------------------------------
//            ADD DOKAN PAGE
//---------------------------------------------------

if (window.location.href.includes("addDokan")) {
  const addDokanForm = document.getElementById("dokan-add");
  const dokanName = document.getElementById("new-dokan-name");
  const mob = document.getElementById("mob");
  const eml = document.getElementById("eml");
  const adr = document.getElementById("adr");

  const addDokanButton = document.getElementById("add-dokan-button");
  addDokanForm?.addEventListener("submit", (e) => addDokan(e, addDokanForm));
}

//-----------------------------------------------
//                 TRANSACTION PAGE
//------------------------------------------------

if (window.location.href.includes("transaction")) {
  const transactionArea = document.getElementById("transactionArea");
  const dno = document.getElementById("d-n-o");
  const fromDate = document.getElementById("from-date");
  const toDate = document.getElementById("to-date");
  const stat = document.getElementById("status-data");
  const delbtn = document.querySelectorAll(".del-btn");

  getTransactions(transactionArea);
  getAllDokans({ dno });
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("del-btn")) {
      deleteRecord(e);
    }
  });

  dno?.addEventListener("change", () =>
    filter({
      dn: dno.value,
      sd: fromDate,
      ed: toDate,
      stat: stat.value,
      transactionArea,
    })
  );
  stat?.addEventListener("change", () =>
    filter({
      dn: dno.value,
      sd: fromDate,
      ed: toDate,
      stat: stat.value,
      transactionArea,
    })
  );
  fromDate?.addEventListener("change", () =>
    filter({
      dn: dno.value,
      sd: fromDate,
      ed: toDate,
      stat: stat.value,
      transactionArea,
    })
  );
  toDate?.addEventListener("change", () =>
    filter({
      dn: dno.value,
      sd: fromDate,
      ed: toDate,
      stat: stat.value,
      transactionArea,
    })
  );
}

//------------------------------------------------
//                 DOKANS PAGE
//-----------------------------------------------
if (window.location.href.includes("dokans")) {
  const dokanArea = document.getElementById("dokan-area");
  getAllDokans({ dokanArea });
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("dokan-delete")) {
      console.log("del");
      deleteRecord(e);
    }
  });
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("dokan-show")) {
      console.log("show");
      viewDokan(e);
    }
  });
}

//---------------------------------------------------
//                  event listeners
//---------------------------------------------------
