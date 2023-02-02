
function getData(url, token, method, route) {
    return fetch(url + "?" + new URLSearchParams({
        route: route,
        token: token,
        method: method
    }), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
        .then((response) => response.json())
};

function getEventData(url, token, order_status_id, event_type) {
    return fetch(url + "?" + new URLSearchParams({
        route: "sigmamsg/sending_by_events",
        token: token,
        method: "get_event_data",
        order_status_id: order_status_id,
        event_type: event_type
    }), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
        .then((response) => response.json())
};

function push_data(url, token, body, method) {
    return fetch(url + "?" + new URLSearchParams({
        route: 'sigmamsg/sending_by_events',
        token: token,
        method: method
    }), {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then((response) => response.json())
};

async function check_img(id){
    return fetch(url + "?" + new URLSearchParams({
        route: "sigmamsg/sending_by_events",
        token: token,
        method: "check_img",
        id: id
    }), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
        .then((response) => response.json())
}

async function refresh_image(url, token ,id, order_id, event_type, isfallbacks){
    return fetch(url + "?" + new URLSearchParams({
        route: 'sigmamsg/sending_by_events',
        token: token,
        method: "refresh_image"
    }), {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id: id, order_id: order_id, event_type: event_type, isfallbacks: isfallbacks})
    })
        .then((response) => response.json())
}