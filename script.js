document.addEventListener('DOMContentLoaded', () => {
    const messageElement = document.getElementById('message');
    const actionButton = document.getElementById('webauthn-action');

    // Check for stored credentials in localStorage
    const storedCredential = localStorage.getItem('webauthn-credential');

    if (storedCredential) {
        messageElement.textContent = 'Please verify your passkey.';
        actionButton.textContent = 'Verify';
        actionButton.onclick = verify;
    } else {
        messageElement.textContent = 'No credentials registered. Please register a new passkey.';
        actionButton.textContent = 'Register';
        actionButton.onclick = register;
    }
});

async function register() {
    try {
        const publicKey = {
            challenge: new Uint8Array(26), // Ideally, this should come from the server
            rp: { name: "Example" },
            user: {
                id: new Uint8Array(16), // This should be a unique ID from your server
                name: "user@example.com",
                displayName: "User Example"
            },
            pubKeyCredParams: [{ alg: -7, type: "public-key" }],
            authenticatorSelection: {
                authenticatorAttachment: "cross-platform", // Use platform authenticator
                requireResidentKey: false,
                userVerification: "preferred"
            },
            attestation: "direct"
        };

        const credential = await navigator.credentials.create({ publicKey });

        // Save credential to localStorage
        localStorage.setItem('webauthn-credential', JSON.stringify({
            id: credential.id,
            rawId: Array.from(new Uint8Array(credential.rawId)),
            type: credential.type,
            response: {
                clientDataJSON: Array.from(new Uint8Array(credential.response.clientDataJSON)),
                attestationObject: Array.from(new Uint8Array(credential.response.attestationObject))
            }
        }));

        alert('Registration successful!');
        window.location.reload();
    } catch (error) {
        console.error('Error during registration:', error);
        alert('Registration failed. Please try again.');
    }
}

async function verify() {
    try {
        const storedCredential = JSON.parse(localStorage.getItem('webauthn-credential'));
        if (!storedCredential) {
            alert('No registered credentials found.');
            return;
        }

        const publicKey = {
            challenge: new Uint8Array(26), // Ideally, this should come from the server
            allowCredentials: [{
                id: new Uint8Array(storedCredential.rawId),
                type: 'public-key',
                //transports: ['internal'] // Ensure platform authenticator is used
            }],
            userVerification: "preferred"
        };

        const assertion = await navigator.credentials.get({ publicKey });

        // For the sake of this example, we assume verification is always successful
        if (assertion) {
            alert('Verification successful!');
            window.location.href = 'index2.html';
        } else {
            alert('Verification failed.');
        }
    } catch (error) {
        console.error('Error during verification:', error);
        alert('Verification failed. Please try again.');
    }
}
