import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://xzgrfpxfydnbmnxgqiki.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6Z3JmcHhmeWRuYm1ueGdxaWtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyOTA4MjYsImV4cCI6MjA2ODg2NjgyNn0.xScQIiye_zmIu5tefLNVWAJNVjX7pNBNF4wuxE-siAA";

const supabase = createClient(supabaseUrl, supabaseKey);
let options = [];
let dokanDetails = [];

//get-dokans
async function getAllDokans() {
  const { data: dokans, error } = await supabase.from("dokan").select("*");
  console.log(dokans);
  if (window.location.href.includes("dokans")) {
    dokans?.map((dokan) => {
      dokanDetails.push({
        name: dokan.name,
        mobile: dokan.mobile,
        email: dokan.email,
      });
    });

    dokanDetails.map((dokan) => {
      // display: flex; flex-wrap: nowrap; gap: 1rem
      const dokanItem = document.createElement("div");
      // div.className="span-menu";
      dokanItem.style.display = "flex";
      dokanItem.style.flexWrap = "nowrap";
      dokanItem.style.padding = "0.2rem";
      dokanItem.innerHTML = `<div class="span-menu1">${dokan.name}</div><div class="span-menu1">${dokan.mobile}</div><div class="span-menu1">${dokan.email}</div>`;

      dokanArea.append(dokanItem);
    });
  } else {
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

//add-dokans
async function addDokan(e) {
  e.preventDefault();
  console.log("addDokan triggered");
  console.log(addDokanForm);
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

  addDokanForm.reset();
}

//calculate-due
function calculateDue() {
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

async function goldFormData(e) {
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
      },
    ])
    .select();
  console.log(error);
  console.log(data);
  goldForm.reset();
}

//get-transactions

async function getTransactions() {
  let { data: transactions, error } = await supabase
    .from("gold")
    .select("id,shop_name,date,due,Amount,status");
  console.log(transactions);

  transactions?.map((t) => {
    const row = document.createElement("div");
    row.className = "";
    row.id = t.id;
    row.style.display = "flex";
    row.style.gap = "1rem";
    row.style.margin = 0;
    row.style.paddingRight = "1rem";
    row.style.backgroundColor = "black";
    row.innerHTML = `<div class="span-menu2">${t.date}</div>
    <div class="span-menu2">${t.shop_name}</div><div class="span-menu2">${t.Amount}</div>
    <div class="span-menu2">${t.due}</div><div class="span-menu2">${t.status}</div>
    <button class="del-btn" id="${t.id}" style="background-color:black;padding:0rem 0.4rem;font-size:0.8rem;">❌</button>`;
    transactionArea?.append(row);
  });
}

//get-dokan
async function getDokan() {
  let { data: dokan, error } = await supabase
    .from("dokan")
    .select("name,mobile,email");

  console.log(dokan);
}

//delete record
async function deleteRecord(e) {
  console.log("del");
  const btn = e.target;
  const id = btn.id;
  console.log(id);

  const { error } = await supabase.from("gold").delete().eq("id", id);
  console.log(error);
  document.querySelector(`button[id="${id}"]`).parentElement.remove();
}

//-----------fun calls based on path-----------------
if (window.location.href.includes("index")) {
  getAllDokans();
}
if (window.location.href.includes("transaction")) {
  getTransactions();
}
if (window.location.href.includes("dokans")) {
  getAllDokans();
}

//--------------------------------------------
//                HOME PAGE
//--------------------------------------------
const status = document.getElementById("status");
const formula = document.getElementById("formula");
const dno = document.getElementById("d-n-o");

const due = document.getElementById("due");
const amt = document.getElementById("amt");
const goldForm = document.getElementById("gold-form");

//---------------------------------------------------
//            ADD DOKAN PAGE
//---------------------------------------------------
const addDokanForm = document.getElementById("dokan-add");
const dokanName = document.getElementById("new-dokan-name");
const mob = document.getElementById("mob");
const eml = document.getElementById("eml");
const adr = document.getElementById("adr");
const addDokanButton = document.getElementById("add-dokan-button");

//-----------------------------------------------
//                 TRANSACTION PAGE
//------------------------------------------------

const transactionArea = document.getElementById("transactionArea");
const delbtn = document.querySelectorAll(".del-btn");

//------------------------------------------------
//                 DOKANS PAGE
//-----------------------------------------------

const dokanArea = document.getElementById("dokan-area");

//---------------------------------------------------
//                  event listeners
//---------------------------------------------------
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
amt?.addEventListener("input", calculateDue);
formula?.addEventListener("change", calculateDue);
status?.addEventListener("change", calculateDue);
goldForm?.addEventListener("submit", goldFormData);
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("del-btn")) {
    deleteRecord(e);
  }
});
addDokanForm?.addEventListener("submit", addDokan);
