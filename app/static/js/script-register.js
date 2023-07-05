const formRegistration = document.getElementById("form-registration")
const API_HOST = 'http://127.0.0.1:5000/api'

formRegistration.addEventListener('submit', (e) =>{
    e.preventDefault();
    
    const xhr = new XMLHttpRequest();
    const url = API_HOST + "/auth/register"

    const name = document.getElementById("nama-lengkap").value
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const confirmPassword = document.getElementById("confirm-password").value

    //call login api
    const toastTrigger = document.getElementById("liveToast");
    const toastMsg = document.getElementById("toast-body");
    
    if(!name || !email || !password || !confirmPassword){
        toastMsg.innerHTML = "Form harus diisi semua"
        const toast = new bootstrap.Toast(toastTrigger)
        return toast.show()
    }
    if(password != confirmPassword){
        toastMsg.innerHTML = "password yang dimasukkan tidak cocok"
        return toast.show()
    }

    const data = JSON.stringify({
        name: name,
        email: email,
        password: password,
    })

    xhr.open('POST', url, true)
    xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8')
    xhr.onreadystatechange = function(){
        if(this.status == 200){
            toastMsg.innerHTML = "User Registration Success"
            const toast = new bootstrap.Toast(toastTrigger)
            toast.show()

            window.location.href = "http://127.0.0.1:5000/auth/login"
        }
        else{
            toastMsg.innerHTML = this.response
            toast.show()
        }
    }
    xhr.send(data)
})






















// //prevent form submit
// formRegistration.addEventListener("submit", function(event){
//     event.preventDefault();
// })

// //memanggil toast
// const toastTrigger = document.getElementById("btn-reg");
// const toastLiveExample = document.getElementById("liveToast");

// if(toastTrigger){
//     toastTrigger.addEventListener("click", () =>{

//     let nama = document.getElementById("nama-lengkap").value;
//     let email = document.getElementById("email").value;
//     let password = document.getElementById("password").value;
//     let confirm_password = document.getElementById("confirm-password").value;

//     if(email && nama && password && confirm_password) {
//         window.location.href = "todo.html"
//         } else {
//         const toast = new bootstrap.Toast(toastLiveExample)
//         toast.show();
//         }  
//     });
// }