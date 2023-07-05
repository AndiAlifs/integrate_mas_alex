const API_HOST = "http://127.0.0.1:5000/api"

function dragStart(event){
    event.dataTransfer.setData("todo", event.target.id)
}

function drop(event){
    event.preventDefault();
    const data = event.dataTransfer.getData("todo")
    event.target.appendChild(document.getElementById(data))
    const dataId = event.srcElement.lastChild.id
    checkStatus(dataId)
}

function allowDrop(event){
    event.preventDefault();
}

function updateStatus(id, status){
    const xhr = new XMLHttpRequest()
    const url = API_HOST + '/tasks/status' + id
    const data = JSON.stringify({
        status: !status
    })

    xhr.open('PUT', url, true)
    xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8')
    xhr.setRequestHeader("Authorization", `Bearer ${localStorage.getItem('access_token')}`)
    xhr.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            location.reload()
        }
    }
    xhr.send(data)
}

function checkStatus(id){
    const xhr = new XMLHttpRequest
    const url = API_HOST + '/tasks/' + id

    xhr.open('GET', url, true)
    xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('access_token')}`)
    xhr.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            const response = JSON.parse(this.response)

            updateStatus(id, response.data.status)
        }
    }
    return xhr.send()
}

// get all task
const todoItem = document.getElementById("todo-item")
const doneItem = document.getElementById("done")

window.onload = function(e){
    const token = localStorage.getItem('access_token')
    if(!token){
        window.location.href = "http://127.0.0.1:5000/auth/login"
    }
    const xhr = new XMLHttpRequest();
    const url = API_HOST +"/tasks"

    xhr.open("GET", url, true)
    xhr.setRequestHeader("Authorization", `Bearer ${token}`)
    xhr.onreadystatechange = function(){
        if(this.readyState == 4 & this.status == 200){
            const tasks = JSON.parse(this.response)
            tasks['data'].forEach((task) => {
                const article = document.createElement("article")
                const badgeDelete = document.createElement('button')
                const badgeEdit = document.createElement('button')
                const h4 = document.createElement('h4')
                const p = document.createElement('p')

                h4.appendChild(document.createTextNode(task.title))
                h4.setAttribute('id', task.id)
                p.appendChild(document.createTextNode(task.description))

                article.setAttribute('class', 'border p-3 drag')
                article.setAttribute('ondragstart', "drag(event)")
                article.setAttribute("draggable", "true")
                article.setAttribute("id", task.id)

                badgeDelete.setAttribute('class', 'badge bg-danger')
                badgeDelete.setAttribute("href", "#")
                badgeDelete.setAttribute("data-id", task.id)
                badgeDelete.setAttribute("data-bs-toggle", "modal")
                badgeDelete.setAttribute("data-bs-target", "#modalDelete")
                
                badgeDelete.appendChild(document.createTextNode("Delete"))

                badgeEdit.setAttribute('class', 'badge bg-info')
                badgeEdit.setAttribute("href", "#")
                badgeEdit.setAttribute("data-title", task.title)
                badgeEdit.setAttribute('data-description', task.description)
                badgeEdit.setAttribute("data-id", task.id)
                badgeEdit.setAttribute("data-bs-toggle", "modal")
                badgeEdit.setAttribute("data-bs-target", "#modalEdit")
            
                badgeEdit.appendChild(document.createTextNode("Edit"))
            
                article.appendChild(h4)
                article.appendChild(p)
                article.appendChild(badgeDelete)
                article.appendChild(badgeEdit)

                if(task.status == true){
                    article.setAttribute('style', 'text-decoration:line-through')
                    doneItem.appendChild(article)
                } else{
                    todoItem.appendChild(article)
                }
            })
        }
    }
    xhr.send()
}


const addForm = document.getElementById("form-add");
addForm.addEventListener("submit", function (event) {
  event.preventDefault();
  let xhr = new XMLHttpRequest();
  let url = API_HOST + "/tasks";
  //seleksi nilai dari input title dan description
  let title = document.getElementById("title").value;
  let description = document.getElementById("description").value;

  //konfigurasi toast
  const toastLiveExample = document.getElementById("liveToastAdd");
  const toastMsgAdd = document.getElementById("toast-body-add");
  const toast = new bootstrap.Toast(toastLiveExample);
  //validasi input
  if (title == "") {
    toastMsgAdd.innerHTML = "Isian title tidak boleh kosong";
    toast.show();
  }
  if (description == "") {
    toastMsgAdd.innerHTML = "Isian deskripsi tidak boleh kosong";
    toast.show();
  }
  let new_data = JSON.stringify({
    title: title,
    description: description,
  });

  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
  xhr.setRequestHeader(
    "Authorization",
    `Bearer ${localStorage.getItem("access_token")}`
  );
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      //close the modal after adding data
      const myModalAdd = bootstrap.Modal.getInstance("#modalAdd");
      myModalAdd.hide();

      //reset form
      addForm.reset();
      //refresh page
      location.reload();
    } else {
      //konfigurasi toast berhasil
      const toastLive = document.getElementById("liveToastAdd");
      const toastMsg = document.getElementById("toast-body-add");
      const toast = new bootstrap.Toast(toastLive);
      toastMsg.innerHTML = "Data berhasil";
      toast.show();
    }
  };
  xhr.send(new_data);
});

const myModalEdit = document.getElementById("modalEdit");
// ketika modal edit muncul jalankan fungsi berikut
myModalEdit.addEventListener("show.bs.modal", function (event) {
  //mendapatkan id dari item
  let dataId = event.relatedTarget.attributes["data-id"];
  // console.log(dataId.value)
  //get data with specific id
  let xhr = new XMLHttpRequest();
  let url = API_HOST + "/tasks/" + dataId.value;

  xhr.open("GET", url, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
  xhr.setRequestHeader(
    "Authorization",
    `Bearer ${localStorage.getItem("access_token")}`
  );
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let data = JSON.parse(this.response);
      let oldTitle = document.getElementById("edit-title");
      let oldDescription = document.getElementById("edit-description");
      oldTitle.value = data.data.title;
      oldDescription.value = data.data.description;
      //close the modal after adding data
    }
  };
  xhr.send();
  // let btnEdit = document.getElementById('btn-edit')
  let editForm = document.getElementById("form-edit");
  editForm.addEventListener("submit", function (event) {
    event.preventDefault();
    let xhr = new XMLHttpRequest();
    let url = API_HOST + "/tasks/" + dataId.value;

    let newTitle = document.getElementById("edit-title").value;
    let newDescription = document.getElementById("edit-description").value;
    //konfigurasi toast
    //konfigurasi toast
    const toastLiveExample = document.getElementById("liveToastEdit");
    const toastMsgEdit = document.getElementById("toast-body-edit");
    const toast = new bootstrap.Toast(toastLiveExample);
    //validasi input
    if (newTitle == "") {
      toastMsgEdit.innerHTML = "isian title tidak boleh kosong";
      toast.show();
    }
    if (newDescription == "") {
      toastMsgEdit.innerHTML = "isian description tidak boleh kosong";
      toast.show();
    }

    let data = JSON.stringify({
      title: newTitle,
      description: newDescription,
    });
    xhr.open("PUT", url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
    xhr.setRequestHeader(
      "Authorization",
      `Bearer ${localStorage.getItem("access_token")}`
    );
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        //close the modal after edit data
        const myModalEdit = bootstrap.Modal.getInstance("#modalEdit");
        myModalEdit.hide();
        //reset form and reload page
        editForm.reset();
        location.reload();
      }
    };
    xhr.send(data);
  });
});


const myModalDelete = document.getElementById("modalDelete");
//berikan event ketika modal delete muncul
myModalDelete.addEventListener("show.bs.modal", function (event) {
  //mendeteksi elemen yang diklik user
  let dataId = event.relatedTarget.attributes["data-id"];
  const deleteForm = document.getElementById("formDelete");
  //ketika tombol delte diklik jalankan fungsi hapus
  deleteForm.addEventListener("submit", function (event) {
    event.preventDefault();
    let xhr = new XMLHttpRequest();
    let url = API_HOST + "/tasks/" + dataId.value;

    xhr.open("DELETE", url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
    xhr.setRequestHeader(
      "Authorization",
      `Bearer ${localStorage.getItem("access_token")}`
    );
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let response = JSON.parse(this.response);

        const myModalDelete = bootstrap.Modal.getInstance("modalDelete");
        myModalDelete.hide();

        const alertLoc = document.getElementById("alert-loc");
        const alertEl = document.createElement("div");
        alertEl.setAttribute("class", "alert alert-success");
        alertEl.setAttribute("role", "alert");
        alertEl.innerHTML = response.message;

        alertLoc.append(alertEl);

        document.getElementById(dataId.value).classList.add("d-none");
      }
    };
    xhr.send();
    //close modal
    // const myModalDelete = bootstrap.Modal.getInstance("#myModalDelete");
    // myModalDelete.hide();
  });
});









// const todo = document.getElementById("todo-item")
// window.onload = function(){
//     //AJAX
//     const xhr = new XMLHttpRequest();
//     const url = "data/data-todo.json"

//     xhr.onreadystatechange = function (){
//         if (this.readyState == 4 && this.status == 200){
//         //cek data ada di local atau ga
//             let data = JSON.parse(localStorage.getItem("data"));

//             if(!data){
//                 localStorage.setItem("data", this.response);
//                 //save data ke storage kalau belum ada
//                 data = JSON.parse(localStorage.getItem("data"))
//             }

//         // render ke html
//             for(let i = 0; i <data.length; i++){
//                 const card = document.createElement("div");
//                 const article = document.createElement("article");
//                 const h3 = document.createElement("h3");
//                 const p = document.createElement("p")

//                 const btnWrapper = document.createElement("div")
//                 const btnDelete = document.createElement("button")
//                 const btnEdit = document.createElement("button")
//                 const btnDone = document.createElement("button")

//                 card.setAttribute("class", "card p-4 mx-2 my-2");
//                 card.setAttribute("draggable", "true");
//                 card.setAttribute("id", data[i].id);
//                 card.setAttribute("ondragstart", "dragStart(event)");

//                 h3.appendChild(document.createTextNode(data[i].title));
//                 p.appendChild(document.createTextNode(data[i].desc));

//                 article.appendChild(h3);
//                 article.appendChild(p);

//                 btnWrapper.setAttribute("class", "d-flex flex-row gap-4")

//                 btnDelete.setAttribute("type", "button")
//                 btnDelete.setAttribute("data-bs-toggle", "modal");
//                 btnDelete.setAttribute("data-bs-target", "#modalDelete")
//                 btnDelete.setAttribute("class", "btn btn-danger")
//                 btnDelete.setAttribute("data-id", data[i].id)
//                 btnDelete.appendChild(document.createTextNode("Delete"))

//                 btnEdit.setAttribute("type", "button")
//                 btnEdit.setAttribute("data-bs-toggle", "modal");
//                 btnEdit.setAttribute("data-bs-target", "#modalEdit")
//                 btnEdit.setAttribute("data-title", data[i].title)
//                 btnEdit.setAttribute("data-description", data[i].desc)
//                 btnEdit.setAttribute("class", "btn btn-primary")
//                 btnEdit.setAttribute("data-id", "edit-" + data[i].id)
//                 btnEdit.appendChild(document.createTextNode("Edit"))

//                 btnDone.setAttribute("type", "button")
//                 btnDone.setAttribute("data-bs-toggle", "modal");
//                 btnDone.setAttribute("data-bs-target", "#modalDone")
//                 btnDone.setAttribute("class", "btn btn-success")
//                 btnDone.setAttribute("data-id", "done-" + data[i].id)
//                 btnDone.appendChild(document.createTextNode("Done"))


//                 btnWrapper.appendChild(btnEdit)
//                 btnWrapper.appendChild(btnDelete)
//                 btnWrapper.appendChild(btnDone)

//                 card.appendChild(article)
//                 card.appendChild(btnWrapper)

//                 todo.appendChild(card)
//             }
//         }
//     };
//     xhr.open("GET", url, true)
//     xhr.send()
// };

// const addForm = document.getElementById("form-add")
// addForm.addEventListener("submit", (event) =>{
//     event.preventDefault();

//     const title = document.getElementById('judulAdd').value;
//     const description = document.getElementById('descAdd').value;

//     if(title && description){
//         const card = document.createElement("div");
//         const article = document.createElement("article");
//         const h3 = document.createElement("h3");
//         const p = document.createElement("p")

//         const btnWrapper = document.createElement("div")
//         const btnDelete = document.createElement("button")
//         const btnEdit = document.createElement("button")
//         const btnDone = document.createElement("button")

//         card.setAttribute("class", "card p-4 mx-2 my-2");
//         card.setAttribute("draggable", "true");
//         card.setAttribute("id", title + description);
//         card.setAttribute("ondragstart", "dragStart(event)");

//         h3.appendChild(document.createTextNode(title));
//         p.appendChild(document.createTextNode(description));

//         article.appendChild(h3);
//         article.appendChild(p);

//         btnWrapper.setAttribute("class", "d-flex flex-row gap-4")

//         btnDelete.setAttribute("type", "button")
//         btnDelete.setAttribute("data-bs-toggle", "modal");
//         btnDelete.setAttribute("data-bs-target", "#modalDelete")
//         btnDelete.setAttribute("class", "btn btn-danger")
//         btnDelete.setAttribute("data-id", title + description)
//         btnDelete.appendChild(document.createTextNode("Delete"))

//         btnEdit.setAttribute("type", "button")
//         btnEdit.setAttribute("data-bs-toggle", "modal");
//         btnEdit.setAttribute("data-bs-target", "#modalEdit")
//         btnEdit.setAttribute("data-title", title)
//         btnEdit.setAttribute("data-description", description)
//         btnEdit.setAttribute("class", "btn btn-primary")
//         btnEdit.setAttribute("data-id", "edit-" + title + description)
//         btnEdit.appendChild(document.createTextNode("Edit"))

//         btnDone.setAttribute("type", "button")
//         btnDone.setAttribute("data-bs-toggle", "modal");
//         btnDone.setAttribute("data-bs-target", "#modalDone")
//         btnDone.setAttribute("class", "btn btn-success")
//         btnDone.setAttribute("data-id", "done-" + title + description)
//         btnDone.appendChild(document.createTextNode("Done"))

//         btnWrapper.appendChild(btnEdit)
//         btnWrapper.appendChild(btnDelete)
//         btnWrapper.appendChild(btnDone)

//         card.appendChild(article)
//         card.appendChild(btnWrapper)

//         todo.appendChild(card)

//         const task = {
//             id : title + description,
//             title : title,
//             desc : description,
//         }

//         const data = JSON.parse(localStorage.getItem("data"))
//         data.push(task)

//         localStorage.setItem("data", JSON.stringify(data))

//         const modalAdd = bootstrap.Modal.getInstance('#modalAdd')
//         modalAdd.hide()

//         addForm.reset();
//     }
//     else{
//         const toastAdd = document.getElementById("liveToastAdd");
//         const toast = new bootstrap.Toast(toastAdd)
//         toast.show();
//     }
// })

// //Fungsi Edit
// const modalEdit = document.getElementById("modalEdit")
// modalEdit.addEventListener("show.bs.modal", (event) =>{
//     // get form element
//     const data = JSON.parse(localStorage.getItem("data"))

//     let oldTitle = document.getElementById("judulEdit")
//     let oldDesc = document.getElementById("descEdit")

//     //assign old value to form
//     oldTitle.value = event.relatedTarget.attributes["data-title"].value;
//     oldDesc.value = event.relatedTarget.attributes["data-description"].value

//     idButton = event.relatedTarget.id

//     let sameTask = data.filter((task) => task.title == oldTitle.value)
//     let diffTask = data.filter((task) => task.title != oldTitle.value)

//     const editForm = document.getElementById("form-edit")
//     editForm.addEventListener('submit', (event) =>{
//         event.preventDefault()

        
//         const newTitle = document.getElementById("judulEdit").value
//         const newDesc = document.getElementById("descEdit").value

//         if (newTitle && newDesc != ""){
//             //save ke local
//             document.getElementById(sameTask[0].id).firstChild.firstChild.innerHTML = newTitle
//             document.getElementById(sameTask[0].id).firstChild.firstChild.nextSibling.innerHTML = newDesc
//             document.getElementById(sameTask[0].id).setAttribute("id", newTitle + newDesc)
//             // bug apabila bila json tidak ke load
//             // document.getElementById(oldTitle.id).nextSibling.nextSibling.setAttribute("data-id", newTitle + newDesc)
//             // document.getElementById(oldTitle.id).nextSibling.nextSibling.nextSibling.setAttribute("data-id", "id" + newTitle)
//             // document.getElementById(oldTitle.id).nextSibling.nextSibling.nextSibling.setAttribute("data-description", "id" + newTitle)

//             const newTask = {
//                 id: newTitle + newDesc,
//                 title: newTitle,
//                 desc: newDesc
//             }

//             diffTask.push(newTask)
//             localStorage.setItem("data", JSON.stringify(diffTask)) 

//             window.location.reload()
//             buttonNow = document.getElementById(idButton)
//             console.log(buttonNow)
//             buttonNow.setAttribute("data-title", newTitle)
//             buttonNow.setAttribute("data-description", newDesc)

//             const modalEdit = bootstrap.Modal.getInstance("#modalEdit")
//             modalEdit.hide()
//             modalEdit.reset();
//         } else {
//             const toastEdit = document.getElementById("liveToastEdit");
//             const toast = new bootstrap.Toast(toastEdit)
//             toast.show();
//         }
//     })
// })

// const modalDelete = document.getElementById("modalDelete")
// modalDelete.addEventListener('show.bs.modal', (event) => {
//     const dataId = event.relatedTarget.attributes["data-id"]
//     const data = JSON.parse(localStorage.getItem("data"))
//     const diffTask = data.filter((task) => task.id != dataId.value)
//     const deleteForm = document.getElementById("formDelete")
//     deleteForm.addEventListener("submit", (event) => {
//         event.preventDefault()
//         console.log(dataId.value)
//         document.getElementById(dataId.value).classList.add("d-none")
//         localStorage.setItem("data",JSON.stringify(diffTask))

//         const myModalDelete = bootstrap.Modal.getInstance("#modalDelete")
//         myModalDelete.hide()
//     })
// })



function showRealTimeClock(){
    const footerTime = document.getElementById("footer-time")
    const time = new Date()
    footerTime.innerHTML = time.toLocaleTimeString([],{
        hour12: false
    });
}

setInterval(showRealTimeClock, 1000)