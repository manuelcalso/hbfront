const apiUrl = 'https://hbserver-1cxh.onrender.com/api'; // Ajusta esto según la URL de tu servidor

//crear contacto
document.getElementById('add-contact-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    //propiedades necesarias
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    try {
        //ruta de endpoint crear contacto
        const response = await fetch(`${apiUrl}/contacts/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstname: firstName, lastname: lastName, email, phone })
        });
        const result = await response.json();
        //console.log("result front", result);
        //condicional de respuesta ok
        if (response.ok) {
            // Extrae solo los campos específicos
            const { firstname, lastname, email, phone } = result.properties;

            // lista HTML con los detalles del contacto
            const contactDetails = `
                <li><strong>First Name:</strong> ${firstname}</li>
                <li><strong>Last Name:</strong> ${lastname}</li>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Phone:</strong> ${phone}</li>
            `;
            //muestra resultado
            document.getElementById('contact-list').innerHTML = `
                <h3>Contact added successfully:</h3>
                <ul>${contactDetails}</ul>
            `;
        } else {
            //mensaje de error
            document.getElementById('contact-list').innerHTML = `Error: ${result.error || 'Unknown error'}`;
        }
    } catch (error) {
        console.error('Error adding contact:', error);
        document.getElementById('contact-list').innerHTML = `Error adding contact: ${error.message}`;
    }
});

//buscar contacto por email
document.getElementById('search-contact').addEventListener('click', async () => {
    const email = document.getElementById('search-email').value;

    try {
        //ruta de endpoint buscar
        const response = await fetch(`${apiUrl}/contact/${encodeURIComponent(email)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        //condicional respuesta ok 
        if (response.ok) {
            const result = await response.json();
            //console.log("result", result.properties)
            document.getElementById('search-result').innerHTML = `
                <p><strong>First Name:</strong> ${result.properties.firstname}</p>
                <p><strong>Last Name:</strong> ${result.properties.lastname}</p>
                <p><strong>Email:</strong> ${result.properties.email}</p>
                <p><strong>Phone:</strong> ${result.properties.phone}</p>
            `;
        } else {
            const result = await response.json();
            document.getElementById('search-result').innerHTML = `Error: ${result.error || 'Unknown error'}`;
        }
    } catch (error) {
        console.error('Error searching contact:', error);
        document.getElementById('search-result').innerHTML = `Error searching contact: ${error.message}`;
    }
});



//borrar contacto
document.getElementById('delete-contact').addEventListener('click', async () => {
    const email = document.getElementById('delete-email').value;
    try {
        const response = await fetch(`${apiUrl}/delete/${encodeURIComponent(email)}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        //condicional respuesta ok
        if (response.ok) {
            alert('Contact deleted successfully');
        } else {
            alert(`Error: ${result.error || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Error deleting contact:', error);
        alert('Error deleting contact');
    }
});

//traer todos los contactos
document.getElementById('fetch-contacts').addEventListener('click', async () => {
    try {
        const response = await fetch(`${apiUrl}/contacts`, {
            method: 'GET'
        });

        // Verifica si la respuesta fue exitosa
        if (!response.ok) {
            throw new Error('Failed to fetch contacts');
        }

        const contacts = await response.json();
        const contactList = document.getElementById('contact-list-full');
        contactList.innerHTML = ''; // Limpiar la lista antes de agregar otros contactos

        // Ordenar los contactos por `createdate` en orden descendente
        contacts.sort((a, b) => new Date(b.properties?.createdate) - new Date(a.properties?.createdate));

        // Verifica si se recibieron contactos
        if (contacts.length > 0) {
            contacts.forEach(contact => {
                const properties = contact || {}; // Si `properties` es undefined, asigna un objeto vacío
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <p><strong>First Name:</strong> ${properties.firstname || 'N/A'}</p>
                    <p><strong>Last Name:</strong> ${properties.lastname || 'N/A'}</p>
                    <p><strong>Email:</strong> ${properties.email || 'N/A'}</p>
                    <p><strong>Phone:</strong> ${properties.phone || 'N/A'}</p>
                `;
                contactList.appendChild(listItem);
            });
        } else {
            contactList.innerHTML = '<li>No contacts found</li>';
        }
    } catch (error) {
        console.error('Error fetching contacts:', error);
        alert('Error fetching contacts');
    }
});


//actualizar datos de contacto
document.getElementById('update-contact').addEventListener('click', async () => {

    const email = document.getElementById('update-email').value;
    const firstname = document.getElementById('update-firstname').value;
    const lastname = document.getElementById('update-lastname').value;
    const phone = document.getElementById('update-phone').value;

    // Crear un objeto con los datos a actualizar
    const updateData = {};
    if (firstname) updateData.firstname = firstname;
    if (lastname) updateData.lastname = lastname;
    if (phone) updateData.phone = phone;

    try {
        const response = await fetch(`${apiUrl}/contacts/email/${email}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });

        if (!response.ok) {
            throw new Error('Failed to update contact');
        }

        const updatedContact = await response.json();

        // Mostrar los datos actualizados en la interfaz
        document.getElementById('update-contact').innerHTML = `
            <p><strong>Updated Contact</strong></p>
            <p><strong>First Name:</strong> ${updatedContact.properties.firstname || 'N/A'}</p>
            <p><strong>Last Name:</strong> ${updatedContact.properties.lastname || 'N/A'}</p>
            <p><strong>Email:</strong> ${updatedContact.properties.email || 'N/A'}</p>
            <p><strong>Phone:</strong> ${updatedContact.properties.phone || 'N/A'}</p>
        `;
    } catch (error) {
        console.error('Error updating contact:', error);
        alert('Error updating contact');
    }
});





