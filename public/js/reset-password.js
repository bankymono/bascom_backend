const handleSubmit = (e) =>{
    // e.preventDefault()
    console.log(e)

    const resetToken = document.querySelector('#resetToken').value
    const newPassword = document.querySelector('#newPassword').value
    const confirmPassword = document.querySelector('#confirmPassword').value

    if( newPassword !== confirmPassword){
        alert("passwords do not match")
    }else{
        fetch('http://localhost:5000/setNewPassword', {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({resetToken,newPassword}),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
}