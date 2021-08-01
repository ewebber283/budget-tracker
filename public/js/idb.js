let db;

const request = indexedDB.open('budget-tracker', 1);

request.onupgradeneeded = function(event) {
    
    const db = event.target.result;
     
    db.createObjectStore('new_transaction', { autoIncrement: true });
  };


request.onsuccess = function(event) {
    
    db = event.target.result;
  
    
    if (navigator.onLine) {
      
      uploadTransaction();
    }
  };
  
  request.onerror = function(event) {
   
    console.log(event.target.errorCode);
  };


function saveRecord(record) {
    
    const transaction = db.transaction(['new_transaction'], 'readwrite');
  
    
    const transactionObjectStore = transaction.objectStore('new_transaction');
  
    
    transactionObjectStore.add(record);
  }

  getAll.onsuccess = function() {
    // if there was data in indexedDb's store, let's send it to the api server
    if (getAll.result.length > 0) {
      fetch('/api/transaction', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(serverResponse => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }
          // open one more transaction
          const transaction = db.transaction(['new_transaction'], 'readwrite');
          // access the new_pizza object store
          const transactionObjectStore = transaction.objectStore('new_transaction');
          // clear all items in your store
          transactionObjectStore.clear();

          alert('All saved transactions has been submitted!');
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  window.addEventListener('online', uploadTransaction);