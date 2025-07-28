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
loader1.appendChild(spinner);

//Confirmer

const confirmer = document.createElement("div");
confirmer.id = "confirmer";
confirmer.appe;

//get-dokans (for show dokans page and other dropdown)

async function getAllDokans({ dokanArea = null, dno = null }) {
  document.body.appendChild(loader);
  const { data: dokans, error } = await supabase.from("dokan").select("*");

  console.log(dokans);
  if (window.location.href.includes("dokans")) {
    // console.log("index");

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

      // div.className="span-menu";
      dokanItem.style.display = "flex";
      dokanItem.style.flexWrap = "nowrap";
      dokanItem.style.padding = "0";
      dokanItem.style.gap = "0.1rem";
      // dokanItem.style.justifyContent = "center";
      dokanItem.id = dokan.id;

      dokanItem.innerHTML = `<div class="span-menu1">${dokan.name}</div>
      <div class="span-menu1" id="dokan-due-${
        dokan.id
      }">${dueTotal} gm<p style='background-color:yellow;border-radius:1.5rem;font-size:small;color:black;text-align:center;margin-top:0.5rem;padding:0.1rem 0.5rem'>${
        dueTotal < 0 ? "to pay" : "to be received"
      }</p></div>
      <div  class="dokan-delete span-menu1" style="display:flex;align-items:center;justify-content:center">
      <span id="dokan-delete-${
        dokan.id
      }" style="background-color:red;border-radius:1.8rem;text-align:center;border:2px solid black;cursor:pointer;padding:0.2rem 0.6rem" class="dokan-delete">delete</span>
      </div>
      <div  class="dokan-show span-menu1" style="display:flex;align-items:center;justify-content:center">

      <span id="dokan-show-${
        dokan.id
      }" style="background-color:green;border-radius:1.8rem;text-align:center;border:2px solid black;cursor:pointer;padding:0.2rem 0.6rem;">view<span/></div>
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
  due;
  window.location.href = "/dokan/";
}

//calculate-due
function calculateDue(status, due, amt, formula) {
  let dueamt;
  if (status.value == "given") {
    dueamt = Number((amt.value * formula.value) / 99.5);
    due.textContent = dueamt.toFixed(2);
  } else {
    dueamt = Number(amt.value);
    due.textContent = dueamt.toFixed(2);
  }
}

//add gold-form data

async function goldFormData(e, dno, amt, status, frml, due, goldForm) {
  e.preventDefault();
  if (!dno.value || !amt.value) {
    alert("Please fill all fields!");
    return;
  }
  const { data, error } = await supabase
    .from("gold")
    .insert([
      {
        shop_name: dno.value,
        formula: status.value == "given" ? Number(formula.value) : 0,
        due:
          status.value == "given"
            ? Number(due.textContent)
            : -1 * Number(due.textContent),
        Amount: amt.value,
        status: status.value,
        profit:
          status.value == "given"
            ? (((Number(frml.value) - 92) / 99.5) * Number(amt.value)).toFixed(
                2
              )
            : 0,
      },
    ])
    .select();
  console.log(error);
  console.log(data);
  goldForm.reset();
  due.textContent = 0;
}
//get-row
function getTransactionRow(t) {
  const row = document.createElement("div");
  row.id = t.id;
  row.style.display = "flex";
  row.style.margin = 0;
  row.style.padding = 0;
  row.style.gap = "0.1rem";
  row.style.backgroundColor = "white";
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
    <div class="span-menu2"></div>
    <div class="span-menu2 del-btn"><span  class="del-btn" id="t-del-${t.id}"
     style="background-color:red;color:white;padding:0.2rem 0.4rem;font-size:0.8rem;border-radius:1.2rem;cursor:pointer">delete</span></div>`;
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

  transactions?.map((t) => {
    const row = getTransactionRow(t);
    transactionArea?.append(row);
  });
}

//delete record
async function deleteRecord(e) {
  console.log("called");
  if (
    window.location.pathname == "/dokan/transaction.html" ||
    window.location.href.includes("transaction")
  ) {
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
  } else if (
    window.location.pathname == "/dokan/dokans.html" ||
    window.location.href.includes("dokans")
  ) {
    console.log(e);
    const el = e.target;
    console.log(el);
    const id = el.id;
    console.log(el.id);
    const { error } = await supabase
      .from("dokan")
      .delete()
      .eq("id", id.split("-")[2]);
    document.querySelector(`div[id="${id.split("-")[2]}"]`).remove();
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
  const defaultQuery = `supabase.from('gold).select('*')`;
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
  console.log(query);
  const { data: transactions, error } = await query;
  console.log(transactions);
  console.log(error);
  if (transactions) document.getElementById("loader1")?.remove();
  transactions?.map((t) => {
    const row = getTransactionRow(t);
    transactionArea.append(row);
  });
  // transactionArea.append();
}

//--------------------------------------------
//                HOME PAGE
//--------------------------------------------
if (
  window.location.href.includes("index") ||
  window.location.pathname == "/dokan/"
) {
  const status = document.getElementById("status");
  const formula = document.getElementById("formula");
  const dno = document.getElementById("d-n-o");

  const due = document.getElementById("due");
  const amt = document.getElementById("amt");
  const goldForm = document.getElementById("gold-form");
  getAllDokans({ dno });
  //++++++ EVENT LISTENER +++++++++
  dno?.addEventListener("change", () => {
    console.log(dno.value);
  });
  status?.addEventListener("change", function () {
    if (this.value == "received") {
      formula.setAttribute("disabled", true);
    } else {
      formula.removeAttribute("disabled");
    }
  });
  amt?.addEventListener("input", () => calculateDue(status, due, amt, formula));
  formula?.addEventListener("change", () =>
    calculateDue(status, due, amt, formula)
  );
  status?.addEventListener("change", () =>
    calculateDue(status, due, amt, formula)
  );
  goldForm?.addEventListener("submit", (e) =>
    goldFormData(e, dno, amt, status, formula, due, goldForm)
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
}

//---------------------------------------------------
//                  event listeners
//---------------------------------------------------
