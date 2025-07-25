import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://xzgrfpxfydnbmnxgqiki.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6Z3JmcHhmeWRuYm1ueGdxaWtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyOTA4MjYsImV4cCI6MjA2ODg2NjgyNn0.xScQIiye_zmIu5tefLNVWAJNVjX7pNBNF4wuxE-siAA";

const supabase = createClient(supabaseUrl, supabaseKey);
let options = [];

//get-dokans
async function getAllDokans() {
  const { data: dokans, error } = await supabase.from("dokan").select("name");
  console.log(dokans);
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
getAllDokans();

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

//index page
const status = document.getElementById("status");
const formula = document.getElementById("formula");
const dno = document.getElementById("d-n-o");
const due = document.getElementById("due");
const amt = document.getElementById("amt");
const goldForm = document.getElementById("gold-form");

//event listeners
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

// for add dokan
const addDokanForm = document.getElementById("dokan-add");

const dokanName = document.getElementById("new-dokan-name");
const mob = document.getElementById("mob");
const eml = document.getElementById("eml");
const adr = document.getElementById("adr");
const addDokanButton = document.getElementById("add-dokan-button");
addDokanForm?.addEventListener("submit", addDokan);
