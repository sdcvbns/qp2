const scriptURL = 'رابط_السكربت_هنا';

let isAdmin = false;

function switchToAdmin() {
  isAdmin = true;
  document.body.classList.add("admin-mode");
  document.getElementById("form-section").style.display = "block";
  fetchData();
}

function switchToCustomer() {
  isAdmin = false;
  document.body.classList.remove("admin-mode");
  document.getElementById("form-section").style.display = "none";
  fetchData();
}

function fetchData() {
  fetch(scriptURL)
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector("#data-table tbody");
      tbody.innerHTML = "";
      data.forEach((row, index) => {
        if (index === 0) return; // Skip header
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${row[0]}</td>
          <td>${row[1]}</td>
          <td>${row[2]}</td>
          <td>${row[3]}</td>
          ${isAdmin ? `<td class="admin-only">
            <button onclick="editRow(${index+1}, '${row[0]}', '${row[1]}', '${row[2]}', '${row[3]}')">تعديل</button>
            <button onclick="deleteRow(${index+1})">حذف</button>
          </td>` : "<td class='admin-only'></td>"}
        `;
        tbody.appendChild(tr);
      });
    });
}

function addData() {
  const company = document.getElementById("company").value;
  const part = document.getElementById("part").value;
  const device = document.getElementById("device").value;
  const price = document.getElementById("price").value;
  fetch(scriptURL, {
    method: 'POST',
    body: new URLSearchParams({ company, part, device, price })
  }).then(() => fetchData());
}

function deleteRow(row) {
  if (!confirm("هل أنت متأكد من الحذف؟")) return;
  fetch(scriptURL, {
    method: 'POST',
    body: new URLSearchParams({ action: 'delete', row })
  }).then(() => fetchData());
}

function editRow(row, company, part, device, price) {
  const newCompany = prompt("الشركة:", company);
  const newPart = prompt("نوع القطعة:", part);
  const newDevice = prompt("الجهاز:", device);
  const newPrice = prompt("السعر:", price);
  if (newCompany && newPart && newDevice && newPrice) {
    fetch(scriptURL, {
      method: 'POST',
      body: new URLSearchParams({
        action: 'update',
        row,
        company: newCompany,
        part: newPart,
        device: newDevice,
        price: newPrice
      })
    }).then(() => fetchData());
  }
}

window.onload = switchToCustomer;