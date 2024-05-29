document.addEventListener('DOMContentLoaded', () => {
    const credentialInfoElement = document.getElementById('credential-info');
    const deleteButton = document.getElementById('delete-credential');

    // Retrieve the stored credential from localStorage
    const storedCredential = JSON.parse(localStorage.getItem('webauthn-credential'));

    if (storedCredential) {
        const publicKey = JSON.stringify(storedCredential.rawId);
        credentialInfoElement.textContent = `Public Key: ${publicKey}`;
    } else {
        credentialInfoElement.textContent = 'No credential stored.';
    }

    deleteButton.addEventListener('click', () => {
        localStorage.removeItem('webauthn-credential');
        alert('Credential deleted.');
        window.location.href = 'index.html';
    });
});
