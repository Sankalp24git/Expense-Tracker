let tForm = document.querySelector(".t-form");
let allInput = tForm.querySelectorAll("input");
let selectEl = tForm.querySelector("select");
let allBtn = tForm.querySelectorAll("button");
let btnClose = document.querySelector(".btn-close");
let balanceEl = document.querySelector(".balance");
let incomeEl = document.querySelector(".income");
let expenseEl = document.querySelector(".expense");
let tListEl = document.querySelector(".t-list");
let modalbtn = document.querySelector(".modal-btn");
let transaction = [];

if (localStorage.getItem("transaction") != null) {
  transaction = JSON.parse(localStorage.getItem("transaction"));
}

// console.log(transaction);

tForm.onsubmit = (e) => {
  e.preventDefault();
  let obj = {
    title: allInput[0].value,
    amount: allInput[1].value,
    transaction: selectEl.value,
    date: new Date(),
  };
  transaction.push(obj);
  // console.log(transaction);
  localStorage.setItem("transaction", JSON.stringify(transaction));
  Swal.fire({
    title: "Success",
    text: "Transaction Updated",
    icon: "success",
  });
  btnClose.click();
  tForm.reset("");
  showTransaction();
  calculation();
};

const formateDate = (d) => {
  let date = new Date(d);
  let yy = date.getFullYear();
  let mm = date.getMonth() + 1;
  let dd = date.getDate();
  let time = date.toLocaleTimeString();
  mm = mm < 10 ? "0" + mm : mm;
  dd = dd < 10 ? "0" + dd : dd;
  return `${dd}-${mm}-${yy}-${time}`;
};

const deleteFunc = () => {
  let allDelBtn = tListEl.querySelectorAll(".del-btn");
  allDelBtn.forEach((btn, index) => {
    btn.onclick = () => {
      console.log(1);
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) transaction.splice(index, 1);
        localStorage.setItem("transaction", JSON.stringify(transaction));
        showTransaction();
        calculation();
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      });
    };
  });
};

const UpdateFunc = () => {
  let allEditBtn = tListEl.querySelectorAll(".edit-btn");
  allEditBtn.forEach((btn, index) => {
    btn.onclick = () => {
      modalbtn.click();
      selectEl.value = btn.getAttribute("trans");
      allInput[0].value = btn.getAttribute("title");
      allInput[1].value = btn.getAttribute("amount");
      allBtn[0].classList.add("d-none");
      allBtn[1].classList.remove("d-none");
      allBtn[1].onclick = () => {
        let obj = {
          title: allInput[0].value,
          amount: allInput[1].value,
          transaction: selectEl.value,
          date: new Date(),
        };
        transaction[index] = obj;
        // console.log(transaction);
        localStorage.setItem("transaction", JSON.stringify(transaction));
        Swal.fire({
          title: "Success",
          text: "Transaction Updated",
          icon: "success",
        });
        btnClose.click();
        tForm.reset("");
        showTransaction();
        calculation();
        allBtn[0].classList.remove("d-none");
        allBtn[1].classList.add("d-none");
      };
    };
  });
};

const showTransaction = () => {
  tListEl.innerHTML = "";
  transaction.forEach((item, index) => {
    // console.log(item,index);
    // tListEl.innerHTML+=` <tr>
    //       <td class="text-nowrap">Course Fee</td>
    //       <td class="text-nowrap">5000</td>
    //       <td class="text-nowrap">cr</td>
    //       <td class="text-nowrap">12-08-2000</td>
    //       <td class="text-nowrap">
    //         <button class="btn edit-btn text-success">
    //           <i class="fa fa-pen"></i>
    //         </button>
    //         <button class="btn del-btn text-danger">
    //           <i class="fa fa-trash"></i>
    //         </button>
    //       </td>
    //     </tr>`
    tListEl.innerHTML += ` <tr>
              <td class="text-nowrap">${item.title}</td>
              <td class="text-nowrap">₹${item.amount}</td>
              <td class="text-nowrap">${item.transaction}</td>
              <td class="text-nowrap">${formateDate(item.date)}</td>
              <td class="text-nowrap">
                <button title="${item.title}" amount="${item.amount}" trans="${item.transaction}" class="btn edit-btn text-success">
                  <i class="fa fa-pen"></i>
                </button>
                <button class="btn del-btn text-danger">
                  <i class="fa fa-trash"></i>
                </button>
              </td>
            </tr>`;
  });
  deleteFunc();
  UpdateFunc();
};

showTransaction();

const calculation = () => {
  let totalCr = 0;
  let totalDr = 0;
  let filterCr = transaction.filter((item) => item.transaction == "cr");
  for (let obj of filterCr) {
    totalCr += Number(obj.amount);
    // totalCr+=+obj.amount;
    // totalCr+=parseInt(obj.amount);
  }
  let filterDr = transaction.filter((item) => item.transaction == "dr");
  filterDr.forEach((obj) => {
    totalDr += Number(obj.amount);
  });

  // console.log(totalCr,totalDr);
  incomeEl.innerText = `₹${totalCr}`;
  expenseEl.innerText = `₹${totalDr}`;
  Number(totalCr - totalDr) < 0
    ? (balanceEl.style.color = "red")
    : (balanceEl.style.color = "green");
  balanceEl.innerText = `₹${Number(totalCr - totalDr)}`;
};

calculation();
