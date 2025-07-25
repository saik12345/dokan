import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://xzgrfpxfydnbmnxgqiki.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6Z3JmcHhmeWRuYm1ueGdxaWtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyOTA4MjYsImV4cCI6MjA2ODg2NjgyNn0.xScQIiye_zmIu5tefLNVWAJNVjX7pNBNF4wuxE-siAA";

const supabase = createClient(supabaseUrl, supabaseKey);
let options = [];
let dokanDetails = [];

//get-dokans (for show dokans page and other dropdown)

async function getAllDokans({ dokanArea = null, dno = null }) {
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

      dokanItem.innerHTML = `<div class="span-menu1">${dokan.name}</div>
      <div class="span-menu1">${dokan.mobile}</div>
      <div class="span-menu1">${dokan.email}</div>
      <div id="dokan-delete-${
        dokan.id
      }" class="dokan-delete span-menu1" style="display:flex;align-items:center">
      <span style="background-color:red;border-radius:1.8rem;text-align:center;border:2px solid black;cursor:pointer;padding:0.8rem">delete</span>
      </div>
      <div id="dokan-show-${
        dokan.id
      }" class="dokan-show span-menu1" style="display:flex;align-items:center">

      <span style="background-color:green;border-radius:1.8rem;text-align:center;border:2px solid black;cursor:pointer;padding:0.8rem">view<span/></div>
      <div class="span-menu1" id="dokan-due-${
        dokan.id
      }">${dueTotal} gm<p style='background-color:yellow;border-radius:1.5rem;font-size:small;color:black;text-align:center;margin-top:0.5rem'>${
        dueTotal < 0 ? "to pay" : "to be received"
      }</p></div>`;

      dokanArea?.append(dokanItem);
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
      },
    ])
    .select();
  console.log(error);
  console.log(data);
  goldForm.reset();
}
//get-row
function getRow(t) {
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
  return row;
}
//get-transactions

async function getTransactions(transactionArea) {
  let { data: transactions, error } = await supabase
    .from("gold")
    .select("id,shop_name,date,due,Amount,status");
  console.log(transactions);

  transactions?.map((t) => {
    const row = getRow(t);
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
  if (
    window.location.pathname == "/dokan/transaction.html" ||
    window.location.href.includes("transaction")
  ) {
    console.log("del");
    const btn = e.target;
    const id = btn.id;
    console.log(id);

    const { error } = await supabase.from("gold").delete().eq("id", id);
    console.log(error);
    document.querySelector(`button[id="${id}"]`).parentElement.remove();
  } else if (
    window.location.pathname == "/dokan/dokans.html" ||
    window.location.href.includes("dokans")
  ) {
    console.log(e);
    const div = e.target;
    const id = div.id;
    const { error } = await supabase
      .from("dokan")
      .delete()
      .eq("id", id.split("-")[2]);
    document.querySelector(`div[id="${id}"]`).parentElement.remove();
  }
}

//filter
async function filter({ dn, sd, ed, stat, transactionArea }) {
  transactionArea.innerHTML = "";
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
  transactions?.map((t) => {
    const row = getRow(t);
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
  // getTransactions();
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
      deleteRecord(e);
    }
  });
}

//---------------------------------------------------
//                  event listeners
//---------------------------------------------------
