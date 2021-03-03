let data;

const request = indexedDB.open("budgettrack", 1);

request.onupgradeneeded = function(event) {
  const data = event.target.result;
  data.createObjectStore("pending", { autoIncrement: true });
};

request.onsuccess = function(event) {
  data = event.target.result;

  if (navigator.onLine) {
    checkDB();
  }
};

//informs of error

request.onerror = function(event) {
  console.log("Woops! " + event.target.errorCode);
};

function saveRecord(record) {
  const transaction = data.transaction(["pending"], "readwrite");
  const store = transaction.objectStore("pending");

  store.add(record);
}


function checkdata() {
  const transaction = data.transaction(["pending"], "readwrite");
  const store = transaction.objectStore("pending");
  const getAll = store.getAll();

  getAll.onsuccess = function() {
    console.log(getAll.result)
    if (getAll.result.length > 0) {
        console.log(getAll.result)
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
      .then(response => response.json())
        .then(() => {
       
          const transaction = data.transaction(["pending"], "readwrite");
          const store = transaction.objectStore("pending");
          store.clear();
        });
    }
  };
}

// for when app returns to being online

window.addEventListener("online", checkDatabase);

