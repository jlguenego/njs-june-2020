let selectedRowCounter = 0;

function select(e) {
  console.log("select", e);
  if (e.classList.contains("selected")) {
    e.classList.remove("selected");
    selectedRowCounter--;
  } else {
    e.classList.add("selected");
    selectedRowCounter++;
  }
  console.log("selectedRowCounter: ", selectedRowCounter);

  // decide if we need to display suppress button
  const button = document.querySelector("button.button-delete");
  console.log("button: ", button);
  if (selectedRowCounter === 0) {
    button.classList.add("jlg-hidden");
  } else {
    button.classList.remove("jlg-hidden");
  }
}

function remove() {
  console.log("remove");
  const rows = document.querySelectorAll("tr.selected");
  console.log("rows: ", rows);
  const ids = [];
  rows.forEach((row) => {
    row.classList.remove("selected");
    const id = row.classList.value;
    console.log("id: ", id);
    ids.push(id);
  });
  console.log("ids: ", ids);

  const options = {
    method: "DELETE",
    body: ids,
  };

  fetch("/webservices/bulk/articles", options)
    .then((response) => {
      console.log("response: ", response);
    })
    .catch((error) => {
      console.log("error: ", error);
    });
}
