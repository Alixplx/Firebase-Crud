import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove, set } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js"

const firebaseConfig = {

    databaseURL: "https://crud-web-app-150c2-default-rtdb.firebaseio.com",
}

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

const usersListinDB = ref(database, "users")

const userIdElement = document.querySelector("#user_id")
const nameElement = document.querySelector("#user_name")
const phoneElement = document.querySelector("#user_phone")
const emailElement = document.querySelector("#user_email")
const addUserElement = document.querySelector("#add_user")
const form = document.querySelector("#user_form")
const tableBodyElement = document.querySelector("#tblBody")

form.addEventListener('submit', function(e) {

    e.preventDefault()

    if (!nameElement.value.trim() || !phoneElement.value.trim() || !emailElement.value.trim()) {

        alert("Please Fill All Fields")
        return
    }

    if (userIdElement.value) {

        set(ref(database, "users/" + userIdElement.value), {
            
            name: nameElement.value.trim(),
            phone: phoneElement.value.trim(),
            email: emailElement.value.trim(),
        })

        addUserElement.value = "Submit"
        clearFields()
        return   
    }

    const newUser = {

        name: nameElement.value.trim(),
        phone: phoneElement.value.trim(),
        email: emailElement.value.trim(),
    }

    push(usersListinDB, newUser)
    clearFields()
})

function clearFields() {

    nameElement.value = ""
    phoneElement.value = ""
    emailElement.value = ""
    userIdElement.value = ""
}

onValue(usersListinDB, function(snapShot) {

    if (snapShot.exists()) {

        let userArray = Object.entries(snapShot.val())

        tableBodyElement.innerHTML = ""

        for(let i = 0; i < userArray.length; i++) {

            let currentUser = userArray[i]
            
            let currentUserId = currentUser[0]
            let currentUserValue = currentUser[1]

            tableBodyElement.innerHTML += `

                 <tr>

                    <td colspan="2">${i + 1}</td>
                    <td colspan="2">${currentUserValue.name}</td>
                    <td colspan="2">${currentUserValue.phone}</td>
                    <td colspan="2">${currentUserValue.email}</td>
                    <td colspan="2">

                        <button class="edit-btn" data-id=${currentUserId}>Edit</button>
                        <button class="delete-btn" data-id=${currentUserId}>Delete</button>
                    </td>
                </tr>
            `
        }

    } else {

        tableBodyElement.innerHTML = `

            <tr>

                <td colspan="10">No Record Found</td>
            </tr>
        `
    }

})

document.addEventListener('click', function(e) {

    if (e.target.classList.contains('edit-btn')) {

        const id = e.target.dataset.id
        const tdElement = e.target.closest('tr').children
        userIdElement.value = id
        nameElement.value = tdElement[1].textContent
        phoneElement.value = tdElement[2].textContent
        emailElement.value = tdElement[3].textContent
        addUserElement.value = "Update"

    } else if (e.target.classList.contains('delete-btn')) {

        if(confirm('Are You Sure To Delete This Item?')) {

            const id = e.target.dataset.id
            let data = ref(database, `users/${id}`)
            remove(data)
        }
    }
})