function send_fetch_template(event, fetchUrl, smethod, handleSuccess, handleError) {
    event.preventDefault(); 

    let form = event.target;
    let formData = new FormData(form);

    fetch(fetchUrl, {
        method: smethod,
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            handleSuccess(data);
        } else {
            handleError(data);
        }
    })
    .catch(error => {
        console.log('Event error.');
    });
}

function send_fetch_event(event, fetchUrl, redirect_url, smethod = 'POST') {
    send_fetch_template(event, fetchUrl, smethod, data => {
        if(redirect_url == "RP") {
            setTimeout('location.reload();', 500);
        } else if((redirect_url != "#") && (redirect_url != "NR")) {
            window.location.href = redirect_url;
        }
        console.log(data.message);
    }, data => {
        console.log(data.message);
        for (let key in data.errors) {
            console.log(data.errors[key]);
        }
    });
}

function get_sguard(event, fetchUrl, redirect_url, smethod = 'POST') {
    send_fetch_template(event, fetchUrl, smethod, data => {
        if(redirect_url == "RP") {
            setTimeout('location.reload();', 500);
        } else if((redirect_url != "#") && (redirect_url != "NR")) {
            window.location.href = redirect_url;
        }
        document.getElementById('guard_code').style="display: block;";
        document.getElementById('guard_data').innerHTML = data.code;
        document.getElementById('guard_data_btn').setAttribute('onclick', 'copyToClipboard("' + data.code + '")');
        document.getElementById('guard_date').innerHTML = data.date;
        console.log(data.message);
    }, data => {
        console.log(data.message);
        for (let key in data.errors) {
            console.log(data.errors[key]);
        }
    });
}

function send_fetch(fetchUrl, smethod) {
    fetch(fetchUrl, {
        method: smethod
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log(data);
        } else {
            console.log(data);
        }
    })
    .catch(error => {
        console.log('Send error.');
    });
}