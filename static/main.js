const userForm = document.querySelector('#userForm');

let users = [];
let editing = false;
let userId = null;
window.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/api/users');
    const data = await response.json();
    users = data;
    renderUser(users);
});
userForm.addEventListener('submit', async e => {
    e.preventDefault();

    const username = userForm['username'].value;
    const password = userForm['password'].value;
    const email = userForm['email'].value;

    if (!editing){
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password,
                email
            }),
        });
        const data = await response.json();
        users.unshift(data);
    } else {
        const response = await fetch(`/api/users/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password,
                email
            }),
        });
        const updatedUser = await response.json();
        users = users.map(user => user.id === updatedUser.id ? updatedUser : user);
        renderUser(users);
        editing = false;
        userId = null;
    }

    renderUser(users);

    userForm.reset();
});

function renderUser(users) {
    const userList = document.querySelector('#userList');
    userList.innerHTML = '';

    users.forEach(user => {
        ;
        const userItem = document.createElement('li');
        userItem.className = 'list-group-item list-group-item-primary my-2';
        userItem.innerHTML = `
        <header class = "d-flex justify-content-between align-items-center">
            <h3>${user.username}</h3>
            <button class="btn-delete btn btn-danger btn-sm">delete</button>
            <button class= "btn-edit btn btn-secondary btn-sm">edit</button>
        </header>
        <p>${user.email}</p>
        <p class = "text-truncate">${user.password}</p>
        `;
        const btnDelete = userItem.querySelector('.btn-delete')
        btnDelete.addEventListener('click', async ()=>{
            const response = await fetch(`/api/users/${user.id}`,{
                method : 'DELETE'
            })
            const data = await response.json();
            
            users = users.filter(user => user.id !== data.id);
            renderUser(users);
        })

        const btnEdit = userItem.querySelector('.btn-edit')

        btnEdit.addEventListener("click",async (e) =>{

            const response = await fetch(`/api/users/${user.id}`);
            const data = await response.json();
            
            userForm["username"].value = data.username;
            userForm["email"].value = data.email;

            editing = true;
            userId = data.id;

        });

        
        userList.append(userItem);
    });


}


