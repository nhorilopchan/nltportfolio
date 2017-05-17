/* CTA Scripts
 */
if(document.querySelectorAll('.cta-block').length) {

    //On button click - fetch and display a Joke
    const fetchButton = document.getElementById('fetchBtn');
    const jokeContainer = document.getElementById('joke');
    fetchButton.addEventListener('click', event => {
        event.preventDefault();
        fetchmeajoke();
    });

    function fetchmeajoke() {

        const request = new XMLHttpRequest();
        request.open('GET', '//api.icndb.com/jokes/random?escape=javascript', true);

        request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
                const {response} = request;
                jokeContainer.innerText = JSON.parse(response).value.joke;
            } else {
                console.err('Error retrieving data');
            }
        };
        request.onerror = function () {
            console.err('Error reaching server');
        };
        request.send();
    }
}