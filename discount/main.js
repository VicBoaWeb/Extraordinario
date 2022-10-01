const $ = (element) => document.querySelector(element);
let listQuote = [];
let orders = [];

// Selectors
const formData = $("form");
const tableData = $("table");
const tableBody = $("tbody");
const tableBodyOrders = $("#tableBodyOrders");
const errorElement = $("#showMessage");
const clientElement = $("#client");
const btnOrders = $("#btnOrders");
const tableOrder = $("#tableOrder");


btnOrders.addEventListener("click", () => {
  const totalSummary = listQuote.reduce(
    (previousValue, currentValue) => previousValue + currentValue.total,
    0
  );
  const totalQty =  listQuote.reduce(
    (previousValue, currentValue) => previousValue + currentValue.quantity,
    0
  );

  const name = listQuote[listQuote.length - 1].client

  orders.push({
    name,
    totalQty,
    totalSummary, 
    status: false
  });

  setTableOrders(orders);
  clientElement.value = '';
  listQuote = [];
  
})

// Cotization Method Save
formData.addEventListener("submit", (event) => {
  event.preventDefault();
  const { productId, description, quantity, price, client } =
    Object.fromEntries(new FormData(event.target));

  validateForm(productId, description, quantity, price, client)
    ? createCotization(productId, description, quantity, price, client)
    : showErrorMessage("Todos los campos son obligatorios");
});

// Validate null values
const validateForm = (productId, description, quantity, price, client) => {
  return (
    productId !== "" &&
    description !== "" &&
    quantity !== "" &&
    price !== "" &&
    client !== ""
  );
};

// Create cotization
const createCotization = (productId, description, quantity, price, client) => {
  const discount = calculateDiscount(quantity, price);
  const newPrice = (price * (100 - discount)) / 100;
  const total = (newPrice * quantity).toFixed(2);

  listQuote.push({
    client,
    productId,
    description,
    quantity: Number(quantity),
    price: Number(price).toFixed(2),
    discount,
    total: Number(total),
  });

  formData.reset();
  clientElement.value = client;
  setTable(listQuote);
};

// calculate discount
const calculateDiscount = (quantity, price) => {
  let discount = 0;
  if (quantity >= 10 && price * quantity >= 500) {
    return (discount = 5);
  } else if (quantity >= 6 && quantity < 10 && price * quantity >= 200) {
    return (discount = 4);
  } else if (quantity >= 3 && quantity < 6 && price * quantity >= 100) {
    return (discount = 3);
  } else {
    return discount;
  }
};
// sumTotal
const sumTotal = (listQuote) => {
  const totalSummary = listQuote.reduce(
    (previousValue, currentValue) => previousValue + currentValue.total,
    0
  );
  return {
    totalSummary: totalSummary.toFixed(2),
  };
};

const deleteQuote = (productId) => {
  const newListQuote = listQuote.filter((item) => item.productId !== productId);
  listQuote = newListQuote;
  setTable(listQuote);
};

// interaction with html
// show error message
const showErrorMessage = (message) => {
  errorElement.classList.remove("d-none");
  errorElement.classList.add("d-block");
  errorElement.innerText = message;
  setTimeout(() => {
    errorElement.classList.remove("d-block");
    errorElement.classList.add("d-none");
  }, 5000);
};

// Set Table
const setTable = (listQuote) => {
  console.table(listQuote);
  let dataBody = "";

  if (listQuote.length > 0) {
    listQuote.map(
      ({ productId, description, quantity, price, discount, total }, i) => {
        dataBody += `
        <tr key='${i + 1}'>
          <td>${productId}</td>
          <td>${description}</td>
          <td>${quantity}</td>
          <td>${price}</td>
          <td>${discount}%</td>
          <td>${total}</td>
          <td>
            <button type="button" class="btn btn-danger" onclick="deleteQuote('${productId}')">
              <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          </td>
    
        </tr>
      `;
      }
    );

    const { totalSummary } = sumTotal(listQuote);

    const totalData = `
      <tr>
        <td colspan="5"></td>
        <td>Total ${totalSummary}</td>
      </tr>
    `;

    tableBody.innerHTML = dataBody + totalData;
  } else {
    tableBody.innerHTML = "";
  }
};

const setTableOrders = (orders) => {
  console.table(orders);
  let dataBody = "";

  if (orders.length > 0) {
    orders.map(
      ({ name, totalQty, totalSummary, status }, i) => {
        dataBody += `
        <tr key='${i + 1}'>
          <td>${name}</td>
          <td>${totalQty}</td>
          <td>${totalSummary}</td>
          <td>${status}</td>
        </tr>
      `;
      }
    );


    tableBody.innerHTML = '';
    tableBodyOrders.innerHTML = dataBody;
  } else {
    tableBodyOrders.innerHTML = "";
  }
};
