Jag fick detta problem som jag var tvungen att lösa:

Access to XMLHttpRequest at 'http://localhost:5000/api/auth/login' from origin 'https://boply.onrender.com' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.Understand this error
index-BUNoIxIu.js:56 Login Failed: Server error
index-BUNoIxIu.js:53

(anonymous) @ index-BUNoIxIu.js:53
xhr @ index-BUNoIxIu.js:53
Gh @ index-BUNoIxIu.js:55
\_request @ index-BUNoIxIu.js:56
request @ index-BUNoIxIu.js:55
(anonymous) @ index-BUNoIxIu.js:56
(anonymous) @ index-BUNoIxIu.js:51
v @ index-BUNoIxIu.js:56
Bd @ index-BUNoIxIu.js:48
(anonymous) @ index-BUNoIxIu.js:48
Pf @ index-BUNoIxIu.js:48
Ur @ index-BUNoIxIu.js:48
Kr @ index-BUNoIxIu.js:49
I0 @ index-BUNoIxIu.js:49Understand this error
index-BUNoIxIu.js:53 XHR failed loading: POST "http://localhost:5000/api/auth/login".

Efter en diskussion med chatGPT så hittade jag denna kodsnutt i LoginForm.tsx:

const response = await axios.post(
'http://localhost:5000/api/auth/login',
{
email,
password
}
);

Vilken skapade problem då Render inte kan ansluta till localhost för att hantera backend. Den behöver ansluta till sin egen skapade backendadress för att fungera.
Då jag hårdkodat adressen så blev det logiskt sätt CORS error.

Jag bytte ut localhost till en VITE_BACKEND_URL vilket gjorde att jag kunde hämta adressen via en miljövariabel vilket på så sätt gjorde att jag kunde hämta adressen dynamiskt och ha en adress lokalt och en adress på Render.

const response = await axios.post(
`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
{
email,
password
}
);
